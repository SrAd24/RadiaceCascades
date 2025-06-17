/* FILE NAME   : input.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** Structure with global data */
struct globalData {
  cascadeMaxIndex: f32,  // The bigest index of cascade
  frameSize: f32,  // Frame size
  interval: f32,  // Interval of first cacsacde
  empty: f32,  // Empty data
  
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
@group(0) @binding(1) var distanceTexture : texture_storage_2d<r32float, read_write>;
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
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize) || glbData.isPress != 1) {
    return;
  }

  var currentDistance: f32 = max(0, length(vec2f(global_id.xy) - vec2f(glbData.mousePosX, glbData.mousePosY)) - f32(glbData.brushSize));

  if (glbData.isFirst == 1 || currentDistance <= textureLoad(distanceTexture, global_id.xy).r) {
    textureStore(distanceTexture, global_id.xy, vec4f(currentDistance, 0, 0, 0)); 
    if (currentDistance == 0) {
      textureStore(baseColorTexture, global_id.xy, 0, vec4f(glbData.colorX, 0, 0, 0));
      textureStore(baseColorTexture, global_id.xy, 1, vec4f(glbData.colorY, 0, 0, 0)); 
      textureStore(baseColorTexture, global_id.xy, 2, vec4f(glbData.colorZ, 0, 0, 0)); 
    }
  }
} /** End of 'main' function */

/** END OF 'input.wgsl' FILE */
