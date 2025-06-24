/* FILE NAME   : comp.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
 */

/** Number PI */
const pi: f32 = 3.141592653589793238462643383279;

/** Structure with global data */
struct globalData {
  cascadeMaxIndex: f32,  // The bigest index of cascade
  frameSize: f32,  // Frame size
  interval: f32,  // Interval of first cacsacde
  arrayIndex: f32,  // Array index
  
  isPress: f32,  // Is press flag
  mousePosX: f32,  // Mouse position
  mousePosY: f32,  // Mouse position
  isFirst: f32,  // Is first frame flag

  colorX: f32,  // Red color
  colorY: f32,  // Green color
  colorZ: f32,  // Blue color
  brushSize: f32,  // Brush size
}; /** End of 'globalData' structure */

/** Structure with index data */
struct indexData {
  index: f32,  // index of dispatch
}; /** End of 'indexData' structure */

@group(0) @binding(0) var baseColorTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(1) var distanceTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(2) var resultTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(3) var<uniform> glbData: globalData;
@group(0) @binding(4) var intermediateTexture : texture_storage_2d_array<r32float, read_write>;

@group(1) @binding(0) var<uniform> index: indexData;

@compute @workgroup_size(16, 16)

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
 fn compute_main(@builtin(global_invocation_id) global_id: vec3u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  var arrayIndex: u32 = u32(glbData.arrayIndex);
  var globalIndex = u32(index.index);
  
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  var cascadeIndex: f32 = f32(globalIndex);

  var interval: f32 = glbData.interval;
  var globalPos: vec2f = vec2f(global_id.xy);
  var probeSize: f32 = frameSize / (2 * pow(2, cascadeMaxIndex - cascadeIndex));

  var probeIndices: vec2u = vec2u(global_id.x / u32(probeSize), global_id.y / u32(probeSize));
  var probeCenterPos: vec2f = vec2f(f32(probeIndices.x) + 0.5, f32(probeIndices.y) + 0.5) * probeSize;

  var angle: f32 = 2 * pi * (f32(u32(globalPos.y) % u32(probeSize)) * probeSize + f32(u32(globalPos.x) % u32(probeSize))) /  (probeSize * probeSize);
  var dir: vec2f = vec2(cos(angle), sin(angle));

  var current: vec2f = probeCenterPos + dir * interval * (1 - pow(4, cascadeIndex)) / (1 - 4);
  var origin: vec2f = current;
  var count: u32 = 0;
  var dist: f32 = min(textureLoad(distanceTexture, vec2u(current), arrayIndex).r, interval * pow(4, cascadeIndex));
  while (dist > 0.05 && count < 50 && length(origin - current) < interval * pow(4, cascadeIndex) &&
         current.x > 0 && current.y > 0 && current.x < frameSize && current.y < frameSize) {
    dist = min(textureLoad(distanceTexture, vec2u(current), arrayIndex).r, interval * pow(4, cascadeIndex) - length(origin - current));
    current += dir * dist;
    count++;
  }
  dist = textureLoad(distanceTexture, vec2u(current), arrayIndex).r;

  var color: vec3f;
  var flag: f32;
  if (current.x < 0 || current.y < 0 || current.x > frameSize || current.y > frameSize || dist > 0.1 ||
      textureLoad(baseColorTexture, vec2u(current), 4 * arrayIndex + 3).r != 1 || count == 50) {
    color = vec3f(0);
    flag = 0;
  } else {
    color = vec3f(textureLoad(baseColorTexture, vec2u(current), 4 * arrayIndex).r,
                  textureLoad(baseColorTexture, vec2u(current), 4 * arrayIndex + 1).r,
                  textureLoad(baseColorTexture, vec2u(current), 4 * arrayIndex + 2).r);
    flag = 1;
  }

  textureStore(resultTexture, global_id.xy, 4 * u32(cascadeIndex), vec4f(color.x, 0, 0, 0));
  textureStore(resultTexture, global_id.xy, 4 * u32(cascadeIndex) + 1, vec4f(color.y, 0, 0, 0));
  textureStore(resultTexture, global_id.xy, 4 * u32(cascadeIndex) + 2, vec4f(color.z, 0, 0, 0));
  textureStore(resultTexture, global_id.xy, 4 * u32(cascadeIndex) + 3, vec4f(flag, 0, 0, 0));
} /** End of 'compute_main' function */

/** END OF 'comp.wgsl' FILE */
