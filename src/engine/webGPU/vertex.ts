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
    if (color == undefined)
      this.color = new mth.vec4(
        Math.abs(position.x) > 1 ? 1 : Math.abs(position.x),
        Math.abs(position.y) > 1 ? 1 : Math.abs(position.y),
        Math.abs(position.z) > 1 ? 1 : Math.abs(position.z),
        1.0,
      );
  } /** End of constructor */
} /** End of 'vertex' class */

/** EXPORTS */
export { vertex };

/** END OF 'buffer.ts' FILE */
