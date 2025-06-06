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
  public mouseZ: number = 0;
  public mouseDX: number = 0;
  public mouseDY: number = 0;
  public mouseDZ: number = 0;
  public mouseWheel: number = 0;
  public isCLick: boolean = false;
  public isCLickR: boolean = false;
  public isCLickM: boolean = false;
  public canvasID: any;
  public bodyID: any;
  public isControl: boolean = false;

  /**
   * @info Class constructor
   * @param canvasID: any
   */
  public constructor() {
    this.canvasID = document.querySelector(
      "#The_only_normal_group_for_the_entire_time_at_the_CGSG",
    );
    this.bodyID = document.querySelector("#body");
    document.addEventListener("keydown", (event: any) => {
      if (event.keyCode == 16) {
        this.isControl = true;
      }
    });
    document.addEventListener("keyup", (event: any) => {
      if (event.keyCode == 16) {
        this.isControl = false;
      }
    });
    this.canvasID.addEventListener("contextmenu", (event: any) => {
      event.preventDefault();
    });
    this.bodyID.addEventListener("mousedown", (event: any) => {
      this.mouseDX = this.mouseDY = 0;
      if (event.button === 0) this.isCLick = true;
      else if (event.button === 2) this.isCLickR = true;
      if (event.button === 1) this.isCLickM = true;
    });
    this.bodyID.addEventListener("mouseup", (event: any) => {
      if (event.button === 0) this.isCLick = false;
      if (event.button === 2) this.isCLickR = false;
    });
    this.canvasID.addEventListener("wheel", (event: WheelEvent) => {
      event.preventDefault();
      this.mouseDZ = event.deltaY;
    });
    this.canvasID.addEventListener("mouseleave", (event: any) => {
      this.isCLick = false;
      this.isCLickR = false;
      this.mouseDX = 0;
      this.mouseDY = 0;
    });
    this.bodyID.addEventListener("mousemove", (event: any) => {
      const rect = this.canvasID.getBoundingClientRect();

      if (
        event.clientX - rect.left > 0 &&
        event.clientX - rect.left < this.canvasID.width &&
        event.clientY - rect.top > 0 &&
        event.clientY - rect.top < this.canvasID.height &&
        ((this.isCLick && !this.isCLickR) || (this.isCLickR && !this.isCLick))
      ) {
        this.mouseDX = event.clientX - this.mouseX;
        this.mouseDY = event.clientY - this.mouseY;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });
  } /** End of constructor */

  /**
   * @info Response function
   * @returns none
   */
  public async response(): Promise<any> {
    this.mouseDX = this.mouseDY = 0;
  } /** End of 'response' function */
} /** End of '_input' class */

/** Input variable */
const input: _input = new _input();

/** EXPORTS */
export { input };

/** END OF 'input.ts' FILE */
