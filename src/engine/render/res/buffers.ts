/* FILE NAME   : buffers.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

import { resources } from "../res-types";

/** Shader class */
class buffer {
  public bufType: object = {
    none: 0,
    vertex: Number(GPUBufferUsage.VERTEX),
    index: Number(GPUBufferUsage.INDEX),
    ssbo: Number(GPUBufferUsage.STORAGE),
  };
  /** #private parameters */
  public buf: GPUBuffer; // Shader module variable

  constructor(private render: resources | any) {}

  /** #public parameters */
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  public async createBuffer(
    type: number = bufType.none,
    size: number = 0,
    data: Float32Array = new Float32Array(),
  ): Promise<buffer> {
    const rnd = await this.render.getRender();
    let b = new buffer(rnd);

    b.buf = rnd.device.createBuffer({
      size: size,
      usage: type | GPUBufferUsage.COPY_DST,
    });

    if (data.length > 0) await rnd.device.queue.writeBuffer(b.buf, 0, data);
    return b;
  } /** End of 'createBuffer' function */

  /** #public parameters */
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  public async updateBuffer(data: Float32Array = new Float32Array()) {
    const rnd = await this.render.getRender();

    console.log(rnd.device.queue.writeBuffer(this.buf, 0, data))
    //if (data.length > 0) await rnd.device.queue.writeBuffer(this.buf, 0, data);
  } /** End of 'writeBuffer' function */
} /** End of 'buffer' class */

/** EXPORTS */
export { buffer };

/** END OF 'shaders.ts' FILE */
