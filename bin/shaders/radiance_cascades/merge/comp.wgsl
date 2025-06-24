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

/**
 * @info Count average color probe of cascade 0 function
 * @param globalPos: vec2u
 * @returns none
 **/
fn fillTexture0(globalPos: vec2u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;

  var probeNumber: f32 = 2 * pow(2, cascadeMaxIndex);
  var probeSize: f32 = frameSize / probeNumber;
  
  var color: vec3f = vec3f(0);
  for (var i: u32 = 0; i < u32(probeSize); i++) {
    for (var j: u32 = 0; j < u32(probeSize); j++) {
      color += vec3f(textureLoad(resultTexture, globalPos * u32(probeSize) + vec2u(j, i), 0).r,
                     textureLoad(resultTexture, globalPos * u32(probeSize) + vec2u(j, i), 1).r,
                     textureLoad(resultTexture, globalPos * u32(probeSize) + vec2u(j, i), 2).r);
    }
  }
  color /= probeSize * probeSize;
  
  textureStore(intermediateTexture, globalPos, 0, vec4f(color.r, 0, 0, 0));
  textureStore(intermediateTexture, globalPos, 1, vec4f(color.g, 0, 0, 0));
  textureStore(intermediateTexture, globalPos, 2, vec4f(color.b, 0, 0, 0));
} /** End of 'fillTexture0' function */

/**
 * @info Fill final texture function
 * @param globalPos: vec2u
 * @returns none
 **/
fn fillFinalTexture(globalPos: vec2u) {
  var color: vec3f;
  //if (textureLoad(distanceTexture, globalPos, arrayIndex).r < 0.001) {  
  //  color = 0.5 * vec3f(textureLoad(baseColorTexture, globalPos, u32(4 * arrayIndex)).r,
  //                      textureLoad(baseColorTexture, globalPos, u32(4 * arrayIndex + 1)).r,
  //                      textureLoad(baseColorTexture, globalPos, u32(4 * arrayIndex + 2)).r);
  //  color = vec3(0.5, 0.5, 0);
  //} else {
    var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
    var frameSize: f32 = glbData.frameSize;

    var probeNumber: f32 = 2 * pow(2, cascadeMaxIndex);
    var probeSize: f32 = frameSize / probeNumber;

    var firstIndices: vec2u = globalPos / u32(probeSize);
    var secondX: u32;
    var secondY: u32;
    if (f32(globalPos.x) > (f32(firstIndices.x) + 0.5) * probeSize) {
      secondX = min(firstIndices.x + 1, u32(probeNumber) - 1);
    } else {
      secondX = u32(max(i32(firstIndices.x) - 1, 0));
    }
    if (f32(globalPos.y) > (f32(firstIndices.y) + 0.5) * probeSize) {
      secondY = min(firstIndices.y + 1, u32(probeNumber) - 1);
    } else {
      secondY = u32(max(i32(firstIndices.y) - 1, 0));
    }

    var minIndexX: u32 = min(firstIndices.x, secondX);
    var minIndexY: u32 = min(firstIndices.y, secondY);
    var maxIndexX: u32 = max(firstIndices.x, secondX);
    var maxIndexY: u32 = max(firstIndices.y, secondY);

    var color0: vec3f = vec3f(textureLoad(intermediateTexture, vec2u(minIndexX, maxIndexY), 0).r,
                              textureLoad(intermediateTexture, vec2u(minIndexX, maxIndexY), 1).r,
                              textureLoad(intermediateTexture, vec2u(minIndexX, maxIndexY), 2).r);
    var color1: vec3f = vec3f(textureLoad(intermediateTexture, vec2u(maxIndexX, maxIndexY), 0).r,
                              textureLoad(intermediateTexture, vec2u(maxIndexX, maxIndexY), 1).r,
                              textureLoad(intermediateTexture, vec2u(maxIndexX, maxIndexY), 2).r);
    var color2: vec3f = vec3f(textureLoad(intermediateTexture, vec2u(minIndexX, minIndexY), 0).r,
                              textureLoad(intermediateTexture, vec2u(minIndexX, minIndexY), 1).r,
                              textureLoad(intermediateTexture, vec2u(minIndexX, minIndexY), 2).r);
    var color3: vec3f = vec3f(textureLoad(intermediateTexture, vec2u(maxIndexX, minIndexY), 0).r,
                              textureLoad(intermediateTexture, vec2u(maxIndexX, minIndexY), 1).r,
                              textureLoad(intermediateTexture, vec2u(maxIndexX, minIndexY), 2).r);

    var intX: f32 = (f32(globalPos.x) - (f32(minIndexX) + 0.5) * probeSize) / probeSize;
    var intY: f32 = (f32(globalPos.y) - (f32(minIndexY) + 0.5) * probeSize) / probeSize;
    if (intX < 0) {
      intX += 0.5;
    }
    if (intY < 0) {
      intY += 0.5;
    }

    color = color0 * (1 - intX) * intY +
            color1 * intX * intY +
            color2 * (1 - intX) * (1 - intY) +
            color3 * intX * (1 - intY);
    // color = (color2 - color3 - color0 + color1) * intX * intY +
    //         (color3 - color2) * intX + (color0 - color2) * intY + color2;
  //}

  var arrayIndex: u32 = u32(glbData.arrayIndex);
  /*
  textureStore(resultTexture, globalPos, 0, vec4f(color.x, 0, 0, 0));
  textureStore(resultTexture, globalPos, 1, vec4f(color.y, 0, 0, 0));
  textureStore(resultTexture, globalPos, 2, vec4f(color.z, 0, 0, 0));
  */
  textureStore(distanceTexture, globalPos, u32(glbData.layerNumber) + 3 * arrayIndex, vec4f(color.x, 0, 0, 0));
  textureStore(distanceTexture, globalPos, u32(glbData.layerNumber) + 3 * arrayIndex + 1, vec4f(color.y, 0, 0, 0));
  textureStore(distanceTexture, globalPos, u32(glbData.layerNumber) + 3 * arrayIndex + 2, vec4f(color.z, 0, 0, 0));
} /** End of 'fillFinalTexture' function */

