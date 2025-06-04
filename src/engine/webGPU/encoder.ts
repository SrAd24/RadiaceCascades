/* FILE NAME   : encoder.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** Encoder render path variables */
const clearColor = { r: 0, g: 1, b: 0.5, a: 1 }; // Clear color

/** Encoder class */
class encoder {
  /** #public parameters */
  public gpuEncoder: GPUEncoder | undefined;
  public renderpathDescription: any;
  public renderPath: any;

  /**
   * @info Class constructor
   */
  public constructor() {} /** End of constructor */

  /**
   * @info Create depth buffer function
   * @param width: number
   * @param height: number
   * @param device: any
   * @returns depth info
   */
  public createDepthTexture(width: number, height: number, device: any): any {
    // create depth texture
    const depthTexture: any = device.createTexture({
      size: [width, height],
      format: "depth32float",
      mip_level_count: 1,
      sample_count: 1,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // create depth stencil
    const depthStencil: any = {
      format: "depth32float",
      depthWriteEnabled: true,
      depthCompare: "less",
    };

    return { tex: depthTexture, sten: depthStencil };
  } /** End of 'createDepthTexture' function */

  /**
   * @info Craete encoder function
   * @param device: any
   * @param context: any
   * @param canvasID: any
   * @returns none
   */
  public createEncoder(device: any, context: any, canvasID: any): void {
    let depth: any = this.createDepthTexture(
      canvasID.width,
      canvasID.height,
      device,
    );

    this.gpuEncoder = device.createCommandEncoder();
    this.renderpathDescription = {
      colorAttachments: [
        {
          clearValue: clearColor,
          loadOp: "clear",
          storeOp: "store",
          view: context.getCurrentTexture().createView(),
        },
      ],
      depthStencilAttachment: {
        view: depth.tex.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };
  } /** End of 'createEncoder' function */

  /**
   * @info Begin render pass function
   * @param context: any
   * @param pipeline: any
   * @param buffer: any
   * @returns none
   */
  public beginRenderPass(context: any, pipeline: any, buffer: any): void {
    // begin render pass
    this.renderPath = this.gpuEncoder.beginRenderPass(
      this.renderpathDescription,
    );

    // set pipeline
    this.renderPath.setPipeline(pipeline);
    // set vertex buffer
    this.renderPath.setVertexBuffer(0, buffer);
    // draw triangle
    this.renderPath.draw(3);
  } /** End of 'beginRenderPass' function */

  /**
   * @info End render pass function
   * @param device: any
   * @returns none
   */
  public endRenderPass(device: any): void {
    // end render pass
    this.renderPath.end();

    // submit queue
    device.queue.submit([this.gpuEncoder.finish()]);
  } /** End of 'endRenderPass' function */
} /** End of 'encoder' function */

/** EXPORTS */
export { encoder };

/** END OF 'encoder.ts' FILE */
