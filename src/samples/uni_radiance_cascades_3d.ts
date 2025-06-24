/* FILE NAME   : uni_radiance_cascades_3d.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";
import { material } from "engine/render/res/materials/materials";
import { topology, std } from "engine/render/res/primitives/topology";
import { vec2 } from "math/mth_vec2";
import { vec3 } from "math/mth_vec3";
import { vec4 } from "math/mth_vec4";
import { mat4 } from "math/mth_mat4";
import { timer } from "engine/input/timer";
import { input } from "engine/input/input";

/** Unit control class */
class _uni_radiance_cascades_3d extends unit {
  /** Textures */
  private baseColorTexture: any; // Base color texture
  private distanceTexture: any; // Distance texture
  private resultColorTexture: any; // Result color textures
  private intermediateTexture: any; // Intermediate texture

  private verticesData: Float32Array = new Float32Array([0, 0, 0, 0]); // Array with data of vertices

  /** Buffers */
  private computeIndicesBuffer: any[] = []; // Buffers with dispatch index
  private computeBuffer: any; // Buffer with base data
  private triangleBuffer: any; // Buffer with triangle data

  /** Radiance cascades constants */
  private frameSize: number = 512; // Frame size
  private layerCount: number = 7; // Layer count
  private intervalStart: number = 1; // Start interval
  private cascadesNumber: number = 8; // Cascade number

  /** Binding group */
  private computeBindGroup: any; // Base binding group
  private computeIndicesBindGroup: any[] = []; // Binding group with indices data
  private fillBindGroup: any; // Binding group with data of fill texture

  /** Compute objects */
  private rayMarchingCompute: any; // Ray marching compute objects
  private mergeCompute: any; // Merge compute objects
  private merge3dCompute: any; // Merge 3d compute

  private model: any; // Model

  private frameIndex: number = 0; // Index of frame

  /** Primitive data */
  private primTopology: any; // Topology of full screen primitive 
  private primBindGroup: any; // Binding group of full screen primitive
  private primPipeline: any; // Pipeline of full screen primitive
  private primMaterial: any; // Material of full screen primitive
  private fullScreenPrim: any; // Full screen primitive

  private cubeVertices: std[] = [
    new std(new vec3(-1, -1, -1), new vec2(0, 0), new vec3(0, 0, -1), new vec4(0)),
    new std(new vec3(1, -1, -1), new vec2(0, 0), new vec3(0, 0, -1), new vec4(0)),
    new std(new vec3(-0.5, 1, -0.5), new vec2(0, 0), new vec3(0, 0, -1), new vec4(0)),
    new std(new vec3(0.5, 1, -0.5), new vec2(0, 0), new vec3(0, 0, -1), new vec4(0)),

    new std(new vec3(-1, -1, 1), new vec2(0, 0), new vec3(0, 0, 1), new vec4(0)),
    new std(new vec3(1, -1, 1), new vec2(0, 0), new vec3(0, 0, 1), new vec4(0)),
    new std(new vec3(-0.5, 1, 0.5), new vec2(0, 0), new vec3(0, 0, 1), new vec4(0)),
    new std(new vec3(0.5, 1, 0.5), new vec2(0, 0), new vec3(0, 0, 1), new vec4(0)),

    new std(new vec3(-1, -1, -1), new vec2(0, 0), new vec3(-1, 0, 0), new vec4(0)),
    new std(new vec3(-0.5, 1, -0.5), new vec2(0, 0), new vec3(-1, 0, 0), new vec4(0)),
    new std( new vec3(-1, -1, 1), new vec2(0, 0), new vec3(-1, 0, 0), new vec4(0)),
    new std(new vec3(-0.5, 1, 0.5), new vec2(0, 0), new vec3(-1, 0, 0), new vec4(0)),

    new std(new vec3(1, -1, -1), new vec2(0, 0), new vec3(1, 0, 0), new vec4(0)),
    new std(new vec3(1, -1, 1), new vec2(0, 0), new vec3(1, 0, 0), new vec4(0)),
    new std(new vec3(0.5, 1, -0.5), new vec2(0, 0), new vec3(1, 0, 0), new vec4(0)),
    new std(new vec3(0.5, 1, 0.5), new vec2(0, 0), new vec3(1, 0, 0), new vec4(0)),

    new std(new vec3(-0.5, 1, -0.5), new vec2(0, 0), new vec3(0, 1, 0), new vec4(0)),
    new std(new vec3(0.5, 1, -0.5), new vec2(0, 0), new vec3(0, 1, 0), new vec4(0)),
    new std(new vec3(-0.5, 1, 0.5), new vec2(0, 0), new vec3(0, 1, 0), new vec4(0)),
    new std(new vec3(0.5, 1, 0.5), new vec2(0, 0), new vec3(0, 1, 0), new vec4(0)),

    new std(new vec3(-1, -1, -1), new vec2(0, 0), new vec3(0, -1, 0), new vec4(0)),
    new std(new vec3(1, -1, -1), new vec2(0, 0), new vec3(0, -1, 0), new vec4(0)),
    new std(new vec3(-1, -1, 1), new vec2(0, 0), new vec3(0, -1, 0), new vec4(0)),
    new std(new vec3(1, -1, 1), new vec2(0, 0), new vec3(0, -1, 0), new vec4(0)),
  ];
  private firstCubeVertices: std[] = [];
  private secondCubeVertices: std[] = [];
  private cubeI: Uint32Array = new Uint32Array([
    0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14, 13,
    15, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23,
  ]);
  private planeVertices: std[] = [
    new std(new vec3(-20, 0, -20), new vec2(0, 0), new vec3(0, 1, 0)),
    new std(new vec3(20, 0, -20), new vec2(1, 0), new vec3(0, 1, 0)),
    new std(new vec3(-20, 0, 20), new vec2(0, 1), new vec3(0, 1, 0)),
    new std(new vec3(20, 0, 20), new vec2(1, 1), new vec3(0, 1, 0)),
  ];
  private planeIndices: Uint32Array = new Uint32Array([0, 1, 2, 1, 2, 3]);

