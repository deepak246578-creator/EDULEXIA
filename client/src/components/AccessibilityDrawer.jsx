import React from 'react';
import { X, Type, Palette, MoveHorizontal, AlignJustify, Eye, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityDrawer() {
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineSpacing,
    setLineSpacing,
    letterSpacing,
    setLetterSpacing,
    colorTheme,
    setColorTheme,
    readingGuide,
    setReadingGuide,
    ttsSpeed,
    setTtsSpeed,
    speak,
    resetAccessibility,
    drawerOpen,
    setDrawerOpen
  } = useAccessibility();

  if (!drawerOpen) return null;

  const fontOptions = [
    { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', note: 'Modern high-clarity geometry (Active)' },
    { id: 'Lexend', name: 'Lexend', note: 'Reduces visual crowding' },
    { id: 'Fredoka', name: 'Fredoka', note: 'Friendly rounded letterforms' },
    { id: 'Atkinson Hyperlegible', name: 'Atkinson', note: 'Max distinction' },
    { id: 'Comic Neue', name: 'Comic Neue', note: 'Separated letterforms' },
    { id: 'Inter', name: 'Inter', note: 'Modern crisp sans' }
  ];

  const themes = [
    { id: 'green-black', name: 'Green + Obsidian Black', bg: 'bg-[#070a08]', text: 'text-emerald-400', border: 'border-emerald-500' },
    { id: 'mint', name: 'Mint Soothe', bg: 'bg-[#06150e]', text: 'text-emerald-300', border: 'border-emerald-600' },
    { id: 'dark', name: 'Night Calm', bg: 'bg-[#050505]', text: 'text-slate-100', border: 'border-slate-700' },
    { id: 'cream', name: 'Warm Cream', bg: 'bg-[#faf6ee]', text: 'text-slate-800', border: 'border-amber-200' },
    { id: 'peach', name: 'Soft Peach', bg: 'bg-[#fff5ed]', text: 'text-amber-950', border: 'border-orange-200' },
    { id: 'blue', name: 'Sky Blue', bg: 'bg-[#0b1320]', text: 'text-sky-300', border: 'border-sky-600' },
    { id: 'high-contrast', name: 'High Contrast Neon', bg: 'bg-black', text: 'text-emerald-300', border: 'border-emerald-400' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-jakarta">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#0a120c] shadow-2xl h-full flex flex-col z-10 overflow-y-auto border-l border-emerald-900/80 text-emerald-100">
        {/* Header */}
        <div className="p-5 border-b border-emerald-900/70 flex items-center justify-between sticky top-0 bg-[#0a120c]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Reading Accessibility</h3>
              <p className="text-xs text-emerald-300/70">Personalize your reading comfort</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-emerald-950 text-emerald-400 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-7 flex-1">
          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <span>Text Size</span>
              </label>
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                {fontSize}px
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[15, 17, 19, 22, 26].map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 rounded-xl text-sm font-black transition-all border cursor-pointer ${
                    fontSize === size
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md glow-emerald'
                      : 'bg-[#070e0a] text-emerald-300 hover:border-emerald-600 border-emerald-950'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Dyslexia-Friendly Fonts */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Dyslexia-Optimized Typography</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {fontOptions.map(font => (
                <button
                  key={font.id}
                  onClick={() => setFontFamily(font.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    fontFamily === font.id
                      ? 'border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-500/50 shadow-md'
                      : 'border-emerald-950 bg-[#070e0a] hover:border-emerald-800'
                  }`}
                >
                  <div className="font-extrabold text-sm text-white" style={{ fontFamily: font.id }}>{font.name}</div>
                  <div className="text-[11px] text-emerald-400/60 mt-0.5">{font.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Background & Visual Comfort Tint</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${t.bg} ${t.text} ${
                    colorTheme === t.id ? 'ring-2 ring-emerald-400 shadow-lg font-bold border-emerald-400' : t.border
                  }`}
                >
                  <span className="text-xs">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spacing Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Line Spacing */}
            <div>
              <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                <AlignJustify className="w-3.5 h-3.5" />
                <span>Line Height</span>
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'relaxed', label: 'Relaxed' },
                  { id: 'loose', label: 'Spacious' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setLineSpacing(item.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg text-left transition-all border cursor-pointer ${
                      lineSpacing === item.id
                        ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold'
                        : 'bg-[#070e0a] border-emerald-950 text-emerald-300 hover:border-emerald-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Letter Spacing</span>
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'normal', label: 'Standard' },
                  { id: 'wide', label: 'Wide' },
                  { id: 'wider', label: 'Extra Wide' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setLetterSpacing(item.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg text-left transition-all border cursor-pointer ${
                      letterSpacing === item.id
                        ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold'
                        : 'bg-[#070e0a] border-emerald-950 text-emerald-300 hover:border-emerald-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reading Focus Ruler */}
          <div className="p-4 rounded-xl border border-emerald-800/80 bg-[#070e0a] flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Reading Focus Ruler</div>
              <div className="text-xs text-emerald-400/60">Highlights current line with cursor</div>
            </div>
            <button
              onClick={() => setReadingGuide(!readingGuide)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                readingGuide
                  ? 'bg-emerald-500 text-black shadow-md glow-emerald'
                  : 'bg-emerald-950 text-emerald-500/70 border border-emerald-900'
              }`}
            >
              {readingGuide ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Text to Speech Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Voice Narration Speed</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {ttsSpeed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={ttsSpeed}
              onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-emerald-400/60 mt-1 font-mono">
              <span>Slower (0.75x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.3x)</span>
            </div>
            <button
              onClick={() => speak("Hello! This is how the reading voice sounds at this speed.")}
              className="mt-2.5 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Audio Voice</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-900/80 bg-[#070e0a] flex gap-3">
          <button
            onClick={resetAccessibility}
            className="flex-1 py-2.5 rounded-xl border border-emerald-900 text-xs font-bold text-emerald-400/80 hover:bg-emerald-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-md transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
