/* FILE NAME   : vert.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
 */

/** Vertex out struct*/
struct vertexOut {
  @builtin(position) gl_position: vec4f,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f,
} /** End of 'vertexOut' struct */

@group(3) @binding(0) var baseColorTexture: texture_storage_2d_array<r32float, read_write>;
@group(3) @binding(1) var distanceTexture: texture_storage_2d_array<r32float, read_write>;

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
  out.gl_position = vec4f(position, 1.0);
  out.position = position;
  out.texcoord = texcoord;
  out.normal = normal;
  out.color = color;
  return out;
} /** End of 'vertex_main' function */

/** END OF 'vert.wgsl' FILE */
