/* FILE NAME   : core.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 13.06.2025
 */

/** Core class */
class core {
  /** #public parameters */
  public adapter: any; // GPUAdepter
  public device: GPUDevice; // GPUDevice
  public queue: any; // GPUQueue
  public context: any; // GPUCanvasContext
  public defTextureFormat: any; // GPUTextureFormat
  public defDepthTextureFormat: any; // GPUTextureFormat
  public defSwapchainTextureFormat: any; // GPUTextureFormat

  /** #public parameters */
  /**
   * @info Initialize webGPU function
   * @param Canvas elemant id
   */
  public async webGPUInit(id: Element): Promise<any> {
    const canvas = id as HTMLCanvasElement;

    // check webGPU support
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    // get adapter
    this.adapter = await navigator.gpu.requestAdapter();

    // get device
    this.device = await this.adapter.requestDevice();

    // get queue
    this.queue = await this.device.queue;

    // Create context
    this.context = canvas.getContext("webgpu");

    // Set default texture formats
    this.defSwapchainTextureFormat =
      await navigator.gpu.getPreferredCanvasFormat();
    this.defTextureFormat = "rgba32float";
    this.defDepthTextureFormat = "depth32float";

    // Configure context
    this.context.configure({
      device: this.device,
      format: this.defSwapchainTextureFormat,
    });
  } /** End of 'webGPUInit' function */
} /** End of 'core' class */

/** EXPORTS */
export { core };

/** END OF 'core.ts' FILE */
