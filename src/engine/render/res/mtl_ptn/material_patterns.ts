/* FILE NAME   : material_patterns.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 14.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { group } from "../groups/groups";

/** Material pattern interface */
interface material_pattern_descriptor {
  shaderName: string;
  topology: string;
  vertexAttributes: object;
  bindings?: group;
} /** End of 'bindGroup' interface */

/** Material pattern class */
class material_pattern {
  /** #private parameters */
  private shaderName!: string;
  private pipelinelayout!: GPUPipelineLayout;
  private patternDescriptor!: GPURenderPipelineDescriptor;
  public pipeline!: GPURenderPipeline; // WebGPU pipeline

  /** #protected parameters */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /**
   * @info Create material pattern function
   * @param Material pattern descriptor
   * @returns none
   */
  public async create(descriptor: material_pattern_descriptor): Promise<any> {
    this.shaderName =
      "src/engine/render/res/shds/" +
      descriptor.shaderName +
      "/" +
      descriptor.shaderName +
      ".wgsl";
    const shaderModule = this.render.device.createShaderModule({
      code: await fetch(this.shaderName).then((res) => res.text()),
    });

    this.pipelinelayout = this.render.device.createPipelineLayout({
      bindGroupLayouts: [this.render.globalGroup.bindGroupLayout],
    })
  
    this.patternDescriptor = {
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: [descriptor.vertexAttributes as GPUVertexBufferLayout],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: this.render.defSwapchainTextureFormat,
          },
        ],
      },
      multisample: {
        count: 4,
        mask: 0xffffffff,
        alphaToCoverageEnabled: false,
      },
      primitive: {
        topology: descriptor.topology as GPUPrimitiveTopology,
      },
      layout: this.pipelinelayout,
      depthStencil: {
        format: this.render.defDepthTextureFormat,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    };
    this.pipeline = this.render.device.createRenderPipeline(
      this.patternDescriptor,
    );
  } /** End of 'create' function */

  /**
   * @info update material pattern function
   * @param shaderName: String
   * @returns none
   */
  public async udpate() {
    const shaderModule = this.render.device.createShaderModule({
      code: await fetch(this.shaderName).then((res) => res.text()),
    });

    this.patternDescriptor = {
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: this.patternDescriptor.vertex.buffers,
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: this.render.defSwapchainTextureFormat,
          },
        ],
      },
      multisample: {
        count: 4,
        mask: 0xffffffff,
        alphaToCoverageEnabled: false,
      },
      primitive: {
        topology: this.patternDescriptor.primitive?.topology,
      },
      layout: this.patternDescriptor.layout,
      depthStencil: {
        format: this.render.defDepthTextureFormat,
        depthWriteEnabled:
          this.patternDescriptor.depthStencil?.depthWriteEnabled,
        depthCompare: "less",
      },
    };
    this.pipeline = this.render.device.createRenderPipeline(
      this.patternDescriptor,
    );
  } /** End of 'update' function */
} /** End of 'material_pattern' class */

/** Material pattern manager class */
class material_pattern_manager {
  /** #public parameters */
  /**
   * @info Create material pattern function
   * @param Group parameters
   * @returns new material pattern
   */
  public async createMaterialPattern(
    descriptor: material_pattern_descriptor,
  ): Promise<material_pattern> {
    let obj = new material_pattern();
    await obj.create(descriptor);
    return obj;
  } /** End of 'createMaterialPattern' function */
} /** End of 'material_pattern_manager' class */

/** EXPORTS */
export { material_pattern };
export { material_pattern_manager };
export { material_pattern_descriptor };

/** END OF 'material_patterns.ts' FILE */
