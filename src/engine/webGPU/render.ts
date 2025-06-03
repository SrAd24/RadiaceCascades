/* FILE NAME   : render.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { gpu } from "./gpu.js";

/** Render class */
class render {
  /** #public parameters */

  /**
   * @info Class constructor
   * @param core: gpu
   */
  public constructor(private core: gpu) {}

  /** #public parameters */
  /**
   * @info Initialize render function
   * @returns none
   */
  public async initialize() {
    await this.core.initialize();
  } /** End of 'initialize' function */
} /** End of 'Render' class */

/** EXPORTS */
export { render };

/** END OF 'shaders.ts' FILE */
