// todo @GR1-g write some things about header

/* FILE NAME   : main.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/**
 * Compile string and number
 * @param x: string
 * @param y: number 
 * @returns result string
 */
export const a: Function = (x: String, y: number): String => {
  return x + y;
} /** End of 'a' function */

/** 
 * Test funciton
 * @param abc: String
 * @param bca: number
 * @param kal: boolean
 * @returns none
 */
const b: Funciton = (abc: String, bca: number, kal: boolean): void => {

} /** End of 'b' function */  

/** Interface name */
interface firstInterface {
    /**
     * Smb function
     * @param x: number
     * @param y: String
     * @returns none
     */
    expampleFunc (x: number, y: String): void;

    a: number; // a number
} /** End of 'firstInterface' interface */

/** Interface name */
interface secondInterface extends firstInterface {
  // . . .
}

// first interface variable
let a: firstInterface = {
    /**
     * Smb function
     * @param x: number
     * @param y: String
     */
    func: Function = (x: number, y: String): void => {
    }
} /** End of 'a' function */

/** Class name */
class apiVulkan {
  /**
   * Class constructor
   * @param x 
   * @param y 
   * @param z 
   */
  constructor(
    x: number,
    y: String,
    z: boolean
  ) {} /** End of constructor */  

  /** #readonly parameters */  
  readonly a;  // Parameter description@
  readonly b;  // Parameter description
  /** #public parameters */
  public c;  // Parameter description
  public d;  // Parameter description
  // . . .

} /** End of 'apiVulkan' class */

/**
 * Smb generic function
 * @param x: number
 * @param y: Type
 * @returns none
 */
const testFunctionGeneric: Function = <Type>(x: number, y: Type): void => {

} /** End of 'testFunctionGeneric' function */

/** END OF 'main.ts' FILE */
