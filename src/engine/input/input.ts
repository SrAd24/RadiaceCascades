/* FILE NAME   : input.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

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
  public isLctrl: boolean = false;
  public canvasID: any;
  public bodyID: any;
  public isControl: boolean = false;
  public arrows: any = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  public wasd: any = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

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
      if (event.keyCode == 17) {
        this.isLctrl = true;
      }

      if (event.keyCode == 37) {
        this.arrows.left = true;
      } else if (event.keyCode == 38) {
        this.arrows.up = true;
      } else if (event.keyCode == 39) {
        this.arrows.right = true;
      } else if (event.keyCode == 40) {
        this.arrows.down = true;
      }
      if (event.keyCode == 87) {
        this.wasd.w = true;
      }
      if (event.keyCode == 65) {
        this.wasd.a = true;
      }
      if (event.keyCode == 68) {
        this.wasd.d = true;
      }
      if (event.keyCode == 83) {
        this.wasd.s = true;
      }
    });
    document.addEventListener("keyup", (event: any) => {
      if (event.keyCode == 16) {
        this.isControl = false;
      }
      if (event.keyCode == 17) {
        this.isLctrl = false;
      }
      if (event.keyCode == 37) {
        this.arrows.left = false;
      } else if (event.keyCode == 38) {
        this.arrows.up = false;
      } else if (event.keyCode == 39) {
        this.arrows.right = false;
      } else if (event.keyCode == 40) {
        this.arrows.down = false;
      }
      if (event.keyCode == 87) {
        this.wasd.w = false;
      }
      if (event.keyCode == 65) {
        this.wasd.a = false;
      }
      if (event.keyCode == 68) {
        this.wasd.d = false;
      }
      if (event.keyCode == 83) {
        this.wasd.s = false;
      }
    });
    this.canvasID.addEventListener("contextmenu", (event: any) => {
      event.preventDefault();
    });
    this.bodyID.addEventListener("mousedown", (event: any) => {
      this.mouseDX = this.mouseDY = 0;
      if (event.button === 0) this.isCLick = true;
      else if (event.button === 2) this.isCLickR = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
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
        true
        /*
        event.clientX - rect.left > 0 &&
        event.clientX - rect.left < this.canvasID.width &&
        event.clientY - rect.top > 0 &&
        event.clientY - rect.top < this.canvasID.height &&
        ((this.isCLick && !this.isCLickR) || (this.isCLickR && !this.isCLick)
        )*/
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
