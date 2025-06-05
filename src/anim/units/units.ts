/* FILE NAME   : units.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { dict } from './dictionary.ts';

/** Units abstract class */
abstract class unit {
  /**
   * @info Class constructor
   */
  public constructor(): void {
    dict.add(this);
  } /** End of constructor */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract init(render: any): void;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract render(render: any): void;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract response(render: any): void;

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  abstract destroy(render: any): void;
} /** End of 'unit' abstract class */

/** END OF 'units.ts' FILE */
