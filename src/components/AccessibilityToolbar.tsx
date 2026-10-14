import React, { useState } from 'react';
import { useAccessibility, SupportedLanguage } from '../context/AccessibilityContext';
import {
  Globe,
  Eye,
  Type,
  Volume2,
  VolumeX,
  Keyboard,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    dyslexiaFont,
    setDyslexiaFont,
    language,
    setLanguage,
    announce,
    speakText,
    stopSpeaking,
    isSpeaking,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);

  const handleToggleContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      announce(next ? 'High Contrast Mode Enabled (WCAG AAA)' : 'Standard Contrast Mode Enabled');
      return next;
    });
  };

  const handleCycleFontSize = () => {
    if (fontSize === 'normal') {
      setFontSize('large');
      announce('Font size set to Large (115%)');
    } else if (fontSize === 'large') {
      setFontSize('xlarge');
      announce('Font size set to Extra Large (130%)');
    } else {
      setFontSize('normal');
      announce('Font size reset to Normal (100%)');
    }
  };

  const handleSelectLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    announce(`Language switched to ${newLang}`);
  };

  const handleSpeakOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
      announce('Speech synthesis stopped');
    } else {
      const speechMap = {
        Telugu: 'రెసిలిఫై ఏఐ గుంటూరు మెట్రోపాలిటన్ శాటిలైట్ మరియు మునిసిపల్ విపత్తు నిర్వహణ వ్యవస్థ. కృష్ణా నది వరదలు, విద్యుత్ ప్రమాదాలు మరియు 108 అంబులెన్స్ గ్రీన్ కారిడార్లకు ఇది తక్షణ పరిష్కారం అందిస్తుంది.',
        Hindi: 'रेसिलिफाई एआई गुंटूर मेट्रोपॉलिटन सैटेलाइट और आपदा प्रबंधन प्रणाली है। यह कृष्णा बाढ़, बिजली के खतरों और 108 एम्बुलेंस के लिए तत्काल प्रतिक्रिया प्रदान करता है।',
        English: 'Resilify AI is the autonomous disaster intelligence and satellite resilience grid for Guntur Municipal Corporation and APSDMA, coordinating rapid citizen triage, 108 ambulance green corridors, and power isolations.',
      };
      announce('Reading platform overview aloud in ' + language);
      speakText(speechMap[language]);
    }
  };

  return (
    <>
      {/* Quick Access Top Bar Strip */}
      <aside
        aria-label="Accessibility and Inclusive Navigation Controls"
        className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-200"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 shrink-0">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="uppercase tracking-wider">Easy A11y / సులభ సౌలభ్యం:</span>
          </div>

          {/* 1-Click Direct Vernacular Language Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5" aria-hidden="true" />
            {(['Telugu', 'Hindi', 'English'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => handleSelectLanguage(l)}
                aria-pressed={language === l}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  language === l
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {l === 'Telugu' ? 'తెలుగు' : l === 'Hindi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle Button */}
          <button
            type="button"
            onClick={handleToggleContrast}
            aria-pressed={highContrast}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              highContrast
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md font-black'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" aria-hidden="true" />
            <span>High Contrast (WCAG AAA)</span>
          </button>

          {/* Font Resizing Button */}
          <button
            type="button"
            onClick={handleCycleFontSize}
            aria-label={`Cycle font size. Current is ${fontSize}`}
            className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Text: {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}</span>
          </button>
        </div>

        {/* Right side accessibility triggers */}
        <div className="flex items-center gap-2">
          {/* TTS Screen Reader Trigger */}
          <button
            type="button"
            onClick={handleSpeakOverview}
            aria-label={isSpeaking ? 'Stop speaking audio guide' : 'Read platform emergency overview aloud'}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse font-black'
                : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                <span>ఆపు (Stop Audio)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>వినండి (Voice Guide)</span>
              </>
            )}
          </button>

          {/* More A11y options dropdown trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label="Open Full Accessibility Settings"
            className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
          >
            Preferences
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            type="button"
            onClick={() => setShowKeyboardModal(true)}
            aria-label="View Keyboard Accessibility Shortcuts"
            className="px-2 py-1 rounded text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </aside>

      {/* Expanded Accessibility Preferences Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-settings-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 id="a11y-settings-title" className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                Universal Accessibility & Inclusion Controls
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Accessibility Preferences Modal"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {/* High Contrast */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-white">WCAG 2.1 AAA High Contrast</div>
                  <div className="text-slate-400 text-[11px]">7:1+ contrast ratio with sharp borders</div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleContrast}
                  className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer ${
                    highContrast ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {highContrast ? 'Active' : 'Enable'}
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-white">Reduced Motion</div>
                  <div className="text-slate-400 text-[11px]">Disables animations for vestibular comfort</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReducedMotion((prev) => {
                      const next = !prev;
                      announce(next ? 'Reduced Motion enabled' : 'Reduced Motion disabled');
                      return next;
                    });
                  }}
                  className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer ${
                    reducedMotion ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {reducedMotion ? 'Active' : 'Enable'}
                </button>
              </div>

              {/* Dyslexia-Friendly Legibility */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-white">Enhanced Readability & Dyslexia Spacing</div>
                  <div className="text-slate-400 text-[11px]">Increases letter-spacing and line height</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDyslexiaFont((prev) => {
                      const next = !prev;
                      announce(next ? 'Dyslexia font spacing enabled' : 'Dyslexia font spacing disabled');
                      return next;
                    });
                  }}
                  className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer ${
                    dyslexiaFont ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {dyslexiaFont ? 'Active' : 'Enable'}
                </button>
              </div>

              {/* Font Size Choices */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">Text Size Scaling</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setFontSize(size);
                        announce(`Text scale set to ${size}`);
                      }}
                      className={`py-1.5 rounded text-center text-xs font-bold cursor-pointer ${
                        fontSize === size
                          ? 'bg-cyan-400 text-slate-950 ring-1 ring-cyan-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {size === 'normal' ? '100% (Normal)' : size === 'large' ? '115% (Large)' : '130% (X-Large)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Dialog */}
      {showKeyboardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-shortcuts-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 id="keyboard-shortcuts-title" className="text-base font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                Keyboard Accessibility Shortcuts
              </h2>
              <button
                type="button"
                onClick={() => setShowKeyboardModal(false)}
                aria-label="Close Keyboard Shortcuts Modal"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Skip to Main Content</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-cyan-300">
                  Tab (at top)
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Switch Tabs</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-cyan-300">
                  Tab / Shift+Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Activate Buttons / Modals</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-cyan-300">
                  Enter / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Close Modal / Dismiss Dialog</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-cyan-300">
                  Escape (Esc)
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Screen Reader Announcer</span>
                <span className="text-slate-400 font-mono">ARIA Live Polite Region active</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowKeyboardModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
