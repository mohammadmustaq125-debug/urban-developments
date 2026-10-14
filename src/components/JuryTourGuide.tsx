import React, { useState, useEffect } from 'react';
import { TabType } from './Navigation';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface JuryTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const JuryTourGuide: React.FC<JuryTourGuideProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tourSteps: {
    title: string;
    tab: TabType;
    kicker: string;
    description: string;
    highlightText: string;
    actionLabel: string;
  }[] = [
    {
      title: 'Welcome to Resilify AI · Guntur Smart City (1-Minute Jury Tour)',
      tab: 'operations',
      kicker: 'STEP 1 OF 5 · THE CORE PROBLEM',
      description:
        'During Andhra Pradesh monsoon cloudbursts and Krishna river floods, emergency lines (112/108) in Guntur jam, leaving citizens stranded in flooded underpasses while APCPDCL live wires spark in water. Resilify AI introduces an autonomous resilience nervous system for Guntur Municipal Corporation.',
      highlightText: 'Look at the top KPI strip: Average triage latency drops from 14 minutes down to 1.24 seconds.',
      actionLabel: 'Explore Guntur Digital Twin ›',
    },
    {
      title: 'Guntur Geospatial Digital Twin & IoT Telemetry',
      tab: 'operations',
      kicker: 'STEP 2 OF 5 · REAL-TIME SENSORS',
      description:
        'Resilify AI connects directly to municipal IoT sensors across Guntur: Arundalpet storm drain depth, Brodipet APCPDCL 11kV electrical load, Guntur Mirchi Yard AQI, and Collectorate road traffic.',
      highlightText:
        'Notice GMC-01 (Brodipet/Arundalpet): Water depth is 68cm (above the 50cm danger threshold). Click GMC-01 to inspect its live sensors.',
      actionLabel: 'Test Citizen AI Triage ›',
    },
    {
      title: 'Multilingual Gemini 3.8 Flash Triage (Telugu, Hindi, English)',
      tab: 'triage',
      kicker: 'STEP 3 OF 5 · MULTIMODAL INTELLIGENCE',
      description:
        'When a citizen reports flooded underpasses or sparking wires with photos, Gemini 3.8 Flash assesses severity, verifies the scene, dispatches 108 ambulances & SDRF boats, and generates spoken safety advice in Telugu (తెలుగు) or Hindi.',
      highlightText:
        'Click "Play Voice Broadcast" in the triage console: Listen to the AI speak verified life-saving instructions aloud in Telugu or Hindi.',
      actionLabel: 'See GMC Autonomous Grid Control ›',
    },
    {
      title: 'GMC & APCPDCL Autonomous Grid Actuators',
      tab: 'operations',
      kicker: 'STEP 4 OF 5 · ZERO-DELAY ACTION',
      description:
        'Unlike passive dashboards that only show graphs, Resilify AI takes instant SCADA action: it pre-empts traffic lights along the GGH Guntur hospital corridor for 108 ambulances, opens GMC storm drain sluice gates, and trips 11kV feeder lines.',
      highlightText:
        'Click "Pre-empt 108 GGH Corridor" under GMC Autonomous Actuators to see live signal lock confirmation.',
      actionLabel: 'Review Jury Scorecard & ROI ›',
    },
    {
      title: 'UN SDGs, Indian Smart Cities & Measurable ROI',
      tab: 'jury',
      kicker: 'STEP 5 OF 5 · HACKATHON EVALUATION CRITERIA',
      description:
        'Resilify AI directly fulfills UN Sustainable Development Goals 11, 3, and 13. It cuts emergency response time by 69% and prevents electrocution fatalities across Guntur and Andhra Pradesh.',
      highlightText:
        'Test the Interactive Jury Defense Assistant by clicking any question to see how our architecture coordinates with 10th Bn NDRF (ANU Guntur) and APSDMA.',
      actionLabel: 'Finish Walkthrough',
    },
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onNavigateTab(tourSteps[nextStep].tab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onNavigateTab(tourSteps[prevStep].tab);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="max-w-xl w-full bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-5 text-left relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Jury Tour Guide Modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <span>{step.kicker}</span>
        </div>

        {/* Step Title */}
        <h2 id="tour-step-title" className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {step.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {step.description}
        </p>

        {/* Highlight Callout Box */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-white">What to point out to the jury: </span>
            {step.highlightText}
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep + 1} of ${tourSteps.length}`}>
            {tourSteps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>{step.actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
