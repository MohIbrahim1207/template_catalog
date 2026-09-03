class FluidSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.isPlaying = true;
    this.currentTime = 0;
    this.duration = 15; // 15-second loop
    this.speed = 1.0;
    this.flowRate = 5.0; // 1 to 10
    this.pressure = 4.5; // 1 to 10
    this.productId = '';
    
    this.particles = [];
    this.maxParticles = 150;
    this.width = 800;
    this.height = 450;
    
    this.animationFrameId = null;
    this.lastTime = 0;
    
    this.initCanvas();
    window.addEventListener('resize', () => this.resize());
  }
  
  initCanvas() {
    this.resize();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width * (window.devicePixelRatio || 1);
    this.height = rect.height * (window.devicePixelRatio || 1);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
  setProduct(id) {
    this.productId = id;
    this.particles = [];
    this.currentTime = 0;
    
    // Customize particle counts and physics based on product
    if (id === 'catalyst-filter') {
      this.maxParticles = 180;
    } else if (id === 'gas-separator') {
      this.maxParticles = 250;
    } else if (id === 'control-valve') {
      this.maxParticles = 120;
    } else {
      this.maxParticles = 150;
    }
    
    this.spawnInitialParticles();
  }
  
  spawnInitialParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }
  
  createParticle(randomX = false) {
    const w = this.width;
    const h = this.height;
    
    let x = randomX ? Math.random() * w : 0;
    let y = Math.random() * h;
    let vx = 0;
    let vy = 0;
    let size = 2 + Math.random() * 4;
    let color = '#0a84ff';
    let type = 'fluid'; // fluid, gas, dirt, clean
    let life = 1.0;
    
    // Setup initial position/type based on product flow routes
    switch(this.productId) {
      case 'catalyst-filter': // Left-to-right through a filter grid in the middle
        y = h * 0.3 + Math.random() * h * 0.4;
        vx = (1 + Math.random() * 2) * this.flowRate * 0.5;
        color = randomX && x > w * 0.5 ? 'rgba(191, 90, 242, 0.9)' : 'rgba(235, 94, 40, 0.8)';
        type = randomX && x > w * 0.5 ? 'clean' : 'dirty';
        break;
        
      case 'gas-separator': // Fluid enters bottom left, gas bubbles rise, fluid exits bottom right
        if (randomX) {
          x = Math.random() * w;
          y = h * 0.2 + Math.random() * h * 0.7;
        } else {
          x = w * 0.1 + Math.random() * 40;
          y = h * 0.8;
        }
        type = Math.random() > 0.4 ? 'gas' : 'liquid';
        color = type === 'gas' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(10, 132, 255, 0.7)';
        vx = type === 'gas' ? (Math.random() - 0.5) * 0.5 : (1 + Math.random() * 2);
        vy = type === 'gas' ? -(1 + Math.random() * 2) : (Math.random() - 0.5);
        break;
        
      case 'control-valve': // S-shape through a valve throat
        y = h * 0.45 + (Math.random() - 0.5) * h * 0.1;
        vx = (2 + Math.random() * 3) * this.flowRate * 0.4;
        color = 'rgba(100, 210, 255, 0.8)';
        break;
        
      case 'strainer': // Spiral cleaning strainer
        y = h * 0.25 + Math.random() * h * 0.5;
        vx = (1.5 + Math.random() * 2) * this.flowRate * 0.4;
        color = randomX && x > w * 0.55 ? 'rgba(48, 209, 88, 0.8)' : 'rgba(160, 120, 80, 0.8)';
        type = randomX && x > w * 0.55 ? 'clean' : 'dirty';
        break;
        
      case 'ultrafiltration': // Inside capillary tubes
        y = h * 0.15 + Math.random() * h * 0.7;
        vx = (1.2 + Math.random() * 1.8) * this.flowRate * 0.4;
        color = randomX && Math.abs(y - h * 0.5) > h * 0.25 ? 'rgba(48, 209, 88, 0.8)' : 'rgba(255, 59, 48, 0.7)';
        type = randomX && Math.abs(y - h * 0.5) > h * 0.25 ? 'clean' : 'dirty';
        break;
        
      case 'ro-desal': // High pressure membrane sheet layers
        y = h * 0.2 + Math.random() * h * 0.6;
        vx = (1.5 + Math.random() * 2.5) * this.flowRate * 0.4;
        color = randomX && y > h * 0.48 && y < h * 0.52 ? 'rgba(10, 132, 255, 0.9)' : 'rgba(255, 214, 10, 0.7)';
        type = randomX && y > h * 0.48 && y < h * 0.52 ? 'clean' : 'dirty';
        break;
    }
    
    return { x, y, vx, vy, size, color, type, life };
  }
  
  play() {
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.tick();
  }
  
  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }
  
  setParameters(flowRate, pressure) {
    this.flowRate = flowRate;
    this.pressure = pressure;
  }
  
  setTime(seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    // Redistribute particles deterministically/randomly based on current scrub time
    this.particles = [];
    this.spawnInitialParticles();
    this.draw();
  }
  
  tick() {
    if (!this.isPlaying) return;
    
    const now = performance.now();
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    
    // Cap dt to prevent particle explosion on tab defocus
    if (dt > 0.1) dt = 0.1;
    
    this.update(dt * this.speed);
    this.draw();
    
    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }
  
  update(dt) {
    const w = this.width;
    const h = this.height;
    
    // Update video clock
    this.currentTime += dt;
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
    
    const baseFlow = this.flowRate * 40; // scale pixels per sec
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      switch(this.productId) {
        case 'catalyst-filter': {
          // Flow enters left channel, hits central filter grid, emerges clean
          const filterX = w * 0.5;
          p.x += p.vx * (baseFlow / 150) * (p.type === 'dirty' ? 0.8 : 1.2);
          p.y += (Math.sin(p.x * 0.05) * 0.5) * (this.pressure / 5);
          
          // Transition dirty particle to clean particle at filter mesh
          if (p.type === 'dirty' && p.x >= filterX) {
            p.type = 'clean';
            p.color = 'rgba(191, 90, 242, 0.9)'; // Purple/violet clean chemical
            p.vx *= 1.2; // flows faster after filtration
            // Small trigger animation splash
            p.size += 1.5;
          }
          
          // Reset particle if it leaves the screen
          if (p.x > w || p.y < h * 0.25 || p.y > h * 0.75) {
            this.particles[i] = this.createParticle(false);
          }
          break;
        }
        
        case 'gas-separator': {
          // Gas bubbles rise up, liquid moves to the bottom right
          if (p.type === 'gas') {
            p.vy = - (1 + Math.random() * 2) * (this.pressure * 0.4);
            p.vx = (Math.sin(p.y * 0.04) * 1.5) + (p.x < w * 0.5 ? 0.3 : -0.3); // drift to top gas outlet
            p.x += p.vx;
            p.y += p.vy;
            
            // Shrink size near top
            if (p.y < h * 0.2) p.size *= 0.96;
            
            if (p.y < h * 0.08 || p.x < 0 || p.x > w) {
              this.particles[i] = this.createParticle(false);
            }
          } else {
            // Liquid flows in bottom-left, goes through baffle, exits bottom-right
            // Simple baffle path: go right, go down/up, exit right
            p.x += (1.5 + Math.random()) * (baseFlow / 80);
            
            // Baffle plate 1 at w * 0.35 (goes under)
            if (p.x > w * 0.3 && p.x < w * 0.35 && p.y < h * 0.7) {
              p.y += 3;
            }
            // Baffle plate 2 at w * 0.65 (goes over)
            if (p.x > w * 0.6 && p.x < w * 0.65 && p.y > h * 0.4) {
              p.y -= 3;
            }
            
            p.y += (Math.sin(p.x * 0.1) * 0.3);
            
            if (p.x > w || p.y > h) {
              this.particles[i] = this.createParticle(false);
            }
          }
          break;
        }
        
        case 'control-valve': {
          // Flow from left to right, constricted in the middle
          // Constriction ratio based on flow rate/pressure simulator
          const midX = w * 0.5;
          const throatRadius = h * 0.08 + (this.flowRate * 12); // wider at higher flow rates
          
          const dx = p.x - midX;
          
          if (p.x < midX) {
            // Approaching constriction: funnel inward
            const targetY = h * 0.5 + (p.y - h * 0.5) * 0.95;
            p.y += (targetY - p.y) * 0.08;
            p.x += p.vx * (baseFlow / 120);
          } else {
            // Exiting constriction: expand and create turbulence (eddies)
            const targetY = h * 0.5 + (p.y - h * 0.5) * 1.05;
            p.y += (targetY - p.y) * 0.05;
            
            // Eddies / turbulence
            const turbulence = Math.max(0, 10 - this.flowRate) * 0.5; // more turbulence at high pressure/speed
            p.y += Math.sin(p.x * 0.05) * turbulence;
            p.x += p.vx * (baseFlow / 120) * 0.9;
          }
          
          // Venturi acceleration in the middle throat
          if (Math.abs(dx) < 60) {
            p.x += p.vx * 0.8; // speed boost
            p.color = 'rgba(255, 255, 255, 0.95)'; // glow at throat
          } else {
            p.color = 'rgba(100, 210, 255, 0.8)';
          }
          
          if (p.x > w) {
            this.particles[i] = this.createParticle(false);
          }
          break;
        }
        
        case 'strainer': {
          // Self-cleaning strainer: particles flow right. Dirt gets trapped in center mesh circle
          const strainerX = w * 0.5;
          const strainerY = h * 0.5;
          const strainerR = h * 0.28;
          
          if (p.type === 'dirty') {
            // Move towards the strainer drum
            const dist = Math.hypot(p.x - strainerX, p.y - strainerY);
            
            if (dist < strainerR + 10 && p.x < strainerX) {
              // Stick to mesh/circulate around the cage boundary
              p.type = 'trapped';
              p.vx = 0;
              p.vy = 0;
              p.angle = Math.atan2(p.y - strainerY, p.x - strainerX);
            } else {
              p.x += p.vx * (baseFlow / 140);
              p.y += Math.sin(p.x * 0.03) * 0.4;
            }
          } else if (p.type === 'trapped') {
            // Stuck particles rotate slowly on drum boundary until swept
            p.angle += 0.005 * this.flowRate;
            p.x = strainerX + Math.cos(p.angle) * strainerR;
            p.y = strainerY + Math.sin(p.angle) * strainerR;
            
            // Periodically sweep trapped particles to the bottom backwash drain
            if (Math.floor(this.currentTime) % 5 === 0 && this.currentTime % 5 < 0.15) {
              p.type = 'flush';
              p.vx = 0;
              p.vy = 4 + Math.random() * 3;
            }
          } else if (p.type === 'flush') {
            // Fluid sweeps downwards out of backwash drain
            p.y += p.vy * (this.pressure * 0.8);
            p.x += (Math.random() - 0.5) * 2;
            p.color = 'rgba(255, 69, 58, 0.9)'; // reddish flush tint
            
            if (p.y > h * 0.95) {
              this.particles[i] = this.createParticle(false);
            }
          } else {
            // Clean water passes instantly through the filter and leaves right
            p.x += p.vx * (baseFlow / 100);
            p.y += Math.sin(p.x * 0.02) * 0.3;
            
            if (p.x > w) {
              this.particles[i] = this.createParticle(false);
            }
          }
          break;
        }
        
        case 'ultrafiltration': {
          // Hollow fiber bundle: flow enters shell, clean water penetrates into fibers (center tube)
          const fibersTop = h * 0.3;
          const fibersBottom = h * 0.7;
          
          if (p.type === 'dirty') {
            p.x += p.vx * (baseFlow / 130);
            
            // Dirty particles cannot cross into the fiber core (vertical center band h * 0.45 to h * 0.55)
            // They get pushed outward along shell boundaries
            if (p.x > w * 0.25 && p.x < w * 0.75) {
              if (p.y > h * 0.42 && p.y < h * 0.58) {
                p.y += p.y > h * 0.5 ? 2 : -2; // deflect out
              }
            }
            
            if (p.x > w) {
              // Becomes dirty concentrate reject
              this.particles[i] = this.createParticle(false);
            }
          } else {
            // Clean water starts at fiber walls (top/bottom) and flows inwards, exits center outlet right
            if (p.x < w * 0.3) {
              p.x += p.vx * (baseFlow / 100);
            } else {
              p.x += p.vx * (baseFlow / 100);
              // Migrate towards center fiber core (y = h * 0.5)
              const diffY = (h * 0.5) - p.y;
              p.y += diffY * 0.03 * (this.pressure / 4);
              p.color = 'rgba(48, 209, 88, 0.95)'; // Bright green clean filtrate
            }
            
            if (p.x > w) {
              this.particles[i] = this.createParticle(false);
            }
          }
          break;
        }
        
        case 'ro-desal': {
          // Desalination vessel: high pressure salt water. Water permeates membrane, salt rejected.
          const membY = h * 0.5; // Membrane barrier center
          
          if (p.type === 'dirty') {
            // Salt ions (yellow particles) bounce off the membrane barrier
            p.x += p.vx * (baseFlow / 120);
            
            // Bounce/deflection near center membrane sheet
            if (Math.abs(p.y - membY) < 15) {
              p.vy = p.y > membY ? 3 : -3;
              p.y += p.vy; // push away
            } else {
              p.y += Math.sin(p.x * 0.08) * 0.5;
            }
            
            if (p.x > w) {
              this.particles[i] = this.createParticle(false);
            }
          } else {
            // Water molecules (blue) press through the membrane sheet under high pressure
            p.x += p.vx * (baseFlow / 150);
            
            if (p.x > w * 0.3 && p.x < w * 0.7) {
              // Flow path draws them INTO the central permeate channel at y = h * 0.5
              const diffY = membY - p.y;
              if (Math.abs(diffY) > 4) {
                p.y += Math.sign(diffY) * (0.8 + (this.pressure * 0.2));
                // Add jitter to show pressure squeeze
                p.x += (Math.random() - 0.5) * 1.5;
              }
            } else if (p.x >= w * 0.7) {
              p.y += (membY - p.y) * 0.1; // fully aligned in permeate core
            }
            
            if (p.x > w) {
              this.particles[i] = this.createParticle(false);
            }
          }
          break;
        }
      }
    }
  }
  
  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // Clear canvas with dark slate tone matching mockup aesthetics
    ctx.fillStyle = '#0f0f12';
    ctx.fillRect(0, 0, w, h);
    
    // Draw pipeline outlines, background meshes, and indicators
    this.drawBackgroundSchematic();
    
    // Draw fluid particles
    ctx.shadowBlur = 10;
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0; // Reset shadow glow
    
    // Draw foreground mechanics and overlays
    this.drawForegroundMechanicals();
    
    // Draw Telemetry Text Overlay (Virtual HUD)
    this.drawHUD();
  }
  
  drawBackgroundSchematic() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Draw Grid Lines (Tech UI style)
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    // Draw Pipeline body boundaries based on active product
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    
    switch(this.productId) {
      case 'catalyst-filter':
        // Big cylindrical reactor chamber in middle
        ctx.fillStyle = 'rgba(30, 30, 40, 0.4)';
        ctx.fillRect(w * 0.35, h * 0.2, w * 0.3, h * 0.6);
        ctx.strokeRect(w * 0.35, h * 0.2, w * 0.3, h * 0.6);
        
        // Inlet pipe (left)
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4);
        ctx.lineTo(w * 0.35, h * 0.4);
        ctx.moveTo(0, h * 0.6);
        ctx.lineTo(w * 0.35, h * 0.6);
        ctx.stroke();
        
        // Outlet pipe (right)
        ctx.beginPath();
        ctx.moveTo(w * 0.65, h * 0.4);
        ctx.lineTo(w, h * 0.4);
        ctx.moveTo(w * 0.65, h * 0.6);
        ctx.lineTo(w, h * 0.6);
        ctx.stroke();
        break;
        
      case 'gas-separator':
        // Spherical separation tower dome
        ctx.fillStyle = 'rgba(20, 30, 50, 0.4)';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.55, h * 0.38, Math.PI, 0); // top half dome
        ctx.lineTo(w * 0.5 + h * 0.38, h * 0.85); // right wall
        ctx.lineTo(w * 0.5 - h * 0.38, h * 0.85); // left wall
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Gas top outlet
        ctx.beginPath();
        ctx.moveTo(w * 0.46, h * 0.17);
        ctx.lineTo(w * 0.46, 0);
        ctx.moveTo(w * 0.54, h * 0.17);
        ctx.lineTo(w * 0.54, 0);
        ctx.stroke();
        
        // Inlet bottom left
        ctx.beginPath();
        ctx.moveTo(0, h * 0.72);
        ctx.lineTo(w * 0.2, h * 0.72);
        ctx.moveTo(0, h * 0.82);
        ctx.lineTo(w * 0.18, h * 0.82);
        ctx.stroke();
        
        // Liquid outlet bottom right
        ctx.beginPath();
        ctx.moveTo(w * 0.8, h * 0.8);
        ctx.lineTo(w, h * 0.8);
        ctx.moveTo(w * 0.8, h * 0.88);
        ctx.lineTo(w, h * 0.88);
        ctx.stroke();
        break;
        
      case 'control-valve':
        // Funnel pipe from left to center, then throat, then expand to right
        ctx.fillStyle = 'rgba(30, 45, 60, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.3);
        ctx.lineTo(w * 0.4, h * 0.3);
        ctx.lineTo(w * 0.48, h * 0.42); // funnel down
        ctx.lineTo(w * 0.52, h * 0.42); // throat top
        ctx.lineTo(w * 0.6, h * 0.3);
        ctx.lineTo(w, h * 0.3);
        
        ctx.lineTo(w, h * 0.7);
        ctx.lineTo(w * 0.6, h * 0.7);
        ctx.lineTo(w * 0.52, h * 0.58); // throat bottom
        ctx.lineTo(w * 0.48, h * 0.58); // throat bottom
        ctx.lineTo(w * 0.4, h * 0.7);
        ctx.lineTo(0, h * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'strainer':
        // Round filter drum housing
        ctx.fillStyle = 'rgba(40, 40, 30, 0.4)';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, h * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Horizontal pipelines
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4);
        ctx.lineTo(w * 0.25, h * 0.4);
        ctx.moveTo(0, h * 0.6);
        ctx.lineTo(w * 0.25, h * 0.6);
        
        ctx.moveTo(w * 0.75, h * 0.4);
        ctx.lineTo(w, h * 0.4);
        ctx.moveTo(w * 0.75, h * 0.6);
        ctx.lineTo(w, h * 0.6);
        ctx.stroke();
        
        // Backwash flush drain bottom
        ctx.beginPath();
        ctx.moveTo(w * 0.45, h * 0.75);
        ctx.lineTo(w * 0.45, h);
        ctx.moveTo(w * 0.55, h * 0.75);
        ctx.lineTo(w * 0.55, h);
        ctx.stroke();
        break;
        
      case 'ultrafiltration':
        // Shell housing
        ctx.fillStyle = 'rgba(30, 40, 30, 0.3)';
        ctx.fillRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
        ctx.strokeRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
        
        // Side nozzles
        ctx.beginPath();
        // Shell Inlet (top left)
        ctx.moveTo(w * 0.2, h * 0.25); ctx.lineTo(0, h * 0.25);
        ctx.moveTo(w * 0.2, h * 0.35); ctx.lineTo(0, h * 0.35);
        // Shell Concentrate reject (bottom left)
        ctx.moveTo(w * 0.2, h * 0.65); ctx.lineTo(0, h * 0.65);
        ctx.moveTo(w * 0.2, h * 0.75); ctx.lineTo(0, h * 0.75);
        // Filtrate Out (right center)
        ctx.moveTo(w * 0.8, h * 0.45); ctx.lineTo(w, h * 0.45);
        ctx.moveTo(w * 0.8, h * 0.55); ctx.lineTo(w, h * 0.55);
        ctx.stroke();
        break;
        
      case 'ro-desal':
        // Long cylindrical pressure vessel
        ctx.fillStyle = 'rgba(25, 35, 45, 0.4)';
        ctx.fillRect(w * 0.12, h * 0.2, w * 0.76, h * 0.6);
        ctx.strokeRect(w * 0.12, h * 0.2, w * 0.76, h * 0.6);
        
        // Pipes
        ctx.beginPath();
        // Inlet (left)
        ctx.moveTo(0, h * 0.35); ctx.lineTo(w * 0.12, h * 0.35);
        ctx.moveTo(0, h * 0.65); ctx.lineTo(w * 0.12, h * 0.65);
        // Permeate (pure water) exit right middle
        ctx.moveTo(w * 0.88, h * 0.45); ctx.lineTo(w, h * 0.45);
        ctx.moveTo(w * 0.88, h * 0.55); ctx.lineTo(w, h * 0.55);
        // Concentrate (salt reject) exit bottom right
        ctx.moveTo(w * 0.88, h * 0.7); ctx.lineTo(w * 0.94, h * 0.7); ctx.lineTo(w * 0.94, h);
        ctx.moveTo(w * 0.83, h * 0.8); ctx.lineTo(w * 0.88, h * 0.8);
        ctx.stroke();
        break;
    }
  }
  
  drawForegroundMechanicals() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    switch(this.productId) {
      case 'catalyst-filter': {
        // Vertical Catalyst Filter Element (glowing wireframe grid) in the middle
        const filterX = w * 0.5;
        ctx.strokeStyle = '#bf5af2';
        ctx.shadowColor = '#bf5af2';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(filterX, h * 0.2);
        ctx.lineTo(filterX, h * 0.8);
        ctx.stroke();
        
        // Draw cross lines for mesh pattern
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(191, 90, 242, 0.4)';
        for (let y = h * 0.22; y < h * 0.8; y += 12) {
          ctx.beginPath();
          ctx.moveTo(filterX - 10, y);
          ctx.lineTo(filterX + 10, y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        
        // Small catalog info
        ctx.fillStyle = '#bf5af2';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("0.5-MICRON CATALYST MESH", filterX - 70, h * 0.17);
        break;
      }
      
      case 'gas-separator': {
        // Separation baffles (solid white plates)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 5;
        
        // Baffle 1 (Top-down) at x = w*0.4
        ctx.beginPath();
        ctx.moveTo(w * 0.4, h * 0.25);
        ctx.lineTo(w * 0.4, h * 0.65);
        ctx.stroke();
        
        // Baffle 2 (Bottom-up) at x = w*0.6
        ctx.beginPath();
        ctx.moveTo(w * 0.6, h * 0.85);
        ctx.lineTo(w * 0.6, h * 0.45);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("SOLID STEEL DIVERTER BAFFLES", w * 0.4 - 30, h * 0.93);
        break;
      }
      
      case 'control-valve': {
        // Mechanical actuator valve gate coming down into the throat
        const midX = w * 0.5;
        // Position of gate depends on flowRate (1 to 10)
        // 10 = fully open (high up), 1 = closed (low down blocking flow)
        const gateHeight = h * 0.42 + (Math.max(1, 10 - this.flowRate) * 0.016 * h);
        
        // Actuator stem and disc
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(midX, h * 0.05);
        ctx.lineTo(midX, gateHeight);
        ctx.stroke();
        
        // Valve disc head
        ctx.fillStyle = '#64d2ff';
        ctx.strokeStyle = '#0a84ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#64d2ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(midX, gateHeight, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Flow velocity indicator
        ctx.fillStyle = '#64d2ff';
        ctx.font = 'bold 10px sans-serif';
        const pctOpen = Math.round(this.flowRate * 10);
        ctx.fillText(`VALVE THROAT: ${pctOpen}% OPEN`, midX - 60, h * 0.17);
        break;
      }
      
      case 'strainer': {
        // Circular mesh drum
        const strainerX = w * 0.5;
        const strainerY = h * 0.5;
        const strainerR = h * 0.28;
        
        ctx.strokeStyle = '#30d158';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#30d158';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(strainerX, strainerY, strainerR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Rotating Cleaning Brush (moves dynamically with time)
        const angle = this.currentTime * 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(strainerX, strainerY);
        ctx.lineTo(strainerX + Math.cos(angle) * strainerR, strainerY + Math.sin(angle) * strainerR);
        ctx.stroke();
        
        // Brush bristles end cap
        ctx.fillStyle = '#ff453a';
        ctx.beginPath();
        ctx.arc(strainerX + Math.cos(angle) * strainerR, strainerY + Math.sin(angle) * strainerR, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#30d158';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("ROTATING BRUSH SCRAPER", strainerX - 65, strainerY - strainerR - 12);
        break;
      }
      
      case 'ultrafiltration': {
        // Capillary tubes (hollow fiber membranes)
        const fiberTopY = h * 0.15;
        const fiberBottomY = h * 0.85;
        
        ctx.strokeStyle = 'rgba(48, 209, 88, 0.25)';
        ctx.lineWidth = 2;
        
        // Render 8 hollow fiber capillary lines
        for (let offset = -40; offset <= 40; offset += 12) {
          ctx.beginPath();
          ctx.moveTo(w * 0.25, h * 0.5 + offset);
          ctx.lineTo(w * 0.75, h * 0.5 + offset);
          ctx.stroke();
        }
        
        // Feed manifolds
        ctx.fillStyle = '#30d158';
        ctx.fillRect(w * 0.2, fiberTopY, w * 0.05, fiberBottomY - fiberTopY);
        ctx.fillRect(w * 0.75, fiberTopY, w * 0.05, fiberBottomY - fiberTopY);
        
        ctx.fillStyle = '#30d158';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("0.02-MICRON HOLLOW FIBERS", w * 0.5 - 75, h * 0.1);
        break;
      }
      
      case 'ro-desal': {
        // Spiral-wound membrane core layers
        ctx.strokeStyle = 'rgba(10, 132, 255, 0.25)';
        ctx.lineWidth = 2;
        
        // Membrane layer 1
        ctx.strokeRect(w * 0.15, h * 0.25, w * 0.7, h * 0.18);
        // Membrane layer 2 (bottom)
        ctx.strokeRect(w * 0.15, h * 0.57, w * 0.7, h * 0.18);
        
        // Central permeate collector core tube
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = '#0a84ff';
        ctx.lineWidth = 3;
        ctx.fillRect(w * 0.15, h * 0.47, w * 0.7, h * 0.06);
        ctx.strokeRect(w * 0.15, h * 0.47, w * 0.7, h * 0.06);
        
        ctx.fillStyle = '#0a84ff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("PERMEATE COLLECTOR CORE TUBE", w * 0.5 - 90, h * 0.15);
        break;
      }
    }
  }
  
  drawHUD() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // Telemetry Panel (glowing dark rectangle at top-right or top-left)
    ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.fillRect(w * 0.02, h * 0.02, 220, 105);
    ctx.strokeRect(w * 0.02, h * 0.02, 220, 105);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Courier, monospace';
    
    // Format connection, playback and physics values
    const flowText = (this.flowRate * 1.6).toFixed(2);
    const presText = (this.pressure * 1.2).toFixed(2);
    const flowScaleText = this.isPlaying ? "STABLE" : "HALTED";
    
    // Color of status indicator
    ctx.fillStyle = this.isPlaying ? '#30d158' : '#ff453a';
    ctx.beginPath();
    ctx.arc(w * 0.02 + 18, h * 0.02 + 18, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText("SYSTEM STATUS: ", w * 0.02 + 28, h * 0.02 + 21);
    ctx.fillStyle = this.isPlaying ? '#30d158' : '#ff453a';
    ctx.fillText(flowScaleText, w * 0.02 + 125, h * 0.02 + 21);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`FLOW VELOCITY: ${flowText} m/s`, w * 0.02 + 14, h * 0.02 + 45);
    ctx.fillText(`SYSTEM PRESS.: ${presText} bar`, w * 0.02 + 14, h * 0.02 + 65);
    
    // Calculate simulated dynamic efficiency based on pressure and flow rates
    let efficiency = 99.8;
    if (this.productId === 'control-valve') {
      efficiency = (100 - Math.abs(this.flowRate - 5) * 0.4);
    } else {
      // higher pressure or too high flow lowers efficiency slightly
      efficiency = 100 - (this.flowRate * 0.04) - (Math.abs(this.pressure - 4.5) * 0.08);
    }
    
    ctx.fillStyle = '#64d2ff';
    ctx.fillText(`FILTER EFF.  : ${efficiency.toFixed(2)}%`, w * 0.02 + 14, h * 0.02 + 85);
  }
}