  private basePipeline: any; // Base pipeline
  private baseMaterial: any; // Base material
  private firstCubePrim: any; // First cube primitive
  private secondCubePrim: any; // Second cube primitive
  private modelPrims: any[] = []; // Cow primitive
  private planePrim: any; // Plane primitive

  /**
   * @info Clear radiance cascades textures function
   * @param ani: anim
   * @returns none
   **/
  public async clearRadianceCascadesTextures(ani: anim): Promise<void> {
    const distanceData = new Float32Array(
      this.frameSize * this.frameSize * 4 * this.layerCount,
    ).fill(2048);
    const colorData = new Float32Array(
      this.frameSize * this.frameSize * 4 * 4 * this.layerCount,
    ).fill(0);

    ani.device.queue.writeTexture(
      { texture: this.distanceTexture.texture },
      distanceData,
      { bytesPerRow: this.frameSize * 4, rowsPerImage: this.frameSize },
      {
        width: this.frameSize,
        height: this.frameSize,
        depthOrArrayLayers: this.layerCount,
      },
    );

    ani.device.queue.writeTexture(
      { texture: this.baseColorTexture.texture },
      colorData,
      { bytesPerRow: this.frameSize * 4, rowsPerImage: this.frameSize },
      {
        width: this.frameSize,
        height: this.frameSize,
        depthOrArrayLayers: 4 * this.layerCount,
      },
    );
  } /** End of 'clearRadianceCascadesTextures' function */

  /**
   * @info Fill buffer for texture function.
   * @param newVertices: std
   * @param newIndices: Uint32Array
   */
  public async fillTextureBuffer(newVertices: std, newIndices: Uint32Array) {
    const data = new Float32Array(newIndices.length * 8);

    for (let i: number = 0; i < newIndices.length; i++) {
      data[8 * i] = newVertices[newIndices[i]].p.x;
      data[8 * i + 1] = newVertices[newIndices[i]].p.y;
      data[8 * i + 2] = newVertices[newIndices[i]].p.z;

      data[8 * i + 4] = newVertices[newIndices[i]].c.x;
      data[8 * i + 5] = newVertices[newIndices[i]].c.y;
      data[8 * i + 6] = newVertices[newIndices[i]].c.z;
    }
    let newArray = new Float32Array(data.length + this.verticesData.length);
    newArray.set(this.verticesData, 0);
    newArray.set(data, this.verticesData.length);
    this.verticesData = newArray;
    this.verticesData[0] = (this.verticesData.length - 4) / 8;
  } /** End of 'fillTextureBuffer' function */

