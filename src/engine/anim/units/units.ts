/* FILE NAME   : units.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { anim } from "../anim";
import { dict } from "./dictionary";

/** Units abstract class */
abstract class unit {
  /**
   * @info Class constructor
   */
  public constructor() {
    dict.add(this);
  } /** End of constructor */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  abstract init(ani: anim): Promise<any>;

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  abstract render(ani: anim): Promise<any>;

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  abstract response(ani: anim): Promise<any>;

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  abstract destroy(ani: anim): Promise<any>;
} /** End of 'unit' abstract class */

/** EXPORTS */
export { unit };

/** END OF 'units.ts' FILE */
