/* FILE NAME   : buffer.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import { vertex } from "./vertex.js";

/** Buffer class */
class buffer {
  /** #public parameters */
  public gpuBuffer: any;

  /**
   * @info Write bufffer info funciton
   * @param verteces: vertex[]
   * @param device: any
   * @returns none
   */
  public writeBuffer(verteces: Float32Array, device: any): void {
    device.queue.writeBuffer(this.gpuBuffer, 0, verteces, 0, verteces.length);
  } /** End of 'writeBuffer' function */

  /**
   * @info Create buffer function
   * @param device: any
   * @param verteces: vertex[]
   * @returns none
   */
  public createBuffer(device: any, verteces: Float32Array): void {
    this.gpuBuffer = device.createBuffer({
      size: verteces.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    this.writeBuffer(verteces, device);
  } /** End of 'createBuffer' function */
} /** End of 'buffer' class */

/** EXPORTS */
export { buffer };

/** END OF 'buffer.ts' FILE */
