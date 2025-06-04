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
  public writeBuffer(verteces: vertex[], device: any): void {
    let bufferData: Float32Array = new Float32Array(verteces.length * 8);
    verteces.forEach((vert, index) => {
      let baseIndex = index * 8;

      bufferData[baseIndex] = vert.position.x;
      bufferData[baseIndex + 1] = vert.position.y;
      bufferData[baseIndex + 2] = vert.position.z;
      bufferData[baseIndex + 3] = vert.position.w;
      bufferData[baseIndex + 4] = vert.color.x;
      bufferData[baseIndex + 5] = vert.color.y;
      bufferData[baseIndex + 6] = vert.color.z;
      bufferData[baseIndex + 7] = vert.color.w;
    });

    device.queue.writeBuffer(this.gpuBuffer, 0, bufferData, 0, verteces.length);
  } /** End of 'writeBuffer' function */

  /**
   * @info Create buffer function
   * @param device: any
   * @param verteces: vertex[]
   * @returns none
   */
  public createBuffer(device: any, verteces: vertex[]): void {
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
