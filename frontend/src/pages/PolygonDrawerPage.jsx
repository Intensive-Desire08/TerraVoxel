import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet-draw';
import * as turf from '@turf/turf';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { setPolygon } from '../shared/store/mapSlice';

export default function PolygonDrawerPage() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const drawControl = useRef(null);
  const drawnItems = useRef(null);

  const [areaHectares, setAreaHectares] = useState(0);
  const [areaAcres, setAreaAcres] = useState(0);
  const [nodes, setNodes] = useState(0);
  const [perimeter, setPerimeter] = useState(0);

  // Read project details from Redux if available
  const projectDetails = useSelector((state) => state.project.details);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    // Try to parse coordinates from projectDetails if available, else use a default
    let center = [-3.4653, -62.2159]; // Default to Amazon Basin (Leaflet uses [lat, lng])
    if (projectDetails?.coordinates) {
      try {
        const parts = projectDetails.coordinates.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            center = [lat, lng]; // Leaflet uses [lat, lng]
          }
        }
      } catch (e) {
        // ignore
      }
    }

    map.current = L.map(mapContainer.current, {
      center: center,
      zoom: 15,
      zoomControl: false // we use our own custom zoom controls
    });

    // ESRI World Imagery (Free, no API key required)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(map.current);

    // FeatureGroup is to store editable layers
    drawnItems.current = new L.FeatureGroup();
    map.current.addLayer(drawnItems.current);

    // Initialize the draw control and pass it the FeatureGroup of editable layers
    drawControl.current = new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#10B981'
          }
        },
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems.current,
        remove: true
      }
    });

    // Hide standard draw UI as we use our own custom buttons
    // However, L.Draw needs the control to be added to trigger actions, we will hide it via CSS if needed.
    // We can actually just use the handlers directly without adding the control UI.
    
    const updateArea = () => {
      const data = drawnItems.current.toGeoJSON();
      if (data.features.length > 0) {
        // turf can process feature collection
        const firstFeature = data.features[0];
        
        // dispatch first polygon drawn
        dispatch(setPolygon(firstFeature));
        
        // Calculate metrics using turf
        const areaSqMeters = turf.area(firstFeature);
        const areaHa = areaSqMeters / 10000;
        const areaAc = areaSqMeters / 4046.86;
        
        // Calculate perimeter
        let perim = 0;
        if (firstFeature.geometry.type === 'Polygon') {
          const line = turf.polygonToLine(firstFeature);
          perim = turf.length(line, { units: 'meters' });
        }

        const numNodes = firstFeature.geometry.coordinates[0] ? firstFeature.geometry.coordinates[0].length - 1 : 0;

        setAreaHectares(areaHa.toFixed(2));
        setAreaAcres(areaAc.toFixed(2));
        setPerimeter(Math.round(perim));
        setNodes(numNodes);
      } else {
        dispatch(setPolygon(null));
        setAreaHectares(0);
        setAreaAcres(0);
        setPerimeter(0);
        setNodes(0);
      }
    };

    map.current.on(L.Draw.Event.CREATED, function (e) {
      // Clear previous items to only allow one polygon
      drawnItems.current.clearLayers();
      
      const layer = e.layer;
      drawnItems.current.addLayer(layer);
      updateArea();
    });

    map.current.on(L.Draw.Event.EDITED, updateArea);
    map.current.on(L.Draw.Event.DELETED, updateArea);

  }, [dispatch, projectDetails]);

  const startDrawing = () => {
    // Programmatically start drawing a polygon
    if (map.current) {
      new L.Draw.Polygon(map.current, drawControl.current.options.draw.polygon).enable();
    }
  };

  const trashDrawing = () => {
    if (drawnItems.current) {
      drawnItems.current.clearLayers();
      dispatch(setPolygon(null));
      setAreaHectares(0);
      setAreaAcres(0);
      setPerimeter(0);
      setNodes(0);
    }
  };

  const centerMap = () => {
    if (drawnItems.current && drawnItems.current.getLayers().length > 0) {
      map.current.fitBounds(drawnItems.current.getBounds(), { padding: [40, 40] });
    }
  };

  const zoomIn = () => {
    if (map.current) map.current.zoomIn();
  };
  const zoomOut = () => {
    if (map.current) map.current.zoomOut();
  };
  const resetBearing = () => {
    // Leaflet does not natively support bearing/pitch like Mapbox without plugins,
    // so we can just re-center to the original coordinates or do nothing.
    if (map.current) {
      map.current.setZoom(15);
    }
  };

  return (
    <div className="m-0 p-0 w-screen h-screen overflow-hidden bg-slate-50 font-sans text-stone-800 select-none relative flex">
      {/* Leaflet Container */}
      <div ref={mapContainer} className="absolute inset-0 z-0"></div>

      {/* TOP HUD NAVIGATION STRIP */}
      <header className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-3 bg-white/80 backdrop-blur px-4 py-2 rounded shadow border border-white/90">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-[1px] bg-emerald-500"></span>
            <span className="font-label-code text-xs font-semibold tracking-wider uppercase text-stone-800">WORKSPACE</span>
          </div>
          <span className="text-stone-400 text-xs">/</span>
          <span className="font-label-code text-xs text-stone-600 font-medium">{project_id || 'CADASTRE-FR-8402'}</span>
          <span className="text-stone-400 text-xs">/</span>
          <span className="font-label-code text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded">PARCEL TRACER</span>
        </div>

        <div className="pointer-events-auto flex items-center space-x-3">
          <div className="bg-white/80 backdrop-blur px-3.5 py-1.5 rounded shadow flex items-center space-x-3 font-label-code text-xs border border-white/90">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-stone-800 font-semibold">GPS FIX: RTK-L1/L2</span>
            </div>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500 font-medium">PRECISION: <span className="text-stone-800 font-semibold">±1.2cm</span></span>
          </div>
        </div>
      </header>

      {/* FLOATING SIDEBAR */}
      <aside className="absolute top-20 bottom-6 left-6 z-20 w-[360px] bg-white/80 backdrop-blur rounded shadow-lg flex flex-col justify-between p-6 border border-white/90 overflow-hidden" style={{backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.045) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        <div className="flex flex-col space-y-5">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center shadow-md relative overflow-hidden">
                <span className="text-white font-bold text-xs">TV</span>
              </div>
              <div>
                <h1 className="font-headline text-xl font-bold tracking-tight text-stone-800 leading-none">TerraVoxel</h1>
                <span className="font-label-code text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Spatial Quantitative Core</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[13px] text-stone-600 leading-relaxed font-sans">
              Click on the satellite terrain to place boundary nodes. Trace your land perimeter to compute volume and prepare 3D voxelization.
            </p>
          </div>

          {/* Tools */}
          <div>
            <label className="block font-label-code text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Tracing Instruments
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={startDrawing} className="bg-white hover:bg-stone-50 border border-stone-200 h-12 flex flex-col items-center justify-center rounded p-1.5 transition-all text-stone-800 shadow-sm cursor-pointer pointer-events-auto">
                <span className="material-symbols-outlined text-[18px] text-emerald-500 mb-0.5">draw</span>
                <span className="font-label-code text-[9px] font-medium leading-none tracking-tight">Draw</span>
              </button>
              <button onClick={trashDrawing} className="bg-white hover:bg-stone-50 border border-stone-200 h-12 flex flex-col items-center justify-center rounded p-1.5 transition-all text-stone-800 shadow-sm cursor-pointer pointer-events-auto">
                <span className="material-symbols-outlined text-[18px] text-red-500 mb-0.5">delete</span>
                <span className="font-label-code text-[9px] font-medium leading-none tracking-tight">Clear</span>
              </button>
              <button onClick={centerMap} className="bg-white hover:bg-stone-50 border border-stone-200 h-12 flex flex-col items-center justify-center rounded p-1.5 transition-all text-stone-800 shadow-sm cursor-pointer pointer-events-auto">
                <span className="material-symbols-outlined text-[18px] text-blue-500 mb-0.5">center_focus_strong</span>
                <span className="font-label-code text-[9px] font-medium leading-none tracking-tight">Center</span>
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white rounded p-4 shadow border border-stone-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <span className="font-label-code text-[11px] font-bold text-stone-800 uppercase tracking-wider">Live Metrics</span>
              </div>
              {areaHectares > 0 && (
                <span className="font-label-code text-[10px] text-emerald-500 font-semibold flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>SYNCED</span>
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-medium text-stone-500">Area (Metric)</span>
                <div className="text-right">
                  <span className="font-label-code text-xl font-bold text-stone-800 tracking-tight">{areaHectares}</span>
                  <span className="font-label-code text-xs font-semibold text-stone-400 ml-1">HA</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-medium text-stone-500">Area (Imperial)</span>
                <div className="text-right">
                  <span className="font-label-code text-base font-bold text-stone-800 tracking-tight">{areaAcres}</span>
                  <span className="font-label-code text-xs font-semibold text-stone-400 ml-1">AC</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-stone-50 p-2 rounded border border-stone-100">
                  <span className="block font-label-code text-[10px] text-stone-400 uppercase font-semibold">Nodes</span>
                  <span className="font-label-code text-sm font-bold text-stone-800">{nodes} pts</span>
                </div>
                <div className="bg-stone-50 p-2 rounded border border-stone-100">
                  <span className="block font-label-code text-[10px] text-stone-400 uppercase font-semibold">Perimeter</span>
                  <span className="font-label-code text-sm font-bold text-stone-800">{perimeter} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <div className="mb-2 flex items-center justify-between text-[11px] font-label-code text-stone-400">
            <span>VOXEL ENGINE: {areaHectares > 0 ? 'READY' : 'AWAITING POLYGON'}</span>
          </div>
          <button 
            disabled={areaHectares == 0}
            onClick={() => navigate(`/scene/${project_id || 'default'}`)}
            className={`w-full h-12 flex items-center justify-center space-x-2.5 font-headline text-base font-bold rounded shadow transition-all pointer-events-auto ${areaHectares > 0 ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
          >
            <span>Finish Integration</span>
          </button>
        </div>
      </aside>

      {/* Map Tools */}
      <aside className="absolute top-20 right-6 z-20 flex flex-col space-y-3 pointer-events-auto">
        <div className="bg-white/80 backdrop-blur p-1 rounded shadow border border-white/90 flex flex-col space-y-1">
          <button onClick={zoomIn} className="w-8 h-8 rounded bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center font-label-code font-bold text-sm shadow-sm transition-colors cursor-pointer">+</button>
          <button onClick={zoomOut} className="w-8 h-8 rounded bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center font-label-code font-bold text-sm shadow-sm transition-colors cursor-pointer">−</button>
          <button onClick={resetBearing} className="w-8 h-8 rounded bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center shadow-sm transition-colors cursor-pointer">
            <span className="font-label-code text-[10px] font-bold">N</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