/* @info Get average color of co-directional ray of probe.
 * @param probe1Size: u32
 * @param indexInProbe: u32
 * @param cascadeIndex: u32
 * @param indexX: u32
 * @param indexInProbe: u32
 * @returns average color
 */
fn getColorRay(probe1Size: u32, indexInProbe: u32, cascadeIndex: u32,
               indexX: u32, indexY: u32) -> vec3f {
  var color: vec3f = vec3f(0);
               
  for (var i: u32 = 0; i < 4; i++) {
    color += vec3f(textureLoad(resultTexture, vec2u(indexX, indexY) * probe1Size +
                               vec2u((4 * indexInProbe + i) % probe1Size, (4 * indexInProbe + i) / probe1Size),
                               4 * (cascadeIndex + 1)).r,
                   textureLoad(resultTexture, vec2u(indexX, indexY) * probe1Size +
                               vec2u((4 * indexInProbe + i) % probe1Size, (4 * indexInProbe + i) / probe1Size),
                               4 * (cascadeIndex + 1) + 1).r,
                   textureLoad(resultTexture, vec2u(indexX, indexY) * probe1Size +
                               vec2u((4 * indexInProbe + i) % probe1Size, (4 * indexInProbe + i) / probe1Size),
                               4 * (cascadeIndex + 1) + 2).r);
  }
  return 0.25 * color;
} /** End of 'getColorRay' function */

/**
 * @info Merge cascades function
 * @param cascadeIndex: f32
 * @param globalPos: vec2u
 * @returns none
 **/
