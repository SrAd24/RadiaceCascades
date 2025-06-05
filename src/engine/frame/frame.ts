/* FILE NAME   : frame.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { render } from "../render/render.ts";

/** Frame class */
class frame {
  /** #private parameters */
  private rnd: render | undefined;
  private canvasID: Element | null;

  // /** #public parameters */
  // /**
  //  * @info Class constructor
  //  * @param core: gpu
  //  */
  // public constructor() {
  // } /** End of 'constructor' function */

  /** #public parameters */
  /**
   * @info Initialize frame function
   * @param id: string
   */
  public constructor(id: string) {
    this.canvasID = document.querySelector("#" + id);
    if (this.canvasID == null) throw Error("Canvas is undefined");
    this.rnd = new render();
    this.rnd.init(this.canvasID);
  } /** End of 'constructor' function */

  /** #public parameters */
  /**
   * @info Set loop to frame function
   * @param id: string
   */
  public mainloop() {
    const draw = () => {
      if (this.rnd == undefined) throw Error("Render is undefined");
      this.rnd.render();
      window.requestAnimationFrame(draw);
    };
    draw();
  } /** End of 'mainloop' function */
} /** End of 'Render' class */

/** EXPORTS */
export { frame };

/** END OF 'frame.ts' FILE */
