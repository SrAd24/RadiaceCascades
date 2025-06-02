/* FILE NAME   : mth_vec2.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { vec } from './mth_vec';

/** Vector 2d class */
class vec2 implements vec {
  /**
   * @info Class constructor
   * @param x: number
   * @param y: number 
   */
  public constructor(
    public x: number,
    public y: number
  ) {} /** End of constructor */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length2(): void {
    return x * x + y * y;
  } /** End of 'length2' function */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length(): void {
    return Math.sqrt(length2());
  } /** End of 'length' function */  

  /**
   * @info Vector addiction
   * @param vector: vec2
   * @returns new vec2
   */
  public add(vector: vec2): vec2 {
    return new vec2(vector.x + this.x, vector.y + this.y);
  } /** End of 'add' function */

  /**
   * @info Vector subtracting
   * @param vector: vec2
   * @returns new vec2
   */
  public sub(vector: vec2): vec2 {
    return new vec2(this.x - vector.x, this.y - vector.y);
  } /** End of 'sub' function */

  /**
   * @info Vector multipling by coordinates
   * @param vector: vec2
   * @returns new vec2
   */
  public mul(vector: vec2): vec2 {
    return new vec2(this.x * vector.x, this.y * vector.y);
  } /** End of 'mul' function */

  /**
   * @info Vector dividing by coordinates
   * @param num: number
   * @returns new vec2
   */
  public div(num: number): vec2 {
    if (num == 0)
        return this;

    return new vec2(this.x / number, this.y / number);
  } /** End of 'mul' function */
  
  /**
   * @info Vector multipling by number
   * @param num: number
   * @returns new vec2
   */
  public mul(num: number): vec2 {
    return new vec2(this.x * number, this.y * number);
  } /** End of 'mul' function */

  /**
   * @info normilize vector
   * @returns new vector
   */
  public normilize(): vec2 {
    let len2: number = this.length2();

    if (len2 == 0)
        return this;
    let newVec2: vec2 = this.div(Math.sqrt(len2));

    return newVec2;
  } /** End of 'normilize' function */

  /**
   * @info normilizing vector
   * @returns none
   */
  public normilizing(): void {   
    let len2: number = this.length2();

    if (len2 == 0)
        return;

    let newVec2: vec2 = this.div(Math.sqrt(len2));

    this.x = newVec2.x;
    this.y = newVec2.y;
  } /** End of 'normilizing' function */
} /** End of 'vec2' class */

/** EXPORTS */
export { vec2 };

/** END OF 'mth_vec2.ts' FILE */
