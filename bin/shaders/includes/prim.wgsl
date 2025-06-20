/** Vertex out struct*/
struct vertexOut {
    @builtin(position) gl_position: vec4f,
    @location(0) position: vec3f,
    @location(1) texcoord: vec2f,
    @location(2) normal: vec3f,
    @location(3) color: vec4f,
} /** End of 'vertexOut' struct */

struct computeMatrixData {
  world: mat4x4<f32>,
};

struct primMatricesData {
  w: mat4x4<f32>,
  wvp: mat4x4<f32>,
  winv: mat4x4<f32>,
};

struct camData {
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
  vp: mat4x4<f32>,
  locW: vec4f,
  atH: vec4f,
  dirProjDist: vec4f,
  rightWp: vec4f,
  upHp: vec4f,
};

@group(0) @binding(0) var<storage, read> primMatrix: array<primMatricesData>;
@group(0) @binding(1) var<uniform> cam: camData;
@group(1) @binding(0) var albedo: texture_2d<f32>;
@group(1) @binding(1) var roughness: texture_2d<f32>;
@group(1) @binding(2) var metallic: texture_2d<f32>;
@group(1) @binding(3) var emissive: texture_2d<f32>;
@group(1) @binding(4) var normalMap: texture_2d<f32>;
@group(2) @binding(0) var linearSampler: sampler;
