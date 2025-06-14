/* FILE NAME   : topology.ts
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

/** Vertex object */
class vertex {
  /** Void vertex class variable */
  static void = class {
    public arrayStride = 0;
    public attributes = [];
    public constructor() {
      return this;
    }
  }; /** End of void vertex class */
  /** Point vertex class variable */
  public point = class {
    public arrayStride = 3 * 4;
    public attributes = [{ format: "float32x3", offset: 0, shaderLocation: 0 }];
    public p = new vec3(0, 0, 0);
    public constructor(p: vec3) {
      this.p = p;
      return this;
    }
  }; /** End of point vertex class */
  /** Std vertex class variable */
  public std = class {
    public arrayStride = 3 * 4 + 2 * 4 + 3 * 4 + 4 * 4;
    public attributes = [
      { format: "float32x3", offset: 0, shaderLocation: 0 },
      { format: "float32x2", offset: 3 * 4, shaderLocation: 1 },
      { format: "float32x3", offset: 3 * 4 + 2 * 4, shaderLocation: 2 },
      {
        format: "float32x4",
        offset: 3 * 4 + 2 * 4 + 3 * 4,
        shaderLocation: 3,
      },
    ];
    public p = new vec3(0, 0, 0);
    public t = new vec2(0, 0);
    public n = new vec3(0, 0, 0);
    public c = new vec4(0, 0, 0, 0);
    public constructor(p: vec3, t: vec2, n: vec3, c: vec4) {
      this.p = p;
      this.t = t;
      this.n = n;
      this.c = c;
      return this;
    }
  }; /** End of std vertex class */
} /** End of vertex object */

/** Topology class */
class topology<vertType> {
  /** #public parameters */
  public vData: Float32Array | undefined = undefined;
  public vertices: vertType[] = [];
  public indexes: number[] = [];

  /** #public parameters */
  public constructor(v: vertType[], i: number[] = []) {
    this.vertices = v;
    if ((v[0] as any).arrayStride == 48) {
      this.vData = new Float32Array(v.length * 12);
      let cnt = 0;
      for (let j = 0; j < v.length; j++) {
        this.vData[cnt++] = (v[j] as any).p.x;
        this.vData[cnt++] = (v[j] as any).p.y;
        this.vData[cnt++] = (v[j] as any).p.z;
        this.vData[cnt++] = (v[j] as any).t.x;
        this.vData[cnt++] = (v[j] as any).t.y;
        this.vData[cnt++] = (v[j] as any).n.x;
        this.vData[cnt++] = (v[j] as any).n.y;
        this.vData[cnt++] = (v[j] as any).n.z;
        this.vData[cnt++] = (v[j] as any).c.x;
        this.vData[cnt++] = (v[j] as any).c.y;
        this.vData[cnt++] = (v[j] as any).c.z;
        this.vData[cnt++] = (v[j] as any).c.w;
      }
    } else if ((v[0] as any).arrayStride == 12) {
      this.vData = new Float32Array(v.length * 12);
      let cnt = 0;
      for (let j = 0; j < v.length; j++) {
        this.vData[cnt++] = (v[j] as any).p.x;
        this.vData[cnt++] = (v[j] as any).p.y;
        this.vData[cnt++] = (v[j] as any).p.z;
      }
    }
  } /* End of constructor */
} /** End of topology class */

/** EXPORTS */
export { vertex };
export { topology };

/** END OF 'topology.ts' FILE */
