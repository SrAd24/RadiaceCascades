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
  albedo?: vec3 | string;
  roughness?: number | string;
  metallic?: number | string;
  emissive?: vec3 | string;
  normalMap?: string;
  ao?: string;
} /** End of 'material_descriptor' interface */

/** Material class */
class material {
  /** #private parameters */
  private mtlGroup!: GPUBindGroup;
  private pattern!: material_pattern;
  private static downsamplePipeline?: GPURenderPipeline;
  private static downsampleBindGroupLayout?: GPUBindGroupLayout;
  
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
  public ambientOcclusion!: texture;

  /**
   * @info Create material function
   * @param materialParams: material_descriptor
   * @returns none
   */
  public async create(materialParams: material_descriptor) {
    const defaultAlbedo = new vec3(1, 1, 1);
    const defaultEmissive = new vec3(0, 0, 0);
    
    // Prepare data for value-based properties
    const albedoData = new Float32Array([defaultAlbedo.x, defaultAlbedo.y, defaultAlbedo.z, 1.0]);
    if (materialParams.albedo && typeof materialParams.albedo !== 'string') {
      albedoData[0] = materialParams.albedo.x;
      albedoData[1] = materialParams.albedo.y;
      albedoData[2] = materialParams.albedo.z;
    }

    const roughnessData = new Float32Array([typeof materialParams.roughness === 'number' ? materialParams.roughness : 0.5, 0.0, 0.0, 0.0]);
    const metallicData = new Float32Array([typeof materialParams.metallic === 'number' ? materialParams.metallic : 0.0, 0.0, 0.0, 0.0]);
    const emissiveData = new Float32Array(
      materialParams.emissive && typeof materialParams.emissive !== 'string'
        ? [materialParams.emissive.x, materialParams.emissive.y, materialParams.emissive.z, 1.0]
        : [defaultEmissive.x, defaultEmissive.y, defaultEmissive.z, 1.0]
    );
    const normalMapData = new Float32Array([0.0, 0.0, 0.0, 0.0]);

    this.albedo = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.roughness = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.metallic = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.emissive = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.normalMap = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.ambientOcclusion = await this.render.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba16float",
      mipMaps: true,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    // Handle textures directory
    if (materialParams.texturesDirName) {
      await this.albedo.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/albedo.png');
      await this.roughness.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/roughness.png');
      await this.metallic.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/metallic.png');
      await this.normalMap.updateByImage('bin/textures/pbr/' + materialParams.texturesDirName + '/normal.png');
    } else {
      // Handle individual texture paths or values
      if (typeof materialParams.albedo === 'string') {
        await this.albedo.updateByImage(materialParams.albedo);
      } else {
        await this.albedo.updateByData(albedoData);
      }
      
      if (typeof materialParams.roughness === 'string') {
        await this.roughness.updateByImage(materialParams.roughness);
      } else {
        await this.roughness.updateByData(roughnessData);
      }
      
      if (typeof materialParams.metallic === 'string') {
        await this.metallic.updateByImage(materialParams.metallic);
      } else {
        await this.metallic.updateByData(metallicData);
      }
      
      if (materialParams.normalMap) {
        await this.normalMap.updateByImage(materialParams.normalMap);
      } else {
        await this.normalMap.updateByData(normalMapData);
      }
      if (materialParams.ao) {
        await this.ambientOcclusion.updateByImage(materialParams.ao);
      } else {
        await this.ambientOcclusion.updateByData(normalMapData);
      }
    }
    
    // Handle emissive (can be texture path or value)
    if (typeof materialParams.emissive === 'string') {
      await this.emissive.updateByImage(materialParams.emissive);
    } else {
      await this.emissive.updateByData(emissiveData);
    }

    this.pattern = materialParams.material_pattern;
    
    this.mtlGroup = this.render.device.createBindGroup({
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
        },
        {
          binding: 5,
          resource: this.ambientOcclusion.view,
        }
      ],
    });
    this.generateMipmaps();
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

  /**
   * @info Generate mipmaps for material textures
   * @returns none
   */
  public async generateMipmaps(): Promise<void> {
    const encoder = this.render.device.createCommandEncoder();
    
    // Generate mipmaps for all textures except emissive
    await this.generateTextureMipmaps(this.albedo, encoder);
    await this.generateTextureMipmaps(this.roughness, encoder);
    await this.generateTextureMipmaps(this.metallic, encoder);
    await this.generateTextureMipmaps(this.normalMap, encoder);
    await this.generateTextureMipmaps(this.ambientOcclusion, encoder);
    
    this.render.device.queue.submit([encoder.finish()]);
  } /** End of 'generateMipmaps' function */

  /**
   * @info Generate mipmaps for a single texture
   * @param tex: texture
   * @param encoder: GPUCommandEncoder
   * @returns none
   */
  private async generateTextureMipmaps(tex: texture, encoder: GPUCommandEncoder): Promise<void> {
    if (!tex.texture || tex.texture.mipLevelCount <= 1) return;
    
    // Initialize downsample pipeline if needed
    
    for (let mipLevel = 1; mipLevel < tex.texture.mipLevelCount; mipLevel++) {
      const srcView = tex.texture.createView({
        baseMipLevel: mipLevel - 1,
        mipLevelCount: 1,
      });
      
      const dstView = tex.texture.createView({
        baseMipLevel: mipLevel,
        mipLevelCount: 1,
      });
      
      // Create bind group for this mip level
      const bindGroup = this.render.device.createBindGroup({
        layout: this.render.mipMapGroupLayout,
        entries: [
          { binding: 0, resource: srcView },
          { binding: 1, resource: this.render.device.createSampler({ magFilter: 'linear', minFilter: 'linear' }) }
        ],
      });
      
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: dstView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      });
      
      // Use downsample shader
      renderPass.setPipeline(this.render.mipMapPipeline);
      renderPass.setBindGroup(0, bindGroup);
      renderPass.draw(3); // Draw fullscreen triangle
      renderPass.end();
    }
  } /** End of 'generateTextureMipmaps' function */
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
