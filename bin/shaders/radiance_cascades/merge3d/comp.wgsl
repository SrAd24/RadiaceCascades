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

  layerNumber: f32,  // Layer number
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
  if (global_id.x < 0 || global_id.y < 0 || global_id.x > u32(glbData.frameSize) || global_id.y > u32(glbData.frameSize)) {
    return;
  }

  for (var i: i32 = 0; i < i32(glbData.layerNumber); i++) {
    var colors: vec3f = vec3f(0);
    var weights: f32 = 0;
    
    for (var j: i32 = 0; j < i32(glbData.layerNumber); j++) {
      var distance: f32 = pow(2, f32(abs(i - j)));
      var weight: f32 = exp(-distance * distance / (2 * pow(2, 2)));
      var color: vec3f = vec3f(
        textureLoad(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * j).r,
        textureLoad(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * j + 1).r,
        textureLoad(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * j + 2).r,
      );
      colors += color * weight;
      weights += weight;
    }
    var newColor = colors / weights;
    textureStore(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * i32(glbData.layerNumber) + 3 * i, vec4f(newColor.x, 0, 0, 0));
    textureStore(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * i32(glbData.layerNumber) + 3 * i + 1, vec4f(newColor.y, 0, 0, 0));
    textureStore(distanceTexture, global_id.xy, i32(glbData.layerNumber) + 3 * i32(glbData.layerNumber) + 3 * i + 2, vec4f(newColor.z, 0, 0, 0));
  }
} /** End of 'compute_main' function */

/** END OF 'comp.wgsl' FILE */
