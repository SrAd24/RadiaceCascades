/* FILE NAME   : gpu.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** Gpu class */
class gpu {
  /** #readonly parameters */
  readonly adapter: Promise;
  readonly device: Promise;

  /**
   * @info Initialize webGPU function
   * @returns none
   */
  async public initialize(): void {
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    adapter = await navigator.gpu.requestAdapter();

    if (adapter == null) {
      alert("Can`t get adapter");
      throw Error("Can`t get adapter");
    }

    device = await this.adapter.requestDevice();
  } /** End of 'Initialize' function */
} /** End of 'gpu' class */

/** EXPORTS */
export { gpu };

/** END OF 'shaders.ts' FILE */