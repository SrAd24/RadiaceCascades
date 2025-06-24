/* FILE NAME   : models.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { material_pattern } from "../mtl_ptn/material_patterns";
import { primitive } from "../primitives/primitives";
import { topology } from "../primitives/topology";
import { std_ext } from "../primitives/topology";

/** Model descriptor interface */
interface model_descriptor {
  name: string;
  format: string;
} /** End of 'model_descriptor' interface */

/** Model class */
class model {
  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */
  public so = 0;

  /** #public parameters */
  public prims!: primitive[]; // Primitives array
  private meshTransforms: mat4[] = []; // Store mesh transforms

  /**
   * @info Check if matrix is identity
   * @param matrix: mat4
   * @returns boolean
   */
  private isIdentityMatrix(matrix: mat4): boolean {
    const m = matrix.m;
    return m[0][0] === 1 && m[0][1] === 0 && m[0][2] === 0 && m[0][3] === 0 &&
           m[1][0] === 0 && m[1][1] === 1 && m[1][2] === 0 && m[1][3] === 0 &&
           m[2][0] === 0 && m[2][1] === 0 && m[2][2] === 1 && m[2][3] === 0 &&
           m[3][0] === 0 && m[3][1] === 0 && m[3][2] === 0 && m[3][3] === 1;
  }

  /**
   * @info Simple GLTF parser to avoid stack overflow
   */
  private async parseGLTFSimple(gltfUrl: string, modelName: string) {
    const response = await fetch(gltfUrl);
    const gltf = await response.json();
    
    // Load buffers
    const buffers: ArrayBuffer[] = [];
    for (const buffer of gltf.buffers || []) {
      if (buffer.uri) {
        const bufferResponse = await fetch(`bin/models/${modelName}/${buffer.uri}`);
        buffers.push(await bufferResponse.arrayBuffer());
      }
    }
    
    const meshes: any[] = [];
    
    // Parse nodes and their transforms
    const nodeTransforms = new Map<number, mat4>();
    if (gltf.nodes) {
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        let transform = mat4.identity();
        
        if (node.matrix) {
          // GLTF matrices are stored in column-major order, need to transpose
          transform = new mat4(
            node.matrix[0], node.matrix[4], node.matrix[8], node.matrix[12],
            node.matrix[1], node.matrix[5], node.matrix[9], node.matrix[13],
            node.matrix[2], node.matrix[6], node.matrix[10], node.matrix[14],
            node.matrix[3], node.matrix[7], node.matrix[11], node.matrix[15]
          );
        } else {
          // Build from TRS
          if (node.translation) {
            transform = transform.mul(mat4.translate(new vec3(node.translation[0], node.translation[1], node.translation[2])));
          }
          if (node.rotation) {
            // Convert quaternion to matrix (GLTF quaternions are [x, y, z, w])
            const q = node.rotation;
            const rotMat = mat4.rotateQuaternion(q[0], q[1], q[2], q[3]);
            transform = transform.mul(rotMat);
          }
          if (node.scale) {
            transform = transform.mul(mat4.scale(new vec3(node.scale[0], node.scale[1], node.scale[2])));
          }
        }
        
        nodeTransforms.set(i, transform);
      }
    }
    
