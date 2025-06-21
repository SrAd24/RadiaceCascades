/* FILE NAME   : uni_test.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";
import { material_pattern } from "engine/render/res/mtl_ptn/material_patterns";
import { gltfParser } from "utils/parser";

/** Unit test class */
class _uni_gltf extends unit {
  private prims: any;
  private mtl: any;
  private pipeline: any;

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: any): Promise<any> {
    this.pipeline = await ani.createMaterialPattern({
      shaderName: "model",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
    });

    const material = await ani.createMaterial({
      material_pattern: this.pipeline,
      albedo: new vec3(0.8, 0.2, 1),
      roughness: 1,
      metallic: 1,
      emission: new vec3(0, 0, 0),
    });

    const parser = new gltfParser();
    this.prims = await parser.gltfToPTNC('/bin/models/ken/scene.gltf');
  } /** End of 'init' function */

  /**
   * @info Init function  
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    for (let prim of this.prims) {
        ani.draw(prim);
    }
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
  } /** End of 'response' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {

  } /** End of 'destroy' function */
}

// Test unit
const uni_gltf: _uni_gltf = new _uni_gltf();

/** EXPORTS */
export { uni_gltf };

/** END OF 'test_unit.ts' FILE */
