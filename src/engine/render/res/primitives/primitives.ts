/* FILE NAME   : primitves.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 17.06.2025
 */

/** IMPORTS */
import { DIContainer, render } from "../../render";
import { material } from "../materials/materials";
import { buffer } from "../buffers/buffers";

/** Primitive interface */
interface primitive_descriptor {
  material: material;
  topology: topology;
  transform?: mat4;
} /** End of 'primitive_descriptor' interface */

/** Primitive class */
class primitive {
  /** #protected parameters */
  /**
   * @info Render getter function
   * @returns render
   */
  protected get render(): render {
    return DIContainer.currentRender;
  } /** End of 'render' function */

  /** #public parameters */
  public topo!: topology;
  public mtl!: material;
  public iBuf!: buffer;
  public vBuf!: buffer;
  public numOfI: number = 0;
  public numOfV: number = 0;
  public instanceCount: number = 0;
  public instanceMatrices: mat4[] = [];
  public transform: mat4;
  public isTransformChanged: boolean = false;

  /**
   * @info Create primitve function
   * @param primitive parameters
   * @returns none
   */
  public async create(primParams: primitive_descriptor) {
    const vdata = primParams.topology.getVertexes();
    const idata = primParams.topology.getIndexes();
    this.topo = primParams.topology;

    this.vBuf = await this.render.createBuffer({
      size: vdata.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      data: vdata,
    });
    this.vBuf.update(vdata);

    this.numOfV = primParams.topology.vertexes.length;
    if ((this.numOfI = idata.length) != 0)
      this.iBuf = await this.render.createBuffer({
        size: idata.byteLength,
        usage: GPUBufferUsage.INDEX,
        data: idata,
      });
    this.instanceCount = 1;
    this.mtl = primParams.material;
    if (primParams.transform) this.setTransform(primParams.transform);
  } /** End of 'create' function */

  public async setTransform(trans: mat4) {
    this.transform = trans;
    this.isTransformChanged = true;
  }

  /**
   * @info Add instance matrices function
   * @param matrix: mat4[] | mat4
   * @returns none
   */
  public addInstance(matrix: mat4[] | mat4) {
    if (Array.isArray(matrix)) {
      this.instanceMatrices = this.instanceMatrices.concat(matrix);
      this.instanceCount = this.instanceMatrices.length;
    } else {
      this.instanceMatrices.push(matrix);
      this.instanceCount = this.instanceMatrices.length;
    }
  } /** End of 'addInstance' function */

  /**
   * @info Destroy primitive and free resources
   * @returns none
   */
  public destroy() {
    if (this.vBuf) {
      this.vBuf.destroy();
    }
    if (this.iBuf) {
      this.iBuf.destroy();
    }
  } /** End of 'destroy' function */
} /** End of 'primitive' class */

/** Primitive manager class */
class primitive_manager {
  /** #public parameters */
  /**
   * @info Create primitive function
   * @param primitive parameters
   * @returns new primitve
   */
  public async createPrimitive(primParams: primitive_descriptor): Promise<primitive> {
    let obj = new primitive();
    await obj.create(primParams);
    return obj;
  } /** End of 'createPrimitive' function */
} /** End of 'primitive_manager' class */

/** EXPORTS */
export { primitive };
export { primitive_manager };
export { primitive_descriptor };

/** END OF 'primitive.ts' FILE */
