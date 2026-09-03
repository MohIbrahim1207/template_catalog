// Product Showcase Database
const SECTORS = {
  chemical: {
    id: 'chemical',
    name: 'Chemical Processing',
    desc: 'Corrosive filtration, high-temp catalyst recovery, gas-liquid separation & bulk material transfer handling.',
    color: '#bf5af2', // Purple
    icon: '🧪',
    products: [
      'catalyst-filter', 'gas-separator', 'thermal-reactor', 'acid-column',
      'vacuum-conveying', 'pressure-conveying', 'screw-conveyor', 'z-bucket-conveyor',
      'bulk-bag-discharger', 'bulk-bag-filler', 'lump-breaker',
      'rotary-airlock-valve', 'dust-collection', 'weighing-batching'
    ]
  },
  fluid: {
    id: 'fluid',
    name: 'Fluid Management',
    desc: 'Intelligent flow regulation, valve telemetry, and continuous straining.',
    color: '#0a84ff', // Cyan/Blue
    icon: '💧',
    products: ['control-valve', 'strainer']
  },
  water: {
    id: 'water',
    name: 'Water Treatment',
    desc: 'Ultrafiltration hollow capillary fibers and high-pressure RO desalination.',
    color: '#30d158', // Emerald Green
    icon: '🌱',
    products: ['ultrafiltration', 'ro-desal']
  }
};

