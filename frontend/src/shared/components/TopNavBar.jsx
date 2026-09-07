import { Link } from 'react-router-dom';

export default function TopNavBar() {
  return (
    <>
      {/* HUD Telemetric Top Coordinate Ticker Strip */}
      <div className="w-full bg-cream-surface hairline-b px-grid-margin py-1.5 z-50 flex justify-between items-center text-stone-subtle font-label-code text-[10px] tracking-wider uppercase">
        <div className="flex items-center space-x-unit-4">
          <span className="flex items-center text-stone-dark font-semibold">
            <span className="inline-block w-2 h-2 bg-emerald-bright rounded-full mr-2 shadow-[0_0_8px_#10B981] animate-pulse"></span>
            STATUS: ONLINE // ORBITAL_LIDAR_v4.2
          </span>
          <span className="hidden sm:inline-block text-stone-border">|</span>
          <span className="hidden sm:inline-block">SENSOR: MULTI-SPECTRAL EMISSION MATRIX [ALT: 780KM]</span>
        </div>
        <div className="flex items-center space-x-unit-4">
          <span className="text-stone-dark font-label-code font-medium">LAT: -03.4653° LON: -62.2159°</span>
          <span className="text-stone-border">|</span>
          <span className="font-label-code text-emerald-brand font-semibold">RESOLUTION: 0.12M²/VOXEL</span>
        </div>
      </div>
      {/* Shared Component: TopNavBar */}
      <header className="bg-cream-surface/95 backdrop-blur-sm text-stone-dark border-b border-stone-border docked full-width top-0 z-40 sticky">
        <div className="flex justify-between items-center w-full px-grid-margin max-w-[1440px] mx-auto h-16">
          {/* Brand Anchor */}
          <div className="flex items-center space-x-unit-3">
            <div className="w-7 h-7 bg-emerald-brand text-white flex items-center justify-center font-label-code text-xs font-bold border border-emerald-brand shadow-[1px_1px_0px_0px_#18181B]">
              TV
            </div>
            <Link to="/" className="font-headline font-bold text-lg tracking-tight text-stone-dark uppercase flex items-center gap-2">
              <span>TERRAVOXEL</span>
              <span className="text-xs font-label-code font-normal text-stone-subtle tracking-widest pl-2 border-l border-stone-border">// GEO-SPATIAL</span>
            </Link>
          </div>
          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-unit-8 h-full">
            <a className="text-emerald-brand border-b-2 border-emerald-brand pb-0.5 font-label-code text-xs uppercase tracking-wider flex items-center gap-1.5 font-semibold" href="#hero">
              <span className="w-1.5 h-1.5 bg-emerald-bright rounded-full"></span>
              Telemetry
            </a>
            <a className="text-stone-subtle hover:text-stone-dark font-label-code text-xs uppercase tracking-wider transition-colors" href="#workflow">
              Workflow
            </a>
            <a className="text-stone-subtle hover:text-stone-dark font-label-code text-xs uppercase tracking-wider transition-colors" href="#action-section">
              Initiate Plot
            </a>
          </nav>
          {/* Trailing Action Cluster */}
          <div className="flex items-center space-x-unit-3">
            <a className="border border-stone-border bg-cream-surface px-unit-3 py-1.5 font-label-code text-xs tracking-wider hover:border-stone-dark transition-colors text-stone-dark hidden sm:inline-flex items-center gap-1" href="#workflow">
              <span className="w-1.5 h-1.5 bg-emerald-bright rounded-full"></span>
              <span>SPEC_DOCS</span>
            </a>
            <Link to="/project/new" className="bg-stone-dark text-white border border-stone-dark px-unit-4 py-1.5 font-label-code text-xs font-semibold tracking-wider hover:bg-emerald-brand hover:border-emerald-brand transition-all duration-150 flex items-center gap-2 shadow-[2px_2px_0px_0px_#059669]">
              <span className="material-symbols-outlined text-sm text-emerald-glow">terminal</span>
              <span>GET STARTED</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
