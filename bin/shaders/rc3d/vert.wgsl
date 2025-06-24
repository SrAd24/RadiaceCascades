/* FILE NAME   : vert.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */
 
/** Vertex out struct*/
struct vertexOut {
  @builtin(position) gl_position: vec4f,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f
} /** End of 'vertexOut' struct */

struct primMatricesData {
  w: mat4x4<f32>,
  wvp: mat4x4<f32>,
  winv: mat4x4<f32>,
};

struct camData {
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
  vp: mat4x4<f32>,
  locW: vec4f,
  atH: vec4f,
  dirProjDist: vec4f,
  rightWp: vec4f,
  upHp: vec4f,
};

@group(0) @binding(0) var<storage, read> primMatrix: array<primMatricesData>;
@group(0) @binding(1) var<uniform> cam: camData;
@group(3) @binding(0) var baseColorTexture : texture_storage_2d_array<r32float, read_write>;
@group(3) @binding(1) var distanceTexture : texture_storage_2d_array<r32float, read_write>;

/** Vertex shader **/
@vertex 

/**
 * @info Vertex main function
 * @param position: vec4f
 * @param color: vec4f
 * @return vertex out struct
 */
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
  out.color = vec4f(color.xyz, 1);
  return out;
} /** End of 'vertex_main' function */

/** END OF 'vert.wgsl' FILE */
