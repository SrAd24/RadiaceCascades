/* FILE NAME   : uni_control.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit control class */
class _uni_control extends unit {
  /** #private parameters */
  private isFirstPerson: boolean = false;
  private fpYaw: number = -90;  // Start looking forward
  private fpPitch: number = 0;
  private fpPosition: vec3 = new vec3(0, 0, 0);
  private fpFront: vec3 = new vec3(0, 0, -1);
  private fpUp: vec3 = new vec3(0, 1, 0);
  private fpRight: vec3 = new vec3(1, 0, 0);
  private fpWorldUp: vec3 = new vec3(0, 1, 0);
  
  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {} /** End of 'init' function */

  /**
   * @info Response function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
    const isShift = input.isKeyPressed("ShiftLeft") || input.isKeyPressed("ShiftRight");
    const isCtrl = input.isKeyPressed("ControlLeft") || input.isKeyPressed("ControlRight");
    
    // Toggle camera mode with F
    if (input.isKeyJustPressed("KeyF")) {
      this.isFirstPerson = !this.isFirstPerson;
      if (this.isFirstPerson) {
        // Initialize first person camera from current view direction
        this.fpPosition = ani.cam.loc;
        
        // Calculate current view direction
        const currentDir = ani.cam.at.sub(ani.cam.loc);
        const len = currentDir.length();
        if (len > 0) {
          const dir = new vec3(currentDir.x / len, currentDir.y / len, currentDir.z / len);
          
          // Convert direction to yaw/pitch angles
          this.fpYaw = Math.atan2(dir.z, dir.x) * 180 / Math.PI;
          this.fpPitch = Math.asin(dir.y) * 180 / Math.PI;
          
          this.updateCameraVectors();
        }
      }
    }
    
    const hasMouseMovement = input.mouseDX !== 0 || input.mouseDY !== 0 || input.mouseDZ !== 0;
    const hasArrowInput = input.isKeyPressed("ArrowLeft") || input.isKeyPressed("ArrowRight") || 
                         input.isKeyPressed("ArrowUp") || input.isKeyPressed("ArrowDown");
    const hasDistanceInput = input.isKeyPressed("Minus") || input.isKeyPressed("Equal");
    
    if (this.isFirstPerson) {
      input.isChanged = true;
      // Update mouse look (6x sensitivity)
      if (input.leftClick) {
        this.fpYaw += input.mouseDX * 0.6;
        this.fpPitch -= input.mouseDY * 0.6;
        this.fpPitch = Math.max(-89, Math.min(89, this.fpPitch));
        
        // Update camera vectors
        this.updateCameraVectors();
      }
      
      // Handle movement (2x speed, 4x with Shift)
      const baseSpeed = 0.1;
      const speed = baseSpeed * (isShift ? 4 : 1);
      let velocity = new vec3(0, 0, 0);
      
      if (input.isKeyPressed("KeyW")) velocity = velocity.add(this.fpFront);
      if (input.isKeyPressed("KeyS")) velocity = velocity.sub(this.fpFront);
      if (input.isKeyPressed("KeyA")) velocity = velocity.sub(this.fpRight);
      if (input.isKeyPressed("KeyD")) velocity = velocity.add(this.fpRight);
      
      // Apply movement
      if (velocity.length() > 0) {
        this.fpPosition = this.fpPosition.add(velocity.mulNum(speed));
      }
      
      // Update camera
      ani.cam.set(this.fpPosition, this.fpPosition.add(this.fpFront), this.fpUp);
    } else {
      // Third person camera (original code)
      if (isShift && (hasMouseMovement || hasArrowInput || hasDistanceInput || input.leftClick || input.rightClick)) {

        ani.cam.setOrientation();
        input.isChanged = true;
        ani.cam.azimuth +=
          ((input.leftClick ? 1 : 0) *
            timer.globalDeltaTime *
            3 *
            (-5.0 * input.mouseDX) +
          ((input.isKeyPressed("ArrowLeft") ? 1 : 0) * -0.5 +
            (input.isKeyPressed("ArrowRight") ? 1 : 0) * 0.5)) *
            (1 + Number(isCtrl) * 3);

        ani.cam.elevator +=
          ((input.leftClick ? 1 : 0) *
            timer.globalDeltaTime *
            2 *
            (5.0 * input.mouseDY) +
          ((input.isKeyPressed("ArrowUp") ? 1 : 0) * -0.5 + (input.isKeyPressed("ArrowDown") ? 1 : 0) * 0.5)) *
            (1 + Number(isCtrl) * 3);

        if (ani.cam.elevator < 0.08) ani.cam.elevator = 0.08;
        else if (ani.cam.elevator > 178.9) ani.cam.elevator = 178.9;

        ani.cam.dist +=
          -(0.007 * input.mouseDZ) * (1 + Number(isCtrl) * 4) +
          ((input.isKeyPressed("Minus") ? 1 : 0) * 0.1 + (input.isKeyPressed("Equal") ? 1 : 0) * -0.1) *
            (1 + Number(isCtrl) * 3);
        if (ani.cam.dist < 0.1) ani.cam.dist = 0.1;

        ani.cam.set(
          mat4
            .rotateX(ani.cam.elevator)
            .mul(mat4.rotateY(ani.cam.azimuth))
            .mul(mat4.translate(ani.cam.at))
            .TransformPoint(new vec3(0, ani.cam.dist, 0)),
          ani.cam.at,
          new vec3(0, 1, 0),
        );
        if (input.rightClick) {
          ani.cam.mouseParallel();
          ani.cam.set(ani.cam.loc, ani.cam.at);
        }
      }
    }
  } /** End of 'response' function */

