/* FILE NAME   : textures.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

import { resources } from "../res-types";

enum texFormat {
  none = "",
  rgba8 = "rgba8unorm",
  bgra8 = "bgra8unorm",
  depth32 = "depth32float",
  rgba32 = "rgba32float",
}

enum texUsage {
  none = 0,
  binding = GPUTextureUsage.TEXTURE_BINDING,
  copySrc = GPUTextureUsage.COPY_SRC,
  copyDst = GPUTextureUsage.COPY_DST,
  renderAtt = GPUTextureUsage.RENDER_ATTACHMENT,
}

/** Texture class */
class texture {
  /** #public parameters */
  public tex: GPUTexture;
  public view: GPUTextureView;
  public width: number = 0;
  public height: number = 0;
  public type: texFormat = texFormat.none;
  public usage: boolean = Boolean(texUsage.none);
  public mipLevelCount: number = 1;
  public sampleCount: number = 1;

  constructor(private res: resources) {}

  /** #public parameters */
  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  private async createTexture(
    w: number,
    h: number,
    texFrm: texFormat = texFormat.none,
    texUsg: boolean = Boolean(texUsage.none),
    mipLevel: number = 1,
    sampleCnt: number = 1,
  ): Promise<texture> {
    const device = this.res.getDevice();

    if (device == undefined) throw Error("Device is undefined");

    this.tex = device.createTexture({
      size: [w, h],
      format: "texFormat",
      usage: texUsg,
      mipLevelCount: mipLevel,
      sampleCount: sampleCnt,
    });

    return this;
  }

  /** #public parameters */
  /**
   * @info Create shader function
   * @param shaderName: String
   * @returns ready shader
   */
  public async createShader(shaderName: String, device: any): Promise<any> {
    // get shader data
    const shaderData = await this.readShader(shaderName);

    console.log(shaderData.toString());
    // create shader module
    this.shaderModule = await device.createShaderModule({
      code: shaderData.toString(),
    });
    if (this.shaderModule == undefined) throw Error("Shader is undefined");
    else console.log("shader created successfully: " + shaderName);
  } /** End of 'createShader' function */
} /** End of 'shader' class */

/** EXPORTS */
export { texture };

/** END OF 'shaders.ts' FILE */
