/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import * as mth from "../math/mth.ts";
import { unit, input, timer } from "../engine/anim/anim";

/** Ray class */
class ray {
  /** #public parameters */
  public org: mth.vec3 = new mth.vec3(0, 0, 0);
  public dir: mth.vec3 = new mth.vec3(0, 0, 0);
  public t: number = 0;

  /**
   * @info Class constructor
   * @param org: mth.vec3
   * @param dir: mth.vec3
   */
  constructor(org: mth.vec3, dir: mth.vec3) {
    this.org = org;
    this.dir = dir;
  } /** End of constructor */
} /** End of 'ray' class */

const intersect: Function = (oRay: ray): mth.vec3 | null => {
  const normal: mth.vec3 = new mth.vec3(0, 1, 0);
  const planePoint: mth.vec3 = new mth.vec3(0, 0, 0);

  oRay.t = -(normal.dot(planePoint) + 1) / normal.dot(oRay.dir);

  if (oRay.t > 0) {
    let intersectPoint: mth.vec3 = oRay.org.add(oRay.dir.mulNum(oRay.t));
    return intersectPoint;
  } else return null;
}; /** End of 'intersect' function */

/** Unit control class */
class _uni_clicker extends unit {
  /** #public parameters */
  public ray: ray | undefined;
  public intersectPoint: mth.vec3 | null | undefined;
  public isIntersected: boolean = false;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {} /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async response(render: any): Promise<any> {
    if (input.isCLick) {
      this.ray = new ray(
        render.cam.loc,
        render.cam.at.sub(render.cam.loc).normilize(),
      );
      this.intersectPoint = intersect(this.ray);
      if (this.intersectPoint != null) this.isIntersected = true;
    }
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(render: any): Promise<any> {
    if (this.isIntersected) {
      console.log(this.intersectPoint);
      this.isIntersected = false;
    }
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async destroy(
    render: any,
  ): Promise<any> {} /** End of 'init' function */
} /** End of '_uni_clicker' class */

// Test unit
const uni_clicker: _uni_clicker = new _uni_clicker();

/** EXPORTS */
export { uni_clicker };

/** END OF 'test_unit.ts' FILE */
