/* FILE NAME   : buffers.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";

/** Buffer interface */
interface buffer_descriptor {
  usage: GPUBufferUsageFlags;
  size: number;
  type?: GPUBufferBindingType;
  data?: Float32Array;
} /** End of 'buffer_descriptor' interface */

/** Buffer class */
class buffer {
  /** #private parameters */
  private bufferDesriptor!: GPUBufferDescriptor;

  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public buffer!: GPUBuffer;
  public bufferType!: GPUBufferBindingType;

  /**
   * @info Create buffer function
   * @param bufferParams: buffer_descriptor
   * @returns none
   */
  public async create(bufferParams: buffer_descriptor) {
    if (bufferParams.type) this.bufferType = bufferParams.type;
    this.bufferDesriptor = {
      size: bufferParams.size,
      usage: bufferParams.usage,
      mappedAtCreation: true,
    };

    this.buffer = this.render.device.createBuffer(this.bufferDesriptor);

    if (bufferParams.data)
      new Uint32Array(this.buffer.getMappedRange()).set(bufferParams.data);
    this.buffer.unmap();
  } /** End of 'create' function */

  /**
   * @info Udpate buffer function
   * @param data: Float32Array
   * @returns none
   */
  public async update(data: Float32Array) {
    if (data.byteLength > this.bufferDesriptor.size) {
      this.buffer.destroy();
      this.bufferDesriptor.size = data.byteLength;
      this.buffer = this.render.device.createBuffer(this.bufferDesriptor);
    }
    this.render.device.queue.writeBuffer(this.buffer, 0, data);
  } /** End of 'update' function */

  /**
   * @info Destroy buffer function
   * @returns none
   */
  public async destroy() {
    this.buffer.destroy();
  } /** End of 'destroy' function */
} /** End of 'buffer' class */

/** Buffer manager class */
class buffer_manager {
  /** #public parameters */
  /**
   * @info Create buffer function
   * @param bufferParams: buffer_descriptor
   * @returns new buffer
   */
  public async createBuffer(bufferParams: buffer_descriptor): Promise<buffer> {
    let obj = new buffer();
    await obj.create(bufferParams);
    return obj;
  } /** End of 'createBuffer' function */
} /** End of 'buffer_manager' class */

/** EXPORTS */
export { buffer };
export { buffer_manager };
export { buffer_descriptor };

/** END OF 'buffers.ts' FILE */