  /**
   * @info Update camera vectors from yaw and pitch
   * @returns none
   */
  private updateCameraVectors(): void {
    // Calculate front vector
    const yawRad = this.fpYaw * Math.PI / 180;
    const pitchRad = this.fpPitch * Math.PI / 180;
    
    this.fpFront = new vec3(
      Math.cos(yawRad) * Math.cos(pitchRad),
      Math.sin(pitchRad),
      Math.sin(yawRad) * Math.cos(pitchRad)
    );
    
    // Calculate right vector (cross product of front and world up)
    const frontCrossUp = new vec3(
      this.fpFront.y * this.fpWorldUp.z - this.fpFront.z * this.fpWorldUp.y,
      this.fpFront.z * this.fpWorldUp.x - this.fpFront.x * this.fpWorldUp.z,
      this.fpFront.x * this.fpWorldUp.y - this.fpFront.y * this.fpWorldUp.x
    );
    const rightLength = Math.sqrt(frontCrossUp.x * frontCrossUp.x + frontCrossUp.y * frontCrossUp.y + frontCrossUp.z * frontCrossUp.z);
    this.fpRight = new vec3(frontCrossUp.x / rightLength, frontCrossUp.y / rightLength, frontCrossUp.z / rightLength);
    
    // Calculate up vector (cross product of right and front)
    const rightCrossFront = new vec3(
      this.fpRight.y * this.fpFront.z - this.fpRight.z * this.fpFront.y,
      this.fpRight.z * this.fpFront.x - this.fpRight.x * this.fpFront.z,
      this.fpRight.x * this.fpFront.y - this.fpRight.y * this.fpFront.x
    );
    const upLength = Math.sqrt(rightCrossFront.x * rightCrossFront.x + rightCrossFront.y * rightCrossFront.y + rightCrossFront.z * rightCrossFront.z);
    this.fpUp = new vec3(rightCrossFront.x / upLength, rightCrossFront.y / upLength, rightCrossFront.z / upLength);
  } /** End of 'updateCameraVectors' function */

  /**
   * @info Render function
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {} /** End of 'render' function */

  /**
   * @info Destroy function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {} /** End of 'destroy' function */
} /** End of '_uni_control' class */

const uni_control: _uni_control = new _uni_control();

/** EXPORTS */
export { uni_control };

/** END OF 'uni_control.ts' FILE */
