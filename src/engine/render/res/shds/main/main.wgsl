/* FILE NAME   : main.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */
 
/** Vertex out struct*/
struct vertexOut {
    @builtin(position) gl_position: vec4f,
    @location(0) position: vec3f,
    @location(1) texcoord: vec2f,
    @location(2) normal: vec3f,
    @location(3) color: vec4f
} /** End of 'vertexOut' struct */

struct mts {
  transform: mat4x4<f32>
};

@group(0) @binding(0) var<storage, read> data: array<mts>;

/** Vertex shader **/
@vertex 

/**
 * @info Vertex main function
 * @param position: vec4f
 * @param color: vec4f
 * @return vertex out struct
 */
fn vertex_main(@location(0) position: vec3f,
               @location(1) texcoord: vec2f,
               @location(2) normal: vec3f,
               @location(3) color: vec4f) -> vertexOut {
  var out: vertexOut;
  out.gl_position = data[0].transform * vec4f(position, 1.0);
  out.position = (data[0].transform * vec4f(position, 1.0)).xyz;
  out.texcoord = texcoord;
  out.normal = normal;
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
  return data.color;
} /** End of 'fragment_main' function*/

/** END OF 'main.wgsl' FILE */