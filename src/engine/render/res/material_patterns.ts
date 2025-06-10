/* FILE NAME   : material_pattern.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
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
        format: "float32x3",
      },
      // Texture
      {
        shaderLocation: 1,
        offset: 12,
        format: "float32x2",
      },
      // Normal
      {
        shaderLocation: 2,
        offset: 20,
        format: "float32x3",
      },
      // Color
      {
        shaderLocation: 3,
        offset: 32,
        format: "float32x4",
      },
    ],
  },
];

/** Shader class */
class material_pattern {
  /** #private parameters */
  private shaderModule: GPUShaderModule | undefined; // Shader module variable
  public pipeline: GPURenderPipeline | undefined;

  constructor(private render: resources) {}
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  private async readShader(shaderName: String): Promise<string> {
    const response = await fetch("src/engine/render/res/shds/main/main.wgsl");

    if (!response.ok) {
      throw Error("can`t read shader");
    }
    const data = await response.text();

    return data;
  } /** End of 'readShader' function */

  public async createMaterialPattern(shaderName: string): Promise<any> {
    const rnd = await this.render.getRender();
    const shaderCode = await this.readShader(shaderName);

    this.shaderModule = await rnd.device.createShaderModule({
      code: shaderCode,
    });

    const bindGroupLayout = rnd.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "read-only-storage",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d",
          },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
      ],
    });

    const pipelineLayout: GPUPipelineLayout = rnd.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    this.pipeline = await rnd.device.createRenderPipeline({
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
      },
      // layout: "auto",
      layout: pipelineLayout,
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });
    return this;
  }
} /** End of 'shader' class */

/** EXPORTS */
export { material_pattern };

/** END OF 'material_pattern.ts' FILE */
