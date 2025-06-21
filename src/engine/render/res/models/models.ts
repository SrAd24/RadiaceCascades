/* FILE NAME   : models.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { material_pattern } from "../mtl_ptn/material_patterns";
import { primitive } from "../primitives/primitives";

/** Model class */
class model {
  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public prims!: primitive[]; // Primitives array

  /**
   * @info Create model function
   * @param fileName: string
   * @returns none
   */
  public async create(fileName: string) {
    const response = await fetch("bin/models/" + fileName);
    let objText = await response.text();
    const vertices: std[] = [];
    let vertexCount = 0;
    const indices: number[] = [];
    const lines = objText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const parts = trimmed.split(/\s+/);
      const type = parts[0];
      if (type === "v" && parts.length >= 4) {
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);
        vertices.push(new std(new vec3(x, y, z)));
        vertexCount++;
      } else if (type === "f" && parts.length >= 4) {
        const faceIndices: number[] = [];

        for (let i = 1; i < parts.length; i++) {
          const vertexPart = parts[i].split("/")[0];
          const vertexIndex = parseInt(vertexPart) - 1;

          if (!isNaN(vertexIndex) && vertexIndex >= 0) {
            faceIndices.push(vertexIndex);
          }
        }
        for (let i = 1; i < faceIndices.length - 1; i++) {
          indices.push(faceIndices[0], faceIndices[i], faceIndices[i + 1]);
        }
      }
    }
    let topo = new topology(vertices, indices);
    await topo.evalNormals();
    let mtl_ptn = await this.render.createMaterialPattern({
      shaderName: "model",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
    });
    let material = await this.render.createMaterial({
      material_pattern: mtl_ptn,
      albedo: new vec3(1, 1, 0),
      roughness: 0.5,
      metallic: 0.8,
      emission: new vec3(0, 0, 0),
    });
    this.prims = [
      await this.render.createPrimitive({
        material: material,
        topology: topo,
      }),
    ];
    console.log(this.prims)
  } /** End of 'create' function */
} /** End of 'model' class */

/** Model manager class */
class model_manager {
  /** #public parameters */
  /**
   * @info Create group function
   * @param Group parameters
   * @returns new group
   */
  public async createModel(fileName: string): Promise<model> {
    let obj = new model();
    await obj.create(fileName);
    return obj;
  } /** End of 'createModel' function */
} /** End of 'model_manager' class */

/** EXPORTS */
export { model };
export { model_manager };

/** END OF 'models.ts' FILE */
