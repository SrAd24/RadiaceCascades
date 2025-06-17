/* FILE NAME   : material_patterns.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { group } from "../groups/groups";

/** Material pattern interface */
interface material_pattern_descriptor {
  shaderName: string;
  topology: GPUPrimitiveTopology;
  vertexAttributes: GPUVertexBufferLayout;
  bindings?: group;
} /** End of 'bindGroup' interface */

/** Material pattern class */
class material_pattern {
  /** #private parameters */
  private shaderName!: string;
  private pipelinelayout!: GPUPipelineLayout;
  private patternDescriptor!: GPURenderPipelineDescriptor;

  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public pipeline!: GPURenderPipeline;
  public group!: group;

  /**
   * @info Create material pattern function
   * @param descriptor: material_pattern_descriptor
   * @returns none
   */
  public async create(descriptor: material_pattern_descriptor): Promise<any> {
    this.shaderName =
      "bin/shds/" +
      descriptor.shaderName +
      "/" +
      descriptor.shaderName +
      ".wgsl";
    const shaderModule = this.render.device.createShaderModule({
      code: await fetch(this.shaderName).then((res) => res.text()),
    });
    if (descriptor.bindings) {
      this.pipelinelayout = this.render.device.createPipelineLayout({
        bindGroupLayouts: [
          this.render.globalGroup.bindGroupLayout,
          descriptor.bindings.bindGroupLayout,
        ],
      });
      this.group = descriptor.bindings;
    } else
      this.pipelinelayout = this.render.device.createPipelineLayout({
        bindGroupLayouts: [this.render.globalGroup.bindGroupLayout],
      });

    this.patternDescriptor = {
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: [descriptor.vertexAttributes],
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
        topology: descriptor.topology,
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
   * @info Update material pattern function
   * @returns none
   */
  public async update() {
    const shaderModule = this.render.device.createShaderModule({
      code: await fetch(this.shaderName).then((res) => res.text()),
    });

    this.patternDescriptor.vertex.module = shaderModule;
    this.patternDescriptor.fragment!.module = shaderModule;
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

/** END OF 'material_patterns.ts' FILE */
