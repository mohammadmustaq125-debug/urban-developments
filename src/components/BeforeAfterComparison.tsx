import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

export const BeforeAfterComparison: React.FC = () => {
  return (
    <section aria-labelledby="comparison-heading" className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Indian Smart Cities Hackathon · Direct System Comparison
          </span>
          <h2 id="comparison-heading" className="text-lg font-bold text-white mt-0.5">
            Traditional Indian Emergency Response (112 / 108) vs. Resilify AI Grid
          </h2>
        </div>
        <span className="text-xs text-slate-300 font-mono">Guntur Municipal Corporation & APSDMA</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Legacy Column */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-950/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>Legacy 112 / 108 / APCPDCL Emergency Call Centers</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="font-mono text-rose-400 font-bold">14m</span>
              <span>12–15 minute queue delay during monsoon cloudbursts as callers overwhelm human call operators.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-rose-400 font-bold">Silo</span>
              <span>GMC drains, 108 Ambulances, AP Fire Services, and APCPDCL operate on disconnected telephone lines without shared real-time telemetry.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-rose-400 font-bold">Grid</span>
              <span>108 Ambulances trapped at Lakshmipuram flyover and Collectorate signals with zero green-corridor preemption.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-rose-400 font-bold">Risk</span>
              <span>Live snapped 11kV electric wires remain electrified in waterlogged Arundalpet streets until manual line inspection.</span>
            </div>
          </div>
        </div>

        {/* Resilify AI Column */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
            <span>Resilify AI · Guntur Autonomous Resilience Nervous System</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-200">
            <div className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">1.2s</span>
              <span>Multimodal intake fuses citizen photos with Krishna river & naala sensors in &lt;1.3s with zero voice queue.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">Sync</span>
              <span>Coordinates 10th Bn NDRF (ANU Guntur), 108 Ambulances, and GMC drainage pumps simultaneously.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">Flow</span>
              <span>Traffic signals automatically open green wave corridors for 108 ambulances rushing to GGH Guntur Hospital.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">Voice</span>
              <span>Speaks verified survival instructions in Telugu (తెలుగు) and Hindi (हिंदी) directly to citizens' mobile phones.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
