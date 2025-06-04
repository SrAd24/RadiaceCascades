/* FILE NAME   : merge_compute.wgsl
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

@group(0) @binding(0) var resultTexture : texture_storage_2d_array<r32float, read_write>;

// @group(0) @binding(1) var frameSize : f32;

const frameSize: f32 = 512;

/**
 * @info Count color of ray nearest probe function
 * @param cascadeIndex: f32
 * @param indexX: f32
 * @param indexY: f32
 * @param index: f32
 * @param pos: vec2f
 * @param probe1Size: f32
 * @returns none
 **/
/*
fn colorCount(cascadeIndex: f32, indexX: f32, indexY: f32, index: f32, pos: vec2f, probe1Size: f32) {
  var count: u32 = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX), u32(indexY)) * probe1Size + vec2u(2 * pos.x + k, 2 * pos.y + j),
                                    ui32(cascadeMaxIndex - cascadeIndex + 1));
      if (data.w != 0) {
        colors[index] += data.xyz;
        count++;
      }
    }
  }
  if (count != 0) {
    colors[index] /= f32(count);
  }
}
*/
/** End of 'olorCount' function */

/**
 * @info Merge cascades function
 * @param cascadeIndex: f32
 * @param textCoords: vec2f
 * @returns none
 **/
fn merge(cascadeIndex: f32, textCoords: vec2f) {
  if (cascadeMaxIndex == 1) {
    return;
  }

  var pos: vec2f = textCoords * frameSize;
  var probeSize: f32 = frameSize / (2 * 16 * pow(2, cascadeMaxIndex - cascadeIndex));
  var probe1Size: f32 = 2 * probeSize;
  var probeX: f32 = floor(pos.x / probeSize);
  var probeY: f32 = floor(pos.y / probeSize);
  var probePos = vec2f(probeX + 0.5, probeY + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 1 + 4);

  var sizeN: f32 = pow(2, cascadeIndex - cascadeMaxIndex + 1);
  var sizeN1: f32 = pow(2, cascadeIndex - cascadeMaxIndex + 2);
  
  var posX: f32 = (0.5 + probeX) * frameSize / sizeN;
  var posY: f32 = (0.5 + probeY) * frameSize / sizeN;
  
  var indexX: f32 = posX / sizeN1;
  var indexX1: f32 = floor(indexX);
  var indexX2: f32;
  if (indexX > indexX1 + 0.5 && indexX1 != sizeN1 - 1) {
    indexX2 = indexX1 + 1;
  } else {
    indexX2 = indexX1 - 1;
  }
  if (indexX2 == -1) {
    indexX2 = 2;
  }

  var indexY: f32 = posY / sizeN1;
  var indexY1: f32 = floor(indexY);
  var indexY2: f32;
  if (indexY > indexY1 + 0.5 && indexY1 != sizeN1 - 1) {
    indexY2 = indexY1 + 1;
  } else {
    indexY2 = indexY1 - 1;
  }
  if (indexY2 == -1) {
    indexY2 = 2;
  }

  var colors: array<vec3f, 4> = array<vec3f, 4>(vec3f(0.0), vec3f(0.0), vec3f(0.0), vec3f(0.0));
  // colorCount(cascadeIndex, indexY1, indexX1, 0, pos, probe1Size);
  // colorCount(cascadeIndex, indexY1, indexX2, 1, pos, probe1Size);
  // colorCount(cascadeIndex, indexY2, indexX1, 2, pos, probe1Size);
  // colorCount(cascadeIndex, indexY2, indexX2, 3, pos, probe1Size);

  var count: u32 = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX1), u32(indexY1)) * u32(probe1Size) + vec2u(2 * pos.x + k, 2 * pos.y + j),
                                    u32(cascadeMaxIndex - cascadeIndex + 1));
      if (data.w != 0) {
        colors[0] += data.xyz;
        count++;
      }
    }
  }
  if (count != 0) {
    colors[0] /= f32(count);
  }

  count = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX2), u32(indexY1)) * u32(probe1Size) + vec2u(2 * pos.x + k, 2 * pos.y + j),
                                    u32(cascadeMaxIndex - cascadeIndex + 1));
      if (data.w != 0) {
        colors[1] += data.xyz;
        count++;
      }
    }
  }
  if (count != 0) {
    colors[1] /= f32(count);
  }

  count = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX1), u32(indexY2)) * u32(probe1Size) + vec2u(2 * pos.x + k, 2 * pos.y + j),
                                    u32(cascadeMaxIndex - cascadeIndex + 1));
      if (data.w != 0) {
        colors[2] += data.xyz;
        count++;
      }
    }
  }
  if (count != 0) {
    colors[2] /= f32(count);
  }

  count = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX2), u32(indexY2)) * u32(probe1Size) + vec2u(2 * pos.x + k, 2 * pos.y + j),
                                    u32(cascadeMaxIndex - cascadeIndex + 1));
      if (data.w != 0) {
        colors[3] += data.xyz;
        count++;
      }
    }
  }
  if (count != 0) {
    colors[3] /= f32(count);
  }

  var intX: f32 = (probePos.x - (indexX1 + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 2 + 4)) / probe1Size;
  var intY: f32 = (probePos.y - (indexY1 + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 2 + 4)) / probe1Size;

  textureStore(resultTexture, textCoords, cascadeMaxIndex - cascadeIndex,
               (colors[2] - colors[3] - colors[0] + colors[1]) * intX * intY +
               (colors[3] - colors[2]) * intX + (colors[0] - colors[2]) * intY + colors[2]);  // Color of current pixel ???
} /** End of 'merge' function */

@compute @workgroup_size(16, 16)

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  for (let i = cascadeMaxIndex - 1; i >= 0; i++) {
    merge(i, vec2f(global_id.xy) / frameSize);
  }
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
