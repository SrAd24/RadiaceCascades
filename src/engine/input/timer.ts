/* FILE NAME   : timer.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 07.06.2025
 */

/** Timer class */
class _timer {
  /** #private parameters */
  private startTime: number = 0;
  private oldTime: number = 0;
  private oldTimeFPS: number = 0;
  private pauseTime: number = 0;
  private frameCounter: number = 0;

  /** #private parameters */
  /**
   * @info Get time function
   * @returns none
   */
  private getTime = () => {
    const date = new Date();
    let t =
      date.getMilliseconds() / 1000.0 +
      date.getSeconds() +
      date.getMinutes() * 60;
    return t;
  }; /** End of 'getTime' function */

  /** #public parameters */
  public globalTime: number = 0;
  public globalDeltaTime: number = 0;
  public time: number = 0;
  public deltaTime: number = 0;
  public FPS: number = 30;
  public isPause: boolean = false;

  public initTimer = () => {
    this.globalTime = this.time = this.getTime();
    this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
  };

  // Timer response method
  public async responseTimer() {
    let t = this.getTime();
    // Global time
    this.globalTime = t;
    this.globalDeltaTime = t - this.oldTime;
    // Time with pause
    if (this.isPause) {
      this.deltaTime = 0;
      this.pauseTime += t - this.oldTime;
    } else {
      this.deltaTime = this.globalDeltaTime;
      this.time = t - this.pauseTime - this.startTime;
    }
    // FPS
    this.frameCounter++;
    if (t - this.oldTimeFPS > 1) {
      this.FPS = this.frameCounter / (t - this.oldTimeFPS);
      this.oldTimeFPS = t;
      this.frameCounter = 0;
      this.FPS = Number(this.FPS.toFixed(3));
    }
    this.oldTime = t;
  }
} /** End of 'timer' class */

/** Timer variable */
const timer: _timer = new _timer();

/** EXPORTS */
export { timer };

/** END OF 'timer.ts' FILE */
