/* FILE NAME   : main.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
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
// @group(1) @binding(0) var my_texture: texture_2d<f32>;

@group(1) @binding(1) var tex: texture_storage_2d<r32float, read_write>;


fn segment(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  var ab: vec2f = b - a;
  var ap: vec2f = p - a;
  var t: f32 = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
  var projection: vec2f = a + t * ab; 
  return distance(p, projection);
}

fn getTriangleDistance(p0: vec2f, p1: vec2f, p2: vec2f, p3: vec2f) -> f32 {
  var s1: vec2f = p2 - p1;
  var s2: vec2f = p3 - p1;

  var d: f32 = dot(s1, s2); 
  var sl1: f32 = dot(s1, s1);
  var sl2: f32 = dot(s2, s2);

  var u1: vec2f = (s1 * sl2 - s2 * d) / (sl1 * sl2 - d * d);
  var v1: vec2f = (s2 * sl1 - s1 * d) / (sl1 * sl2 - d * d);

  var u: f32 = dot(p0 - p1, u1);
  var v: f32 = dot(p0 - p1, v1);
  var w: f32 = 1 - u - v;

  if (u >= 0.0 && v >= 0.0 && w >= 0.0) {
    return 0;
  }
  var edge12: f32 = segment(p0, p1, p2);
  var edge23: f32 = segment(p0, p2, p3);
  var edge31: f32 = segment(p0, p3, p1);
  return min(edge12, min(edge23, edge31));
}


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
  out.position = (data[0].world * vec4f(position, 1.0)).xyz;
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
  var tex_coord: vec2u = vec2u(data.texcoord.xy); 

  var v: array<vec2f, 3> = array<vec2f, 3>(vec2f(100, 100), vec2f(-100, -100), vec2f(100, -100)); 

  textureStore(tex, tex_coord, vec4f(getTriangleDistance(data.texcoord - vec2(400, 300), v[0], v[1], v[2])));
  var tc: vec4f = vec4f(textureLoad(tex, tex_coord).r);
  return vec4f(tc.rgb, 1.0);
} /** End of 'fragment_main' function*/

/** END OF 'main.wgsl' FILE */