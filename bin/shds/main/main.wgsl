/* FILE NAME   : main.wgsl
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

struct mts {
  transform: mat4x4<f32>,
  world: mat4x4<f32>
};

@group(0) @binding(0) var<storage, read> data: array<mts>;
@group(0) @binding(1) var resultTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(2) var texture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(3) var distanceTexture : texture_storage_2d<r32float, read_write>;
@group(0) @binding(4) var temporaryTexture : texture_storage_2d_array<r32float, read_write>;

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
  // out.gl_position = data[0].transform * data[0].world * vec4f(position, 1.0);
  // out.position = (data[0].world * vec4f(position, 1.0)).xyz;
  
  out.gl_position = vec4f(position, 1.0);
  out.position = position;
  
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
  // return data.color;
  // return vec4f(data.texcoord, 0, 1);

  var color: vec3f;

  color = vec3f(textureLoad(texture, vec2u(data.texcoord * 512), 0).r,
                textureLoad(texture, vec2u(data.texcoord * 512), 1).r,
                textureLoad(texture, vec2u(data.texcoord * 512), 2).r);

  var probeCount: f32 = 2 * pow(2, 7);
  //color = vec3f(textureLoad(temporaryTexture, vec2u(data.texcoord * probeCount), 0).r,
  //              textureLoad(temporaryTexture, vec2u(data.texcoord * probeCount), 1).r,
  //              textureLoad(temporaryTexture, vec2u(data.texcoord * probeCount), 2).r);

  var ind: u32 = 0;
  color = vec3f(textureLoad(resultTexture, vec2u(data.texcoord * 512), 4 * ind).r,
                textureLoad(resultTexture, vec2u(data.texcoord * 512), 4 * ind + 1).r,
                textureLoad(resultTexture, vec2u(data.texcoord * 512), 4 * ind + 2).r);

  // color = vec3f(textureLoad(distanceTexture, vec2u(data.texcoord * 512)).rrr / 1000);
  return vec4f(pow(color, vec3f(1 / 2.2)), 0);
} /** End of 'fragment_main' function*/

/** END OF 'main.wgsl' FILE */