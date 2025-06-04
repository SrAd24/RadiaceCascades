/* FILE NAME   : compute.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 04.06.2025
 */

/** Number PI */
const pi: number = 3.141592653589793238462643383279;
const cascadeMaxIndex: number = 3;  // Temporary

@group(0) @binding(0) var cascadeTexture : texture_2d_array<f32>;
@group(0) @binding(1) var baseColorTexture : texture_2d<f32>;
@group(0) @binding(2) var depthTexture : texture_2d<f32>;
@group(0) @binding(3) var resultTexture : texture_2d_array<f32>;
@group(0) @binding(4) var frameSize : number;

@compute @workgroup_size(16, 16)

/**
 * @info Ray marching function
 * @param cascadeIndex: number
 * @param textCoords: vec2
 * @returns none
 **/
fn rayMarch(cascadeIndex: number, textCoords: vec2) {
  const interval: number = 1;
  const pos: vec2 = textCoord * frameSize;
  const probeSize: number = frameSize / (2 * 16 * pow(2, cascadeMaxIndex - cascadeIndex));

  const probeX: number = floor(pos.x / probeSize), probeY: number = floor(pos.y / probeSize);
  const probePos = vec2(probeX + 0.5, probeY + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 1 + 4);

  const angle: number = 2 * pi * (pos.y * probeSize + pos.x) /  (probeSize * probeSize);
  const dir: vec2 = vec2(sin(angle), cos(angle));

  var origin: vec2 = probePos;
  origin = origin + dir * interval * (1 - pow(4, cascadeIndex)) / (1 - 4);
  const first: vec2 = origin;
  var count: number = 0;
  while (dist > 0.1 && count < 1000 && length(first - origin) < interval * pow(4, cascadeIndex)) {
    dist = textureLoad(depthTexture, origin / vec2(frameSize));
    origin += dir * dist / vec2(frameSize);
    count++;
  }
  textureStore(resultTexture, textCoord, cascadeMaxIndex - cascadeIndex, vec4(textureLoad(baseColorTexture, origin).rgb, dist <= 0.1));
} /** End of 'rayMarch' function */

/**
 * @info Compute main function
 * @param global_id: vec3f
 * @return none
 */
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  for (let i: number = 0; i < cascadeMaxIndex; i++)
    rayMarch(i, vec2(global_id.xy) / frameSize);
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
