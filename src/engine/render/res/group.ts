/* FILE NAME   : group.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 14.06.2025
 */

/** IMPORTS */
import { DIContainer } from "../res-types";
import { render } from "../render";
import { buffer } from "./buffers";

/** Visibility flags */
enum visibilityFlags {
  frag = Number(GPUShaderStage.FRAGMENT),
  vert = Number(GPUShaderStage.VERTEX),
  compute = Number(GPUShaderStage.COMPUTE),
} /** End of 'visibilityFlags' enum */

/** Bind group interface */
interface bindGroup {
  groupIndex: number;
  bindings: Array<{
    binding: number;
    visibility: visibilityFlags;
    buffer?: buffer;
  }>;
} /** End of 'bindGroup' interface */

/** Group class */
class group {
  /** #public parameters */
  public bindGroupLayout: GPUBindGroupLayout; // Bind group layout
  public bindGroup: GPUBindGroup; // Bind group

  /** #protected parameters */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns new group
   */
  public async create(groupParams: bindGroup): Promise<any> {
    const bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
      entries: [],
    };

    for (let i = 0; i < groupParams.bindings.length; i++) {
      bindGroupLayoutDescriptor.entries.push({
        binding: groupParams.bindings[i].binding,
        visibility: groupParams.bindings[i].visibility,
        buffer: groupParams.bindings[i].buffer,
      });
    }

    this.bindGroupLayout = await render.device.createBindGroupLayout(
      bindGroupLayoutDescriptor,
    );

    const bindGroupDescriptor: GPUBindGroupDescriptor = {
      layout: this.bindGroupLayout,
      entries: [],
    };

    for (let i = 0; i < bindGroupLayoutDescriptor.length; i++) {
      bindGroupLayoutDescriptor.entries.push({
        binding: bindGroupLayoutDescriptor.entries[i].binding,
        resource: { buffer: bindGroupLayoutDescriptor.entries[i].buffer.buf },
      });
    }
    this.bindGroup = await rnd.device.createBindGroup(bindGroupDescriptor);
    return this;
  } /** End of 'createBindGroup' function */
} /** End of 'group' class */

class group_manager {
  /** #private parameters */
  private groups: Map<number, group> = new Map();
  private nextId = 0;

  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns new group
   */
  public async createBindGroup(groupParams: bindGroup): Promise<group> {
    const groupId = this.nextId++;
    let obj = new group();
    await obj.create(groupParams);
    this.groups.set(groupId, obj);
    return obj;
  } /** End of 'createBindGroup' function */
} /** End of 'group_manager' class */

export { group_manager };
/** END OF 'group.ts' FILE */
