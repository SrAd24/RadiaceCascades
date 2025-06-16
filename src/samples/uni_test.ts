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
import { vrc } from "vrc";
import "test.ts";

import * as mth from "../math/mth";

class _uni_test extends unit {
  private pipeline: any;
  private prim: any;

  /** #public parameters */
  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async init(render: any): Promise<any> {
    let x = new std(1, 2);
    console.log(x);
    // load file data
    const filePath = "../../bin/models/" + "cow.obj";
    const fetchedFile = await fetch(filePath);
    const fileData = (await fetchedFile.text()).toString();
    let verteces: any[] = [];
    let inds: number[] = [];

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

        verteces[vertexCount++] = vrc.vertex.std(
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

        inds[icnt++] = p3 - 1;
        inds[icnt++] = p2 - 1;
        inds[icnt++] = p - 1;
      }
    }

    let topo = new vrc.topology(verteces, inds);

    await topo.evalNormals();
    this.pipeline = await render.createMaterialPattern({
      shaderName: "main",
      vertexAttributes: vrc.vertexAttributes.std,
      topology: "triangle-list",
    });
    console.log(this.pipeline);
    this.prim = await render.createPrimitive({
      material_pattern: this.pipeline,
      topology: topo,
    });
    console.log(this.prim);
    // let s = await render.createBuffer({
    //   usage: vrc.bufferUsage.copy_dst | vrc.bufferUsage.vertex,
    //   size: this.V.byteLength,
    //   data: this.V,
    // });
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param render: any
   * @returns none
   */
  public async render(render: any): Promise<any> {
    let m = mth.mat4.rotateY(vrc.timer.time * 45);

    await render.draw(this.prim, m);
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
