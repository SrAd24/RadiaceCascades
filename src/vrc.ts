/* FILE NAME   : vrc.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { vec2 } from "./math/mth_vec2";
import { vec3 } from "./math/mth_vec3";
import { vec4 } from "./math/mth_vec4";
import { mat4 } from "./math/mth_mat4";
import { camera } from "./math/camera";
import { input } from "./engine/input/input";
import { timer } from "./engine/input/timer";
import { topology, std, point } from "./engine/render/res/primitives/topology";
import { PI, d2R, r2D, INF } from "./math/mth_def";

declare global {
  // vec2 class declaration
  type vec2 = InstanceType<typeof vec2>;
  let vec2: typeof vec2;
  // vec3 class declaration
  type vec3 = InstanceType<typeof vec3>;
  let vec3: typeof vec3;
  // vec4 class declaration
  type vec4 = InstanceType<typeof vec4>;
  let vec4: typeof vec4;
  // mat4 class declaration
  type mat4 = InstanceType<typeof mat4>;
  let mat4: typeof mat4;
  // camera class declaration
  type camera = InstanceType<typeof camera>;
  let camera: typeof camera;
  // timer class declaration
  let timer: typeof timer;
  // input class declaration
  let input: typeof input;
  // topology class declaration
  type topology = InstanceType<typeof topology>;
  let topology: typeof topology;
  // std class declaration
  type std = InstanceType<typeof std>;
  let std: typeof std;
  // point class declaration
  type point = InstanceType<typeof point>;
  let point: typeof point;
  // PI constant declaration
  let PI: typeof PI;
  // Degrees to radians function declaration
  let d2R: typeof d2R;
  // Radians to degrees function declaration
  let r2D: typeof r2D;
  // Infinity constant declaration
  let INF: typeof INF;
}

/** GLOBAL VARIABLES */
(globalThis as any).vec2 = vec2;
(globalThis as any).vec3 = vec3;
(globalThis as any).vec4 = vec4;
(globalThis as any).mat4 = mat4;
(globalThis as any).camera = camera;
(globalThis as any).input = input;
(globalThis as any).timer = timer;
(globalThis as any).topology = topology;
(globalThis as any).std = std;
(globalThis as any).point = point;
(globalThis as any).PI = PI;
(globalThis as any).INF = INF;
(globalThis as any).d2R = d2R;
(globalThis as any).r2D = r2D;

/** END OF 'vrc.ts' FILE */
