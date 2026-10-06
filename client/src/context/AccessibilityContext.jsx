/**
 * ACCESSIBILITY CONTEXT & SPEECH CONTROLLER
 * 
 * Provides:
 * - Adjustable font sizes (15px to 26px)
 * - Dyslexia-friendly and high-legibility fonts (Lexend, Atkinson Hyperlegible, Comic Neue, Inter)
 * - Color palettes designed to reduce visual stress (Cream, Peach, Soft Blue, Mint, Dark, High-Contrast)
 * - Adjustable line height and letter spacing
 * - Mouse-following Reading Guide Ruler to prevent line jumping
 * - Web Speech Synthesis text-to-speech engine with speed control
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  // Preferences State
  const [fontSize, setFontSize] = useState(18); // px
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [lineSpacing, setLineSpacing] = useState('relaxed'); // 'normal', 'relaxed', 'loose'
  const [letterSpacing, setLetterSpacing] = useState('wide'); // 'normal', 'wide', 'wider'
  const [colorTheme, setColorTheme] = useState('green-black'); // 'green-black', 'dark', 'mint', 'cream', 'peach', 'blue', 'high-contrast'
  const [readingGuide, setReadingGuide] = useState(false);
  const [guideY, setGuideY] = useState(200);
  const [ttsSpeed, setTtsSpeed] = useState(0.95);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Apply CSS variables and theme classes to <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    body.classList.remove(
      'theme-green-black',
      'theme-cream',
      'theme-peach',
      'theme-blue',
      'theme-mint',
      'theme-dark',
      'theme-high-contrast'
    );
    body.classList.add(`theme-${colorTheme}`);

    // Set font family mapping
    let fontValue = `'Plus Jakarta Sans', system-ui, sans-serif`;
    if (fontFamily === 'Plus Jakarta Sans') fontValue = `'Plus Jakarta Sans', system-ui, sans-serif`;
    if (fontFamily === 'Lexend') fontValue = `'Lexend', system-ui, sans-serif`;
    if (fontFamily === 'Atkinson Hyperlegible') fontValue = `'Atkinson Hyperlegible', sans-serif`;
    if (fontFamily === 'Fredoka') fontValue = `'Fredoka', cursive, sans-serif`;
    if (fontFamily === 'Comic Neue') fontValue = `'Comic Neue', cursive, sans-serif`;
    if (fontFamily === 'Inter') fontValue = `'Inter', sans-serif`;

    root.style.setProperty('--app-font', fontValue);
    root.style.setProperty('--app-font-size', `${fontSize}px`);

    // Line spacing
    let lineHeightVal = '1.7';
    if (lineSpacing === 'normal') lineHeightVal = '1.5';
    if (lineSpacing === 'relaxed') lineHeightVal = '1.8';
    if (lineSpacing === 'loose') lineHeightVal = '2.2';
    root.style.setProperty('--app-line-height', lineHeightVal);

    // Letter spacing
    let letterSpacingVal = '0.04em';
    if (letterSpacing === 'normal') letterSpacingVal = '0';
    if (letterSpacing === 'wide') letterSpacingVal = '0.05em';
    if (letterSpacing === 'wider') letterSpacingVal = '0.10em';
    root.style.setProperty('--app-letter-spacing', letterSpacingVal);
  }, [fontSize, fontFamily, lineSpacing, letterSpacing, colorTheme]);

  // Track mouse position for the reading guide line
  useEffect(() => {
    if (!readingGuide) return;

    const handleMouseMove = (e) => {
      setGuideY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // Text-To-Speech (Web Speech API)
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = ttsSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetAccessibility = () => {
    setFontSize(18);
    setFontFamily('Plus Jakarta Sans');
    setLineSpacing('relaxed');
    setLetterSpacing('wide');
    setColorTheme('green-black');
    setReadingGuide(false);
    setTtsSpeed(0.95);
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
        isSpeaking,
        speak,
        stopSpeaking,
        resetAccessibility,
        drawerOpen,
        setDrawerOpen
      }}
    >
      {children}
      {/* Visual Reading Guide Bar */}
      {readingGuide && (
        <div
          className="reading-guide-line"
          style={{ top: `${guideY}px` }}
          aria-hidden="true"
        />
      )}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
