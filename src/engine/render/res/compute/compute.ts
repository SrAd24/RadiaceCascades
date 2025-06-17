/* FILE NAME   : compute.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** Compute class */
class compute {
  /** Private parameters */
  private computePipeline: any; // GPU compute pipeline object
  private bindGroups: any; // GPU binging group object

  /**
   * @info create compute pipeline function
   * @param device: any
   * @param computeShader: GPUShaderModule
   * @param bindGroupLayouts: GPUBindGroupLayouts[]
   * @param bindGroups: GPUBindGroup[]
   * @returns none
   */
  public createComputePipeline(
    device: any,
    computeShader: GPUShaderModule,
    bindGroupLayouts: GPUBindGroupLayout[],
    bindGroups: GPUBindGroup[],
  ): void {
    this.bindGroups = bindGroups;
    let shaderModule: GPUShaderModule = computeShader;
    this.computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: bindGroupLayouts,
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
   * @param secondGroup: GPUBindGroup
   * @returns none
   */
  public dispatch(
    device: any,
    workGroupCoountX: number,
    workGroupCoountY: number,
    secondGroup: GPUBindGroup, // if someone sees this, please score on this crutch
  ): void {
    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.computePipeline);
    passEncoder.setBindGroup(0, this.bindGroups[0]);
    passEncoder.setBindGroup(1, secondGroup);
    passEncoder.dispatchWorkgroups(workGroupCoountX, workGroupCoountY);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  } /** End of 'dispatch' function */
} /** End of 'compute' class */

/** EXPORTS */
export { compute };

/** END OF 'compute.ts' FILE */