fn merge(cascadeIndex: f32, globalPos: vec2u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;

  if (cascadeMaxIndex == 1) {
    return;
  }
  
  var color: vec3f;
  if (textureLoad(resultTexture, globalPos, 4 * u32(cascadeIndex) + 3).r != 1) {
    var frameSize: f32 = glbData.frameSize;
  
    var probeNumber: u32 = u32(pow(2, cascadeMaxIndex - cascadeIndex + 1));
    var probe1Number: u32 = probeNumber / 2;
    var probeSize: f32 = frameSize / f32(probeNumber);
    var probe1Size: f32 = 2 * probeSize;

    var probeIndices: vec2u = vec2u(globalPos.x / u32(probeSize), globalPos.y / u32(probeSize));
    var probeCenterPos: vec2f = vec2f((f32(probeIndices.x) + 0.5) * probeSize, (f32(probeIndices.y) + 0.5) * probeSize);
    var pos: vec2f = vec2f(globalPos);
  
    var indexX: f32 = probeCenterPos.x / probe1Size;
    var indexX1: u32 = u32(floor(indexX));
    var indexX2: u32;
    if (indexX > f32(indexX1) + 0.5) {
      indexX2 = min(indexX1 + 1, probe1Number - 1);
    } else {
      indexX2 = u32(max(i32(indexX1) - 1, 0));
    }

    var indexY: f32 = probeCenterPos.y / probe1Size;
    var indexY1: u32 = u32(floor(indexY));
    var indexY2: u32;
    if (indexY > f32(indexY1) + 0.5) {
      indexY2 = min(indexY1 + 1, probe1Number - 1);
    } else {
      indexY2 = u32(max(i32(indexY1) - 1, 0));
    }
  
    var minIndexX: u32 = min(indexX1, indexX2);
    var minIndexY: u32 = min(indexY1, indexY2);
    var maxIndexX: u32 = max(indexX1, indexX2);
    var maxIndexY: u32 = max(indexY1, indexY2);
  
    var colors: array<vec3f, 4> = array<vec3f, 4>(vec3f(0), vec3f(0), vec3f(0), vec3f(0));
    var indexInProbe: u32 = u32((pos.y - f32(probeIndices.y) * probeSize) * probeSize + pos.x - f32(probeIndices.x) * probeSize);
  
    colors[0] = getColorRay(u32(probe1Size), indexInProbe, u32(cascadeIndex), minIndexX, minIndexY);
    colors[1] = getColorRay(u32(probe1Size), indexInProbe, u32(cascadeIndex), maxIndexX, minIndexY);
    colors[2] = getColorRay(u32(probe1Size), indexInProbe, u32(cascadeIndex), minIndexX, maxIndexY);
    colors[3] = getColorRay(u32(probe1Size), indexInProbe, u32(cascadeIndex), maxIndexX, maxIndexY);  
  
    var intX: f32 = (probeCenterPos.x - (f32(minIndexX) + 0.5) * probe1Size) / probe1Size;
    var intY: f32 = (probeCenterPos.y - (f32(minIndexY) + 0.5) * probe1Size) / probe1Size;

    if (intX < 0) {
      intX += 0.5;
    }
    if (intY < 0) {
      intY += 0.5;
    }
  
    // color = (colors[2] - colors[3] - colors[0] + colors[1]) * intX * intY +
    //         (colors[3] - colors[2]) * intX + (colors[0] - colors[2]) * intY + colors[2];
    color = colors[0] * (1 - intX) * (1 - intY) +
            colors[1] * intX * (1 - intY) +
            colors[2] * (1 - intX) * intY +
            colors[3] * intX * intY;
  } else {
    color = vec3f(textureLoad(resultTexture, globalPos, 4 * u32(cascadeIndex)).r,
                  textureLoad(resultTexture, globalPos, 4 * u32(cascadeIndex) + 1).r,
                  textureLoad(resultTexture, globalPos, 4 * u32(cascadeIndex) + 2).r);
  }

  textureStore(resultTexture, globalPos, 4 * u32(cascadeIndex), vec4f(color.x, 0, 0, 0));
  textureStore(resultTexture, globalPos, 4 * u32(cascadeIndex) + 1, vec4f(color.y, 0, 0, 0));
  textureStore(resultTexture, globalPos, 4 * u32(cascadeIndex) + 2, vec4f(color.z, 0, 0, 0));
} /** End of 'merge' function */

@compute @workgroup_size(16, 16)

/**
 * @info Compute main function
 * @param global_id: vec3u
 * @return none
 */
fn compute_main(@builtin(global_invocation_id) global_id: vec3u) {
  var cascadeMaxIndex: f32 = glbData.cascadeMaxIndex;
  var frameSize: f32 = glbData.frameSize;
  var globalIndex: i32 = i32(index.index);

  var probeCount: f32 = 2 * pow(2, cascadeMaxIndex);

  if ((globalIndex == -1 && (global_id.x >= u32(probeCount) || global_id.y >= u32(probeCount))) ||
      (globalIndex != -1 && (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)))) {
    return;    
  }

  if (globalIndex == -2) {
    fillFinalTexture(global_id.xy);
  } else if (globalIndex == -1) {
    fillTexture0(global_id.xy);
  } else {
    merge(f32(globalIndex), global_id.xy);
  }
} /** End of 'compute_main' function */

/** END OF 'comp.wgsl' FILE */
