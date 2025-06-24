/* FILE NAME   : uni_test.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 16.06.2025
 */

/** IMPORTS */
import { anim, unit } from "engine/anim/anim";

/** Unit test class */
class _uni_test extends unit {
  private mdl: any;
  private modelSelector: HTMLSelectElement | null = null;
  private currentModel = { name: "girl", format: "gltf" };
  private animInstance: anim | null = null;
  private mainPanel: HTMLDivElement | null = null;
  private isPanelVisible = true;
  private transform = { rotX: 0, rotY: 0, rotZ: 0, scale: 0.2, posX: 0, posY: 0, posZ: 0 };
  private autoRotate = { x: false, y: false, z: false, speedX: 1, speedY: 1, speedZ: 1 };

  /** #public parameters */
  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async init(ani: anim): Promise<any> {
    this.animInstance = ani;
    this.createMainPanel();
    await this.loadModel(ani);
  } /** End of 'init' function */



  private createMainPanel() {
    this.mainPanel = document.createElement('div');
    this.mainPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 16px;
      background: rgba(0,0,0,0.9);
      border-radius: 12px;
      color: white;
      font-family: 'Segoe UI', sans-serif;
      font-size: 12px;
      backdrop-filter: blur(10px);
      min-width: 250px;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    // Collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.innerHTML = '−';
    collapseBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    `;
    
    const content = document.createElement('div');
    content.id = 'panelContent';
    
    collapseBtn.addEventListener('click', () => {
      this.isPanelVisible = !this.isPanelVisible;
      collapseBtn.innerHTML = this.isPanelVisible ? '−' : '+';
      content.style.display = this.isPanelVisible ? 'block' : 'none';
      this.mainPanel!.style.minWidth = this.isPanelVisible ? '250px' : '50px';
    });
    
    // Model selector section
    const modelDiv = document.createElement('div');
    modelDiv.style.cssText = 'margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #444;';
    const modelTitle = document.createElement('div');
    modelTitle.textContent = 'MODEL';
    modelTitle.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #667eea;';
    modelDiv.appendChild(modelTitle);
    
    this.modelSelector = document.createElement('select');
    this.modelSelector.style.cssText = `
      width: 100%;
      padding: 8px;
      background: #333;
      color: white;
      border: 1px solid #555;
      border-radius: 6px;
      font-size: 12px;
    `;
    
    const models = [
      { name: "girl", format: "gltf" },
      { name: "car", format: "gltf" },
      { name: "car2", format: "gltf" },
      { name: "knight", format: "gltf" },
      { name: "last", format: "gltf" },
      { name: "cow", format: "obj" },
      { name: "monkey", format: "obj" }
    ];
    
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = JSON.stringify(model);
      option.textContent = `${model.name.toUpperCase()} • ${model.format.toUpperCase()}`;
      this.modelSelector!.appendChild(option);
    });
    
    this.modelSelector.addEventListener('change', async () => {
      this.currentModel = JSON.parse(this.modelSelector!.value);
      if (this.animInstance) {
        await this.loadModel(this.animInstance);
      }
    });
    
    modelDiv.appendChild(this.modelSelector);
    
    // Model info section
    const infoDiv = document.createElement('div');
    infoDiv.id = 'modelInfo';
    infoDiv.style.cssText = 'margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #444;';
    
    // Auto rotation section
    const rotationDiv = document.createElement('div');
    rotationDiv.style.cssText = 'margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #444;';
    const rotationTitle = document.createElement('div');
    rotationTitle.textContent = 'AUTO ROTATION';
    rotationTitle.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #667eea;';
    rotationDiv.appendChild(rotationTitle);
    
    ['X', 'Y', 'Z'].forEach(axis => {
      const div = document.createElement('div');
      div.style.cssText = 'margin-bottom: 8px; display: flex; align-items: center; gap: 8px;';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.cssText = 'accent-color: #667eea;';
      checkbox.addEventListener('change', () => {
        (this.autoRotate as any)[axis.toLowerCase()] = checkbox.checked;
      });
      
      const label = document.createElement('label');
      label.textContent = axis;
      label.style.cssText = 'font-weight: 500; width: 20px;';
      
      const speedInput = document.createElement('input');
      speedInput.type = 'range';
      speedInput.min = '0.1';
      speedInput.max = '3';
      speedInput.step = '0.1';
      speedInput.value = '1';
      speedInput.style.cssText = 'flex: 1; accent-color: #667eea;';
      speedInput.addEventListener('input', () => {
        (this.autoRotate as any)[`speed${axis}`] = parseFloat(speedInput.value);
      });
      
      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(speedInput);
      rotationDiv.appendChild(div);
    });
    
    // Transform controls
    const controlsDiv = document.createElement('div');
    const controlsTitle = document.createElement('div');
    controlsTitle.textContent = 'TRANSFORM';
    controlsTitle.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #667eea;';
    controlsDiv.appendChild(controlsTitle);
    
    const controls = [
      { label: 'Rot X', key: 'rotX', min: -180, max: 180 },
      { label: 'Rot Y', key: 'rotY', min: -180, max: 180 },
      { label: 'Rot Z', key: 'rotZ', min: -180, max: 180 },
      { label: 'Scale', key: 'scale', min: 0.1, max: 2, step: 0.1 },
      { label: 'Pos X', key: 'posX', min: -5, max: 5, step: 0.1 },
      { label: 'Pos Y', key: 'posY', min: -5, max: 5, step: 0.1 },
      { label: 'Pos Z', key: 'posZ', min: -5, max: 5, step: 0.1 }
    ];
    
    controls.forEach(ctrl => {
      const div = document.createElement('div');
      div.style.cssText = 'margin-bottom: 6px; display: flex; align-items: center; gap: 8px;';
      
      const label = document.createElement('label');
      label.textContent = ctrl.label;
      label.style.cssText = 'font-weight: 500; width: 50px; font-size: 11px;';
      
      const input = document.createElement('input');
      input.type = 'range';
      input.min = ctrl.min.toString();
      input.max = ctrl.max.toString();
      input.step = (ctrl.step || 1).toString();
      input.value = (this.transform as any)[ctrl.key].toString();
      input.style.cssText = 'flex: 1; accent-color: #667eea;';
      
      const value = document.createElement('span');
      value.textContent = input.value;
      value.style.cssText = 'color: #aaa; width: 40px; text-align: right; font-size: 11px;';
      
      input.addEventListener('input', () => {
        (this.transform as any)[ctrl.key] = parseFloat(input.value);
        value.textContent = input.value;
      });
      
      div.appendChild(label);
      div.appendChild(input);
      div.appendChild(value);
      controlsDiv.appendChild(div);
    });
    
    content.appendChild(modelDiv);
    content.appendChild(infoDiv);
    content.appendChild(rotationDiv);
    content.appendChild(controlsDiv);
    
    this.mainPanel.appendChild(collapseBtn);
    this.mainPanel.appendChild(content);
    document.body.appendChild(this.mainPanel);
  }

  private updateModelInfo() {
    const infoDiv = document.getElementById('modelInfo');
    if (!infoDiv || !this.mdl) return;
    
    let triangleCount = 0;
    let indexCount = 0;
    let vertexCount = 0;
    let primitiveCount = 0;
    
    console.log('Model structure:', this.mdl);
    
    // Try different possible structures
    if (this.mdl.prims) {
      primitiveCount = this.mdl.prims.length;
      for (let i = 0; i < this.mdl.prims.length; i++) {
        const prim = this.mdl.prims[i];
        if (prim.numOfV) vertexCount += prim.numOfV;
        if (prim.numOfI) triangleCount += Math.floor(prim.numOfI / 3);
        else triangleCount += Math.floor(prim.numOfV / 3);
        if (prim.numOfI) indexCount += prim.numOfI;
      }
      // this.mdl.prims.forEach((prim: any) => {
      //   if (prim.numVertices) vertexCount += prim.numVertices;
      //   if (prim.numIndices) triangleCount += Math.floor(prim.numIndices / 3);
      //   if (prim.vertexArray && prim.vertexArray.letngth) vertexCount += prim.vertexArray.length / 3;
      //   if (prim.indexArray && prim.indexArray.length) triangleCount += Math.floor(prim.indexArray.length / 3);
      // });
    }
    
    infoDiv.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #667eea;">MODEL INFO</div>
      <div style="font-size: 11px; line-height: 1.4;">
        <div>Name: ${this.currentModel.name.toUpperCase()}</div>
        <div>Format: ${this.currentModel.format.toUpperCase()}</div>
        <div>Triangles: ${triangleCount.toLocaleString()}</div>
        <div>Vertices: ${vertexCount.toLocaleString()}</div>
        <div>Indices: ${indexCount.toLocaleString()}</div>
        <div>Primitives: ${primitiveCount}</div>
      </div>
    `;
  }

