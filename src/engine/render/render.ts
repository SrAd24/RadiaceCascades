/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** IMPORTS */
import { core } from "./core/core";
import { resources } from "./res-types";
import { group } from "./res/group";
import { material_pattern } from "./res/material_patterns";
import { buffer } from "./res/buffers";

import * as mth from "../../math/mth";
import { primitive } from "./res/primitives";

import { compute } from "./res/compute";
import { texture } from "./res/texture";
import { input } from "../input/input";

/** Render class */
class render extends core implements resources {
  /** Private parameters */
  private commandEncoder: any;
  private passEncoder: any;
  private material_patterns: material_pattern;
  private buffers: buffer;
  private mBuf: any;
  private depthTexture: any;
  private depthTextureView: any;

  private vertexBuffer: any;

  /** Compute shader */
  private computeShader: GPUShaderModule; // Ray marching compute shader
  private mergeComputeShader: GPUShaderModule; // Merge compute shader
  private inputComputeShader: GPUShaderModule; // Input compute shader

  /** Compute objects */
  private computeObject: compute; // Ray marching compute object
  private mergeComputeObject: compute; // Merge compute object
  private inputComputeObject: compute; // Input compute object

  /** Compute buffers */
  private computeBuffer: buffer; // Base compute buffer
  private computeIndicesBuffer: buffer[] = []; // Compute indices buffer

  /** Compute textures */
  private baseColorTexture: texture; // Base color texture
  private distanceTexture: texture; // Distance texture
  private resultColorTexture: texture; // Result color textures
  private intermediateTexture: texture; // Intermediate texture

  /** Compute binding group layout and binding group */
  private computeBindGroupLayout: GPUBindingGroupLayout; // Base compute binding group layout
  private computeBindGroup: GPUBindingGroup; // Base compute binding group
  private computeIndicesBindGroupLayout: GPUBindingGroupLayout; // Compute indices binding group layout
  private computeIndicesBindGroup: GPUBindingGroup[] = []; // Compute indices binding group

  /** Compute data */
  private cascadeNumber: number = 0; // Number of cascades
  private frameSize: number = 512; // Frame size
  private intervalStart: number = 10; // Start interval
  private isFirst: boolean = true; // Is first click flag
  private color: mth.vec3 = new mth.vec3(0); // Color of brush
  private brushSize: number = 7; // Brush size

  /** Vertices of full screen primitive */
  private vertices = new Float32Array([
    -1,
    -1,
    0, // position
    0,
    0, // textCoords
    0,
    0,
    0, // normal
    1,
    0,
    0,
    1, // color

    -1,
    1,
    0, // position
    0,
    1, // textCoords
    0,
    0,
    0, // normal
    0,
    1,
    0,
    1, // color

    1,
    -1,
    0, // position
    1,
    0, // textCoords
    0,
    0,
    0, // normal
    0,
    0,
    1,
    1, // color

    -1,
    1,
    0, // position
    0,
    1, // textCoords
    0,
    0,
    0, // normal
    0,
    1,
    0,
    1, // color

    1,
    -1,
    0, // position
    1,
    0, // textCoords
    0,
    0,
    0, // normal
    0,
    0,
    1,
    1, // color

    1,
    1,
    0, // position
    1,
    1, // textCoords
    0,
    0,
    0, // normal
    1,
    0,
    0,
    1, // color
  ]);

  public async createShaders(shdName: string): Promise<any> {
    return await this.material_patterns.createMaterialPattern(shdName);
  }

  private gr: any = new group();
  private gr1: any;
  private primitives: primitive;
  private cam: mth.camera = new mth.camera(0, 0);

  /** #public parameters */
  /**
   * @info Returning device function
   * @returns device
   */
  public getRender(): any {
    return this;
  } /** End of 'getDevice' function */

  public constructor() {
    super();
    //    this.pipelines = new material_pattern(this);
    this.material_patterns = new material_pattern(this);
    this.buffers = new buffer(this);
    this.primitives = new primitive(this);
  }

