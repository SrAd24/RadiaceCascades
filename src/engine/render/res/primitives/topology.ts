/* FILE NAME   : topology.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { vec2 } from "../../../../math/mth_vec2";
import { vec3 } from "../../../../math/mth_vec3";
import { vec4 } from "../../../../math/mth_vec4";

/** Point vertex class */
class point {
  public p = new vec3(0, 0, 0);
  public constructor(p: vec3) {
    this.p = p;
    return this;
  }
} /** End of point vertex class */

/** Std vertex class */
class std {
  /** #public parameters */
  public p: vec3;
  public t: vec2;
  public n: vec3;
  public c: vec4;
  public constructor(
    p: vec3 = new vec3(0, 0, 0),
    t: vec2 = new vec2(0, 0),
    n: vec3 = new vec3(0, 0, 0),
    c: vec4 = new vec4(0, 0, 0, 0),
  ) {
    this.p = p;
    this.t = t;
    this.n = n;
    this.c = c;
    return this;
  }

  static attributes = {
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
  };

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
}

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

  public async evalTangents() {
    if (
      this.vertexes.length > 0 &&
      typeof this.vertexes[0] === "object" &&
      this.vertexes[0] !== null
    ) {
      if ("tangent" in this.vertexes[0] && "bitangent" in this.vertexes[0]) {
        // Initialize tangent and bitangent vectors
        for (let i = 0; i < this.vertexes.length; i++) {
          (this.vertexes[i] as any).tangent = new vec3(0, 0, 0);
          (this.vertexes[i] as any).bitangent = new vec3(0, 0, 0);
        }

        let count = 0;
        if (this.indexes.length > 0) count = this.indexes.length;
        else count = this.vertexes.length;

        for (let i = 0; i < count; i += 3) {
          let inds: number[];
          if (this.indexes.length > 0)
            inds = [this.indexes[i], this.indexes[i + 1], this.indexes[i + 2]];
          else inds = [i, i + 1, i + 2];

          // Get triangle data
          let v0 = this.vertexes[inds[0]] as any;
          let v1 = this.vertexes[inds[1]] as any;
          let v2 = this.vertexes[inds[2]] as any;

          let pos1 = v0.p;
          let pos2 = v1.p;
          let pos3 = v2.p;

          let uv1 = v0.t;
          let uv2 = v1.t;
          let uv3 = v2.t;

          // Calculate edges
          let edge1 = pos2.sub(pos1);
          let edge2 = pos3.sub(pos1);
          let deltaUV1 = new vec2(uv2.x - uv1.x, uv2.y - uv1.y);
          let deltaUV2 = new vec2(uv3.x - uv1.x, uv3.y - uv1.y);

          let det = deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y;
          // if (Math.abs(det) < 0.0001) continue; // Skip degenerate triangles
          let f = 1.0 / Math.max(det, 0.01);
          
          let tangent = new vec3(
            f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x),
            f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y),
            f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z)
          );

          let bitangent = new vec3(
            f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x),
            f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y),
            f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z)
          );

          // Add to vertices
          v0.tangent = v0.tangent.add(tangent);
          v1.tangent = v1.tangent.add(tangent);
          v2.tangent = v2.tangent.add(tangent);

          v0.bitangent = v0.bitangent.add(bitangent);
          v1.bitangent = v1.bitangent.add(bitangent);
          v2.bitangent = v2.bitangent.add(bitangent);
        }

        // Normalize tangent and bitangent vectors
        for (let i = 0; i < this.vertexes.length; i++) {
          (this.vertexes[i] as any).tangent.normilizing();
          (this.vertexes[i] as any).bitangent.normilizing();
        }
      }
    }
  }
} /** End of topology class */

/** Std extended vertex class */
class std_ext {
  /** #public parameters */
  public p: vec3;
  public t: vec2;
  public n: vec3;
  public c: vec4;
  public tangent: vec3;
  public bitangent: vec3;
  
  public constructor(
    p: vec3 = new vec3(0, 0, 0),
    t: vec2 = new vec2(0, 0),
    n: vec3 = new vec3(0, 0, 0),
    c: vec4 = new vec4(0, 0, 0, 0),
    tangent: vec3 = new vec3(1, 0, 0),
    bitangent: vec3 = new vec3(0, 1, 0)
  ) {
    this.p = p;
    this.t = t;
    this.n = n;
    this.c = c;
    this.tangent = tangent;
    this.bitangent = bitangent;
    return this;
  }

  static attributes = {
    arrayStride: 72, // 48 + 24 (6 floats for tangent + bitangent)
    attributes: [
      { format: "float32x3", offset: 0, shaderLocation: 0 }, // position
      { format: "float32x2", offset: 3 * 4, shaderLocation: 1 }, // texcoord
      { format: "float32x3", offset: 3 * 4 + 2 * 4, shaderLocation: 2 }, // normal
      { format: "float32x4", offset: 3 * 4 + 2 * 4 + 3 * 4, shaderLocation: 3 }, // color
      { format: "float32x3", offset: 3 * 4 + 2 * 4 + 3 * 4 + 4 * 4, shaderLocation: 4 }, // tangent
      { format: "float32x3", offset: 3 * 4 + 2 * 4 + 3 * 4 + 4 * 4 + 3 * 4, shaderLocation: 5 }, // bitangent
    ],
  };

  public toFloatArray(): number[] {
    return [
      this.p.x, this.p.y, this.p.z,
      this.t.x, this.t.y,
      this.n.x, this.n.y, this.n.z,
      this.c.x, this.c.y, this.c.z, this.c.w,
      this.tangent.x, this.tangent.y, this.tangent.z,
      this.bitangent.x, this.bitangent.y, this.bitangent.z,
    ];
  }
}

/** EXPORTS */
export { point };
export { std };
export { std_ext };
export { topology };

/** END OF 'topology.ts' FILE */
