/* FILE NAME   : buffers.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../render";

export enum bufferUsage {
  vertex = GPUBufferUsage.VERTEX,
  index = GPUBufferUsage.INDEX,
  ssbo = GPUBufferUsage.STORAGE,
  uniform = GPUBufferUsage.UNIFORM,
  copy_src = GPUBufferUsage.COPY_SRC,
  copy_dst = GPUBufferUsage.COPY_DST,
}

/** Buffer interface */
interface buffer_descriptor {
  usage: bufferUsage;
  size: number;
  type?: GPUBufferBindingType;
  data?: Float32Array;
} /** End of 'buffer_descriptor' interface */

/** Buffer class */
class buffer {
  /** #private parameters */
  public buffer!: GPUBuffer;
  public bufferType!: GPUBufferBindingType;
  public bufferUsage!: bufferUsage;

  /** #protected parameters */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  /**
   * @info Create buffer function
   * @param
   * @returns none
   */
  public async create(bufferParams: buffer_descriptor) {
    if (bufferParams.type) this.bufferType = bufferParams.type;
    this.bufferUsage = bufferParams.usage;

    this.buffer = this.render.device.createBuffer({
      size: bufferParams.size,
      usage: bufferParams.usage,
      mappedAtCreation: true,
    });

    if (bufferParams.data)
      new Uint32Array(this.buffer.getMappedRange()).set(bufferParams.data);
    this.buffer.unmap();
  } /** End of 'createBuffer' function */

  /** #public parameters */
  /**
   * @info Udpate buffer function
   * @param data: Float32Array
   * @returns none
   */
  public async update(data: Float32Array) {
    this.render.device.queue.writeBuffer(this.buffer, 0, data);
  } /** End of 'update' function */
} /** End of 'buffer' class */

/** Buffer manager class */
class buffer_manager {
  /** #public parameters */
  /**
   * @info Create buffer function
   * @param Buffer parameters
   * @returns new buffer
   */
  public async createBuffer(bufferParams: buffer_descriptor): Promise<buffer> {
    let obj = new buffer();
    await obj.create(bufferParams);
    return obj;
  } /** End of 'createBuffer' function */
} /** End of 'group_manager' class */

/** EXPORTS */
export { buffer };
export { buffer_manager };
export { buffer_descriptor };

/** END OF 'buffers.ts' FILE */
