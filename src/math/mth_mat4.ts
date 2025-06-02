/* FILE NAME   : mth_mat4.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/** IMPORTS */
import { mth } from './mth_def'
import { vec3 } from './mth_vec3';
import { vec4 } from './mth_vec4';

/** Matrix 4x4 class */
class mat4 {
  /** #public parameters */  
  public m: number[4][4]; // Matrix info

  /**
   * @info Class constructor
   * @param m1: number
   * @param m2: number 
   * @param m3: number 
   * @param m4: number 
   * @param m5: number 
   * @param m6: number 
   * @param m7: number 
   * @param m8: number 
   * @param m9: number 
   * @param m10: number 
   * @param m11: number 
   * @param m12: number 
   * @param m13: number 
   * @param m14: number 
   * @param m15: number 
   * @param m16: number 
   */
  public constructor(
    m1: number, m2: number, m3: number, m4: number,
    m5: number, m6: number, m7: number, m8: number,
    m9: number, m10: number, m11: number, m12: number,
    m13: number, m14: number, m15: number, m16: number
  ) {
    m[0][0] = m1, m[0][1] = m2, m[0][2] = m3, m[0][3] = m4, m[1][0] = m5;
    m[1][1] = m6, m[1][2] = m7, m[1][3] = m8, m[2][0] = m9, m[2][1] = m10;
    m[2][2] = m11, m[2][3] = m12, m[3][0] = m13, m[3][1] = m14, m[3][2] = m15, m[3][3] = m16;
  } /** End of constructor */  

  /**
   * @info Get identity matrix function
   * @returns identity matrix
   */
  public static identity(): mat4 {
    return new mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  } /** End of 'identity' function */

  /**
   * @info Translate matrix function
   * @param translateVector: vec3
   * @returns result matrix
   */
  public static translate(translateVector: vec3): mat4 {
    return mat4(1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                translateVector.x, translateVector.y, translateVector.z, 1);
  } /** End of 'translate' function */

  /**
   * @info Scale matrix fucntion
   * @param scaleVector: vec3
   * @returns result matrix
   */
  public static scale(scaleVector: vec3): mat4 {
    return mat4(scaleVector.x, 0, 0, 0,
                0, scaleVector.y, 0, 0,
                0, 0, scaleVector.z, 0,
                0, 0, 0, 1);            
  } /** End of 'scale' function */

  /**
   * @info Rotate matrix by x axis function
   * @param angle in degree
   * @return result matrix
   */
  public static rotateX(angle: number): mat4 {   
    an: number = mth.d2R(angle);
    c: number = Math.cos(an);
    s: number = Math.sin(an);

    return mat4(1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1);
  } /** End of 'rotateX' function */

  /**
   * @info Rotate matrix by y axis function
   * @param angle in degree
   * @return result matrix
   */
  public static rotateY(angle: number): mat4 {   
    an: number = mth.d2R(angle);
    c: number = Math.cos(an);
    s: number = Math.sin(an);

    return mat4(c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1);
  } /** End of 'rotateY' function */

  /**
   * @info Rotate matrix by z axis function
   * @param angle in degree
   * @return result matrix
   */
  public static rotateZ(angle: number): mat4 {   
    an: number = mth.d2R(angle);
    c: number = Math.cos(an);
    s: number = Math.sin(an);

    return mat4(c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1);
  } /** End of 'rotateZ' function */
  
  /**
   * @info Rotate matrix by vetor function
   * @param angle: number
   * @param rotateVector: vec3
   * @returns result matrix
   */
  public static rotate( angle: number, rotateVector: vec3 ): mat4 {
    a = mth.d2R(angle);
    s = Math.sin(a);
    c = Math.cos(a);
    v = rotateVector.Normalize();
  
    return matr(c + v.x * v.x * (1 - c),
                v.x * v.y * (1 - c) - v.z * s,
                v.x * v.z * (1 - c) + v.y * s, 
                0,
                v.y * v.x * (1 - c) - v.z * s,
                c + v.y * v.y * (1 - c),
                v.y * v.z * (1 - c) + v.x * s, 
                0,
                v.z * v.x * (1 - c) - v.y * s,
                v.z * v.y * (1 - c) + v.x * s, 
                c + v.z * v.z * (1 - c), 0,
                0, 
                0, 
                0, 
                1);
  } /* End of 'rotate' function */
  
