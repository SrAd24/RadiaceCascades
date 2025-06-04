/* FILE NAME   : buffer.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import * as mth from "../../math/mth.ts";

/** Vertex class */
class vertex {
  /** #public parameters */
  public position: mth.vec4 | undefined; // point position
  public color: mth.vec4 | undefined; // point color

  /**
   * @info create vertex by vertex position
   * @param position: vec4
   */
  public constructor(position: mth.vec4, color?: mth.vec4) {
    this.position = position;
    if (color == undefined) this.color = new mth.vec4(position.x);
  } /** End of constructor */
} /** End of 'vertex' class */

/** EXPORTS */
export { vertex };

/** END OF 'buffer.ts' FILE */
