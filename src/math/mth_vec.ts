/* FILE NAME   : mth_vec.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** Vector inteface */
interface vec {
  /** #public parameters */  
  /**
   * @info Evaluate vector length2 function
   * @returns none
   */
  public length2(): void;

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length(): void;
} /** End of 'vec' inteface */

/** EXPORTS */
export { vec } ;

/** END OF 'mth.ts' FILE */