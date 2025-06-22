/* FILE NAME   : vert.wgsl
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** Vertex input for fullscreen quad */
struct VertexInput {
  @builtin(vertex_index) vertexIndex: u32,
}

/** Vertex output */
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
}

@vertex
fn vertex_main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  
  // Generate fullscreen quad from vertex index
  let x = f32((input.vertexIndex << 1u) & 2u);
  let y = f32(input.vertexIndex & 2u);
  
  output.position = vec4f(x * 2.0 - 1.0, y * 2.0 - 1.0, 0.0, 1.0);
  output.texcoord = vec2f(x, 1.0 - y);
  
  return output;
}