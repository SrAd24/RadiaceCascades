/* FILE NAME   : vert.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

#include "prim.wgsl"

/** Vertex input structure with tangent space */
struct vertexIn {
  @builtin(instance_index) primitive_id: u32,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f,
  @location(4) tangent: vec3f,
  @location(5) bitangent: vec3f,
}

/** Vertex output structure with tangent space */
struct vertexExtOut {
  @builtin(position) gl_position: vec4f,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f,
  @location(4) tangent: vec3f,
  @location(5) bitangent: vec3f,
}

@vertex

/**
 * @info Vertex main function
 * @param data: vertexIn
 */
fn vertex_main(data: vertexIn) -> vertexExtOut {
  var out: vertexExtOut;
  var primitive_id = data.primitive_id;
  // Transform position
  out.gl_position = primMatrix[primitive_id].wvp * vec4f(data.position, 1.0);
  out.position = (primMatrix[primitive_id].w * vec4f(data.position, 1.0)).xyz;
  out.texcoord = data.texcoord;
  out.color = vec4f(1);
  out.normal = mat3x3<f32>(primMatrix[primitive_id].winv[0].xyz, primMatrix[primitive_id].winv[1].xyz, primMatrix[primitive_id].winv[2].xyz) * data.normal;
  out.tangent = mat3x3<f32>(primMatrix[primitive_id].winv[0].xyz, primMatrix[primitive_id].winv[1].xyz, primMatrix[primitive_id].winv[2].xyz) * data.tangent;
  out.bitangent = mat3x3<f32>(primMatrix[primitive_id].winv[0].xyz, primMatrix[primitive_id].winv[1].xyz, primMatrix[primitive_id].winv[2].xyz) * data.bitangent;
    
  return out;
}