    for (const mesh of gltf.meshes || []) {
      for (const primitive of mesh.primitives || []) {
        const vertices: any[] = [];
        const indices: number[] = [];
        
        // Read positions
        if (primitive.attributes?.POSITION !== undefined) {
          const accessor = gltf.accessors[primitive.attributes.POSITION];
          const bufferView = gltf.bufferViews[accessor.bufferView];
          const buffer = buffers[bufferView.buffer];
          
          const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
          const positions = new Float32Array(buffer.slice(offset, offset + accessor.count * 3 * 4));
          
          for (let i = 0; i < accessor.count; i++) {
            vertices.push({
              position: [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]],
              texCoord: [0, 0]
            });
          }
        }
        
        // Read texture coordinates
        if (primitive.attributes?.TEXCOORD_0 !== undefined) {
          const accessor = gltf.accessors[primitive.attributes.TEXCOORD_0];
          const bufferView = gltf.bufferViews[accessor.bufferView];
          const buffer = buffers[bufferView.buffer];
          
          const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
          const texCoords = new Float32Array(buffer.slice(offset, offset + accessor.count * 2 * 4));
          
          for (let i = 0; i < Math.min(accessor.count, vertices.length); i++) {
            vertices[i].texCoord = [texCoords[i * 2], texCoords[i * 2 + 1]];
          }
        }
        
        // Read indices
        if (primitive.indices !== undefined) {
          const accessor = gltf.accessors[primitive.indices];
          const bufferView = gltf.bufferViews[accessor.bufferView];
          const buffer = buffers[bufferView.buffer];
          
          const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
          
          if (accessor.componentType === 5123) { // UNSIGNED_SHORT
            const indexData = new Uint16Array(buffer.slice(offset, offset + accessor.count * 2));
            for (let i = 0; i < indexData.length; i++) {
              indices.push(indexData[i]);
            }
          } else if (accessor.componentType === 5125) { // UNSIGNED_INT
            const indexData = new Uint32Array(buffer.slice(offset, offset + accessor.count * 4));
            for (let i = 0; i < indexData.length; i++) {
              indices.push(indexData[i]);
            }
          } else if (accessor.componentType === 5121) { // UNSIGNED_BYTE
            const indexData = new Uint8Array(buffer.slice(offset, offset + accessor.count));
            for (let i = 0; i < indexData.length; i++) {
              indices.push(indexData[i]);
            }
          }
        }
        
        // Find which node uses this mesh
        let meshTransform = mat4.identity();
        if (gltf.nodes) {
          for (let nodeIndex = 0; nodeIndex < gltf.nodes.length; nodeIndex++) {
            const node = gltf.nodes[nodeIndex];
            if (node.mesh === gltf.meshes.indexOf(mesh)) {
              meshTransform = nodeTransforms.get(nodeIndex) || mat4.identity();
              break;
            }
          }
        }
        
        meshes.push({
          vertices,
          indices,
          materialIndex: primitive.material || 0,
          hasNormalMap: primitive.material !== undefined && gltf.materials?.[primitive.material]?.normalTexture !== undefined,
          transform: meshTransform
        });
      }
    }
    
    return {
      meshes,
      materials: gltf.materials || [],
      textures: gltf.textures || [],
      images: gltf.images || []
    };
  }

  /**
   * @info Create OBJ model function
   * @param modelParams: model_descriptor
   * @returns none
   */
  public async createOBJ(modelParams: model_descriptor) {
    const response = await fetch("bin/models/" + modelParams.name + "." + modelParams.format);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${modelParams.name}`);
    }
    let objText = await response.text();
    const vertices: std[] = [];
    let vertexCount = 0;
    const indices: number[] = [];
    const lines = objText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const parts = trimmed.split(/\s+/);
      const type = parts[0];
      if (type === "v" && parts.length >= 4) {
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);
        vertices.push(new std(new vec3(x, y, z)));
        vertexCount++;
      } else if (type === "f" && parts.length >= 4) {
        const faceIndices: number[] = [];

        for (let i = 1; i < parts.length; i++) {
          const vertexPart = parts[i].split("/")[0];
          const vertexIndex = parseInt(vertexPart) - 1;

          if (!isNaN(vertexIndex) && vertexIndex >= 0) {
            faceIndices.push(vertexIndex);
          }
        }
        // Triangulate face (fan triangulation)
        if (faceIndices.length >= 3) {
          for (let i = 1; i < faceIndices.length - 1; i++) {
            indices.push(faceIndices[0], faceIndices[i], faceIndices[i + 1]);
          }
        }
      }
    }
    let topo = new topology(vertices, indices);
    await topo.evalNormals();
    let mtl_ptn = await this.render.createMaterialPattern({
      shaderName: "model_obj",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
    });
    let material = await this.render.createMaterial({
      material_pattern: mtl_ptn,
      albedo: new vec3(1, 1, 0),
      roughness: 0.6,
      metallic: 0.8,
      emission: new vec3(0, 0, 0),
    });
    this.prims = [
      await this.render.createPrimitive({
        material: material,
        topology: topo,
      }),
    ];
  } /** End of 'createOBJ' function */

  /**
   * @info Create GLTF model function
   * @param modelParams: model_descriptor
   * @returns none
   */
  public async createGLTF(modelParams: model_descriptor) {
    const parsedData = await this.parseGLTFSimple("bin/models/" + modelParams.name + "/scene.gltf", modelParams.name);
    
    const topologies: { topo: topology<std | std_ext>, materialIndex: number, hasNormalMap: boolean }[] = [];
    const hasAnyNormalMap = parsedData.meshes.some(mesh => mesh.hasNormalMap);
    
    // Convert parsed data to topologies
    for (let meshIndex = 0; meshIndex < parsedData.meshes.length; meshIndex++) {
      const meshData = parsedData.meshes[meshIndex];
      const hasNormalMap = meshData.hasNormalMap || false;
      const vertices: (std | std_ext)[] = [];
      const transform = meshData.transform || mat4.identity();
      
      for (const vertex of meshData.vertices) {
        const originalPos = new vec3(vertex.position[0], vertex.position[1], vertex.position[2]);
        
        let v: std | std_ext;
        if (hasNormalMap) {
          v = new std_ext(originalPos);
        } else {
          v = new std(originalPos);
        }
        v.t = new vec2(vertex.texCoord[0], vertex.texCoord[1]);
        vertices.push(v);
      }
      
      if (vertices.length > 0) {
        const topo = new topology(vertices, meshData.indices);

        await topo.evalNormals();          
        if (hasNormalMap) {
          await topo.evalTangents();
        } 
        topologies.push({
          topo: topo,
          materialIndex: meshData.materialIndex,
          hasNormalMap: hasNormalMap
        });
        this.meshTransforms.push(transform);
      }
    }
    
    // Create material patterns
    const materialPatterns = new Map<string, material_pattern>();
    const neededAlphaModes = new Set<string>();
    
    if (parsedData.materials) {
      for (const gltfMaterial of parsedData.materials) {
        const pbr = gltfMaterial.pbrMetallicRoughness || {};
        const baseColor = pbr.baseColorFactor || [1, 1, 1, 1];
        const hasTransparency = baseColor[3] < 1.0 || gltfMaterial.alphaMode === 'BLEND' || gltfMaterial.alphaMode === 'MASK';
        const alphaMode = hasTransparency ? (gltfMaterial.alphaMode || 'BLEND') : 'OPAQUE';
        neededAlphaModes.add(alphaMode);
      }
    }
    
    // Create patterns for both std and std_ext if needed
    for (const alphaMode of neededAlphaModes) {
      // Standard pattern
      const stdKey = `std_triangle-list_${alphaMode}`;
      const stdPattern = await this.render.createMaterialPattern({
        shaderName: "model",
        vertexAttributes: std.attributes,
        topology: "triangle-list",
        alphaMode: alphaMode as 'OPAQUE' | 'MASK' | 'BLEND',
      });
      materialPatterns.set(stdKey, stdPattern);
      
      // Extended pattern if needed
      if (hasAnyNormalMap) {
        const extKey = `ext_triangle-list_${alphaMode}`;
        const extPattern = await this.render.createMaterialPattern({
          shaderName: "model_ext",
          vertexAttributes: std_ext.attributes,
          topology: "triangle-list",
          alphaMode: alphaMode as 'OPAQUE' | 'MASK' | 'BLEND',
        });
        materialPatterns.set(extKey, extPattern);
      }
    }

    // Helper function to get texture path
    const getTexturePath = (textureInfo: any) => {
      if (textureInfo && parsedData.textures && parsedData.images) {
        const texture = parsedData.textures[textureInfo.index];
        if (texture && texture.source !== undefined) {
          const image = parsedData.images[texture.source];
          if (image && image.uri) {
            return `bin/models/${modelParams.name}/${image.uri}`;
          }
        }
      }
      return null;
    };

    // Create materials
    const materials = [];
    if (parsedData.materials && parsedData.materials.length > 0) {
      for (const gltfMaterial of parsedData.materials) {
        const pbr = gltfMaterial.pbrMetallicRoughness || {};
        const baseColor = pbr.baseColorFactor || [1, 1, 1, 1];
        const metallic = pbr.metallicFactor !== undefined ? pbr.metallicFactor : 1.0;
        const roughness = pbr.roughnessFactor !== undefined ? pbr.roughnessFactor : 1.0;
        const emission = gltfMaterial.emissiveFactor || [0, 0, 0];
        const alphaMode = gltfMaterial.alphaMode || 'OPAQUE';
        const alphaCutoff = gltfMaterial.alphaCutoff || 0.5;
        const hasNormalTexture = gltfMaterial.normalTexture !== undefined;
        const alpha = baseColor[3] || 1.0;
        
        // Get texture paths
        const albedoTexture = getTexturePath(pbr.baseColorTexture);
        const metallicRoughnessTexture = getTexturePath(pbr.metallicRoughnessTexture);
        const normalTexture = getTexturePath(gltfMaterial.normalTexture);
        const emissiveTexture = getTexturePath(gltfMaterial.emissiveTexture);
        const aoTexture = getTexturePath(gltfMaterial.occlusionTexture);
        
        const key = hasNormalTexture ? `ext_triangle-list_${alphaMode}` : `std_triangle-list_${alphaMode}`;
        const pattern = materialPatterns.get(key) || materialPatterns.values().next().value;
        
        const roughnessTexture = getTexturePath(gltfMaterial.roughnessTexture) || metallicRoughnessTexture;
        const metallicTexture = getTexturePath(gltfMaterial.metallicTexture) || metallicRoughnessTexture;
        
        const finalAlpha = alphaMode === 'MASK' ? alphaCutoff : alpha;
        const material = await this.render.createMaterial({
          material_pattern: pattern,
          albedo: albedoTexture ? albedoTexture : new vec4(baseColor[0], baseColor[1], baseColor[2], finalAlpha),
          roughness: roughnessTexture || roughness,
          metallic: metallicTexture || metallic,
          emissive: emissiveTexture || new vec4(emission[0], emission[1], emission[2], 1.0),
          normalMap: normalTexture,
          ao: aoTexture,
        });
        
        materials.push(material);
      }
    }
    
    // Create default material if needed
    if (materials.length === 0) {
      const defaultPattern = materialPatterns.get('std_triangle-list_OPAQUE') || materialPatterns.values().next().value;
      const defaultMaterial = await this.render.createMaterial({
        material_pattern: defaultPattern,
        albedo: new vec4(0.8, 0.8, 0.8, 1.0),
        roughness: 0.5,
        metallic: 0.2,
        emissive: new vec4(0, 0, 0, 1.0),
      });
      materials.push(defaultMaterial);
    }
    
    // Create primitives
    this.prims = [];
    for (let i = 0; i < topologies.length; i++) {
      const topoData = topologies[i];
      if (topoData.topo.vertexes.length > 0) {
        const material = materials[topoData.materialIndex] || materials[0];
        const primitive = await this.render.createPrimitive({
          material: material,
          topology: topoData.topo,
        });
        
        // Apply transform if not identity
        const transform = this.meshTransforms[i];
        // if (transform && !this.isIdentityMatrix(transform)) {
        //   primitive.transform = transform;
        //   primitive.isTransformChanged = true;
        // }
        
        this.prims.push(primitive);
      }
    }
  } /** End of 'createGLTF' function */



  /**
   * @info Create model function (auto-detect format)
   * @param modelParams: model_descriptor
   * @returns none
   */
  public async create(modelParams: model_descriptor) {
    switch (modelParams.format.toLowerCase()) {
      case "obj":
        await this.createOBJ(modelParams);
        break;
      case "gltf":
      case "glb":
        await this.createGLTF(modelParams);
        break;
      default:
        throw new Error(`Unsupported model format: ${modelParams.format}`);
    }
  } /** End of 'create' function */

  /**
   * @info Destroy model and free all resources
   * @returns none
   */
  public destroy() {
    if (this.prims) {
      for (const prim of this.prims) {
        prim.destroy();
      }
      this.prims = [];
    }
    this.meshTransforms = [];
  } /** End of 'destroy' function */
} /** End of 'model' class */

/** Model manager class */
class model_manager {
  /** #public parameters */
  /**
   * @info Create model function
   * @param modelParams: model_descriptor
   * @returns new model
   */
  public async createModel(modelParams: model_descriptor): Promise<model> {
    let obj = new model();
    await obj.create(modelParams);
    return obj;
  } /** End of 'createModel' function */
} /** End of 'model_manager' class */

/** EXPORTS */
export { model };
export { model_manager };
export { model_descriptor };

/** END OF 'models.ts' FILE */