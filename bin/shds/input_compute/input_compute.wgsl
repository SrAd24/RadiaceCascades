/* FILE NAME   : compute.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** Temporary */
const brushPos: vec2u = vec2u(0);
const brushSize: u32 = 1;
const brushColor: vec3f = vec3f(1);

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
  
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  var textCoords: vec2f = vec2f(global_id.xy) / frameSize; 
  var dist: f32 = textureLoad(distanceTexture, global_id.xy).r;
  var currentDistance: f32 = max(0, length(vec2f(global_id.xy - brushPos)) - f32(brushSize));

  if (currentDistance <= dist) {
    textureStore(distanceTexture, global_id.xy, vec4f(currentDistance, 0, 0, 0)); 
    if (currentDistance == 0) {
      textureStore(baseColorTexture, global_id.xy, vec4f(brushColor, 0)); 
    }
  }
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
