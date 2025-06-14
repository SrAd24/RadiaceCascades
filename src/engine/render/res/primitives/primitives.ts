/* FILE NAME   : shaders.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { resources } from "../res-types";
import { material_pattern } from "./material_patterns";

/** Primitive type enum */
export enum primitive_type {
  trimesh = "triangle-list",
  tristrip = "triangle-strip",
  lines = "line-list",
  points = "point-list",
} /** End of 'primitive_type' enum */

/** Shader class */
class primitive {
  /** #private parameters */
  public iBuf: any;
  public vBuf: any;
  public mtl_ptn: any;
  public numOfI: any;
  public numOfV: any;

  constructor(private render: resources) {}

  /** #public parameters */
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  public async createPrimitive(
    mtl_ptn: material_pattern,
    vData: Float32Array,
    iData: Float32Array = new Float32Array(),
  ): Promise<primitive> {
    const rnd = await this.render.getRender();
    console.log(rnd);
    this.vBuf = await rnd.buffers.createBuffer(
      rnd.buffers.bufType.vertex,
      vData.byteLength,
      vData,
    );
    this.numOfV = vData.length;
    if ((this.numOfI = iData.length) != 0)
      this.iBuf = await rnd.buffers.createBuffer(
        rnd.buffers.bufType.index,
        iData.byteLength,
        iData,
      );
    this.mtl_ptn = mtl_ptn;
    return this;
  } /** End of 'createBuffer' function */
} /** End of 'shader' class */

/** EXPORTS */
export { primitive };

/** END OF 'shaders.ts' FILE */
