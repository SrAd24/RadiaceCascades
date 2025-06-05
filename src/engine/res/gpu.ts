/* FILE NAME   : gpu.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** IMPORTS */
import { shader } from "./shaders.ts";

// Vertex attributes
const vertexAttributes = [
  {
    attributes: [
      {
        shaderLocation: 0,
        offset: 0,
        format: "float32x4",
      },
      {
        shaderLocation: 1,
        offset: 16,
        format: "float32x4",
      },
    ],
    arrayStride: 32,
    stepMode: "vertex",
  },
];

interface texture {
  texture: GPUTexture;
  view: GPUTextureView;
}

interface att {
  attTexture: texture;
  depthTexture: texture;
}

/** Gpu class */
class gpu {
  public attachmets: att | undefined;

  /** #public parameters */
  public adapter: any; // GPUAdepter
  public device: any; // GPUDevice
  public queue: any; // GPUQueue
  public swapchain: any; // GPUSwapchain
  public context: any; // GPUCanvasContext
  public shader1: any; // GPUShaderModule
  public computeShader: any; // Compute shader
  public renderPipeline: any; // Render pipline

  /**
   * @info Initialize webGPU function
   * @returns none
   */
  public async init(id: Element): Promise<any> {
    const canvas = id as HTMLCanvasElement;

    if (!this.attachmets) {
      this.attachmets = {
        attTexture: { texture: null, view: null }, // Initialize with null or appropriate default values
        depthTexture: { texture: null, view: null }, // Initialize with null or appropriate default values
      };
    }

    // check webGPU support
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    // get adapter
    this.adapter = await navigator.gpu.requestAdapter();

    if (!this.adapter) {
      alert("Can`t get adapter");
      throw Error("Can`t get adapter");
    }

    // get device
    this.device = await this.adapter.requestDevice();

    // get queue
    this.queue = this.device.queue;

    // Create context
    this.context = canvas.getContext("webgpu");

    // Create swapchain descriptor
    console.log(canvas.width, canvas.height);
    this.context.width = canvas.width;
    this.context.height = canvas.height;

    this.context.configure({
      device: this.device,
      format: "bgra8unorm",
    });

    // this.attachmets.depthTexture.texture = await this.device.createTexture({
    //   size: [canvas.width, canvas.height],
    //   format: "depth32float",
    //   mip_level_count: 1,
    //   sample_count: 1,
    //   usage: GPUTextureUsage.RENDER_ATTACHMENT,
    // });

    this.attachmets.attTexture.texture = this.context.getCurrentTexture();
    this.attachmets.attTexture.view = this.context
      .getCurrentTexture()
      .createView();
    // console.log(await this.shader1.shaderModule.getCompilationInfo());
  } /** End of 'Initialize' function */
} /** End of 'gpu' class */

/** EXPORTS */
export { gpu };

/** END OF 'gpu.ts' FILE */
