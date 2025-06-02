/* FILE NAME   : mth_vec4.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import {vec} from './mth_vec'

/** Vector 4d class */
class vec4 implements vec {
  /**
   * @info Class constructor
   * @param x: number
   * @param y: number 
   * @param z: number 
   * @param w: number 
   */
  public constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {} /** End of constructor */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length2 (): void {
    return x * x + y * y + z * z + w * w;
  } /** End of 'length2' function */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length (): void {
    return Math.sqrt(length2());
  } /** End of 'length' function */  

  /**
   * @info Vector addiction
   * @param vector: vec4
   * @returns new vec4
   */
  public add (vector: vec4): vec4 {
    return new vec4(vector.x + this.x, vector.y + this.y, vector.z + this.z, vector.w + this.w);
  } /** End of 'add' function */

  /**
   * @info Vector subtracting
   * @param vector: vec4
   * @returns new vec4
   */
  public sub (vector: vec4): vec4 {
    return new vec4(this.x - vector.x, this.y - vector.y, this.z - vector.z, this.w - vector.w);
  } /** End of 'sub' function */

  /**
   * @info Vector multipling by coordinates
   * @param vector: vec4
   * @returns new vec4
   */
  public mul(vector: vec4): vec4 {
    return new vec4(this.x * vector.x, this.y * vector.y, this.z * vector.z, this.w * vector.w);
  } /** End of 'mul' function */

  /**
   * @info Vector dividing by coordinates
   * @param num: number
   * @returns new vec4
   */
  public div(num: number): vec4 {
    if (num == 0)
        return this;

    return new vec4(this.x / number, this.y / number, this.z / number, this.w / number);
  } /** End of 'mul' function */
  
  /**
   * @info Vector multipling by number
   * @param num: number
   * @returns new vec4
   */
  public mul(num: number): vec4 {
    return new vec4(this.x * number, this.y * number, this.z * number, this.w * number);
  } /** End of 'mul' function */

  /**
   * @info normilize vector
   * @returns new vector
   */
  public normilize(): vec4 {
    let len2: number = this.length2();

    if (len2 == 0)
        return this;
    let newVec4: vec4 = this.div(Math.sqrt(len2));

    return newVec4;
  } /** End of 'normilize' function */

  /**
   * @info normilizing vector
   * @returns none
   */
  public normilizing(): void {   
    let len2: number = this.length2();

    if (len2 == 0)
        return;

    let newVec4: vec4 = this.div(Math.sqrt(len2));

    this = newVec4;
  } /** End of 'normilize' function */
} /** End of 'vec4' class */ 

/** END OF 'mth_vec4.ts' FILE */
