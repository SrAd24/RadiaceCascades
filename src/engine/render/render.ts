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
import { group, group_manager } from "./res/groups/groups";
import { material_pattern_manager } from "./res/mtl_ptn/material_patterns";
import { buffer_manager } from "./res/buffers/buffers";
import { texture_manager } from "./res/textures/textures";
import { primitive, primitive_manager } from "./res/primitives/primitives";
import { model, model_manager } from "./res/models/models";

/** DIContainer class */
class DIContainer {
  static currentRender: render;
} /** End of 'DIContainer' class */

/** Render class */
class render extends core {
  private commandEncoder!: GPUCommandEncoder;
  private passEncoder: any;
  private mBuf: any;
  private depthTexture: any;
  private msaaTexture: any;
  private msaaTextureView: any;
  private depthTextureView: any;
  public globalGroup!: group;
  public cam: typeof camera = new camera(0, 0);

  public constructor() {
    super();
    DIContainer.currentRender = this;

    const resources = [
      group_manager.prototype,
      material_pattern_manager.prototype,
      buffer_manager.prototype,
      primitive_manager.prototype,
      texture_manager.prototype,
      model_manager.prototype,
    ];

    const methodNames = resources
      .map((proto) =>
        Object.getOwnPropertyNames(proto).filter(
          (name) =>
            name.startsWith("create") &&
            typeof (proto as any)[name] === "function",
        ),
      )
      .reduce((acc, methods) => acc.concat(methods), []);
    for (const methodName of methodNames) {
      for (const proto of resources) {
        if ((proto as any)[methodName]) {
          (this as any)[methodName] = (proto as any)[methodName].bind(this);
          break;
        }
      }
    }
  }

  public async draw(prim: primitive, world: typeof mat4 = mat4.identity()) {
    await this.passEncoder.setPipeline(prim.mtl_ptn.pipeline);
    await this.passEncoder.setVertexBuffer(0, prim.vBuf.buffer);
    await this.passEncoder.setBindGroup(0, this.globalGroup.bindGroup);
    if (prim.mtl_ptn.group)
      await this.passEncoder.setBindGroup(1, prim.mtl_ptn.group.bindGroup);

    let M = new Float32Array(this.cam.vp.m.flat().concat(world.m.flat()));
    await this.mBuf.update(M);

    if (prim.numOfI > 0) {
      await this.passEncoder.setIndexBuffer(prim.iBuf.buffer, "uint32");
      await this.passEncoder.drawIndexed(prim.numOfI, 1, 0, 0, 0);
    } else await this.passEncoder.draw(prim.numOfV);
  }

  public async drawModel(prim: model, world: typeof mat4 = mat4.identity()) {
    for (let i = 0; i < prim.prims.length; i++)
      await this.draw(prim.prims[i], world);
  }

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialization(canvas: Element) {
    const c = canvas as HTMLCanvasElement;
    await this.webGPUInit(canvas);
    this.cam = new camera(c.width, c.height);
    this.cam.set(new vec3(5), new vec3(0));

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
    this.depthTexture = this.device.createTexture(depthTextureDesc);
    this.depthTextureView = await this.depthTexture.createView();

    this.mBuf = await this.createBuffer({
      size: 128,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      type: "read-only-storage",
    });
    console.log(this.mBuf);

    this.globalGroup = await this.createBindGroup({
      groupIndex: 0,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: this.mBuf,
        },
      ],
    });
    this.msaaTextureView = this.msaaTexture.createView();
    timer.initTimer();

    //this.globalGroup = this.createBuffer();
    console.log("Render initialization completed successfully!");
  } /** End of 'initialization' function */

  /**
   * @info Render function
   * @returns none
   */
  public async renderStart(): Promise<any> {
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.msaaTextureView,
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

    this.commandEncoder = this.device.createCommandEncoder();

    this.passEncoder =
      this.commandEncoder.beginRenderPass(renderPassDescriptor);
  } /** End of 'renderStart' function */

  /**
   * @info Render function
   * @returns none
   */
  public async renderEnd() {
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  } /** End of 'render' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };
export { DIContainer };

/** END OF 'render.ts' FILE */
