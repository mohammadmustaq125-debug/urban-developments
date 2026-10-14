import React from 'react';

interface NavigationProps {
  activeTab: 'operations' | 'triage' | 'simulation' | 'iap' | 'jury';
  setActiveTab: (tab: 'operations' | 'triage' | 'simulation' | 'iap' | 'jury') => void;
  onQuickSimulate: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onQuickSimulate,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <button
        onClick={() => setActiveTab('operations')}
        className="text-base md:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
      >
        Resilify AI · Guntur
      </button>

      {/* Zone 2: 4-5 Clean single-line navigation links with bilingual context */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('operations')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'operations' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5 font-semibold' : ''
          }`}
        >
          Live Grid (లైవ్ గ్రిడ్)
        </button>
        <button
          onClick={() => setActiveTab('triage')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'triage' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5 font-semibold' : ''
          }`}
        >
          Citizen Triage (ఎమర్జెన్సీ ట్రియాజ్)
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'simulation' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5 font-semibold' : ''
          }`}
        >
          Predictive Sim (విపత్తు అంచనా)
        </button>
        <button
          onClick={() => setActiveTab('iap')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'iap' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5 font-semibold' : ''
          }`}
        >
          GMC Action Plans (యాక్షన్ ప్లాన్)
        </button>
        <button
          onClick={() => setActiveTab('jury')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'jury' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5 font-semibold' : ''
          }`}
        >
          Jury Q&A Deck
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onQuickSimulate}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-98 rounded-md transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          Simulate Guntur Crisis
        </button>
      </div>
    </header>
  );
};
