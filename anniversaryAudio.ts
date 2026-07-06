// Web Audio API Synthesizer for Anniversary Surprise Background Soundtrack
// Provides an emotional, luxurious, ambient piano progression and realistic doorbell chime.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;
let loopIntervalId: any = null;
let currentChordIndex = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAnniversaryMute(muted: boolean) {
  isMuted = muted;
  if (masterGain && audioCtx) {
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    // Smooth transition
    masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.4, now + 0.5);
  }
}

export function getAnniversaryMute(): boolean {
  return isMuted;
}

// Play a single soft warm piano note with an exponential decay
function playPianoNote(ctx: AudioContext, destination: AudioNode, freq: number, startTime: number, duration: number, velocity: number = 0.5) {
  const osc = ctx.createOscillator();
  const subOsc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  // Route: oscs -> lowpass filter -> gain -> destination
  osc.connect(filter);
  subOsc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(destination);

  // Set up oscillators: triangle has a lovely woody flutey tone, perfect for soft electric piano
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  // Add a subtle sine overtone an octave higher for shine
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(freq * 2, startTime);

  // Filter sweep for warm piano resonance
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, startTime);
  filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

  // Gain Envelope
  gainNode.gain.setValueAtTime(0, startTime);
  // Soft piano attack
  gainNode.gain.linearRampToValueAtTime(velocity * 0.08, startTime + 0.05);
  // Long, emotional exponential decay
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.start(startTime);
  subOsc.start(startTime);
  osc.stop(startTime + duration + 0.1);
  subOsc.stop(startTime + duration + 0.1);
}

// 4 beautiful emotional chords
// Cmaj9 - Am9 - Fmaj9 - G6/9
const CHORDS = [
  // Cmaj9
  [130.81, 196.00, 246.94, 293.66, 329.63, 392.00], // C3, G3, B3, D4, E4, G4
  // Am9
  [110.00, 164.81, 196.00, 261.63, 329.63, 493.88], // A2, E3, G3, C4, E4, B4
  // Fmaj9
  [87.31, 130.81, 174.61, 220.00, 261.63, 392.00],  // F2, C3, F3, A3, C4, G4
  // G6/9
  [98.00, 146.83, 196.00, 246.94, 329.63, 440.00]   // G2, D3, G3, B3, E4, A4
];

function playNextChord() {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const chord = CHORDS[currentChordIndex];

  // Schedule notes with a delicate slow rolling arpeggiation (220ms stagger)
  chord.forEach((freq, idx) => {
    const noteTime = now + (idx * 0.22);
    const duration = 4.0 - (idx * 0.2); // each note gets a long decay
    // Bass note is heavier, high notes are softer and sweeter
    const velocity = idx === 0 ? 0.75 : 0.5 - (idx * 0.05);
    playPianoNote(ctx, masterGain!, freq, noteTime, duration, velocity);
  });

  currentChordIndex = (currentChordIndex + 1) % CHORDS.length;
}

export function startAnniversarySoundtrack() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Initialize master gain if not done yet
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }

  // Set initial volume with a gentle fade in
  const now = ctx.currentTime;
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.4, now + 3.0);

  // Play immediately
  currentChordIndex = 0;
  playNextChord();

  // Clear any existing loops
  if (loopIntervalId) {
    clearInterval(loopIntervalId);
  }

  // Loop a chord every 4.8 seconds
  loopIntervalId = setInterval(() => {
    playNextChord();
  }, 4800);
}

export function stopAnniversarySoundtrack() {
  if (loopIntervalId) {
    clearInterval(loopIntervalId);
    loopIntervalId = null;
  }
  if (masterGain && audioCtx) {
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.linearRampToValueAtTime(0, now + 1.0);
  }
}

/**
 * Realistic "Ding Dong" Doorbell Sound
 */
export function playAnniversaryDoorbell() {
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
    
    // Mellow triangle wave
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    
    // overtone
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 1.5, startTime); // golden ratio/metallic overtone
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : vol * 0.15, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    subOsc.stop(startTime + duration + 0.1);
  };

  // "Ding Dong" - G5 (783.99 Hz) then E5 (659.25 Hz)
  playBell(783.99, now, 2.5, 0.8);
  playBell(659.25, now + 0.65, 3.2, 0.75);
}
