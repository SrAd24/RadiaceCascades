/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 19.06.2025
 */

/** IMPORTS */
import { core } from "./core/core";
import { group, group_manager } from "./res/groups/groups";
import { compute_manager, compute } from "./res/compute/compute";
import { material_pattern_manager } from "./res/mtl_ptn/material_patterns";
import { material_manager } from "./res/materials/materials";
import { buffer, buffer_manager } from "./res/buffers/buffers";
import { texture, texture_manager } from "./res/textures/textures";
import { primitive, primitive_manager } from "./res/primitives/primitives";
import { model, model_manager } from "./res/models/models";

/** DIContainer class */
class DIContainer {
  static currentRender: render;
} /** End of 'DIContainer' class */

interface drawingPrim {
  prim: primitive;
  index: number;
}

/** Render class */
class render extends core {
  /** #private parameters */
  // Render parameters
  public commandEncoder!: GPUCommandEncoder; // Command encoder
  private passEncoder!: GPURenderPassEncoder; // Pass encoder
  private depthTexture!: texture; // Depth texture 
  private msaaTexture!: texture; // Msaa texture for rendering

  // Defferd rendering parameters
  // Compute pass 
  private matrixComputePipeline!: compute; // Compute pipeline 
  private computeGroup!: group; // Compute group
  private computeMatrixBuffer!: buffer; // Primitive buffer with matrix
  private evaluatedMatrixBuffer!: buffer; // Primitive buffer with matrix

  // Main opaque pass
  private primsToDraw!: drawingPrim[]; // Primitves to draw
  private matrixToDraw!: Float32Array; // Matrix to draw data
  private matrixDataLength: number = 0; // Actual data length
  private nextPrimIndex: number = 0; // Global next prim index
  private matrixBuffer!: buffer; // Primitive buffer with matrix
  private cameraBuffer!: buffer; // Camera buffer
  private syncBuffer!: buffer; // Sync buffer
  private cameraData!: Float32Array; // Cached camera data

  // Additional rendering parameters 
  private samplerGroup!: group; // Sampler group

  /** #public parameters */
  public mtlLayout!: GPUBindGroupLayout; // Layout for materials
  public globalGroup!: group; // Global bind group with matrices, camera 
  public cam: camera = new camera(0, 0); // Render camera

  /**
   * @info Render constructor
   * @returns none
   */
  public constructor() {
    /* Call parent constructor */
    super();
    /* Set current render instance in DI container */
    DIContainer.currentRender = this;

    /* Define resource manager prototypes for method injection */
    const resources = [
      group_manager.prototype,
      material_pattern_manager.prototype,
      buffer_manager.prototype,
      primitive_manager.prototype,
      texture_manager.prototype,
      model_manager.prototype,
      material_manager.prototype,
      compute_manager.prototype
    ];
    
    /* Extract all 'create' methods from resource managers */
    const methodNames = resources.map((proto) =>
        Object.getOwnPropertyNames(proto).filter((name) =>
            name.startsWith("create") && typeof (proto as any)[name] === "function")).reduce((acc, methods) => acc.concat(methods), []);
    
    /* Bind resource manager methods to render instance */
    for (const methodName of methodNames) {
      for (const proto of resources) {
        if ((proto as any)[methodName]) {
          (this as any)[methodName] = (proto as any)[methodName].bind(this);
          break;
        }
      }
    }
  } /** End of 'constructor' function */
  
