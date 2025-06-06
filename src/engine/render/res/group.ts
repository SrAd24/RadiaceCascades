/* FILE NAME   : group.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 03.06.2025
 */

/** Class group */
class group {
  /** #public parameters */
  public groupLayout: any;
  public groupBinding: any;

  /**
   * @info Class constructor
   */
  public constructor() {} /** End of constructor */

  /**
   * @info Initialize group function
   * @param device: any
   * @returns none
   */
  public async createBindGroupLayout(
    device: any,
    binding: any,
    visibility: any,
    type: any,
  ): Promise<any> {
    this.groupLayout = await device.createBindGroupLayout({
      entries: [
        {
          binding: binding,
          visibility: visibility,
          buffer: {
            type: type,
          },
        },
      ],
    });
  } /** End of 'createBindGroupLayout' function */

  /**
   * @info Create group function
   * @param device: any
   * @param binding: any
   * @param visibility: any
   * @param type: any
   * @returns none
   */
  public async createBindGroup(
    device: any,
    binding: any,
    visibility: any,
    type: any,
    data: any,
  ): Promise<any> {
    //await this.createBindGroupLayout(device, binding, visibility, type);

    this.groupBinding = await device.createBindGroup({
      layout: visibility,
      entries: [
        {
          binding: binding,
          resource: {
            buffer: data,
          },
        },
      ],
    });
    return this.groupBinding;
  } /** End of 'createBindGroup' function */
} /** End of 'group' class */

export { group };
/** END OF 'group.ts' FILE */
