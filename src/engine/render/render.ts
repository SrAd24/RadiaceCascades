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
import { group } from "./res/group";
import { material_pattern } from "./res/material_patterns";
import { buffer } from "./res/buffers";
import { vertex } from "./res/vertex";
import * as mth from "../../math/mth";
import { primitive } from "./res/primitives";
import { timer } from "../input/timer";

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
  private material_patterns: material_pattern;
  private buffers: buffer;
  private mBuf: any;
  private depthTexture: any;
  private msaaTexture: any;
  private depthTextureView: any;
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
    this.material_patterns = new material_pattern(this);
    this.buffers = new buffer(this);
    this.primitives = new primitive(this);
  }

  public async createShaders(shdName: string): Promise<any> {
    return await this.material_patterns.createMaterialPattern(shdName);
  }

  public async createPrimitive(
    mtl_ptn: material_pattern,
    vData: Float32Array,
    iData: Float32Array = new Float32Array(),
  ): Promise<any> {
    return await this.primitives.createPrimitive(mtl_ptn, vData, iData);
  }

  public async draw(prim: primitive, world: mth.mat4 = mth.mat4.identity()) {
    this.gr1 = await this.gr.createBindGroup(
      this.device,
      0,
      prim.mtl_ptn.pipeline.getBindGroupLayout(0),
      "read-only-storage",
      this.mBuf.buf,
    );
    await this.passEncoder.setPipeline(prim.mtl_ptn.pipeline);
    await this.passEncoder.setVertexBuffer(0, prim.vBuf.buf);

    await this.passEncoder.setBindGroup(0, this.gr1);

    let M = new Float32Array(
      this.cam.vp.m.flat().concat(mth.mat4.rotateY(timer.time * 45).m.flat()),
    );
    await this.mBuf.updateBuffer(M);

    if (prim.numOfI > 0) {
      await this.passEncoder.setIndexBuffer(prim.iBuf.buf, "uint32");

      await this.passEncoder.drawIndexed(prim.numOfI, 1, 0, 0, 0);
    } else await this.passEncoder.draw(prim.numOfV / 12);
  }

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialization(canvas: Element) {
    // Создаем мультисэмпловую текстуру
    const c = canvas as HTMLCanvasElement;
    await this.webGPUInit(canvas);

    this.cam = new mth.camera(c.width, c.height);
    this.cam.set(new mth.vec3(0, 8, 30), new mth.vec3(0, 5, 0));

    const depthTextureDesc: GPUTextureDescriptor = {
      size: [this.context.canvas.width, this.context.canvas.height],
      mipLevelCount: 1,
      sampleCount: 4,
      dimension: "2d",
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    };

    this.msaaTexture = this.device.createTexture({
      size: [this.context.canvas.width, this.context.canvas.height],
      sampleCount: 4,
      format: navigator.gpu.getPreferredCanvasFormat(),
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.depthTexture = await this.device.createTexture(depthTextureDesc);
    this.depthTextureView = await this.depthTexture.createView();

    this.mBuf = await this.buffers.createBuffer(GPUBufferUsage.STORAGE, 128);

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
          view: this.msaaTexture.createView(),
          resolveTarget: this.context.getCurrentTexture().createView(),
          clearValue: [0.0, 0.0, 0.0, 1.0],
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
