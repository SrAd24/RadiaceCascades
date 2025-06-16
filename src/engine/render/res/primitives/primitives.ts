/* FILE NAME   : primitves.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 14.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { material_pattern } from "../mtl_ptn/material_patterns";
import { topology } from "./topology";
import { buffer } from "../buffers";

/** Primitive type enum */
export enum primitive_type {
  trimesh = "triangle-list",
  tristrip = "triangle-strip",
  lines = "line-list",
  points = "point-list",
} /** End of 'primitive_type' enum */

/** Primitive interface */
interface primitive_descriptor {
  material_pattern: material_pattern;
  topology: topology<any>;
} /** End of 'primitive_descriptor' interface */

/** Primitive class */
class primitive {
  /** #private parameters */
  public mtl_ptn!: material_pattern;
  public iBuf!: buffer;
  public vBuf!: buffer;
  public numOfI: number = 0;
  public numOfV: number = 0;

  /** #protected parameters */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  /**
   * @info Create primitve function
   * @param primitive parameters
   * @returns none
   */
  public async create(primParams: primitive_descriptor) {
    const vdata = primParams.topology.getVertexes();
    const idata = primParams.topology.getIndexes();

    this.vBuf = await this.render.createBuffer({
      size: vdata.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      data: vdata,
    });
    console.log(vdata)
    this.vBuf.update(vdata);

    this.numOfV = primParams.topology.vertexes.length;
    if ((this.numOfI = idata.length) != 0)
      this.iBuf = await this.render.createBuffer({
        size: idata.byteLength,
        usage: GPUBufferUsage.INDEX,
        data: idata
      });
    this.mtl_ptn = primParams.material_pattern;
  } /** End of 'create' function */
} /** End of 'primitive' class */

/** Primitive manager class */
class primitive_manager {
  /** #public parameters */
  /**
   * @info Create primitive function
   * @param primitive parameters
   * @returns new primitve
   */
  public async createPrimitive(primParams: primitive_descriptor): Promise<primitive> {
    let obj = new primitive();
    await obj.create(primParams);
    return obj;
  } /** End of 'createPrimitive' function */
} /** End of 'group_manager' class */

/** EXPORTS */
export { primitive };
export { primitive_manager };
export { primitive_descriptor };

/** END OF 'primitive.ts' FILE */
