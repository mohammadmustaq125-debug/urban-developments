import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { ShieldCheck, Play } from 'lucide-react';

export type TabType = 'operations' | 'triage' | 'simulation' | 'iap' | 'jury' | 'tests';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onQuickSimulate: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onQuickSimulate,
}) => {
  const { language, announce } = useAccessibility();

  const handleTabChange = (tab: TabType, label: string) => {
    setActiveTab(tab);
    announce(`Switched to ${label} tab`);
  };

  // Multilingual nav labels
  const navLabels = {
    Telugu: {
      operations: 'లైవ్ గ్రిడ్ (Live Grid)',
      triage: 'పౌర ట్రియాజ్ (Citizen Triage)',
      simulation: 'విపత్తు అంచనా (Sim)',
      iap: 'జీఎంసీ ప్లాన్స్ (GMC IAP)',
      jury: 'జ్యూరీ డెక్ (Jury Deck)',
      tests: 'టెస్ట్స్ & క్వాలిటీ (Tests & QA)',
      crisisBtn: 'కృష్ణా వరద సిమ్యులేషన్ (Simulate Crisis)',
    },
    Hindi: {
      operations: 'लाइव ग्रिड (Live Grid)',
      triage: 'नागरिक ट्राइएज (Triage)',
      simulation: 'आपदा पूर्वानुमान (Sim)',
      iap: 'जीएमसी योजनाएं (IAP)',
      jury: 'जूरी डेक (Jury Deck)',
      tests: 'परीक्षण और गुणवत्ता (Tests & QA)',
      crisisBtn: 'कृष्णा बाढ़ सिमुलेशन (Simulate Crisis)',
    },
    English: {
      operations: 'Live Operations Grid',
      triage: 'Citizen Emergency Triage',
      simulation: 'Predictive Simulation',
      iap: 'GMC Action Plans (IAP)',
      jury: 'Jury Showcase Deck',
      tests: 'Automated Tests & QA',
      crisisBtn: 'Simulate Guntur Crisis',
    },
  }[language];

  return (
    <div className="sticky top-0 z-50">
      {/* Top Accessibility Bar */}
      <AccessibilityToolbar />

      {/* Main Header / Navigation */}
      <header
        role="banner"
        className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md"
      >
        {/* Brand Title */}
        <button
          type="button"
          onClick={() => handleTabChange('operations', 'Live Operations')}
          className="text-base md:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
          <span>Resilify AI · Guntur</span>
        </button>

        {/* Semantic Tab Navigation */}
        <nav
          role="tablist"
          aria-label="Disaster Grid Navigation Tabs"
          className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            role="tab"
            id="tab-operations"
            aria-selected={activeTab === 'operations'}
            aria-controls="panel-operations"
            onClick={() => handleTabChange('operations', navLabels.operations)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'operations'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            {navLabels.operations}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-triage"
            aria-selected={activeTab === 'triage'}
            aria-controls="panel-triage"
            onClick={() => handleTabChange('triage', navLabels.triage)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'triage'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            {navLabels.triage}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-simulation"
            aria-selected={activeTab === 'simulation'}
            aria-controls="panel-simulation"
            onClick={() => handleTabChange('simulation', navLabels.simulation)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'simulation'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            {navLabels.simulation}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-iap"
            aria-selected={activeTab === 'iap'}
            aria-controls="panel-iap"
            onClick={() => handleTabChange('iap', navLabels.iap)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'iap'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            {navLabels.iap}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-jury"
            aria-selected={activeTab === 'jury'}
            aria-controls="panel-jury"
            onClick={() => handleTabChange('jury', navLabels.jury)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'jury'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            {navLabels.jury}
          </button>

          {/* New Interactive Testing & Quality Tab */}
          <button
            type="button"
            role="tab"
            id="tab-tests"
            aria-selected={activeTab === 'tests'}
            aria-controls="panel-tests"
            onClick={() => handleTabChange('tests', navLabels.tests)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>{navLabels.tests}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              100%
            </span>
          </button>
        </nav>

        {/* Primary Simulation CTA Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onQuickSimulate}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-98 rounded-md transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{navLabels.crisisBtn}</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer Horizontal Scroll */}
      <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs">
        {(
          [
            { id: 'operations', label: 'Grid' },
            { id: 'triage', label: 'Triage' },
            { id: 'simulation', label: 'Sim' },
            { id: 'iap', label: 'IAP' },
            { id: 'jury', label: 'Jury' },
            { id: 'tests', label: 'QA Tests (100%)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id, tab.label)}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
