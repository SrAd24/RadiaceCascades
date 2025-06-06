/* FILE NAME   : texture.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** Buffer class */
class texture {
  /** #public parameters */
  public gpuTexture: any; // GPU texture object
  public gpuTextureView: any; // GPU texture view object

  /**
   * @info Create texture function
   * @param device: any
   * @param width: number
   * @param height: number
   * @param textureFormat: any
   * @param textureUsage: any
   * @param textureArrayLayerCount: number
   * @param viewDimension: any
   * @returns none
   */
  public createTexture(
    device: any,
    width: number,
    height: number,
    textureFormat: any,
    textureUsage: any,
    textureArrayLayerCount: number,
    viewDimension: any,
  ): void {
    this.gpuTexture = device.createTexture({
      size: [width, height],
      format: textureFormat,
      usage: textureUsage,
      dimension: "2d",
      arrayLayerCount: textureArrayLayerCount,
    });

    this.gpuTextureView = this.gpuTexture.createView({
      dimension: viewDimension,
    });
  } /** End of 'createTexture' function */

  /**
   * @info Destroy texture function
   * @returns none
   */
  public destroyTexture(): void {
    this.gpuTexture.destroy();
  } /** End of 'destroyTexture' function */
} /** End of 'texture' class */

/** EXPORTS */
export { texture };

/** END OF 'texture.ts' FILE */
