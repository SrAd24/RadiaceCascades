/* FILE NAME   : merge_compute.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 06.06.2025
 */

/** Number PI */
const pi: f32 = 3.141592653589793238462643383279;

/** Structure with global data */
struct globalData {
  cascadeMaxIndex: f32,  // The bigest index of cascade
  frameSize: f32,  // Frame size
  index: i32,  // Index of dispatch
}; /** End of 'globalData' structure */

@group(0) @binding(0) var baseColorTexture : texture_storage_2d<r32float, read_write>;
@group(0) @binding(1) var distanceTexture : texture_storage_2d<r32float, read_write>;
@group(0) @binding(2) var resultTexture : texture_storage_2d_array<r32float, read_write>;
@group(0) @binding(3) var<uniform> glbData: globalData;
@group(0) @binding(4) var temporaryTexture : texture_storage_2d<r32float, read_write>;

/**
 * @info Count average color probe of cascade 0 function
 * @param textCoords: vec2f
 * @returns none
 **/
fn fillTexture0(textCoords: vec2f) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;

  var probeCount: f32 = 2 * 16 * pow(2, cascadeMaxIndex);
  var probeSize: f32 = frameSize / probeCount;
  var probeIndices: vec2u = vec2u(u32((textCoords * probeCount).x), u32((textCoords * probeCount).y));
  var color: vec3f = vec3f(0);

  for (var i: u32 = 0; i < u32(probeSize); i++) {
    for (var j: u32 = 0; j < u32(probeSize); j++) {
      color += textureLoad(resultTexture, probeIndices * vec2u(textCoords * probeCount) + vec2u(j, i), 0).rgb;
    }
  }
  textureStore(temporaryTexture, vec2u(textCoords * probeCount), vec4f(color / (probeSize * probeSize), 0));
} /** End of 'fillTexture0' function */

/**
 * @info Fill final texture function
 * @param textCoords: vec2f
 * @returns none
 **/
fn fillFinalTexture(textCoords: vec2f) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;

  var probeCount: f32 = 2 * 16 * pow(2, cascadeMaxIndex);
  var probeSize: f32 = frameSize / probeCount;

  var firstIndices = vec2u(textCoords * frameSize / probeSize);
  var secondX: u32;
  var secondY: u32;
  if ((textCoords * frameSize).x > (f32(firstIndices.x) + 0.5) * probeSize) {
    secondX = min(firstIndices.x + 1, u32(probeCount) - 1);
  } else {
    secondX = max(firstIndices.x - 1, 0);
  }
  if ((textCoords * frameSize).y > (f32(firstIndices.y) + 0.5) * probeSize) {
    secondY = min(firstIndices.y + 1, u32(probeCount) - 1);
  } else {
    secondY = max(firstIndices.y - 1, 0);
  }

  var color0: vec3f = textureLoad(temporaryTexture, vec2u(firstIndices.x, secondY)).rgb;
  var color1: vec3f = textureLoad(temporaryTexture, vec2u(secondX, secondY)).rgb;
  var color2: vec3f = textureLoad(temporaryTexture, firstIndices).rgb;
  var color3: vec3f = textureLoad(temporaryTexture, vec2u(secondX, firstIndices.y)).rgb;

  var intX: f32 = abs((textCoords.x * frameSize - (f32(firstIndices.x) + 0.5) * probeSize) / probeSize);
  var intY: f32 = abs((textCoords.y * frameSize - (f32(firstIndices.y) + 0.5) * probeSize) / probeSize);

  var color: vec3f;
  if (textureLoad(distanceTexture, vec2u(textCoords * frameSize)).r == 0) {
    color = textureLoad(baseColorTexture, vec2u(textCoords * frameSize)).rgb;
  } else {
    color = (color2 - color3 - color0 + color1) * intX * intY +
            (color3 - color2) * intX + (color0 - color2) * intY + color2;
  }

  textureStore(resultTexture, vec2u(textCoords * frameSize), 0, vec4f(color, 0));
} /** End of 'fillFinalTexture' function */

/**
 * @info Merge cascades function
 * @param cascadeIndex: f32
 * @param textCoords: vec2f
 * @returns none
 **/
fn merge(cascadeIndex: f32, textCoords: vec2f) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  
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
  var count: u32 = 0;

  for (var j: u32 = 0; j < 2; j++) {
    for (var k: u32 = 0; k < 2; k++) {
      var data: vec4f = textureLoad(resultTexture,
                                    vec2u(u32(indexX1), u32(indexY1)) * u32(probe1Size) + vec2u(2 * u32(pos.x) + k, 2 * u32(pos.y) + j),
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
                                    vec2u(u32(indexX2), u32(indexY1)) * u32(probe1Size) + vec2u(2 * u32(pos.x) + k, 2 * u32(pos.y) + j),
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
                                    vec2u(u32(indexX1), u32(indexY2)) * u32(probe1Size) + vec2u(2 * u32(pos.x) + k, 2 * u32(pos.y) + j),
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
                                    vec2u(u32(indexX2), u32(indexY2)) * u32(probe1Size) + vec2u(2 * u32(pos.x) + k, 2 * u32(pos.y) + j),
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

  textureStore(resultTexture, vec2u(textCoords * frameSize), u32(cascadeMaxIndex - cascadeIndex),
               vec4f((colors[2] - colors[3] - colors[0] + colors[1]) * intX * intY +
                     (colors[3] - colors[2]) * intX + (colors[0] - colors[2]) * intY + colors[2],
                     0));  // Color of current pixel ???
} /** End of 'merge' function */

@compute @workgroup_size(16, 16)

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  var globalIndex: i32 = glbData.index;

  var probeCount: f32 = 2 * 16 * pow(2, cascadeMaxIndex);
  if (globalIndex == -1 && (global_id.x >= u32(probeCount) || global_id.y >= u32(probeCount))) {
    return;
  } else if (globalIndex != -1 && (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize))) {
    return;
  }

  if (globalIndex == -2) {
    fillFinalTexture(vec2f(global_id.xy) / frameSize);
  } else if (globalIndex == -1) {
    fillTexture0(vec2f(global_id.xy) / probeCount);
  } else {
    merge(f32(globalIndex), vec2f(global_id.xy) / frameSize);
  }
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
