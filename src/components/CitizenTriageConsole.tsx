import React, { useState } from 'react';
import { WardTelemetry, TriageResult } from '../types';
import { PRESET_SCENARIOS, PresetScenario } from '../data/mockData';
import {
  AlertTriangle,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Shield,
  Clock,
  Radio,
  FileCheck,
  CheckCircle,
  Upload,
  Globe,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface CitizenTriageConsoleProps {
  initialWard?: WardTelemetry | null;
  onTriageComplete?: (result: TriageResult) => void;
}

export const CitizenTriageConsole: React.FC<CitizenTriageConsoleProps> = ({
  initialWard,
  onTriageComplete,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario | null>(PRESET_SCENARIOS[0]);
  const [locationText, setLocationText] = useState(
    initialWard ? `${initialWard.name}` : PRESET_SCENARIOS[0].location
  );
  const [categoryText, setCategoryText] = useState(PRESET_SCENARIOS[0].category);
  const [reportDescription, setReportDescription] = useState(PRESET_SCENARIOS[0].description);
  const [selectedLanguage, setSelectedLanguage] = useState<'Telugu' | 'English' | 'Hindi'>('Telugu');
  const [customImageB64, setCustomImageB64] = useState<string | null>(null);
  const [activeImagePath, setActiveImagePath] = useState<string>(PRESET_SCENARIOS[0].imagePath);

  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPreset(preset);
    setLocationText(preset.location);
    setCategoryText(preset.category);
    setReportDescription(preset.description);
    setActiveImagePath(preset.imagePath);
    setCustomImageB64(null);
    setErrorMessage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageB64(reader.result as string);
        setActiveImagePath(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTriage = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const telemetry = selectedPreset ? selectedPreset.sensorTelemetry : {
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
          language: selectedLanguage,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setTriageResult(json.data);
        if (onTriageComplete) onTriageComplete(json.data);
      } else if (json.fallback) {
        setTriageResult(json.fallback);
      } else {
        throw new Error(json.error || 'Failed to triage report');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with Gemini Triage engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAdvice = () => {
    if (!triageResult?.citizenAdvice) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${triageResult.citizenAdvice}. ${triageResult.survivalSteps.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set regional voice code
    if (selectedLanguage === 'Telugu') {
      utterance.lang = 'te-IN';
    } else if (selectedLanguage === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Citizens in Guntur can report waterlogging, 11kV electrical wire sparks, or medical blocks in Telugu, Hindi, or English. Gemini 3.8 Flash verifies the scene and coordinates immediate 108 & SDRF dispatch.
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">భాష / Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e: any) => setSelectedLanguage(e.target.value)}
            className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
          >
            <option value="Telugu" className="bg-slate-900 text-white font-telugu">తెలుగు (Telugu)</option>
            <option value="English" className="bg-slate-900 text-white">English (India)</option>
            <option value="Hindi" className="bg-slate-900 text-white font-hindi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Quick Scenarios (Click any card to load or run in 1 click)
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">3 Realistic Civic Disasters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
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
                    className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 font-semibold text-[11px] transition-all cursor-pointer shrink-0"
                  >
                    1-Click Triage ›
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Form & Image Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input parameters */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Distress Report Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Incident Location / Ward
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. Ward 7 Lower Arterial"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Declared Hazard Category
              </label>
              <input
                type="text"
                value={categoryText}
                onChange={(e) => setCategoryText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Flash Flood, Transformer Explosion"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Distress Feed / Citizen Eyewitness Narrative
            </label>
            <textarea
              rows={4}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              placeholder="Describe what is visible, number of people trapped, electrical hazards, water levels..."
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              Evaluated by <span className="font-semibold text-white">Gemini 3.8 Flash</span> with IoT telemetry fusion
            </div>
            <button
              onClick={handleRunTriage}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 active:scale-98 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Triaging Incident...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Execute Gemini Triage & Dispatch
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right: Multimodal Image Attachment Preview */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Multimodal Visual Evidence
            </h3>
            <label className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="relative aspect-4/3 rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
            <img
              src={activeImagePath}
              alt="Hazard Scene Analysis"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded bg-slate-950/85 backdrop-blur-xs border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Multimodal Vision Feed</span>
              <span className="font-mono text-cyan-400 text-[10px]">VERIFIED ASSET</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 leading-normal">
            Gemini parses high-resolution visual cues: standing water depth, electrical arcing, structural fissures, and vehicle blockages to confirm distress authenticity.
          </div>
        </div>
      </div>

      {/* Triage Output Card */}
      {triageResult && (
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/95 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300">
          {/* Top Triage Priority Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded font-mono ${
                    triageResult.triageLevel === 'CRITICAL_P1'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                      : triageResult.triageLevel === 'URGENT_P2'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  }`}
                >
                  {triageResult.triageLevel.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">
                  Severity Score:{' '}
                  <span className="font-mono font-bold text-white tabular-nums">
                    {triageResult.severityScore}/100
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  Confidence:{' '}
                  <span className="font-mono font-bold text-cyan-400 tabular-nums">
                    {triageResult.confidencePercent}%
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  Impact Radius:{' '}
                  <span className="font-mono font-bold text-white tabular-nums">
                    {triageResult.impactRadiusMeters}m
                  </span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2">
                {triageResult.hazardCategory}
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                {triageResult.incidentSummary}
              </p>
            </div>

            {/* Read Aloud Button & Wave Animation */}
            <div className="flex items-center gap-3">
              {isSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-[11px] font-mono text-cyan-300">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: '450ms' }} />
                  </div>
                  <span>Broadcasting Audio</span>
                </div>
              )}
              <button
                onClick={handleSpeakAdvice}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSpeaking
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-slate-950 font-bold'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Stop Voice Broadcast
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-slate-950" />
                    Play Voice Broadcast ({selectedLanguage})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Citizen Localized Survival Advice Box */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Citizen Safety Directive ({selectedLanguage})
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                {selectedLanguage === 'Telugu' ? 'తెలుగు రక్షణ సూచనలు' : selectedLanguage === 'Hindi' ? 'सुरक्षा निर्देश' : 'OFFICIAL RESCUE ADVISORY'}
              </span>
            </div>
            <div className={`text-sm md:text-base font-semibold text-white leading-relaxed ${selectedLanguage === 'Telugu' ? 'font-telugu' : selectedLanguage === 'Hindi' ? 'font-hindi' : ''}`}>
              "{triageResult.citizenAdvice}"
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              {triageResult.survivalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed ${selectedLanguage === 'Telugu' ? 'font-telugu text-[13px]' : selectedLanguage === 'Hindi' ? 'font-hindi' : ''}`}
                >
                  <span className="font-mono text-cyan-400 font-bold mr-1">0{idx + 1}.</span> {step}
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Municipal Grid Actions Executed */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Autonomous Grid Interventions Executed Without Human Delay
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {triageResult.autonomousGridActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{action.subsystem}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{action.actionTaken}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 uppercase shrink-0">
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Allocation Dispatch Matrix */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Dispatched Emergency Resource Units
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Unit Type</th>
                    <th className="py-2 px-3 text-right">Units Dispatched</th>
                    <th className="py-2 px-3 text-right">Estimated Arrival</th>
                    <th className="py-2 px-3">Tactical Objective</th>
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
                      <td className="py-2.5 px-3 text-slate-300">{alloc.purpose}</td>
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
        </div>
      )}
    </div>
  );
};
