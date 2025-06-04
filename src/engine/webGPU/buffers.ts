/* FILE NAME   : buffer.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import { vertex } from "./vertex.ts";

/** Buffer class */
class buffer {
  /** #public parameters */
  public gpuBuffer: any;
  public vertecesCount: number = 0;
  public vertecesFloatArray: Float32Array | null = null;

  /**
   * @info Set buffer function
   * @param verteces: vertex[]
   * @returns new buffer
   */
  public async setBuffer(verteces: vertex[]): Promise<any> {
    let bufferData: Float32Array = new Float32Array(verteces.length * 8);
    verteces.forEach((vert, index) => {
      if (vert == undefined) {
        console.log("vert is undefined");
        throw new Error("vert is undefined");
      }

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

    this.vertecesFloatArray = bufferData;

    console.log(
      "bufferData: ",
      this.vertecesFloatArray,
      " verteces: ",
      verteces,
      " verteces.length: ",
      verteces.length,
      " verteces.byteLength: ",
      this.vertecesFloatArray,
    );

    this.vertecesCount = verteces.length;

    console.log("vertecesCount: ", this.vertecesCount);
  } /** End of 'setBuffer' function */

  /**
   * @info Write bufffer info funciton
   * @param verteces: Float32Array
   * @param device: any
   * @returns none
   */
  public async writeBuffer(verteces: Float32Array, device: any): Promise<any> {
    await device.queue.writeBuffer(
      this.gpuBuffer,
      0,
      verteces,
      0,
      verteces.length,
    );
  } /** End of 'writeBuffer' function */

  /**
   * @info Create buffer function
   * @param device: any
   * @param verteces: vertex[]
   * @returns none
   */
  public async createBuffer(
    device: GPUDevice,
    verteces: vertex[],
  ): Promise<any> {
    await this.setBuffer(verteces);

    this.gpuBuffer = await device.createBuffer({
      size:
        this.vertecesFloatArray == null
          ? 0
          : this.vertecesFloatArray.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    await this.writeBuffer(
      this.vertecesFloatArray == null
        ? new Float32Array()
        : this.vertecesFloatArray,
      device,
    );
  } /** End of 'createBuffer' function */
} /** End of 'buffer' class */

/** EXPORTS */
export { buffer };

/** END OF 'buffer.ts' FILE */
