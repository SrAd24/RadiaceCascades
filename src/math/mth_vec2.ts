/* FILE NAME   : mth_vec2.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** Vector 2d class */
class vec2 {
  /** #public parameters */
  public x: number = 0;
  public y: number = 0;

  /** #public parameters */
  /**
   * @info Class constructor
   * @param x: number
   * @param y: number
   */
  public constructor(x: number, y?: number) {
    this.x = x;
    if (y == undefined) this.y = x;
    else this.y = y;
  } /** End of constructor */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length2(): number {
    return this.x * this.x + this.y * this.y;
  } /** End of 'length2' function */

  /**
   * @info Evaluate vector length function
   * @returns none
   */
  public length(): number {
    return Math.sqrt(this.length2());
  } /** End of 'length' function */

  /**
   * @info Vector addiction function
   * @param vector: vec2
   * @returns new vec2
   */
  public add(vector: vec2): vec2 {
    return new vec2(vector.x + this.x, vector.y + this.y);
  } /** End of 'add' function */

  /**
   * @info Vector subtracting function
   * @param vector: vec2
   * @returns new vec2
   */
  public sub(vector: vec2): vec2 {
    return new vec2(this.x - vector.x, this.y - vector.y);
  } /** End of 'sub' function */

  /**
   * @info Vector multipling by coordinates fucntion
   * @param vector: vec2
   * @returns new vec2
   */
  public mulVec(vector: vec2): vec2 {
    return new vec2(this.x * vector.x, this.y * vector.y);
  } /** End of 'mul' function */

  /**
   * @info Vector dividing by coordinates function
   * @param num: number
   * @returns new vec2
   */
  public div(num: number): vec2 {
    if (num == 0) return this;

    return new vec2(this.x / num, this.y / num);
  } /** End of 'mul' function */

  /**
   * @info Vector multipling by number function
   * @param num: number
   * @returns new vec2
   */
  public mulNum(num: number): vec2 {
    return new vec2(this.x * num, this.y * num);
  } /** End of 'mul' function */

  /**
   * @info Normilize vector function
   * @returns new vector
   */
  public normilize(): vec2 {
    let len2: number = this.length2();

    if (len2 == 0) return this;
    let newVec2: vec2 = this.div(Math.sqrt(len2));

    return newVec2;
  } /** End of 'normilize' function */

  /**
   * @info normilizing vector function
   * @returns none
   */
  public normilizing(): void {
    let len2: number = this.length2();

    if (len2 == 0) return;

    let newVec2: vec2 = this.div(Math.sqrt(len2));

    this.x = newVec2.x;
    this.y = newVec2.y;
  } /** End of 'normilizing' function */
} /** End of 'vec2' class */

/** EXPORTS */
export { vec2 };

/** END OF 'mth_vec2.ts' FILE */
