/* FILE NAME   : camera.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** Camera class */
class camera {
  /** #public parameters */
  public loc: vec3 = new vec3(0, 0, -5);
  public at: vec3 = new vec3(0, 0, 0);
  public up: vec3 = new vec3(0, 1, 0);
  public right: vec3 = new vec3(1, 0, 0);
  public dir: vec3 = new vec3(0, 0, 1);
  public view: mat4 = mat4.identity();
  public proj: mat4 = mat4.identity();
  public vp: mat4 = mat4.identity();
  public projDist: number = 1;
  public projFar: number = 1000;
  public projSize: number = 0.1;
  public wp: number = 0;
  public hp: number = 0;
  public frameW: number = 0;
  public frameH: number = 0;
  public cosT: number = 0;
  public sinT: number = 0;
  public cosP: number = 0;
  public sinP: number = 0;
  public plen: number = 0;
  public azimuth: number = 0;
  public elevator: number = 0;
  public deltaAzimuth: number = 0;
  public deltaElevator: number = 0;
  public deltaDist: number = 0;
  public dist: number = 0;

  /**
   * @info Class constructor
   * @param frameW: number
   * @param frameH: number
   */
  public constructor(frameW: number, frameH: number) {
    this.frameW = frameW;
    this.frameH = frameH;
  } /** End of constructor */

  /**
   * @info Set new projection function
   * @returns none
   */
  public setProj(): void {
    let wp = this.projSize;
    let hp = this.projSize;

    if (this.frameW > this.frameH) wp *= this.frameW / this.frameH;
    else hp *= this.frameH / this.frameW;

    this.proj = mat4.Frustum(
      -wp / 2,
      wp / 2,
      -hp / 2,
      hp / 2,
      this.projSize,
      this.projFar,
    );
  } /** End of 'setProj' function */

  /**
   * @info Set orientation function
   * @returns none
   */
  public setOrientation(): void {
    this.dist = this.at.sub(this.loc).length();
    this.cosT = (this.loc.y - this.at.y) / this.dist;
    this.sinT = Math.sqrt(1 - this.cosT * this.cosT);
    this.plen = this.dist * this.sinT;
    this.cosP = (this.loc.z - this.at.z) / this.plen;
    this.sinP = (this.loc.x - this.at.x) / this.plen;
    this.azimuth = r2D(Math.atan2(this.sinP, this.cosP));
    this.elevator = r2D(Math.atan2(this.sinT, this.cosT));
    this.deltaAzimuth = 0;
    this.deltaElevator = 0;
    this.deltaDist = 0;
  } /** End of 'setOrientation' function */

  /**
   * @info Set default camera function
   * @returns none
   */
  public setDefault(): void {
    this.set(new vec3(5), new vec3(0, 0, 0));
  } /** End of 'setDefault' function */

  /**
   * @info Set location, at point & up function
   * @param loc: mth.vec4
   * @param at: mth.vec4
   * @param up: mth.vec4
   * @returns none
   */
  public set(
    loc: vec3,
    at: vec3,
    up: vec3 = new vec3(0, 1, 0),
  ): void {
    this.loc = loc;
    this.at = at;
    this.up = up;
    this.view = mat4.view(loc, at, up);
    this.setProj();
    this.right = new vec3(
      this.view.m[0][0],
      this.view.m[1][0],
      this.view.m[2][0],
    );
    this.up = new vec3(
      this.view.m[0][1],
      this.view.m[1][1],
      this.view.m[2][1],
    );
    this.dir = new vec3(
      this.view.m[0][2],
      this.view.m[1][2],
      this.view.m[2][2],
    );

    this.vp = this.view.mul(this.proj);
  } /** End of 'set' function */

  /**
   * @info Mouse parallel function
   * @returns none
   */
  public mouseParallel(): void {
    let dv: vec3;
    let sx: number;
    let sy: number;

    this.wp = this.projSize;
    this.hp = this.projSize;
    if (this.frameW > this.frameH) this.wp *= this.frameW / this.frameH;
    else this.wp *= this.frameH / this.frameW;

    sx =
      (((-input.mouseDX * this.wp) / this.frameW) * this.dist) /
      this.projSize /
      2;
    sy =
      (((input.mouseDY * this.hp) / this.frameH) * this.dist) /
      this.projSize /
      2;

    dv = this.right
      .mulNum(sx)
      .add(this.up.mulNum(sy));

    dv.mulNum(0.5 + Number(input.isLctrl) * 3);
    this.at = this.at.add(dv);
    this.loc = this.loc.add(dv);
  } /** End of 'mouseParallel' function */
} /** End of 'camera' class */

/** EXPORTS */
export { camera };

/** END OF 'camera.ts' FILE */
