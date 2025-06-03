/* FILE NAME   : gpu.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import { shader } from "./shaders.js";

// Vertex attributes
const vertexAttributes = [
  {
    attributes:[
      {
        shaderLocation: 0,
        offset: 0,
        format: "float32x4"
      },
      {
        shaderLocation: 1,
        offset: 16,
        format: "float32x4"
      }
    ],
    arrayStride: 32,
    stepMode: "vertex"
  }
];

/** Gpu class */
class gpu {
  /** #public parameters */
  public adapter: any;         // GPUAdepter
  public device: any;          // GPUDevice
  public shader1: any;         // GPUShaderModule
  public descriptor: object;   // Pipeline descriptor
  public renderPipeline: any;  // Render pipline

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
    this.shader1.createShader("main", this.device);

    // set pipeline descriptor
    this.decriptor = {
      vertex: {
        shaderModule: this.shader1,
        entryPoint: "vertex_main",
        buffers: vertexAttributes
      },
      fragment: {
        shaderModule: this.shader1,
        entryPoint: "fragment_main",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat()
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      },
      layout: "auto"
    };
    
    // create render pipeline
    this.renderPipeline = this.device.createRenderPipeline(descriptor);
  } /** End of 'Initialize' function */
} /** End of 'gpu' class */

/** EXPORTS */
export { gpu };

/** END OF 'gpu.ts' FILE */
