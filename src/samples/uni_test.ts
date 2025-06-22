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

/** Unit test class */
class _uni_test extends unit {
  private mdl: any;
  private prim: any;
  private mtl: any;
  private pipeline: any;
  private mats: any[] = [];
  private s: any = 0;
  private t: any;

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {
    ani.cam.set(new vec3(0, 0, 3), new vec3(0, 0, 0));
    let verteces: (typeof std)[] = [
      new std(
        new vec3(5, 5, 0),
        new vec2(0, 0),
        new vec3(0, 0, 0),
        new vec4(0, 0, 1, 1),
      ),
      new std(
        new vec3(-5, 5, 0),
        new vec2(1, 0),
        new vec3(0, 0, 0),
        new vec4(1, 0, 0, 1),
      ),
      new std(
        new vec3(-5, -5, 0),
        new vec2(1, 1),
        new vec3(0, 0, 0),
        new vec4(1, 1, 0, 1),
      ),
      new std(
        new vec3(5, -5, 0),
        new vec2(0, 1),
        new vec3(0, 0, 0),
        new vec4(0, 1, 0, 1),
      ),
    ];
    let inds: number[] = [0, 1, 2, 0, 2, 3];

    let topo = new topology(verteces, inds);
    topo.evalNormals();

    // this.pipeline = await ani.createMaterialPattern({
    //   shaderName: "model",
    //   vertexAttributes: std.attributes,
    //   topology: "triangle-list",
    // });

    // let material = await ani.createMaterial({
    //   material_pattern: this.pipeline,
    //   albedo: new vec3(0.8, 0.2, 1),
    //   roughness: 1,
    //   metallic: 1,
    //   emission: new vec3(0, 0, 0),
    // });

    // this.prim = await ani.createPrimitive({
    //   material: material,
    //   topology: topo,
    // });

    this.mdl = await ani.createModel({
        name: "girl",
        format: "gltf"
    });
    console.log(this.mdl)
  } /** End of 'init' function */

  /**
   * @info Init function  
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    await ani.drawModel(this.mdl, mat4.rotateX(90).mul(mat4.rotateY(timer.time * 30).mul(mat4.scale(new vec3(0.2)).mul(mat4.translate(new vec3(0, -30, 0))))));

  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    // await ani.drawModel(this.mdl, mat4.translate(new vec3(0, 0, 0).mulNum(3)));
    // await ani.drawModel(this.mdl, mat4.translate(new vec3(1)));

    // let slider = document.getElementById('mySlider');
    // let valueDisplay = document.getElementById('sliderValue');
    // if (slider && valueDisplay)
    // {
    //   slider.addEventListener('input', (e) => {
    //     valueDisplay.textContent = e.target.value;
    //     this.t = e.target.value;
    //   });
    // }
    // for (let i = -this.t / 2; i < this.t / 2; i++)
    //   for (let j = -this.t / 2; j < this.t / 2; j++)
    //     for (let k = -this.t / 2; k < this.t / 2; k++)
    //       this.mdl.prims[0].addInstance(mat4.rotateY(timer.time * 30).mul(mat4.translate(new vec3(i, j, k).mulNum(20))));
    

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
const uni_test: _uni_test = new _uni_test();

/** EXPORTS */
export { uni_test };

/** END OF 'test_unit.ts' FILE */
