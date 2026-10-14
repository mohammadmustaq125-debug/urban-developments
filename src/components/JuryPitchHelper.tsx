import React, { useState } from 'react';
import { Sparkles, X, ChevronUp, ChevronDown, CheckCircle, HelpCircle, Award } from 'lucide-react';

export const JuryPitchHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pitch' | 'qa' | 'keywords'>('pitch');

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>Jury Cheat Sheet & 30s Pitch</span>
        </button>
      ) : (
        <div className="w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl p-4 text-left space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Presenter & Jury Quick Reference</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Switch */}
          <div className="flex rounded-lg bg-slate-950 p-1 text-[11px] font-medium border border-slate-800">
            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex-1 py-1 rounded cursor-pointer transition-colors ${
                activeTab === 'pitch' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30s Pitch
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`flex-1 py-1 rounded cursor-pointer transition-colors ${
                activeTab === 'qa' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 4 Jury Q&A
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex-1 py-1 rounded cursor-pointer transition-colors ${
                activeTab === 'keywords' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Key Terms
            </button>
          </div>

          {/* Tab 1: 30s Elevator Pitch */}
          {activeTab === 'pitch' && (
            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                Say this exact script when introducing your project:
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed text-[12px] font-normal">
                "Resilify AI solves the critical 15-minute 108/112 emergency response delay in Guntur and Andhra Pradesh during heavy Krishna basin rains and urban waterlogging. Powered by Google Gemini 3.8 Flash, our platform fuses citizen photos of snapped APCPDCL wires and flooded underpasses with municipal telemetry in real time. Within 1.2 seconds, it autonomously locks green corridors for 108 ambulances rushing to GGH Guntur, trips 11kV electrical feeders to prevent electrocution, and speaks verified evacuation steps in native Telugu (తెలుగు) and Hindi (हिंदी)."
              </div>
            </div>
          )}

          {/* Tab 2: Top Tough Questions & Winning Answers */}
          {activeTab === 'qa' && (
            <div className="space-y-2.5 max-h-64 overflow-y-auto text-xs pr-1">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px]">
                  Q: Why not just use a standard municipal dashboard?
                </div>
                <div className="text-slate-300 text-[11px] leading-snug">
                  A: Dashboards only display charts for busy municipal officers. Resilify AI has <strong>autonomous actuators</strong> that turn GGH hospital traffic lights green and trip flooded APCPDCL 11kV lines in milliseconds without human delay.
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px]">
                  Q: What if mobile networks go down during a Bay of Bengal cyclone?
                </div>
                <div className="text-slate-300 text-[11px] leading-snug">
                  A: It falls back to an offline Edge Mesh protocol with localized edge controllers and LoRaWAN peer-to-peer radio across GMC municipal water towers.
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px]">
                  Q: Why is Telugu and Hindi voice output essential?
                </div>
                <div className="text-slate-300 text-[11px] leading-snug">
                  A: In Indian cities like Guntur, non-English speaking citizens, street vendors, and the elderly cannot read complex English disaster texts. Multilingual audio ensures zero civilian exclusion.
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px]">
                  Q: How does this coordinate with Indian agencies?
                </div>
                <div className="text-slate-300 text-[11px] leading-snug">
                  A: It links directly with APSDMA, 10th Battalion NDRF (Acharya Nagarjuna University, Guntur), Guntur Municipal Corporation (GMC), and 108 Emergency Medical Services.
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Key Terms for High Scoring */}
          {activeTab === 'keywords' && (
            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                Keywords that impress engineering judges:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Multimodal Sensor Fusion
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Autonomous Actuator Interlock
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Signal Preemption Corridor
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  FEMA ICS 204 Protocol
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Zero-Queue Incident Triage
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Uber H3 Spatial Clustering
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