  public async createPrimitive(
    mtl_ptn: material_pattern,
    vData: Float32Array,
    iData: Float32Array = new Float32Array(),
  ): Promise<any> {
    return await this.primitives.createPrimitive(mtl_ptn, vData, iData);
  }

  public async draw(prim: primitive, world: mth.mat4 = mth.mat4.identity()) {
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "read-only-storage",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d",
          },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
      ],
    });

    // this.gr1 = await this.gr.createBindGroup(
    //   this.device,
    //   0,
    //   // prim.mtl_ptn.pipeline.getBindGroupLayout(0),
    //   bindGroupLayout,
    //   "read-only-storage",
    //   this.mBuf.buf,
    // );

    const canvasID = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );
    const rect = canvasID?.getBoundingClientRect();
    const mousePosX: number = input.mouseX - rect.left;
    const mousePosY: number = this.frameSize - (input.mouseY - rect.top);

    const colorPicker = document.getElementById("colorPicker");
    colorPicker?.addEventListener("input", (event) => {
      this.color = new mth.vec3(
        16 * parseInt(event.target?.value[1], 16) +
          parseInt(event.target?.value[2], 16),
        16 * parseInt(event.target?.value[3], 16) +
          parseInt(event.target?.value[4], 16),
        16 * parseInt(event.target?.value[5], 16) +
          parseInt(event.target?.value[6], 16),
      ).div(256);
    });

    const rangeBrushSize = document.getElementById("brushSize");
    rangeBrushSize?.addEventListener("input", (event) => {
      this.brushSize = Number(event.target?.value);
    });

    this.computeBuffer.updateBuffer(
      new Float32Array([
        this.cascadeNumber - 1,
        this.frameSize,
        this.intervalStart,
        0,
        Number(input.isCLick),
        mousePosX,
        mousePosY,
        Number(this.isFirst),
        this.color.x,
        this.color.y,
        this.color.z,
        this.brushSize,
      ]),
    );

    if (
      mousePosX > 0 &&
      mousePosX < this.frameSize &&
      mousePosY > 0 &&
      mousePosY < this.frameSize &&
      input.isCLick
    ) {
      this.isFirst = false;
      this.inputComputeObject.dispatch(
        this.device,
        512,
        512,
        this.computeIndicesBindGroup[1],
      );

      for (let i: number = 0; i < this.cascadeNumber; i++)
        this.computeObject.dispatch(
          this.device,
          512,
          512,
          this.computeIndicesBindGroup[i],
        );

      for (let i: number = this.cascadeNumber - 2; i >= 0; i--)
        this.mergeComputeObject.dispatch(
          this.device,
          512,
          512,
          this.computeIndicesBindGroup[i],
        );

      this.mergeComputeObject.dispatch(
        this.device,
        2 * Math.pow(2, this.cascadeNumber - 1),
        2 * Math.pow(2, this.cascadeNumber - 1),
        this.computeIndicesBindGroup[this.cascadeNumber + 1],
      );

      this.mergeComputeObject.dispatch(
        this.device,
        512,
        512,
        this.computeIndicesBindGroup[this.cascadeNumber],
      );
    }

    let bindGroup: GPUBindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.mBuf.buf,
            size: 128,
          },
        },
        {
          binding: 1,
          resource: this.resultColorTexture.gpuTextureView,
        },
        {
          binding: 2,
          resource: this.baseColorTexture.gpuTextureView,
        },
        {
          binding: 3,
          resource: this.distanceTexture.gpuTextureView,
        },
        {
          binding: 4,
          resource: this.intermediateTexture.gpuTextureView,
        },
      ],
    });

    await this.passEncoder.setPipeline(prim.mtl_ptn.pipeline);
    await this.passEncoder.setVertexBuffer(0, prim.vBuf.buf);
    // await this.passEncoder.setBindGroup(0, this.gr1);
    await this.passEncoder.setBindGroup(0, bindGroup);
    let M = new Float32Array(
      this.cam.vp.m.flat().concat(mth.mat4.rotateY(0).m.flat()),
    );
    await this.mBuf.updateBuffer(M);
    if (prim.numOfI > 0) {
      await this.passEncoder.setIndexBuffer(prim.iBuf.buf, "uint32");
      await this.passEncoder.drawIndexed(prim.numOfI, 1, 0, 0, 0);
    } else await this.passEncoder.draw(3);
  }

  // public async draw(pip: any) {
  //   await this.passEncoder.setPipeline(pip.pipeline);
  //   await this.passEncoder.setVertexBuffer(0, this.vertexBuffer);
  //   await this.passEncoder.draw(6);
  // }
  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialization(canvas: Element) {
    const c = canvas as HTMLCanvasElement;
    await this.webGPUInit(canvas);

    this.cam = new mth.camera(c.width, c.height);
    this.cam.set(new mth.vec3(0, 0, 3), new mth.vec3(0, 0, 0));

    const depthTextureDesc: GPUTextureDescriptor = {
      size: [this.context.canvas.width, this.context.canvas.height],
      mipLevelCount: 1,
      sampleCount: 1,
      dimension: "2d",
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    };

    this.depthTexture = await this.device.createTexture(depthTextureDesc);
    this.depthTextureView = await this.depthTexture.createView();

    this.mBuf = await this.buffers.createBuffer(GPUBufferUsage.STORAGE, 128);
    console.log(this.mBuf);

    /** Create compute data */
    this.frameSize = 512;

    // /const diagonal: number = Math.sqrt(2) * this.frameSize;
    // const interval0: number = 100;
    // const factor: number = Math.floor(
    //  Math.log(diagonal / interval0) / Math.log(4),
    // );
    this.intervalStart = 1;
    // (interval0 * (1 - Math.pow(4, factor))) / (1 - 4);
    this.cascadeNumber = 8;
    // this.cascadeNumber = Math.ceil(Math.log(intervalStart) / Math.log(4)) - 1;
    console.log("Interval start:" + this.intervalStart);
    console.log("Cascade number:" + this.cascadeNumber);

    /** Shader creation */
    const response1 = await fetch(
      "src/engine/render/res/shds/ray_marching/ray_marching.wgsl",
    );
    const shaderData1 = await response1.text();
    console.log(shaderData1.toString());
    this.computeShader = await this.device.createShaderModule({
      code: shaderData1.toString(),
    });
    const response2 = await fetch(
      "src/engine/render/res/shds/merge/merge.wgsl",
    );
    const shaderData2 = await response2.text();
    console.log(shaderData2.toString());
    this.mergeComputeShader = await this.device.createShaderModule({
      code: shaderData2.toString(),
    });
    const response3 = await fetch(
      "src/engine/render/res/shds/input/input.wgsl",
    );
    const shaderData3 = await response3.text();
    console.log(shaderData3.toString());
    this.inputComputeShader = await this.device.createShaderModule({
      code: shaderData3.toString(),
    });

    /** Texture creation */
    this.baseColorTexture = new texture();
    this.baseColorTexture.createTexture(
      this.device,
      this.frameSize,
      this.frameSize,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      3,
      "2d-array",
    );
    this.distanceTexture = new texture();
    this.distanceTexture.createTexture(
      this.device,
      this.frameSize,
      this.frameSize,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      1,
      "2d",
    );

    this.resultColorTexture = new texture();
    this.resultColorTexture.createTexture(
      this.device,
      this.frameSize,
      this.frameSize,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      4 * (this.cascadeNumber + 1),
      "2d-array",
    );

    let probeCount: number = 2 * Math.pow(2, this.cascadeNumber - 1);
    this.intermediateTexture = new texture();
    this.intermediateTexture.createTexture(
      this.device,
      probeCount,
      probeCount,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      3,
      "2d-array",
    );

    /** Buffers creation */
    for (let i: number = 0; i < this.cascadeNumber + 2; i++) {
      this.computeIndicesBuffer[i] = await this.buffers.createBuffer(
        GPUBufferUsage.UNIFORM,
        16,
      );
      if (i < this.cascadeNumber)
        this.computeIndicesBuffer[i].updateBuffer(
          new Float32Array([i, 0, 0, 0]),
        );
      else
        this.computeIndicesBuffer[i].updateBuffer(
          new Float32Array([i - this.cascadeNumber - 2, 0, 0, 0]),
        );
    }

    this.computeBuffer = await this.buffers.createBuffer(
      GPUBufferUsage.UNIFORM,
      64,
    );
    this.computeBuffer.updateBuffer(
      new Float32Array([
        this.cascadeNumber - 1,
        this.frameSize,
        this.intervalStart,
        0,
      ]),
    );

    /** Binding group layout creation */
    this.computeBindGroupLayout = this.device.createBindGroupLayout({
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
            viewDimension: "2d",
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

    this.computeIndicesBindGroupLayout = this.device.createBindGroupLayout({
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

    /** Binding group creation */
    for (let i: number = 0; i < this.cascadeNumber + 2; i++) {
      this.computeIndicesBindGroup[i] = this.device.createBindGroup({
        layout: this.computeIndicesBindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: {
              buffer: this.computeIndicesBuffer[i].buf,
            },
          },
        ],
      });
    }

    this.computeBindGroup = this.device.createBindGroup({
      layout: this.computeBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: this.baseColorTexture.gpuTextureView,
        },
        {
          binding: 1,
          resource: this.distanceTexture.gpuTextureView,
        },
        {
          binding: 2,
          resource: this.resultColorTexture.gpuTextureView,
        },
        {
          binding: 3,
          resource: {
            buffer: this.computeBuffer.buf,
          },
        },
        {
          binding: 4,
          resource: this.intermediateTexture.gpuTextureView,
        },
      ],
    });

    /** Compute object creation */
    this.computeObject = new compute();
    this.computeObject.createComputePipeline(
      this.device,
      this.computeShader,
      [this.computeBindGroupLayout, this.computeIndicesBindGroupLayout],
      [this.computeBindGroup],
    );

    this.mergeComputeObject = new compute();
    this.mergeComputeObject.createComputePipeline(
      this.device,
      this.mergeComputeShader,
      [this.computeBindGroupLayout, this.computeIndicesBindGroupLayout],
      [this.computeBindGroup],
    );

    this.inputComputeObject = new compute();
    this.inputComputeObject.createComputePipeline(
      this.device,
      this.inputComputeShader,
      [this.computeBindGroupLayout, this.computeIndicesBindGroupLayout],
      [this.computeBindGroup],
    );

    console.log("Render initialization completed successfully!");
  } /** End of 'initialization' function */

  /**
   * @info Render function
   * @returns none
   */
  public async renderStart(): Promise<any> {
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: [0.0, 1.0, 0.0, 1.0],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: this.depthTextureView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    this.commandEncoder = await this.device.createCommandEncoder();

    this.passEncoder =
      this.commandEncoder.beginRenderPass(renderPassDescriptor);

    let m: any = mth.mat4.rotateX(this.time / 100);
    let v1: mth.vec3 = new mth.vec3(
      this.vertices[0],
      this.vertices[1],
      this.vertices[2],
    );
    let v2: mth.vec3 = new mth.vec3(
      this.vertices[12],
      this.vertices[13],
      this.vertices[14],
    );
    let v3: mth.vec3 = new mth.vec3(
      this.vertices[24],
      this.vertices[25],
      this.vertices[26],
    );
    /*
    v1 = m.TransformPoint(v1);
    v2 = m.TransformPoint(v2);
    v3 = m.TransformPoint(v3);
    (this.vertices[0] = v1.x), (this.vertices[1] = v1.y), (this.vertices[2] = v1.z);
    (this.vertices[12] = v2.x), (this.vertices[13] = v2.y), (this.vertices[14] = v2.z);
    (this.vertices[24] = v3.x), (this.vertices[25] = v3.y), (this.vertices[26] = v3.z);
    */

    this.vertexBuffer = this.device.createBuffer({
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertices);
    this.vertexBuffer.unmap(); // Разблокируем буфер
  } /** End of 'renderStart' function */

  /**
   * @info Render function
   * @returns none
   */
  public async renderEnd(): Promise<any> {
    this.passEncoder.end();

    await this.queue.submit([this.commandEncoder.finish()]);
  } /** End of 'render' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'render.ts' FILE */
