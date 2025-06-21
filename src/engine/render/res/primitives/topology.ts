/* FILE NAME   : topology.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

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
} /** End of topology class */

/** EXPORTS */
export { point };
export { std };
export { topology };

/** END OF 'topology.ts' FILE */
