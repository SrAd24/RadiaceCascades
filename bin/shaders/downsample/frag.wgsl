/* FILE NAME   : frag.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 23.06.2025
 */

/** Vertex output structure */
struct VertexOutput {
  @builtin(position) position: vec4f,  // Clip space position
  @location(0) texcoord: vec2f,        // Texture coordinates
}; /** End of 'VertexOutput' structure */

/** Texture and sampler bindings */
@group(0) @binding(0) var sourceTexture: texture_2d<f32>;  // Source texture to downsample
@group(0) @binding(1) var sourceSampler: sampler;          // Linear sampler for texture filtering

@fragment

/**
 * @info Fragment main function for downsampling
 * @param input: VertexOutput
 * @return result color
 */
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
  // Get texture dimensions for texel size calculation
  let texelSize: vec2f = 1.0 / vec2f(textureDimensions(sourceTexture, 0));  // Size of one texel in UV space
  
  let uv: vec2f = input.texcoord;  // Current UV coordinates
  
  // Calculate offset for 2x2 box filter sampling
  let offset: vec2f = texelSize * 0.5;
  
  // Sample 4 neighboring texels in 2x2 pattern
  let sample0: vec4f = textureSample(sourceTexture, sourceSampler, uv + vec2f(-offset.x, -offset.y));  // Top-left
  let sample1: vec4f = textureSample(sourceTexture, sourceSampler, uv + vec2f( offset.x, -offset.y));  // Top-right
  let sample2: vec4f = textureSample(sourceTexture, sourceSampler, uv + vec2f(-offset.x,  offset.y));  // Bottom-left
  let sample3: vec4f = textureSample(sourceTexture, sourceSampler, uv + vec2f( offset.x,  offset.y));  // Bottom-right
  
  // Average the 4 samples to create downsampled result
  let result: vec4f = (sample0 + sample1 + sample2 + sample3) * 0.25;
  
  return result;
} /** End of 'fragment_main' function */

/** END OF 'frag.wgsl' FILE */