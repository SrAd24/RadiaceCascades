// todo #2 #1 @GR1-g write some things about header

/* FILE NAME   : main.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 02.06.2025
 */

/**
 * @info Compile string and number function
 * @param x: string
 * @param y: number 
 * @returns result string
 */
export const a: Function = (x: String, y: number): String => {
  return x + y;
} /** End of 'a' function */

/** 
 * @info Test funciton
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
   * @info Smb function
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
} /** End of 'secondInterface' interface */ 

// first interface variable
let a: firstInterface = {
  /**
   * @info Smb function
   * @param x: number
   * @param y: String
   * @returns none
   */
  func: Function = (x: number, y: String): void => {
  }
} /** End of 'a' function */

/** Class name */
class apiVulkan implements firstInterface {
  /**
   * @info Class constructor
   * @param x: number
   * @param y: String
   * @param z: boolean
   */
  constructor(
    x: number,
    y: String,
    z: boolean
  ) {} /** End of constructor */  

  /**
   * @info Smb function
   * @param x: number
   * @param y: String
   * @returns none
   */
  func: Function = (x: number, y: String): void =>  {

  } /** End of 'func' function */  

  /** #readonly parameters */  
  readonly a;  // Parameter description
  readonly b;  // Parameter description
  /** #public parameters */
  public c;  // Parameter description
  public d;  // Parameter description
  // . . .

} /** End of 'apiVulkan' class */

/**
 * @info Smb generic function
 * @param x: number
 * @param y: Type
 * @returns none
 */
const testFunctionGeneric: Function = <Type>(x: number, y: Type): void => {

} /** End of 'testFunctionGeneric' function */

/** Enum name */
enum enumerate {
  BOOK = 1,   // 
  SOVAR = 2,  // 
  BC,         //
  A           //
} /** End of 'enumerate' enum */

/** END OF 'main.ts' FILE */
