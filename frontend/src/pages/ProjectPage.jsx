import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setProjectDetails } from '../shared/store/projectSlice';

export default function ProjectPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coordinates: '-03.4653, -62.2159',
    landArea: 10.0,
    landStatus: 'Degraded',
    waterAvail: 'Rain-fed',
    soilType: 'Loam',
    soilPh: 6.5,
    rainfall: 1240,
    temp: 24.5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    // Generate a pseudo-random project ID
    const projectId = `TRVX-${Math.floor(Math.random() * 10000)}`;
    
    // Save to Redux store
    dispatch(setProjectDetails(formData));
    
    // Navigate to Polygon Drawer Map
    navigate(`/map/${projectId}`);
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-dark font-sans antialiased overflow-hidden h-screen flex flex-col select-none">
      {/* TOP APP BAR */}
      <header className="w-full h-14 bg-white border-b border-stone-200 z-50 flex items-center justify-between px-grid-margin shrink-0">
        <div className="flex items-center gap-unit-6">
          <div className="flex items-center gap-unit-2">
            <span className="w-2.5 h-2.5 bg-emerald-brand"></span>
            <span className="font-label-code text-xs uppercase tracking-widest text-stone-dark font-bold">TERRAVOXEL // GEO-SPATIAL</span>
          </div>
          <div className="h-4 w-px bg-stone-200"></div>
          {/* Navigation & Step Anchor */}
          <div className="flex items-center gap-unit-4">
            <Link to="/" className="font-label-code text-[11px] text-stone-500 hover:text-black flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Return to Dashboard</span>
            </Link>
            <span className="font-label-code text-[11px] text-stone-300">/</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-brand"></span>
              <span className="font-label-code text-[11px] font-semibold text-stone-800">Stage 02: Parameter Terminal</span>
            </div>
          </div>
        </div>
        {/* Right HUD Status Items */}
        <div className="flex items-center gap-unit-6">
          <div className="hidden lg:flex items-center gap-unit-4 font-label-code text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="text-stone-400">SYS_CORE:</span>
              <span className="text-stone-800 font-semibold">TRVX_v2.4</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-stone-400">AOI:</span>
              <span className="text-stone-800 font-semibold">41.40338, 2.17403</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-brand font-semibold">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-brand animate-ping"></span>
              LEVEL-4 CALIBRATED
            </span>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT SPLIT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: 60% SPATIAL CANVAS */}
        <section className="w-full md:w-[60%] h-full relative bg-stone-900 border-r border-stone-200 overflow-hidden flex flex-col">
          {/* Top Floating Navigation Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-stone-300 px-3 py-2 flex items-center gap-3 shadow-[2px_2px_0px_#0F172A]">
              <span className="font-label-code text-[11px] text-stone-400 uppercase font-semibold">CAD_SEARCH:</span>
              <div className="flex items-center gap-1.5 text-stone-800 font-label-code text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-emerald-brand">search</span>
                <input className="bg-transparent border-none p-0 focus:ring-0 font-label-code text-[11px] w-48 text-stone-800" type="text" value="-03.4653° S, -62.2159° W" readOnly />
              </div>
              <span className="px-1.5 py-0.5 bg-stone-100 text-[10px] font-label-code text-stone-500 border border-stone-200">ENTER</span>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="bg-white/90 backdrop-blur-md border border-stone-300 px-3 py-1.5 flex items-center gap-2 shadow-[2px_2px_0px_#0F172A] font-label-code text-[11px] text-stone-800">
                <span className="w-2 h-2 bg-emerald-brand"></span>
                <span>VECTOR: SENTINEL-2 NDVI</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Satellite Spatial Imagery Viewport Placeholder */}
          <div className="relative w-full h-full bg-stone-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 filter contrast-125" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=2000&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border border-emerald-brand/30 relative flex items-center justify-center">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-label-code text-[9px] text-emerald-brand tracking-widest">N 00°00.00'</div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-label-code text-[9px] text-emerald-brand tracking-widest">S 00°00.00'</div>
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 font-label-code text-[9px] text-emerald-brand tracking-widest">W</div>
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 font-label-code text-[9px] text-emerald-brand tracking-widest">E</div>
              </div>
            </div>

            <div className="absolute right-4 bottom-6 bg-white/90 backdrop-blur-md border border-stone-300 px-3 py-1.5 z-20 flex items-center gap-3">
              <div className="w-16 h-1 bg-stone-800 border-b border-t border-white"></div>
              <span className="font-label-code text-[11px] text-stone-800 font-semibold">250 METERS</span>
            </div>

            <div className="absolute bottom-6 left-6 z-20 w-80 bg-white/90 backdrop-blur-md border border-stone-300 p-4 shadow-[4px_4px_0px_#0F172A]">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-brand opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 bg-emerald-brand"></span>
                  </span>
                  <span className="font-label-code text-[11px] font-bold tracking-wider text-stone-800 uppercase">LIVE TELEMETRY STREAM</span>
                </div>
                <span className="font-label-code text-[10px] text-stone-400">FREQ: 10Hz</span>
              </div>
              <div className="space-y-1.5 font-label-code text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">COORDINATES LOCKED:</span>
                  <span className="text-stone-800 font-semibold">[-03.4653° S, -62.2159° W]</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">CADASTRAL ID:</span>
                  <span className="text-stone-800 font-semibold">TRVX-7709</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: 40% PARAMETER TERMINAL */}
        <section className="w-full md:w-[40%] h-full flex flex-col bg-cream-surface relative overflow-hidden">
          {/* Terminal Header */}
          <div className="p-6 pb-4 border-b border-stone-200 bg-white/70 backdrop-blur-sm shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-code text-[11px] text-stone-500 font-semibold tracking-wider">Config Node // Specification</span>
              <span className="font-label-code text-[11px] px-2 py-0.5 bg-stone-100 text-stone-800 border border-stone-300">Sys v2.4</span>
            </div>
            <h1 className="font-headline text-2xl text-stone-800 tracking-tight font-semibold">Parameter Terminal</h1>
            <p className="font-label-code text-[11px] text-stone-600 mt-0.5">Configure input attributes for revenue blueprint</p>
          </div>

          {/* Scrollable Configuration Cards Zone */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
            
            {/* CARD 1: TERRAIN & CAPACITY */}
            <div className="bg-[#FAF7F2] border border-stone-300 p-5 shadow-[2px_2px_0px_#0F172A] transition-all hover:border-stone-400">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-800"></span>
                  <h2 className="font-headline text-base text-stone-800 uppercase font-semibold">Terrain & Capacity</h2>
                </div>
                <span className="font-label-code text-[11px] text-stone-400">SEC_01</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Land Area (Acres)</label>
                    <span className="font-label-code text-[11px] text-emerald-brand font-semibold">RANGE: 1.0 - 100.0</span>
                  </div>
                  <div className="flex items-center relative">
                    <input 
                      name="landArea"
                      className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 focus:ring-1 focus:ring-stone-800 rounded-none outline-none" 
                      max="100" min="1" step="0.5" type="number" 
                      value={formData.landArea}
                      onChange={handleChange}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-code text-[11px] text-stone-400 bg-stone-100 px-1.5 py-0.5 border border-stone-200">ACRES</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Land Status</label>
                  </div>
                  <div className="relative">
                    <select 
                      name="landStatus"
                      value={formData.landStatus}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 pr-8 focus:ring-1 focus:ring-stone-800 appearance-none rounded-none cursor-pointer outline-none"
                    >
                      <option value="Barren">Barren</option>
                      <option value="Degraded">Degraded</option>
                      <option value="Cultivated">Cultivated</option>
                      <option value="Fallow">Fallow</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: SOIL & HYDROLOGY */}
            <div className="bg-[#FAF7F2] border border-stone-300 p-5 shadow-[2px_2px_0px_#0F172A] transition-all hover:border-stone-400">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-800"></span>
                  <h2 className="font-headline text-base text-stone-800 uppercase font-semibold">Soil & Hydrology</h2>
                </div>
                <span className="font-label-code text-[11px] text-stone-400">SEC_02</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-code text-[11px] text-stone-600 uppercase font-medium mb-1.5">Water Availability</label>
                  <div className="relative">
                    <select 
                      name="waterAvail"
                      value={formData.waterAvail}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 pr-8 focus:ring-1 focus:ring-stone-800 appearance-none rounded-none cursor-pointer outline-none"
                    >
                      <option value="Rain-fed">Rain-fed</option>
                      <option value="Seasonal Canal">Seasonal Canal</option>
                      <option value="Borewell">Borewell</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-code text-[11px] text-stone-600 uppercase font-medium mb-1.5">Soil Type</label>
                  <div className="relative">
                    <select 
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 pr-8 focus:ring-1 focus:ring-stone-800 appearance-none rounded-none cursor-pointer outline-none"
                    >
                      <option value="Loam">Loam</option>
                      <option value="Red">Red</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Clay">Clay</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: CLIMATE BASELINE */}
            <div className="bg-[#FAF7F2] border border-stone-300 p-5 shadow-[2px_2px_0px_#0F172A] transition-all hover:border-stone-400">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-800"></span>
                  <h2 className="font-headline text-base text-stone-800 uppercase font-semibold">Climate Baseline</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-brand text-[10px] font-label-code font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-brand"></span>
                  Manual Entry Mode
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Annual Rainfall (mm)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      name="rainfall"
                      className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 focus:ring-1 focus:ring-stone-800 outline-none" 
                      max="2500" min="300" step="10" type="number" 
                      value={formData.rainfall}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER: THE HANDOFF ACTION */}
          <div className="p-6 pt-4 bg-white border-t border-stone-200 shrink-0">
            <button 
              onClick={handleCalculate}
              className="w-full py-3.5 px-4 bg-emerald-brand text-white font-label-code text-sm font-bold border border-stone-800 transition-all duration-150 shadow-[4px_4px_0px_#0F172A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:bg-emerald-600 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Calculate & Proceed</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
