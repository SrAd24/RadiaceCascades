/* FILE NAME   : compute.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** Number PI */
const pi: f32 = 3.141592653589793238462643383279;
const cascadeMaxIndex: f32 = 3;  // Temporary

@group(0) @binding(0) var cascadeTexture : texture_2d_array<f32>;
@group(0) @binding(1) var baseColorTexture : texture_2d<f32>;
@group(0) @binding(2) var depthTexture : texture_2d<f32>;
@group(0) @binding(3) var resultTexture : texture_2d_array<f32>;

// @group(0) @binding(4) var frameSize : f32;
const frameSize: f32 = 512;

@compute @workgroup_size(16, 16)

/**
 * @info Ray marching function
 * @param cascadeIndex: f32
 * @param textCoords: vec2f
 * @returns none
 **/
fn rayMarch(cascadeIndex: f32, textCoords: vec2f) {
  const interval: f32 = 1;
  const pos: vec2f = textCoord * frameSize;
  const probeSize: f32 = frameSize / (2 * 16 * pow(2, cascadeMaxIndex - cascadeIndex));

  const probeX: f32 = floor(pos.x / probeSize);
  const probeY: f32 = floor(pos.y / probeSize);
  const probePos = vec2f(probeX + 0.5, probeY + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 1 + 4);

  const angle: f32 = 2 * pi * (pos.y * probeSize + pos.x) /  (probeSize * probeSize);
  const dir: vec2f = vec2(sin(angle), cos(angle));

  var origin: vec2f = probePos;
  origin = origin + dir * interval * (1 - pow(4, cascadeIndex)) / (1 - 4);
  const first: vec2f = origin;
  var count: f32 = 0;
  while (dist > 0.1 && count < 1000 && length(first - origin) < interval * pow(4, cascadeIndex)) {
    dist = textureLoad(depthTexture, origin / vec2f(frameSize));
    origin += dir * dist / vec2f(frameSize);
    count++;
  }
  textureStore(resultTexture, textCoord, cascadeMaxIndex - cascadeIndex, vec4f(textureLoad(baseColorTexture, origin).rgb, dist <= 0.1));
} /** End of 'rayMarch' function */

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  for (let i: f32 = 0; i < cascadeMaxIndex; i++) {
    rayMarch(i, vec2f(global_id.xy) / frameSize);
  }
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
