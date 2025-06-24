/* FILE NAME   : frag.wgsl
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
@group(3) @binding(2) var<storage, read_write> triangleArray: array<vec4f>;

/**
 * @info Count distance to segment from current point function
 * @param p: vec2f
 * @param a: vec2f
 * @param b: vec2f
 * @returns distance to segment
 **/ 
fn segment(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  var ab: vec2f = b - a;
  var ap: vec2f = p - a;
  var t: f32 = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
  var projection: vec2f = a + t * ab; 
  return distance(p, projection);
} /** End of 'segment' function */

/**
 * @info Get distance to triangle function
 * @param p0: vec2f
 * @param p1: vec2f
 * @param p2: vec2f
 * @param p3: vec2f
 * @returns distance to triangle
 **/
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
} /** End of 'getTriangleDistance' function */


/** Fragment shader **/
@fragment

/**
 * @info Fragment main function
 * @param data: vertexOut
 * @return point color
 */
fn fragment_main(data: vertexOut) -> @location(0) vec4f {
  if (triangleArray[0].y == 0) {
    var tex_coord: vec2u = vec2u(data.texcoord.xy); 
    var frameSize: f32 = 512;
  
    for (var i: u32 = 0; i < u32(triangleArray[0].x); i++) {
      var offset: u32 = 1;
      var level: u32 = u32(floor(max(0, (triangleArray[offset + 3 * i].y + triangleArray[offset + 3 * i + 2].y + triangleArray[offset + 3 * i + 4].y) / 3 / 2)));
      var oldLength: f32 = textureLoad(distanceTexture, vec2u(data.texcoord * frameSize), level).r;
      var currentLength: f32 =
        getTriangleDistance(
          data.texcoord * frameSize - vec2(frameSize / 2),
          12.8 * triangleArray[offset + 3 * i].xz,
          12.8 * triangleArray[offset + 3 * i + 2].xz,
          12.8 * triangleArray[offset + 3 * i + 4].xz
        );

      textureStore(distanceTexture, vec2u(data.texcoord * frameSize), level, vec4f(min(currentLength, oldLength)));
      if (currentLength == 0) {
        textureStore(baseColorTexture, vec2u(data.texcoord * frameSize), 4 * level + 0, vec4f(triangleArray[offset + 3 * i + 1].x));
        textureStore(baseColorTexture, vec2u(data.texcoord * frameSize), 4 * level + 1, vec4f(triangleArray[offset + 3 * i + 3].y));
        textureStore(baseColorTexture, vec2u(data.texcoord * frameSize), 4 * level + 2, vec4f(triangleArray[offset + 3 * i + 5].z));
        textureStore(baseColorTexture, vec2u(data.texcoord * frameSize), 4 * level + 3, vec4f(1));
      }
    }
  } else if (triangleArray[0].y == 1) {
    var color: vec3f = vec3f(textureLoad(baseColorTexture, vec2u(data.texcoord * 512), 0).r,
                             textureLoad(baseColorTexture, vec2u(data.texcoord * 512), 1).r,
                             textureLoad(baseColorTexture, vec2u(data.texcoord * 512), 2).r);
    color = vec3f(textureLoad(distanceTexture, vec2u(data.texcoord * 512), 1).r,
                  textureLoad(distanceTexture, vec2u(data.texcoord * 512), 2).r,
                  textureLoad(distanceTexture, vec2u(data.texcoord * 512), 3).r);
    return vec4f(pow(color, vec3f(1 / 2.2)), 1);
  }

  return vec4f(1.0);
} /** End of 'fragment_main' function*/

/** END OF 'frag.wgsl' FILE */
