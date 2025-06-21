/* FILE NAME   : mth_vec.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

export const PI: number = 3.14159265358979323846; // Pi definition
export const INF: number = 999999; // Infinity definition

/**
 * @info Degree to radians function
 * @param angle: number
 * @returns angle in radians
 */
export function d2R(angle: number) {
  return (angle / 180) * PI;
} /** End of 'd2R' function */

/**
 * @info Radians to degree function
 * @param angle: number
 * @returns angle in degree
 */
export function r2D(angle: number) {
  return (angle / PI) * 180;
} /** End of 'd2R' function */

/** END OF 'mth.ts' FILE */
