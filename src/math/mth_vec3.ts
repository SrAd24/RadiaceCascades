/* FILE NAME   : mth_vec3.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { vec } from "./mth_vec.js";

/** Vector 3d class */
class vec3 implements vec {
  /** #public parameters */
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  /**
   * @info Class constructor
   * @param x: number
   * @param y: number
   * @param z: number
   */
  public constructor(x: number, y?: number, z?: number) {
    if (y == undefined && z == undefined) {
      this.x = x;
      this.y = x;
      this.z = x;
    } else if (y != undefined && z != undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  } /** End of constructor */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length2(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  } /** End of 'length2' function */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length(): number {
    return Math.sqrt(this.length2());
  } /** End of 'length' function */

  /**
   * @info Vector addiction
   * @param vector: vec3
   * @returns new vec3
   */
  public add(vector: vec3): vec3 {
    return new vec3(vector.x + this.x, vector.y + this.y, vector.z + this.z);
  } /** End of 'add' function */

  /**
   * @info Vector subtracting
   * @param vector: vec3
   * @returns new vec3
   */
  public sub(vector: vec3): vec3 {
    return new vec3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  } /** End of 'sub' function */

  /**
   * @info Vector multipling by coordinates
   * @param vector: vec3
   * @returns new vec3
   */
  public mulVec(vector: vec3): vec3 {
    return new vec3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
  } /** End of 'mul' function */

  /**
   * @info Vector dividing by coordinates
   * @param num: number
   * @returns new vec3
   */
  public div(num: number): vec3 {
    if (num == 0) return this;

    return new vec3(this.x / num, this.y / num, this.z / num);
  } /** End of 'mul' function */

  /**
   * @info Vector multipling by number
   * @param num: number
   * @returns new vec3
   */
  public mulNum(num: number): vec3 {
    return new vec3(this.x * num, this.y * num, this.z * num);
  } /** End of 'mul' function */

  /**
   * @info Vector scalar multiping by coordinates
   * @param vector: vec3
   * @returns scalar result
   */
  public dot(vector: vec3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  } /** End of 'dot' function */

  /**
   * @info Vector vector multiping by coordinates
   * @param vector: vec3
   * @returns scalar result
   */
  public cross(vector: vec3): vec3 {
    return new vec3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  } /** End of 'cross' function */

  /**
   * @info Normilize vector
   * @returns new vector
   */
  public normilize(): vec3 {
    let len2: number = this.length2();
    let newVec3: vec3 = this.div(Math.sqrt(len2));

    return newVec3;
  } /** End of 'normilize' function */

  /**
   * @info Normilizing vector
   * @returns none
   */
  public normilizing(): void {
    let len2: number = this.length2();
    let newVec3: vec3 = this.div(Math.sqrt(len2));

    this.x = newVec3.x;
    this.y = newVec3.y;
    this.z = newVec3.z;
  } /** End of 'normilizing' function */
} /** End of 'vec3' class */

/** EXPORTS */
export { vec3 };

/** END OF 'mth_vec3.ts' FILE */
