/* FILE NAME   : anim.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { dict } from "./units/dictionary.ts";
import { render } from "../engine/render/render.ts";

/** Animation class */
class anim {
  /** #private parameters */
  private rnd: render = new render();

  /** #public parametes */
  public constructor() {} /** End of constructor */

  /**
   * @info render initialize function
   * @param canvas: string
   * @returns none
   */
  public async init(canvas: string): Promise<any> {
    // initialize render
    console.log("Render initialization started");
    const canvasId: Element | null = document.querySelector(canvas);
    if (canvasId == null) throw Error("Canvas is undefined");
    await this.rnd.init(canvasId);
    console.log("Render initialization ended");

    // initialize units
    console.log("Unit initialization started, unit cout: ", dict.units.length);
    dict.units.forEach((unit, index) => {
      unit.init(this.rnd);
    });
    console.log("Unit initialization ended");
  } /** End of 'init' function */

  /**
   * @info render function
   * @returns none
   */
  public async render(): Promise<any> {
    dict.units.forEach((unit, index) => {
      unit.render(this.rnd);
    });
  } /** Ebd of 'render' function */

  /**
   * @info response function
   * @returns none
   */
  public async response(): Promise<any> {
    dict.units.forEach((unit, index) => {
      unit.response(this.rnd);
    });
  } /** End of 'response' function */

  /**
   * @info destroy function
   * @returns none
   */
  public async destroy(): Promise<any> {
    dict.units.forEach((unit, index) => {
      unit.destroy(this.rnd);
    });
  } /** End of 'destroy' function */
} /** End of 'anim' class */

/** EXPORTS */
export { anim };

/** END OF 'anim.ts' FILE */
