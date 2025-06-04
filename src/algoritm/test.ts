/* FILE NAME   : test.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** IMPORTS */
import * as mth from "../../math/mth.js";

/** Pixel interface */
interface pixel {
  dirIndex: number;  // Pixel index
  angle: number;  // Pixel angle
  isIntersect: boolean;  // Is intersect flag
  color: vec3;  // Color
} /** End of 'pixel' interface */

/** Probe interface */
interface probe {
  pixelArray: pixel[][];  // Pixel array
  size: number;  // Probe size
  pos: vec2;  // Probe position
  angle: number;  // Angle between rays
  distance: number;  // Distance of rays
  distanceFarObject: number;  // Distance for far object
  distanceNearObject: number;  // Distance for near object
  sizeSmallObject: number;  // size of smallest object
} /** End of 'probe' interface */

/** Cascade interface */
interface cascade {
  probeArray: probe[][];  // Probe array
  size: number;  // Cascade size
} /** End of 'cascade' interface */

/** Sphere interface */
interface sphere {
  radius: number;  // Sphere radius
  position: vec2;  // Sphere position
} /** End of 'sphere' interface */

/** Near probe interface */
interface nearProbe {
  indexX1: number;  // First index by axis X
  indexX2: number;  // Second index by axis X
  indexY1: number;  // First index by axis Y
  indexY2: number;  // Second index by axis Y
} /** End of 'nearProbe' interface */

/** Cascades array */
let cascades: cascade[];
/** Sphere array */
let spheres: sphere[];
/** Smallest sphere size */
let smallestSize: number = 10000;

/** Image sizes */
const frameSize: number = 512;

/** Ray interval of сascade 0 */
const interval0: number = 1;

/**
 * @info Evaluate cascades count
 * @param weight: number
 * @param height: number
 * @returns cascades count
 **/
const cascadesCount: Function = (weight: number, height: number): number => {
  const diagonal: number = Math.sqrt(weight * weight + height * height);
  const factor: number = Math.ceil(Math.log(diagonal / interval0) / Math.log(4));
  const intervalStart: number = (interval0 * (1 - Math.pow(4, factor))) / (1 - 4);
  return Math.ceil(Math.log(intervalStart) / Math.log(4)) - 1;
} /** End of 'cascadesCount' function */

/**
 * @info Create probe function
 * @param size: number
 * @param pos: number
 * @returns new probe
 **/
const createProbe: Function = (size: number, pos: vec2): probe => {
  const distanceFarObject: number = searchFar(pos);
  const distanceNearObject: number = searchNear(pos);

  let probeObject: probe = {
    pixelArray: [[]],
    distanceFarObject: distanceFarObject,
    distanceNearObject: distanceNearObject,
    sizeSmallObject: smallestSize,
    angle: smallestSize / distanceFarObject,
    distance: distanceNearObject * smallestSize,
    size: size,
    pos: pos,
  };

  for (let i: number = 0; i < probeObject.size; i++)
    for (let j: number = 0; j < probeObject.size; j++) {
      probeObject.pixelArray[i][j].dirIndex = i * probeObject.size + j;
      probeObject.pixelArray[i][j].angle = 2 * Math.PI * probeObject.pixelArray[i][j].dirIndex /  (probeObject.size * probeObject.size);
      probeObject.pixelArray[i][j].IsIntersect = false;
    }
  return probeObject;
} /** End of 'createProbe' function */

/**
 * @info Ray marching function
 * @returns none
 **/
const rayMarch: Function = (): void => {
  cascades.forEach((cscd: cascade) => {
    cscd.probeArray.forEach((probeArray: probe[]) => {
      probeArray.forEach((prb: probe) => {
        prb.array.forEach((pixelArray: pixel[]) => {
          pixelArray.array.forEach((P: pixel) => {

            let interval: number = 1;
            const dir: vec2 = new vec2(Math.sin(probeObject.pixelArray[i][j].angle),
                                 Math.cos(probeObject.pixelArray[i][j].angle));
            let origin: vec2 = new vec2((0.5 + i) * probeObject.size, (0.5 + j) * probeObject.size);
            origin = origin.add(dir.mul((interval * (1 - Math.pow(4, cascadeIndex))) / (1 - 4)));
            const first: vec2 = origin;
            let dist: number = 1000;
            let count: number = 0;
            while (dist > 0.1 && count < 1000 && first.sub(origin).length() < interval * Math.pow(4, cascadeIndex)) {
              spheres.forEach((sph: sphere) => {
                dist = Math.min(dist, sphereDistance(origin, sph));
              })
              origin = origin.add(dir.mul(dist));
              count++;
            }
            probeObject.pixelArray[i][j].IsIntersect = dist <= 0.1;
            // Color
          });
        });
      })
    });
  });
} /** End of 'rayMarch' function */

/**
 * @info Merge cascades function
 * @returns none
 **/
