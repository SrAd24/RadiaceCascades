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
import { unit, input, timer } from "../engine/anim/anim";

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
    //render.cam.set(at, loc, new mth.vec3(0, 1, 0));

    /** Get canvas id */
    //await input.response();
    const canvas = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );
    console.log(input.isControl);
    if (input.isControl) {
      /* Handle camera orienntation */
      render.cam.setOrientation();

      render.cam.azimuth +=
        (input.isCLick == true ? 1 : 0) *
        timer.globalDeltaTime *
        3 *
        (-5.0 * input.mouseDX);

      render.cam.elevator +=
        (input.isCLick == true ? 1 : 0) *
        timer.globalDeltaTime *
        2 *
        (5.0 * input.mouseDY);

      if (render.cam.elevator < 0.08) render.cam.elevator = 0.08;
      else if (render.cam.elevator > 178.9) render.cam.elevator = 178.9;

      render.cam.dist += -(0.007 * input.mouseDZ);
      if (render.cam.dist < 0.1) render.cam.dist = 0.1;

      /* Setup result camera */
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
      render.cam.set(render.cam.loc, render.cam.at, render.cam.up);
      if (input.isCLickR) {
        render.cam.mouseParallel(input);
        render.cam.set(render.cam.loc, render.cam.at);
      }
      input.mouseDX = input.mouseDY = input.mouseDZ = 0;
    }
    //render.cam.set(loc, at, new mth.vec3(0, 1, 0));

    //console.log(render.cam.at)
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
