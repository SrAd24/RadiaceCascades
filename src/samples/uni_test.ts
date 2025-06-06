/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { unit } from "../engine/anim/units/units";

class _uni_test extends unit {
  pipeline: any;
  prim: any;
  V: Float32Array = new Float32Array([
    -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.5, -0.5,
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, -0.5, 0.5, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 1.0,
  ]);
  I: Uint32Array = new Uint32Array([0, 1, 2, 2, 1, 3]);
  /** #public parameters */
  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {
    console.log(this.V)
    this.pipeline = await render.createShaders();
    this.prim = await render.createPrimitive(this.pipeline, this.V, this.I);
      
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(render: any): Promise<any> {
    await render.draw(this.prim);
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async response(
    render: any,
  ): Promise<any> {} /** End of 'response' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async destroy(render: any): Promise<any> {
    console.log("test_unit destroy");
  } /** End of 'destroy' function */
}

// Test unit
const uni_test: _uni_test = new _uni_test();

/** EXPORTS */
export { uni_test };

/** END OF 'test_unit.ts' FILE */
