import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setProjectDetails } from '../shared/store/projectSlice';

export default function ProjectPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapMarker = useRef(null);
  const isProgrammaticMove = useRef(false);

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

  const [climateMode, setClimateMode] = useState('Manual Entry Mode');
  const [toastMessage, setToastMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (title, message, isError = false) => {
    setToastMessage({ title, message, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const parseCoordinates = (inputStr) => {
    if (!inputStr || typeof inputStr !== 'string') return null;
    const str = inputStr.trim();
    const matches = str.match(/-?\d+(\.\d+)?/g);
    if (matches && matches.length >= 2) {
      let lat = parseFloat(matches[0]);
      let lng = parseFloat(matches[1]);
      if ((lat < -90 || lat > 90) && (lng >= -90 && lng <= 90)) {
        const temp = lat; lat = lng; lng = temp;
      }
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  };

  const animateValue = (name, end, duration) => {
    let startTimestamp = null;
    let start = formData[name];
    if (typeof start !== 'number') start = parseFloat(start) || 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      let currentVal = start + easeProgress * (end - start);
      
      setFormData(prev => ({
        ...prev,
        [name]: name === 'temp' ? currentVal.toFixed(1) : Math.round(currentVal)
      }));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: name === 'temp' ? end.toFixed(1) : Math.round(end)
        }));
      }
    };
    window.requestAnimationFrame(step);
  };

  const fetchClimateData = async (lat, lng, notifyToast = true) => {
    setClimateMode('FETCHING METEOROLOGY...');
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_mean,precipitation_sum&past_days=90&forecast_days=0`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API Network Error");
      const data = await response.json();
      
      if (data && data.daily) {
        const temps = data.daily.temperature_2m_mean.filter(v => v !== null);
        const precip = data.daily.precipitation_sum.filter(v => v !== null);
        
        let avgTemp = 24.5;
        let annualRainfall = 1240;
        
        if (temps.length > 0) {
          avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        }
        if (precip.length > 0) {
          const recentRain = precip.reduce((a, b) => a + b, 0);
          annualRainfall = recentRain * 4.05; 
        }
        
        animateValue('rainfall', annualRainfall, 800);
        animateValue('temp', avgTemp, 800);
        
        setClimateMode('LIVE METEO SYNCHRONIZED');
        if (notifyToast) {
          showToast("TELEMETRY SYNCHRONIZED", `Data updated for ${lat.toFixed(4)}, ${lng.toFixed(4)} via Open-Meteo.`);
        }
      } else {
        throw new Error("Invalid payload");
      }
    } catch (error) {
      console.error(error);
      setClimateMode('Manual Entry Mode');
      if (notifyToast) {
        showToast("SYNC ERROR", "Could not fetch telemetry. Check connection or coordinates.", true);
      }
    }
  };

  useEffect(() => {
    if (map.current) return;
    
    let initialLat = -3.4653;
    let initialLng = -62.2159;
    const startCoords = parseCoordinates(formData.coordinates);
    if (startCoords) {
      initialLat = startCoords.lat;
      initialLng = startCoords.lng;
    }

    map.current = L.map(mapContainer.current, {
      zoomControl: false, 
      attributionControl: false
    }).setView([initialLat, initialLng], 14);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map.current);

    mapMarker.current = L.circleMarker([initialLat, initialLng], {
      radius: 7,
      fillColor: "#10B981",
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map.current);

    map.current.on('moveend', () => {
      if (isProgrammaticMove.current) {
        isProgrammaticMove.current = false;
        return;
      }
      const center = map.current.getCenter();
      const lat = center.lat;
      const lng = center.lng;
      setFormData(prev => ({ ...prev, coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
      if (mapMarker.current) {
        mapMarker.current.setLatLng([lat, lng]);
      }
      fetchClimateData(lat, lng, false);
    });

  }, []);

  const handleSync = () => {
    const coords = parseCoordinates(formData.coordinates);
    if (coords) {
      setFormData(prev => ({ ...prev, coordinates: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` }));
      if (map.current) {
        isProgrammaticMove.current = true;
        map.current.flyTo([coords.lat, coords.lng], 14, { duration: 1.2 });
        if (mapMarker.current) {
          mapMarker.current.setLatLng([coords.lat, coords.lng]);
        }
      }
      fetchClimateData(coords.lat, coords.lng, true);
    } else {
      showToast("INVALID FORMAT", "Valid format: Lat, Lng (e.g. -3.4653, -62.2159)", true);
    }
  };

  const handleCalculate = () => {
    const projectId = `TRVX-${Math.floor(Math.random() * 10000)}`;
    dispatch(setProjectDetails(formData));
    navigate(`/map/${projectId}`);
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-dark font-sans antialiased overflow-hidden h-screen flex flex-col select-none">
      <header className="w-full h-14 bg-white border-b border-stone-200 z-50 flex items-center justify-between px-grid-margin shrink-0">
        <div className="flex items-center gap-unit-6">
          <div className="flex items-center gap-unit-2">
            <span className="w-2.5 h-2.5 bg-emerald-brand"></span>
            <span className="font-label-code text-xs uppercase tracking-widest text-stone-dark font-bold">TERRAVOXEL // GEO-SPATIAL</span>
          </div>
          <div className="h-4 w-px bg-stone-200"></div>
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
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <section className="w-full md:w-[60%] h-full relative bg-stone-900 border-r border-stone-200 overflow-hidden flex flex-col">
          <div className="relative w-full h-full bg-stone-950 flex items-center justify-center overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0 z-0 opacity-85 filter contrast-125 saturate-150"></div>
            
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="absolute right-4 bottom-24 flex flex-col gap-1 z-20">
              <button onClick={() => map.current?.zoomIn()} className="w-8 h-8 bg-white border border-stone-300 text-stone-800 font-label-code font-bold hover:bg-stone-50 transition-colors flex items-center justify-center shadow-sm" title="Zoom In">+</button>
              <button onClick={() => map.current?.zoomOut()} className="w-8 h-8 bg-white border border-stone-300 text-stone-800 font-label-code font-bold hover:bg-stone-50 transition-colors flex items-center justify-center shadow-sm" title="Zoom Out">-</button>
              <button onClick={handleSync} className="w-8 h-8 bg-white border border-stone-300 text-stone-800 font-label-code hover:bg-stone-50 transition-colors flex items-center justify-center shadow-sm mt-2" title="Reset View">
                <span className="material-symbols-outlined text-[16px]">my_location</span>
              </button>
            </div>
          </div>
        </section>

        <section className="w-full md:w-[40%] h-full flex flex-col bg-cream-surface relative overflow-hidden">
          <div className="p-6 pb-4 border-b border-stone-200 bg-white/70 backdrop-blur-sm shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-code text-[11px] text-stone-500 font-semibold tracking-wider">Config Node // Specification</span>
              <span className="font-label-code text-[11px] px-2 py-0.5 bg-stone-100 text-stone-800 border border-stone-300">Sys v2.4</span>
            </div>
            <h1 className="font-headline text-2xl text-stone-800 tracking-tight font-semibold">Parameter Terminal</h1>
            <p className="font-label-code text-[11px] text-stone-600 mt-0.5">Configure input attributes for revenue blueprint</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
            
            <div className="bg-[#FAF7F2] border border-stone-300 p-5 shadow-[2px_2px_0px_#0F172A] transition-all hover:border-stone-400">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-800"></span>
                  <h2 className="font-headline text-base text-stone-800 uppercase font-semibold">Plot Coordinates</h2>
                </div>
                <span className="font-label-code text-[11px] text-stone-400">Cadastral Lock</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Plot Coordinates (Latitude, Longitude)</label>
                    <span className="font-label-code text-[11px] text-emerald-brand font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">my_location</span> GPS Locked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input 
                        name="coordinates"
                        className="w-full bg-white border border-stone-300 font-label-code text-sm text-stone-800 px-3 py-2 pl-8 focus:ring-1 focus:ring-stone-800 rounded-none outline-none" 
                        type="text" 
                        value={formData.coordinates}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSync()}
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-stone-400">pin_drop</span>
                    </div>
                    <button onClick={handleSync} className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border-y border-r border-stone-300 font-label-code text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sync</span><span>Sync</span>
                    </button>
                  </div>
                </div>

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
                <div className="pt-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Soil pH Level</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input className="w-full cursor-pointer" max="8.0" min="5.0" step="0.1" type="range" name="soilPh" value={formData.soilPh} onChange={handleChange} />
                    <input className="w-20 bg-white border border-stone-300 font-label-code text-sm text-center py-1.5 text-stone-800 focus:ring-1 focus:ring-stone-800 rounded-none" max="8.0" min="5.0" step="0.1" type="number" name="soilPh" value={formData.soilPh} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-stone-300 p-5 shadow-[2px_2px_0px_#0F172A] transition-all hover:border-stone-400">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-800"></span>
                  <h2 className="font-headline text-base text-stone-800 uppercase font-semibold">Climate Baseline</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-brand text-[10px] font-label-code font-bold">
                  <span className={`w-1.5 h-1.5 bg-emerald-brand ${climateMode.includes('FETCHING') ? 'animate-ping' : ''}`}></span>
                  {climateMode}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Annual Rainfall (mm)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input className="w-full cursor-pointer" max="2500" min="300" step="10" type="range" name="rainfall" value={formData.rainfall} onChange={handleChange} />
                    <div className="relative w-28 shrink-0">
                      <input className="w-full bg-white border border-stone-300 font-label-code text-sm py-1.5 pl-2 pr-7 text-stone-800 focus:ring-1 focus:ring-stone-800 rounded-none" max="2500" min="300" step="10" type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-label-code text-stone-400">mm</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-label-code text-[11px] text-stone-600 uppercase font-medium">Average Temperature (°C)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input className="w-full cursor-pointer" max="35.0" min="15.0" step="0.1" type="range" name="temp" value={formData.temp} onChange={handleChange} />
                    <div className="relative w-28 shrink-0">
                      <input className="w-full bg-white border border-stone-300 font-label-code text-sm py-1.5 pl-2 pr-7 text-stone-800 focus:ring-1 focus:ring-stone-800 rounded-none" max="35.0" min="15.0" step="0.1" type="number" name="temp" value={formData.temp} onChange={handleChange} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-label-code text-stone-400">°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

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

      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 bg-stone-800 text-white border-l-4 p-4 shadow-lg max-w-sm ${toastMessage.isError ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className="flex items-start gap-3">
            <span className={`material-symbols-outlined ${toastMessage.isError ? 'text-red-500' : 'text-emerald-500'}`}>
              {toastMessage.isError ? 'error' : 'check_circle'}
            </span>
            <div>
              <p className="font-label-code text-xs font-bold uppercase">{toastMessage.title}</p>
              <p className="font-sans text-stone-300 text-xs mt-1">{toastMessage.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
