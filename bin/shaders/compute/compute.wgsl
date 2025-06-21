/* FILE NAME   : compute.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** Number PI */
const pi: f32 = 3.141592653589793238462643383279;

/** Structure with global data */
struct globalData {
  cascadeMaxIndex: f32,  // The bigest index of cascade
  frameSize: f32,  // Frame size
  index: u32,  // Index of dispatch
}; /** End of 'globalData' structure */

@group(0) @binding(0) var baseColorTexture : texture_storage_2d<r32float, read_write>;
@group(0) @binding(1) var distanceTexture : texture_storage_2d<r32float, read_write>;
@group(0) @binding(2) var resultTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(3) var<uniform> glbData: globalData;
@group(0) @binding(4) var temporaryTexture : texture_storage_2d<r32float, read_write>;

@compute @workgroup_size(16, 16)

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
 fn main(@builtin(global_invocation_id) global_id: vec3u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  var globalIndex = glbData.index;
  
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  var cascadeIndex: f32 = f32(globalIndex);
  var textCoords: vec2f = vec2f(global_id.xy) / frameSize; 

  const interval: f32 = 1;
  var pos: vec2f = textCoords * frameSize;
  var probeSize: f32 = frameSize / (2 * 16 * pow(2, cascadeMaxIndex - cascadeIndex));

  var probeX: f32 = floor(pos.x / probeSize);
  var probeY: f32 = floor(pos.y / probeSize);
  var probePos = vec2f(probeX + 0.5, probeY + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 1 + 4);

  var angle: f32 = 2 * pi * (pos.y * probeSize + pos.x) /  (probeSize * probeSize);
  var dir: vec2f = vec2(sin(angle), cos(angle));

  var origin: vec2f = probePos;
  origin = origin + dir * interval * (1 - pow(4, cascadeIndex)) / (1 - 4);
  var first: vec2f = origin;
  var count: u32 = 0;
  var dist: f32 = textureLoad(distanceTexture, vec2u(origin)).r;
  while (dist > 0.1 && count < 100 && length(first - origin) < interval * pow(4, cascadeIndex)) {
    dist = textureLoad(distanceTexture, vec2u(origin)).r;
    origin += dir * dist;
    count++;
  }
  textureStore(resultTexture, vec2u(textCoords * frameSize), u32(cascadeMaxIndex - cascadeIndex), vec4f(textureLoad(baseColorTexture, vec2u(origin)).rgb, f32(dist <= 0.1)));
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
