/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { gpu } from "../res/gpu.ts";
import { buffer } from "../res/buffers.ts";
import { encoder } from "../res/encoder.ts";
import { vertex } from "../res/vertex.ts";
import * as mth from "../../math/mth.ts";
import { model } from "../../model/model.ts";

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
class render {
  /** #private parameters */
  private core: gpu | undefined;
  private context: Element | undefined;
  private command: encoder | undefined;
  private gpuBuffer: buffer | undefined;
  private canvasID: any;

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async init(canvas: Element) {
    this.core = new gpu();

    await this.core.init(canvas);

    /** Get canvas ID */
    //   this.canvasID = document.querySelector(
    //   "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    // );

    // /** Get context */
    // if (this.canvasID == null) throw Error("Canvas is undefined");

    // if (this.context == undefined)
    //   this.context = this.canvasID.getContext("webgpu");

    // if (this.context == undefined) throw Error("Context is undefined");
    // this.context?.configure({
    //   device: this.core?.device,
    //   format: navigator.gpu.getPreferredCanvasFormat(),
    // });

    // // Load cow model
    // this.gpuBuffer = new buffer();
    // await this.gpuBuffer.createBuffer(this.core.device, vertices);

    // console.log("Render initialization ended");

    console.log("Render initialization completed successfully!");
  } /** End of 'initialize' function */

  /**
   * @info Render function
   * @returns none
   */
  public async render(): Promise<any> {
    if (this.core == undefined) throw Error("Core is undefined");

    let passEncoder: any;
    if (this.core.attachmets == undefined)
      throw Error("Attachments is undefined");
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.core.attachmets.attTexture.view, //context.getCurrentTexture().createView(), // Текстура канваса
          clearValue: [1.0, 0.0, 1.0, 1.0], // Чёрный цвет
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    let commandEncoder = this.core.device.createCommandEncoder();

    // Кодирование команд рисования
    passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    await this.core.queue.submit([commandEncoder.finish()]);

    // Create command buffer
    // this.command = new encoder();
    // if (this.command != undefined)
    //   await this.command.createEncoder(
    //     this.core.device,
    //     this.context,
    //     this.canvasID,
    //   );
    // else console.log("command buffer ready");

    // // begin render pass
    // await this.command.beginRenderPass(
    //   this.context,
    //   this.core.renderPipeline,
    //   this.gpuBuffer,
    // );

    // // end render pass
    // await this.command.endRenderPass(this.core.device);
  } /** End of 'render' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'shaders.ts' FILE */