  private async loadModel(ani: anim) {
    if (this.mdl) {
      this.mdl.destroy();
    }
    this.mdl = await ani.createModel(this.currentModel);
    this.updateModelInfo();
  }

  /**
   * @info Init function  
   * @param ani: anim
   * @returns none
   */
  public async render(ani: anim): Promise<any> {
    // Update auto rotation
    if (this.autoRotate.x) this.transform.rotX += this.autoRotate.speedX * timer.time / 20;
    if (this.autoRotate.y) this.transform.rotY += this.autoRotate.speedY * timer.time / 20;
    if (this.autoRotate.z) this.transform.rotZ += this.autoRotate.speedZ * timer.time / 20;
    
    const matrix = mat4.translate(new vec3(this.transform.posX, this.transform.posY, this.transform.posZ))
      .mul(mat4.rotateX(this.transform.rotX))
      .mul(mat4.rotateY(this.transform.rotY))
      .mul(mat4.rotateZ(this.transform.rotZ))
      .mul(mat4.scale(new vec3(this.transform.scale)));
    if (this.mdl)
      await ani.drawModel(this.mdl, matrix);
  } /** End of 'render' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async response(ani: anim): Promise<any> {
  } /** End of 'response' function */

  /**
   * @info Init function
   * @param ani: anim
   * @returns none
   */
  public async destroy(ani: anim): Promise<any> {
    // Destroy model resources
    if (this.mdl) {
      this.mdl.destroy();
      this.mdl = null;
    }
    
    // Remove UI elements
    if (this.mainPanel) {
      document.body.removeChild(this.mainPanel);
      this.mainPanel = null;
    }
    
    // Reset all properties
    this.modelSelector = null;
    this.currentModel = { name: "girl", format: "gltf" };
    this.animInstance = null;
    this.transform = { rotX: 0, rotY: 0, rotZ: 0, scale: 0.2, posX: 0, posY: 0, posZ: 0 };
    this.autoRotate = { x: false, y: false, z: false, speedX: 1, speedY: 1, speedZ: 1 };
    this.isPanelVisible = true;
  } /** End of 'destroy' function */
}

// Test unit
const uni_test: _uni_test = new _uni_test();

/** EXPORTS */
export { uni_test };

/** END OF 'test_unit.ts' FILE */
