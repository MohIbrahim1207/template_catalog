class ThreeViewer {
  constructor(container, canvas, hotspotOverlay) {
    this.container = container;
    this.canvas = canvas;
    this.hotspotOverlay = hotspotOverlay;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.modelGroup = null;
    
    this.productId = '';
    this.isWireframe = false;
    this.autoRotate = true;
    this.explodeRatio = 0.0; // 0.0 (assembled) to 1.0 (exploded)
    
    // Physics particles inside 3D model
    this.flowParticles = null;
    this.particleCount = 100;
    
    this.hotspots = [];
    this.currentExplodeVal = 0;
    this.animationFrameId = null;
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent background to blend with glassmorphism UI
    
    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.camera.position.set(4, 3, 5);
    
    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    
    // 4. OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 1.8; // Don't allow rotating fully underneath
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    
    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);
    
    const dirLight2 = new THREE.DirectionalLight(0x0a84ff, 0.3); // Sleek blue key fill
    dirLight2.position.set(-5, -3, -5);
    this.scene.add(dirLight2);
    
    // Glowing point light at core
    const pointLight = new THREE.PointLight(0x64d2ff, 1.2, 5);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
    
    // 6. Model Group
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);
    
    // Grid Helper floor (faded tech styling)
    const gridHelper = new THREE.GridHelper(10, 20, 0x0a84ff, 0x1e1e24);
    gridHelper.position.y = -1.6;
    this.scene.add(gridHelper);
    
    this.resize();
  }
  
  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  setProduct(id) {
    this.productId = id;
    this.explodeRatio = 0.0;
    this.currentExplodeVal = 0.0;
    
    // Clear previous models
    while(this.modelGroup.children.length > 0) { 
      const obj = this.modelGroup.children[0];
      this.modelGroup.remove(obj); 
    }
    
    this.hotspots = [];
    this.hotspotOverlay.innerHTML = '';
    
    // Build procedural 3D model
    this.buildProceduralModel();
    
    // Add product-specific hotspots
    this.createHotspots();
    
    // Reset camera position
    this.camera.position.set(4, 3, 5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }
  
  buildProceduralModel() {
    const id = this.productId;
    const group = this.modelGroup;
    
    // Shared Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x8899a6,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: this.isWireframe
    });
    
    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.3,
      wireframe: this.isWireframe
    });
    
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x24272b,
      metalness: 0.9,
      roughness: 0.4,
      wireframe: this.isWireframe
    });
    
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9, // glass physical transmission
      ior: 1.5,
      thickness: 0.2,
      wireframe: this.isWireframe,
      depthWrite: false
    });
    
    // Dynamic color based on sector
    let particleColor = 0x0a84ff;
    if (id === 'catalyst-filter' || id === 'thermal-reactor' || id === 'acid-column') particleColor = 0xbf5af2;
    if (id === 'strainer' || id === 'ultrafiltration') particleColor = 0x30d158;
    
    const flowGlowMat = new THREE.MeshBasicMaterial({
      color: particleColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Build specific machinery based on product ID
    if (id === 'catalyst-filter' || id === 'thermal-reactor') {
      // 1. Catalyst Filter Reactor Vessel
      
      // Main Outercasing (Exploded: split horizontally or slides up)
      const outerCasingGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 32, 1, true);
      const outerCasing = new THREE.Mesh(outerCasingGeo, glassMat);
      outerCasing.name = 'casing';
      group.add(outerCasing);
      
      // Upper Flanged dome cap
      const domeCapGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
      const domeCapTopGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeCap = new THREE.Group();
      domeCap.name = 'cap';
      
      const capFlange = new THREE.Mesh(domeCapGeo, metalMat);
      capFlange.position.y = 1.1;
      domeCap.add(capFlange);
      
      const capTop = new THREE.Mesh(domeCapTopGeo, metalMat);
      capTop.position.y = 1.2;
      domeCap.add(capTop);
      group.add(domeCap);
      
      // Bottom support ring
      const baseRingGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.3, 32);
      const baseRing = new THREE.Mesh(baseRingGeo, darkMetalMat);
      baseRing.position.y = -1.25;
      baseRing.name = 'base';
      group.add(baseRing);
      
      // Internal core catalyst filter element (Mesh cylinder inside)
      const filterMeshGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16);
      const filterMeshMat = new THREE.MeshStandardMaterial({
        color: 0xbf5af2,
        roughness: 0.5,
        metalness: 0.9,
        wireframe: true // Mesh screen grid look
      });
      const filterCore = new THREE.Mesh(filterMeshGeo, filterMeshMat);
      filterCore.name = 'core';
      filterCore.position.y = 0;
      group.add(filterCore);
      
      // Inlet / Outlet piping connectors
      const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
      pipeGeo.rotateZ(Math.PI / 2);
      
      const inletPipe = new THREE.Mesh(pipeGeo, metalMat);
      inletPipe.position.set(-1.0, -0.4, 0);
      inletPipe.name = 'inlet';
      group.add(inletPipe);
      
      const outletPipe = new THREE.Mesh(pipeGeo, metalMat);
      outletPipe.position.set(1.0, 0.4, 0);
      outletPipe.name = 'outlet';
      group.add(outletPipe);
      
    } else if (id === 'gas-separator' || id === 'acid-column') {
      // 2. High-Pressure Gas Separator Vessel
      
      // Outer steel pressure vessel (dome ends)
      const shellGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32);
      const shell = new THREE.Mesh(shellGeo, glassMat);
      shell.name = 'casing';
      group.add(shell);
      
      const domeTGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
      const domeT = new THREE.Mesh(domeTGeo, darkMetalMat);
      domeT.position.y = 0.9;
      domeT.name = 'cap';
      group.add(domeT);
      
      const domeBGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2);
      const domeB = new THREE.Mesh(domeBGeo, darkMetalMat);
      domeB.position.y = -0.9;
      domeB.name = 'base';
      group.add(domeB);
      
      // Internal diverter baffles (split steel sheets)
      const baffleGeo = new THREE.BoxGeometry(0.9, 0.05, 0.8);
      
      const baffle1 = new THREE.Mesh(baffleGeo, metalMat);
      baffle1.position.set(-0.25, 0.3, 0);
      baffle1.rotation.z = -Math.PI / 6;
      baffle1.name = 'baffle1';
      group.add(baffle1);
      
      const baffle2 = new THREE.Mesh(baffleGeo, metalMat);
      baffle2.position.set(0.25, -0.2, 0);
      baffle2.rotation.z = Math.PI / 6;
      baffle2.name = 'baffle2';
      group.add(baffle2);
      
      // Pipings
      const pipeVertGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
      const gasPipe = new THREE.Mesh(pipeVertGeo, metalMat);
      gasPipe.position.set(0, 1.5, 0);
      gasPipe.name = 'gasPipe';
      group.add(gasPipe);
      
      const pipeHGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
      pipeHGeo.rotateZ(Math.PI / 2);
      
      const inletPipe = new THREE.Mesh(pipeHGeo, metalMat);
      inletPipe.position.set(-1.0, -0.6, 0);
      inletPipe.name = 'inlet';
      group.add(inletPipe);
      
      const liquidPipe = new THREE.Mesh(pipeHGeo, metalMat);
      liquidPipe.position.set(1.0, -0.6, 0);
      liquidPipe.name = 'liquidPipe';
      group.add(liquidPipe);
      
    } else if (id === 'control-valve') {
      // 3. Intelligent Control Valve
      
      // Central valve body sphere
      const sphereBodyGeo = new THREE.SphereGeometry(0.8, 32, 24);
      const sphereBody = new THREE.Mesh(sphereBodyGeo, glassMat);
      sphereBody.name = 'casing';
      group.add(sphereBody);
      
      // Side pipes with flanges
      const flangeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24);
      flangeGeo.rotateZ(Math.PI / 2);
      const pipeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 24);
      pipeGeo.rotateZ(Math.PI / 2);
      
      const inletGroup = new THREE.Group();
      inletGroup.name = 'inlet';
      const inFlange = new THREE.Mesh(flangeGeo, darkMetalMat);
      inFlange.position.x = -1.2;
      const inPipe = new THREE.Mesh(pipeGeo, metalMat);
      inPipe.position.x = -0.7;
      inletGroup.add(inFlange);
      inletGroup.add(inPipe);
      group.add(inletGroup);
      
      const outletGroup = new THREE.Group();
      outletGroup.name = 'outlet';
      const outFlange = new THREE.Mesh(flangeGeo, darkMetalMat);
      outFlange.position.x = 1.2;
      const outPipe = new THREE.Mesh(pipeGeo, metalMat);
      outPipe.position.x = 0.7;
      outletGroup.add(outFlange);
      outletGroup.add(outPipe);
      group.add(outletGroup);
      
      // Actuator pillar housing on top (explodes upward)
      const actuatorGroup = new THREE.Group();
      actuatorGroup.name = 'cap'; // binds to sliding cap logic
      
      // Support pillars
      const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
      const pillarL = new THREE.Mesh(pillarGeo, metalMat);
      pillarL.position.set(-0.25, 1.1, 0);
      const pillarR = new THREE.Mesh(pillarGeo, metalMat);
      pillarR.position.set(0.25, 1.1, 0);
      actuatorGroup.add(pillarL);
      actuatorGroup.add(pillarR);
      
      // Electrical actuator top cylinder box
      const cylinderTopGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.7, 24);
      const cylinderTop = new THREE.Mesh(cylinderTopGeo, darkMetalMat);
      cylinderTop.position.y = 1.6;
      actuatorGroup.add(cylinderTop);
      
      // Actuator cap dome (gold metal color)
      const actCapGeo = new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI*2, 0, Math.PI/2);
      const actCap = new THREE.Mesh(actCapGeo, goldMetalMat);
      actCap.position.y = 1.95;
      actuatorGroup.add(actCap);
      
      // Internal valve stem plunger (connecting actuator to body gate)
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
      const stem = new THREE.Mesh(stemGeo, goldMetalMat);
      stem.position.y = 0.7;
      actuatorGroup.add(stem);
      
      // Internal gate disc
      const gateDiscGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24);
      const gateDisc = new THREE.Mesh(gateDiscGeo, darkMetalMat);
      gateDisc.position.y = 0.0;
      actuatorGroup.add(gateDisc);
      
      group.add(actuatorGroup);
      
    } else if (id === 'strainer') {
      // 4. Self-Cleaning Strainer
      
      // Main central vertical cylinder body
      const strainerCasingGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.0, 32);
      const strainerCasing = new THREE.Mesh(strainerCasingGeo, glassMat);
      strainerCasing.name = 'casing';
      group.add(strainerCasing);
      
      // Flanged top cap
      const topCapGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.15, 32);
      const topCap = new THREE.Mesh(topCapGeo, darkMetalMat);
      topCap.position.y = 1.05;
      topCap.name = 'cap';
      group.add(topCap);
      
      // Flanged bottom collector base
      const bottomBaseGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.4, 32);
      const bottomBase = new THREE.Mesh(bottomBaseGeo, darkMetalMat);
      bottomBase.position.y = -1.1;
      bottomBase.name = 'base';
      group.add(bottomBase);
      
      // Internal strainer perforated cage drum (wireframe cylinders)
      const cageGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 24, 8, true);
      const cageMat = new THREE.MeshStandardMaterial({
        color: 0x30d158,
        metalness: 0.9,
        roughness: 0.3,
        wireframe: true // Grid cage effect
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      cageMesh.position.y = -0.1;
      cageMesh.name = 'core';
      group.add(cageMesh);
      
      // Mechanical scraper brush axial shaft
      const shaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12);
      const shaft = new THREE.Mesh(shaftGeo, goldMetalMat);
      shaft.position.y = 0.1;
      shaft.name = 'shaft';
      group.add(shaft);
      
      // Inlet / Outlet connectors
      const inGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
      inGeo.rotateZ(Math.PI / 2);
      const pipeIn = new THREE.Mesh(inGeo, metalMat);
      pipeIn.position.set(-0.9, -0.2, 0);
      pipeIn.name = 'inlet';
      group.add(pipeIn);
      
      const pipeOut = new THREE.Mesh(inGeo, metalMat);
      pipeOut.position.set(0.9, 0.2, 0);
      pipeOut.name = 'outlet';
      group.add(pipeOut);
      
    } else if (id === 'ultrafiltration') {
      // 5. Ultrafiltration Membrane Module
      
      // Main long PVC module body tube
      const pvcTubeGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.6, 32, 1, true);
      const pvcTube = new THREE.Mesh(pvcTubeGeo, glassMat);
      pvcTube.name = 'casing';
      group.add(pvcTube);
      
      // Cap end adapters (inlet/outlet manifold flanges)
      const capManifoldGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.25, 32);
      
      const topEnd = new THREE.Mesh(capManifoldGeo, darkMetalMat);
      topEnd.position.y = 1.4;
      topEnd.name = 'cap';
      group.add(topEnd);
      
      const bottomEnd = new THREE.Mesh(capManifoldGeo, darkMetalMat);
      bottomEnd.position.y = -1.4;
      bottomEnd.name = 'base';
      group.add(bottomEnd);
      
      // Internal capillaries: bundle of hollow cylinders
      const fibersGroup = new THREE.Group();
      fibersGroup.name = 'core';
      
      const fiberGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.3, 8);
      const fiberMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.7,
        metalness: 0.1,
        wireframe: this.isWireframe
      });
      
      // Position multiple fiber cylinders in a dense radial pattern
      const rings = [
        { r: 0.15, count: 5 },
        { r: 0.35, count: 12 }
      ];
      
      // Center single fiber
      const centerFiber = new THREE.Mesh(fiberGeo, fiberMat);
      fibersGroup.add(centerFiber);
      
      rings.forEach(ring => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;
          const fiber = new THREE.Mesh(fiberGeo, fiberMat);
          fiber.position.set(Math.cos(angle) * ring.r, 0, Math.sin(angle) * ring.r);
          fibersGroup.add(fiber);
        }
      });
      group.add(fibersGroup);
      
      // Side reject connector
      const nozzleGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
      nozzleGeo.rotateZ(Math.PI / 2);
      const rejectNozzle = new THREE.Mesh(nozzleGeo, metalMat);
      rejectNozzle.position.set(-0.85, 0.9, 0);
      rejectNozzle.name = 'reject';
      group.add(rejectNozzle);
      
    } else if (id === 'ro-desal') {
      // 6. Reverse Osmosis Desalination Vessel
      
      // Main long composite fiberglass pressure vessel shell
      const roShellGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.0, 32, 1, true);
      const roShell = new THREE.Mesh(roShellGeo, glassMat);
      roShell.name = 'casing';
      group.add(roShell);
      
      // Heavy pressure end caps
      const endCapGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 32);
      
      const leftEnd = new THREE.Mesh(endCapGeo, darkMetalMat);
      leftEnd.rotation.z = Math.PI / 2;
      leftEnd.position.x = -1.6;
      leftEnd.name = 'cap';
      group.add(leftEnd);
      
      const rightEnd = new THREE.Mesh(endCapGeo, darkMetalMat);
      rightEnd.rotation.z = Math.PI / 2;
      rightEnd.position.x = 1.6;
      rightEnd.name = 'base';
      group.add(rightEnd);
      
      // Permeate central collector tube passing through core
      const coreTubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 16);
      coreTubeGeo.rotateZ(Math.PI / 2);
      const coreTube = new THREE.Mesh(coreTubeGeo, goldMetalMat);
      coreTube.name = 'core';
      group.add(coreTube);
      
      // Spiral-wound membrane filter bundle mesh
      const membraneGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.6, 32);
      membraneGeo.rotateZ(Math.PI / 2);
      const membraneMat = new THREE.MeshStandardMaterial({
        color: 0x0a84ff,
        metalness: 0.3,
        roughness: 0.6,
        wireframe: true // Spiral mesh winding representation
      });
      const membrane = new THREE.Mesh(membraneGeo, membraneMat);
      membrane.name = 'membrane';
      group.add(membrane);
    }
    
    // Create animated flowing particles inside WebGL model
    this.create3DFlowParticles(particleColor);
  }
  
  create3DFlowParticles(colorCode) {
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      // Setup random positions inside the casing bounds
      const x = (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 2.0;
      const z = (Math.random() - 0.5) * 1.5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (0.01 + Math.random() * 0.02), // upward bias
        (Math.random() - 0.5) * 0.01
      ));
    }
    
    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Canvas-based circle texture for round particles
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    const hexStr = '#' + colorCode.toString(16).padStart(6, '0');
    grad.addColorStop(0.3, hexStr);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);
    
    const pTexture = new THREE.CanvasTexture(pCanvas);
    
    const pMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.flowParticles = new THREE.Points(pGeometry, pMaterial);
    this.flowParticles.userData = { velocities };
    this.modelGroup.add(this.flowParticles);
  }
  
  createHotspots() {
    const id = this.productId;
    
    if (id === 'catalyst-filter' || id === 'thermal-reactor') {
      this.hotspots = [
        { pos: new THREE.Vector3(0, 1.2, 0), label: id === 'thermal-reactor' ? 'Reaction Core Dome' : 'Top Dome Lid', desc: id === 'thermal-reactor' ? 'Allows access for heating element inspection and catalyst bed replacement.' : 'Allows access for catalyst grid inspection and replacement.' },
        { pos: new THREE.Vector3(-1.0, -0.4, 0), label: id === 'thermal-reactor' ? 'Reactant Feed Inlet' : 'Inlet Nozzle', desc: id === 'thermal-reactor' ? 'Introduces raw chemical reactants at high pressure.' : 'Introduces unrefined chemical streams at high pressure.' },
        { pos: new THREE.Vector3(0, 0, 0.45), label: 'Catalyst Bed', desc: 'Mesh chamber holding active porous reaction elements.' },
        { pos: new THREE.Vector3(1.0, 0.4, 0), label: id === 'thermal-reactor' ? 'Product Gas Outlet' : 'Clean Filtrate Exit', desc: id === 'thermal-reactor' ? 'Re-routes cracked hydrocarbon gaseous products.' : 'Re-routes processed non-corrosive chemical streams.' }
      ];
    } else if (id === 'gas-separator' || id === 'acid-column') {
      this.hotspots = [
        { pos: new THREE.Vector3(0, 1.4, 0), label: id === 'acid-column' ? 'Vent Outlet' : 'Gas Exit Port', desc: id === 'acid-column' ? 'Discharges neutralized vapors or gases upward.' : 'Discharges lightweight gas phase separating upwards.' },
        { pos: new THREE.Vector3(-0.35, 0.35, 0), label: id === 'acid-column' ? 'Neutralizer Spray Header' : 'Upper Deflector Baffle', desc: id === 'acid-column' ? 'Spray nozzles dispersing alkaline neutralizing agent.' : 'Diverts incoming fluid streams downward to break emulsions.' },
        { pos: new THREE.Vector3(0.35, -0.25, 0), label: id === 'acid-column' ? 'Structured Packing' : 'Lower Settle Plate', desc: id === 'acid-column' ? 'Increases liquid-liquid or liquid-gas contact surface area.' : 'Encourages heavy water phase to gather at the base.' },
        { pos: new THREE.Vector3(1.0, -0.6, 0), label: id === 'acid-column' ? 'Effluent Drain' : 'Liquid Drain Nozzle', desc: id === 'acid-column' ? 'Continuous drain for neutralized chemical salt solutions.' : 'Continuous siphon for separated liquid phase.' }
      ];
    } else if (id === 'control-valve') {
      this.hotspots = [
        { pos: new THREE.Vector3(0, 1.8, 0), label: 'Electronic Actuator', desc: 'Receives remote telemetry to adjust gate disc height.' },
        { pos: new THREE.Vector3(0, 0.05, 0.4), label: 'Throttle Gate Disc', desc: 'Precision-machined plug that regulates fluid flow volume.' },
        { pos: new THREE.Vector3(-0.8, 0, 0), label: 'Input Pipe flange', desc: 'Standard ANSI flanged pipe interface.' }
      ];
    } else if (id === 'strainer') {
      this.hotspots = [
        { pos: new THREE.Vector3(0, 1.05, 0), label: 'Axial Scraper Drive', desc: 'Electric gear motor powering the cleaning brush rotation.' },
        { pos: new THREE.Vector3(0, -0.2, 0.45), label: 'Strainer Basket Grid', desc: 'Heavy-gauge perforated screen that traps large particles.' },
        { pos: new THREE.Vector3(0, -1.2, 0), label: 'Flush Drain Port', desc: 'Ejects accumulated solids dynamically without flow interruption.' }
      ];
    } else if (id === 'ultrafiltration') {
      this.hotspots = [
        { pos: new THREE.Vector3(0, 1.4, 0), label: 'Top Feed Port', desc: 'Enters module header splitting flow into hollow capillaries.' },
        { pos: new THREE.Vector3(0.2, 0.1, 0.35), label: 'Capillary Fiber bundle', desc: 'Thousands of sub-micron porous straws filtering particles.' },
        { pos: new THREE.Vector3(-0.85, 0.9, 0), label: 'Concentrate Reject', desc: 'Bleeds off trapped particle sludge to avoid clogging.' }
      ];
    } else if (id === 'ro-desal') {
      this.hotspots = [
        { pos: new THREE.Vector3(-1.6, 0, 0), label: 'High-Pressure Header', desc: 'End plate designed to withstand operating pressures up to 80 bar.' },
        { pos: new THREE.Vector3(0, 0.48, 0), label: 'Permeate Core Pipe', desc: 'Spotted stainless pipe that gathers clean desalinated water.' },
        { pos: new THREE.Vector3(0.4, 0, 0.45), label: 'Spiral-Wound Sheet', desc: 'Polyamide membrane sheet separating salt particles at molecular levels.' }
      ];
    }
    
    // Spawn HTML overlay elements for each hotspot
    this.hotspots.forEach((hs, idx) => {
      const el = document.createElement('div');
      el.className = 'hotspot-marker';
      el.dataset.index = idx;
      el.innerHTML = `
        <span class="hotspot-pulse"></span>
        <span class="hotspot-index">${idx + 1}</span>
        <div class="hotspot-tooltip">
          <h4>${hs.label}</h4>
          <p>${hs.desc}</p>
        </div>
      `;
      
      // When clicked, dispatch a custom event to notify main app
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Hide all tooltips first
        document.querySelectorAll('.hotspot-marker').forEach(marker => {
          if (marker !== el) marker.classList.remove('active');
        });
        
        el.classList.toggle('active');
        
        const event = new CustomEvent('hotspot-clicked', {
          detail: { label: hs.label, desc: hs.desc, position: hs.pos }
        });
        this.canvas.dispatchEvent(event);
      });
      
      this.hotspotOverlay.appendChild(el);
    });
  }
  
  toggleWireframe(state) {
    this.isWireframe = state;
    this.modelGroup.traverse(child => {
      if (child.isMesh && child.name !== 'casing') {
        child.material.wireframe = state;
      }
    });
  }
  
  toggleAutoRotate(state) {
    this.autoRotate = state;
    this.controls.autoRotate = state;
  }
  
  setExplodedRatio(ratio) {
    this.explodeRatio = ratio;
  }
  
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // 1. Controls update
    this.controls.update();
    
    // 2. Explode animation logic (interpolate smoothly towards target ratio)
    this.currentExplodeVal += (this.explodeRatio - this.currentExplodeVal) * 0.1;
    this.applyExplodedOffset(this.currentExplodeVal);
    
    // 3. Flow particles animation inside 3D model
    if (this.flowParticles) {
      const positions = this.flowParticles.geometry.attributes.position.array;
      const velocities = this.flowParticles.userData.velocities;
      const count = this.particleCount;
      const id = this.productId;
      
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const vel = velocities[i];
        
        positions[idx] += vel.x;
        positions[idx + 1] += vel.y;
        positions[idx + 2] += vel.z;
        
        // Model boundary check and reset based on type
        if (id === 'catalyst-filter' || id === 'strainer' || id === 'ultrafiltration') {
          // Flow is vertical (y-axis from -1.0 to 1.0)
          if (positions[idx + 1] > 1.0) {
            positions[idx] = (Math.random() - 0.5) * 0.4;
            positions[idx + 1] = -1.0;
            positions[idx + 2] = (Math.random() - 0.5) * 0.4;
          }
        } else if (id === 'gas-separator') {
          // Gas separators bubble up (top exit)
          if (positions[idx + 1] > 0.8) {
            positions[idx] = (Math.random() - 0.5) * 0.5;
            positions[idx + 1] = -0.8;
            positions[idx + 2] = (Math.random() - 0.5) * 0.5;
          }
        } else if (id === 'control-valve' || id === 'ro-desal') {
          // Flow is horizontal (x-axis from -1.4 to 1.4)
          // Adjust velocity vector horizontal
          if (vel.y > 0) {
            vel.x = 0.015 + Math.random() * 0.02;
            vel.y = (Math.random() - 0.5) * 0.005;
            vel.z = (Math.random() - 0.5) * 0.005;
          }
          positions[idx] += vel.x;
          positions[idx + 1] += vel.y;
          positions[idx + 2] += vel.z;
          
          if (positions[idx] > 1.4) {
            positions[idx] = -1.4;
            positions[idx + 1] = (Math.random() - 0.5) * 0.3;
            positions[idx + 2] = (Math.random() - 0.5) * 0.3;
          }
        }
      }
      this.flowParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    // 4. Update 2D hotspot projections
    this.updateHotspotPositions();
    
    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }
  
  applyExplodedOffset(val) {
    // Explodes meshes outward by name
    this.modelGroup.traverse(child => {
      if (child.name === 'casing') {
        // Casing expands in width (scales out or vanishes slightly to see inside)
        child.scale.set(1 + val * 0.6, 1, 1 + val * 0.6);
        child.material.opacity = 0.25 * (1 - val * 0.5);
      }
      if (child.name === 'cap') {
        // Cap pushes UP
        child.position.y = val * 0.8;
      }
      if (child.name === 'base') {
        // Base pushes DOWN
        child.position.y = -val * 0.8;
      }
      if (child.name === 'inlet') {
        // Inlet pushes LEFT
        child.position.x = -val * 0.6;
      }
      if (child.name === 'outlet' || child.name === 'liquidPipe' || child.name === 'reject') {
        // Outlet pushes RIGHT
        child.position.x = val * 0.6;
      }
      if (child.name === 'core' || child.name === 'membrane') {
        // Core rotates/pulls slightly forward or stays centered
        child.position.z = val * 0.4;
      }
    });
  }
  
  updateHotspotPositions() {
    if (!this.hotspots.length) return;
    
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const tempV = new THREE.Vector3();
    
    const markers = this.hotspotOverlay.children;
    
    this.hotspots.forEach((hs, idx) => {
      const marker = markers[idx];
      if (!marker) return;
      
      // Start with base position
      tempV.copy(hs.pos);
      
      // Apply exploded offset to hotspot positions so they move with the components!
      if (this.currentExplodeVal > 0) {
        if (hs.label.includes('Lid') || hs.label.includes('Top') || hs.label.includes('Drive') || hs.label.includes('Actuator')) {
          tempV.y += this.currentExplodeVal * 0.8;
        } else if (hs.label.includes('Inlet') || hs.label.includes('Input')) {
          tempV.x -= this.currentExplodeVal * 0.6;
        } else if (hs.label.includes('Exit') || hs.label.includes('Drain') || hs.label.includes('Reject')) {
          tempV.x += this.currentExplodeVal * 0.6;
        } else if (hs.label.includes('Bed') || hs.label.includes('Core') || hs.label.includes('Sheet') || hs.label.includes('bundle') || hs.label.includes('Basket')) {
          tempV.z += this.currentExplodeVal * 0.4;
        }
      }
      
      // Project 3D vector to 2D screen coordinates
      tempV.project(this.camera);
      
      // Check if behind camera
      if (tempV.z > 1) {
        marker.style.display = 'none';
        return;
      }
      
      marker.style.display = 'block';
      
      // Calculate CSS pixels matching viewport coordinates
      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (tempV.y * -0.5 + 0.5) * height;
      
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
    });
  }
  
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Clean up WebGL resources
    this.renderer.dispose();
    this.scene.clear();
  }
}
