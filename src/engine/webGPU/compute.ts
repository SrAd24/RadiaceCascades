/* FILE NAME   : compute.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** IMPORTS */
import { shader } from "./shaders.ts";

/** Compute class */
class compute {
  /**
   * @info create compute pipeline function
   * @returns none
   */
  public createComputePipeline(): void {
    /*
    computeShader.createShader();

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        },
      ],
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: inputBuffer }
        },
        {
          binding: 1,
          resource: { buffer: resultBuffer }
        },
      ],
    });

    const computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout,]
      }),
      compute: {
        module, // yuqorida yaratilgan hisoblash moduli
      },
    });

    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1);
    passEncoder.end();
    commandEncoder.copyBufferToBuffer(resultBuffer, 0, stagingBuffer, 0, 4);
    device.queue.submit([commandEncoder.finish()]);
    */
  } /** End of 'createComputePipeline' function */
} /** End of 'compute' class */

/** EXPORTS */
export { compute };

/** END OF 'compute.ts' FILE */
