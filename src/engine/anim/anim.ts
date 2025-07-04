/* FILE NAME   : anim.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 21.06.2025
 */

/** IMPORTS */
import { dict } from "./units/dictionary";
import { render } from "../render/render";
import { unit } from "./units/units";
import "vrc.ts";

/** Animation class */
class anim extends render {
  /** #public parameters */
  public canvasId: Element | null = null;

  /**
   * @info render initialize function
   * @param canvas: string
   * @returns none
   */
  public async init(canvas: string) {
    // initialize render
    this.canvasId = document.querySelector("#" + canvas);
    if (this.canvasId == null) throw Error("Canvas is undefined");

    await this.initialization(this.canvasId);

    for (let i = 0; i < dict.units.length; i++) {
      await dict.units[i].init(this);
    }
  } /** End of 'init' function */

  /**
   * @info render function
   * @returns none
   */
  public async renderUnits(): Promise<any> {
    for (let i = 0; i < dict.units.length; i++) {
      await dict.units[i].render(this);
    }
  } /** Ebd of 'render' function */

  /**
   * @info response function
   * @returns none
   */
  public async responseUnits(): Promise<any> {
    for (let i = 0; i < dict.units.length; i++) {
      await dict.units[i].response(this);
    }
  } /** End of 'response' function */

  /**
   * @info destroy function
   * @returns none
   */
  public async destroyUnits(): Promise<any> {
    for (let i = 0; i < dict.units.length; i++) {
      await dict.units[i].destroy(this);
    }
  } /** End of 'destroy' function */

  /** #public parameters */
  /**
   * @info Set loop to frame function
   * @param id: string
   */
  public async mainloop() {
    const draw = async () => {
      // Responce additional systems
      timer.response();
      input.response()

      // Responce units
      await this.responseUnits();

      // Start rendering
      // await this.renderStart();

      // Render units
      await this.renderUnits();

      await this.frameRendering();

      // Render end
      // await this.renderEnd();
      window.requestAnimationFrame(draw);
    };
    await draw();
  } /** End of 'mainloop' function */
} /** End of 'anim' class */

/** EXPORTS */
export { anim, unit, input, timer };

/** END OF 'anim.ts' FILE */
