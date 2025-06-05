/* FILE NAME   : units.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { dict } from "./dictionary.ts";

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
   * @param render: any
   * @returns none
   */
  abstract init(render: any): Promise<any>;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract render(render: any): Promise<any>;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract response(render: any): Promise<any>;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract destroy(render: any): Promise<any>;
} /** End of 'unit' abstract class */

/** EXPORTS */
export { unit };

/** END OF 'units.ts' FILE */
