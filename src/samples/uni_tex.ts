/* FILE NAME   : uni_tex.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit texture class */
class _uni_tex extends unit {
  private pipeline: any;
  private pipeline2: any;
  private tex: any;
  private tex2: any;
  private prim: any;
  private bGroup: any;
  private n: number = 0;
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
        new vec3(1, 1, 0),
        new vec2(0, 0),
        new vec3(0, 0, 0),
        new vec4(1, 0, 0, 1),
      ),
      new std(
        new vec3(-1, 1, 0),
        new vec2(800, 0),
        new vec3(0, 0, 0),
        new vec4(0, 1, 0, 1),
      ),
      new std(
        new vec3(-1, -1, 0),
        new vec2(800, 600),
        new vec3(0, 0, 0),
        new vec4(1, 0, 1, 1),
      ),
      new std(
        new vec3(1, -1, 0),
        new vec2(0, 600),
        new vec3(0, 0, 0),
        new vec4(0, 0, 1, 1),
      ),
    ];
    let inds: number[] = [0, 1, 2, 0, 2, 3];

    let topo = new topology(verteces, inds);

    // this.tex = await ani.createTexture({
    //   size: { width: 52, height: 52 },
    //   format: "rgba8unorm",
    //   usage:
    //     GPUTextureUsage.RENDER_ATTACHMENT |
    //     GPUTextureUsage.COPY_DST |
    //     GPUTextureUsage.TEXTURE_BINDING,
    // });
    this.tex2 = await ani.createTexture({
      size: { width: 800, height: 600 },
      format: "r32sfloat",
      usage:
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST,
    });

    const pixelData = new Float32Array(800 * 600).fill(2048);

    ani.queue.writeTexture(
      { texture: this.tex2.texture },
      pixelData,
      { bytesPerRow: 800 * 4 },
      { width: 800, height: 600 },
    );
    // await this.tex.updateByImage("bin/textures/tex.png");
    this.bGroup = await ani.createBindGroup({
      groupIndex: 1,
      bindings: [
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.tex2,
        },
      ],
    });

    this.pipeline = await ani.createMaterialPattern({
      shaderName: "texture",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
      bindings: this.bGroup,
    });

    this.prim = await ani.createPrimitive({
      material_pattern: this.pipeline,
      topology: topo,
    });

    console.log(this.prim);
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    let m = mat4.rotateY(timer.time * 45);
    await ani.draw(this.prim, m);
    this.n += 1;
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(
    ani: anim,
  ): Promise<any> {} /** End of 'response' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(
    ani: anim,
  ): Promise<any> {} /** End of 'destroy' function */
}

const uni_tex: _uni_tex = new _uni_tex();

/** EXPORTS */
export { uni_tex };

/** END OF 'uni_tex.ts' FILE */
