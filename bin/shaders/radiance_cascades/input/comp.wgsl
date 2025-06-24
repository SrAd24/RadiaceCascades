/* FILE NAME   : comp.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
 */

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
  // var arrayIndex: u32 = u32(glbData.arrayIndex);
  var arrayIndex: u32 = 0;
  
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize) || glbData.isPress != 1) {
    return;
  }

  var currentDistance: f32 = max(0, length(vec2f(global_id.xy) - vec2f(glbData.mousePosX * frameSize, glbData.mousePosY * frameSize)) - 2 * f32(glbData.brushSize));
  // var currentDistance: f32 = max(0, length(vec2f(global_id.xy) - vec2f(256, 256)) - f32(glbData.brushSize));

  if (/*glbData.isFirst == 1 || */currentDistance <= textureLoad(distanceTexture, global_id.xy, arrayIndex).r) {
    textureStore(distanceTexture, global_id.xy, arrayIndex, vec4f(currentDistance, 0, 0, 0)); 
    if (currentDistance == 0) {
      textureStore(baseColorTexture, global_id.xy, 4 * arrayIndex, vec4f(1, 0, 0, 0));
      textureStore(baseColorTexture, global_id.xy, 4 * arrayIndex + 1, vec4f(glbData.colorY, 0, 0, 0)); 
      textureStore(baseColorTexture, global_id.xy, 4 * arrayIndex + 2, vec4f(glbData.colorZ, 0, 0, 0)); 
      textureStore(baseColorTexture, global_id.xy, 4 * arrayIndex + 3, vec4f(1, 0, 0, 0)); 
    }
  }
} /** End of 'compute_main' function */

/** END OF 'comp.wgsl' FILE */
