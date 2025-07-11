// /* FILE NAME   : vert.wgsl
//  * PURPOSE     : Cascade radiance implementation project.
//  * PROGRAMMER  : CGSG'SrAd'2024.
//  *               Timofey Hudyakov (TH4),
//  *               Rybinskiy Gleb (GR1),
//  *               Ilyasov Alexander (AI3).
//  * LAST UPDATE : 17.06.2025
//  */

#include "prim.wgsl"

/** Fragment shader **/
const PI: f32 = 3.14159265359;

// Распаковка vec4f из одного u32 (по 8 бит на компонент)
fn unpackVec4FromUint(packed: u32) -> vec4f {
  let x = f32(packed & 0xFFu) / 255.0;
  let y = f32((packed >> 8u) & 0xFFu) / 255.0;
  let z = f32((packed >> 16u) & 0xFFu) / 255.0;
  let w = f32((packed >> 24u) & 0xFFu) / 255.0;
  
  return vec4f(x, y, z, w);
}

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

@fragment

/**
 * @info Fragment main function
 * @param data: vertexOut
 */
fn fragment_main(data: vertexOut) -> @location(0) vec4f {
  let albedoSample = textureSample(albedo, linearSampler, data.texcoord);
  var Alb: vec3f = albedoSample.rgb;
  Alb = pow(Alb, vec3f(2.2));
  
  // Alpha testing
  let materialAlpha = textureSample(emissive, linearSampler, data.texcoord).a;
  let alphaCutoff = albedoSample.a;

  var Rou: f32 = textureSample(roughness, linearSampler, data.texcoord).g;
  var Met: f32 = textureSample(metallic, linearSampler, data.texcoord).b;
  
  // point components
  var Pos = data.position;
  var Normal = normalize(data.normal);

  var V = normalize(Pos - cam.locW.xyz);
  var N = Normal;

  // Directional light
  var L = normalize(vec3f(0.5, 1.0, 0.3));
  
  var Lo = pbr(Pos, V, L, N, Alb, Rou, Met, vec3f(1), 1.0) * 3.0;

  var color = Lo;

  // Add ambient lighting\
  let ao = max(textureSample(ao, linearSampler, data.texcoord).r, 0.1);
  
  // Применить AO к ambient освещению:
  let ambient = vec3f(0.05) * Alb * ao;
  // let ambient = vec3f(0.05) * albedo;
  let finalColor = Lo + ambient;
  
  // Gamma correction
  return vec4f(pow(finalColor, vec3f(1.0 / 2.2)), albedoSample.a);
}
