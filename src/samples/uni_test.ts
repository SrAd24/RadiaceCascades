/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { unit } from "../anim/units/units.ts";

class _uni_test extends unit {
  /** #public parameters */
  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {
    console.log("test_unit init");
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(render: any): Promise<any> {
    console.log("test_unit render");
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async response(render: any): Promise<any> {
    console.log("test_unit response");
  } /** End of 'response' function */

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
