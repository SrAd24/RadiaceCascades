/* FILE NAME   : uni_phys_sample.ts
 * PURPOSE     : Jumping cubes sample.
 * PROGRAMMER  : CGSG'SrAd'2024.
 * LAST UPDATE : 22.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";
import { vec3 } from "math/mth_vec3";
import { vec2 } from "math/mth_vec2";
import { mat4 } from "math/mth_mat4";
import { timer } from "engine/input/timer";
import { topology, std } from "engine/render/res/primitives/topology";

/** Jumping cube */
class JumpingCube {
  public position: vec3;
  public velocity: vec3;
  public primitive: any;
  public jumpTimer: number = 0;

  constructor(x: number, y: number, z: number) {
    this.position = new vec3(x, y, z);
    this.velocity = new vec3(0, 0, 0);
    this.jumpTimer = Math.random() * 3;
  }
}

/** Jumping cubes unit */
class _uni_phys_sample extends unit {
  private cubes: JumpingCube[] = [];
  private cubeTopology: any;
  private materials: any[] = [];
  private planePrimitive: any;
  private gravity: number = -15;
  private bounceForce: number = 0.8;

  public async init(ani: anim): Promise<void> {
    // Create cube geometry
    const vertices: std[] = [
      new std(new vec3(-1, -1,  1), new vec2(0, 0), new vec3(0, 0, 1)),
      new std(new vec3( 1, -1,  1), new vec2(1, 0), new vec3(0, 0, 1)),
      new std(new vec3( 1,  1,  1), new vec2(1, 1), new vec3(0, 0, 1)),
      new std(new vec3(-1,  1,  1), new vec2(0, 1), new vec3(0, 0, 1)),
      new std(new vec3(-1, -1, -1), new vec2(1, 0), new vec3(0, 0, -1)),
      new std(new vec3(-1,  1, -1), new vec2(1, 1), new vec3(0, 0, -1)),
      new std(new vec3( 1,  1, -1), new vec2(0, 1), new vec3(0, 0, -1)),
      new std(new vec3( 1, -1, -1), new vec2(0, 0), new vec3(0, 0, -1)),
      new std(new vec3(-1,  1, -1), new vec2(0, 1), new vec3(0, 1, 0)),
      new std(new vec3(-1,  1,  1), new vec2(0, 0), new vec3(0, 1, 0)),
      new std(new vec3( 1,  1,  1), new vec2(1, 0), new vec3(0, 1, 0)),
      new std(new vec3( 1,  1, -1), new vec2(1, 1), new vec3(0, 1, 0)),
      new std(new vec3(-1, -1, -1), new vec2(1, 1), new vec3(0, -1, 0)),
      new std(new vec3( 1, -1, -1), new vec2(0, 1), new vec3(0, -1, 0)),
      new std(new vec3( 1, -1,  1), new vec2(0, 0), new vec3(0, -1, 0)),
      new std(new vec3(-1, -1,  1), new vec2(1, 0), new vec3(0, -1, 0)),
      new std(new vec3( 1, -1, -1), new vec2(1, 0), new vec3(1, 0, 0)),
      new std(new vec3( 1,  1, -1), new vec2(1, 1), new vec3(1, 0, 0)),
      new std(new vec3( 1,  1,  1), new vec2(0, 1), new vec3(1, 0, 0)),
      new std(new vec3( 1, -1,  1), new vec2(0, 0), new vec3(1, 0, 0)),
      new std(new vec3(-1, -1, -1), new vec2(0, 0), new vec3(-1, 0, 0)),
      new std(new vec3(-1, -1,  1), new vec2(1, 0), new vec3(-1, 0, 0)),
      new std(new vec3(-1,  1,  1), new vec2(1, 1), new vec3(-1, 0, 0)),
      new std(new vec3(-1,  1, -1), new vec2(0, 1), new vec3(-1, 0, 0))
    ];
    
    const indices: number[] = [
      0,  1,  2,   0,  2,  3,    4,  5,  6,   4,  6,  7,
      8,  9,  10,  8,  10, 11,   12, 13, 14,  12, 14, 15,
      16, 17, 18,  16, 18, 19,   20, 21, 22,  20, 22, 23
    ];
    
    this.cubeTopology = new topology(vertices, indices);
    
    const materialPattern = await ani.createMaterialPattern({
      shaderName: "model_obj",
      vertexAttributes: std.attributes,
      topology: "triangle-list"
    });
    
    this.materials = [
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.8, 0.3, 0.2), roughness: 0.4, metallic: 0.6 }),
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.2, 0.8, 0.3), roughness: 0.4, metallic: 0.6 }),
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.3, 0.2, 0.8), roughness: 0.4, metallic: 0.6 }),
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.8, 0.8, 0.2), roughness: 0.4, metallic: 0.6 }),
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.8, 0.2, 0.8), roughness: 0.4, metallic: 0.6 }),
      await ani.createMaterial({ material_pattern: materialPattern, albedo: new vec3(0.5, 0.5, 0.5), roughness: 0.2, metallic: 0.8 })
    ];
    
    // Create plane
    const planeVerts: std[] = [
      new std(new vec3(-10, -1, -10), new vec2(0, 0), new vec3(0, 1, 0)),
      new std(new vec3( 10, -1, -10), new vec2(1, 0), new vec3(0, 1, 0)),
      new std(new vec3( 10, -1,  10), new vec2(1, 1), new vec3(0, 1, 0)),
      new std(new vec3(-10, -1,  10), new vec2(0, 1), new vec3(0, 1, 0))
    ];
    const planeInds: number[] = [0, 1, 2, 0, 2, 3];
    const planeTopology = new topology(planeVerts, planeInds);
    
    this.planePrimitive = await ani.createPrimitive({
      material: this.materials[5],
      topology: planeTopology
    });
    
    // Create jumping cubes
    for (let i = 0; i < 8; i++) {
      const cube = new JumpingCube(
        (Math.random() - 0.5) * 8,
        Math.random() * 3,
        (Math.random() - 0.5) * 8
      );
      cube.primitive = await ani.createPrimitive({
        material: this.materials[i % 5],
        topology: this.cubeTopology
      });
      this.cubes.push(cube);
    }
  }

  public async response(ani: anim): Promise<void> {
    const dt = Math.min(timer.globalDeltaTime, 1/60);
    
    for (const cube of this.cubes) {
      // Update jump timer
      cube.jumpTimer -= dt;
      
      // Jump when timer reaches zero and cube is on ground
      if (cube.jumpTimer <= 0 && cube.position.y <= 0.1) {
        cube.velocity.y = 8 + Math.random() * 4;
        cube.velocity.x = (Math.random() - 0.5) * 3;
        cube.velocity.z = (Math.random() - 0.5) * 3;
        cube.jumpTimer = 1 + Math.random() * 2;
      }
      
      // Apply gravity
      cube.velocity.y += this.gravity * dt;
      
      // Update position
      cube.position = cube.position.add(cube.velocity.mulNum(dt));
      
      // Ground collision
      if (cube.position.y < 0) {
        cube.position.y = 0;
        cube.velocity.y *= -this.bounceForce;
        cube.velocity.x *= 0.9;
        cube.velocity.z *= 0.9;
      }
      
      // Keep cubes in bounds
      if (Math.abs(cube.position.x) > 8) {
        cube.position.x = Math.sign(cube.position.x) * 8;
        cube.velocity.x *= -0.5;
      }
      if (Math.abs(cube.position.z) > 8) {
        cube.position.z = Math.sign(cube.position.z) * 8;
        cube.velocity.z *= -0.5;
      }
    }
  }

  public async render(ani: anim): Promise<void> {
    // Draw plane
    if (this.planePrimitive) {
      ani.draw(this.planePrimitive);
    }
    
    // Draw jumping cubes
    for (const cube of this.cubes) {
      if (cube && cube.primitive) {
        const transform = mat4.translate(cube.position);
        ani.draw(cube.primitive, transform);
      }
    }
  }

  public async destroy(ani: anim): Promise<void> {
    // Cleanup resources
  }
} /** End of '_uni_phys_sample' class */

const uni_phys_sample: _uni_phys_sample = new _uni_phys_sample();

/** EXPORTS */
export { uni_phys_sample };

/** END OF 'uni_phys_sample.ts' FILE */