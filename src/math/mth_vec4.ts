/* FILE NAME   : mth_vec4.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** Vector 4d class */
class vec4 {
  /** #public parameters */
  /** vector coordinates */
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  /**
   * @info Class constructor
   * @param x: number
   * @param y: number
   * @param z: number
   * @param w: number
   */
  public constructor(x: number, y?: number, z?: number, w?: number) {
    this.x = x;
    if (y != undefined && z != undefined && w != undefined) {
      this.y = y;
      this.z = z;
      this.w = w;
    } else {
      this.y = x;
      this.z = x;
      this.w = x;
    }
  } /** End of constructor */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length2(): number {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
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
   * @param vector: vec4
   * @returns new vec4
   */
  public add(vector: vec4): vec4 {
    return new vec4(
      vector.x + this.x,
      vector.y + this.y,
      vector.z + this.z,
      vector.w + this.w
    );
  } /** End of 'add' function */

  /**
   * @info Vector subtracting
   * @param vector: vec4
   * @returns new vec4
   */
  public sub(vector: vec4): vec4 {
    return new vec4(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z,
      this.w - vector.w
    );
  } /** End of 'sub' function */

  /**
   * @info Vector multipling by coordinates
   * @param vector: vec4
   * @returns new vec4
   */
  public mulVec(vector: vec4): vec4 {
    return new vec4(
      this.x * vector.x,
      this.y * vector.y,
      this.z * vector.z,
      this.w * vector.w
    );
  } /** End of 'mul' function */

  /**
   * @info Vector dividing by coordinates
   * @param num: number
   * @returns new vec4
   */
  public div(num: number): vec4 {
    if (num == 0) return this;

    return new vec4(this.x / num, this.y / num, this.z / num, this.w / num);
  } /** End of 'mul' function */

  /**
   * @info Vector multipling by number
   * @param num: number
   * @returns new vec4
   */
  public mulNum(num: number): vec4 {
    return new vec4(this.x * num, this.y * num, this.z * num, this.w * num);
  } /** End of 'mul' function */

  /**
   * @info Normilize vector
   * @returns new vector
   */
  public normilize(): vec4 {
    let len2: number = this.length2();

    if (len2 == 0) return this;
    let newVec4: vec4 = this.div(Math.sqrt(len2));

    return newVec4;
  } /** End of 'normilize' function */

  /**
   * @info Normilizing vector
   * @returns none
   */
  public normilizing(): void {
    let len2: number = this.length2();

    if (len2 == 0) return;

    let newVec4: vec4 = this.div(Math.sqrt(len2));

    this.x = newVec4.x;
    this.y = newVec4.y;
    this.z = newVec4.z;
    this.w = newVec4.w;
  } /** End of 'normilize' function */
} /** End of 'vec4' class */

/** EXPORTS */
export { vec4 };

/** END OF 'mth_vec4.ts' FILE */
