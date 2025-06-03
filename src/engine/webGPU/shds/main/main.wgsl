/* FILE NAME   : main.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */
 
/** Vertex out struct*/
struct vertexOut {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
} /** End of 'vertexOut' struct */

/** Vertex shader **/
@vertex 

/**
 * @info Vertex main function
 * @param position: vec4f
 * @param color: vec4f
 * @return vertex out struct
 */
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> vertexOut {
  var out: vertexOut;
  out.position = position;
  out.color = color;
  return out;
} /** End of 'vertex_main' function */

/** Fragment shader **/
@fragment

/**
 * @info Fragment main function
 * @param data: vertexOut
 * @return point color
 */
fn fragment_main(data: vertexOut) -> @location(0) vec4f {
  return vertexOut.color;
} /** End of 'fragment_main' function*/

/** END OF 'main.wgsl' FILE */