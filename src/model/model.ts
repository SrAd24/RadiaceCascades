/* FILE NAME   : parser.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** IMPORTS */
import { vertex } from "../engine/res/vertex.ts";
import * as mth from "../math/mth.ts";

/** Class model */
class model {
  /** #public parameters */
  public verteces: vertex[] = []; // verteces array

  /**
   * @info load obj verteces from file function
   * @param fileName: String
   * @returns vertex array
   */
  public async loadObj(fileName: String): Promise<any> {
    // load file data
    const filePath = "../../bin/models/" + fileName;
    const fetchedFile = await fetch(filePath);
    const fileData = (await fetchedFile.text()).toString();

    // read file data
    let vertexCount: number = 0;
    for (let index = 0; index < fileData.length; index++) {
      if (
        fileData[index] != "v" ||
        fileData[index + 1] == "n" ||
        fileData[index] == "f"
      )
        continue;
      // read vertex info
      else if (fileData[index] == "v" && fileData[index + 1] != "n") {
        index++;
        let x: string = "";
        let y: string = "";
        let z: string = "";

        vertexCount++;

        while (fileData[index] == " " && index < fileData.length) index++;
        while (fileData[index] != " " && index < fileData.length)
          x += fileData[index++];
        while (fileData[index] == " " && index < fileData.length) index++;
        while (fileData[index] != " " && index < fileData.length)
          y += fileData[index++];
        while (fileData[index] == " " && index < fileData.length) index++;
        while (
          fileData[index] != " " &&
          index < fileData.length &&
          fileData[index] != "\r" &&
          fileData[index] != "\n"
        )
          z += fileData[index++];

        this.verteces[vertexCount] = new vertex(
          new mth.vec4(parseFloat(x), parseFloat(y), parseFloat(z), 1.0),
        );
      }
    }
  } /** End of 'loadObj' function */

  /**
   * @info load model from file function
   * @param fileName: String
   * @returns none
   */
  public async loadModel(fileName: String): Promise<any> {
    if (fileName.toLocaleLowerCase().endsWith(".obj"))
      await this.loadObj(fileName);
  } /** End of 'loadModel' function */
} /** End of 'model' class */

/** EXPORTS */
export { model };

/** END OF 'parser.ts' FILE */
