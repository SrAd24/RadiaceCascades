/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 06.06.2025
 */

/** IMPORTS */
import { core } from "./core/core";
import { resources } from "./res-types";
import { material_pattern } from "./res/material_patterns";
import { buffer } from "../res/buffers.ts";
import { vertex } from "../res/vertex.ts";
import * as mth from "../../math/mth.ts";
import { compute } from "../res/compute.ts";
import { texture } from "../res/texture.ts";

/** triangle verteces */
const vertices: vertex[] = [
  {
    position: new mth.vec4(0.0, 0.6, 1, 1),
    color: new mth.vec4(1, 0, 0, 1),
  },
  {
    position: new mth.vec4(-0.5, -0.6, 0, 1),
    color: new mth.vec4(0, 1, 0, 1),
  },
  {
    position: new mth.vec4(0.5, -0.6, 0, 1),
    color: new mth.vec4(0, 0, 1, 1),
  },
];

/** Render class */
class render extends core implements resources {
  private commandEncoder: any;
  private passEncoder: any;
  private pipelines: material_pattern;
  private depthTexture: any;
  private depthTextureView: any;
  private vertexBuffer: any;

  private vertices = new Float32Array([
    0.0,
    0.5,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1,
    0,
    0,
    1.0, // Верхняя вершина (красная)
    -0.5,
    -0.5,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0,
    1,
    0,
    1.0, // Левая нижняя (зелёная)
    0.5,
    -0.5,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0,
    0,
    1,
    1.0, // Правая нижняя (синяя)
  ]);

  public constructor() {
    super();
    this.pipelines = new material_pattern(this);
  }

  public async createShaders(shdName: string): Promise<any> {
    return await this.pipelines.createMaterialPattern(shdName);
  }

  /** #public parameters */
  /**
   * @info Returning device function
   * @returns device
   */
  public getDevice(): any {
    return this.device;
  } /** End of 'getDevice' function */

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialization(canvas: Element) {
    await this.webGPUInit(canvas);

    const depthTextureDesc: GPUTextureDescriptor = {
      size: [this.context.canvas.width, this.context.canvas.height],
      arrayLayerCount: 1,
      mipLevelCount: 1,
      sampleCount: 1,
      dimension: "2d",
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    };

    this.depthTexture = await this.device.createTexture(depthTextureDesc);
    this.depthTextureView = await this.depthTexture.createView();

    /** Create compute data */
    const size = 512;

    const diagonal: number = Math.sqrt(2) * size;
    const interval0: number = 10;
    const factor: number = Math.ceil(
      Math.log(diagonal / interval0) / Math.log(4),
    );
    const intervalStart: number =
      (interval0 * (1 - Math.pow(4, factor))) / (1 - 4);
    // const cascadeNumber: number = 7;
    const cascadeNumber: number =
      Math.ceil(Math.log(intervalStart) / Math.log(4)) - 1;
    console.log("Cascade number:" + cascadeNumber);

    let baseColorTexture: texture = new texture();
    baseColorTexture.createTexture(
      this.core.device,
      size,
      size,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      1,
      "2d",
    );
    let distanceTexture: texture = new texture();
    distanceTexture.createTexture(
      this.core.device,
      size,
      size,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      1,
      "2d",
    );
    let resultColorTexture: texture = new texture();
    resultColorTexture.createTexture(
      this.core.device,
      size,
      size,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      cascadeNumber + 1,
      "2d-array",
    );

    let probeCount: number = 2 * 16 * Math.pow(2, cascadeNumber - 1);
    let temporaryTexture: texture = new texture();
    temporaryTexture.createTexture(
      this.core.device,
      probeCount,
      probeCount,
      "r32float",
      GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      1,
      "2d",
    );

    const computeBindGroupLayout = this.core.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d",
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
            viewDimension: "2d",
          },
        },
      ],
    });

    let computeBuffer: buffer = new buffer();
    computeBuffer.createUniformBuffer(this.core.device, 16);

    await this.core.device.queue.writeBuffer(
      computeBuffer.gpuBuffer,
      0,
      new Float32Array([cascadeNumber - 1, size, 0, 0]),
    );

    const computeBindGroup = this.core.device.createBindGroup({
      layout: computeBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: baseColorTexture.gpuTextureView,
        },
        {
          binding: 1,
          resource: distanceTexture.gpuTextureView,
        },
        {
          binding: 2,
          resource: resultColorTexture.gpuTextureView,
        },
        {
          binding: 3,
          resource: {
            buffer: computeBuffer.gpuBuffer,
          },
        },
        {
          binding: 4,
          resource: temporaryTexture.gpuTextureView,
        },
      ],
    });

    let computeObject: compute = new compute();
    computeObject.createComputePipeline(
      this.core.device,
      this.core.computeShader,
      computeBindGroupLayout,
      computeBindGroup,
    );

    let mergeComputeObject: compute = new compute();
    mergeComputeObject.createComputePipeline(
      this.core.device,
      this.core.mergeComputeShader,
      computeBindGroupLayout,
      computeBindGroup,
    );

    let inputComputeObject: compute = new compute();
    inputComputeObject.createComputePipeline(
      this.core.device,
      this.core.inputComputeShader,
      computeBindGroupLayout,
      computeBindGroup,
    );

    const start = new Date();

    inputComputeObject.dispatch(this.core.device, 16, 16);
    for (let i: number = 0; i < cascadeNumber; i++) {
      await this.core.device.queue.writeBuffer(
        computeBuffer.gpuBuffer,
        0,
        new Float32Array([cascadeNumber - 1, size, i, 0]),
      );
      computeObject.dispatch(this.core.device, 16, 16);
    }
    for (let i: number = cascadeNumber - 1; i >= -2; i--) {
      await this.core.device.queue.writeBuffer(
        computeBuffer.gpuBuffer,
        0,
        new Float32Array([cascadeNumber - 1, size, i, 0]),
      );

      mergeComputeObject.dispatch(this.core.device, 16, 16);
    }

    const end = new Date();

    console.log("Time:" + (end.getTime() - start.getTime()));

    console.log("Render initialization completed successfully!");
  } /** End of 'initialization' function */

  public async draw(pip: any) {
    await this.passEncoder.setPipeline(pip.pipeline);
    await this.passEncoder.setVertexBuffer(0, this.vertexBuffer);
    await this.passEncoder.draw(3);
  }

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
    v1 = m.TransformPoint(v1);
    v2 = m.TransformPoint(v2);
    v3 = m.TransformPoint(v3);
    (this.vertices[0] = v1.x),
      (this.vertices[1] = v1.y),
      (this.vertices[2] = v1.z);
    (this.vertices[12] = v2.x),
      (this.vertices[13] = v2.y),
      (this.vertices[14] = v2.z);
    (this.vertices[24] = v3.x),
      (this.vertices[25] = v3.y),
      (this.vertices[26] = v3.z);

    // Копируем данные в буфер

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
