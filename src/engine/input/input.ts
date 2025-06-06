/* FILE NAME   : input.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 06.06.2025
 */

/** IMPORTS */
import * as mth from "../../math/mth.ts";

/** Input class */
class _input {
  /** #public parameters */
  public mouseX: number = 0;
  public mouseY: number = 0;
  public mouseDX: number = 0;
  public mouseDY: number = 0;
  public isCLick: boolean = false;
  public isCLickR: boolean = false;
  public canvasID: any;

  /**
   * @info Class constructor
   * @param canvasID: any
   */
  public constructor() {
    this.canvasID = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );

    this.canvasID.addEventListener("mousedown", (event: any) => {
      if (event.button === 0) this.isCLick = true;
      if (event.button === 2) this.isCLickR = true;

      const rect = this.canvasID.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;

      console.log(`Mouse clicked at (${this.mouseX}, ${this.mouseY})`);
    });
    this.canvasID.addEventListener("mouseup", (event: any) => {
      if (event.button === 0) this.isCLick = false;
      if (event.button === 2) this.isCLickR = false;

      console.log(`Mouse released`);
    });
    this.canvasID.addEventListener("mousemove", (event: any) => {
      const rect = this.canvasID.getBoundingClientRect();
      this.mouseDX = event.clientX - rect.left;
      this.mouseDY = event.clientY - rect.top;

      console.log(`Mouse moved (${this.mouseDX}, ${this.mouseDY})`);
    });
  } /** End of constructor */
} /** End of '_input' class */

/** Input variable */
const input: _input = new _input();

/** EXPORTS */
export { input };

/** END OF 'input.ts' FILE */