  /**
   * @info Initialize render function
   * @returns none
  */
  public async initialization(canvas: Element) {
    /** Cast canvas element to HTML canvas type */
    const htmlCanvas = canvas as HTMLCanvasElement;
     
    /** Initialize WebGPU context and device */
    await this.webGPUInit(canvas);

    /** Create rendering textures */
    // Configure depth texture for 3D rendering
    this.depthTexture = await this.createTexture({
      size: {width: this.context.canvas.width, height: this.context.canvas.height},
      format: this.defDepthTextureFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: 4 /* 4x MSAA */,
    });

    // Create MSAA texture for anti-aliasing
    this.msaaTexture = await this.createTexture({
      size: {width: this.context.canvas.width, height: this.context.canvas.height},
      format: this.defSwapchainTextureFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: 4 /* 4x MSAA */,
    });

    /** Setup camera */
    this.cam = new camera(htmlCanvas.width, htmlCanvas.height);
    this.cam.set(new vec3(5), new vec3(0));

    this.cameraBuffer = await this.createBuffer({
      size: 64 + 64 + 64 + 16 * 5,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      type: "uniform",
    });
         
    /** Create compute */ 
    // Create compute buffers
    this.computeMatrixBuffer = await this.createBuffer({
      size: 4, 
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      type: "read-only-storage",
    });
    
    this.evaluatedMatrixBuffer = await this.createBuffer({
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      type: "storage",
    });
  
    // Create compute group
    this.computeGroup = await this.createBindGroup({
      groupIndex: 0,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE, 
          buffer: this.computeMatrixBuffer,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: this.evaluatedMatrixBuffer,
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: this.cameraBuffer,
        },
      ],
    });

    // Create compute pipeline
    this.matrixComputePipeline = await this.createCompute({
      shaderName: 'compute/matrix',
      bindGroups: [[this.computeGroup]],
    });

    /** Setup main opaque pass */
    // Setup arrays
    this.primsToDraw = [];
    this.matrixToDraw = new Float32Array(0);

    // Create matrix primitive buffer
    this.matrixBuffer = await this.createBuffer({
      size: 4, 
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      type: "read-only-storage",
    });

    this.syncBuffer = await this.createBuffer({
      size: 16 + 16, 
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      type: "uniform",
    });

    // Create global bind group
    this.globalGroup = await this.createBindGroup({
      groupIndex: 0,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX, 
          buffer: this.matrixBuffer,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: this.cameraBuffer,
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: this.syncBuffer,
        },
      ],
    });

    // Create devault mtlLayout
    this.mtlLayout = this.device.createBindGroupLayout({
      entries: [
        {
          // Albedo
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'unfilterable-float' }
        },
        {
          // Roughness
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'unfilterable-float' }
        },
        {
          // Metallic
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'unfilterable-float' }
        },
        {
          // Normal map
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'unfilterable-float' }
        },
        {
          // Emsission
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'unfilterable-float' }
        },
      ],
    });

    /** Create sampler group */
    this.samplerGroup = await this.createBindGroup({
      groupIndex: 2,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          sampler: {
            sampler: this.device.createSampler({
              magFilter: 'nearest',
              minFilter: 'nearest',
              mipmapFilter: 'nearest',
              addressModeU: 'repeat',
              addressModeV: 'repeat',
              addressModeW: 'repeat',
              lodMinClamp: 0,
              lodMaxClamp: 32,
            }),
            type: 'non-filtering',
          },
        },
      ],
    });

    this.nextPrimIndex = 0;
    /** Initialize global timer system */
    timer.initTimer();
    
    console.log("Render initialization completed successfully!");
  } /** End of 'initialization' function */

  /**
   * @info Draw primitive function
   * @param prim: primitive
   * @param world: world matrix
   * @returns none
   */
  private drawLow(drawPrim: drawingPrim) {
    /* Get primitive and index */
    const prim = drawPrim.prim;
    const index = drawPrim.index;
    
    /* Material apply */
    prim.mtl.set(this.passEncoder);
    prim.mtl.apply(this.passEncoder);

    /* Bind vertex buffer to pipeline */
    this.passEncoder.setVertexBuffer(0, prim.vBuf.buffer);

    /* Draw using indices if available, otherwise draw vertices directly */
    if (prim.numOfI > 0) {
      /* Set index buffer and draw indexed */
      this.passEncoder.setIndexBuffer(prim.iBuf.buffer, "uint32");
      this.passEncoder.drawIndexed(prim.numOfI, prim.instanceCount, 0, 0, index);
    } 
    else this.passEncoder.draw(prim.numOfV, prim.instanceCount, 0, index);
    drawPrim.prim.instanceMatrices = [];
  } /** End of 'draw' function */

  private renderPrims() {
    for (let i = 0; i < this.primsToDraw.length; i++) {
      this.drawLow(this.primsToDraw[i]);
    }
  }

  /**
   * @info Draw primitive function
   * @param prim: primitive
   * @param world: world matrix
   * @returns none
   */
  public draw(prim: primitive, world: typeof mat4 = mat4.identity()) {
    if (prim.instanceCount == 1)
    {
      this.primsToDraw.push({
        prim: prim,
        index: this.nextPrimIndex++,
      });

      let w: mat4;
      if (prim.isTransformChanged == true)
        w = prim.transform.mul(world), prim.isTransformChanged = false;
      else
        w = world;

      const matrixData = w.m.flat();
      const newSize = this.matrixDataLength + matrixData.length;

      if (this.matrixToDraw.length < newSize) {
        const expandedSize = newSize;
        const newArray = new Float32Array(expandedSize);
        newArray.set(this.matrixToDraw.subarray(0, this.matrixDataLength));
        this.matrixToDraw = newArray;
      }
      
      this.matrixToDraw.set(matrixData, this.matrixDataLength);
      this.matrixDataLength = newSize;
    }
    else {
      this.primsToDraw.push({
        prim: prim,
        index: this.nextPrimIndex,
      });
      this.nextPrimIndex += prim.instanceCount;

      const newSize = this.matrixDataLength + prim.instanceCount * 16;

      if (this.matrixToDraw.length < newSize) {
        const expandedSize = newSize;
        const newArray = new Float32Array(expandedSize);
        newArray.set(this.matrixToDraw.subarray(0, this.matrixDataLength));
        this.matrixToDraw = newArray;
      }
      
      let offset = this.matrixDataLength;
      for (let i = 0; i < prim.instanceMatrices.length; i++) {
        this.matrixToDraw.set(prim.instanceMatrices[i].m.flat(), offset);
        offset += 16;
      }
      this.matrixDataLength = newSize;
    }
  } /** End of 'draw' function */
  /**
   * @info Start render pass function
   * @returns none
  */
  public async renderStart(): Promise<any> {
   /* Configure render pass with MSAA and depth testing */
   const renderPassDescriptor: GPURenderPassDescriptor = {
     colorAttachments: [
       {
         view: this.msaaTexture.view, /* Render to MSAA texture */
         resolveTarget: this.context.getCurrentTexture().createView(), /* Resolve to canvas */
         clearValue: [0.0, 0.0, 0.0, 1.0], /* Clear to black */
         loadOp: "clear",
         storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: this.depthTexture.view,
        depthClearValue: 1, /* Clear depth to far plane */
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

   /* Update camera buffer efficiently */
    if (input.isChanged) {
      if (!this.cameraData) this.cameraData = new Float32Array(64 + 64 + 64 + 16 * 5);
      
      let offset = 0;
      this.cameraData.set(this.cam.view.m.flat(), offset); offset += 16;
      this.cameraData.set(this.cam.proj.m.flat(), offset); offset += 16;
      this.cameraData.set(this.cam.vp.m.flat(), offset); offset += 16;
      this.cameraData.set([this.cam.loc.x, this.cam.loc.y, this.cam.loc.z, this.cam.frameW], offset); offset += 4;
      this.cameraData.set([this.cam.at.x, this.cam.at.y, this.cam.at.z, this.cam.frameH], offset); offset += 4;
      this.cameraData.set([this.cam.dir.x, this.cam.dir.y, this.cam.dir.z, this.cam.projDist], offset); offset += 4;
      this.cameraData.set([this.cam.right.x, this.cam.right.y, this.cam.right.z, this.cam.wp], offset); offset += 4;
      this.cameraData.set([this.cam.up.x, this.cam.up.y, this.cam.up.z, this.cam.hp], offset);
      
      await this.cameraBuffer.update(this.cameraData);
      input.isChanged = false;                 // Reset change flag
    }
    /* Create command encoder for this frame */
    this.commandEncoder = this.device.createCommandEncoder();

    await this.computeMatrixBuffer.update(this.matrixToDraw.subarray(0, this.matrixDataLength));
    await this.evaluatedMatrixBuffer.resize(this.matrixToDraw.byteLength * 3);
    if (this.matrixToDraw.length != 0) {
      this.matrixComputePipeline.begin(this.commandEncoder);   
      this.computeGroup.update();
      this.matrixComputePipeline.dispatch(this.matrixToDraw.length / 16, 1, [0]);
      this.matrixComputePipeline.end();
    }
    await this.matrixBuffer.copy(this.commandEncoder, this.evaluatedMatrixBuffer)
    
    /* Begin render pass with configured descriptor */
    this.passEncoder = this.commandEncoder.beginRenderPass(renderPassDescriptor);
    this.passEncoder.setBindGroup(2, this.samplerGroup.bindGroup);
  } /** End of 'renderStart' function */
  
  /**
   * @info End render pass function
   * @returns   
   */
  public async renderEnd() {
    /* Reset matrix data for next frame */
    this.matrixDataLength = 0;
    
    this.globalGroup.update();
    this.passEncoder.setBindGroup(0, this.globalGroup.bindGroup);
    
    this.renderPrims();
    this.primsToDraw = [];
    
    /* End current render pass */
    this.passEncoder.end();
    
    /* Submit command buffer to GPU queue */
    this.queue.submit([this.commandEncoder.finish()]);
  } /** End of 'renderEnd' function */

  /**
   * @info Draw model function
   * @param prim: model
   * @param world: world matrix
   * @returns none
   */
  public async drawModel(prim: model, world: typeof mat4 = mat4.identity()) {
    /* Iterate through all primitives in model */
    for (let i = 0; i < prim.prims.length; i++)
      this.draw(prim.prims[i], world);
  } /** End of 'drawModel' function */

  /**
   * @info Main frame rendering function
   * @returns none
   */
  public async frameRendering() {
    await this.renderStart();
    await this.renderEnd();
    this.nextPrimIndex = 0;
  } /** End of 'frameRendering' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };
export { DIContainer };

/** END OF 'render.ts' FILE */
