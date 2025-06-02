/* FILE NAME   : mth_vec.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/**
 * @info Degree to radians function
 * @param angle: number
 * @returns angle in radians
 */
const d2R: Function = (angle: number) => {
    return angle / 180 * mth.PI;
} /** End of 'd2R' function */

/**
 * @info Radians to degree function
 * @param angle: number
 * @returns angle in degree
 */
const r2D: Function = (angle: number) => {
    return angle / mth.PI * 180;
} /** End of 'd2R' function */

/** Math class */
class mth {
  public static PI: number = 3.141592;  // Pi definition
  public static INF: number = 999999;   // Infinity definition
  public static MINF: number = -INF;   // Infinity definition

  /**
   * @info Degree to radians function
   * @param angle: number
   * @returns angle in radians
   */
  public static d2R(angle: number) {
      return d2R(angle);
  } /** End of 'd2R' function */

  /**
   * @info Radians to degree function
   * @param angle: number
   * @returns angle in degree
   */
  public static r2D(angle: number) {
      return r2D(angle);
  } /** End of 'd2R' function */
} /** End of 'mth' class */

/** EXPORTS */
export { mth } ;

/** END OF 'mth.ts' FILE */