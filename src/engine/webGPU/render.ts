/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { gpu } from 'gpu.ts';

/** Render class */
class render {
  /** #private parameters */
  private core: gpu;
  
  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  async public initialize() {
    await gpu.initialize();    
  } /** End of 'initialize' function */

} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'shaders.ts' FILE */