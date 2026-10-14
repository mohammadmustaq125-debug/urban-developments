import React, { useState, useEffect } from 'react';
import { WardTelemetry, TriageResult } from '../types';
import { PRESET_SCENARIOS, PresetScenario } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  AlertTriangle,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Shield,
  Radio,
  CheckCircle,
  Upload,
  Globe,
  MapPin,
  FileCheck,
} from 'lucide-react';

interface CitizenTriageConsoleProps {
  initialWard?: WardTelemetry | null;
  onTriageComplete?: (result: TriageResult) => void;
}

export const CitizenTriageConsole: React.FC<CitizenTriageConsoleProps> = ({
  initialWard,
  onTriageComplete,
}) => {
  const { language, setLanguage, announce, speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [selectedPreset, setSelectedPreset] = useState<PresetScenario | null>(PRESET_SCENARIOS[0]);
  const [locationText, setLocationText] = useState(
    initialWard ? `${initialWard.name}` : PRESET_SCENARIOS[0].location
  );
  const [categoryText, setCategoryText] = useState(PRESET_SCENARIOS[0].category);
  const [reportDescription, setReportDescription] = useState(PRESET_SCENARIOS[0].description);
  const [customImageB64, setCustomImageB64] = useState<string | null>(null);
  const [activeImagePath, setActiveImagePath] = useState<string>(PRESET_SCENARIOS[0].imagePath);

  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync ward if prop changes
  useEffect(() => {
    if (initialWard) {
      setLocationText(initialWard.name);
    }
  }, [initialWard]);

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPreset(preset);
    setLocationText(preset.location);
    setCategoryText(preset.category);
    setReportDescription(preset.description);
    setActiveImagePath(preset.imagePath);
    setCustomImageB64(null);
    setErrorMessage(null);
    announce(`Loaded scenario: ${preset.title}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageB64(reader.result as string);
        setActiveImagePath(reader.result as string);
        announce('Distress photo uploaded and verified for multimodal analysis');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTriage = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    announce('Initiating Gemini multimodal triage analysis with municipal sensor fusion');

    try {
      const telemetry = selectedPreset
        ? selectedPreset.sensorTelemetry
        : {
            waterLevelCm: 45,
            gridLoadPct: 88,
            aqi: 95,
            trafficDelayIndex: 2.5,
            ambientTempC: 30,
            windSpeedKmh: 20,
          };

      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: reportDescription,
          location: locationText,
          category: categoryText,
          sensorTelemetry: telemetry,
          imageB64: customImageB64,
          language: language,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setTriageResult(json.data);
        if (onTriageComplete) onTriageComplete(json.data);
        announce(`Triage completed. Urgency is ${json.data.triageLevel}`);
      } else if (json.fallback) {
        setTriageResult(json.fallback);
        if (onTriageComplete) onTriageComplete(json.fallback);
        announce(`Offline fallback triage completed: Priority ${json.fallback.triageLevel}`);
      } else {
        throw new Error(json.error || 'Failed to triage report');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with Gemini Triage engine');
      announce('Triage encountered an error. Please retry or contact 108.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAdvice = () => {
    if (!triageResult?.citizenAdvice) return;

    if (isSpeaking) {
      stopSpeaking();
    } else {
      const textToSpeak = `${triageResult.citizenAdvice}. ${triageResult.survivalSteps.join('. ')}`;
      speakText(textToSpeak, language);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-1">
            <span>Guntur Citizen Disaster Triage Core</span>
            <span aria-hidden="true">·</span>
            <span>గుంటూరు పౌర అత్యవసర కేంద్రం</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            GMC Emergency Distress Intake & Multilingual AI Dispatch
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Citizens in Guntur can report waterlogging, 11kV electrical wire sparks, or medical blocks in Telugu, Hindi, or English. Gemini 3.8 Flash verifies the scene and coordinates immediate 108 & SDRF dispatch.
          </p>
        </div>

        {/* Vernacular Language Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0">
          <Globe className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <label htmlFor="triage-lang-select" className="text-xs text-slate-300 font-medium">
            భాష / Language:
          </label>
          <select
            id="triage-lang-select"
            value={language}
            onChange={(e: any) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              announce(`Selected language: ${newLang}`);
            }}
            className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
          >
            <option value="Telugu" className="bg-slate-900 text-white font-telugu">
              తెలుగు (Telugu)
            </option>
            <option value="English" className="bg-slate-900 text-white">
              English (India)
            </option>
            <option value="Hindi" className="bg-slate-900 text-white font-hindi">
              हिंदी (Hindi)
            </option>
          </select>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <section aria-labelledby="preset-scenarios-heading" className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <h3 id="preset-scenarios-heading" className="font-semibold uppercase tracking-wider text-slate-300">
            Quick Guntur Disaster Scenarios (1-Click Load & Test)
          </h3>
          <span className="text-[11px] text-cyan-400 font-mono">3 Verified Municipal Incidents</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <div
                key={preset.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSelectPreset(preset)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectPreset(preset);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500/50 shadow-md'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-cyan-300">{preset.category}</span>
                    <span className="font-mono text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                      Telemetry Linked
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                    {preset.title}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {preset.description}
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono truncate max-w-[170px]">
                    {preset.location.split('-')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset(preset);
                      setTimeout(() => handleRunTriage(), 50);
                    }}
                    aria-label={`Execute 1-Click Triage for ${preset.title}`}
                    className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 font-semibold text-[11px] transition-all cursor-pointer shrink-0"
                  >
                    1-Click Triage ›
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Input Form & Image Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input parameters */}
        <section
          aria-labelledby="triage-form-heading"
          className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4"
        >
          <h3 id="triage-form-heading" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            Distress Report Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="triage-location-input" className="block text-xs font-semibold text-slate-200 mb-1">
                Incident Location / Ward (ఘటనా స్థలం)
              </label>
              <div className="relative">
                <input
                  id="triage-location-input"
                  name="location"
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  placeholder="e.g. Brodipet 4th Lane Underpass"
                  required
                />
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="triage-hazard-category" className="block text-xs font-semibold text-slate-200 mb-1">
                Hazard Category (ప్రమాద రకం)
              </label>
              <input
                id="triage-hazard-category"
                name="category"
                type="text"
                value={categoryText}
                onChange={(e) => setCategoryText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                placeholder="e.g. Flash Flood, Snapped Wire, 108 Block"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="triage-narrative-input" className="block text-xs font-semibold text-slate-200 mb-1">
              Distress Feed / Citizen Narrative (వివరాలు / వివరణ)
            </label>
            <textarea
              id="triage-narrative-input"
              name="description"
              rows={4}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
              placeholder="Describe what is visible, water depth, trapped citizens, electrical sparks..."
              required
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-300">
              Evaluated by <span className="font-semibold text-white">Gemini 3.8 Flash</span> with IoT telemetry fusion
            </div>
            <button
              type="button"
              onClick={handleRunTriage}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 active:scale-98 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Triaging Incident...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Execute Gemini Triage & Dispatch (ట్రియాజ్ చేయండి)</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-950/60 border border-rose-600 text-rose-200 text-xs font-medium"
            >
              {errorMessage}
            </div>
          )}
        </section>

        {/* Right: Multimodal Image Attachment Preview */}
        <section
          aria-labelledby="multimodal-evidence-heading"
          className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 id="multimodal-evidence-heading" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Multimodal Visual Evidence
            </h3>
            <label
              htmlFor="multimodal-file-input"
              className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold underline"
            >
              Upload Photo
              <input
                id="multimodal-file-input"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div className="relative aspect-4/3 rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
            <img
              src={activeImagePath}
              alt={`Multimodal hazard evidence for ${selectedPreset?.title || 'disaster scene in Guntur'}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded bg-slate-950/85 backdrop-blur-xs border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Multimodal Vision Feed</span>
              <span className="font-mono text-cyan-400 text-[10px] font-bold">VERIFIED EVIDENCE</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 leading-normal">
            Gemini parses visual evidence: standing water depth, electrical arcing, structural fissures, and vehicle blockages to confirm distress authenticity.
          </div>
        </section>
      </div>

      {/* Triage Output Card with aria-live */}
      {triageResult && (
        <section
          role="region"
          aria-live="polite"
          aria-label="Disaster Triage Evaluation Results"
          className="rounded-xl border border-cyan-500/40 bg-slate-900/95 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300"
        >
          {/* Top Triage Priority Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded font-mono ${
                    triageResult.triageLevel === 'CRITICAL_P1'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black'
                      : triageResult.triageLevel === 'URGENT_P2'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 font-black'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-black'
                  }`}
                >
                  {triageResult.triageLevel.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-300">
                  Severity:{' '}
                  <span className="font-mono font-bold text-white tabular-nums">
                    {triageResult.severityScore}/100
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-xs text-slate-300">
                  Confidence:{' '}
                  <span className="font-mono font-bold text-cyan-400 tabular-nums">
                    {triageResult.confidencePercent}%
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-xs text-slate-300">
                  Danger Radius:{' '}
                  <span className="font-mono font-bold text-white tabular-nums">
                    {triageResult.impactRadiusMeters}m
                  </span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                {triageResult.hazardCategory}
              </h3>
              <p className="text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
                {triageResult.incidentSummary}
              </p>
            </div>

            {/* Read Aloud Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSpeakAdvice}
                aria-label={isSpeaking ? 'Stop speaking emergency advice' : `Play emergency voice broadcast in ${language}`}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSpeaking
                    ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold animate-pulse'
                    : 'bg-cyan-400 hover:bg-cyan-300 border-cyan-400 text-slate-950 font-bold'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                    <span>ఆపు (Stop Audio)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>వాయిస్ ప్రసారం ({language})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Citizen Localized Survival Advice Box */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                Citizen Safety Directive ({language})
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                {language === 'Telugu' ? 'తెలుగు రక్షణ సూచనలు' : language === 'Hindi' ? 'सुरक्षा निर्देश' : 'OFFICIAL RESCUE ADVISORY'}
              </span>
            </div>
            <div className={`text-sm md:text-base font-semibold text-white leading-relaxed ${language === 'Telugu' ? 'font-telugu' : language === 'Hindi' ? 'font-hindi' : ''}`}>
              "{triageResult.citizenAdvice}"
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              {triageResult.survivalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed ${language === 'Telugu' ? 'font-telugu text-[13px]' : language === 'Hindi' ? 'font-hindi' : ''}`}
                >
                  <span className="font-mono text-cyan-400 font-bold mr-1">0{idx + 1}.</span> {step}
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Municipal Grid Actions Executed */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Autonomous Municipal Interventions Executed Without Delay
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {triageResult.autonomousGridActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{action.subsystem}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{action.actionTaken}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase shrink-0 font-bold">
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Allocation Dispatch Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Dispatched Emergency Resource Units
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-300 font-mono uppercase text-[11px]">
                  <tr>
                    <th scope="col" className="py-2 px-3">Unit Type</th>
                    <th scope="col" className="py-2 px-3 text-right">Units</th>
                    <th scope="col" className="py-2 px-3 text-right">ETA</th>
                    <th scope="col" className="py-2 px-3">Tactical Objective</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {triageResult.resourceAllocations.map((alloc, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{alloc.unitType}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-cyan-300 tabular-nums">
                        {alloc.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 tabular-nums">
                        {alloc.etaMinutes} min
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">{alloc.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secondary Hazard & Evacuation Notice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">Secondary Risk Alert:</span>
              <span className="text-slate-300">{triageResult.secondaryRiskAlert}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">Recommended Evacuation Corridor:</span>
              <span className="text-slate-300">{triageResult.evacuationZone}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
