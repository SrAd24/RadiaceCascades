/* FILE NAME   : uni_radiance_cascades.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 21.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";
import { group } from "engine/render/res/groups/groups";
import { texture } from "engine/render/res/textures/textures";

/** Unit control class */
class _uni_radiance_cascades extends unit {
/** Textures */
  private baseColorTexture: any; // Base color texture
  private distanceTexture: any; // Distance texture
  private resultColorTexture: any; // Result color textures
  private intermediateTexture: any; // Intermediate texture
  private frameSize: number = 512;
  private layerCount: number = 1;
  private intervalStart: number = 1;
  private cascadesNumber: number = 8;
  private computeIndicesBuffer: any[] = [];
  private computeBuffer: any;
  private computeBindGroup: any;
  private computeIndicesBindGroup: any[] = [];
  private inputCompute: any;
  private rayMarchingCompute: any;
  private mergeCompute: any;
  private isFirst: boolean = true;
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
    console.log(this.computeBindGroup)

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
    console.log(this.computeIndicesBindGroup)
    this.inputCompute = await ani.createCompute({
      shaderName: "radiance_cascades/input",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.rayMarchingCompute = await ani.createCompute({
      shaderName: "radiance_cascades/ray_marching",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });
    this.mergeCompute = await ani.createCompute({
      shaderName: "radiance_cascades/merge",
      bindGroups: [[this.computeBindGroup], this.computeIndicesBindGroup],
    });


    console.log(this.inputCompute)
  } /** End of 'init' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    let commandEncoder = ani.device.createCommandEncoder();
    
    if (this.isFirst) {
      const distanceData = new Float32Array(
        this.frameSize * this.frameSize * 4 * 3,
      ).fill(2048);

      ani.device.queue.writeTexture(
        { texture: this.distanceTexture.texture },
        distanceData,
        { bytesPerRow: this.frameSize * 4, rowsPerImage: this.frameSize },
        {
          width: this.frameSize,
          height: this.frameSize,
          depthOrArrayLayers: 3,
        },
      );
      this.isFirst = false;
    }

    for (let j: number = 0; j < 1; j++) {
      this.computeBuffer.update(
          new Float32Array([
            this.cascadesNumber - 1,
            this.frameSize,
            this.intervalStart,
            j,
            Number(input.leftClick),
            input.mouseX,
            input.mouseY,
            0,
            1,
            1,
            1,
            1,
            this.layerCount,
            0,
            0,
            0,
          ]),
        );

        this.inputCompute.begin(commandEncoder);
        this.inputCompute.dispatch(
          this.frameSize,
          this.frameSize,
          [0, 1],
        );
        this.inputCompute.end();

        // this.rayMarchingCompute.begin(commandEncoder);
        // for (let i: number = 0; i < this.cascadesNumber; i++)
        //   this.rayMarchingCompute.dispatch(this.frameSize, this.frameSize, [0, i]);
        // this.rayMarchingCompute.end();

        // this.mergeCompute.begin(commandEncoder);
        // for (let i: number = this.cascadesNumber - 2; i >= 0; i--)
        //   this.mergeCompute.dispatch(this.frameSize, this.frameSize, [
        //     0,
        //     i,
        //   ]);

        // this.mergeCompute.dispatch(
        //   2 * Math.pow(2, this.cascadesNumber - 1),
        //   2 * Math.pow(2, this.cascadesNumber - 1),
        //   [0, this.cascadesNumber + 1],
        // );
        // this.mergeCompute.dispatch(
        //   2 * Math.pow(2, this.cascadesNumber - 1),
        //   2 * Math.pow(2, this.cascadesNumber - 1),
        //   [0, this.cascadesNumber],
        // );
        // this.mergeCompute.end();
      }
    ani.queue.submit([commandEncoder.finish()]);
    await ani.queue.onSubmittedWorkDone();
  } /** End of 'responce' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {} /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {} /** End of 'destroy' function */
} /** End of '_uni_control' class */

const uni_radiance_cascades: _uni_radiance_cascades = new _uni_radiance_cascades();

/** EXPORTS */
export { uni_radiance_cascades };

/** END OF 'uni_control.ts' FILE */
