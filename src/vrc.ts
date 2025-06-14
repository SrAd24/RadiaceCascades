/* FILE NAME   : vrc.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 13.06.2025
 */

/** IMPORTS */
import { vec2 } from "math/mth_vec2";
import { vec3 } from "math/mth_vec3";
import { vec4 } from "math/mth_vec4";
import { mat4 } from "math/mth_mat4";
import { input } from "./engine/input/input";
import { timer } from "./engine/input/timer";
import { unit } from "./engine/anim/anim";
import { topology, vertex } from "./engine/render/res/primitives/topology";
import { primitive_type } from "./engine/render/res/primitives/primitives";

/** vrc class */
const vrc = {
  /**
   * @info Class vec2 constructor
   * @param x: number
   * @param y: number
   */
  vec2(x: number, y?: number): vec2 {
    return new vec2(x, y);
  } /** End of 'vec2' function */,

  /**
   * @info Class vec3 constructor
   * @param x: number
   * @param y: number
   * @param z: number
   */
  vec3(x: number, y?: number, z?: number): any {
    return new vec3(x, y, z);
  } /** End of 'vec3' function */,

  /**
   * @info Class vec4 constructor
   * @param x: number
   * @param y: number
   * @param z: number
   * @param w: number
   */
  vec4(x: number, y?: number, z?: number, w?: number): any {
    return new vec4(x, y, z, w);
  } /** End of 'vec4' function */,

  mat4: mat4, // Matrix 4x4 class
  input: input, // Input class
  timer: timer, // Timer class
  unit: unit, // Unit class
  vertex: {
    void() {
      return new vertex.void();
    },
    point(p: vec3) {
      const v = new vertex();
      return new v.point(p);
    },
    std(p: vec3, t: vec2, n: vec3, c: vec4) {
      const v = new vertex();
      return new v.std(p, t, n, c);
    },
  }, // Vertex class
  prim_type: primitive_type,
  topology: topology,
}; /** End of 'vrc' class */

/** EXPORTS */
export { vrc };

/** END OF 'vrc.ts' FILE */