  /**
   * @info Create fill binding group function.
   * @param ani: anim
   * @returns none
   */
  public async createFillBindGroup(ani: anim) {
    this.triangleBuffer = await ani.createBuffer({
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      size: Math.max(this.verticesData.length * 4, 16),
      type: "storage",
    });
    this.triangleBuffer.update(this.verticesData);

    let fillBindGroupLayout = ani.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "storage",
          }
        },
      ],
    });

    this.fillBindGroup = await ani.createBindGroup({
      groupIndex: 3,
      layout: fillBindGroupLayout,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.baseColorTexture,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.distanceTexture,
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: this.triangleBuffer,
        },
      ],
    });
  } /** End of 'createFillBindGroup' function */

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {
    this.baseColorTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: 4 * this.layerCount,
        viewDimension: '2d-array',
        access: 'read-write',
    });
    this.distanceTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: this.layerCount + 2 * 3 * this.layerCount,
        viewDimension: '2d-array',
        access: 'read-write',
    });
    this.resultColorTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
        size: { width: this.frameSize, height: this.frameSize },
        layerCount: 4 * (this.cascadesNumber + 1),
        viewDimension: '2d-array',
        access: 'read-write',
    });
    let probeCount: number = 2 * Math.pow(2, this.cascadesNumber - 1);
    this.intermediateTexture = await ani.createTexture({
        format: "r32float",
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
        size: { width: probeCount, height: probeCount },
        layerCount: 3,
        viewDimension: '2d-array',
        access: 'read-write',
    });

    /** Buffers creation */
    for (let i: number = 0; i < this.cascadesNumber + 2; i++) {
      this.computeIndicesBuffer[i] = await ani.createBuffer({
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        size: 16,
        type: "uniform",
      });
      if (i < this.cascadesNumber)
        this.computeIndicesBuffer[i].update(new Float32Array([i, 0, 0, 0]));
      else
        this.computeIndicesBuffer[i].update(
          new Float32Array([i - this.cascadesNumber - 2, 0, 0, 0]),
        );
    }
   this.computeBuffer = await ani.createBuffer({
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      size: 64,
      type: "uniform",
    });

    /** Binding group layout creation */
    let computeBindGroupLayout = ani.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform",
          },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: "r32float",
            access: "read-write",
            viewDimension: "2d-array",
          },
        },
      ],
    });

    let computeIndicesBindGroupLayout = ani.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform",
          },
        },
      ],
    });

    this.computeBindGroup = await ani.createBindGroup({
      groupIndex: 0,
      layout: computeBindGroupLayout,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.baseColorTexture,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.distanceTexture,
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.resultColorTexture,
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: this.computeBuffer,
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          texture: this.intermediateTexture,
        },
      ],
    });

    for (let i: number = 0; i < this.cascadesNumber + 2; i++) {
      this.computeIndicesBindGroup[i] = await ani.createBindGroup({
        groupIndex: 1,
        layout: computeIndicesBindGroupLayout,
        bindings: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: this.computeIndicesBuffer[i],
          },
        ],
      });
    }
    this.rayMarchingCompute = await ani.createCompute({
      shaderName: "radiance_cascades/ray_marching",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.mergeCompute = await ani.createCompute({
      shaderName: "radiance_cascades/merge",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.merge3dCompute = await ani.createCompute({
      shaderName: "radiance_cascades/merge3d",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    })

    this.model = await ani.createModel({
      name: "cow",
      format: "obj",
    });

    for (let i: number = 0; i < this.cubeVertices.length; i++) {
      this.firstCubeVertices[i] = new std(
        this.cubeVertices[i].p,
        this.cubeVertices[i].t,
        this.cubeVertices[i].n,
        this.cubeVertices[i].c,
      );
      this.firstCubeVertices[i].p = new vec3(
        2 * this.firstCubeVertices[i].p.x + 5,
        2 * this.firstCubeVertices[i].p.y + 2,
        2 * this.firstCubeVertices[i].p.z + 5,
      );
      this.firstCubeVertices[i].c = new vec4(0, 1, 1, 0);
    }

    for (let i: number = 0; i < this.cubeVertices.length; i++) {
      this.secondCubeVertices[i] = new std(
        this.cubeVertices[i].p,
        this.cubeVertices[i].t,
        this.cubeVertices[i].n,
        this.cubeVertices[i].c,
      );
      this.secondCubeVertices[i].p = new vec3(
        2 * this.secondCubeVertices[i].p.x - 5,
        2 * this.secondCubeVertices[i].p.y + 2,
        2 * this.secondCubeVertices[i].p.z - 5,
      );
      this.secondCubeVertices[i].c = new vec4(1, 0, 1, 0);
    }
    let firstTop = new topology(this.firstCubeVertices, this.cubeI);
    let secondTop = new topology(this.secondCubeVertices, this.cubeI);
    let planeTop = new topology(this.planeVertices, this.planeIndices);

    for (let i: number = 0; i < this.model.prims.length; i++)
      await this.fillTextureBuffer(this.model.prims[i].topo.vertexes, this.model.prims[i].topo.indexes);
    await this.fillTextureBuffer(this.firstCubeVertices, this.cubeI);
    await this.fillTextureBuffer(this.secondCubeVertices, this.cubeI);
    await this.createFillBindGroup(ani);

    let vertices: (typeof std)[] = [
      new std(new vec3(-1, -1, 0), new vec2(0, 0)),
      new std(new vec3(-1, 1, 0), new vec2(0, 1)),
      new std(new vec3(1, -1, 0), new vec2(1, 0)),
      new std(new vec3(1, 1, 0), new vec2(1, 1)),
    ];
    let inds: number[] = [0, 1, 2, 1, 2, 3];

    this.primTopology = new topology(vertices, inds);

    this.primBindGroup = await ani.createBindGroup({
      groupIndex: 3,
      bindings: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.baseColorTexture,
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: this.distanceTexture
        },
      ],
    });

    this.primPipeline = await ani.createMaterialPattern({
      shaderName: "texture",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
      bindings: this.fillBindGroup,
    });

    this.primMaterial = await ani.createMaterial({
      material_pattern: this.primPipeline,
    });

    this.fullScreenPrim = await ani.createPrimitive({
      material: this.primMaterial,
      topology: this.primTopology,
    });

    this.basePipeline = await ani.createMaterialPattern({
      shaderName: "rc3d",
      vertexAttributes: std.attributes,
      topology: "triangle-list",
      bindings: this.primBindGroup,
    });
    this.baseMaterial = await ani.createMaterial({
      material_pattern: this.basePipeline,
      albedo: new vec3(0.4, 0.4, 0),
      rouhness: 0.3,
      metallic: 0.9,
    });

    this.firstCubePrim = await ani.createPrimitive({
      material: this.baseMaterial,
      topology: firstTop,
    });
    this.secondCubePrim = await ani.createPrimitive({
      material: this.baseMaterial,
      topology: secondTop,
    });
    for (let i: number = 0; i < this.model.prims.length; i++)
      this.modelPrims[i] = await ani.createPrimitive({
        material: this.baseMaterial,
        topology: this.model.prims[i].topo
      });
    this.planePrim = await ani.createPrimitive({
      material: this.baseMaterial,
      topology: planeTop
    })
    console.log("Unit init");
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    if (!this.computeBuffer || !this.rayMarchingCompute || !this.mergeCompute || !this.merge3dCompute) {
      return;
    }
  } /** End of 'responce' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    if (!this.baseColorTexture || !this.distanceTexture || !this.computeBuffer || 
        !this.rayMarchingCompute || !this.mergeCompute || !this.merge3dCompute) {
      return;
    }
    
    if (this.frameIndex == 0) {
      if (!this.fullScreenPrim) return;
      console.log("Start!");
      await this.clearRadianceCascadesTextures(ani);
      ani.draw(this.fullScreenPrim);
      this.frameIndex = 1;
    } else if (this.frameIndex == 1) {
      console.log("ENDDDDDDDDDDDd")

      for (let j: number = 0; j < this.layerCount; j++) {
        let commandEncoder = ani.device.createCommandEncoder();

        await this.computeBuffer.update(
          new Float32Array([
            this.cascadesNumber - 1, this.frameSize, this.intervalStart, j,
            Number(input.leftClick), 0, 0, 0,
            1, 1, 0, 10,
            this.layerCount, 0, 0, 0,
          ]),
        );

        this.rayMarchingCompute.begin(commandEncoder);
        for (let i: number = 0; i < this.cascadesNumber; i++)
          this.rayMarchingCompute.dispatch(this.frameSize, this.frameSize, [0, i]);
        this.rayMarchingCompute.end();

        this.mergeCompute.begin(commandEncoder);
        for (let i: number = this.cascadesNumber - 2; i >= 0; i--)
          this.mergeCompute.dispatch(this.frameSize, this.frameSize, [0, i]);

        this.mergeCompute.dispatch(
          2 * Math.pow(2, this.cascadesNumber - 1),
          2 * Math.pow(2, this.cascadesNumber - 1),
          [0, this.cascadesNumber + 1],
        );
        this.mergeCompute.dispatch(
          2 * Math.pow(2, this.cascadesNumber - 1),
          2 * Math.pow(2, this.cascadesNumber - 1),
          [0, this.cascadesNumber],
        );
        this.mergeCompute.end();

        ani.queue.submit([commandEncoder.finish()]);
        await ani.queue.onSubmittedWorkDone();
      }

      let commandEncoder = ani.device.createCommandEncoder();

      this.merge3dCompute.begin(commandEncoder);
      this.merge3dCompute.dispatch(
        this.frameSize, this.frameSize, [0, 0])
      this.merge3dCompute.end();

      ani.queue.submit([commandEncoder.finish()]);
      await ani.queue.onSubmittedWorkDone();

      this.frameIndex = 2;
    } else {
      if (this.firstCubePrim) ani.draw(this.firstCubePrim);
      if (this.secondCubePrim) ani.draw(this.secondCubePrim);
      for (let i: number = 0; i < this.modelPrims.length; i++) {
        if (this.modelPrims[i]) ani.draw(this.modelPrims[i]);
      }
      if (this.planePrim) ani.draw(this.planePrim);
    }
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {
    // Destroy textures
    if (this.baseColorTexture) {
      this.baseColorTexture.destroy();
      this.baseColorTexture = null;
    }
    if (this.distanceTexture) {
      this.distanceTexture.destroy();
      this.distanceTexture = null;
    }
    if (this.resultColorTexture) {
      this.resultColorTexture.destroy();
      this.resultColorTexture = null;
    }
    if (this.intermediateTexture) {
      this.intermediateTexture.destroy();
      this.intermediateTexture = null;
    }
    
    // Destroy buffers
    this.computeIndicesBuffer.forEach(buffer => {
      if (buffer) buffer.destroy();
    });
    this.computeIndicesBuffer = [];
    
    if (this.computeBuffer) {
      this.computeBuffer.destroy();
      this.computeBuffer = null;
    }
    if (this.triangleBuffer) {
      this.triangleBuffer.destroy();
      this.triangleBuffer = null;
    }
    
    // Destroy model
    if (this.model) {
      this.model.destroy();
      this.model = null;
    }
    
    // Destroy primitives
    if (this.fullScreenPrim) {
      this.fullScreenPrim.destroy();
      this.fullScreenPrim = null;
    }
    if (this.firstCubePrim) {
      this.firstCubePrim.destroy();
      this.firstCubePrim = null;
    }
    if (this.secondCubePrim) {
      this.secondCubePrim.destroy();
      this.secondCubePrim = null;
    }
    if (this.planePrim) {
      this.planePrim.destroy();
      this.planePrim = null;
    }
    
    this.modelPrims.forEach(prim => {
      if (prim) prim.destroy();
    });
    this.modelPrims = [];
    
    // Reset all properties
    this.verticesData = new Float32Array([0, 0, 0, 0]);
    this.computeBindGroup = null;
    this.computeIndicesBindGroup = [];
    this.fillBindGroup = null;
    this.rayMarchingCompute = null;
    this.mergeCompute = null;
    this.merge3dCompute = null;
    this.frameIndex = 0;
    this.primTopology = null;
    this.primBindGroup = null;
    this.primPipeline = null;
    this.primMaterial = null;
    this.basePipeline = null;
    this.baseMaterial = null;
    this.firstCubeVertices = [];
    this.secondCubeVertices = [];
  } /** End of 'destroy' function */
} /** End of '_uni_radiance_cascades_3d' class */

const uni_radiance_cascades_3d: _uni_radiance_cascades_3d = new _uni_radiance_cascades_3d();

/** EXPORTS */
export { uni_radiance_cascades_3d };

/** END OF 'uni_radiance_cascades_3d.ts' FILE */
