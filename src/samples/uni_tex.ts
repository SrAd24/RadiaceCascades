/* FILE NAME   : uni_tex.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit texture class */
class _uni_tex extends unit {
  private pipeline: any;
  private pipeline2: any;
  private tex: any;
  private tex2: any;
  private prim: any;
  private bGroup: any;
  private n: number = 0;
  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {

  } /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
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
  ): Promise<any> {
    // Destroy textures
    if (this.tex) {
      this.tex.destroy();
      this.tex = null;
    }
    if (this.tex2) {
      this.tex2.destroy();
      this.tex2 = null;
    }
    
    // Destroy primitives
    if (this.prim) {
      this.prim.destroy();
      this.prim = null;
    }
    
    // Reset all properties
    this.pipeline = null;
    this.pipeline2 = null;
    this.bGroup = null;
    this.n = 0;
  } /** End of 'destroy' function */
}

const uni_tex: _uni_tex = new _uni_tex();

/** EXPORTS */
export { uni_tex };

/** END OF 'uni_tex.ts' FILE */
