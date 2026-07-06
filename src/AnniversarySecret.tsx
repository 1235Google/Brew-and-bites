import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Heart, Sparkles, Award } from 'lucide-react';
import { 
  playAnniversaryDoorbell, 
  startAnniversarySoundtrack, 
  stopAnniversarySoundtrack, 
  setAnniversaryMute, 
  getAnniversaryMute 
} from '../utils/anniversaryAudio';

interface AnniversarySecretProps {
  onClose: () => void;
  isDarkMode: boolean;
}

type SurpriseStep = 
  | 'doorbell' 
  | 'doorOpening' 
  | 'reveal' 
  | 'message' 
  | 'celebration' 
  | 'finalScreen';

export const AnniversarySecret: React.FC<AnniversarySecretProps> = ({ onClose, isDarkMode }) => {
  const [step, setStep] = useState<SurpriseStep>('doorbell');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(getAnniversaryMute());
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  
  // Typewriter text state
  const [typedMessage, setTypedMessage] = useState<string>('');
  const fullMessage = `You've spent sixteen beautiful years delivering love, care and happiness to our family.\n\nToday, this little order is delivered with all my love, to celebrate the two people who make our house feel like home.\n\nHappy 16th Anniversary.\n\nThank you for everything.\n\n❤️`;

  // Celebration counter state
  const [yearsCounter, setYearsCounter] = useState<number>(0);
  const [showHeartSwelling, setShowHeartSwelling] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Doorbell & Door opening timeline
  useEffect(() => {
    if (step === 'doorbell') {
      // Play doorbell chime immediately
      const timer = setTimeout(() => {
        playAnniversaryDoorbell();
      }, 500);

      // Transition to door opening after 2.5 seconds
      const nextTimer = setTimeout(() => {
        setStep('doorOpening');
        setDoorsOpen(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(nextTimer);
      };
    }
  }, [step]);

  // Doors slide open, then trigger reveal
  useEffect(() => {
    if (step === 'doorOpening') {
      // Doors take 3 seconds to open, play music at 1.5s, transition to reveal at 3.5s
      const musicTimer = setTimeout(() => {
        startAnniversarySoundtrack();
      }, 1200);

      const revealTimer = setTimeout(() => {
        setStep('reveal');
      }, 3800);

      return () => {
        clearTimeout(musicTimer);
        clearTimeout(revealTimer);
      };
    }
  }, [step]);

  // Handle heading reveal timeline and trigger typewriter
  const [visibleLines, setVisibleLines] = useState<number>(0);
  useEffect(() => {
    if (step === 'reveal') {
      const line1 = setTimeout(() => setVisibleLines(1), 500);
      const line2 = setTimeout(() => setVisibleLines(2), 1500);
      const line3 = setTimeout(() => setVisibleLines(3), 2500);
      
      const transitionToMsg = setTimeout(() => {
        setStep('message');
      }, 4500);

      return () => {
        clearTimeout(line1);
        clearTimeout(line2);
        clearTimeout(line3);
        clearTimeout(transitionToMsg);
      };
    }
  }, [step]);

  // Typewriter effect for the message
  useEffect(() => {
    if (step === 'message') {
      let index = 0;
      setTypedMessage('');
      
      const interval = setInterval(() => {
        if (index < fullMessage.length) {
          setTypedMessage((prev) => prev + fullMessage.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          // Wait 2.5 seconds, then go to celebration
          setTimeout(() => {
            setStep('celebration');
          }, 2000);
        }
      }, 32); // elegant typing speed

      return () => {
        clearInterval(interval);
      };
    }
  }, [step]);

  // Count up the anniversary years
  useEffect(() => {
    if (step === 'celebration') {
      let current = 0;
      const duration = 1600; // ms
      const incrementTime = Math.floor(duration / 16);
      
      const interval = setInterval(() => {
        if (current < 16) {
          current++;
          setYearsCounter(current);
        } else {
          clearInterval(interval);
        }
      }, incrementTime);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Master mute control
  const handleToggleMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    setAnniversaryMute(nextMute);
  };

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      stopAnniversarySoundtrack();
    };
  }, []);

  // CANVAS CELEBRATION ENGINE
  // Renders beautiful, smooth cinematic gold confetti, sparkles, floaty hearts, and gentle firework plumes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle Base Class Type
    interface VisualParticle {
      type: 'sparkle' | 'heart' | 'confetti' | 'firework_flare' | 'firework_ember';
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
      maxLife: number;
      spin?: number;
      spinSpeed?: number;
      wiggle?: number;
      wiggleSpeed?: number;
    }

    const particles: VisualParticle[] = [];

    const createSparkle = (x: number, y: number) => {
      const colors = ['#FFFDD0', '#F3E5AB', '#D4AF37', '#C5A880', '#FFFFFF'];
      particles.push({
        type: 'sparkle',
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 80 + 40,
        wiggle: Math.random() * Math.PI * 2,
        wiggleSpeed: Math.random() * 0.05 + 0.02
      });
    };

    const createHeart = () => {
      particles.push({
        type: 'heart',
        x: Math.random() * width,
        y: height + 20,
        vx: (Math.random() - 0.5) * 1.0,
        vy: -Math.random() * 1.2 - 0.6,
        size: Math.random() * 12 + 6,
        color: Math.random() > 0.3 ? '#D4AF37' : '#E53E3E', // Gold and subtle red hearts
        alpha: Math.random() * 0.5 + 0.3,
        life: 0,
        maxLife: Math.random() * 200 + 150,
        wiggle: Math.random() * Math.PI * 2,
        wiggleSpeed: Math.random() * 0.02 + 0.01
      });
    };

    const createConfetti = () => {
      const colors = ['#D4AF37', '#AA7C11', '#AA7C11', '#FDFBF7', '#8A6623', '#C5A880'];
      particles.push({
        type: 'confetti',
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.5) * 2.0,
        vy: Math.random() * 1.5 + 1.0,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        life: 0,
        maxLife: Math.random() * 250 + 150,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.08
      });
    };

    const triggerSoftFirework = () => {
      const fireworkX = Math.random() * (width * 0.6) + width * 0.2;
      const fireworkY = Math.random() * (height * 0.4) + height * 0.15;
      const particleCount = Math.random() * 30 + 20;
      const colors = ['#FFFDD0', '#D4AF37', '#AA7C11', '#FAF5EF'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        particles.push({
          type: 'firework_ember',
          x: fireworkX,
          y: fireworkY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.2, // slight gravity
          size: Math.random() * 2.5 + 0.8,
          color: chosenColor,
          alpha: 1.0,
          life: 0,
          maxLife: Math.random() * 60 + 40
        });
      }
    };

    // Spawn cycles
    let frame = 0;
    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing background rays (ambient luxury vibes)
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      // Luxurious warm palette
      gradient.addColorStop(0, 'rgba(42, 26, 18, 1)'); // Deep warm brown
      gradient.addColorStop(0.5, 'rgba(23, 13, 8, 1)'); // Dark espresso
      gradient.addColorStop(1, 'rgba(10, 5, 3, 1)'); // Darkest midnight cocoa
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Ambient light sweep rays
      ctx.fillStyle = 'rgba(212, 175, 55, 0.015)';
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      const sweepX = (width / 2) + Math.sin(frame * 0.003) * (width * 0.4);
      ctx.lineTo(sweepX - 250, height);
      ctx.lineTo(sweepX + 250, height);
      ctx.closePath();
      ctx.fill();

      // Dynamic spawns based on active step
      if (step !== 'doorbell' && step !== 'doorOpening') {
        // Continuous soft ambient sparkles
        if (Math.random() < 0.35) {
          createSparkle(Math.random() * width, Math.random() * height);
        }
        
        // Spawn hearts
        if (Math.random() < 0.08) {
          createHeart();
        }

        // Confetti rains in celebration
        if (step === 'celebration' && Math.random() < 0.15) {
          createConfetti();
        }

        // Soft elegant fireworks in celebration
        if (step === 'celebration' && frame % 110 === 0) {
          triggerSoftFirework();
        }
      }

      // 2. Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Decelerate firework embers
        if (p.type === 'firework_ember') {
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.vy += 0.015; // slow gravity drift
          p.alpha = 1 - (p.life / p.maxLife);
        } else if (p.type === 'heart') {
          // Oscillating drift
          p.wiggle! += p.wiggleSpeed!;
          p.x += Math.sin(p.wiggle!) * 0.4;
          p.alpha = Math.min(1, 1.5 * (1 - (p.life / p.maxLife)));
        } else if (p.type === 'confetti') {
          p.spin! += p.spinSpeed!;
          p.x += Math.sin(p.life * 0.01) * 0.5;
          p.alpha = Math.min(1, 2 * (1 - (p.life / p.maxLife)));
        } else if (p.type === 'sparkle') {
          p.wiggle! += p.wiggleSpeed!;
          // Flicker alpha
          p.alpha = (Math.sin(p.wiggle!) * 0.3 + 0.7) * (1 - (p.life / p.maxLife));
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === 'heart') {
          // Draw heart path
          ctx.translate(p.x, p.y);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const d = p.size;
          ctx.moveTo(0, d / 4);
          ctx.quadraticCurveTo(0, 0, d / 2, 0);
          ctx.quadraticCurveTo(d, 0, d, d / 2);
          ctx.quadraticCurveTo(d, (d * 3) / 4, (d * 3) / 4, d);
          ctx.lineTo(0, d * 1.4);
          ctx.lineTo(- (d * 3) / 4, d);
          ctx.quadraticCurveTo(-d, (d * 3) / 4, -d, d / 2);
          ctx.quadraticCurveTo(-d, 0, - (d / 2), 0);
          ctx.quadraticCurveTo(0, 0, 0, d / 4);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'confetti') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin!);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 0.6);
        } else if (p.type === 'sparkle') {
          // Draw 4-point star sparkle
          ctx.translate(p.x, p.y);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);
          ctx.closePath();
          ctx.fill();
        } else {
          // standard ember circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [step]);

  // Handle final button trigger
  const handleFinalButtonPress = () => {
    setShowHeartSwelling(true);
    setTimeout(() => {
      setStep('finalScreen');
      setShowHeartSwelling(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center justify-center select-none bg-black">
      
      {/* 1. HIGH-PERFORMANCE BACKGROUND CANVAS ANIMATION */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* 2. GLOWING RADIAL SUN HALO BEHIND THE CLOSED/OPENING DOORS */}
      {step !== 'finalScreen' && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-amber-500/25 via-amber-800/5 to-transparent blur-3xl z-10 pointer-events-none transition-opacity duration-1000 ${
          doorsOpen ? 'opacity-100 animate-pulse' : 'opacity-20'
        }`} />
      )}

      {/* 3. FLOATING AUDIO CONTROLS HUD (TOP RIGHT) */}
      {step !== 'doorbell' && step !== 'doorOpening' && (
        <button
          onClick={handleToggleMute}
          className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/5 border border-white/10 text-[#C5A880] hover:text-[#FFFDD0] flex items-center justify-center transition-all hover:bg-white/10 active:scale-90 cursor-pointer shadow-xl backdrop-blur-md"
          title={isAudioMuted ? 'Unmute emotional track' : 'Mute track'}
        >
          {isAudioMuted ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* 4. PHYSICAL DOUBLE SLIDING DOORS LAYER */}
      {(step === 'doorbell' || step === 'doorOpening') && (
        <div className="absolute inset-0 w-full h-full z-40 overflow-hidden flex pointer-events-none">
          {/* Left Door Panel */}
          <div 
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#170E0A] via-[#2D1B13] to-[#1E110A] border-r-2 border-[#D4AF37]/40 shadow-[10px_0_30px_rgba(0,0,0,0.6)] flex items-center justify-end pr-4 transition-transform duration-[3500ms] ease-in-out select-none ${
              doorsOpen ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Elegant luxury classical moldings */}
            <div className="absolute inset-8 border border-white/5 rounded-lg pointer-events-none flex flex-col justify-between p-6 opacity-30">
              <div className="border border-white/5 h-24 rounded" />
              <div className="border border-white/5 h-48 rounded" />
              <div className="border border-white/5 h-24 rounded" />
            </div>
            
            {/* Brass Handle Left */}
            <div className="relative w-3.5 h-24 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 border border-amber-200/50 shadow-[2px_4px_10px_rgba(0,0,0,0.4)] mr-1 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200 absolute top-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200 absolute bottom-2" />
            </div>
          </div>

          {/* Right Door Panel */}
          <div 
            className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#170E0A] via-[#2D1B13] to-[#1E110A] border-l-2 border-[#D4AF37]/40 shadow-[-10px_0_30px_rgba(0,0,0,0.6)] flex items-center justify-start pl-4 transition-transform duration-[3500ms] ease-in-out select-none ${
              doorsOpen ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Elegant moldings */}
            <div className="absolute inset-8 border border-white/5 rounded-lg pointer-events-none flex flex-col justify-between p-6 opacity-30">
              <div className="border border-white/5 h-24 rounded" />
              <div className="border border-white/5 h-48 rounded" />
              <div className="border border-white/5 h-24 rounded" />
            </div>

            {/* Brass Handle Right */}
            <div className="relative w-3.5 h-24 rounded-full bg-gradient-to-l from-amber-300 via-amber-500 to-amber-600 border border-amber-200/50 shadow-[-2px_4px_10px_rgba(0,0,0,0.4)] ml-1 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200 absolute top-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200 absolute bottom-2" />
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTENT LAYER: STAGE REVEALS */}
      <div className="relative z-30 max-w-2xl px-6 text-center flex flex-col items-center justify-center min-h-screen py-12 scrollbar-none w-full overflow-y-auto">

        {/* DOORBELL STAGE */}
        {step === 'doorbell' && (
          <div className="space-y-4 animate-pulse">
            <div className="text-4xl">🚪</div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A880]">Approaching Entrance Lobby...</p>
            <p className="text-[10px] text-gray-500 font-mono">🛎️ Doorbell ringing sequence active</p>
          </div>
        )}

        {/* DOOR OPENING STAGE */}
        {step === 'doorOpening' && (
          <div className="space-y-4 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#FFFDD0] animate-pulse">Welcome Home</p>
            <p className="text-[10px] text-amber-500/60 font-mono">Cinematic sequence loading...</p>
          </div>
        )}

        {/* REVEAL STAGE */}
        {step === 'reveal' && (
          <div className="space-y-6">
            <div className={`text-6xl md:text-7xl transition-all duration-1000 transform ${
              visibleLines >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              ❤️
            </div>
            
            <h1 className={`font-sans font-black text-4xl md:text-6xl tracking-tight leading-none bg-gradient-to-b from-[#FFFDD0] via-[#D4AF37] to-[#996515] bg-clip-text text-transparent transition-all duration-1000 delay-500 transform ${
              visibleLines >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Happy 16th Anniversary
            </h1>

            <p className={`font-serif italic text-2xl md:text-4xl text-[#FDFBF7] font-medium transition-all duration-1000 delay-[1200ms] transform ${
              visibleLines >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Mom & Dad
            </p>
          </div>
        )}

        {/* TYPEWRITER MESSAGE STAGE */}
        {step === 'message' && (
          <div className="space-y-8 max-w-lg mx-auto">
            <div className="text-3xl animate-bounce">💌</div>
            <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
              <p className="font-serif text-[14.5px] leading-loose text-gray-100 font-medium whitespace-pre-wrap select-text italic">
                {typedMessage}
                <span className="inline-block w-1.5 h-4.5 bg-amber-400 ml-1 animate-ping" />
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 animate-pulse">Translating custom note from your child...</p>
          </div>
        )}

        {/* CELEBRATION STAGE (DASHBOARD COMPILATION) */}
        {step === 'celebration' && (
          <div className="w-full space-y-8 animate-fade-in py-6">
            
            {/* Header branding */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6F3B16] to-[#D4AF37] flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white animate-pulse fill-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A880]">Sixteen Golden Milestones</span>
            </div>

            {/* STAGE 10 — CELEBRATION TIMER */}
            <div className="p-8 rounded-[40px] bg-gradient-to-b from-[#1C120D] to-[#120A06] border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden max-w-md mx-auto">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-[#D4AF37]/20 to-transparent blur-xl" />
              
              <div className="flex flex-col items-center">
                {/* Rolling elegant numbers */}
                <div className="relative w-36 h-36 rounded-full border-4 border-double border-[#D4AF37]/50 flex items-center justify-center bg-[#000000]/30 shadow-inner">
                  <div className="absolute inset-1 rounded-full border border-[#D4AF37]/10 animate-spin" style={{ animationDuration: '15s' }} />
                  <span className="text-6xl font-black tracking-tighter bg-gradient-to-b from-[#FFFDD0] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent font-mono animate-scale-up-spring">
                    {yearsCounter}
                  </span>
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-lg font-serif italic text-white font-semibold">Sixteen Beautiful Years</h3>
                  <p className="text-[10.5px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">Of Unconditional Love & Care</p>
                </div>
              </div>
            </div>

            {/* STAGE 9 — FINAL CARD */}
            <div className="glass-panel p-8 rounded-[40px] border border-white/10 bg-white/2 backdrop-blur-xl shadow-2xl max-w-md mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-1 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>With Love ❤️</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>

              <blockquote className="font-serif text-[13.5px] leading-loose text-gray-100 italic">
                "Every cup of coffee,<br />
                every smile,<br />
                every sacrifice,<br />
                every lesson,<br />
                every hug...<br />
                <span className="text-white font-bold not-italic">Thank you for making our lives beautiful.</span><br />
                Happy 16th Anniversary."
              </blockquote>
            </div>

            {/* STAGE 11 — FINAL BUTTON */}
            <div className="pt-2 max-w-xs mx-auto">
              <button
                onClick={handleFinalButtonPress}
                className="w-full py-4.5 px-8 rounded-full bg-gradient-to-r from-[#8C5D3F] via-[#AA7C11] to-[#D4AF37] hover:from-amber-700 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                <span>❤️ Thank You Mom & Dad</span>
              </button>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-3">Tap to complete custom celebration</p>
            </div>

          </div>
        )}

        {/* FINAL SCREEN (LOVINGLY MADE CREDITS) */}
        {step === 'finalScreen' && (
          <div className="space-y-8 animate-fade-in max-w-md py-12">
            
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4E2B14] to-[#C5A880] flex items-center justify-center text-white text-3xl font-black shadow-xl border-2 border-white/25">
                👨‍👩‍👦
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] block leading-none">A Surprise Complete</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-tight">Our Lives Are Beautiful Because of You</h2>
              <div className="w-12 h-[2px] bg-[#D4AF37]/50 mx-auto my-4" />
              <p className="text-xs leading-relaxed text-gray-300 italic font-serif">
                "Today and every day, we celebrate the bond that built our home. May your journey of sixteen years continue to blossom with infinite joy."
              </p>
            </div>

            <div className="p-6 rounded-[32px] bg-[#000000]/30 border border-white/5 backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FFFDD0] leading-none mb-1">Made With Infinite Love</p>
              <p className="text-[10.5px] text-gray-400 font-medium leading-relaxed">This digital anniversary experience was lovingly programmed by your child to celebrate your absolute happiness.</p>
            </div>

            <button
              onClick={onClose}
              className="py-3 px-6 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#C5A880] hover:text-[#FFFDD0] hover:bg-white/5 transition-all cursor-pointer"
            >
              Back to App Workspace
            </button>

          </div>
        )}

      </div>

      {/* 6. FULL SCREEN HEART SWELL TRANSITION INTERCEPTOR */}
      {showHeartSwelling && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-transparent">
          <div className="w-24 h-24 bg-rose-600 rounded-full animate-heart-swell" />
        </div>
      )}

      {/* Tailwind and custom animation injection */}
      <style>{`
        @keyframes heart-swell {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          100% {
            transform: scale(40);
            opacity: 1;
            background-color: #0d0806;
          }
        }
        .animate-heart-swell {
          animation: heart-swell 1.5s forwards ease-in;
        }
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>

    </div>
  );
};
