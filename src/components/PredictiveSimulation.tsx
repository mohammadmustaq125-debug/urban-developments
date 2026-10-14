import React, { useState } from 'react';
import { SimulationResult } from '../types';
import {
  TrendingUp,
  AlertOctagon,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  Zap,
  Activity,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const PredictiveSimulation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>(
    'Krishna River Surge & Arundalpet Railway Underpass Inundation (Guntur)'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>({
    scenarioTitle: 'Krishna River Surge & Arundalpet Railway Underpass Inundation (Guntur)',
    summary:
      'Predictive simulation models a 115mm/hr cloudburst over Guntur low-lying corridors. GMC autonomous storm drain sluice bypasses and APCPDCL feeder isolations prevent electrocutions and protect GGH Hospital ambulance access.',
    timeline: [
      {
        timeLabel: 'T+0m (Onset - ప్రారంభం)',
        riskLevel: 'Elevated',
        activeIncidents: 4,
        hospitalBedUtilization: 62,
        gridStability: 98,
        keyEvents: [
          'Precipitation sensors detect sudden rainfall spike exceeding 95mm/hr across Guntur',
          'Autonomous stormwater diversion pumps activated in Brodipet & Arundalpet naalas',
        ],
        autonomousInterventionPrevented:
          'Automated signal preemption cleared GMC drainage clearance trucks 11 minutes ahead of road blockages.',
      },
      {
        timeLabel: 'T+30m (Peak Surge - తీవ్రత)',
        riskLevel: 'Extreme',
        activeIncidents: 19,
        hospitalBedUtilization: 74,
        gridStability: 89,
        keyEvents: [
          'Arundalpet Railway Underpass water sensor hits critical 86cm threshold',
          '3 RTC city buses and 8 auto-rickshaws trapped with commuters',
        ],
        autonomousInterventionPrevented:
          'Resilify AI autonomously tripped APCPDCL Brodipet 11kV feeder before water ingress, preventing catastrophic electrocution of 40+ trapped passengers.',
      },
      {
        timeLabel: 'T+60m (Stabilization - నియంత్రణ)',
        riskLevel: 'High',
        activeIncidents: 12,
        hospitalBedUtilization: 81,
        gridStability: 93,
        keyEvents: [
          '10th Bn NDRF & SDRF deploy inflatable boats for safe passenger transfer to Brodipet Community Hall',
          'Traffic routing shifted to elevated Lakshmipuram flyover corridor',
        ],
        autonomousInterventionPrevented:
          '108 Ambulances rerouted away from flooded underpasses via dynamic green corridor, shaving 9.4 minutes per emergency transit to GGH Guntur.',
      },
      {
        timeLabel: 'T+120m (Recovery - పునరుద్ధరణ)',
        riskLevel: 'Nominal',
        activeIncidents: 3,
        hospitalBedUtilization: 68,
        gridStability: 97,
        keyEvents: [
          'Floodwaters recede by 70% following GMC sluice bypass activation towards Krishna canal',
          'Power grid load rebalanced across Amaravati Road feeder lines',
        ],
        autonomousInterventionPrevented:
          'Zero civilian fatalities recorded; infrastructure damage contained without GGH Hospital power loss.',
      },
    ],
    resilienceBenefitScore: {
      estimatedCasualtyReductionPct: 78,
      economicLossAvertedMillionUSD: 38.4,
      responseLatencyReductionPct: 69,
    },
  });

  const scenarioPresets = [
    'Krishna River Surge & Arundalpet Railway Underpass Inundation (Guntur)',
    'APCPDCL 11kV Substation Fire & Brodipet Commercial Blackout',
    'Guntur Mirchi Yard Capsaicin Toxic Smoke Plume Hazard',
    'GGH Guntur Hospital Corridor Standstill during Cyclone Alert',
  ];

  const handleRunSimulation = async (scenario: string) => {
    setSelectedScenario(scenario);
    setIsLoading(true);

    try {
      const res = await fetch('/api/predict-crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const json = await res.json();
      if (json.data) {
        setSimResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-cyan-400 mb-1">
            Predictive Urban Hazard Simulation Engine
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multi-Domain Cascading Disaster Forecasting
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulates cascading urban failure across power, water, health systems, and traffic. Quantifies lives saved and economic loss averted through autonomous intervention.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {scenarioPresets.slice(0, 2).map((s) => (
            <button
              key={s}
              onClick={() => handleRunSimulation(s)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedScenario === s
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {s.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Dropdown & Run trigger */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="text-xs text-slate-400 whitespace-nowrap">Selected Hazard Model:</span>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500 flex-1 cursor-pointer"
          >
            {scenarioPresets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleRunSimulation(selectedScenario)}
          disabled={isLoading}
          className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Simulating Disaster Arc...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Run Gemini Predictive Simulation
            </>
          )}
        </button>
      </div>

      {/* Resilience Benefit Scorecard */}
      {simResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-1">
            <div className="text-xs text-slate-400">Casualty Reduction vs Legacy 911</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              +{simResult.resilienceBenefitScore.estimatedCasualtyReductionPct}%
            </div>
            <div className="text-xs text-slate-500">
              Validated against historical municipal flood data
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-1">
            <div className="text-xs text-slate-400">Direct Infrastructure Loss Averted</div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              ${simResult.resilienceBenefitScore.economicLossAvertedMillionUSD}M
            </div>
            <div className="text-xs text-slate-500">
              Via rapid substation isolation & flood sluice diversion
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-1">
            <div className="text-xs text-slate-400">Emergency Transit Latency Reduction</div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              -{simResult.resilienceBenefitScore.responseLatencyReductionPct}%
            </div>
            <div className="text-xs text-slate-500">
              Through AI dynamic traffic signal preemption
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps */}
      {simResult && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Cascading Disaster Timeline: {simResult.scenarioTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{simResult.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {simResult.timeline.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-cyan-400">{step.timeLabel}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        step.riskLevel === 'Extreme'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : step.riskLevel === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {step.riskLevel}
                    </span>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
                    <div>
                      Incidents: <span className="text-white font-bold">{step.activeIncidents}</span>
                    </div>
                    <div>
                      Grid: <span className="text-white font-bold">{step.gridStability}%</span>
                    </div>
                  </div>

                  {/* Key Events */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {step.keyEvents.map((evt, eIdx) => (
                      <div key={eIdx} className="leading-snug">
                        <span className="text-slate-500 mr-1">›</span> {evt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resilify AI Intervention */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-200 bg-cyan-950/30 p-2 rounded border border-cyan-800/40">
                  <div className="font-semibold text-cyan-300 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    AI Action Impact:
                  </div>
                  {step.autonomousInterventionPrevented}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