  /**
   * @info Matrix multipling function
   * @param matrix: mat4
   * @returns result matrix
   */
  public mul(matrix: mat4): mat4 {
    return
        mat4(this.this.m[0][0] * matrix.m[0][0] + this.m[0][1] * matrix.m[1][0] + this.m[0][2] * matrix.m[2][0] + this.m[0][3] * matrix.m[3][0],
            this.m[0][0] * matrix.m[0][1] + this.m[0][1] * matrix.m[1][1] + this.m[0][2] * matrix.m[2][1] + this.m[0][3] * matrix.m[3][1],
            this.m[0][0] * matrix.m[0][2] + this.m[0][1] * matrix.m[1][2] + this.m[0][2] * matrix.m[2][2] + this.m[0][3] * matrix.m[3][2],
            this.m[0][0] * matrix.m[0][3] + this.m[0][1] * matrix.m[1][3] + this.m[0][2] * matrix.m[2][3] + this.m[0][3] * matrix.m[3][3],

            this.m[1][0] * matrix.m[0][0] + this.m[1][1] * matrix.m[1][0] + this.m[1][2] * matrix.m[2][0] + this.m[1][3] * matrix.m[3][0],
            this.m[1][0] * matrix.m[0][1] + this.m[1][1] * matrix.m[1][1] + this.m[1][2] * matrix.m[2][1] + this.m[1][3] * matrix.m[3][1],
            this.m[1][0] * matrix.m[0][2] + this.m[1][1] * matrix.m[1][2] + this.m[1][2] * matrix.m[2][2] + this.m[1][3] * matrix.m[3][2],
            this.m[1][0] * matrix.m[0][3] + this.m[1][1] * matrix.m[1][3] + this.m[1][2] * matrix.m[2][3] + this.m[1][3] * matrix.m[3][3],

            this.m[2][0] * matrix.m[0][0] + this.m[2][1] * matrix.m[1][0] + this.m[2][2] * matrix.m[2][0] + this.m[2][3] * matrix.m[3][0],
            this.m[2][0] * matrix.m[0][1] + this.m[2][1] * matrix.m[1][1] + this.m[2][2] * matrix.m[2][1] + this.m[2][3] * matrix.m[3][1],
            this.m[2][0] * matrix.m[0][2] + this.m[2][1] * matrix.m[1][2] + this.m[2][2] * matrix.m[2][2] + this.m[2][3] * matrix.m[3][2],
            this.m[2][0] * matrix.m[0][3] + this.m[2][1] * matrix.m[1][3] + this.m[2][2] * matrix.m[2][3] + this.m[2][3] * matrix.m[3][3],

            this.m[3][0] * matrix.m[0][0] + this.m[3][1] * matrix.m[1][0] + this.m[3][2] * matrix.m[2][0] + this.m[3][3] * matrix.m[3][0],
            this.m[3][0] * matrix.m[0][1] + this.m[3][1] * matrix.m[1][1] + this.m[3][2] * matrix.m[2][1] + this.m[3][3] * matrix.m[3][1],
            this.m[3][0] * matrix.m[0][2] + this.m[3][1] * matrix.m[1][2] + this.m[3][2] * matrix.m[2][2] + this.m[3][3] * matrix.m[3][2],
            this.m[3][0] * matrix.m[0][3] + this.m[3][1] * matrix.m[1][3] + this.m[3][2] * matrix.m[2][3] + this.m[3][3] * matrix.m[3][3]);
  } /** End of 'mul' function */

  /**
   * @info Transpose matrix function
   * @returns transposed matrix
   */
  public transpose(): mat4 {
    return matr(this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0],
                this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1],
                this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2],
                this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]);
  } /* End of 'Transponce' function */

  /**
   * @info Evaluate matrix determenant function
   * @param A11: number
   * @param A12: number
   * @param A13: number
   * @param A21: number
   * @param A22: number
   * @param A23: number
   * @param A31: number
   * @param A32: number 
   * @param A33: number
   * @returns determenant 3x3 matrix
   */
  public static determ3x3( A11: number, A12: number, A13: number,
                           A21: number, A22: number, A23: number,
                           A31: number, A32: number, A33: number ): number {
    return A11 * A22 * A33 + A12 * A23 * A31 + A13 * A21 * A32 -
          A11 * A23 * A32 - A12 * A21 * A33 - A13 * A22 * A31;
  } /* End of 'Determ3x3' function */

  /**
   * @info Evaluate matrix determenant function
   * @returns determenant current matrix
   */
  public determ4x4(): number {
        return
          +this.m[0][0] * mat4.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                                    this.m[2][1], this.m[2][2], this.m[2][3],
                                    this.m[3][1], this.m[3][2], this.m[3][3]) +
          -this.m[0][1] * mat4.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                                   this.m[2][0], this.m[2][2], this.m[2][3],
                                   this.m[3][0], this.m[3][2], this.m[3][3]) +
          +this.m[0][2] * mat4.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                                    this.m[2][0], this.m[2][1], this.m[2][3],
                                    this.m[3][0], this.m[3][1], this.m[3][3]) +
          -this.m[0][3] * mat4.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                                    this.m[2][0], this.m[2][1], this.m[2][2],
                                    this.m[3][0], this.m[3][1], this.m[3][2]);
  } /** End of 'determ4x4' function */

  /**
   * @info Evaluate view matrix function
   * @param loc: vec3
   * @param at: vec3
   * @param up1: vec3
   * @returns view matrix
   */
  public static view(loc: vec3, at: vec3, up1: vec3): mat4 
  {
    let dir: vec3 = (at.sub(loc)).Normalize();
    let right: vec3 = (dir.cross(up1)).Normalize();
    let up: vec3 = (right.cross(dir)).Normalize();
    
    return
        mat4(right.x, up.x, -dir.x, 0, 
            right.y, up.y, -dir.y, 0,
            right.z, up.z, -dir.z, 0,
            -(loc.dot(right)), -(loc.dot(up)), (loc.dot(dir)), 1);
  } /* End of 'view' function */

  /**
   * @info Evaluate frustrum matrix function
   * @param l: number 
   * @param r: number 
   * @param b: number  
   * @param t: number  
   * @param n: number  
   * @param f: number  
   * @returns frustrum matrix
   */
  public static Frustum(l: number, r: number, b: number, t: number, n: number, f: number): mat4
  {
    return matr(2 * n / (r - l), 0, 0, 0,
                0, 2 * n / (t - b), 0, 0,
                (r + l) / (r - l), (t + b) / (t - b), -(f + n) / (f - n), -1,
                0, 0, -2 * n * f / (f - n), 0);
  } /* End of 'Frustum' function */
} /** End of 'mat4' class */

/** EXPORTS */
export {mat4} ;

/** END OF 'mth.ts' FILE */