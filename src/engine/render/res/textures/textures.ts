/* FILE NAME   : textures.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";

/** Texture interface */
interface texture_descriptor {
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
  size: { width: number; height: number };
  layerCount?: number;
  mipMaps?: boolean;
  sampleCount?: number;
  access?: GPUStorageTextureAccess;
  viewDimension?: GPUTextureViewDimension;
} /** End of 'texture_descriptor' interface */

/** Texture class */
class texture {
  /** #private parameters */
  private descriptor!: GPUTextureDescriptor;

  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public texture!: GPUTexture;
  public view!: GPUTextureView;
  public width: number = 0;
  public height: number = 0;
  public isStorage: boolean = false;
  public isSizeChanged: boolean = false;
  public format!: GPUTextureFormat;
  public viewDimension!: GPUTextureViewDimension;
  public access!: GPUStorageTextureAccess;

  /** #public parameters */
  /**
   * @info Load image function function
   * @param url: string
   * @returns HTML tag
   */
  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  } /** End of 'loadImage' function */

  private getBytesPerPixel(format: GPUTextureFormat): number {
    switch (format) {
      // 8-bit per channel
      case 'r8unorm': case 'r8snorm': 
      case 'r8uint': case 'r8sint':
        return 1;

      // 16-bit per channel
      case 'r16uint': case 'r16sint': case 'r16float':
      case 'rg8unorm': case 'rg8snorm': 
      case 'rg8uint': case 'rg8sint':
      case 'depth16unorm':
        return 2;

      // 32-bit per channel
      case 'r32uint': case 'r32sint': case 'r32float':
      case 'rg16uint': case 'rg16sint': case 'rg16float':
      case 'rgba8unorm': case 'rgba8snorm':
      case 'rgba8uint': case 'rgba8sint':
      case 'bgra8unorm': case 'bgra8unorm-srgb':
      case 'depth24plus': case 'depth32float':
        return 4;

      // 64-bit
      case 'rg32uint': case 'rg32sint': case 'rg32float':
      case 'rgba16uint': case 'rgba16sint': case 'rgba16float':
        return 8;

      // 128-bit
      case 'rgba32uint': case 'rgba32sint': case 'rgba32float':
        return 16;

      // Сжатые форматы
      case 'bc1-rgba-unorm': case 'bc1-rgba-unorm-srgb':
        return 0.5; // 0.5 байт/пиксель (8:1 сжатие)
      case 'bc7-rgba-unorm': case 'bc7-rgba-unorm-srgb':
        return 1; // 1 байт/пиксель (4:1 сжатие)

      default:
        throw new Error(`Unknown texture format: ${format}`);
    }
  }

  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns none
   */
  public async create(textureParams: texture_descriptor) {
    this.width = textureParams.size.width;
    this.height = textureParams.size.height;
    this.format = textureParams.format;

    let mipCount = 1;
    if (textureParams.mipMaps == true)
      mipCount = Math.floor(Math.log2(Math.max(this.width, this.height))) + 1;
    let layerCount = 1;
    if (textureParams.layerCount)
      layerCount = textureParams.layerCount;
    this.descriptor = {
      size: [this.width, this.height, layerCount],
      format: textureParams.format,
      usage: textureParams.usage,
      mipLevelCount: mipCount,
      sampleCount: textureParams.sampleCount,
    };

    this.isStorage = (this.descriptor.usage & GPUTextureUsage.STORAGE_BINDING) !== 0;
    if (this.isStorage)
      this.access = textureParams.access as GPUStorageTextureAccess;

    this.texture = this.render.device.createTexture(this.descriptor);
    if (textureParams.viewDimension)
      this.viewDimension = textureParams.viewDimension, this.view = this.texture.createView({dimension: textureParams.viewDimension});
    else 
      this.view = this.texture.createView();
  } /** End of 'createBindGroup' function */

  /** #public parameters */
  /**
   * @info Update texture data by image name function
   * @param image name
   * @returns none
   */
  public async updateByImage(imageName: string) {
    const image = await this.loadImage(imageName);

    if (this.width < image.width || this.height < image.height) {
      this.destroy();
      this.isSizeChanged = true;
      this.descriptor.size = [(this.width = image.width), (this.height = image.height)];
      this.descriptor.mipLevelCount = Math.floor(Math.log2(Math.max(this.width, this.height))) + 1;
      this.texture = this.render.device.createTexture(this.descriptor);
      this.view = this.texture.createView();
    }
    this.render.queue.copyExternalImageToTexture(
      { source: image },
      { texture: this.texture },
      [image.width, image.height],
    );
  } /** End of 'updateByImage' function */

  /** #public parameters */
  /**
   * @info Update texture by data function
   * @param data: Float32Array | Uint32Array | Uint8Array
   * @returns none
   */
  public async updateByData(data: Float32Array | Uint32Array | Uint8Array) {
    const bytesPerPixel = this.getBytesPerPixel(this.descriptor.format);
    
    // Ensure data is in correct format for the texture
    let srcData: ArrayBufferView;
    if (this.descriptor.format === 'rgba16float') {
      // For rgba16float, convert Float32Array to Uint16Array with half-float encoding
      if (data instanceof Float32Array) {
        const uint16Data = new Uint16Array(data.length);
        for (let i = 0; i < data.length; i++) {
          uint16Data[i] = this.floatToHalf(data[i]);
        }
        srcData = uint16Data;
      } else {
        srcData = data;
      }
    } else if (this.descriptor.format.includes('float')) {
      // For other float formats, use data as-is
      if (!(data instanceof Float32Array)) {
        srcData = new Float32Array(data);
      } else {
        srcData = data;
      }
    } else if (this.descriptor.format.includes('unorm')) {
      // For unorm formats, convert float [0,1] to uint8 [0,255]
      if (data instanceof Float32Array) {
        const uint8Data = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          uint8Data[i] = Math.round(Math.max(0, Math.min(1, data[i])) * 255);
        }
        srcData = uint8Data;
      } else {
        srcData = data;
      }
    } else {
      srcData = data;
    }
    
    this.render.queue.writeTexture(
      {
        texture: this.texture,
      },
      srcData.buffer,
      {
        bytesPerRow: this.width * bytesPerPixel,
        rowsPerImage: this.height
      },
      [this.width, this.height]
    );
  }

  /**
   * @info Convert float32 to half-float (float16)
   * @param val: number
   * @returns number
   */
  private floatToHalf(val: number): number {
    const floatView = new Float32Array(1);
    const int32View = new Int32Array(floatView.buffer);
    floatView[0] = val;
    const x = int32View[0];
    
    let bits = (x >> 16) & 0x8000; // sign bit
    let m = (x >> 12) & 0x07ff; // mantissa
    const e = (x >> 23) & 0xff; // exponent
    
    if (e < 103) return bits;
    if (e > 142) {
      bits |= 0x7c00;
      bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
      return bits;
    }
    if (e < 113) {
      m |= 0x0800;
      bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
      return bits;
    }
    bits |= ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
    return bits;
  } /** End of 'updateByData' function */

  /** #public parameters */
  /**
   * @info Destroy texture function
   * @returns none
   */
  public async destroy() {
    await this.texture.destroy();
  } /** End of 'destroy' function */
} /** End of 'texture' class */

/** Texture manager class */
class texture_manager {
  /** #public parameters */
  /**
   * @info Create texture function
   * @param texParams: texture_descriptor
   * @returns new texture
   */
  public async createTexture(texParams: texture_descriptor): Promise<texture> {
    let obj = new texture();
    await obj.create(texParams);
    return obj;
  } /** End of 'createTexture' function */
} /** End of 'texture_manager' class */

/** EXPORTS */
export { texture };
export { texture_manager };
export { texture_descriptor };

/** END OF 'textures.ts' FILE */
