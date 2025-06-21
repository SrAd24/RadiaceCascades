/* FILE NAME   : uni_control.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit control class */
class _uni_control extends unit {
  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {} /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    if (input.isControl) {
      /* Handle camera orienntation */
      ani.cam.setOrientation();

      ani.cam.azimuth +=
        (input.isCLick == true ? 1 : 0) *
          timer.globalDeltaTime *
          3 *
          (-5.0 * input.mouseDX) +
        ((input.arrows.left ? 1 : 0) * -0.5 +
          (input.arrows.right ? 1 : 0) * 0.5) *
          (1 + Number(input.isLctrl) * 5);

      ani.cam.elevator +=
        (input.isCLick == true ? 1 : 0) *
          timer.globalDeltaTime *
          2 *
          (5.0 * input.mouseDY) +
        ((input.arrows.up ? 1 : 0) * -0.5 + (input.arrows.down ? 1 : 0) * 0.5) *
          (1 + Number(input.isLctrl) * 5);

      if (ani.cam.elevator < 0.08) ani.cam.elevator = 0.08;
      else if (ani.cam.elevator > 178.9) ani.cam.elevator = 178.9;

      ani.cam.dist +=
        -(0.007 * input.mouseDZ) * (1 + Number(input.isLctrl) * 5);
      if (ani.cam.dist < 0.1) ani.cam.dist = 0.1;

      /* Setting new position of attached point */
      ani.cam.set(
        mat4
          .rotateX(ani.cam.elevator)
          .mul(mat4.rotateY(ani.cam.azimuth))
          .mul(mat4.translate(ani.cam.at))
          .TransformPoint(new vec3(0, ani.cam.dist, 0)),
        ani.cam.at,
        new vec3(0, 1, 0),
      );
      if (input.isCLickR) {
        ani.cam.mouseParallel(input);
        ani.cam.set(ani.cam.loc, ani.cam.at);
      }
    }

    input.mouseDX = input.mouseDY = input.mouseDZ = 0;
  } /** End of 'responce' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(
    ani: anim,
  ): Promise<any> {} /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(
    ani: anim,
  ): Promise<any> {} /** End of 'destroy' function */
} /** End of '_uni_control' class */

const uni_control: _uni_control = new _uni_control();

/** EXPORTS */
export { uni_control };

/** END OF 'uni_control.ts' FILE */
