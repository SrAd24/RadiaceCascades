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

/** Gpu class */
class gpu {
  /** #public parameters */
  public adapter: any; // GPUAdepter
  public device: any; // GPUDevice
  public shader1: any; // GPUShaderModule
  public computeShader: any;  // Compute shader
  public renderPipeline: any; // Render pipline

  /**
   * @info Initialize webGPU function
   * @returns none
   */
  public async initialize(): Promise<any> {
    // check webGPU support
    if (!navigator.gpu) {
      alert("Web gpu not supported");
      throw Error("Web gpu not supported");
    }

    // get adapter
    this.adapter = await navigator.gpu.requestAdapter();

    if (this.adapter == null) {
      alert("Can`t get adapter");
      throw Error("Can`t get adapter");
    }

    // get device
    this.device = await this.adapter.requestDevice();

    // create shader
    this.shader1 = new shader();
    await this.shader1.createShader("main", this.device);
    this.computeShader = new shader();
    await this.computeShader.createShader("merge_compute", this.device);

    if (this.shader1.shaderModule == undefined)
      throw Error("Shader is undefined");
    if (this.computeShader.shaderModule == undefined)
      throw Error("Compute shader is undefined");

    // set descrptor parameters
    const layout = "auto"; // todo @th4: change to manual
    const primitive: GPUPrimitivesState = {
      topology: "triangle-list",
    };
    const fragment: GPUFragmentState = {
      module: this.shader1.shaderModule,
      entryPoint: "fragment_main",
      targets: [
        {
          format: "bgra8unorm",
        },
      ],
    };
    const vertex: GPUVertexState = {
      module: this.shader1.shaderModule,
      entryPoint: "vertex_main",
      buffers: vertexAttributes,
    };

    // create depth stencil
    const depthStencil: any = {
      format: "depth32float",
      depthWriteEnabled: true,
      depthCompare: "less",
    };

    // set pipeline descriptor
    const descriptor = {
      vertex,
      fragment,
      primitive,
      layout,
      depthStencil: depthStencil,
    };

    // create render pipeline
    this.renderPipeline = this.device.createRenderPipeline(descriptor);
  } /** End of 'Initialize' function */
} /** End of 'gpu' class */

/** EXPORTS */
export { gpu };

/** END OF 'gpu.ts' FILE */
