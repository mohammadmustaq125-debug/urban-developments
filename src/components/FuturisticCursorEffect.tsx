import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crosshair, Radio, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, toggleSound, playCyberTone } from '../utils/cyberAudio';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const FuturisticCursorEffect: React.FC = () => {
  const { reducedMotion } = useAccessibility();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [delayedPos, setDelayedPos] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [isEffectsEnabled, setIsEffectsEnabled] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(isSoundEnabled());
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Check if touch device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Mouse move listener
  useEffect(() => {
    if (reducedMotion || isTouchDevice || !isEffectsEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], [role="tab"]');
        setIsHoveringInteractive(!!interactive);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      playCyberTone('blip', 650, 0.05);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [reducedMotion, isTouchDevice, isEffectsEnabled]);

  // Smooth lag for the trailing targeting reticle ring
  useEffect(() => {
    if (reducedMotion || isTouchDevice || !isEffectsEnabled) return;

    const followCursor = () => {
      setDelayedPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      animFrameRef.current = requestAnimationFrame(followCursor);
    };

    animFrameRef.current = requestAnimationFrame(followCursor);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pos, reducedMotion, isTouchDevice, isEffectsEnabled]);

  if (reducedMotion || isTouchDevice) {
    return null;
  }

  // Calculate simulated geographic coordinate in Guntur District based on viewport
  const latCalc = (16.28 + (pos.y / (typeof window !== 'undefined' ? window.innerHeight || 800 : 800)) * 0.06).toFixed(4);
  const lngCalc = (80.40 + (pos.x / (typeof window !== 'undefined' ? window.innerWidth || 1200 : 1200)) * 0.08).toFixed(4);

  return (
    <>
      {/* 1. Ambient Cyber Spotlight Follower */}
      {isEffectsEnabled && pos.x >= 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, rgba(6, 182, 212, 0.07), transparent 80%)`,
          }}
        />
      )}

      {/* 2. Trailing Reticle Ring */}
      {isEffectsEnabled && pos.x >= 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
          style={{
            left: `${delayedPos.x}px`,
            top: `${delayedPos.y}px`,
            transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHoveringInteractive ? 1.6 : 1})`,
          }}
        >
          <div
            className={`w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center ${
              isHoveringInteractive
                ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'border-cyan-500/40'
            }`}
          >
            {/* Center target crosshair dots */}
            <span
              className={`w-1 h-1 rounded-full transition-all ${
                isHoveringInteractive ? 'bg-cyan-300 scale-150' : 'bg-cyan-400/60'
              }`}
            />
          </div>
        </div>
      )}

      {/* 3. Click Expanding Shockwaves */}
      {isEffectsEnabled &&
        ripples.map((r) => (
          <div
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/80 animate-ping"
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: '42px',
              height: '42px',
              animationDuration: '600ms',
            }}
          />
        ))}

      {/* 4. Bottom Futuristic HUD Status Strip (Toggable) */}
      <aside
        aria-label="Futuristic Command Telemetry and FX Controls"
        className="fixed bottom-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] text-slate-300 shadow-xl select-none"
      >
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-mono font-semibold tracking-wider">GMC HUD</span>
        </div>

        <span className="text-slate-600" aria-hidden="true">|</span>

        {/* Live Coordinate Display */}
        <div className="font-mono text-cyan-300 hidden sm:flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-cyan-400" aria-hidden="true" />
          <span>{latCalc}°N {lngCalc}°E</span>
        </div>

        <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

        {/* Cyber Sound FX Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = toggleSound();
            setIsSoundOn(next);
          }}
          aria-label={isSoundOn ? 'Mute futuristic tactical sound feedback' : 'Unmute futuristic tactical sound feedback'}
          title={isSoundOn ? 'Tactical audio FX: ON (Click to mute)' : 'Tactical audio FX: OFF (Click to unmute)'}
          className={`p-1 rounded cursor-pointer transition-colors ${
            isSoundOn ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/50' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isSoundOn ? <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> : <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>

        {/* Cursor Glow Effect Toggle */}
        <button
          type="button"
          onClick={() => setIsEffectsEnabled(!isEffectsEnabled)}
          aria-label={isEffectsEnabled ? 'Disable futuristic cursor glow' : 'Enable futuristic cursor glow'}
          title={isEffectsEnabled ? 'Cursor Cyber Glow: ON' : 'Cursor Cyber Glow: OFF'}
          className={`p-1 rounded cursor-pointer transition-colors ${
            isEffectsEnabled ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/50' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </aside>
    </>
  );
};
