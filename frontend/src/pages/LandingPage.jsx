import { Link } from 'react-router-dom';
import TopNavBar from '../shared/components/TopNavBar';
import GlobeVisualization from './GlobeVisualization';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-dark antialiased selection:bg-emerald-subtle selection:text-[#065F46] relative" style={{backgroundColor: '#EFF5ED', backgroundImage: 'linear-gradient(to right, rgba(90, 115, 95, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(90, 115, 95, 0.08) 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
      <TopNavBar />
      
      {/* MAIN CANVAS */}
      <main className="flex-grow flex flex-col items-center w-full relative">
        {/* SECTION 1: THE 3D EARTH GLOBE HERO */}
        <section className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center pt-unit-8 pb-unit-10 px-grid-margin overflow-hidden border-b border-stone-border bg-transparent" id="hero">
          <div className="absolute top-4 left-6 pointer-events-none z-30 font-label-code text-[10px] text-stone-subtle uppercase tracking-widest flex items-center space-x-2">
            <span className="inline-block w-2 h-2 border-t border-l border-emerald-brand"></span>
            <span>ORBITAL_SECTOR: S-AMERICA // EQUATORIAL CANOPY</span>
          </div>
          <div className="absolute top-4 right-6 pointer-events-none z-30 font-label-code text-[10px] text-stone-subtle uppercase tracking-widest flex items-center space-x-2">
            <span>VOXEL_SCALE: 0.125m³</span>
            <span className="inline-block w-2 h-2 border-t border-r border-emerald-brand"></span>
          </div>
          
          <div className="relative z-30 text-center max-w-4xl mx-auto mt-2">
            <div className="inline-flex items-center space-x-unit-2 border border-emerald-brand/40 px-3 py-1 bg-cream-surface mb-unit-4 shadow-[2px_2px_0px_0px_#10B981]">
              <span className="w-2 h-2 bg-emerald-bright rounded-full shadow-[0_0_6px_#10B981] animate-pulse"></span>
              <span className="font-label-code text-[11px] font-bold tracking-widest text-stone-dark uppercase">VOXELIZED BIOMASS INVENTORY SYSTEM</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl font-extrabold text-stone-dark tracking-tight leading-[1.08] select-none">
              Evaluate Your Land for Carbon Investment.
            </h1>
            <p className="font-label-code text-xs md:text-sm text-stone-subtle tracking-wider mt-unit-3 uppercase">
              SUB-CANOPY DENSITY EXTRACTION // MULTI-SPECTRAL EMISSION TELEMETRY
            </p>
          </div>

          <div className="relative w-full max-w-5xl my-auto py-unit-2 z-20 flex items-center justify-center">
            <div className="absolute inset-0 pointer-events-none border border-stone-border/70 z-20 flex flex-col justify-between p-3">
              <div className="flex justify-between font-label-code text-[9px] text-stone-subtle tracking-widest">
                <span className="bg-cream-surface/90 px-2 py-0.5 border border-stone-border flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-bright"></span>[ORBIT: GEOSYNC 12.4° W]
                </span>
                <span className="bg-cream-surface/90 px-2 py-0.5 border border-stone-border text-emerald-brand font-bold">[SURFACE CARBON FLUX: 842.1 tCO2e]</span>
              </div>
              <div className="flex justify-between items-center pointer-events-none px-2 opacity-60">
                <span className="text-[9px] font-label-code text-stone-subtle">+ LAT 00° 00' 00"</span>
                <span className="text-[9px] font-label-code text-stone-subtle">LON 00° 00' 00" +</span>
              </div>
              <div className="flex justify-between font-label-code text-[9px] text-stone-subtle tracking-widest">
                <span className="bg-cream-surface/90 px-2 py-0.5 border border-stone-border text-stone-dark">[ECOLOGICAL NODES: 2,490 ACTIVE]</span>
                <span className="bg-cream-surface/90 px-2 py-0.5 border border-emerald-brand/50 text-emerald-brand font-semibold">[AOI: AMAZON BASIN POLYGON]</span>
              </div>
            </div>
            <GlobeVisualization />
          </div>

          <div className="w-full max-w-5xl z-30 grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone-border border border-stone-border text-center shadow-sm">
            <div className="bg-cream-surface p-unit-3">
              <div className="font-label-code text-[10px] text-stone-subtle tracking-wider uppercase">AGGREGATED VOXELS</div>
              <div className="font-label-code text-sm font-bold text-stone-dark">1,849,204,112 V³</div>
            </div>
            <div className="bg-cream-surface p-unit-3">
              <div className="font-label-code text-[10px] text-stone-subtle tracking-wider uppercase">CARBON CONFIDENCE</div>
              <div className="font-label-code text-sm font-bold text-emerald-brand flex items-center justify-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-bright"></span>99.82% VERIFIED
              </div>
            </div>
            <div className="bg-cream-surface p-unit-3">
              <div className="font-label-code text-[10px] text-stone-subtle tracking-wider uppercase">SURFACE ELEVATION</div>
              <div className="font-label-code text-sm font-bold text-stone-dark">142.34m MSL</div>
            </div>
            <div className="bg-cream-surface p-unit-3">
              <div className="font-label-code text-[10px] text-stone-subtle tracking-wider uppercase">CADASTRE STATE</div>
              <div className="font-label-code text-sm font-bold text-emerald-brand">LOCKED // ETH-ERC3643</div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-stone-subtle font-label-code text-[10px] pt-unit-4 tracking-widest max-w-5xl">
            <span>[SYS_CLK: 14:22:08 UTC]</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-brand animate-bounce">
              <span>WORKFLOW SPECIFICATION</span>
              <span className="material-symbols-outlined text-xs">arrow_downward</span>
            </span>
            <span>[CRC32: 0x88F10A]</span>
          </div>
        </section>

        {/* SECTION 2: SCROLL NARRATIVE & 3-STEP INSTRUCTION WORKFLOW */}
        <section className="w-full max-w-[1440px] px-grid-margin py-unit-20 flex flex-col items-center justify-center relative border-b border-stone-border" id="workflow">
          <div className="absolute inset-y-0 left-1/2 w-px bg-stone-border/40 pointer-events-none -translate-x-1/2"></div>
          
          <div className="relative z-10 flex items-center space-x-unit-3 mb-unit-6 bg-cream-surface px-unit-4 py-1.5 border border-emerald-brand/50 shadow-[2px_2px_0px_0px_#10B981]">
            <span className="w-2 h-2 bg-emerald-bright rounded-full"></span>
            <span className="font-label-code text-xs uppercase tracking-widest text-stone-dark font-bold">
              [REF_ID: TRVX-7709-ALPHA] // EXECUTION PROTOCOL
            </span>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 mb-unit-12">
            <p className="font-headline text-xl sm:text-2xl md:text-3xl text-stone-dark font-semibold leading-snug tracking-tight">
              This platform analyzes local soil and climate data to recommend profitable plantation strategies. Enter your exact location below to generate a 10-year carbon sequestration and ROI blueprint.
            </p>
            <div className="flex items-center justify-center gap-2 mt-unit-4">
              <span className="h-0.5 w-10 bg-emerald-bright"></span>
              <span className="font-label-code text-xs text-stone-subtle tracking-wider uppercase">VERRA &amp; GOLD STANDARD CALIBRATED PIPELINE</span>
              <span className="h-0.5 w-10 bg-emerald-bright"></span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-unit-6">
            {/* Step 01 */}
            <div className="bg-cream-surface border-2 border-stone-dark p-unit-6 relative group hover:border-emerald-brand transition-all duration-200 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[4px_4px_0px_0px_#059669]">
              <div className="flex justify-between items-center mb-unit-4 hairline-b pb-unit-3">
                <span className="font-label-code text-xs font-bold text-emerald-brand bg-emerald-subtle px-2.5 py-1 border border-emerald-bright/30">
                  STEP 01
                </span>
                <span className="material-symbols-outlined text-stone-dark group-hover:text-emerald-brand transition-colors">location_on</span>
              </div>
              <h3 className="font-headline text-base font-bold text-stone-dark mb-2 tracking-tight">
                Locate Your Land
              </h3>
              <p className="font-sans text-xs text-stone-subtle leading-relaxed">
                Just type in your coordinates or drop a pin on the map. We’ll handle the boundary mapping and calculate the exact area for you.
              </p>
            </div>
            {/* Step 02 */}
            <div className="bg-cream-surface border-2 border-stone-dark p-unit-6 relative group hover:border-emerald-brand transition-all duration-200 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[4px_4px_0px_0px_#059669]">
              <div className="flex justify-between items-center mb-unit-4 hairline-b pb-unit-3">
                <span className="font-label-code text-xs font-bold text-emerald-brand bg-emerald-subtle px-2.5 py-1 border border-emerald-bright/30">
                  STEP 02
                </span>
                <span className="material-symbols-outlined text-stone-dark group-hover:text-emerald-brand transition-colors">satellite_alt</span>
              </div>
              <h3 className="font-headline text-base font-bold text-stone-dark mb-2 tracking-tight">
                Analyze the Environment
              </h3>
              <p className="font-sans text-xs text-stone-subtle leading-relaxed">
                We automatically pull local historical weather, rainfall, and soil data for your exact spot to figure out which trees will grow best.
              </p>
            </div>
            {/* Step 03 */}
            <div className="bg-cream-surface border-2 border-stone-dark p-unit-6 relative group hover:border-emerald-brand transition-all duration-200 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[4px_4px_0px_0px_#059669]">
              <div className="flex justify-between items-center mb-unit-4 hairline-b pb-unit-3">
                <span className="font-label-code text-xs font-bold text-emerald-brand bg-emerald-subtle px-2.5 py-1 border border-emerald-bright/30">
                  STEP 03
                </span>
                <span className="material-symbols-outlined text-stone-dark group-hover:text-emerald-brand transition-colors">analytics</span>
              </div>
              <h3 className="font-headline text-base font-bold text-stone-dark mb-2 tracking-tight">
                Get Your 10-Year Plan
              </h3>
              <p className="font-sans text-xs text-stone-subtle leading-relaxed">
                See exactly what to plant, how much it will cost to start, and the total profit you can make from carbon credits over the next decade.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE ACTION AREA & PRIMARY GET STARTED CTA */}
        <section className="w-full max-w-[1440px] px-grid-margin py-unit-24 flex flex-col items-center justify-center relative overflow-hidden" id="action-section">
          <div className="absolute top-8 left-12 font-label-code text-[10px] text-stone-subtle uppercase tracking-widest hidden md:block">
            [DISPATCH_PROTOCOL: INITIALIZE_01]
          </div>
          <div className="absolute bottom-8 right-12 font-label-code text-[10px] text-stone-subtle uppercase tracking-widest hidden md:block">
            [STATUS: ZERO_VARIANCE_CALIBRATION]
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
            <div className="inline-flex items-center space-x-2.5 font-label-code text-xs font-semibold text-stone-dark uppercase tracking-wider mb-unit-6 px-unit-4 py-2 bg-cream-surface border border-emerald-brand/40 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-bright opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-bright"></span>
              </span>
              <span>Step 1 of 3: Locate your plot to begin environmental analysis.</span>
            </div>
            
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-stone-dark mb-unit-3 tracking-tight">
              Ready to Unlock Your Land’s Capital Potential?
            </h2>
            <p className="font-sans text-stone-subtle text-sm max-w-lg mb-unit-8 leading-relaxed">
              Initiate geospatial ingestion to access multi-spectral biomass calculations, native species recommendations, and projected yield models.
            </p>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-stone-dark translate-x-1.5 translate-y-1.5 transition-transform duration-150 group-hover:translate-x-2.5 group-hover:translate-y-2.5"></div>
              <Link to="/project/new" className="relative inline-flex items-center justify-center space-x-3 bg-emerald-brand hover:bg-[#047857] text-white px-unit-12 py-unit-4 font-action-cta text-base font-bold uppercase tracking-wider border-2 border-stone-dark transition-all duration-150 text-center cursor-pointer shadow-lg">
                <span>GET STARTED</span>
                <span className="material-symbols-outlined text-lg font-bold text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
            
            <div className="mt-unit-6 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-unit-4 text-[11px] font-label-code text-stone-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-bright"></span>
                NO CREDIT CARD REQUIRED
              </span>
              <span className="hidden sm:inline text-stone-border">|</span>
              <span>INSTANT VECTOR MAPPING</span>
              <span className="hidden sm:inline text-stone-border">|</span>
              <span className="text-emerald-brand font-semibold">VERRA-COMPLIANT OUTPUTS</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cream-surface text-stone-dark font-label-code text-xs border-t border-stone-border docked full-width bottom z-30">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-grid-margin py-unit-8 max-w-[1440px] mx-auto gap-unit-4">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-unit-4 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-brand"></div>
              <span className="font-headline text-sm text-stone-dark uppercase font-extrabold tracking-tight">
                TERRAVOXEL
              </span>
            </div>
            <span className="hidden md:inline-block text-stone-border">|</span>
            <span className="text-stone-subtle text-[11px]">
              © 2025 TERRAVOXEL INSTITUTIONAL BIOMASS TELEMETRY. ZERO-VARIANCE VERIFIED REPOSITORY.
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-unit-6 text-center text-[11px]">
            <a className="text-stone-subtle hover:text-emerald-brand font-label-code uppercase tracking-wider transition-colors" href="#">AOI Protocol</a>
            <a className="text-stone-subtle hover:text-emerald-brand font-label-code uppercase tracking-wider transition-colors" href="#">LiDAR Core Spec</a>
            <a className="text-stone-subtle hover:text-emerald-brand font-label-code uppercase tracking-wider transition-colors" href="#">Registry API</a>
            <a className="text-stone-subtle hover:text-emerald-brand font-label-code uppercase tracking-wider transition-colors" href="#">Cryptographic Ledger</a>
            <a className="text-stone-subtle hover:text-emerald-brand font-label-code uppercase tracking-wider transition-colors" href="#">Privacy Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
