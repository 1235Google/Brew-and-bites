// Web Audio API Synthesizer for Food Delivery App
// Provides lightweight, professional audio chimes without relying on external files.

let audioCtx: AudioContext | null = null;
let globalMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Avoid creating unless user interacts or sound is triggered
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (browser security autoplay policies)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  globalMuted = muted;
}

export function isMuted(): boolean {
  return globalMuted;
}

/**
 * Play a simple organic bubble pop sound (for Add to Cart)
 */
export function playAddToCart() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.type = 'sine';
  
  // Frequency sweep for pop effect
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

  // Soft fade volume envelope
  gainNode.gain.setValueAtTime(0.15, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * Play a dual-tone ascending chime (for Order Placed)
 */
export function playOrderPlaced() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  const playNote = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  };

  // Play C5 (523.25Hz) then E5 (659.25Hz)
  playNote(523.25, now, 0.15);
  playNote(659.25, now + 0.12, 0.35);
}

/**
 * Play a high-pitched digital chime ring (for Restaurant Accepted)
 */
export function playOrderAccepted() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  const playNote = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  };

  // Upward sequence: E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.50Hz)
  playNote(659.25, now, 0.1);
  playNote(783.99, now + 0.08, 0.1);
  playNote(1046.50, now + 0.16, 0.3);
}

/**
 * Play a light "swoosh" plus bicycle bell ring (for Out for Delivery)
 */
export function playOutForDelivery() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sound 1: Wind/Swoosh using rapid bandpass-filtered noise
  // We can simulate with rapid pitch sweeps on dual sine oscillators
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.type = 'triangle';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(200, now);
  osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

  osc2.frequency.setValueAtTime(150, now);
  osc2.frequency.exponentialRampToValueAtTime(900, now + 0.2);

  gainNode.gain.setValueAtTime(0.05, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.21);
  osc2.stop(now + 0.21);

  // Sound 2: A bright "ding-ding" bicycle bell
  const playBellNote = (freq: number, startTime: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    // Add sub-harmonic for metallic ring
    const overtone = ctx.createOscillator();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 1.5, startTime);
    overtone.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0.0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
    
    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + 0.16);
    overtone.stop(startTime + 0.16);
  };

  playBellNote(1567.98, now + 0.15); // G6 bell
  playBellNote(1567.98, now + 0.24); // G6 bell double tap
}

/**
 * Play a major triad arpeggio + glorious chord resolve (for Delivered!)
 */
export function playDeliverySuccess() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  const playNote = (freq: number, startTime: number, duration: number, volume: number = 0.06) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  };

  // Ascending arpeggio
  playNote(523.25, now, 0.4);       // C5
  playNote(659.25, now + 0.1, 0.4); // E5
  playNote(783.99, now + 0.2, 0.4); // G5
  playNote(1046.50, now + 0.3, 0.6); // C6

  // Chord resolution together (Major triad)
  playNote(523.25, now + 0.45, 1.2, 0.04);
  playNote(659.25, now + 0.45, 1.2, 0.04);
  playNote(783.99, now + 0.45, 1.2, 0.04);
  playNote(1318.51, now + 0.45, 1.2, 0.04); // E6 high highlight
}

/**
 * Play a polite, gentle iOS-style double phone ring tone
 */
export function playPhoneRing() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  const playPulse = (startTime: number) => {
    // We can layer a couple of pure sines for a musical dual-tone ring
    const freq1 = 850;
    const freq2 = 1050;
    
    [freq1, freq2].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  };

  // Ring tone dual pulses
  playPulse(now);
  playPulse(now + 0.4);
}

/**
 * Realistic "Ding Dong" Doorbell Sound
 */
export function playDoorbell() {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  const playBell = (freq: number, startTime: number, duration: number, vol: number) => {
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 1.5, startTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    subOsc.stop(startTime + duration + 0.1);
  };

  // "Ding" (G5, 783.99Hz)
  playBell(783.99, now, 1.8, 0.12);
  // "Dong" (E5, 659.25Hz)
  playBell(659.25, now + 0.8, 2.2, 0.10);
}

