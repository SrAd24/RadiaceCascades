/* FILE NAME   : parser.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** IMPORTS */
import { vertex } from '../src/engine/webGPU/vertex.js'

/**
 * @info load obj verteces from file function
 * @param fileName: String
 * @returns vertex array
 */
const loadObj: Function = async (fileName: String): vertex[] => {
  // load file data
  const filePath = "../../bin/models/" + fileName;
  const fetchedFile = await fetch(filePath);
  const fileData = (await fetchedFile.text()).toString();

  // read file data
  let vertexCount: number = 0;
  let verteces: vertex[];
  for (let index = 0; index < fileData.length; index++) {
    const element = fileData[index];
    
    if (fileData[index] != "v") continue;
    // read vertex info
    else {
      index++;
      while (fileData[index] != "v" && index < fileData.length)
      {
        let x: String = "";
        let y: String = "";
        let z: String = "";

        vertexCount++;

        while (fileData[index] == " ") index++;
        while (fileData[index] != " ") x += fileData[index++];
        while (fileData[index] == " ") index++;
        while (fileData[index] != " ") y += fileData[index++];
        while (fileData[index] == " ") index++;
        while (fileData[index] != " ") z += fileData[index++];

        vertex[vertexCount].x = parseFloat(x);
        vertex[vertexCount].y = parseFloat(y);
        vertex[vertexCount].z = parseFloat(z);
        vertex[vertexCount].w = 0.0;
      }
    }
  }

  return verteces;
} /** End of 'loadObj' function */

/** Class model */
class model {
  /** #public parameters */  
  public verteces: vertex[]; // verteces array

  /**
   * @info load model from file function
   * @param fileName: String 
   * @returns none
   */
  public async loadModel(fileName: String): void {
    if (fileName.endsWith(".bin"))
        verteces = await loadObj();
  }/** End of 'loadModel' function */
} /** End of 'model' class */

/** EXPORTS */
export { model };

/** END OF 'parser.ts' FILE */
