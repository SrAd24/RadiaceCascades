/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { gpu } from "./gpu.ts";
import { buffer } from "./buffers.ts";
import { encoder } from "./encoder.ts";
import { vertex } from "./vertex.ts";
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
   * @info Class constructor
   * @param core: gpu
   */
  public constructor() {
    this.core = new gpu();
  } /** End of 'constructor' function */

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialize() {
    console.log("Render initialization started");

    let model1: model = new model();
    await model1.loadModel("cow.obj");
    console.log("model loaded");

    if (this.core != undefined) {
      await this.core.initialize();

      /** Get canvas ID */
      this.canvasID = document.querySelector(
        "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
      );

      /** Get context */
      if (this.canvasID == null) throw Error("Canvas is undefined");

      if (this.context == undefined)
        this.context = this.canvasID.getContext("webgpu");

      if (this.context == undefined) throw Error("Context is undefined");
      this.context?.configure({
        device: this.core?.device,
        format: navigator.gpu.getPreferredCanvasFormat(),
      });
    } else throw Error("Core is undefined");

    // Load cow model
    this.gpuBuffer = new buffer();
    await this.gpuBuffer.createBuffer(this.core.device, vertices);

    console.log("Render initialization ended");
  } /** End of 'initialize' function */

  /**
   * @info Render function
   * @returns none
   */
  public async render(): Promise<any> {
    console.log("Render started");

    // Create command buffer
    this.command = new encoder();
    if (this.command != undefined)
      await this.command.createEncoder(
        this.core.device,
        this.context,
        this.canvasID,
      );
    else console.log("command buffer ready");

    // begin render pass
    console.log(this.gpuBuffer);
    await this.command.beginRenderPass(
      this.context,
      this.core.renderPipeline,
      this.gpuBuffer,
    );

    // end render pass
    await this.command.endRenderPass(this.core.device);

    console.log("Render ended");
  } /** End of 'render' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'shaders.ts' FILE */
