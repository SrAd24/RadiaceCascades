/* FILE NAME   : uni_control.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 22.06.2025
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
  
  // Smooth camera interpolation for 3rd person
  private targetAzimuth: number = 0;
  private targetElevator: number = 90;
  private targetDist: number = 5;
  private targetAt: vec3 = new vec3(0, 0, 0);
  private smoothFactor: number = 0.1;
  
  // First person camera smoothing
  private fpTargetYaw: number = -90;
  private fpTargetPitch: number = 0;
  private fpSmoothFactor: number = 0.15;
  
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
    
    if (input.isKeyJustPressed("Space"))
      timer.isPause = !timer.isPause;

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
          
          // Initialize target angles
          this.fpTargetYaw = this.fpYaw;
          this.fpTargetPitch = this.fpPitch;
          
          this.updateCameraVectors();
        }
      } else {
        // When switching back to 3rd person, keep current camera state
        ani.cam.setOrientation();
      }
    }
    
    const hasMouseMovement = input.mouseDX !== 0 || input.mouseDY !== 0 || input.mouseDZ !== 0;
    const hasArrowInput = input.isKeyPressed("ArrowLeft") || input.isKeyPressed("ArrowRight") || 
                         input.isKeyPressed("ArrowUp") || input.isKeyPressed("ArrowDown");
    const hasDistanceInput = input.isKeyPressed("Minus") || input.isKeyPressed("Equal");
    
    if (this.isFirstPerson) {
      // Update mouse look only when left click is held
      if (input.leftClick && (input.mouseDX !== 0 || input.mouseDY !== 0)) {
        this.fpTargetYaw += input.mouseDX * 0.4;
        this.fpTargetPitch -= input.mouseDY * 0.4;
        this.fpTargetPitch = Math.max(-89, Math.min(89, this.fpTargetPitch));
      }
      
      // Smooth interpolation for first person camera
      const fpLerpFactor = Math.min(1.0, this.fpSmoothFactor * timer.globalDeltaTime * 60);
      this.fpYaw += (this.fpTargetYaw - this.fpYaw) * fpLerpFactor;
      this.fpPitch += (this.fpTargetPitch - this.fpPitch) * fpLerpFactor;
      
      // Update camera vectors
      this.updateCameraVectors();
      
      // Handle movement (2x speed, 4x with Shift)
      const baseSpeed = 0.1;
      const speed = baseSpeed * (isShift ? 4 : 1);
      let velocity = new vec3(0, 0, 0);
      let hasMovement = false;
      
      if (input.isKeyPressed("KeyW")) { velocity = velocity.add(this.fpFront); hasMovement = true; }
      if (input.isKeyPressed("KeyS")) { velocity = velocity.sub(this.fpFront); hasMovement = true; }
      if (input.isKeyPressed("KeyA")) { velocity = velocity.sub(this.fpRight); hasMovement = true; }
      if (input.isKeyPressed("KeyD")) { velocity = velocity.add(this.fpRight); hasMovement = true; }
      
      // Apply movement
      if (hasMovement) {
        this.fpPosition = this.fpPosition.add(velocity.mulNum(speed));
      }
      
      // Always update camera in first person mode
      ani.cam.set(this.fpPosition, this.fpPosition.add(this.fpFront), this.fpUp);
    } else {
      // Third person camera with smooth interpolation
      if (isShift && (hasMouseMovement || hasArrowInput || hasDistanceInput || input.leftClick || input.rightClick)) {
        ani.cam.setOrientation();
        
        // Always sync target values with current camera state
        if (Math.abs(this.targetAzimuth - ani.cam.azimuth) > 180 || 
            Math.abs(this.targetElevator - ani.cam.elevator) > 90 ||
            this.targetDist < 0.1) {
          this.targetAzimuth = ani.cam.azimuth;
          this.targetElevator = ani.cam.elevator;
          this.targetDist = ani.cam.dist;
          this.targetAt = ani.cam.at;
        }
        
        // Update target values based on input
        this.targetAzimuth += 
          ((input.leftClick ? 1 : 0) *
            timer.globalDeltaTime *
            3 *
            (-5.0 * input.mouseDX) +
          ((input.isKeyPressed("ArrowLeft") ? 1 : 0) * -0.5 +
            (input.isKeyPressed("ArrowRight") ? 1 : 0) * 0.5)) *
            (1 + Number(isCtrl) * 3);

        this.targetElevator += 
          ((input.leftClick ? 1 : 0) *
            timer.globalDeltaTime *
            2 *
            (5.0 * input.mouseDY) +
          ((input.isKeyPressed("ArrowUp") ? 1 : 0) * -0.5 + (input.isKeyPressed("ArrowDown") ? 1 : 0) * 0.5)) *
            (1 + Number(isCtrl) * 3);

        if (this.targetElevator < 0.08) this.targetElevator = 0.08;
        else if (this.targetElevator > 178.9) this.targetElevator = 178.9;

        this.targetDist += 
          -(0.007 * input.mouseDZ) * (1 + Number(isCtrl) * 4) +
          ((input.isKeyPressed("Minus") ? 1 : 0) * 0.1 + (input.isKeyPressed("Equal") ? 1 : 0) * -0.1) *
            (1 + Number(isCtrl) * 3);
        if (this.targetDist < 0.1) this.targetDist = 0.1;
        
        if (input.rightClick) {
          // Update target at position for panning
          const panSpeed = 0.5 + Number(isCtrl) * 3;
          const rightVec = ani.cam.right.mulNum(-input.mouseDX * panSpeed * 0.01);
          const upVec = ani.cam.up.mulNum(input.mouseDY * panSpeed * 0.01);
          this.targetAt = this.targetAt.add(rightVec).add(upVec);
        }
      }

      
      // Always interpolate towards target values for smooth movement
      const deltaTime = timer.globalDeltaTime;
      const lerpFactor = Math.min(1.0, this.smoothFactor * deltaTime * 60); // 60fps normalized
      
      // Smooth interpolation
      ani.cam.azimuth += (this.targetAzimuth - ani.cam.azimuth) * lerpFactor;
      ani.cam.elevator += (this.targetElevator - ani.cam.elevator) * lerpFactor;
      ani.cam.dist += (this.targetDist - ani.cam.dist) * lerpFactor;
      ani.cam.at = ani.cam.at.add(this.targetAt.sub(ani.cam.at).mulNum(lerpFactor));
      
      // Update camera position
      ani.cam.set(
        mat4
          .rotateX(ani.cam.elevator)
          .mul(mat4.rotateY(ani.cam.azimuth))
          .mul(mat4.translate(ani.cam.at))
          .TransformPoint(new vec3(0, ani.cam.dist, 0)),
        ani.cam.at,
        new vec3(0, 1, 0),
      );
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
