/* FILE NAME   : uni_radiance_cascades.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";


/** Unit control class */
class _uni_radiance_cascades extends unit {
  /** Textures */
  private baseColorTexture: any; // Base color texture
  private distanceTexture: any; // Distance texture
  private resultColorTexture: any; // Result color textures
  private intermediateTexture: any; // Intermediate texture

  /** Buffers */
  private computeIndicesBuffer: any[] = []; // Buffers with dispatch index
  private computeBuffer: any; // Buffer with base data
  private triangleBuffer: any; // Buffer with triangle data

  /** Radiance cascades constants */
  private frameSize: number = 512; // Frame size
  private intervalStart: number = 1; // Start interval
  private cascadesNumber: number = 8; // Cascade number

  /** Binding group */
  private computeBindGroup: any; // Base binding group
  private computeIndicesBindGroup: any[] = []; // Binding group with indices data

  /** Compute objects */
  private inputCompute: any;  // Input compute objects
  private rayMarchingCompute: any; // Ray marching compute objects
  private mergeCompute: any; // Merge compute objects

  private isFirst: boolean = true; // Flag is first frame
  
  private params = {
    brushColor: { r: 255, g: 0, b: 0 },
    brushSize: 10
  };

  /** Primitive data */
  private primTopology: any; // Topology of full screen primitive 
  private primBindGroup: any; // Binding group of full screen primitive
  private primPipeline: any; // Pipeline of full screen primitive
  private primMaterial: any; // Material of full screen primitive
  private fullScreenPrim: any; // Full screen primitive

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {
    this.baseColorTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: 4,
        viewDimension: '2d-array',
        access: 'read-write',
    });
    this.distanceTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: 4,
        viewDimension: '2d-array',
        access: 'read-write',
    });
    this.resultColorTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: 4 * (this.cascadesNumber + 1),
        viewDimension: '2d-array',
        access: 'read-write',
    });
    let probeCount: number = 2 * Math.pow(2, this.cascadesNumber - 1);
    this.intermediateTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
        size: { width: probeCount, height: probeCount },
        layerCount: 3,
        viewDimension: '2d-array',
        access: 'read-write',
    });

    /** Buffers creation */
    for (let i: number = 0; i < this.cascadesNumber + 2; i++) {
      this.computeIndicesBuffer[i] = await ani.createBuffer({
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        size: 16,
        type: "uniform",
      });
      if (i < this.cascadesNumber)
        this.computeIndicesBuffer[i].update(new Float32Array([i, 0, 0, 0]));
      else
        this.computeIndicesBuffer[i].update(
          new Float32Array([i - this.cascadesNumber - 2, 0, 0, 0]),
        );
    }
   this.computeBuffer = await ani.createBuffer({
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      size: 64,
      type: "uniform",
    });
    this.triangleBuffer = await ani.createBuffer({
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      size: 16,
      type: "storage"
    });
    this.triangleBuffer.update(new Float32Array([0, 1, 0, 0]));

    /** Binding group layout creation */
    let computeBindGroupLayout = ani.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform",
          },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
      ],
    });

    let computeIndicesBindGroupLayout = ani.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform",
          },
        },
      ],
    });

    this.computeBindGroup = await ani.createBindGroup({
      groupIndex: 0,
      layout: computeBindGroupLayout,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.baseColorTexture,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.distanceTexture,
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.resultColorTexture,
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: this.computeBuffer,
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.intermediateTexture,
        },
      ],
    });

    for (let i: number = 0; i < this.cascadesNumber + 2; i++) {
      this.computeIndicesBindGroup[i] = await ani.createBindGroup({
        groupIndex: 1,
        layout: computeIndicesBindGroupLayout,
        bindings: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: this.computeIndicesBuffer[i],
          },
        ],
      });
    }
    this.inputCompute = await ani.createCompute({
      shaderName: "radiance_cascades/input",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.rayMarchingCompute = await ani.createCompute({
      shaderName: "radiance_cascades/ray_marching",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.mergeCompute = await ani.createCompute({
      shaderName: "radiance_cascades/merge",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });

    let verteces: (typeof std)[] = [
      new std(new vec3(-1, -1, 0), new vec2(0, 0)),
      new std(new vec3(-1, 1, 0), new vec2(0, 1)),
      new std(new vec3(1, -1, 0), new vec2(1, 0)),
      new std(new vec3(1, 1, 0), new vec2(1, 1)),
    ];
    let inds: number[] = [0, 1, 2, 1, 2, 3];

    this.primTopology = new topology(verteces, inds);

    this.primBindGroup = await ani.createBindGroup({
      groupIndex: 3,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.baseColorTexture,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.distanceTexture
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: this.triangleBuffer
        }
      ],
    });

    this.primPipeline = await ani.createMaterialPattern({
      shaderName: "texture",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
      bindings: this.primBindGroup,
    });

    this.primMaterial = await ani.createMaterial({
      material_pattern: this.primPipeline,
    });

    this.fullScreenPrim = await ani.createPrimitive({
      material: this.primMaterial,
      topology: this.primTopology,
    });

  } /** End of 'init' function */


  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    if (!this.distanceTexture || !this.computeBuffer || !this.inputCompute || 
        !this.rayMarchingCompute || !this.mergeCompute) {
      return;
    }
    
    let canvasID = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );

    let commandEncoder = ani.device.createCommandEncoder();
    
    if (this.isFirst) {
      const distanceData = new Float32Array(
        this.frameSize * this.frameSize * 4 * 3,
      ).fill(2048);

      ani.device.queue.writeTexture(
        { texture: this.distanceTexture.texture },
        distanceData,
        { bytesPerRow: this.frameSize * 4, rowsPerImage: this.frameSize },
        {
          width: this.frameSize,
          height: this.frameSize,
          depthOrArrayLayers: 3,
        },
      );
      this.isFirst = false;
    }

    const rect = canvasID?.getBoundingClientRect();
    const mousePosX: number = (input.mouseX - rect!.left) / 1024;
    const mousePosY: number = (800 - (input.mouseY - rect!.top)) / 800;

    this.computeBuffer.update(
      new Float32Array([
        this.cascadesNumber - 1, this.frameSize, this.intervalStart, 0,
        Number(input.leftClick), mousePosX, mousePosY, 0,
        this.params.brushColor.r / 255, this.params.brushColor.g / 255, this.params.brushColor.b / 255, this.params.brushSize,
        1, 0, 0, 0,
      ]),
    );

    this.inputCompute.begin(commandEncoder);
    this.inputCompute.dispatch(
      this.frameSize,
      this.frameSize,
      [0, 1],
    );
    this.inputCompute.end();

    this.rayMarchingCompute.begin(commandEncoder);
    for (let i: number = 0; i < this.cascadesNumber; i++)
      this.rayMarchingCompute.dispatch(this.frameSize, this.frameSize, [0, i]);
    this.rayMarchingCompute.end();

    this.mergeCompute.begin(commandEncoder);
    for (let i: number = this.cascadesNumber - 2; i >= 0; i--)
      this.mergeCompute.dispatch(this.frameSize, this.frameSize, [
        0,
        i,
      ]);

    this.mergeCompute.dispatch(
      2 * Math.pow(2, this.cascadesNumber - 1),
      2 * Math.pow(2, this.cascadesNumber - 1),
      [0, this.cascadesNumber + 1],
    );
    this.mergeCompute.dispatch(
      2 * Math.pow(2, this.cascadesNumber - 1),
      2 * Math.pow(2, this.cascadesNumber - 1),
      [0, this.cascadesNumber],
    );
    this.mergeCompute.end();

    ani.queue.submit([commandEncoder.finish()]);
    await ani.queue.onSubmittedWorkDone();
  } /** End of 'responce' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    if (this.fullScreenPrim)
      ani.draw(this.fullScreenPrim);
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {
    // Destroy textures
    if (this.baseColorTexture) {
      this.baseColorTexture.destroy();
      this.baseColorTexture = null;
    }
    if (this.distanceTexture) {
      this.distanceTexture.destroy();
      this.distanceTexture = null;
    }
    if (this.resultColorTexture) {
      this.resultColorTexture.destroy();
      this.resultColorTexture = null;
    }
    if (this.intermediateTexture) {
      this.intermediateTexture.destroy();
      this.intermediateTexture = null;
    }
    
    // Destroy buffers
    this.computeIndicesBuffer.forEach(buffer => {
      if (buffer) buffer.destroy();
    });
    this.computeIndicesBuffer = [];
    
    if (this.computeBuffer) {
      this.computeBuffer.destroy();
      this.computeBuffer = null;
    }
    if (this.triangleBuffer) {
      this.triangleBuffer.destroy();
      this.triangleBuffer = null;
    }
    
    // Destroy primitives
    if (this.fullScreenPrim) {
      this.fullScreenPrim.destroy();
      this.fullScreenPrim = null;
    }
    

    
    // Reset all properties
    this.computeBindGroup = null;
    this.computeIndicesBindGroup = [];
    this.inputCompute = null;
    this.rayMarchingCompute = null;
    this.mergeCompute = null;
    this.primTopology = null;
    this.primBindGroup = null;
    this.primPipeline = null;
    this.primMaterial = null;
    this.isFirst = true;
  } /** End of 'destroy' function */
} /** End of '_uni_radiance_cascades' class */

const uni_radiance_cascades: _uni_radiance_cascades = new _uni_radiance_cascades();

/** EXPORTS */
export { uni_radiance_cascades };

/** END OF 'uni_radiance_cascades.ts' FILE */
