/* FILE NAME   : buffers.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 18.06.2025
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
  public isSizeChanged: boolean = false;

  /**
   * @info Create buffer function
   * @param bufferParams: buffer_descriptor
   * @returns none
   */
  public async create(bufferParams: buffer_descriptor) {
    if (bufferParams.type) this.bufferType = bufferParams.type;
    if (bufferParams.data) {
      this.bufferDesriptor = {
        size: bufferParams.size,
        usage: bufferParams.usage,
        mappedAtCreation: true,
      };
      this.buffer = this.render.device.createBuffer(this.bufferDesriptor);
      new Uint32Array(this.buffer.getMappedRange()).set(bufferParams.data);
      this.buffer.unmap();
    }
    else {
      this.bufferDesriptor = {
        size: bufferParams.size,
        usage: bufferParams.usage,
      };
      this.buffer = this.render.device.createBuffer(this.bufferDesriptor);
    }
  } /** End of 'create' function */

  /**
   * @info Resize buffer function with growth strategy
   * @param newSize: number
   * @returns none
   */
  public async resize(newSize: number) {
    if (this.bufferDesriptor.size >= newSize) return;
    
    await this.destroy();

    this.bufferDesriptor.size = Math.max(newSize, this.bufferDesriptor.size * 2);
    this.buffer = this.render.device.createBuffer(this.bufferDesriptor);
    this.isSizeChanged = true;
  } /** End of 'resize' function */

  /**
   * @info Update buffer function
   * @param data: Float32Array
   * @returns none
   */
  public async update(data: Float32Array) {
    await this.resize(data.byteLength);
    this.render.queue.writeBuffer(this.buffer, 0, data as GPUAllowSharedBufferSource);
  } /** End of 'update' function */

  /**
   * @info Copy buffer function
   * @param encoder: GPUCommandEncoder
   * @param buffer: buffer
   * @returns none
   */
  public async copy(encoder: GPUCommandEncoder, buffer: buffer) {
    await this.resize(buffer.bufferDesriptor.size);
    encoder.copyBufferToBuffer(buffer.buffer, 0, this.buffer, 0, buffer.bufferDesriptor.size);
  } /** End of 'copy' function */

  /**
   * @info Destroy buffer function
   * @returns none
   */
  public async destroy() {
    this.buffer.destroy();
    this.buffer = null as unknown as GPUBuffer;
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
