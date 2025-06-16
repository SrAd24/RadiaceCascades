/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { render } from "engine/render/render";
import { vrc } from "vrc";

/** Unit control class */
class _uni_control extends vrc.unit {
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
  public async response(render: render): Promise<any> {
    let x = new std(1, 2);
    console.log(x);

    if (vrc.input.isControl) {
      /* Handle camera orienntation */
      render.cam.setOrientation();

      render.cam.azimuth +=
        (vrc.input.isCLick == true ? 1 : 0) *
          vrc.timer.globalDeltaTime *
          3 *
          (-5.0 * vrc.input.mouseDX) +
        (vrc.input.arrows.left ? 1 : 0) * -0.5 +
        (vrc.input.arrows.right ? 1 : 0) * 0.5;

      render.cam.elevator +=
        (vrc.input.isCLick == true ? 1 : 0) *
          vrc.timer.globalDeltaTime *
          2 *
          (5.0 * vrc.input.mouseDY) +
        (vrc.input.arrows.up ? 1 : 0) * -0.5 +
        (vrc.input.arrows.down ? 1 : 0) * 0.5;

      if (render.cam.elevator < 0.08) render.cam.elevator = 0.08;
      else if (render.cam.elevator > 178.9) render.cam.elevator = 178.9;

      render.cam.dist += -(0.007 * vrc.input.mouseDZ);
      if (render.cam.dist < 0.1) render.cam.dist = 0.1;

      /* Setup result camera */
      /* Setting new position of attached point */
      render.cam.set(
        vrc.mat4
          .rotateX(render.cam.elevator)
          .mul(vrc.mat4.rotateY(render.cam.azimuth))
          .mul(vrc.mat4.translate(render.cam.at))
          .TransformPoint(vrc.vec3(0, render.cam.dist, 0)),
        render.cam.at,
        vrc.vec3(0, 1, 0),
      );
      //render.cam.set(render.cam.loc, render.cam.at, render.cam.up);
      if (vrc.input.isCLickR) {
        render.cam.mouseParallel(vrc.input);
        render.cam.set(render.cam.loc, render.cam.at);
      }
    }

    vrc.input.mouseDX = vrc.input.mouseDY = vrc.input.mouseDZ = 0;
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
