/* FILE NAME   : shaders.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** Shader class */
class shader {
  /** #private parameters */
  private shaderModule: any; // Shader module variable

  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  private async readShader(shaderName: String): Promise<any> {
    const response = fetch(
      "src/engine/webGPU/shds/" + shaderName + "/" + shaderName + ".wgsl",
    );

    // const response = await fetch("src/engine/webGPU/shds/main/main.wgsl");
    if (!(await response).ok) {
      throw Error("can`t read shader");
    }
    const data = (await response).text();

    console.log(data);

    return data;
  } /** End of 'readShader' function */

  /** #public parameters */
  /**
   * @info Create shader function
   * @param shaderName: String
   * @returns ready shader
   */
  public async createShader(shaderName: String, device: any): Promise<any> {
    // get shader data
    const shaderData = await this.readShader(shaderName);

    // create shader module
    this.shaderModule = device.createShaderModule({
      code: shaderData,
    });

    console.log("shader created successfully: " + shaderName);
  } /** End of 'createShader' function */
} /** End of 'shader' class */

/** EXPORTS */
export { shader };

/** END OF 'shaders.ts' FILE */
