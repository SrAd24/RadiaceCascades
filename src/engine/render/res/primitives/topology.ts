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

/** Attributes object */
const vertexAttributes = {
  point: {
    arrayStride: 12,
    attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }],
  },
  std: {
    arrayStride: 48,
    attributes: [
      { format: "float32x3", offset: 0, shaderLocation: 0 },
      { format: "float32x2", offset: 3 * 4, shaderLocation: 1 },
      { format: "float32x3", offset: 3 * 4 + 2 * 4, shaderLocation: 2 },
      {
        format: "float32x4",
        offset: 3 * 4 + 2 * 4 + 3 * 4,
        shaderLocation: 3,
      },
    ],
  },
}; /** End of 'vertexAttributesType' object */

class stdVertex {
  public p = new vec3(0, 0, 0);
  public t = new vec2(0, 0);
  public n = new vec3(0, 0, 0);
  public c = new vec4(0, 0, 0, 0);
  constructor(x: number, y: number) {
    this.p.x = x;
    this.p.y = y;
  }
}

/** Vertex object */
class vertex {
  /** Point vertex class variable */
  public point = class {
    public p = new vec3(0, 0, 0);
    public constructor(p: vec3) {
      this.p = p;
      return this;
    }
  }; /** End of point vertex class */
  /** Std vertex class variable */
  public std = class {
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
    public toFloatArray(): number[] {
      return [
        this.p.x,
        this.p.y,
        this.p.z,
        this.t.x,
        this.t.y,
        this.n.x,
        this.n.y,
        this.n.z,
        this.c.x,
        this.c.y,
        this.c.z,
        this.c.w,
      ];
    }
  }; /** End of std vertex class */
} /** End of vertex object */

/** Topology class */
class topology<vertType> {
  /** #public parameters */
  public vertexes!: vertType[];
  public indexes!: number[];

  /** #public parameters */
  public constructor(v: vertType[], i: number[] = []) {
    this.vertexes = v;
    this.indexes = i;
  } /* End of constructor */

  public getIndexes(): Uint32Array {
    return new Uint32Array(this.indexes);
  }

  public getVertexes(): Float32Array {
    let vData = new Float32Array(this.vertexes.length * 12);
    if (
      this.vertexes.length > 0 &&
      typeof this.vertexes[0] === "object" &&
      this.vertexes[0] !== null
    ) {
      if ("n" in this.vertexes[0]) {
        vData = new Float32Array(
          this.vertexes.flatMap((v) => (v as any).toFloatArray()),
        );
        // let cnt = 0;
        // for (let j = 0; j < this.vertexes.length; j++) {
        //   vData[cnt++] = (this.vertexes[j] as any).p.x;
        //   vData[cnt++] = (this.vertexes[j] as any).p.y;
        //   vData[cnt++] = (this.vertexes[j] as any).p.z;
        //   vData[cnt++] = (this.vertexes[j] as any).t.x;
        //   vData[cnt++] = (this.vertexes[j] as any).t.y;
        //   vData[cnt++] = (this.vertexes[j] as any).n.x;
        //   vData[cnt++] = (this.vertexes[j] as any).n.y;
        //   vData[cnt++] = (this.vertexes[j] as any).n.z;
        //   vData[cnt++] = (this.vertexes[j] as any).c.x;
        //   vData[cnt++] = (this.vertexes[j] as any).c.y;
        //   vData[cnt++] = (this.vertexes[j] as any).c.z;
        //   vData[cnt++] = (this.vertexes[j] as any).c.w;
        // }
      } else if ("p" in this.vertexes[0]) {
        let cnt = 0;
        for (let j = 0; j < this.vertexes.length; j++) {
          vData[cnt++] = (this.vertexes[j] as any).p.x;
          vData[cnt++] = (this.vertexes[j] as any).p.y;
          vData[cnt++] = (this.vertexes[j] as any).p.z;
        }
      }
    }

    return vData;
  }

  public async evalNormals() {
    if (
      this.vertexes.length > 0 &&
      typeof this.vertexes[0] === "object" &&
      this.vertexes[0] !== null
    )
      if ("n" in this.vertexes[0]) {
        for (let i = 0; i < this.vertexes.length; i++)
          (this.vertexes[i] as any).n = new vec3(0, 0, 0);
        let count = 0;
        if (this.indexes.length > 0) count = this.indexes.length;
        else count = this.vertexes.length;

        for (let i = 0; i < count; i += 3) {
          let inds: number[];
          if (this.indexes.length > 0)
            inds = [this.indexes[i], this.indexes[i + 1], this.indexes[i + 2]];
          else inds = [i, i + 1, i + 2];

          let p0 = (this.vertexes[inds[0]] as any).p;
          let p1 = (this.vertexes[inds[1]] as any).p;
          let p2 = (this.vertexes[inds[2]] as any).p;
          let N = p1.sub(p0).cross(p2.sub(p0)).normilize();
          (this.vertexes[inds[0]] as any).n = (
            this.vertexes[inds[0]] as any
          ).n.add(N);
          (this.vertexes[inds[1]] as any).n = (
            this.vertexes[inds[1]] as any
          ).n.add(N);
          (this.vertexes[inds[2]] as any).n = (
            this.vertexes[inds[2]] as any
          ).n.add(N);
        }
        for (let i = 0; i < this.vertexes.length; i++)
          (this.vertexes[i] as any).n.normilizing();
      }
  }
} /** End of topology class */

/** EXPORTS */
export { vertex };
export { stdVertex };
export { topology };
export { vertexAttributes };

/** END OF 'topology.ts' FILE */
