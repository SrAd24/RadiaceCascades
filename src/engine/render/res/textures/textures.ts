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
  usage: GPUTextureUsage;
  size: { width: number; height: number };
  mipMaps?: boolean;
  sampleCount?: number;
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

  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns none
   */
  public async create(textureParams: texture_descriptor) {
    this.width = textureParams.size.width;
    this.height = textureParams.size.height;

    this.descriptor = {
      size: [this.width, this.height],
      format: textureParams.format,
      usage: textureParams.usage,
      mipLevelCount:
        textureParams?.mipMaps == true
          ? Math.floor(Math.log2(Math.max(this.width, this.height))) + 1
          : 1,
      sampleCount: textureParams.sampleCount,
      dimension: "2d",
    };

    this.texture = this.render.device.createTexture(this.descriptor);
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
      this.texture.destroy();
      this.descriptor.size = [
        (this.width = image.width),
        (this.height = image.height),
      ];
      this.texture = this.render.device.createTexture(this.descriptor);
      this.view = this.texture.createView();
    }
    this.render.device.queue.copyExternalImageToTexture(
      { source: image },
      { texture: this.texture },
      [image.width, image.height],
    );
  } /** End of 'updateByImage' function */

  /** #public parameters */
  /**
   * @info Update texture data by image name function
   * @param image name
   * @returns none
   */
  public async updateByData(imageName: string) {
    const image = await this.loadImage(imageName);

    if (this.width < image.width || this.height < image.height) {
      this.destroy();
      this.width = image.width;
      this.height = image.height;
      this.descriptor.size = [this.width, this.height];
      this.texture = this.render.device.createTexture(this.descriptor);
      this.view = this.texture.createView();
    }
    this.render.device.queue.copyExternalImageToTexture(
      { source: image },
      { texture: this.texture },
      [image.width, image.height],
    );
  } /** End of 'updateByData' function */

  /** #public parameters */
  /**
   * @info Destroy texture function
   * @returns none
   */
  public async destroy() {
    this.texture.destroy();
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
