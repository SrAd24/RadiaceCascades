/* FILE NAME   : vert.wgsl
 * PURPOSE     : Beautiful OBJ model shader - vertex
 * PROGRAMMER  : CGSG'SrAd'2024.
 * LAST UPDATE : 17.06.2025
 */

#include "prim.wgsl"

@vertex
fn vertex_main(@builtin(instance_index) primitive_id: u32,
              @location(0) position: vec3f,
              @location(1) texcoord: vec2f,
              @location(2) normal: vec3f,
              @location(3) color: vec4f) -> vertexOut {
  var out: vertexOut;
  out.gl_position = primMatrix[primitive_id].wvp * vec4f(position, 1.0);
  out.position = (primMatrix[primitive_id].w * vec4f(position, 1.0)).xyz;
  out.texcoord = texcoord;
  out.normal = mat3x3<f32>(primMatrix[primitive_id].winv[0].xyz, primMatrix[primitive_id].winv[1].xyz, primMatrix[primitive_id].winv[2].xyz) * normal;
  out.color = color;
  return out;
}