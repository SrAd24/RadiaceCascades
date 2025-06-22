/* FILE NAME   : input.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** Input class */
class _input {
  // Mouse position and movement
  public mouseX: number = 0;        // Current mouse X position
  public mouseY: number = 0;        // Current mouse Y position
  public mouseDX: number = 0;       // Mouse X delta (movement)
  public mouseDY: number = 0;       // Mouse Y delta (movement)
  public mouseDZ: number = 0;       // Mouse wheel delta
  
  // Accumulated mouse movement for smooth input
  private accumulatedDX: number = 0;
  private accumulatedDY: number = 0;
  private accumulatedDZ: number = 0;
  
  // Keyboard state tracking
  private keysPressed = new Set<string>();      // Currently held keys
  private keysJustPressed = new Set<string>();  // Keys pressed this frame
  
  // Mouse state tracking (0=left, 1=middle, 2=right)
  private mousePressed = [false, false, false];     // Currently held buttons
  private mouseJustPressed = [false, false, false]; // Buttons pressed this frame
  
  // Input change tracking
  public isChanged: boolean = true;                 // Input state changed this frame
  
  private canvasID: HTMLElement;
  private bodyID: HTMLElement;

  /** Constructor - sets up event listeners */
  public constructor() {
    this.canvasID = document.querySelector("#The_only_normal_group_for_the_entire_time_at_the_CGSG")!;
    this.bodyID = document.querySelector("#body")!;
    
    // Keyboard events
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.keysPressed.has(e.code)) {
        this.keysJustPressed.add(e.code);  // Mark as just pressed
        this.keysPressed.add(e.code);      // Mark as held
      }
    });
    
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      this.keysPressed.delete(e.code);     // Remove from held keys
    });
    
    // Mouse button events
    this.bodyID.addEventListener("mousedown", (e: MouseEvent) => {
      if (!this.mousePressed[e.button]) {
        this.mouseJustPressed[e.button] = true;  // Mark as just pressed
        this.mousePressed[e.button] = true;      // Mark as held
      }
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    this.bodyID.addEventListener("mouseup", (e: MouseEvent) => {
      this.mousePressed[e.button] = false;       // Remove from held buttons
    });
    
    // Mouse movement
    this.bodyID.addEventListener("mousemove", (e: MouseEvent) => {
      const deltaX = e.clientX - this.mouseX;    // Calculate delta
      const deltaY = e.clientY - this.mouseY;
      
      this.accumulatedDX += deltaX;              // Accumulate movement
      this.accumulatedDY += deltaY;
      
      this.mouseX = e.clientX;                   // Update position
      this.mouseY = e.clientY;
      if (deltaX !== 0 || deltaY !== 0) this.isChanged = true;
    });
    
    // Mouse wheel - prevent page zoom everywhere
    document.addEventListener("wheel", (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent zoom
      }
    }, { passive: false });
    
    this.canvasID.addEventListener("wheel", (e: WheelEvent) => {
      e.preventDefault();
      this.accumulatedDZ += e.deltaY;
    });
    
    // Prevent context menu and reset on mouse leave
    this.canvasID.addEventListener("contextmenu", (e: Event) => e.preventDefault());
    this.canvasID.addEventListener("mouseleave", () => {
      this.mousePressed.fill(false);
      this.accumulatedDX = this.accumulatedDY = 0;
    });
  }

  /** Check if key is currently held down */
  public isKeyPressed(key: string): boolean { return this.keysPressed.has(key); }
  
  /** Check if key was just pressed this frame */
  public isKeyJustPressed(key: string): boolean { return this.keysJustPressed.has(key); }
  
  /** Check if mouse button is currently held down */
  public isMousePressed(btn = 0): boolean { return this.mousePressed[btn]; }
  
  /** Check if mouse button was just pressed this frame */
  public isMouseJustPressed(btn = 0): boolean { return this.mouseJustPressed[btn]; }
  
  // Convenience getters
  public get leftClick(): boolean { return this.mousePressed[0]; }
  public get rightClick(): boolean { return this.mousePressed[2]; }
  public get leftClickJust(): boolean { return this.mouseJustPressed[0]; }
  
  /** Call at end of each frame to reset "just pressed" states */
  public async response(): Promise<void> {
    this.keysJustPressed.clear();           // Clear just pressed keys
    this.mouseJustPressed.fill(false);     // Clear just pressed buttons
    
    // Transfer accumulated movement to current deltas
    this.mouseDX = this.accumulatedDX;
    this.mouseDY = this.accumulatedDY;
    this.mouseDZ = this.accumulatedDZ;
    
    // Reset accumulated movement
    this.accumulatedDX = this.accumulatedDY = this.accumulatedDZ = 0;
  }
} /** End of '_input' class */

/** Input variable */
const input: _input = new _input();

/** EXPORTS */
export { input };

/** END OF 'input.ts' FILE */
