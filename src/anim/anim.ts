/* FILE NAME   : anim.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 05.06.2025
 */

/** IMPORTS */
import { dict } from './units/dictionary.ts';
import { render } from '../engine/render/render.ts';

/** Animation class */
class anim {
    /** #private parameters */
    private rnd: render;

    /** #public parametes */
    public constructor() {
    } /** End of constructor */

    /**
     * @info render initialize function
     * @returns none
     */
    public async init(): Promise<any> {
      // initialize render
      console.log("Render initialization started");
      await this.rnd.init();
      console.log("Render initialization ended");

      // initialize units
      console.log("Unit initialization started");
      dict.units.forEach((unit, index) => {
        await unit.init(this.rnd);
      });
      console.log("Unit initialization ended");
    } /** End of 'init' function */
    
    /**
     * @info render function
     * @returns none
     */
    public async render(): Promise<any> {
      dict.units.forEach((unit, index) => {
        await unit.render(this.rnd);
      });
    } /** Ebd of 'render' function */

    /**
     * @info response function
     * @returns none
     */
    public async response(): Promise<any> {
      dict.units.forEach((unit, index) => {
        await unit.response(this.rnd);
      });
    } /** End of 'response' function */

    /**
     * @info destroy function
     * @returns none
     */
    public async destroy(): Promise<any> {       
      dict.units.forEach((unit, index) => {
        await unit.destroy(this.rnd);
      });
    } /** End of 'destroy' function */   
} /** End of 'anim' class */

/** END OF 'anim.ts' FILE */
