/* FILE NAME   : .wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 23.06.2025
 */
 
/** Vertex out struct*/
struct vertexOut {
  @builtin(position) gl_position: vec4f,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f
} /** End of 'vertexOut' struct */

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

@group(0) @binding(0) var<storage> primMatrix: array<primMatricesData>;
@group(0) @binding(1) var<uniform> cam: camData;

@group(1) @binding(0) var albedo: texture_2d<f32>;
@group(1) @binding(1) var roughness: texture_2d<f32>;
@group(1) @binding(2) var metallic: texture_2d<f32>;
@group(1) @binding(3) var emissive: texture_2d<f32>;
@group(1) @binding(4) var normalMap: texture_2d<f32>;
@group(1) @binding(5) var ao: texture_2d<f32>;

@group(2) @binding(0) var linearSampler: sampler;

@group(3) @binding(0) var baseColorTexture : texture_storage_2d_array<r32float, read_write>;
@group(3) @binding(1) var distanceTexture : texture_storage_2d_array<r32float, read_write>;

/** Fragment shader **/
const PI: f32 = 3.14159265359;

fn fresnelSchlick(cosTheta: f32, F0: vec3f) -> vec3f {
  return F0 + (vec3f(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 4.0);
}

fn DistributionGGX(N: vec3f, H: vec3f, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let NdotH = max(dot(N, H), 0.0);
  let NdotH2 = NdotH * NdotH;

  let num = a2;
  var denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  return num / denom;
}

fn GeometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
  let r = (roughness + 1.0);
  let k = (r * r) / 8.0;

  let num = NdotV;
  let denom = NdotV * (1.0 - k) + k;

  return num / denom;
}

fn GeometrySmith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {
  let NdotV = max(dot(N, V), 0.0);
  let NdotL = max(dot(N, L), 0.0);
  let ggx2 = GeometrySchlickGGX(NdotV, roughness);
  let ggx1 = GeometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}

fn pbr(Pos: vec3f, V: vec3f, L: vec3f, N: vec3f, Alb: vec3f, Rou: f32, Met: f32, Att: vec3f, IsDir: f32) -> vec3f {
  var Lo = vec3f(0.0);

  var F0 = vec3f(0.04); 
  F0 = mix(F0, Alb, Met);

  let cc = Att.x;
  let cl = Att.y;
  let cq = Att.z;

  let H = normalize(-V + L);
  let distance = length(vec3f(10) - Pos);
  let attenuation = (1.0 / (cc + cl * distance + cq * distance * distance)) * (1.0 - IsDir) + IsDir;
  let radiance = attenuation; 

  // cook-torrance brdf
  let NDF = DistributionGGX(N, H, Rou);
  let G = GeometrySmith(N, -V, L, Rou);
  let F = fresnelSchlick(max(dot(H, -V), 0.1), F0);

  let kS = F;
  let kD = vec3f(1.0) - kS;
  var kD_final = kD * (1.0 - Met);

  let numerator = NDF * G * F;
  let denominator = 4.0 * max(dot(N, -V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
  let specular = numerator / max(denominator, 0.1);
      
  // add to outgoing radiance Lo
  let NdotL = min(max(dot(N, L), 0.1), 1.0);
  Lo += (kD_final * Alb / PI + specular) * radiance * NdotL;

  return vec3f(Lo);// * 4;
}

/** Fragment shader **/
@fragment

/**
 * @info Fragment main function
 * @param data: vertexOut
 * @return point color
 */
fn fragment_main(data: vertexOut) -> @location(0) vec4f {
  var layerCount: u32 = 7;
  var frameSize: f32 = 512;

  var color: vec3f = data.normal;

  var level: u32 = u32(floor(max(0, data.position.y / 2)));

  var size: f32 = 1;
  var intY: f32 = (data.position.y - 2 * f32(level)) / 2;
  var intX: f32 = (data.position.x - size * floor(data.position.x / size)) / size;
  var intZ: f32 = (data.position.z - size * floor(data.position.z / size)) / size;

  var texCoord: vec2f = floor((data.position.xz + vec2f(20)) / size) * size * frameSize / 40;
  var offset: f32 = size * frameSize / 40;

  var p000: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord), 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord), 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord), 4 * layerCount + 3 * level + 2).r);
  var p100: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 4 * layerCount + 3 * level + 2).r);
  var p001: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 4 * layerCount + 3 * level + 2).r);
  var p101: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 4 * layerCount + 3 * level + 2).r);
  var p010: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord), 3 + 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord), 3 + 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord), 3 + 4 * layerCount + 3 * level + 2).r);
  var p110: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 3 + 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 3 + 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset, 0)), 3 + 4 * layerCount + 3 * level + 2).r);
  var p011: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 3 + 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 3 + 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(0, offset)), 3 + 4 * layerCount + 3 * level + 2).r);
  var p111: vec3f =
    vec3f(textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 3 + 4 * layerCount + 3 * level).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 3 + 4 * layerCount + 3 * level + 1).r,
          textureLoad(distanceTexture, vec2u(texCoord + vec2f(offset)), 3 + 4 * layerCount + 3 * level + 2).r);

  var newColor: vec3f =
    p000 * (1 - intX) * (1 - intY) * (1 - intZ) +
    p100 * intX * (1 - intY) * (1 - intZ) +
    p001 * (1 - intX) * (1 - intY) * intZ +
    p101 * intX * (1 - intY) * intZ +
    p010 * (1 - intX) * intY * (1 - intZ) +
    p110 * intX * intY * (1 - intZ) +
    p011 * (1 - intX) * intY * intZ +
    p111 * intX * intY * intZ;

  var baseColor: vec3f = textureSample(albedo, linearSampler, data.texcoord).rgb;
  var rough: f32 = textureSample(roughness, linearSampler, data.texcoord).g;
  var met: f32 = textureSample(metallic, linearSampler, data.texcoord).b;

  // baseColor = vec3f(0.2, 0.2, 0);
  // rough = 0.4;
  // met = 0.1;

  color = pow(newColor+
              pbr(data.position, normalize(data.position - cam.locW.xyz), normalize(vec3f(1)),
                  data.normal, baseColor, rough, met, vec3f(1), 1), vec3f(1 / 2.2));

  return vec4f(color, 1);
} /** End of 'fragment_main' function*/

/** END OF 'frag.wgsl' FILE */
