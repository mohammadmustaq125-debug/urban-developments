import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LiveOperationsMap } from './components/LiveOperationsMap';
import { CitizenTriageConsole } from './components/CitizenTriageConsole';
import { PredictiveSimulation } from './components/PredictiveSimulation';
import { IncidentActionPlanView } from './components/IncidentActionPlanModal';
import { JuryShowcaseDeck } from './components/JuryShowcaseDeck';
import { JuryTourGuide } from './components/JuryTourGuide';
import { JuryPitchHelper } from './components/JuryPitchHelper';
import { INITIAL_WARDS } from './data/mockData';
import { WardTelemetry, TriageResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'operations' | 'triage' | 'simulation' | 'iap' | 'jury'>('operations');
  const [wards, setWards] = useState<WardTelemetry[]>(INITIAL_WARDS);
  const [selectedWard, setSelectedWard] = useState<WardTelemetry | null>(INITIAL_WARDS[1]);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleSelectWard = (ward: WardTelemetry) => {
    setSelectedWard(ward);
  };

  const handleOpenTriageForWard = (ward: WardTelemetry) => {
    setSelectedWard(ward);
    setActiveTab('triage');
  };

  const handleQuickSimulate = () => {
    setActiveTab('simulation');
  };

  const handleTriageComplete = (result: TriageResult) => {
    if (selectedWard && result.triageLevel === 'CRITICAL_P1') {
      setWards((prev) =>
        prev.map((w) =>
          w.id === selectedWard.id
            ? { ...w, riskScore: Math.min(100, w.riskScore + 10), status: 'critical' }
            : w
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Top Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSimulate={handleQuickSimulate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'operations' && (
          <LiveOperationsMap
            wards={wards}
            onSelectWard={handleSelectWard}
            selectedWard={selectedWard}
            onOpenTriageForWard={handleOpenTriageForWard}
            onStartTour={() => setIsTourOpen(true)}
          />
        )}

        {activeTab === 'triage' && (
          <CitizenTriageConsole
            initialWard={selectedWard}
            onTriageComplete={handleTriageComplete}
          />
        )}

        {activeTab === 'simulation' && <PredictiveSimulation />}

        {activeTab === 'iap' && <IncidentActionPlanView />}

        {activeTab === 'jury' && <JuryShowcaseDeck />}
      </main>

      {/* Guided 60-Second Jury Tour Modal */}
      <JuryTourGuide
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Floating Presenter Cheat Sheet & 30s Pitch Widget */}
      <JuryPitchHelper />

      {/* Clean Municipal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Resilify AI</span>
            <span aria-hidden="true">·</span>
            <span>Autonomous Smart City Disaster & Emergency Resilience Grid</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsTourOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
            >
              Start 60s Jury Walkthrough
            </button>
            <span aria-hidden="true">·</span>
            <span>UN SDG 11 / 3 / 13 Aligned</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('jury')}
              className="text-slate-300 hover:text-white font-medium cursor-pointer"
            >
              Jury Evaluation Suite
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
