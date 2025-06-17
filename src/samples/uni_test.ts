/* FILE NAME   : uni_test.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit test class */
class _uni_test extends unit {
  private mdl: any;

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {
    this.mdl = await ani.createModel("monkey.obj");
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    let m = mat4.rotateY(timer.time * 45);
    await ani.drawModel(this.mdl, m);
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(
    ani: anim,
  ): Promise<any> {} /** End of 'response' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(
    ani: anim,
  ): Promise<any> {} /** End of 'destroy' function */
}

// Test unit
const uni_test: _uni_test = new _uni_test();

/** EXPORTS */
export { uni_test };

/** END OF 'test_unit.ts' FILE */
