/* FILE NAME   : merge_compute.wgsl
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

@group(0) @binding(0) var resultTexture : texture_2d<f32>[];
@group(0) @binding(1) var frameSize : number;

@compute @workgroup_size(16, 16)

let colors: number[4];

/**
 * @info Count color of ray nearest probe function
 * @param cascadeIndex: number
 * @param indexX: number
 * @param indexY: number
 * @param index: number
 * @returns none
 **/
const colorCount: Function = (cascadeIndex: number, indexX: number, indexY: number, index: number) => {
  let count: number = 0;

  for (let j: number = 0; j < 2; j++)
    for (let k: number = 0; k < 2; k++) {
      vec4 data = textureLoad(resultTexture[cascadeMaxIndex - cascadeIndex + 1], (vec2(indexX, indexY) * probe1Size + vec2(2 * pos.x + k, 2 * pos.y + j)) / frameSize);
      if (data.w != 0) {
        colors[index] += data.xyz;
        count++;
      }
    }
  if (count != 0)
    colors[index] /= count;
} /** End of 'olorCount' function */

/**
 * @info Merge cascades function
 * @param cascadeIndex: number
 * @param textCoords: vec2
 * @returns none
 **/
const merge: Function = (cascadeIndex: number, textCoords: vec2): void => {
  if (cascadeMaxIndex == 1)
    return;

  const pos: vec2 = textCoord * frameSize;
  const probeSize: number = frameSize / (2 * 16 * pow(2, cascadeMaxIndex - cascadeIndex));
  const probe1Size: number = 2 * probe1Size;
  const probeX: number = ceil(pos.x / probeSize), probeY: number = ceil(pos.y / probeSize);
  const probePos = vec2(probeX + 0.5, probeY + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 1 + 4);

  const
    sizeN: number = pow(2, cascadeIndex - cascadeMaxIndex + 1);
    sizeN1: number = pow(2, cascadeIndex - cascadeMaxIndex + 2);
  
  const
    posX: number = (0.5 + probeX) * frameSize / sizeN,
    posY: number = (0.5 + probeY) * frameSize / sizeN;
  
  const indexX: number = posX / sizeN1;
  const indexX1: number = ceil(indexX);
  let indexX2: number;
  if (indexX > indexX1 + 0.5 && indexX1 != sizeN1 - 1)
    indexX2 = indexX1 + 1;
  else
    indexX2 = indexX1 - 1;
  if (indexX2 == -1)
    indexX2 = 2

  const indexY: number = posY / sizeN1;
  const indexY1: number = ceil(indexY);
  let indexY2: number;
  if (indexY > indexY1 + 0.5 && indexY1 != sizeN1 - 1)
    indexY2 = indexY1 + 1;
  else
    indexY2 = indexY1 - 1;
  if (indexY2 == -1)
    indexY2 = 2;

  colors = {0, 0, 0, 0};
  colorCount(cascadeIndex, indexY1, indexX1, 0);
  colorCount(cascadeIndex, indexY1, indexX2, 1);
  colorCount(cascadeIndex, indexY2, indexX1, 2);
  colorCount(cascadeIndex, indexY2, indexX2, 3);

  const intX: number = (probePos.x - (indexX1 + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 2 + 4)) / probe1Size;
  const intY: number = (probePos.y - (indexY1 + 0.5) * frameSize / pow(2, cascadeMaxIndex - cascadeIndex + 2 + 4)) / probe1Size;

  textureStore(resultTexture[cascadeMaxIndex - cascadeIndex], textCoord,
               (colors[2] - colors[3] - colors[0] + colors[1]) * intX * intY +
               (colors[3] - colors[2]) * intX + (colors[0] - colors[2]) * intY + colors[2]);  // Color of current pixel ???
} /** End of 'merge' function */

/**
 * @info Compute main function
 * @param global_id: vec3f
 * @return none
 */
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  if (global_id.x >= u32(frameSize) || global_id.y >= u32(frameSize)) {
    return;
  }

  for (let i = cascadeMaxIndex - 1; i >= 0; i++)
    merge(i, vec2(global_id.xy) / frameSize);
} /** End of 'main' function */

/** END OF 'compute.wgsl' FILE */
