/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { core } from "./core/core";
import { resources } from "./res-types";
import { material_pattern } from "./res/material_patterns";
import * as mth from "../../math/mth";

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
