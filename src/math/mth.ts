/* FILE NAME   : mth.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

// TODO #3 @CGSG220AI3 MAKE #PUBLIC IN ALL MTH CLASS

/** Math class */
class mth {
  public static PI: number = 3.141592;  // Pi definition
  public static INF: number = 999999;   // Infinity definition
  public static MINF: number = -INF;   // Infinity definition
} /** End of 'mth' class */

/** EXPORTS */
export {vec3} from './mth_vec3'
export {vec4} from './mth_vec4'
export {vec2} from './mth_vec2'

/** END OF 'mth.ts' FILE */