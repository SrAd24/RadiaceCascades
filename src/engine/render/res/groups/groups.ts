/* FILE NAME   : groups.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 14.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { buffer } from "../buffers/buffers";
import { texture } from "../textures/textures";

/** Bind group interface */
interface group_descriptor {
  groupIndex: number;
  bindings: Array<{
    binding: number;
    visibility: GPUShaderStageFlags;
    texture?: texture;
    buffer?: buffer;
  }>;
} /** End of 'group_descriptor' interface */

/** Group class */
class group {
  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public bindGroupLayout!: GPUBindGroupLayout; // Bind group layout
  public bindGroup!: GPUBindGroup; // Bind group

  /**
   * @info Create group function
   * @param Group parameters
   * @returns none
   */
  public async create(groupParams: group_descriptor) {
    // Create bind group layout
    const bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
      entries: [],
    };

    const entriesLayout: GPUBindGroupLayoutEntry[] = [];

    for (let i = 0; i < groupParams.bindings.length; i++) {
      if (groupParams.bindings[i].buffer) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          buffer: { type: groupParams.bindings[i].buffer!.bufferType },
        });
      } else if (1) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          storageTexture: { format: "r32float", access: "read-write" },
        });
      }
    }
    bindGroupLayoutDescriptor.entries = entriesLayout;
    this.bindGroupLayout = this.render.device.createBindGroupLayout(
      bindGroupLayoutDescriptor,
    );

    const bindGroupDescriptor: GPUBindGroupDescriptor = {
      layout: this.bindGroupLayout,
      entries: [],
    };

    const entries: GPUBindGroupEntry[] = [];
    for (let i = 0; i < groupParams.bindings.length; i++) {
      if (groupParams.bindings[i].buffer) {
        entries.push({
          binding: groupParams.bindings[i].binding,
          resource: { buffer: groupParams.bindings[i].buffer!.buffer },
        });
      } else {
        entries.push({
          binding: groupParams.bindings[i].binding,
          resource: groupParams.bindings[i].texture!.view,
        });
      }
    }
    bindGroupDescriptor.entries = entries;
    this.bindGroup = this.render.device.createBindGroup(bindGroupDescriptor);
  } /** End of 'createBindGroup' function */
} /** End of 'group' class */

/** Group manager class */
class group_manager {
  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns new group
   */
  public async createBindGroup(groupParams: group_descriptor): Promise<group> {
    let obj = new group();
    await obj.create(groupParams);
    return obj;
  } /** End of 'createBindGroup' function */
} /** End of 'group_manager' class */

/** EXPORTS */
export { group };
export { group_manager };
export { group_descriptor };

/** END OF 'groups.ts' FILE */
