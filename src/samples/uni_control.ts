/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import * as mth from "../math/mth.ts";
import { unit, input, timer } from "../anim/anim.ts";

/** Unit control class */
class _uni_control extends unit {
  /** #public parameters */
  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {} /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async response(render: any): Promise<any> {
    /* Changing positions of camera and point where it is attached */
    let loc: mth.vec3 = render.cam.loc;
    let at: mth.vec3 = render.cam.at;
    render.cam.set(at, loc, new mth.vec3(0, 1, 0));

    /** Get canvas id */
    const canvas = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );

    /* Handle camera orienntation */
    render.cam.setOrientation();

    render.cam.deltaAzimuth = -0.15 * input.isClick * input.mouseDX;
    render.cam.azimuth += render.cam.deltaAzimuth;

    render.cam.deltaElevator = -0.15 * input.isClick * input.mouseDY;
    render.cam.elevator -= render.cam.deltaElevator;

    if (render.cam.elevator < 0.08) render.cam.elevator = 0.08;
    else if (render.cam.elevator > 178.9) render.cam.elevator = 178.9;

    /* Setup result camera */
    if (
      Math.abs(render.cam.deltaAzimuth) > 0 ||
      Math.abs(render.cam.deltaElevator) > 0
    ) {
      /* Setting new position of attached point */
      render.cam.set(
        mth.mat4
          .rotateX(render.cam.elevator)
          .mul(mth.mat4.rotateY(render.cam.azimuth))
          .mul(mth.mat4.translate(render.cam.at))
          .TransformPoint(new mth.vec3(0, render.cam.dist, 0)),
        render.cam.at,
        new mth.vec3(0, 1, 0),
      );
      render.cam.at = render.cam.loc;
    }

    /* Changing positions of camera and point where it is attached */
    render.cam.set(loc, at, new mth.vec3(0, 1, 0));

    /* Handle camera position by mouse */
    if (input.isClickR) render.cam.mouseParallel(input);

    /* Setting new params */
    render.cam.setOrientation();
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(
    render: any,
  ): Promise<any> {} /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async destroy(
    render: any,
  ): Promise<any> {} /** End of 'init' function */
} /** End of '_uni_control' class */

// Test unit
const uni_control: _uni_control = new _uni_control();

/** EXPORTS */
export { uni_control };

/** END OF 'test_unit.ts' FILE */
