/* FILE NAME   : dictionary.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { unit } from "./units.ts";

/** Unit dictionary class */
class dictionary {
  /** #public parameters */
  units: unit[] = [];

  /**
   * @info Add unit in unit dictionary
   * @param newUnit: unit
   */
  add(newUnit: unit) {
    this.units.push(newUnit);
  } /** End of 'add' function */
} /** End of 'dictionary' class */

// unit dictionary
const dict: dictionary = new dictionary();

/** EXPORTS */
export { dict };

/** END OF 'dictionary.ts' FILE */
