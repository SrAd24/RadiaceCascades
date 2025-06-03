/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { gpu } from "./gpu.js";
import { buffer } from "./buffers.js";

// Vertex attributes
const vertexAttributes = [
  {
    attributes: [
      {
        shaderLocation: 0,
        offset: 0,
        format: "float32x4",
      },
      {
        shaderLocation: 1,
        offset: 16,
        format: "float32x4",
      },
    ],
    arrayStride: 32,
    stepMode: "vertex",
  },
];

/** Render class */
class render {
  /** #private parameters */
  private core: gpu | undefined;
  private context: Element | undefined;

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
    if (this.core != undefined) {
      await this.core.initialize();
      /** Get canvas ID */
      const canvasID = document.querySelector(
        "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
      );
      /** Get context */
      if (canvasID == null) throw Error("Canvas is undefined");

      if (this.context == undefined)
        this.context = canvasID.getContext("webgpu");

      if (this.context == undefined) throw Error("Context is undefined");
      this.context?.configure({
        device: this.core?.device,
        format: navigator.gpu.getPreferredCanvasFormat(),
      });
    } else throw Error("Core is undefined");
  } /** End of 'initialize' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'shaders.ts' FILE */
