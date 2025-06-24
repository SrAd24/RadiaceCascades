/* FILE NAME   : frag.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

#include "prim.wgsl"

/** Vertex output structure with tangent space */
struct vertexExtOut {
  @builtin(position) gl_position: vec4f,
  @location(0) position: vec3f,
  @location(1) texcoord: vec2f,
  @location(2) normal: vec3f,
  @location(3) color: vec4f,
  @location(4) tangent: vec3f,
  @location(5) bitangent: vec3f,
}
/** Fragment shader with normal mapping **/
const PI: f32 = 3.14159265359;

fn fresnelSchlick(cosTheta: f32, F0: vec3f) -> vec3f {
  return F0 + (vec3f(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
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

@fragment

/**
 * @info Fragment main function with normal mapping
 * @param data: vertexOut
 */
fn fragment_main(data: vertexExtOut) -> @location(0) vec4f {
  let albedoSample = textureSample(albedo, linearSampler, data.texcoord);
  var albedo: vec3f = albedoSample.rgb;
  albedo = pow(albedo, vec3f(2.2)); // sRGB to linear
  
  // Alpha testing
  let materialAlpha = textureSample(emissive, linearSampler, data.texcoord).a;
  let alphaCutoff = albedoSample.a;
   
  var roughness: f32 = textureSample(roughness, linearSampler, data.texcoord).g;
  var metallic: f32 = textureSample(metallic, linearSampler, data.texcoord).b;
  
  // Sample normal map and convert to world space
  let normalMapSample = textureSample(normalMap, linearSampler, data.texcoord).rgb;
  let normalMap = normalize(normalMapSample * 2.0 - 1.0); // Convert from [0,1] to [-1,1]
  
  // Create TBN matrix (Tangent, Bitangent, Normal)
  let T = normalize(data.tangent);
  let B = normalize(data.bitangent);
  let N = normalize(data.normal);
  let TBN = mat3x3f(T, B, N);
  
  // Transform normal from tangent space to world space
  let worldNormal = normalize(TBN * normalMap);
  
  // Vectors
  let worldPos = data.position;
  let V = normalize(worldPos - cam.locW.xyz);
  
  // Directional light
  let L = normalize(vec3f(0.5, 1.0, 0.3));
  let H = normalize(-V + L);
  
  // Material properties
  var F0 = mix(vec3f(0.04), albedo, metallic);
  
  // Cook-Torrance BRDF
  let NDF = DistributionGGX(worldNormal, H, roughness);
  let G = GeometrySmith(worldNormal, -V, L, roughness);
  let F = fresnelSchlick(max(dot(H, -V), 0.0), F0);
  
  let kS = F;
  let kD = (vec3f(1.0) - kS) * (1.0 - metallic);
  
  let numerator = NDF * G * F;
  let denominator = 4.0 * max(dot(worldNormal, -V), 0.0) * max(dot(worldNormal, L), 0.0) + 0.0001;
  let specular = numerator / denominator;
  
  let NdotL = max(dot(worldNormal, L), 0.0);
  let radiance = vec3f(3.0);
  let Lo = (kD * albedo / PI + specular) * radiance * NdotL;
  
  // Add ambient lighting\
  let ao = max(textureSample(ao, linearSampler, data.texcoord).r, 0.1);
  // Применить AO к ambient освещению:
  let ambient = vec3f(0.05) * albedo; //* max(ao, 0.1);
  // let ambient = vec3f(0.05) * albedo;
  let finalColor = Lo + ambient;
  
  // Gamma correction
  return vec4f(pow(finalColor, vec3f(1.0 / 2.2)), albedoSample.a);
}