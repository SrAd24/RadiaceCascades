/* FILE NAME   : gpu.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import { shader } from "./shaders";

/** Gpu class */
class gpu {
  /** #public parameters */
  public adapter: any;
  public device: any;
  public shader1: any;

  /**
   * @info Initialize webGPU function
   * @returns none
   */
  public async initialize(): Promise<any> {
    // check webGPU support
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    // get adapter
    this.adapter = await navigator.gpu.requestAdapter();

    if (this.adapter == null) {
      alert("Can`t get adapter");
      throw Error("Can`t get adapter");
    }

    // get device
    this.device = await this.adapter.requestDevice();

    // create shader
    this.shader1 = new shader();
    this.shader1.createShader("main", this.device);
  } /** End of 'Initialize' function */
} /** End of 'gpu' class */

/** EXPORTS */
export { gpu };

/** END OF 'gpu.ts' FILE */
