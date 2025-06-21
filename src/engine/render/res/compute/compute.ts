/* FILE NAME   : compute.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */


/** IMPORTS */
import { DIContainer, render } from "../../render";
import { group } from "../groups/groups";

/** Buffer interface */
interface compute_descriptor {
  shaderName: string;
  bindGroups: group[][];
} /** End of 'buffer_descriptor' interface */


/** Compute class */
class compute {
  /** Private parameters */
  private shaderName!: string; // Shader name to reload
  private computePipeline!: GPUComputePipeline; // GPU compute pipeline object
  private computeEncoder!: GPUComputePassEncoder; // GPU compute pass encoder
  private bindGroups: group[][] = []; // GPU binding groups
  private static shaderCache = new Map<string, GPUShaderModule>(); // Shader cache

  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /**
   * @info Preprocess shader function
   * @param mainPath: string
   * @returns shader module
   */
  private async preprocessShader(mainPath: string): Promise<GPUShaderModule> {
    // Проверяем кэш
    if (compute.shaderCache.has(mainPath)) {
      return compute.shaderCache.get(mainPath)!;
    }

    const shaderPath = 'bin/shaders/' + mainPath;
    const includePath = 'bin/shaders/includes/';

    const mainShaderResponse = await fetch(`${shaderPath}`);
    if (!mainShaderResponse.ok) {
      throw new Error(`Failed to load shader: ${shaderPath}`);
    }
    
    let shaderCode = await mainShaderResponse.text();
    
    const includeRegex = /^#include\s+"([^"]+\.wgsl)"/gm;
    const includeMatches = [...shaderCode.matchAll(includeRegex)];
    
    const includeMap = new Map();
    
    for (const [_, includeFile] of includeMatches) {
      const includeResponse = await fetch(`${includePath + includeFile}`);
      if (!includeResponse.ok) {
        throw new Error(`Failed to load included shader: ${includePath + includeFile}`);
      }
      const content = await includeResponse.text();
      includeMap.set(includePath + includeFile, content);
    }
    
    shaderCode = shaderCode.replace(includeRegex, (_, includeFile) => {
      return includeMap.get(includePath + includeFile);
    });
    
    const shaderModule = this.render.device.createShaderModule({
      code: shaderCode,
      label: `Processed shader: ${shaderPath}`
    });

    // Сохраняем в кэш
    compute.shaderCache.set(mainPath, shaderModule);
    return shaderModule;
  }/** End of 'preprocessShader' function */
  
  /**
   * @info create compute pipeline function
   * @param computeParams: compute_descriptor
   * @returns none
   */
  public async create(computeParams: compute_descriptor) {
    this.bindGroups = computeParams.bindGroups;
    let layouts = [];

    for (let i = 0; i < this.bindGroups.length; i++)
      for (let j = 0; j < this.bindGroups[i].length; j++)
      layouts.push(this.bindGroups[i][j].bindGroupLayout);

    layouts = [...new Set(layouts)];
    let pipelineLayout = this.render.device.createPipelineLayout({
        bindGroupLayouts: layouts,
      });

    const shdModule = await this.preprocessShader(computeParams.shaderName + "/comp.wgsl");

    this.computePipeline = await this.render.device.createComputePipelineAsync({
      layout: pipelineLayout, 
      compute: {
        module: shdModule,
        entryPoint: 'compute_main',
      },
    });
  } /** End of 'create' function */

  /**
   * @info Begin compute pass function
   * @param commandEncoder: GPUCommandEncoder
   * @returns none
   */
  public begin(commandEncoder: GPUCommandEncoder) {
    this.computeEncoder = commandEncoder.beginComputePass();
    this.computeEncoder.setPipeline(this.computePipeline);
  } /** End of 'begin' function */

  /**
   * @info Dispatch work groups function
   * @param workGroupCountX: number
   * @param workGroupCountY: number
   * @param indices: number[],
   * @returns none
   */
  public dispatch(workGroupCountX: number, workGroupCountY: number, indices: number[]) {
    for (let i = 0; i < indices.length; i++)
      this.computeEncoder.setBindGroup(this.bindGroups[i][indices[i]].index, this.bindGroups[i][indices[i]].bindGroup);
      
    this.computeEncoder.dispatchWorkgroups(workGroupCountX, workGroupCountY);
  } /** End of 'dispatch' function */

  /**
   * @info Dispatch work groups function
   * @returns none
   */
  public end() {
    this.computeEncoder.end();
  } /** End of 'dispatch' function */
} /** End of 'compute' class */

/** Compute pattern manager class */
class compute_manager {
  /** #public parameters */
  /**
   * @info Create material pattern function
   * @param Group parameters
   * @returns new material pattern
   */
  public async createCompute(descriptor: compute_descriptor): Promise<compute> {
    let obj = new compute();
    await obj.create(descriptor);
    return obj;
  } /** End of 'createCompute' function */
} /** End of 'compute_manager' class */

/** EXPORTS */
export { compute };
export { compute_manager };

/** END OF 'compute.ts' FILE */
