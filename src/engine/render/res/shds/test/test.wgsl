@vertex
fn vertex_main(@builtin(vertex_index) vertex_id: u32) -> @builtin(position) vec4f {
    const pos = array(
        vec3f(0.0, 0.5, 0.56),  
        vec3f(-0.5, -0.5, 0.1), 
        vec3f(0.5, -0.5, 0.2)   
    );
    return vec4f(pos[vertex_id], 1.0);
}

@fragment
fn fragment_main() -> @location(0) vec4f {
    return vec4f(1.0, 0.0, 0.0, 1.0); 
}