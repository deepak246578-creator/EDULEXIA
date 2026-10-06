import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function SpeechReader({ text, label = 'Listen to text', size = 'md' }) {
  const { speak, stopSpeaking, isSpeaking } = useAccessibility();
  const [activeHere, setActiveHere] = useState(false);

  const handleToggle = () => {
    if (activeHere && isSpeaking) {
      stopSpeaking();
      setActiveHere(false);
    } else {
      setActiveHere(true);
      speak(text);
      // Auto-reset active state after reading ends or timeout
      setTimeout(() => setActiveHere(false), Math.max(3000, text.length * 80));
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`inline-flex items-center gap-2 rounded-full font-jakarta font-semibold transition-all shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer ${
        activeHere
          ? 'bg-emerald-500 text-black ring-2 ring-emerald-300 animate-pulse font-black'
          : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300'
      } ${isSmall ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm'}`}
      title={label}
      aria-label={label}
    >
      {activeHere ? (
        <>
          <VolumeX className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
