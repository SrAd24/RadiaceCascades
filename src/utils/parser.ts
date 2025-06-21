/* FILE NAME   : parser.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 21.06.2025
 */

/** IMPORTS */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { primitive, primitive_descriptor } from '../engine/render/res/primitives/primitives';
import { topology, std } from '../engine/render/res/primitives/topology';
import { vec3 } from '../math/mth_vec3';
import { vec2 } from '../math/mth_vec2';
import { vec4 } from '../math/mth_vec4';
import { material, material_descriptor } from '../engine/render/res/materials/materials';
import { DIContainer } from '../engine/render/render';

/** Vertex class */
class myVertex {
    public p: Float32Array = new Float32Array(3); // Position (x, y, z)
    public t: Float32Array = new Float32Array(2); // Texture coordinates (u, v)
    public n: Float32Array = new Float32Array(3); // Normal (x, y, z)
    public c: Float32Array = new Float32Array(3); // Color (r, g, b)
}

/** GLTF parser class */
class gltfParser { 

    /**
     * @info Load GLTF file and extract all primitives
     * @param filePath: string
     * @returns Promise with array of primitives
     */
    public async gltfToPTNC(filePath: string): Promise<primitive[]> {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            
            loader.load(
            filePath,
            (gltf) => {
                const primitives = this.extractAllPTNC(gltf.scene, filePath);
                console.log(primitives);
                resolve(primitives);
            },
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                reject(error);
            }
            );
        });
    }

    /**
     * @info Convert vertex array to primitive with material
     * @param vertices: myVertex[]
     * @param indices: number[]
     * @param threeMaterial: THREE.Material - Three.js material
     * @returns Promise with created primitive
     */
    private async vertexArrayToPrimitive(vertices: myVertex[], indices: number[], filePath: String, threeMaterial?: THREE.Material): Promise<primitive> {
        // Create material from Three.js material or default
        const render = DIContainer.currentRender;
        const mtlPattern = await render.createMaterialPattern({
            shaderName: 'model',
            vertexAttributes: std.attributes,
            topology: "triangle-list",
         });
        
        let mtlDesc: material_descriptor = {
            material_pattern: mtlPattern,
            albedo: new vec3(0.8, 0.8, 0.8),
            roughness: 0.5,
            metallic: 0.0
        };
        
        // Extract material properties from Three.js material
        if (1) {
            const stdMat = threeMaterial as THREE.MeshStandardMaterial;
            
            // Extract color
            console.log(stdMat)

            const albedoPath = filePath;
            const readyPath: string = albedoPath.split('/').reduce((elemPrev, elem, index) => {
                if (index < albedoPath.split('/').length - 1)
                    return elemPrev + "/" + elem;
                else 
                    return elemPrev + '/';
            });

            if (stdMat.map?.name) {
                console.log(readyPath);
                if (stdMat.map.userData?.mimeType.split('/')[1] == 'jpeg')
                    mtlDesc.albedo = readyPath + stdMat.map.name + ".jpg";
                else
                    mtlDesc.albedo = readyPath + stdMat.map.name + stdMat.map.userData.mimeType.split('/')[1];
            }
            
            // Extract roughness and metalness
            // if (stdMat.roughnessMap?.name)
            //     mtlDesc.roughness = readyPath + stdMat.roughnessMap.name;
            // else 
            //     mtlDesc.roughness = 0.5;

            // if (stdMat.metalnessMap?.name) {
            //     mtlDesc.roughness = (readyPath + stdMat.metalnessMap.name);
            // }
            // else 
            //     mtlDesc.metallic = 0.0;

            console.log('Normal map found:', stdMat.roughnessMap?.name);
            
            // Extract normal map texture if present
            if (stdMat.normalMap) {
                // Normal map would need texture loading implementation
                console.log('Normal map found:', stdMat.normalMap);
            }
        
        }
        console.log(mtlDesc)
        
        const mtl = await render.createMaterial(mtlDesc);

        // Convert myVertex to std vertex format
        const stdVertices = vertices.map(v => new std(
            new vec3(v.p[0], v.p[1], v.p[2]),
            new vec2(v.t[0], v.t[1]),
            new vec3(v.n[0], v.n[1], v.n[2]),
            new vec4(v.c[0], v.c[1], v.c[2], 1)
        ));
        
        // Create topology and primitive
        const topo = new topology(stdVertices, indices);
        const primDesc: primitive_descriptor = { material: mtl, topology: topo };
        
        const prim = new primitive();
        await prim.create(primDesc);
        return prim;
    }

    /**
     * @info Extract all primitives from GLTF scene
     * @param scene: THREE.Object3D - GLTF scene
     * @param fileName: string - file path
     * @returns Promise with array of primitives
     */
    private async extractAllPTNC(scene: THREE.Object3D, fileName: string): Promise<primitive[]> {
        const primitives: primitive[] = [];

        // Traverse scene and extract each mesh as separate primitive
        const meshes: THREE.Mesh[] = [];
        scene.traverse((object) => {
            if (object?.isMesh) {
                meshes.push(object as THREE.Mesh);
            }
        });
        
        for (const _mesh of meshes) {
                const object = _mesh;
                const mesh = object as THREE.Mesh;
                const geometry = mesh.geometry;
                const position = geometry.attributes.position;
                const uv = geometry.attributes.uv;
                const normal = geometry.attributes.normal;
                const color = geometry.attributes.color;
                
                const meshMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
                const verticesArray: myVertex[] = [];
                const indicesArray: number[] = [];
                
                const vertexCount = position.count;
                
                // Extract vertex data for this mesh
                for (let i = 0; i < vertexCount; i++) {
                    let vertex: myVertex = new myVertex();

                    // Position
                    vertex.p[0] = position.getX(i);
                    vertex.p[1] = position.getY(i);
                    vertex.p[2] = position.getZ(i);
                    
                    // Texture coordinates
                    if (uv) {
                        vertex.t[0] = uv.getX(i);
                        vertex.t[1] = uv.getY(i);
                    }
                    
                    // Normals
                    if (normal) {
                        vertex.n[0] = normal.getX(i);
                        vertex.n[1] = normal.getY(i);
                        vertex.n[2] = normal.getZ(i);
                    }
                    
                    // Colors (default white if not present)
                    if (color) {
                        vertex.c[0] = color.getX(i);
                        vertex.c[1] = color.getY(i);
                        vertex.c[2] = color.getZ(i);
                    } else {
                        vertex.c[0] = 1;
                        vertex.c[1] = 1;
                        vertex.c[2] = 1;
                    }

                    verticesArray.push(vertex);
                }
                
                // Extract indices if present
                if (geometry.index) {
                    for (let i = 0; i < geometry.index.count; i++) {
                        indicesArray.push(geometry.index.getX(i));
                    }
                }
                
                // Create primitive for this mesh
                const primitive = await this.vertexArrayToPrimitive(verticesArray, indicesArray, fileName, meshMaterial);
                console.log("primitive to add: ", primitive);
                primitives.push(primitive);
        }
        
        return primitives;
    }
}

/** EXPORTS */
export { gltfParser };

/** END OF 'parser.ts' FILE */
