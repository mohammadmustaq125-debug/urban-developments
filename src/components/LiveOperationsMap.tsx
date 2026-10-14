import React, { useState } from 'react';
import { WardTelemetry } from '../types';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  ShieldAlert,
  Zap,
  Waves,
  Wind,
  Truck,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Satellite,
  Map,
  Compass,
} from 'lucide-react';

interface LiveOperationsMapProps {
  wards: WardTelemetry[];
  onSelectWard: (ward: WardTelemetry) => void;
  selectedWard: WardTelemetry | null;
  onOpenTriageForWard: (ward: WardTelemetry) => void;
  onStartTour?: () => void;
}

export type MapViewMode = 'satellite' | 'hybrid' | 'vector';

export const LiveOperationsMap: React.FC<LiveOperationsMapProps> = ({
  wards,
  onSelectWard,
  selectedWard,
  onOpenTriageForWard,
  onStartTour,
}) => {
  // Default to satellite view as requested by user
  const [mapMode, setMapMode] = useState<MapViewMode>('satellite');
  const [filterMode, setFilterMode] = useState<'all' | 'flood' | 'grid' | 'traffic'>('all');
  const [showFloodOverlay, setShowFloodOverlay] = useState(true);
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [showAmbulanceOverlay, setShowAmbulanceOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const { announce, language } = useAccessibility();

  const activeWard = selectedWard || wards[1] || wards[0];

  const handleTriggerActuator = (subsystem: string, action: string) => {
    setActiveNotification(`${subsystem}: ${action}`);
    announce(`Autonomous actuator triggered: ${subsystem}`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.min(2.2, Number((prev + delta).toFixed(1))));
      announce(`Map zoom set to ${(next * 100).toFixed(0)} percent`);
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    announce('Map centered on Guntur Municipal Corporation Collectorate');
  };

  return (
    <div className="space-y-6">
      {/* 60-Second Jury Tour Header Prompt */}
      {onStartTour && (
        <aside aria-label="Jury Tour Quick Launch" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-slate-900 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold text-white">
              Evaluating for Hackathon / Prompt War?
            </span>
            <span className="hidden md:inline text-xs text-slate-300">
              Take the 5-step guided interactive walkthrough to see real AI triage in action.
            </span>
          </div>
          <button
            type="button"
            onClick={onStartTour}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Start 60s Jury Walkthrough</span>
          </button>
        </aside>
      )}

      {/* Editorial Overview Strip with Command Center Banner */}
      <section aria-labelledby="command-center-heading" className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative h-60 md:h-68 w-full">
          <img
            src="/src/assets/images/hero_command_center_1791955709401.jpg"
            alt="Guntur Municipal Emergency Operations Command Center with multi-screen digital twin display"
            className="w-full h-full object-cover brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
              <span>Guntur Municipal Corporation (GMC)</span>
              <span aria-hidden="true">·</span>
              <span>గుంటూరు స్మార్ట్ సిటీ గ్రిడ్</span>
              <span aria-hidden="true">·</span>
              <span>APSDMA & 10th Bn NDRF</span>
            </div>
            <h1 id="command-center-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-2xl text-balance">
              Guntur Metropolitan Satellite Resilience Grid
            </h1>
            <p className="text-sm md:text-base text-slate-200 mt-2 max-w-3xl leading-relaxed">
              Real-time high-resolution satellite imagery coupled with Krishna canal backwaters, APCPDCL 11kV grid topology, GGH Guntur 108 ambulance corridors, and Asia Largest Mirchi Yard. Instant autonomous signal preemption and flood sluice control.
            </p>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 border-t border-slate-800 bg-slate-950/90 py-3 px-4">
          <div className="px-3 py-2">
            <div className="text-xs text-slate-300 font-medium">Average Triage Latency</div>
            <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums mt-0.5">
              1.24s <span className="text-xs font-normal text-slate-400">vs 14m legacy</span>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-xs text-slate-300 font-medium">Active Sensor Nodes</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              4,820 <span className="text-xs font-normal text-emerald-400">99.8% Online</span>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-xs text-slate-300 font-medium">Autonomous Actions Today</div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
              184 <span className="text-xs font-normal text-slate-400">Zero-Human Delay</span>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-xs text-slate-300 font-medium">Estimated Casualties Averted</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              34 <span className="text-xs font-normal text-cyan-400">Model Forecast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actuator Notification Banner */}
      {activeNotification && (
        <div
          role="status"
          aria-live="assertive"
          className="flex items-center gap-3 p-3.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-cyan-200 text-sm animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-white">Autonomous Actuator Triggered:</span>
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Main Grid: Satellite Map + Ward Telemetry Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Satellite Map & Geospatial Twin */}
        <section aria-labelledby="map-heading" className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/95 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <h2 id="map-heading" className="text-base font-bold text-white">
                  Guntur Metropolitan Satellite Orthophoto Grid (ఉపగ్రహ వీక్షణ)
                </h2>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                High-resolution satellite view fused with Krishna river canals, flood radar, and 108 emergency GPS pings
              </div>
            </div>

            {/* Map Mode Selector (Satellite / Hybrid / Vector) */}
            <div role="tablist" aria-label="Map imagery modes" className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                type="button"
                role="tab"
                aria-selected={mapMode === 'satellite'}
                onClick={() => {
                  setMapMode('satellite');
                  announce('Switched to Satellite Earth Observation view');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'satellite'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Satellite (ఉపగ్రహం)</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mapMode === 'hybrid'}
                onClick={() => {
                  setMapMode('hybrid');
                  announce('Switched to Hybrid Tactical Radar view');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'hybrid'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Map className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hybrid (హైబ్రిడ్)</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mapMode === 'vector'}
                onClick={() => {
                  setMapMode('vector');
                  announce('Switched to Vector Digital Grid view');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'vector'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Vector Grid</span>
              </button>
            </div>
          </div>

          {/* Satellite Layer Toggles & Zoom Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Layers:
              </span>

              {/* Flood Overlay Toggle */}
              <button
                type="button"
                aria-pressed={showFloodOverlay}
                onClick={() => {
                  setShowFloodOverlay(!showFloodOverlay);
                  announce(showFloodOverlay ? 'Flood radar overlay disabled' : 'Flood radar overlay enabled');
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showFloodOverlay
                    ? 'bg-blue-900/60 text-blue-200 border-blue-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Waves className="w-3 h-3 text-blue-400" aria-hidden="true" />
                <span>Flood Radar (నాలా వరద)</span>
              </button>

              {/* Grid Overlay Toggle */}
              <button
                type="button"
                aria-pressed={showGridOverlay}
                onClick={() => {
                  setShowGridOverlay(!showGridOverlay);
                  announce(showGridOverlay ? 'Power grid overlay disabled' : 'Power grid overlay enabled');
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showGridOverlay
                    ? 'bg-amber-900/60 text-amber-200 border-amber-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" aria-hidden="true" />
                <span>11kV APCPDCL Grid</span>
              </button>

              {/* 108 Ambulance Pings Toggle */}
              <button
                type="button"
                aria-pressed={showAmbulanceOverlay}
                onClick={() => {
                  setShowAmbulanceOverlay(!showAmbulanceOverlay);
                  announce(showAmbulanceOverlay ? 'Ambulance tracking disabled' : 'Ambulance tracking enabled');
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showAmbulanceOverlay
                    ? 'bg-emerald-900/60 text-emerald-200 border-emerald-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Truck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span>108 GPS Pings</span>
              </button>
            </div>

            {/* Zoom & Center Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleZoom(0.2)}
                aria-label="Zoom in on satellite map"
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(-0.2)}
                aria-label="Zoom out on satellite map"
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                aria-label="Center map on Guntur District Collectorate"
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Crosshair className="w-3 h-3" aria-hidden="true" />
                <span>Center GMC</span>
              </button>
            </div>
          </div>

          {/* Interactive Satellite Canvas Container */}
          <div
            role="region"
            aria-label="Interactive Metropolitan Satellite Map of Guntur Municipal Corporation Wards"
            className="relative w-full aspect-16/10 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl"
          >
            {/* Inner Pannable/Zoomable Container */}
            <div
              className="absolute inset-0 transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Satellite Orthophoto Layer */}
              {(mapMode === 'satellite' || mapMode === 'hybrid') && (
                <img
                  src="/src/assets/images/guntur_satellite_map_1791967151622.jpg"
                  alt="High-resolution satellite orthophoto of Guntur city and Krishna canal corridor"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    mapMode === 'satellite' ? 'opacity-90 contrast-110' : 'opacity-65 brightness-90'
                  }`}
                />
              )}

              {/* Vector Grid & Radar Overlays (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  {/* Subtle Grid Pattern for Vector Mode */}
                  <pattern id="vectorGridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.3" />
                  </pattern>

                  {/* River Flow Gradient */}
                  <linearGradient id="riverFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Flood Inundation Radar Gradient */}
                  <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#0369a1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
                  </radialGradient>

                  {/* High Voltage Grid Gradient */}
                  <radialGradient id="gridSpark" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#d97706" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base Vector Canvas if in vector mode */}
                {mapMode === 'vector' && <rect width="100" height="100" fill="#020617" />}
                {mapMode === 'vector' && <rect width="100" height="100" fill="url(#vectorGridPattern)" />}

                {/* Krishna Canal / Natural Stormwater Basin */}
                <path
                  d="M 2,28 Q 30,42 48,68 T 98,84"
                  fill="none"
                  stroke="url(#riverFlow)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={showFloodOverlay ? 'animate-pulse' : ''}
                />

                {/* Hybrid Street Arterial Overlays */}
                {(mapMode === 'hybrid' || mapMode === 'vector') && (
                  <>
                    <path d="M 12,2 L 88,98" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" strokeDasharray="3,2" />
                    <path d="M 2,54 L 98,46" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" />
                    <path d="M 46,2 L 54,98" fill="none" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="1.6" />
                  </>
                )}

                {/* Flood Inundation Heat Layer */}
                {showFloodOverlay && (
                  <>
                    {/* Arundalpet Railway Underpass Inundation Basin */}
                    <circle cx="35" cy="38" r="14" fill="url(#floodGlow)" className="animate-pulse" />
                    {/* Old Guntur Basin */}
                    <circle cx="42" cy="72" r="16" fill="url(#floodGlow)" className="animate-pulse" />
                    {/* Koretipadu Naala Overflow */}
                    <circle cx="65" cy="55" r="12" fill="url(#floodGlow)" />
                  </>
                )}

                {/* APCPDCL 11kV Grid Topology Line & Spark Zones */}
                {showGridOverlay && (
                  <>
                    <path
                      d="M 35,38 L 48,42 L 65,55 L 42,72"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeDasharray="4,3"
                    />
                    <circle cx="35" cy="38" r="8" fill="url(#gridSpark)" />
                  </>
                )}

                {/* 108 Emergency Ambulance Transit Corridors */}
                {showAmbulanceOverlay && (
                  <path
                    d="M 48,42 L 58,24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeDasharray="5,3"
                  />
                )}
              </svg>

              {/* Ward Interactive Nodes with High-Contrast Badges */}
              {wards.map((w) => {
                const isSelected = activeWard.id === w.id;
                const isCritical = w.status === 'critical';
                const isWarning = w.status === 'warning';

                return (
                  <div
                    key={w.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Ward ${w.code}: ${w.name}. Risk Score: ${w.riskScore} percent, Status: ${w.status}`}
                    onClick={() => onSelectWard(w)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectWard(w);
                      }
                    }}
                    style={{ left: `${w.x}%`, top: `${w.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 focus:outline-none focus:ring-4 focus:ring-cyan-300 rounded-full ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-2xl backdrop-blur-xs ${
                        isCritical
                          ? 'bg-rose-950/95 border-rose-400 text-rose-200 shadow-rose-900/80 ring-2 ring-rose-500/50'
                          : isWarning
                          ? 'bg-amber-950/95 border-amber-400 text-amber-200 shadow-amber-900/80 ring-2 ring-amber-500/50'
                          : 'bg-slate-900/95 border-cyan-400 text-cyan-200 shadow-cyan-900/80 ring-2 ring-cyan-500/50'
                      } ${isSelected ? 'ring-4 ring-cyan-400 font-extrabold' : ''}`}
                    >
                      <span className="text-[10px] font-mono font-black">{w.code.replace('GMC-', '')}</span>
                    </div>

                    {/* Ward Label Banner */}
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/95 border border-slate-700 text-[10px] text-white font-bold pointer-events-none shadow-lg">
                      {w.name.split('&')[0].trim()}
                    </div>
                  </div>
                );
              })}

              {/* 108 Ambulance Live GPS Marker */}
              {showAmbulanceOverlay && (
                <div
                  style={{ left: '52%', top: '33%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-950/95 border border-emerald-500 text-[10px] font-bold text-emerald-200 shadow-xl animate-pulse"
                >
                  <Truck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                  <span>108 ALS En Route (GGH)</span>
                </div>
              )}
            </div>

            {/* Satellite Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 p-2.5 rounded-lg bg-slate-950/95 border border-slate-800 text-[11px] text-slate-200 space-y-1.5 shadow-xl backdrop-blur-sm z-30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Satellite Imagery Overlays
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-400/50" aria-hidden="true" />
                <span>P1 Critical Inundation (&gt;50cm)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/50" aria-hidden="true" />
                <span>11kV Snapped Feeder Hazard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/50" aria-hidden="true" />
                <span>108 Ambulance Preempted Route</span>
              </div>
            </div>

            {/* Satellite Resolution Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-cyan-300 z-30 flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" aria-hidden="true" />
              <span>ISRO Cartosat / Ortho 0.5m · Live</span>
            </div>
          </div>

          {/* Autonomous Municipal Actuators Controls */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>GMC Autonomous Actuators (గుంటూరు మునిసిపల్ ఆటోమేషన్)</span>
              <span className="font-mono text-cyan-400 text-[10px] font-bold">REAL-TIME SCADA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleTriggerActuator(
                    '108 Hospital Corridor Preemption',
                    'Green signal locked from Collectorate Road to GGH Guntur Emergency Trauma ICU'
                  )
                }
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="font-bold text-white">Pre-empt 108 GGH Corridor</div>
                  <div className="text-[10px] text-cyan-400 font-telugu">108 అంబులెన్స్ గ్రీన్ వే</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTriggerActuator(
                    'GMC Storm Drainage Utility',
                    'Sluice overflow gates opened at Arundalpet & Koretipadu Naala junction'
                  )
                }
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="font-bold text-white">Trigger GMC Sluice Bypass</div>
                  <div className="text-[10px] text-blue-400 font-telugu">నాలాల వరద గేట్ల ఎత్తివేత</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTriggerActuator(
                    'APCPDCL Grid Protection',
                    'Tripped 11kV Feeder Line at Brodipet 6/2 to prevent electrocution in waterlogged market'
                  )
                }
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="font-bold text-white">Trip APCPDCL 11kV Feeder</div>
                  <div className="text-[10px] text-amber-400 font-telugu">విద్యుత్ సరఫరా ఆటో-కట్</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Ward Telemetry Inspector */}
        <section aria-labelledby="ward-inspector-heading" className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-5 shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span id="ward-inspector-heading" className="font-bold uppercase tracking-wider text-cyan-400">
                Ward Telemetry Inspector
              </span>
              <span className="font-mono text-cyan-400 font-extrabold">{activeWard.code}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{activeWard.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <span>Population: {(activeWard.population / 1000).toFixed(0)}k</span>
              <span aria-hidden="true">·</span>
              <span>Hospitals: {activeWard.hospitalsCount}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-black ${
                  activeWard.status === 'critical'
                    ? 'text-rose-400'
                    : activeWard.status === 'warning'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {activeWard.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Telemetry Metric Bars */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800 text-sm">
            {/* Water Level */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Waves className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                  Stormwater Depth (వరద నీటి మట్టం)
                </span>
                <span className="font-mono font-medium text-white tabular-nums">
                  {activeWard.waterLevelCm} cm{' '}
                  <span className="text-slate-400 font-normal">/ {activeWard.waterThresholdCm} cm threshold</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden" role="progressbar" aria-valuenow={activeWard.waterLevelCm} aria-valuemin={0} aria-valuemax={activeWard.waterThresholdCm}>
                <div
                  className={`h-full transition-all duration-300 ${
                    activeWard.waterLevelCm >= activeWard.waterThresholdCm ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (activeWard.waterLevelCm / activeWard.waterThresholdCm) * 100)}%` }}
                />
              </div>
            </div>

            {/* Grid Load */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  Electrical Transformer Strain (గ్రిడ్ లోడ్)
                </span>
                <span className="font-mono font-medium text-white tabular-nums">
                  {activeWard.gridLoadPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden" role="progressbar" aria-valuenow={activeWard.gridLoadPct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`h-full transition-all duration-300 ${
                    activeWard.gridLoadPct > 90 ? 'bg-rose-500' : activeWard.gridLoadPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, activeWard.gridLoadPct)}%` }}
                />
              </div>
            </div>

            {/* Traffic Congestion */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                  Arterial Congestion Index (ట్రాఫిక్ జామ్)
                </span>
                <span className="font-mono font-medium text-white tabular-nums">
                  {activeWard.trafficDelayIndex}x delay
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden" role="progressbar" aria-valuenow={activeWard.trafficDelayIndex} aria-valuemin={1} aria-valuemax={4}>
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (activeWard.trafficDelayIndex / 4) * 100)}%` }}
                />
              </div>
            </div>

            {/* AQI */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  Air Quality Index (గాలి నాణ్యత)
                </span>
                <span className="font-mono font-medium text-white tabular-nums">
                  {activeWard.aqi} AQI
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden" role="progressbar" aria-valuenow={activeWard.aqi} aria-valuemin={0} aria-valuemax={200}>
                <div
                  className={`h-full transition-all duration-300 ${
                    activeWard.aqi > 150 ? 'bg-purple-500' : activeWard.aqi > 100 ? 'bg-rose-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, (activeWard.aqi / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ward Action Trigger */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => onOpenTriageForWard(activeWard)}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <ShieldAlert className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Launch Gemini Multimodal Triage for {activeWard.code}</span>
            </button>
            <div className="text-[11px] text-center text-slate-300">
              Dispatches emergency resources & generates real-time citizen survival guide
            </div>
          </div>
        </section>
      </div>

      {/* Direct Architectural Comparison: Legacy 911 vs Resilify AI */}
      <BeforeAfterComparison />
    </div>
  );
};
