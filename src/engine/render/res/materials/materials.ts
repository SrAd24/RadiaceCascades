/* FILE NAME   : materials.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 18.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { texture } from "../textures/textures";
import { group } from "../groups/groups";
import { material_pattern } from "../mtl_ptn/material_patterns";

/** Buffer interface */
interface material_descriptor {
  material_pattern: material_pattern;
  texturesDirName?: string;
  albedo?: vec3;
  roughness?: number;
  metallic?: number;
  emissive?: vec3;
} /** End of 'material_descriptor' interface */

/** Material class */
class material {
  /** #private parameters */
  private mtlGroup!: GPUBindGroup;
  private pattern!: material_pattern;
  
  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
  */
 protected get render(): render {
   return DIContainer.currentRender;
  } /** End of 'render' function */
  
  /** #public parameters */
  public albedo!: texture;
  public roughness!: texture;
  public metallic!: texture;
  public emissive!: texture;
  public normalMap!: texture;  

  /**
   * @info Create material function
   * @param materialParams: material_descriptor
   * @returns none
   */
  public async create(materialParams: material_descriptor) {
    const defaultAlbedo = new vec3(1, 1, 1);
    const defaultEmissive = new vec3(0, 0, 0);
    
    const albedoData = new Float32Array([defaultAlbedo.x, defaultAlbedo.y, defaultAlbedo.z, 1.0]);
    if (materialParams.albedo) {
      albedoData[0] = materialParams.albedo.x;
      albedoData[1] = materialParams.albedo.y;
      albedoData[2] = materialParams.albedo.z;
    }

    const rougnessData = new Float32Array([materialParams.roughness ?? 0.5, 0.0, 0.0, 0.0]);
    const metallicData = new Float32Array([materialParams.metallic ?? 0.0, 0.0, 0.0, 0.0]);
    const emissiveData = new Float32Array(
      materialParams.emissive
        ? [materialParams.emissive.x, materialParams.emissive.y, materialParams.emissive.z, 1.0]
        : [defaultEmissive.x, defaultEmissive.y, defaultEmissive.z, 1.0]
    );
    const normalMapData = new Float32Array([0.0, 0.0, 0.0, 0.0]);

    this.albedo = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba32float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.roughness = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba32float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.metallic = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba32float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.emissive = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba32float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.normalMap = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba32float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    if (materialParams.texturesDirName) {
      await this.albedo.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/albedo.png');
      await this.roughness.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/roughness.png');
      await this.metallic.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/metallic.png');
      await this.normalMap.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/normal.png');
    }
    else {
      await this.albedo.updateByData(albedoData);
      await this.roughness.updateByData(rougnessData);
      await this.metallic.updateByData(metallicData);
      await this.normalMap.updateByData(normalMapData);
    } 
    await this.emissive.updateByData(emissiveData);
    console.log(materialParams.material_pattern)
    this.pattern = materialParams.material_pattern;
    
    this.mtlGroup = await this.render.device.createBindGroup({
      layout: this.render.mtlLayout,
      entries: [
        {
          binding: 0,
          resource: this.albedo.view,
        },
        {
          binding: 1,
          resource: this.roughness.view,
        },
        {
          binding: 2,
          resource: this.metallic.view,
        },
        {
          binding: 3,
          resource: this.emissive.view,
        },
        {
          binding: 4,
          resource: this.normalMap.view,
        }
      ],
    });
    console.log(this.mtlGroup)
  } /** End of 'create' function */

  /**
   * @info Apply material function
   * @returns none
   */
  public apply(passEncoder: GPURenderPassEncoder) {
    passEncoder.setBindGroup(1, this.mtlGroup);
  } /** End of 'apply' function */

  /**
   * @info Set material function
   * @returns none
   */
  public set(passEncoder: GPURenderPassEncoder) {
    passEncoder.setPipeline(this.pattern.pipeline);
  } /** End of 'set' function */

} /** End of 'material' class */

/** Material manager class */
class material_manager {
  /** #public parameters */
  /**
   * @info Create material function
   * @param materialParams: material_descriptor
   * @returns new material
   */
  public async createMaterial(materialParams: material_descriptor): Promise<material> {
    let obj = new material();
    await obj.create(materialParams);
    return obj;
  } /** End of 'createMaterial' function */
} /** End of 'material_manager' class */

/** EXPORTS */
export { material };
export { material_manager };
export { material_descriptor };

/** END OF 'materials.ts' FILE */
