/**
 * Autonomous Cyber Audio Synthesizer for Guntur Municipal Command Interface
 * Uses browser Web Audio API to create futuristic tactical feedback without external audio assets.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Load persisted preference
try {
  const saved = localStorage.getItem('resilify_sound_fx');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
} catch {
  // Ignore local storage error in sandboxes
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('resilify_sound_fx', String(soundEnabled));
  } catch {
    // Ignore storage issues
  }
  if (soundEnabled) {
    playCyberTone('blip', 600, 0.08);
  }
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playCyberTone(
  type: 'blip' | 'scan' | 'actuator' | 'warning' | 'zoom',
  freq = 520,
  duration = 0.09
) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'blip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + duration);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else if (type === 'scan') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + duration * 1.5);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);
    } else if (type === 'zoom') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq + (freq > 500 ? 120 : -100), now + duration);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else if (type === 'actuator') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    } else if (type === 'warning') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.setValueAtTime(350, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    }

    osc.start(now);
    osc.stop(now + (type === 'warning' ? 0.25 : duration * 1.6));
  } catch {
    // Fail silently if browser blocks autoplay audio context
  }
}
