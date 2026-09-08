import React from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export default function Scene3DPage() {
  return (
    <div className="bg-alabaster text-slatePrimary font-sans antialiased overflow-hidden select-none h-screen w-screen flex flex-col">
      

<header className="relative z-30 h-16 border-b border-slate-200/80 glass-panel px-6 flex items-center justify-between">
<div className="flex items-center space-x-4">

<div className="w-9 h-9 bg-emeraldAccent rounded-sm shadow-[0_2px_10px_rgba(16,185,129,0.3)] flex items-center justify-center border border-white/50">
<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
<line x1="12" x2="12" y1="22.08" y2="12" />
</svg>
</div>
<div>
<div className="flex items-center space-x-2">
<h1 className="font-paprika text-lg font-bold tracking-tight text-slatePrimary">Terrascope</h1>
<span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-200/80">VOXEL-ENGINE V2.4</span>
</div>
<p className="text-xs text-slateSecondary flex items-center gap-1.5 font-sans">
<span>3D Terrain &amp; Growth Simulation</span>
<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
<span className="text-emerald-700 font-medium font-mono text-[11px]">Active Model</span>
</p>
</div>
</div>

<div className="hidden md:flex items-center space-x-2 bg-slate-100/90 p-1 rounded-sm border border-slate-200/90 shadow-inner">

<button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-emeraldAccent hover:bg-emeraldHover text-white font-medium text-xs shadow-sm btn-blocky">
<svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
<rect height="16" rx="1" width="4" x="6" y="4" />
<rect height="16" rx="1" width="4" x="14" y="4" />
</svg>
<span className="font-mono font-semibold">Simulating</span>
</button>

<div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white text-slatePrimary font-medium text-xs border border-slate-200/70 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
<svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<path d="M2 12l10-7 10 7-10 7-10-7z" />
<path d="M2 17l10 7 10-7" />
</svg>
<span className="font-mono text-slate-700">Alabaster Voxel Basin - Sector 4</span>
<svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<polyline points="6 9 12 15 18 9" />
</svg>
</div>

<div className="px-2.5 py-1.5 text-[11px] font-mono text-slateSecondary flex items-center gap-1.5">
<span className="text-slate-400">Biome:</span>
<span className="font-semibold text-slatePrimary">Montane Flora</span>
</div>
</div>

<div className="flex items-center space-x-3">
<div className="hidden lg:flex flex-col text-right">
<span className="text-[10px] uppercase font-mono text-slate-400">Atmosphere Shader</span>
<span className="text-xs font-mono font-semibold text-emerald-700">Sunlit Raytracing v3</span>
</div>
<div className="h-6 w-px bg-slate-200 hidden lg:block"></div>
<button className="px-3.5 py-1.5 text-xs font-medium text-slatePrimary bg-white/90 border border-slate-200 rounded-sm hover:bg-slate-50 btn-blocky flex items-center gap-2 shadow-sm font-mono">
<svg className="w-3.5 h-3.5 text-emeraldAccent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
<polyline points="7 10 12 15 17 10" />
<line x1="12" x2="12" y1="15" y2="3" />
</svg>
<span>Export Data/Report</span>
</button>
</div>
</header>

<main className="relative flex-1 w-full h-full sky-gradient-canvas overflow-hidden">

<div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
<div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-100/60 via-emerald-100/30 to-transparent blur-3xl"></div>
<div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-white/50 blur-3xl"></div>
</div>

<div className="absolute inset-0 flex items-center justify-center pr-0 lg:pr-[410px]">
  <Canvas className="w-full h-full cursor-grab active:cursor-grabbing" camera={{ position: [15, 12, 15], fov: 45 }} shadows>
    <ambientLight intensity={0.6} color="#C8E6FF" />
    <directionalLight position={[10, 20, 10]} intensity={2.2} color="#FFF5C8" castShadow />
    
    {/* Base Terrain Platform */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[20, 20, 1]} />
      <meshStandardMaterial color="#10B981" />
    </mesh>
    
    {/* Soil Layer */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <boxGeometry args={[19.8, 19.8, 1]} />
      <meshStandardMaterial color="#713F12" />
    </mesh>

    {/* Placeholder Tree 1 */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1.2, 2, 1.2]} />
      <meshStandardMaterial color="#34D399" />
    </mesh>
    <mesh position={[0, -0.2, 0]} castShadow>
      <boxGeometry args={[0.4, 1, 0.4]} />
      <meshStandardMaterial color="#451A03" />
    </mesh>

    {/* Placeholder Tree 2 */}
    <mesh position={[4, 1, -3]} castShadow>
      <boxGeometry args={[1.8, 2.5, 1.8]} />
      <meshStandardMaterial color="#10B981" />
    </mesh>
    <mesh position={[4, -0.2, -3]} castShadow>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="#451A03" />
    </mesh>

    {/* Placeholder Tree 3 */}
    <mesh position={[-5, 0.2, 4]} castShadow>
      <boxGeometry args={[0.8, 1.5, 0.8]} />
      <meshStandardMaterial color="#34D399" />
    </mesh>
    <mesh position={[-5, -0.2, 4]} castShadow>
      <boxGeometry args={[0.3, 0.8, 0.3]} />
      <meshStandardMaterial color="#451A03" />
    </mesh>

    <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
  </Canvas>
</div>

<div className="absolute top-5 left-8 z-10 flex items-center space-x-3 bg-white/75 backdrop-blur-md px-3.5 py-2 rounded-sm border border-white/90 shadow-sm">
<span className="inline-block w-2.5 h-2.5 rounded-none bg-emeraldAccent animate-ping"></span>
<span className="text-xs font-mono text-slateSecondary">Voxel Terrain: <strong className="text-slatePrimary">Montane Basin A</strong></span>
<span className="text-slate-300">|</span>
<span className="text-xs font-mono text-slateSecondary">Grid Scale: <strong className="text-emerald-700 font-semibold">1.0m³ Cells</strong></span>
<span className="text-slate-300">|</span>
<span className="text-xs font-mono text-slateSecondary">Sun Azimuth: <strong className="text-slatePrimary">134° / 42° Alt</strong></span>
</div>

<aside className="absolute top-5 right-6 bottom-6 w-[410px] max-w-[calc(100vw-3rem)] z-20 flex flex-col bg-white/70 backdrop-blur-md backdrop-saturate-[160%] border border-white/90 shadow-xl rounded-sm overflow-hidden">

<div className="p-6 border-b border-slate-200/70 bg-white/40">
<div className="flex items-start justify-between">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-emerald-800 bg-[#D1FAE5] border border-emerald-300/80 px-2 py-0.5 rounded-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Simulation Running
              </span>
<span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm border border-slate-200">
                Year 14 Active
              </span>
</div>
<h2 className="font-paprika text-2xl font-bold text-slatePrimary leading-snug">
              Growth Simulation
            </h2>
</div>
<div className="text-right">
<span className="text-[10px] uppercase font-mono text-slateSecondary block">Project Ref</span>
<span className="font-mono text-xs font-bold text-slatePrimary bg-white/90 px-2 py-1 rounded-sm border border-slate-200 block mt-0.5 shadow-xs">
              PRJ-VX-9082
            </span>
</div>
</div>
</div>

<div className="flex-1 overflow-y-auto p-6 space-y-6">

<div className="p-4 rounded-sm bg-gradient-to-b from-white/90 to-white/60 border border-white/95 shadow-sm space-y-3">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-slateSecondary uppercase tracking-wider font-mono">Growth Timeline</span>
<span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-sm border border-emerald-200">
              Year 14 / 30
            </span>
</div>

<div className="py-1">
<input className="w-full h-2 bg-slate-200 rounded-sm appearance-none cursor-pointer accent-emerald-500 focus:outline-none" max="30" min="1" type="range" value="14"/>
<div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1.5">
<span>Year 1 (Planting)</span>
<span className="text-emerald-700 font-semibold">Current: Y14</span>
<span>Year 30 (Mature)</span>
</div>
</div>

<div className="flex items-center justify-between pt-1 border-t border-slate-100">
<div className="flex items-center space-x-1.5">

<button className="w-7 h-7 rounded-sm bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 btn-blocky">
<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<polygon points="19 20 9 12 19 4 19 20" />
<line x1="5" x2="5" y1="19" y2="5" />
</svg>
</button>

<button className="w-7 h-7 rounded-sm bg-emeraldAccent text-white flex items-center justify-center btn-blocky shadow-sm hover:bg-emeraldHover">
<svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
<rect height="16" rx="1" width="4" x="6" y="4" />
<rect height="16" rx="1" width="4" x="14" y="4" />
</svg>
</button>

<button className="w-7 h-7 rounded-sm bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 btn-blocky">
<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<polygon points="5 4 15 12 5 20 5 4" />
<line x1="19" x2="19" y1="5" y2="19" />
</svg>
</button>
</div>

<div className="flex items-center space-x-1 font-mono text-[11px]">
<span className="text-[10px] text-slate-400 mr-1">Speed:</span>
<button className="px-2 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600">1x</button>
<button className="px-2 py-0.5 rounded-sm bg-emeraldAccent text-white font-bold">2x</button>
<button className="px-2 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600">5x</button>
</div>
</div>
</div>

<div className="space-y-4">

<div className="p-4 rounded-sm bg-white/80 border border-slate-200/80 shadow-xs">
<div className="flex items-start justify-between">
<div>
<span className="text-[10px] font-mono text-slateSecondary uppercase tracking-wider block">Carbon Yield Meter</span>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-mono text-3xl font-bold tracking-tight text-slatePrimary">1,245</span>
<span className="font-mono text-xs font-semibold text-slate-500 uppercase">Credits</span>
</div>
<span className="text-xs text-slate-500 font-sans mt-0.5 block">Total Carbon Credits Accrued</span>
</div>
<span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-800 bg-[#D1FAE5] border border-emerald-300/80 px-2 py-1 rounded-sm">
<svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
<polyline points="18 15 12 9 6 15" />
</svg>
                +18.4% YoY
              </span>
</div>
</div>

<div className="p-4 rounded-sm bg-white/80 border border-slate-200/80 space-y-2">
<div className="flex items-center justify-between text-xs font-mono">
<span className="text-slateSecondary uppercase font-semibold text-[10px]">Carbon Sequestered</span>
<span className="text-emerald-700 font-bold">84.3%</span>
</div>

<div className="w-full bg-[#D1FAE5] h-2.5 rounded-sm overflow-hidden p-0.5 border border-emerald-200/70">
<div className="bg-[#10B981] h-full rounded-xs transition-all duration-500" ></div>
</div>
<div className="flex items-center justify-between text-[11px] font-mono text-slateSecondary pt-0.5">
<span className="text-slatePrimary font-semibold">842.6 tCO₂e</span>
<span className="text-slate-400">Target: 1,000 tCO₂e</span>
</div>
</div>
</div>

<div className="grid grid-cols-2 gap-3">

<div className="p-3.5 bg-white/80 border border-slate-200/80 rounded-sm">
<span className="text-[10px] font-mono text-slateSecondary uppercase block">Avg Tree Height</span>
<div className="flex items-baseline gap-1.5 mt-1">
<span className="font-mono text-2xl font-bold text-purpleAccent">4.2</span>
<span className="font-mono text-xs font-medium text-slateSecondary">m</span>
</div>
<div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-purple-700 font-medium">
<svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
<polyline points="18 15 12 9 6 15" />
</svg>
<span>+1.1m growth (Y14)</span>
</div>
</div>

<div className="p-3.5 bg-white/80 border border-slate-200/80 rounded-sm">
<span className="text-[10px] font-mono text-slateSecondary uppercase block">Canopy Density</span>
<div className="flex items-baseline gap-1.5 mt-1">
<span className="font-mono text-2xl font-bold text-slatePrimary">78.4%</span>
</div>
<span className="inline-block mt-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded-sm">
              Voxel Canopy: Dense
            </span>
</div>

<div className="col-span-2 p-3.5 bg-white/80 border border-slate-200/80 rounded-sm flex items-center justify-between">
<div>
<span className="text-[10px] font-mono text-slateSecondary uppercase block">Total Voxel Flora Count</span>
<span className="font-mono text-xl font-bold text-slatePrimary mt-0.5 block">3,480 <span className="text-xs text-slate-500 font-normal font-sans">units</span></span>
</div>
<div className="text-right">
<span className="text-[10px] font-mono text-slate-400 uppercase block">Survival Rate</span>
<span className="font-mono text-sm font-bold text-emerald-700">96.2%</span>
</div>
</div>
</div>
</div>

<div className="p-4 border-t border-slate-200/70 bg-white/60 flex items-center justify-between">
<div className="flex items-center gap-2 text-xs font-mono text-slateSecondary">
<span className="inline-block w-2 h-2 rounded-none bg-emeraldAccent animate-pulse"></span>
<span>Growth Algorithm: Active</span>
</div>
<button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs rounded-sm btn-blocky flex items-center gap-1.5">
<span>Run Forecast</span>
<svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<polyline points="9 18 15 12 9 6" />
</svg>
</button>
</div>
</aside>


<div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:-translate-x-[calc(50%+100px)] z-20 flex items-center space-x-1.5 glass-panel px-3 py-2 rounded-sm shadow-xl">

<button className="px-2.5 py-1.5 rounded-sm bg-white/80 hover:bg-white text-slateSecondary hover:text-slatePrimary font-mono text-xs border border-slate-200/70 btn-blocky flex items-center gap-1.5 shadow-2xs">
<svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<polygon points="12 2 2 7 12 12 22 7 12 2" />
<polyline points="2 17 12 22 22 17" />
<polyline points="2 12 12 17 22 12" />
</svg>
<span>Wireframe</span>
</button>

<button className="px-2.5 py-1.5 rounded-sm bg-white/80 hover:bg-white text-slateSecondary hover:text-slatePrimary font-mono text-xs border border-slate-200/70 btn-blocky flex items-center gap-1.5 shadow-2xs">
<svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
<polyline points="3 3 3 8 8 8" />
</svg>
<span>Reset Camera</span>
</button>

<button className="px-2.5 py-1.5 rounded-sm bg-white/80 hover:bg-white text-slateSecondary hover:text-slatePrimary font-mono text-xs border border-slate-200/70 btn-blocky flex items-center gap-1.5 shadow-2xs">
<svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<circle cx="12" cy="12" r="5" />
<line x1="12" x2="12" y1="1" y2="3" />
<line x1="12" x2="12" y1="21" y2="23" />
<line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
<line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
<line x1="1" x2="3" y1="12" y2="12" />
<line x1="21" x2="23" y1="12" y2="12" />
</svg>
<span>Sun Angle</span>
</button>

<button className="px-2.5 py-1.5 rounded-sm bg-white/80 hover:bg-white text-slateSecondary hover:text-slatePrimary font-mono text-xs border border-slate-200/70 btn-blocky flex items-center gap-1.5 shadow-2xs">
<svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
<circle cx="12" cy="13" r="4" />
</svg>
<span>Capture</span>
</button>
<div className="h-5 w-px bg-slate-200 mx-1"></div>

<div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-sm border border-slate-200">
<button className="px-2 py-1 rounded-sm font-mono text-[11px] font-bold bg-white text-emerald-800 shadow-xs">3D</button>
<button className="px-2 py-1 rounded-sm font-mono text-[11px] text-slate-600 hover:text-slatePrimary">ISO</button>
<button className="px-2 py-1 rounded-sm font-mono text-[11px] text-slate-600 hover:text-slatePrimary">TOP</button>
</div>
</div>

<div className="absolute bottom-6 left-8 z-10 hidden sm:flex items-center space-x-3 text-[11px] font-mono text-slateSecondary bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/90 shadow-sm">
<div className="flex items-center space-x-1">
<span className="w-8 h-1.5 border-b-2 border-l-2 border-r-2 border-slate-700 inline-block"></span>
<span className="font-semibold text-slatePrimary">50 m</span>
</div>
<span className="text-slate-300">|</span>
<span>Voxel Island: Sector 4</span>
<span className="text-slate-300">|</span>
<span className="text-emerald-700 font-semibold">Terrascope Volumetric Engine</span>
</div>
</main>

    </div>
  );
}
