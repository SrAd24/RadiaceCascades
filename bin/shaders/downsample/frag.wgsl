/* FILE NAME   : frag.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** Vertex output */
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
}

/** Texture and sampler bindings */
@group(0) @binding(0) var sourceTexture: texture_2d<f32>;
@group(0) @binding(1) var sourceSampler: sampler;

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
  // Get texture dimensions
  let texSize = textureDimensions(sourceTexture, 0);
  let texelSize = 1.0 / vec2f(texSize);
  
  let uv = input.texcoord;
  
  // 2x2 box filter for downsampling
  let offset = texelSize * 0.5;
  
  let sample0 = textureSample(sourceTexture, sourceSampler, uv + vec2f(-offset.x, -offset.y));
  let sample1 = textureSample(sourceTexture, sourceSampler, uv + vec2f( offset.x, -offset.y));
  let sample2 = textureSample(sourceTexture, sourceSampler, uv + vec2f(-offset.x,  offset.y));
  let sample3 = textureSample(sourceTexture, sourceSampler, uv + vec2f( offset.x,  offset.y));
  
  // Average the 4 samples
  let result = (sample0 + sample1 + sample2 + sample3) * 0.25;
  
  return result;
}