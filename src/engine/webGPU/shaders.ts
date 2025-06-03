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
  readonly shaderModule; // Shader module variable

  /**
   * @info Read shader info function
   * @param shaderName: String
   * @returns info in string
   */
  private async readShader(shaderName: String): String {
    const response = fetch("shaders/" + shaderName + "/" + shaderName + ".wgsl");
    if (!(await response).ok) {
        throw Error("can`t read shader");        
    }
    const data = (await response).text();
    return data;
  } /** End of 'readShader' function */
    
  /** #public parameters */
  /**
   * @info Create shader function
   * @param shaderName: String
   * @returns ready shader
   */
  public async createShader(shaderName: String, device: Promise): void {
    // get shader data
    const shaderData = await this.readShader(shaderName);

    // create shader module
    this.shaderModule = device.createShaderModule({
        code: shaderData
    });   
  } /** End of 'createShader' function */
} /** End of 'shader' class */

/** END OF 'shaders.ts' FILE */