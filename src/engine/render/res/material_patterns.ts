/* FILE NAME   : shaders.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

import { resources } from "../res-types";

const vertexAttributes = [
  {
    arrayStride: 12 * 4,
    attributes: [
      // Position
      {
        shaderLocation: 0,
        offset: 0,
        format: "float32x3"
      },
      // Texture
      {
        shaderLocation: 1,
        offset: 12,
        format: "float32x2"
      },
      // Normal
      {
        shaderLocation: 2,
        offset: 20,
        format: "float32x3"
      },
      // Color
      {
        shaderLocation: 3,
        offset: 32,
        format: "float32x4"
      }
    ],
  }
];

/** Shader class */
class material_pattern {
  /** #private parameters */
  private shaderModule: GPUShaderModule | undefined; // Shader module variable
  public pipeline: GPURenderPipeline | undefined;

  constructor(private core: resources) {}
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  private async readShader(shaderName: String): Promise<string> {
    const response = await fetch("src/engine/render/res/shds/main/main.wgsl");

    if (!(response).ok) {
      throw Error("can`t read shader");
    }
    const data = await response.text();

    return data;
  } /** End of 'readShader' function */

  public async createMaterialPattern(shaderName: string): Promise<any> {
    const device = await this.core.getDevice();
    const shaderCode = await this.readShader(shaderName);

    this.shaderModule = await device.createShaderModule({
      code: shaderCode,
    });
    this.pipeline = await device.createRenderPipeline({
      vertex: {
        module: this.shaderModule,
        entryPoint: "vertex_main",
        buffers: vertexAttributes,
      },
      fragment: {
        module: this.shaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
        frontFace: "ccw"
      },
      layout: "auto",
      depthStencil: {
        format: "depth32float", 
        depthWriteEnabled: true,
        depthCompare: "less"
      }
    });
    return this;
  }
} /** End of 'shader' class */

/** EXPORTS */
export { material_pattern };

/** END OF 'shaders.ts' FILE */