const PRODUCTS = {
  'catalyst-filter': {
    id: 'catalyst-filter',
    name: 'Multi-Stage Catalyst Filter',
    sector: 'chemical',
    tag: 'High-Temperature Recovery System',
    desc: 'Engineered specifically for recovering valuable catalyst solids from aggressive chemical streams. Retains active particles down to 0.5 microns under extreme temperatures and pressures, achieving 99.8% capture efficiency with a cleanable alloy mesh core.',
    specs: {
      'Operating Flow': '120 m³/h',
      'Max Temperature': '350°C',
      'Design Pressure': '16.0 bar',
      'Wetted Material': 'Hastelloy C-276 / Hastelloy Mesh',
      'Filter Efficiency': '99.80% (particles > 0.5µm)'
    },
    features: [
      'Resistant to concentrated acids and organic solvents.',
      'Sintered mesh design allows automatic high-pressure backwashing.',
      'Zero bypass sealing flanges ensure absolute containment.',
      'Compact footprint with rapid-release top clamp dome for cleaning.'
    ],
    manual: 'datasheet_catalyst_filter_v4.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'gas-separator': {
    id: 'gas-separator',
    name: 'High-Pressure Gas Separator',
    sector: 'chemical',
    tag: 'Liquid-Gas Extraction Tower',
    desc: 'Optimized vertical separation vessel using stainless steel diverter plates to split gas and liquid phases. Collapses mist emulsions efficiently; dried gas vents out the top nozzle, while heavy fluids sink to the base pool, siphoning out automatically.',
    specs: {
      'Operating Flow': '450 m³/h',
      'Max Temperature': '180°C',
      'Design Pressure': '40.0 bar',
      'Wetted Material': '316L Stainless Steel',
      'Liquid Separation': '99.40% dry gas quality'
    },
    features: [
      'Dual-deflection baffles prevent particle re-entrainment.',
      'Level control float integration for automatic drainage.',
      'Designed to ASME Section VIII Division 1 code.',
      'Internal demister pad removes sub-micron droplets.'
    ],
    manual: 'separator_manual_rev2.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'thermal-reactor': {
    id: 'thermal-reactor',
    name: 'Thermal Cracking Reactor',
    sector: 'chemical',
    tag: 'High-Temperature Cracking System',
    desc: 'Engineered for high-temperature thermal decomposition of heavy hydrocarbon feedstocks into lighter fractions. Features an optimized catalytic bed and advanced heat recovery interfaces to maximize operational yield.',
    specs: {
      'Operating Flow': '320 m³/h',
      'Max Temperature': '650°C',
      'Design Pressure': '25.0 bar',
      'Wetted Material': 'Inconel 625 / Ceramic Coating',
      'Reactor Type': 'Fluidized Bed'
    },
    features: [
      'Advanced high-alloy casing withstands extreme thermal cycles.',
      'Catalytic bed design achieves higher cracking conversion selectivity.',
      'Integrated heat exchanger loops optimize overall energy recovery.',
      'Corrosion-resistant internal lining extends operational lifetime.'
    ],
    manual: 'reactor_cracking_manual.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'acid-column': {
    id: 'acid-column',
    name: 'Acid Neutralization Column',
    sector: 'chemical',
    tag: 'Corrosive Effluent Treatment',
    desc: 'Enables continuous neutralization of highly acidic chemical effluents before disposal or recycling. Constructed with high-durability corrosion-resistant lining and specialized high-dispersion spray nozzles.',
    specs: {
      'Operating Flow': '180 m³/h',
      'Max Temperature': '95°C',
      'Design Pressure': '6.0 bar',
      'Wetted Material': 'PTFE Lined / Hastelloy Spray',
      'Column Type': 'Packed Tower'
    },
    features: [
      'PTFE casing liner prevents chemical wear from aggressive acids.',
      'High-dispersion spray system ensures rapid pH adjustment.',
      'Structured packing bed maximizes chemical contact and mixing.',
      'Automated effluent monitoring adjusts neutralizer dosing.'
    ],
    manual: 'neutralization_effluent_guide.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'control-valve': {
    id: 'control-valve',
    name: 'Intelligent Control Valve',
    sector: 'fluid',
    tag: 'Smart Flow Regulating System',
    desc: 'High-precision modulating flow control valve featuring integrated pressure and velocity sensors. The gold-plated mechanical actuator adjusts disc height instantly to maintain desired flow profiles even under fluctuating line pressures.',
    specs: {
      'Operating Flow': '90 m³/h',
      'Max Temperature': '220°C',
      'Design Pressure': '25.0 bar',
      'Wetted Material': 'ASTM A890 Duplex Steel',
      'Control Precision': '±0.5% flow rate deviation'
    },
    features: [
      'Digital feedback telemetry with MODBUS/HART connectivity.',
      'Anti-cavitation trim prevents metal degradation.',
      'Fail-safe spring return system to shut down line instantly.',
      'Low friction bellows-sealed actuator shaft.'
    ],
    manual: 'valve_telemetry_guide.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'strainer': {
    id: 'strainer',
    name: 'Self-Cleaning Strainer',
    sector: 'fluid',
    tag: 'Continuous Flow Strainer Basket',
    desc: 'Motorized mechanical strainer with rotating scraper brushes that clean the filtration screen dynamically. Solves plugging issues without pipeline shutdown, purging trapped solids out of a dedicated bottom flush drain periodically.',
    specs: {
      'Operating Flow': '320 m³/h',
      'Max Temperature': '90°C',
      'Design Pressure': '10.0 bar',
      'Wetted Material': 'Super Duplex SS / Nylon Scrapers',
      'Solids Removal': '98.70% (particles > 100µm)'
    },
    features: [
      'Continuous operation during backwash purge cycles.',
      'Automatic differential pressure switch triggers scraper sweep.',
      'Wedge-wire screen prevents particle wedging.',
      'Substantially reduces operational maintenance costs.'
    ],
    manual: 'strainer_operation_guide.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  'ultrafiltration': {
    id: 'ultrafiltration',
    name: 'Ultrafiltration Module',
    sector: 'water',
    tag: 'Hollow Fiber Capillary System',
    desc: 'Sub-micron hollow capillary fiber filter bundle engineered for municipal and industrial water treatment. Effectively blocks suspended solids, colloidal particles, bacteria, and viruses down to 0.02 microns using robust PVDF membrane elements.',
    specs: {
      'Operating Flow': '45 m³/h per vessel',
      'Max Temperature': '45°C',
      'Design Pressure': '4.0 bar',
      'Fiber Material': 'PVDF (Hydrophilic)',
      'Virus Log Removal': 'Log 5 (99.999% retention)'
    },
    features: [
      'High chemical tolerance to chlorine and bleach cleanings.',
      'Outside-in flow paths yield high tolerance to raw solids.',
      'Low energy operating pressure cuts energy consumption in half.',
      'Sturdy fiberglass housing holds over 10,000 capillary fibers.'
    ],
    manual: 'uf_membrane_specs.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  },
  // ─── Material Transfer & Handling ────────────────────────────────────────
  'vacuum-conveying': {
    id: 'vacuum-conveying',
    name: 'Vacuum Conveying System',
    sector: 'chemical',
    tag: 'Material Transfer — Pneumatic Vacuum System',
    desc: 'Enclosed negative-pressure pneumatic conveying system designed to transfer dry bulk powders and granules from storage silos or process vessels to downstream equipment. Operates at vacuum levels up to −0.85 bar, eliminating fugitive dust emissions and ensuring full containment of hazardous or hygroscopic materials.',
    specs: {
      'Conveying Capacity': '8,000 kg/h',
      'Vacuum Level': '−0.85 bar (gauge)',
      'Max Conveying Distance': '120 m horizontal / 40 m vertical',
      'Material': 'SS 304 / SS 316L wetted parts',
      'Filter Efficiency': '99.97% at ≥ 1 µm'
    },
    features: [
      'Fully enclosed pipeline eliminates fugitive dust and cross-contamination.',
      'Automatic pulse-jet filter cleaning extends continuous run cycles.',
      'Gentle transfer mode minimises particle attrition and degradation.',
      'Modular receiver-filter units allow multi-point discharge configuration.'
    ],
    manual: 'vacuum_conveying_system_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'pressure-conveying': {
    id: 'pressure-conveying',
    name: 'Pressure Conveying System',
    sector: 'chemical',
    tag: 'Material Transfer — Dense-Phase Pressure System',
    desc: 'High-pressure positive-displacement pneumatic conveyor engineered for long-distance transfer of abrasive, fragile, or cohesive bulk solids. Dense-phase plug-flow operation maintains low air-to-material ratios, significantly reducing pipe wear and preserving particle integrity across distances exceeding 500 metres.',
    specs: {
      'Conveying Capacity': '15,000 kg/h',
      'Operating Pressure': '3.5 bar (gauge)',
      'Max Conveying Distance': '500 m horizontal / 80 m vertical',
      'Material': 'Hardened alloy steel / Ceramic-lined bends',
      'Air Consumption': '12 Nm³/min at 4.0 bar'
    },
    features: [
      'Dense-phase plug flow minimises particle breakage and pipe wear.',
      'Pressure vessel blow tanks designed to ASME Section VIII Div. 1.',
      'Variable air-knife control optimises plug velocity per material grade.',
      'Ceramic-lined 90° bends extend service life to 50,000+ operating hours.'
    ],
    manual: 'pressure_conveying_system_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'screw-conveyor': {
    id: 'screw-conveyor',
    name: 'Mechanical Screw Conveyor',
    sector: 'chemical',
    tag: 'Material Transfer — Screw Conveyor',
    desc: 'Horizontal or inclined screw conveyor deploying a helical flight auger to move bulk powders, granules, and semi-pastes through a fully enclosed trough. Engineered for high-throughput, low-headroom installations in chemical processing plants where pneumatic conveyance is impractical.',
    specs: {
      'Conveying Capacity': '20,000 kg/h',
      'Max Inclination': '45°',
      'Screw Diameter': '100 – 600 mm (configurable)',
      'Trough Material': 'SS 316L / Carbon Steel with liner',
      'Drive Power': '0.75 – 22 kW (variable speed)'
    },
    features: [
      'Sealed trough design prevents environmental contamination and dust escape.',
      'Variable-pitch flights allow controlled metering or flood-loaded conveying.',
      'Hardened flights with abrasion-resistant overlay extend service life.',
      'ATEX-rated drive options available for explosive powder environments.'
    ],
    manual: 'screw_conveyor_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'z-bucket-conveyor': {
    id: 'z-bucket-conveyor',
    name: 'Z-Type Bucket Conveyor',
    sector: 'chemical',
    tag: 'Material Transfer — Z-Type Bucket Elevator',
    desc: 'Continuous Z-configuration bucket elevator designed to elevate and transfer free-flowing bulk solids through multiple height changes without transfer points or intermediate hoppers. Centrifugally discharged buckets deliver fragile granules from floor level to mezzanine process equipment with minimal breakage.',
    specs: {
      'Conveying Capacity': '12,000 kg/h',
      'Lift Height': 'Up to 15 m per Z-stage',
      'Bucket Pitch': '200 – 400 mm (application-specific)',
      'Belt Material': 'Polyurethane / Steel-cord reinforced',
      'Drive Power': '2.2 – 15 kW'
    },
    features: [
      'Z-path eliminates intermediate transfer hoppers and reduces footprint.',
      'Totally enclosed housing prevents dust emission during transfer.',
      'Polyurethane buckets resist chemical attack and minimise noise.',
      'Automatic belt tensioning system compensates for thermal expansion.'
    ],
    manual: 'z_bucket_conveyor_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  // ─── Bulk Handling Units ─────────────────────────────────────────────────
  'bulk-bag-discharger': {
    id: 'bulk-bag-discharger',
    name: 'Bulk Bag Discharger Unit',
    sector: 'chemical',
    tag: 'Bulk Handling — FIBC Discharge Station',
    desc: 'Heavy-duty FIBC (Flexible Intermediate Bulk Container) discharger enabling safe, dust-free unloading of 500–2,000 kg bulk bags directly into process equipment or intermediate hoppers. Integrated bag massaging paddles break cohesive arches and ensure complete bag evacuation.',
    specs: {
      'Bag Capacity': '500 – 2,000 kg FIBC',
      'Discharge Rate': 'Up to 6,000 kg/h',
      'Max Bag Lift': '1,800 kg (SWL, 4:1 safety factor)',
      'Frame Material': 'Carbon steel (hot-dip galvanised)',
      'Dust Containment': 'Spout interface with inflatable seal'
    },
    features: [
      'Inflatable spout seal eliminates dust emission during bag connection.',
      'Motorised bag-massaging paddles break bridged or cohesive materials.',
      'Overload-rated lifting beam with certified chain hoist assembly.',
      'Optional load-cell integration for loss-in-weight metering.'
    ],
    manual: 'bulk_bag_discharger_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'bulk-bag-filler': {
    id: 'bulk-bag-filler',
    name: 'Bulk Bag Filler Unit',
    sector: 'chemical',
    tag: 'Bulk Handling — FIBC Fill Station',
    desc: 'Automated FIBC filling station with integrated gravimetric load-cell weighing, providing accurate and repeatable bag fills with ±0.5% net-weight accuracy. Spout inflator seals the bag loop during filling to prevent dusting, while a pallet conveyor advances completed bags for stretch-wrapping.',
    specs: {
      'Fill Rate': 'Up to 30 bags/hour',
      'Fill Accuracy': '±0.5% of target net weight',
      'Bag Size': '600 × 600 mm to 1,050 × 1,050 mm FIBC',
      'Weighing System': 'Load cell — Class III OIML certified',
      'Control': 'PLC with HMI touchscreen'
    },
    features: [
      'Spout inflator maintains positive seal preventing dusty product escape.',
      'Densification table vibration ensures maximum bag cube utilisation.',
      'Automatic pallet advance conveyor integrates with stretch-wrap station.',
      'Batching PLC records net weight and lot traceability per bag.'
    ],
    manual: 'bulk_bag_filler_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'lump-breaker': {
    id: 'lump-breaker',
    name: 'Lump Breaker Unit',
    sector: 'chemical',
    tag: 'Size Reduction — Rotary Lump Breaker',
    desc: 'Inline rotary lump breaker engineered to reduce oversized agglomerates, clumped powders, and caked granules to a controlled maximum particle size before downstream processing. Counter-rotating toothed rolls crush lumps without over-grinding, preserving the bulk density characteristics of the product.',
    specs: {
      'Throughput': 'Up to 10,000 kg/h',
      'Max Inlet Lump Size': '300 mm',
      'Discharge Particle Size': '10 – 80 mm (screen-selectable)',
      'Rotor Material': 'Hardened alloy steel (HRC 58–62)',
      'Drive Power': '5.5 – 30 kW'
    },
    features: [
      'Counter-rotating toothed rotors prevent over-grinding and fines generation.',
      'Interchangeable sizing screens select target discharge particle range.',
      'Compact inline design drops directly into hopper or conveyor discharge.',
      'Easy-access side panels allow rapid rotor inspection and replacement.'
    ],
    manual: 'lump_breaker_unit_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'rotary-airlock-valve': {
    id: 'rotary-airlock-valve',
    name: 'Rotary Airlock Valve',
    sector: 'chemical',
    tag: 'Pneumatic Handling — Rotary Valve',
    desc: 'Precision rotary airlock valve providing a continuous, metered product discharge from pressurised or vacuum vessels while maintaining an effective pressure differential seal. Cast with a close-tolerance rotor-to-housing clearance, it meters bulk powders into pneumatic conveying lines or gravity discharge chutes at controlled volumetric rates.',
    specs: {
      'Rotor Speed': '5 – 30 RPM (variable)',
      'Volumetric Capacity': '0.03 – 2.5 m³/rev (pocket size)',
      'Max Differential Pressure': '1.5 bar',
      'Material': 'Cast iron / SS 316 (food-grade option)',
      'Drive Power': '0.18 – 3.0 kW'
    },
    features: [
      'Close-tolerance rotor pockets minimise air leakage at pressure boundaries.',
      'Drop-in rotor design allows rapid cleaning or material changeover.',
      'Anti-shear end-plate geometry protects fragile granules from damage.',
      'ATEX Zone 21 certified variant available for combustible dust handling.'
    ],
    manual: 'rotary_airlock_valve_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'dust-collection': {
    id: 'dust-collection',
    name: 'Dust Collection & Filtration Unit',
    sector: 'chemical',
    tag: 'Environmental Control — Dust Collector',
    desc: 'High-efficiency pulse-jet fabric filter dust collector designed to capture and recover airborne particulate from conveying, filling, and processing operations. Pleated polyester or PTFE membrane filter bags achieve sub-1 mg/Nm³ outlet emissions, fully compliant with environmental discharge limits for chemical processing facilities.',
    specs: {
      'Airflow Capacity': '5,000 – 80,000 Nm³/h',
      'Outlet Emission': '< 1 mg/Nm³',
      'Filter Media': 'PTFE membrane on polyester scrim',
      'Pulse Pressure': '5 – 7 bar compressed air',
      'Operating Temperature': 'Up to 200°C continuous'
    },
    features: [
      'PTFE-membrane filter bags achieve sub-1 mg/Nm³ clean-side emissions.',
      'On-line pulse-jet cleaning maintains constant differential pressure.',
      'Modular bag-row design scales airflow capacity without system shutdown.',
      'Hopper-mounted rotary valve enables continuous recovered product discharge.'
    ],
    manual: 'dust_collector_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  'weighing-batching': {
    id: 'weighing-batching',
    name: 'Weighing & Batching System',
    sector: 'chemical',
    tag: 'Process Control — Gravimetric Batching',
    desc: 'Automated multi-ingredient gravimetric batching system with a central weigh hopper suspended on four precision load cells, controlled by a dedicated recipe-management PLC. Sequentially doses multiple raw material streams to ±200 g accuracy per batch, providing full electronic batch records for pharmaceutical-grade traceability.',
    specs: {
      'Batch Accuracy': '±0.1% of batch target weight',
      'Batch Capacity': '200 – 5,000 kg per batch',
      'Ingredient Streams': 'Up to 12 simultaneous feeds',
      'Load Cell Accuracy': 'Class C3 OIML (3,000 divisions)',
      'Cycle Time': '< 4 min per full batch cycle'
    },
    features: [
      'Multi-stream recipe sequencing with PLC-managed ingredient interlocks.',
      'Tare and gross weighing routines ensure ±200 g accuracy per ingredient.',
      'Full electronic batch record with operator ID and timestamp audit trail.',
      'Automatic over-addition correction adjusts next ingredient to compensate.'
    ],
    manual: 'weighing_batching_system_spec.pdf',
    imageUrls: [],
    videoUrl: '',
    modelUrl: ''
  },
  // ─── Water Treatment ──────────────────────────────────────────────────────
  'ro-desal': {
    id: 'ro-desal',
    name: 'RO Desalination Vessel',
    sector: 'water',
    tag: 'High-Pressure RO Desalination',
    desc: 'High-pressure reverse osmosis vessel housing spiral-wound composite polyamide membranes. Designed to force raw seawater feed against semi-permeable membranes under 80 bars of pressure, isolating pure water inside the central tube and rejecting 99.2% of salt ions.',
    specs: {
      'Operating Flow': '25 m³/h feed capacity',
      'Max Temperature': '40°C',
      'Design Pressure': '80.0 bar',
      'Vessel Material': 'FRP (Fiberglass Reinforced)',
      'Salt Rejection': '99.20% minimum salt barrier'
    },
    features: [
      'Multi-port head configurations support daisy-chain piping.',
      'High-grade stainless steel wetted connectors.',
      'Excellent resistance to biological fouling and scale.',
      'Optimized spacers reduce pressure drop across feed sheets.'
    ],
    manual: 'ro_desalination_systems.pdf',
    imageUrls: [],
    videoUrl: "",
    modelUrl: ""
  }
};

class App {
  constructor() {
    this.currentScreen = 'home';
    this.activeSectorId = null;
    this.activeProductId = null;
    
    // Components
    this.threeViewer = null;
    this.fluidSim = null;
    
    // UI elements
    this.screens = {
      home: document.getElementById('screen-home'),
      sector: document.getElementById('screen-sector'),
      product: document.getElementById('screen-product')
    };
    
    // PWA Installation prompt
    this.deferredPrompt = null;
    
    this.init();
  }
  
  init() {
    // 1. Setup SPA router
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Run initial routing matching hash
    this.handleRoute();
    
    // 2. Setup connection listener (visual status indicator)
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
    this.updateOnlineStatus();
    
    // 3. Register Service Worker
    this.registerServiceWorker();
    
    // 5. Setup UI global listeners
    this.setupUIListeners();
  }
  
  updateOnlineStatus() {
    const statusDot = document.getElementById('conn-status-dot');
    const statusText = document.getElementById('conn-status-text');
    if (!statusDot || !statusText) return;
    
    if (navigator.onLine) {
      statusDot.className = 'status-dot online';
      statusText.textContent = 'Online';
    } else {
      statusDot.className = 'status-dot offline';
      statusText.textContent = 'Offline (PWA Cache)';
    }
  }
  
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let reg of registrations) {
          reg.unregister();
        }
      });
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
  
  showUpdateNotification() {
    const banner = document.createElement('div');
    banner.className = 'update-banner';
    banner.innerHTML = `
      <span>A new version of FlowForce is available.</span>
      <button onclick="window.location.reload()">Reload App</button>
    `;
    document.body.appendChild(banner);
  }
  
  setupUIListeners() {
    // 3D Canvas viewer control toggles
    document.getElementById('btn-3d-rotate')?.addEventListener('click', (e) => {
      const active = e.currentTarget.classList.toggle('active');
      this.threeViewer?.toggleAutoRotate(active);
    });
    
    document.getElementById('btn-3d-wireframe')?.addEventListener('click', (e) => {
      const active = e.currentTarget.classList.toggle('active');
      this.threeViewer?.toggleWireframe(active);
    });
    
    // Explode view slider
    const explodeSlider = document.getElementById('slider-explode');
    explodeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.currentTarget.value);
      this.threeViewer?.setExplodedRatio(val);
      const valPct = Math.round(val * 100);
      const outputText = document.getElementById('explode-value');
      if (outputText) outputText.textContent = `${valPct}%`;
    });
    
    // Reset view button
    document.getElementById('btn-3d-reset')?.addEventListener('click', () => {
      if (this.threeViewer) {
        this.threeViewer.setExplodedRatio(0);
        this.threeViewer.toggleWireframe(false);
        this.threeViewer.toggleAutoRotate(true);
        this.threeViewer.setProduct(this.activeProductId);
        
        const wireframeBtn = document.getElementById('btn-3d-wireframe');
        if (wireframeBtn) wireframeBtn.classList.remove('active');
        
        const rotateBtn = document.getElementById('btn-3d-rotate');
        if (rotateBtn) rotateBtn.classList.add('active');
        
        const slider = document.getElementById('slider-explode');
        if (slider) slider.value = 0;
        
        const outputText = document.getElementById('explode-value');
        if (outputText) outputText.textContent = `0%`;
      }
    });
    
    // Video Custom controls
    const playPauseBtn = document.getElementById('btn-video-play');
    playPauseBtn?.addEventListener('click', () => {
      if (this.fluidSim) {
        const isPlaying = this.fluidSim.togglePlay();
        playPauseBtn.innerHTML = isPlaying ? '<span>⏸</span>' : '<span>▶</span>';
      }
    });
    
    // Speed control
    document.getElementById('select-video-speed')?.addEventListener('change', (e) => {
      if (this.fluidSim) {
        this.fluidSim.speed = parseFloat(e.currentTarget.value);
      }
    });
    
    // Flow/Pressure sliders inside video controller
    const flowSlider = document.getElementById('slider-video-flow');
    const pressureSlider = document.getElementById('slider-video-pressure');
    
    const updatePhysics = () => {
      if (this.fluidSim) {
        this.fluidSim.setParameters(
          parseFloat(flowSlider.value),
          parseFloat(pressureSlider.value)
        );
      }
    };
    
    flowSlider?.addEventListener('input', updatePhysics);
    pressureSlider?.addEventListener('input', updatePhysics);
    
    // Tab switching in tech specs panel
    document.querySelectorAll('.specs-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Clear active states
        document.querySelectorAll('.specs-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.specs-content-panel').forEach(p => p.classList.remove('active'));
        
        // Set new active state
        btn.classList.add('active');
        const panelId = `specs-panel-${btn.dataset.tab}`;
        document.getElementById(panelId)?.classList.add('active');
      });
    });
    
    // Hotspot clicked event dispatcher
    document.getElementById('three-viewer-canvas')?.addEventListener('hotspot-clicked', (e) => {
      const data = e.detail;
      const statusBox = document.getElementById('hotspot-info-box');
      if (statusBox) {
        statusBox.innerHTML = `
          <strong>Hotspot Selection: ${data.label}</strong><br>
          <span style="font-size: 11px; opacity: 0.9;">${data.desc}</span>
        `;
        statusBox.classList.add('active');
        
        // Auto-close after 8 seconds
        setTimeout(() => {
          statusBox.classList.remove('active');
        }, 8000);
      }
    });
    
    // Close hotspot panel button
    document.getElementById('hotspot-info-close')?.addEventListener('click', () => {
      document.getElementById('hotspot-info-box')?.classList.remove('active');
    });
    
    // Mock Documentation Download
    document.getElementById('btn-download-doc')?.addEventListener('click', (e) => {
      const prod = PRODUCTS[this.activeProductId];
      if (!prod) return;
      
      e.currentTarget.textContent = 'Preparing PDF Offline...';
      e.currentTarget.style.pointerEvents = 'none';
      
      setTimeout(() => {
        e.currentTarget.textContent = '✓ Document Ready (Simulated)';
        alert(`Offline PWA storage has generated localized copy of document:\n\n📄 ${prod.manual}\n\nThis would normally trigger a direct device filesystem download.`);
        setTimeout(() => {
          e.currentTarget.textContent = 'Download Technical Manual';
          e.currentTarget.style.pointerEvents = 'auto';
        }, 3000);
      }, 1200);
    });
  }
  
  handleRoute() {
    const hash = window.location.hash || '#home';
    console.log('[Router] Navigating to:', hash);
    
    if (hash === '#home') {
      this.activeSectorId = null;
      this.activeProductId = null;
      this.showScreen('home');
      this.updateBreadcrumbs();
    } else if (hash.startsWith('#sector/')) {
      const sectorId = hash.split('/')[1];
      if (SECTORS[sectorId]) {
        this.activeSectorId = sectorId;
        this.activeProductId = null;
        this.renderSectorScreen();
        this.showScreen('sector');
        this.updateBreadcrumbs();
      } else {
        window.location.hash = '#home';
      }
    } else if (hash.startsWith('#product/')) {
      const productId = hash.split('/')[1];
      if (PRODUCTS[productId]) {
        this.activeProductId = productId;
        this.activeSectorId = PRODUCTS[productId].sector;
        this.renderProductScreen();
        this.showScreen('product');
        this.updateBreadcrumbs();
      } else {
        window.location.hash = '#home';
      }
    }
  }
  
  showScreen(screenKey) {
    this.currentScreen = screenKey;
    
    // Switch active classes with transitions
    Object.keys(this.screens).forEach(key => {
      const scr = this.screens[key];
      if (key === screenKey) {
        scr.classList.add('active');
        scr.classList.remove('hidden');
        scr.scrollTop = 0;
      } else {
        scr.classList.remove('active');
        scr.classList.add('hidden');
      }
    });
    
    // Stop interactive rendering loops if we are leaving Screen 3 (product deep dive)
    if (screenKey !== 'product') {
      if (this.threeViewer) {
        this.threeViewer.destroy();
        this.threeViewer = null;
      }
      if (this.fluidSim) {
        this.fluidSim.pause();
        this.fluidSim = null;
      }
      document.getElementById('hotspot-info-box')?.classList.remove('active');
    }
  }
  
  updateBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumbs-list');
    if (!breadcrumbList) return;
    
    let html = '<li><a href="#home">Home Hub</a></li>';
    
    if (this.activeSectorId) {
      const sect = SECTORS[this.activeSectorId];
      html += `<li><span class="crumb-separator">/</span><a href="#sector/${sect.id}">${sect.name}</a></li>`;
    }
    
    if (this.activeProductId) {
      const prod = PRODUCTS[this.activeProductId];
      html += `<li><span class="crumb-separator">/</span><span class="crumb-active">${prod.name}</span></li>`;
    }
    
    breadcrumbList.innerHTML = html;
  }
  
  renderSectorScreen() {
    const sector = SECTORS[this.activeSectorId];
    
    // Sector Info header
    const title = document.getElementById('sector-title');
    const desc = document.getElementById('sector-desc');
    const accent = document.getElementById('sector-accent-bg');
    
    if (title) title.textContent = sector.name;
    if (desc) desc.textContent = sector.desc;
    if (accent) {
      accent.style.background = `radial-gradient(circle at top right, ${sector.color}22 0%, rgba(10,10,12,0) 60%)`;
      // Apply theme glow border color
      document.documentElement.style.setProperty('--sector-accent-color', sector.color);
      document.documentElement.style.setProperty('--accent-color', sector.color);
    }
    
    // Grid list
    const gridContainer = document.getElementById('sector-grid-container');
    if (!gridContainer) return;

    // Group divider labels: product-id → group label shown before that card
    const GROUP_HEADERS = {
      'vacuum-conveying':    'Material Transfer & Handling',
      'bulk-bag-discharger': 'Bulk Handling & Size Reduction',
      'rotary-airlock-valve':'Pneumatic & Process Control',
      'dust-collection':     'Environmental & Weighing Systems'
    };

    let gridHtml = '';
    sector.products.forEach(pId => {
      const prod = PRODUCTS[pId];

      // Inject a full-width section divider when this product starts a new group
      if (GROUP_HEADERS[pId]) {
        gridHtml += `
          <div class="products-grid-group-header">
            <span class="group-label">${GROUP_HEADERS[pId]}</span>
            <span class="group-rule"></span>
          </div>
        `;
      }

      // Determine media preview at the top of the card
      let mediaPreviewHtml = '';
      if (prod.videoUrl) {
        mediaPreviewHtml = `
          <div class="product-card-media-preview">
            <video src="${prod.videoUrl}" controls loop muted playsinline></video>
          </div>
        `;
      } else if (prod.imageUrls && prod.imageUrls.length > 0) {
        mediaPreviewHtml = `
          <div class="product-card-media-preview">
            <img src="${prod.imageUrls[0]}" alt="${prod.name}">
          </div>
        `;
      } else {
        mediaPreviewHtml = `
          <div class="product-card-media-placeholder">
            <div class="placeholder-cube-wrapper">
              <svg class="placeholder-cube-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <g fill="none" stroke="${sector.color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path d="M18 4 L30 11 L30 25 L18 32 L6 25 L6 11 Z" />
                  <path d="M18 18 L18 4" />
                  <path d="M18 18 L30 25" />
                  <path d="M18 18 L6 25" />
                </g>
              </svg>
            </div>
            <span class="placeholder-label">Image / Video Preview</span>
          </div>
        `;
      }

      gridHtml += `
        <div class="product-card glass" onclick="window.location.hash = '#product/${prod.id}'">
          <div class="product-card-glow" style="background: radial-gradient(circle at 50% 50%, ${sector.color}15 0%, transparent 60%);"></div>
          ${mediaPreviewHtml}
          <div class="product-card-meta">
            <span class="product-card-tag">${prod.tag}</span>
            <h3 class="product-card-title">${prod.name}</h3>
            <p class="product-card-desc">${prod.desc}</p>
          </div>
          <div class="product-card-specs">
            <h4>Key Specifications</h4>
            <ul>
              ${Object.entries(prod.specs).slice(0, 3).map(([key, val]) => `
                <li><strong>${key}:</strong> ${val}</li>
              `).join('')}
            </ul>
          </div>
          <div class="product-card-action">
            <span>Explore 3D Model &amp; Telemetry &rarr;</span>
          </div>
        </div>
      `;
    });

    gridContainer.innerHTML = gridHtml;
  }

  
  renderProductScreen() {
    const prod = PRODUCTS[this.activeProductId];
    const sector = SECTORS[prod.sector];
    
    // Update theme accent colors for specific product
    document.documentElement.style.setProperty('--sector-accent-color', sector.color);
    document.documentElement.style.setProperty('--accent-color', sector.color);
    
    // Update text titles and descriptions
    const title = document.getElementById('product-title');
    const tag = document.getElementById('product-tag');
    const sectorTag = document.getElementById('product-sector-tag');
    const mainDesc = document.getElementById('product-main-desc');
    
    if (title) title.textContent = prod.name;
    if (tag) tag.textContent = prod.tag;
    if (sectorTag) {
      sectorTag.textContent = sector.name;
      sectorTag.style.borderColor = sector.color;
      sectorTag.style.color = sector.color;
    }
    if (mainDesc) mainDesc.textContent = prod.desc;
    
    // Render Technical Specs Table (Spec list 1)
    const specsTable = document.getElementById('specs-table-body');
    if (specsTable) {
      specsTable.innerHTML = Object.entries(prod.specs).map(([key, val]) => `
        <tr>
          <td><strong>${key}</strong></td>
          <td>${val}</td>
        </tr>
      `).join('');
    }
    
    // Render Key Features bullet list (Spec list 2)
    const featuresList = document.getElementById('features-bullet-list');
    if (featuresList) {
      featuresList.innerHTML = prod.features.map(feat => `
        <li>
          <span class="bullet-glow" style="background-color: ${sector.color}"></span>
          <span class="bullet-text">${feat}</span>
        </li>
      `).join('');
    }
    
    // Setup tabs - Reset to general spec panel
    document.querySelectorAll('.specs-tab-btn').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.tab === 'general') b.classList.add('active');
    });
    document.querySelectorAll('.specs-content-panel').forEach(p => {
      p.classList.remove('active');
      if (p.id === 'specs-panel-general') p.classList.add('active');
    });
    
    // Render media panel contents (Image Gallery and Video Demo)
    const mediaPanel = document.getElementById('specs-panel-media');
    if (mediaPanel) {
      let mediaHtml = '';
      
      // Image Gallery
      mediaHtml += `<h3 class="panel-subtitle">Product Image Gallery</h3>`;
      if (prod.imageUrls && prod.imageUrls.length > 0) {
        mediaHtml += `
          <div class="image-gallery-placeholder-grid" style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));">
            ${prod.imageUrls.map(url => `
              <div style="border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); aspect-ratio: 1;">
                <img src="${url}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            `).join('')}
          </div>
        `;
      } else {
        mediaHtml += `
          <div class="image-gallery-placeholder-grid">
            <div class="gallery-placeholder-box"><span>🖼️</span><span>Add Image</span></div>
            <div class="gallery-placeholder-box"><span>🖼️</span><span>Add Image</span></div>
            <div class="gallery-placeholder-box"><span>🖼️</span><span>Add Image</span></div>
            <div class="gallery-placeholder-box"><span>🖼️</span><span>Add Image</span></div>
          </div>
        `;
      }
      
      // Video Slot
      mediaHtml += `<h3 class="panel-subtitle" style="margin-top: 2rem;">Product Video Demonstration</h3>`;
      if (prod.videoUrl) {
        mediaHtml += `
          <div class="detail-video-frame">
            <video src="${prod.videoUrl}" controls loop muted playsinline></video>
          </div>
        `;
      } else {
        mediaHtml += `
          <div class="video-placeholder-container">
            <span style="font-size: 1.8rem; opacity: 0.7;">📹</span>
            <span>Add Product Demo Video</span>
          </div>
        `;
      }
      
      mediaPanel.innerHTML = mediaHtml;
    }
    
    // Dynamic CAD Upload Box Label update
    const cadPlaceholder = document.getElementById('cad-upload-placeholder');
    if (cadPlaceholder) {
      if (prod.modelUrl) {
        cadPlaceholder.innerHTML = `<span>📦 CAD Model: ${prod.modelUrl.split('/').pop()}</span>`;
      } else {
        cadPlaceholder.innerHTML = `<span>📂 Upload CAD / 3D Model (.glb, .gltf, .obj)</span>`;
      }
    }
    
    // Reset video control inputs to middle values
    const flowSlider = document.getElementById('slider-video-flow');
    const pressureSlider = document.getElementById('slider-video-pressure');
    if (flowSlider) flowSlider.value = 5;
    if (pressureSlider) pressureSlider.value = 4.5;
    
    const playPauseBtn = document.getElementById('btn-video-play');
    if (playPauseBtn) playPauseBtn.innerHTML = '<span>⏸</span>';
    
    const speedSelect = document.getElementById('select-video-speed');
    if (speedSelect) speedSelect.value = '1.0';
    
    const wireframeBtn = document.getElementById('btn-3d-wireframe');
    if (wireframeBtn) wireframeBtn.classList.remove('active');
    
    const rotateBtn = document.getElementById('btn-3d-rotate');
    if (rotateBtn) rotateBtn.classList.add('active');
    
    const explodeSlider = document.getElementById('slider-explode');
    if (explodeSlider) explodeSlider.value = 0;
    
    const explodeOutput = document.getElementById('explode-value');
    if (explodeOutput) explodeOutput.textContent = '0%';
    
    // Initialize 3D Engine Viewer and Fluid Simulator
    // Need a tiny delay to ensure layouts are correctly computed/rendered before Three.js grabs size dimensions
    setTimeout(() => {
      // 1. Fluid Simulator
      const canvas2d = document.getElementById('fluid-flow-canvas');
      if (canvas2d) {
        this.fluidSim = new FluidSimulation(canvas2d);
        this.fluidSim.setProduct(this.activeProductId);
        this.fluidSim.play();
      }
      
      // 2. Three.js 3D Viewer
      const container3d = document.getElementById('canvas-3d-container');
      const canvas3d = document.getElementById('three-viewer-canvas');
      const hotspotOverlay = document.getElementById('hotspots-overlay-container');
      if (container3d && canvas3d && hotspotOverlay) {
        this.threeViewer = new ThreeViewer(container3d, canvas3d, hotspotOverlay);
        this.threeViewer.setProduct(this.activeProductId);
      }
    }, 100);
  }
}

// Instantiate core app on window DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
});