const merge: Function = (): void => {
  if (cascades.length == 1)
    return;

  for (let i: number = cascades.length - 2; i >= 0; i--)
    cascades[i].probeArray.array.forEach((probeArray: probe[], probeX: number) => {
      probeArray.forEach((prb: probe, probeY: number) => {
        const nearPrb: nearProbe = searchNearProbes(i, probeX, probeY);

        for (let x: number; x < prb.size; x++)
          for (let y: number; y < prb.size; y++)
          {
            let colors: number[4];

            const Count: Function = (indexX: number, indexY: number, index: number) => {
              let count: number = 0;

              for (let j: number = 0; j < 2; j++)
                for (let k: number = 0; k < 2; k++)
                  if (cascades[i + 1].probeArray[indexY][indexX].pixelArray[2 * y + j][2 * x + k].isIntersect)
                  {
                    colors[0] += cascades[i + 1].probeArray[indexY][indexX].pixelArray[2 * y + j][2 * x + k].color;
                    count++;
                  }
              if (count != 0)
                colors[0] /= count, count = 0;
            }

            Count(nearPrb.indexY1, nearPrb.indexX1, 0);
            Count(nearPrb.indexY1, nearPrb.indexX2, 1);
            Count(nearPrb.indexY2, nearPrb.indexX1, 2);
            Count(nearPrb.indexY2, nearPrb.indexX2, 3);
            const intX: number = prb.pos.sub(cascades[i + 1].probeArray[nearPrb.indexY2][nearPrb.indexX1].pos).length() /
                                 (cascades[i + 1].probeArray[nearPrb.indexY2][nearPrb.indexX2].pos.sub(cascades[i + 1].probeArray[nearPrb.indexY2][nearPrb.indexX1].pos).length());
            const intY: number = prb.pos.sub(cascades[i + 1].probeArray[nearPrb.indexY1][nearPrb.indexX2].pos).length() /
                                 (cascades[i + 1].probeArray[nearPrb.indexY1][nearPrb.indexX1].pos.sub(cascades[i + 1].probeArray[nearPrb.indexY1][nearPrb.indexX2].pos).length());
            prb.pixelArray[y][x].color = (colors[2] - colors[3] - colors[0] + colors[1]) * intX * intY +
                                         (colors[3] - colors[2]) * intX + (colors[0] - colors[2]) * intY + colors[2];
          }
      })
    });
} /** End of 'merge' function */

/**
 * @info Calculate ray interval function
 * @param interval: number
 * @param cascadeIndex: number
 * @returns none
 **/
const calculateInterval: Function = (interval: number, cascadeIndex: number): void => {
  const origin: number = (interval * (1 - Math.pow(4, cascadeIndex))) / (1 - 4);
  const length: number = interval * Math.pow(4, cascadeIndex);
} /** End of 'calculateInterval' function */

/**
 * @info Search in other cascades nearest probes function
 * @param cascadeIndex: number
 * @param probeX: number
 * @param probeY: number
 * @returns indices of nearest probes
 **/
const searchNearProbes: Function = (cascadeIndex: number, probeX: number, probeY: number): nearProbe => {
  const
    sizeN: number = cascades[cascadeIndex].size,
    sizeN1: number = cascades[cascadeIndex + 1].size;
  
  const
    posX: number = (0.5 + probeX) * frameSize / sizeN,
    posY: number = (0.5 + probeY) * frameSize / sizeN;
  
  const indexX: number = posX / sizeN1;
  const indexX1: number = Math.ceil(indexX);
  let indexX2: number;
  if (indexX > indexX1 + 0.5 && indexX1 != sizeN1 - 1)
    indexX2 = indexX1 + 1;
  else
    indexX2 = indexX1 - 1;
  if (indexX2 == -1)
    indexX2 = 2

  const indexY: number = posY / sizeN1;
  const indexY1: number = Math.ceil(indexY);
  let indexY2: number;
  if (indexY > indexY1 + 0.5 && indexY1 != sizeN1 - 1)
    indexY2 = indexY1 + 1;
  else
    indexY2 = indexY1 - 1;
  if (indexY2 == -1)
    indexY2 = 2;
  return {indexX1, indexX2, indexY1, indexY2};
} /** End of 'searchNearProbes' function */

/**
 * @info Count distance for sphere function
 * @param currentPos: number
 * @param sph: sphere
 * @returns distance to sphere
 **/
const sphereDistance: Function = (currentPos: number, sph: sphere): number => {
  return Math.max(0, sph.position.sub(currentPos).length() - sph.radius);
} /** End of 'sphereDistance' function */

/**
 * @info Search smallest sphere function
 * @returns none
 **/
const searchSmallest: Function = (): void => {
  for (let i: number = 0; i < spheres.length(); i++)
    smallestSize = Math.min(smallestSize, spheres[i].radius);
} /** End of 'searchSmallest' function */

/**
 * @info Search nearest sphere function
 * @param pos: vec2
 * @returns distance to sphere
 **/
const searchNear: Function = (pos: vec2): number => {
  let dist: number = 10000;

  for (let i: number = 0; i < spheres.length(); i++)
    dist = Math.min(dist, Math.max(0, spheres[i].position.sub(pos).length() - spheres[i].radius));
  return dist;
} /** End of 'searchNear' function */

/**
 * @info Search farest sphere function
 * @param pos: vec2
 * @returns distance to sphere
 **/
const searchFar: Function = (pos: vec2): number => {
  let dist: number = 0;

  for (let i: number = 0; i < spheres.length(); i++)
    dist = Math.max(dist, spheres[i].position.sub(pos).length() - spheres[i].radius);
  return dist;
} /** End of 'searchFar' function */

/**
 * @info Initialization cascades function
 * @returns none
 **/
const init: Function = (): void => {
  const Count: number = cascadesCount(frameSize, frameSize, 1);  // Temporary

  searchSmallest();
  for (let i: number = 0; i < Count; i++) {
    cascades[i].size = 2 * Math.pow(2, i);
    for (let j: number = 0; j < frameSize / (2 * Math.pow(2, i) * 16); j++)
      for (let k: number = 0; k < frameSize / (2 * Math.pow(2, i) * 16); k++)
        cascades[i].probeArray[j][k] = createProbe(frameSize / (2 * Math.pow(2, i) * 16), vec2(k + 0.5, j + 0.5) * frameSize / (2 * Math.pow(2, i) * 16));
  }
  cascades.reverse();
} /** End of 'init' function */

/** END OF 'test.ts' FILE */
