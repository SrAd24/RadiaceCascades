/* FILE NAME   : compute.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { shader } from "./shaders.ts";

/** Compute class */
class compute {
  /** Private parameters */
  private computePipeline: any; // GPU compute pipeline object
  private computeShader: any; // Compute shader
  private bindGroup: any; // GPU binging group object

  /**
   * @info create compute pipeline function
   * @param device: any
   * @param computeShader: shader
   * @param bindGroupLayout: any
   * @param bindGroup: any
   * @returns none
   */
  public createComputePipeline(
    device: any,
    computeShader: shader,
    bindGroupLayout: any,
    bindGroup: any,
  ): void {
    this.computeShader = computeShader;
    this.bindGroup = bindGroup;
    let shaderModule: GPUShaderModule | undefined = computeShader.shaderModule;
    this.computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: shaderModule,
        entryPoint: "main",
      },
    });
  } /** End of 'createComputePipeline' function */

  /**
   * @info Dispatch work groups function
   * @param device: any
   * @param workGroupCoountX: number
   * @param workGroupCoountY: number
   * @returns none
   */
  public dispatch(
    device: any,
    workGroupCoountX: number,
    workGroupCoountY: number,
  ): void {
    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.computePipeline);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.dispatchWorkgroups(workGroupCoountX, workGroupCoountY);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  } /** End of 'dispatch' function */
} /** End of 'compute' class */

/** EXPORTS */
export { compute };

/** END OF 'compute.ts' FILE */
