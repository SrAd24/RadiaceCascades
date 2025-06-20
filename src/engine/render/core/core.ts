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
  public adapter!: GPUAdapter; // Adepter
  public device!: GPUDevice; // Device
  public queue!: GPUQueue; // Queue
  public context!: GPUCanvasContext; // Canvas context
  public defDepthTextureFormat!: GPUTextureFormat; // Texture format
  public defSwapchainTextureFormat!: GPUTextureFormat; // Texture format

  /** #public parameters */
  /**
   * @info Initialize webGPU function
   * @param Canvas elemant id
   */
  public async webGPUInit(id: Element) {
    const canvas = id as HTMLCanvasElement;
    // check webGPU support
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    // get adapter
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      alert("No GPU adapter found");
      throw Error("No GPU adapter found");
    }
    this.adapter = adapter;

    // get device
    this.device = await this.adapter.requestDevice();

    // get queue
    this.queue = this.device.queue;

    // Create context
    const context = canvas.getContext("webgpu");
    if (!context) {
      alert("Failed to get WebGPU context");
      throw new Error("Failed to get WebGPU context");
    }
    this.context = context;

    // Set default texture formats
    this.defSwapchainTextureFormat = navigator.gpu.getPreferredCanvasFormat();
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
