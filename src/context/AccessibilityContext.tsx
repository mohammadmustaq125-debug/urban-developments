import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'Telugu' | 'Hindi' | 'English';
export type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (value: boolean | ((prev: boolean) => boolean)) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean | ((prev: boolean) => boolean)) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (value: boolean | ((prev: boolean) => boolean)) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  screenReaderAnnouncement: string;
  announce: (message: string) => void;
  speakText: (text: string, forceLang?: SupportedLanguage) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('resilify_high_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('resilify_font_size') as FontSize) || 'normal';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return (
      localStorage.getItem('resilify_reduced_motion') === 'true' ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  });

  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(() => {
    return localStorage.getItem('resilify_dyslexia_font') === 'true';
  });

  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('resilify_language') as SupportedLanguage) || 'Telugu';
  });

  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync high contrast with document element
  useEffect(() => {
    localStorage.setItem('resilify_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('wcag-high-contrast');
    } else {
      document.documentElement.classList.remove('wcag-high-contrast');
    }
  }, [highContrast]);

  // Sync font size
  useEffect(() => {
    localStorage.setItem('resilify_font_size', fontSize);
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${fontSize}`);
  }, [fontSize]);

  // Sync reduced motion
  useEffect(() => {
    localStorage.setItem('resilify_reduced_motion', String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  // Sync dyslexia font
  useEffect(() => {
    localStorage.setItem('resilify_dyslexia_font', String(dyslexiaFont));
    if (dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-friendly');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
    }
  }, [dyslexiaFont]);

  // Sync language with html lang tag
  useEffect(() => {
    localStorage.setItem('resilify_language', language);
    const langCode = language === 'Telugu' ? 'te' : language === 'Hindi' ? 'hi' : 'en';
    document.documentElement.lang = langCode;
  }, [language]);

  const announce = (message: string) => {
    setScreenReaderAnnouncement(message);
    // Auto-clear after 3 seconds so subsequent identical messages trigger re-announcement
    setTimeout(() => {
      setScreenReaderAnnouncement((prev) => (prev === message ? '' : prev));
    }, 3000);
  };

  const speakText = (text: string, forceLang?: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (!text.trim()) {
      setIsSpeaking(false);
      return;
    }

    const targetLang = forceLang || language;
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = targetLang === 'Telugu' ? 'te-IN' : targetLang === 'Hindi' ? 'hi-IN' : 'en-IN';
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(langCode.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
        screenReaderAnnouncement,
        announce,
        speakText,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
      {/* Invisible screen reader announcer landmark */}
      <div
        id="resilify-a11y-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {screenReaderAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
