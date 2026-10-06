import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function VoiceInput({ targetPhrase, onResult, onSkip }) {
  const { speak } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);

      if (event.results[current].isFinal) {
        evaluateAccuracy(text);
      }
    };

    recognition.onerror = (event) => {
      console.warn('[SpeechRecognition] error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. You can skip this optional stage or try again.');
      } else {
        setErrorMsg('Speech recognition could not capture your voice clearly. Feel free to retry or skip.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [targetPhrase]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Speech recognition is not supported in this browser.');
      return;
    }
    setTranscript('');
    setSimilarity(null);
    setErrorMsg(null);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition already started', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Levenshtein / Word-level similarity calculation
  const evaluateAccuracy = (recognizedText) => {
    const cleanTarget = targetPhrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    const cleanRecognized = recognizedText.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);

    let matchCount = 0;
    cleanTarget.forEach(word => {
      if (cleanRecognized.includes(word)) {
        matchCount++;
      }
    });

    const score = Math.min(100, Math.round((matchCount / cleanTarget.length) * 100));
    setSimilarity(score);

    if (onResult) {
      onResult({
        attempted: true,
        confidenceScore: score,
        recognizedText,
        targetPhrase
      });
    }
  };

  const handleSimulateManual = () => {
    const simulated = targetPhrase;
    setTranscript(simulated);
    evaluateAccuracy(simulated);
  };

  return (
    <div className="rounded-3xl border border-emerald-800/80 bg-[#0d1611] p-6 sm:p-8 text-center space-y-5 font-jakarta shadow-xl">
      <div className="max-w-lg mx-auto">
        <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full">
          Oral Reading Sentence
        </span>
        <div className="mt-4 p-5 rounded-2xl bg-[#070e0a] border border-emerald-800/80 shadow-md">
          <p className="text-xl md:text-2xl font-bold tracking-wide text-white">
            "{targetPhrase}"
          </p>
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => speak(targetPhrase)}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to pronunciation model</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mic Status & Actions */}
      <div className="flex flex-col items-center gap-3">
        {isListening ? (
          <button
            onClick={stopListening}
            className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg animate-pulse focus:ring-4 focus:ring-rose-300 transition-all cursor-pointer"
            aria-label="Stop recording"
          >
            <MicOff className="w-7 h-7" />
          </button>
        ) : (
          <button
            onClick={startListening}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Start recording"
          >
            <Mic className="w-7 h-7 stroke-[2.5]" />
          </button>
        )}

        <div className="text-sm font-semibold text-emerald-200">
          {isListening ? (
            <span className="text-rose-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Listening... Read clearly into your mic
            </span>
          ) : similarity !== null ? (
            <span className="text-emerald-400 font-bold">
              Recording captured! You can re-record or proceed.
            </span>
          ) : (
            'Tap the microphone and read out loud'
          )}
        </div>
      </div>

      {/* Live Transcript / Result */}
      {transcript && (
        <div className="p-4 rounded-xl bg-[#070e0a] border border-emerald-800 text-left max-w-lg mx-auto">
          <div className="text-xs text-emerald-400/70 font-bold uppercase mb-1">What We Heard:</div>
          <p className="text-base text-white font-medium italic">
            "{transcript}"
          </p>
          {similarity !== null && (
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-900/60">
              <span className="text-xs font-semibold text-emerald-300">
                Word Match Alignment:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {similarity}% Matched
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error or unsupported fallback */}
      {(!isSupported || errorMsg) && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 text-emerald-200 border border-emerald-800 text-xs max-w-lg mx-auto flex items-start gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <span>{errorMsg || 'Browser voice recognition is not available on this device.'}</span>
            <div className="mt-1 font-semibold text-emerald-300">
              No problem! You can read the sentence to yourself and tap below:
            </div>
            <button
              onClick={handleSimulateManual}
              type="button"
              className="mt-2 px-3 py-1 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 cursor-pointer"
            >
              I Read It Out Loud!
            </button>
          </div>
        </div>
      )}

      {/* Skip Button (Zero Penalty) */}
      <div className="pt-2">
        <button
          onClick={onSkip}
          type="button"
          className="text-xs text-emerald-400/60 hover:text-emerald-300 underline font-medium cursor-pointer"
        >
          Skip Voice Reading (Weights dynamically re-balance without penalty)
        </button>
      </div>
    </div>
  );
}
