/* FILE NAME   : groups.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 14.06.2025
 */

/** IMPORTS */
import { IndexInfo } from "typescript";
import { DIContainer, render } from "../../render";
import { buffer } from "../buffers/buffers";
import { texture } from "../textures/textures";

/** Bind group interface */
interface group_descriptor {
  groupIndex: number;
  layout?: GPUBindGroupLayout;
  bindings: Array<{
    binding: number;
    visibility: GPUShaderStageFlags;
    texture?: texture;
    buffer?: buffer;
    sampler?: {
      sampler: GPUSampler;
      type: GPUSamplerBindingType;
    };
  }>;
} /** End of 'group_descriptor' interface */

class groupObjects {
  public groupIndex: number = 0;
  public buffers: {
    buf: buffer,
    bind: number, 
  }[] = [];
  public textures: {
    tex: texture,
    bind: number, 
  }[] = [];
  public samplers: {
    sampler: GPUSampler,
    bind: number, 
  }[] = [];
}

/** Group class */
class group {
  /** #private parameters */
  private objects: groupObjects = new groupObjects();

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
  public index: number = 0
  public bindGroup!: GPUBindGroup; // Bind group

  /**
   * @info Create group function
   * @param Group parameters
   * @returns none
   */
  public async create(groupParams: group_descriptor) {
    if (!groupParams.layout) {
    // Create bind group layout
    const bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
      entries: [],
    };
    
    this.objects.groupIndex = groupParams.groupIndex;
    this.index = groupParams.groupIndex;

    const entriesLayout: GPUBindGroupLayoutEntry[] = [];

    for (let i = 0; i < groupParams.bindings.length; i++) {
      if (groupParams.bindings[i].buffer) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          buffer: { type: groupParams.bindings[i].buffer!.bufferType },
        });
      } else if (groupParams.bindings[i].sampler) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          sampler: { type: groupParams.bindings[i].sampler?.type },
        });
      } else if (groupParams.bindings[i].texture?.isStorage) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          storageTexture: { format: groupParams.bindings[i].texture!.format, access: groupParams.bindings[i].texture!.access, viewDimension: groupParams.bindings[i].texture!.viewDimension },
        });
      } else if (!groupParams.bindings[i].texture?.isStorage) {
        entriesLayout.push({
          binding: groupParams.bindings[i].binding,
          visibility: groupParams.bindings[i].visibility,
          texture: groupParams.bindings[i].texture!.format == "rgba32float" ? { sampleType: 'unfilterable-float' } : {},
        });
      } 
    }
    

    bindGroupLayoutDescriptor.entries = entriesLayout;
    this.bindGroupLayout = this.render.device.createBindGroupLayout(
      bindGroupLayoutDescriptor,
    );
  }
  else 
    this.bindGroupLayout = groupParams.layout;

    const bindGroupDescriptor: GPUBindGroupDescriptor = {
      layout: this.bindGroupLayout,
      entries: [],
    };

    const entries: GPUBindGroupEntry[] = [];
    for (let i = 0; i < groupParams.bindings.length; i++) {
      if (groupParams.bindings[i].buffer) {
        this.objects.buffers.push({
            bind: groupParams.bindings[i].binding,
            buf: groupParams.bindings[i].buffer!,
          }
        );
        entries.push({
          binding: groupParams.bindings[i].binding,
          resource: { buffer: groupParams.bindings[i].buffer!.buffer },
        });
      } else if (groupParams.bindings[i].texture) {
        this.objects.textures.push({
            bind: groupParams.bindings[i].binding,
            tex: groupParams.bindings[i].texture!,
          }
        );
        entries.push({
          binding: groupParams.bindings[i].binding,
          resource: groupParams.bindings[i].texture!.view,
        });
      } else {
        this.objects.samplers.push({
            bind: groupParams.bindings[i].binding,
            sampler: groupParams.bindings[i].sampler!.sampler,
          }
        );
        entries.push({
          binding: groupParams.bindings[i].binding,
          resource: groupParams.bindings[i].sampler!.sampler,
        });
      }
    }
    bindGroupDescriptor.entries = entries;
    
    this.bindGroup = this.render.device.createBindGroup(bindGroupDescriptor);
  } /** End of 'create' function */

  /**
   * @info Create group function
   * @param Group parameters
   * @returns none
   */
  public update() {
    let needToRecreate = false;
    const bindGroupDescriptor: GPUBindGroupDescriptor = {
      layout: this.bindGroupLayout,
      entries: [],
    };

    const entries: GPUBindGroupEntry[] = [];

    for (let i = 0; i < this.objects.buffers.length; i++) {
      if (this.objects.buffers[i].buf.isSizeChanged) {
        needToRecreate = true;
        this.objects.buffers[i].buf.isSizeChanged = false;
      }
      entries.push({
        binding: this.objects.buffers[i].bind,
        resource: { buffer: this.objects.buffers[i].buf.buffer },
      });
    }
    for (let i = 0; i < this.objects.textures.length; i++) {
      if (this.objects.textures[i].tex.isSizeChanged) {
        needToRecreate = true;
        this.objects.textures[i].tex.isSizeChanged = false;
      }
      entries.push({
        binding: this.objects.textures[i].bind,
        resource: this.objects.textures[i].tex.view,
      });
    }

    for (let i = 0; i < this.objects.samplers.length; i++) {
      entries.push({
        binding: this.objects.samplers[i].bind,
        resource: this.objects.samplers[i].sampler,
      });
    }

    bindGroupDescriptor.entries = entries;
    if (needToRecreate) {
      this.bindGroup = this.render.device.createBindGroup(bindGroupDescriptor);
    }
  } /** End of 'update' function */
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
