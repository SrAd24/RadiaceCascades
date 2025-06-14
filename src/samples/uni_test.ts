/* FILE NAME   : test_unit.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { unit } from "../engine/anim/units/units";

import * as mth from "../math/mth";
class vertex {
  public position: mth.vec3 = new mth.vec3(0, 0, 0);
  public texcoord: mth.vec2 = new mth.vec2(0, 0);
  public normal: mth.vec3 = new mth.vec3(0, 0, 0);
  public color: mth.vec4 = new mth.vec4(0, 0, 0, 0);

  constructor(pos: mth.vec3) {
    this.position = pos;
  }
}

class _uni_test extends unit {
  private pipeline: any;
  private prim: any;
  public verteces: vertex[] = []; // verteces array

  V: Float32Array = new Float32Array();
  I: number[] = [];
  Isnt: Uint32Array = new Uint32Array();
  /** #public parameters */
  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {
    // load file data
    const filePath = "../../bin/models/" + "cow.obj";
    const fetchedFile = await fetch(filePath);
    const fileData = (await fetchedFile.text()).toString();

    // read file data
    let vertexCount: number = 0;
    let icnt: number = 0;
    for (let index = 0; index < fileData.length; index++) {
      // read vertex info
      if (fileData[index] == "v" && fileData[index + 1] != "n") {
        index++;
        let x: string = "";
        let y: string = "";
        let z: string = "";

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

        this.verteces[vertexCount++] = new vertex(
          new mth.vec3(parseFloat(x), parseFloat(y), parseFloat(z)),
        );
      } else if (fileData[index] == "f" && fileData[index + 1] == " ") {
        let x: string = "";
        let y: string = "";
        let z: string = "";
        index++;

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
        let p3 = parseInt(x.split("//")[0]);
        let p2 = parseInt(y.split("//")[0]);
        let p = parseInt(z.split("//")[0]);

        this.I[icnt++] = p3 - 1;
        this.I[icnt++] = p2 - 1;
        this.I[icnt++] = p - 1;
      }
    }
    this.Isnt = new Uint32Array(this.I);
    let a = 0;

    for (let i = 0; i < this.I.length; i += 3) {
      let p0 = this.verteces[this.I[i]].position;
      let p1 = this.verteces[this.I[i + 1]].position;
      let p2 = this.verteces[this.I[i + 2]].position;
      let N = p1.sub(p0).cross(p2.sub(p0)).normilize();
      this.verteces[this.I[i]].normal = this.verteces[this.I[i]].normal.add(N);
      this.verteces[this.I[i + 1]].normal =
        this.verteces[this.I[i + 1]].normal.add(N);
      this.verteces[this.I[i + 2]].normal =
        this.verteces[this.I[i + 2]].normal.add(N);
    }
    for (let i = 0; i < this.verteces.length; i++) {
      this.verteces[i].normal = this.verteces[i].normal.normilize();
    }

    this.V = new Float32Array(this.verteces.length * 12);
    for (let i = 0; i < this.verteces.length; i++) {
      this.V[a++] = this.verteces[i].position.x;
      this.V[a++] = this.verteces[i].position.y;
      this.V[a++] = this.verteces[i].position.z;
      this.V[a++] = this.verteces[i].texcoord.x;
      this.V[a++] = this.verteces[i].texcoord.y;
      this.V[a++] = this.verteces[i].normal.x;
      this.V[a++] = this.verteces[i].normal.y;
      this.V[a++] = this.verteces[i].normal.z;
      this.V[a++] = this.verteces[i].color.x;
      this.V[a++] = this.verteces[i].color.y;
      this.V[a++] = this.verteces[i].color.z;
      this.V[a++] = this.verteces[i].color.w;
    }
    this.pipeline = await render.createShaders();
    this.prim = await render.createPrimitive(this.pipeline, this.V, this.Isnt);
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(render: any): Promise<any> {
    await render.draw(this.prim);
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async response(
    render: any,
  ): Promise<any> {} /** End of 'response' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async destroy(render: any): Promise<any> {
    console.log("test_unit destroy");
  } /** End of 'destroy' function */
}

// Test unit
const uni_test: _uni_test = new _uni_test();

/** EXPORTS */
export { uni_test };

/** END OF 'test_unit.ts' FILE */
