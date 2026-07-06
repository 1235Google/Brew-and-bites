import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface ProcessingOverlayProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ onComplete, isDarkMode }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const paymentSteps = [
    'Initializing secure UPI sandbox handshake...',
    'Verifying encrypted UPI transaction...',
    'Authorizing UPI transaction via secure device passkey...',
    'Broadcasting encrypted NPCI receipt hash...',
    'Brew & Bites payment approved! 🎉'
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < paymentSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    const completionTimeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-3xl flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full p-8 flex flex-col items-center bg-gray-950/20 border border-white/10 rounded-[36px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow backdrop bubble */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

        {/* Animated Radial Loader */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          {/* Outermost glowing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/15 animate-ping" />
          
          {/* Inner rotating dash border */}
          <div className="absolute inset-1 rounded-full border-4 border-t-indigo-500 border-r-blue-400 border-b-transparent border-l-transparent animate-spin duration-1000" />
          
          {/* Slower counter-rotating secondary ring */}
          <div className="absolute inset-3 rounded-full border-2 border-t-transparent border-r-transparent border-b-purple-500 border-l-cyan-400 animate-spin-reverse duration-1500" />
          
          {/* Center lock icon */}
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Status Headings */}
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Verifying Secure UPI Payment
          </h2>
          
          {/* Stepper text with typing look */}
          <div className="min-h-[48px] flex items-center justify-center">
            <p className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/15 max-w-sm">
              {paymentSteps[stepIndex]}
            </p>
          </div>
          
          <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
            Your payment is protected using secure encrypted verification. Never shared with merchants or outside brokers.
          </p>
        </div>

        {/* Security badges */}
        <div className="mt-12 pt-6 border-t border-white/5 w-full flex items-center justify-center gap-4 text-white/60 text-[9px] font-bold uppercase tracking-widest flex-wrap">
          <div className="flex items-center gap-1">
            <span>🔒</span>
            <span>RBI Compliant</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1">
            <span>🛡</span>
            <span>NPCI Verified</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1">
            <span>⚡</span>
            <span>Secure UPI</span>
          </div>
        </div>

      </div>
    </div>
  );
};
