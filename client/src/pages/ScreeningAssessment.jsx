import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen,
  Mic,
  SkipForward
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SpeechReader from '../components/SpeechReader';
import VoiceInput from '../components/VoiceInput';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';
import ConfettiCelebration, { triggerStarConfetti } from '../components/ConfettiCelebration';

export default function ScreeningAssessment() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [itemStartTime, setItemStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch 7 stages from backend
  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoading(true);
        const data = await api.getScreeningStages();
        setStages(data);
      } catch (err) {
        console.error('Failed to load screening stages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const currentStage = stages[currentStageIndex];
  const isVoiceStage = currentStage?.stageId === 'optionalVoiceReading';
  const currentItem = (!isVoiceStage && currentStage?.items) ? currentStage.items[currentItemIndex] : null;
  const totalStages = stages.length;

  // Track start time for each item to measure response latency
  useEffect(() => {
    setItemStartTime(Date.now());
    setSelectedOption(null);
    setShowExplanation(false);
  }, [currentStageIndex, currentItemIndex]);

  // Handle standard option selection
  const handleSelectOption = (option) => {
    if (selectedOption !== null) return; // Prevent double-clicking
    setSelectedOption(option);
    setShowExplanation(true);

    const isCorrect = option === currentItem.correctAnswer;
    const responseTimeMs = Date.now() - itemStartTime;

    const stageKey = currentStage.stageId;
    const itemResponse = {
      itemId: currentItem.id,
      selectedAnswer: option,
      isCorrect,
      responseTimeMs
    };

    setResponses(prev => {
      const currentList = prev[stageKey] || [];
      return {
        ...prev,
        [stageKey]: [...currentList.filter(i => i.itemId !== currentItem.id), itemResponse]
      };
    });
  };

  // Next item or next stage
  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOption(null);

    // If within standard stage items
    if (currentStage?.items && currentItemIndex < currentStage.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      // Advance to next stage
      if (currentStageIndex < totalStages - 1) {
        setCurrentStageIndex(prev => prev + 1);
        setCurrentItemIndex(0);
      } else {
        // Complete & Submit
        handleSubmitScreening();
      }
    }
  };

  // Voice stage handlers
  const handleVoiceSuccess = (score, text) => {
    const voiceData = {
      attempted: true,
      confidenceScore: score,
      recognizedText: text
    };
    setVoiceResponse(voiceData);
  };

  const handleVoiceSkip = () => {
    const voiceData = {
      attempted: false,
      skipped: true
    };
    setVoiceResponse(voiceData);
    handleSubmitScreening({ ...responses, optionalVoiceReading: voiceData });
  };

  // Submit all responses to backend engine
  const handleSubmitScreening = async (finalResponsesOverride = null) => {
    setSubmitting(true);
    try {
      const payload = finalResponsesOverride || {
        ...responses,
        ...(voiceResponse ? { optionalVoiceReading: voiceResponse } : {})
      };

      const result = await api.submitScreening(payload);
      setEvaluationResult(result);
      triggerStarConfetti();
    } catch (err) {
      console.error('Failed to submit screening:', err);
      alert('Could not submit screening: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-semibold text-emerald-300">Loading EDULEXIA 7-Stage Screening...</p>
      </div>
    );
  }

  // COMPLETED RESULTS VIEW (Green + Black Theme)
  if (evaluationResult) {
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-jakarta">
        <ConfettiCelebration active={true} />
        
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold text-sm border border-emerald-500/40 glow-emerald">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Screening Completed Wonderfully!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-glow-green">
            {evaluationResult.positiveHeadline || 'Awesome Work, Reader!'}
          </h1>
          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {evaluationResult.positiveMessage || 'You demonstrated focus and resilience throughout all 7 stages.'}
          </p>
        </div>

        {/* Disclaimer */}
        <MedicalDisclaimerBanner compact={false} />

        {/* Score & Profile Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-black shadow-xl glow-emerald-lg space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-black tracking-wider text-emerald-950">Starting Track</span>
              <h3 className="text-4xl font-black mt-1">Level {evaluationResult.recommendedStartingLevel || 1}</h3>
              <p className="text-xs text-emerald-950/80 mt-1 font-semibold leading-relaxed">
                Personalized starting difficulty tailored to build confidence.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-600/40">
              <span className="text-xs font-black">Indicator Status: {evaluationResult.supportLevel}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-800/80 shadow-xl md:col-span-2 space-y-3">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Skill Profile Breakdown</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {evaluationResult.skillProfile && Object.entries(evaluationResult.skillProfile).map(([skill, rating]) => {
                const isStrong = rating === 'Strong';
                const isMod = rating === 'Moderate';
                return (
                  <div key={skill} className="p-3.5 rounded-2xl bg-[#070e0a] border border-emerald-900/60">
                    <p className="text-xs text-emerald-400/80 capitalize truncate">
                      {skill.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <span className={`inline-block mt-1 text-xs font-black px-2.5 py-0.5 rounded-full ${
                      isStrong
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isMod
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {rating}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Focus & Recommended Actions */}
        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-800/80 space-y-4 shadow-lg">
          <h4 className="font-extrabold text-base text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span>Targeted Support Focus Areas</span>
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {evaluationResult.supportAreas?.map((area, idx) => (
              <span key={idx} className="px-4 py-2 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-800/80">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={() => {
              setEvaluationResult(null);
              setCurrentStageIndex(0);
              setCurrentItemIndex(0);
              setResponses({});
            }}
            className="px-5 py-3.5 rounded-2xl border border-emerald-800/80 text-emerald-300 font-bold text-sm hover:bg-emerald-950/60 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Screening</span>
          </button>

          <Link
            to="/student"
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-102 transition-all flex items-center gap-2"
          >
            <span>Go to Student Hub & Recommendations</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </Link>
        </div>
      </div>
    );
  }

  // ACTIVE SCREENING VIEW (Green + Black Theme with Plus Jakarta Sans Letters)
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-jakarta">
      {/* Top Banner */}
      <MedicalDisclaimerBanner compact={true} />

      {/* Stage Progress Bar & Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-300">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Stage {currentStageIndex + 1} of {totalStages}: {currentStage?.title}</span>
          </span>
          <span className="text-emerald-400 font-extrabold">
            {Math.round(((currentStageIndex + (currentItemIndex / (currentStage?.items?.length || 1))) / totalStages) * 100)}% Complete
          </span>
        </div>

        {/* Glowing Progress bar */}
        <div className="w-full h-3.5 bg-[#0a120c] rounded-full overflow-hidden p-0.5 border border-emerald-900/80 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300 glow-emerald"
            style={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
          />
        </div>

        {/* Interactive stage badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {stages.map((stg, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div 
                key={stg.stageId}
                className={`flex-1 min-w-[75px] text-center py-2 px-2.5 rounded-xl text-[11px] font-black border transition-all ${
                  isCurrent 
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md glow-emerald' 
                    : isDone
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-[#09120c] text-emerald-500/40 border-emerald-950'
                }`}
              >
                Stage {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Question Surface */}
      <div className="rounded-3xl p-6 sm:p-10 bg-[#0d1611] border-2 border-emerald-800/80 shadow-2xl glow-emerald space-y-6">
        
        {/* Stage Header & Audio Instructions */}
        <div className="border-b border-emerald-900/70 pb-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentStage?.title}</span>
            </span>
            {currentItem && (
              <span className="text-xs font-bold text-emerald-300 bg-[#070e0a] px-3.5 py-1 rounded-full border border-emerald-800/80">
                Item {currentItemIndex + 1} of {currentStage.items.length}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {currentStage?.subtitle || currentStage?.instructions}
          </h2>
          <div className="flex items-center gap-3 pt-1">
            <SpeechReader 
              text={`${currentStage?.instructions || ''}. ${currentItem?.prompt || ''} ${currentItem?.audioCue || ''}`} 
              label="Listen to question instructions" 
            />
          </div>
        </div>

        {/* STAGE 7: OPTIONAL VOICE READING */}
        {isVoiceStage ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#09120c] border border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Mic className="w-5 h-5 text-emerald-400" />
                <span>Optional Oral Reading Exploration</span>
              </div>
              <p className="text-sm text-emerald-200/80 leading-relaxed">
                {currentStage?.instructions}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#070e0a] border-2 border-dashed border-emerald-700/60 text-center space-y-4">
              <span className="text-xs uppercase font-bold text-emerald-400/80">Read this sentence out loud:</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta">
                "{currentStage.samplePassage}"
              </p>
            </div>

            {/* Voice Input Component */}
            <VoiceInput 
              targetPhrase={currentStage.samplePassage}
              onResult={(score, text) => handleVoiceSuccess(score, text)}
              onSkip={handleVoiceSkip}
            />

            <div className="flex items-center justify-between pt-4 border-t border-emerald-900/60">
              <button
                onClick={handleVoiceSkip}
                className="px-5 py-2.5 rounded-xl border border-emerald-800 text-emerald-300 font-bold text-sm hover:bg-emerald-950/60 flex items-center gap-2"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip Voice Step (No Penalty)</span>
              </button>

              <button
                onClick={() => handleSubmitScreening()}
                disabled={submitting}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <span>{submitting ? 'Calculating Profile...' : 'Complete Assessment'}</span>
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          /* STAGES 1 TO 6: INTERACTIVE MULTIPLE CHOICE ITEMS */
          <div className="space-y-8">
            {/* Question prompt box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#102318] via-[#0d1c13] to-[#07110b] border-2 border-emerald-500/70 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40">
                  Target Question
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-jakarta tracking-wide">
                  {currentItem?.prompt}
                </p>
                {currentItem?.audioCue && (
                  <p className="text-sm text-emerald-300/90 italic flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clue: "{currentItem.audioCue}"</span>
                  </p>
                )}
              </div>
              {currentItem?.audioCue && (
                <div className="self-start sm:self-auto shrink-0">
                  <SpeechReader text={currentItem.audioCue} label="Listen to Clue" size="md" />
                </div>
              )}
            </div>

            {/* ATTRACTIVE 3D GAMIFIED LETTER & WORD TILES GRID (Plus Jakarta Sans) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {currentItem?.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentItem.correctAnswer;
                const isSingleLetter = option.length <= 2;
                const letterLabels = ['A', 'B', 'C', 'D'];

                // 4 Distinct High-Aesthetic Tactile Green/Teal/Lime/Obsidian Card Styles
                const cardColors = [
                  {
                    normal: 'bg-gradient-to-b from-[#11261a] to-[#08130d] border-emerald-500/80 border-b-[8px] border-b-emerald-600 text-emerald-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1',
                    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
                    guideDot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  },
                  {
                    normal: 'bg-gradient-to-b from-[#0e2722] to-[#061411] border-teal-500/80 border-b-[8px] border-b-teal-600 text-teal-100 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1',
                    badge: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
                    guideDot: 'bg-teal-400 shadow-[0_0_8px_#14b8a6]'
                  },
                  {
                    normal: 'bg-gradient-to-b from-[#18290f] to-[#0a1506] border-lime-500/80 border-b-[8px] border-b-lime-600 text-lime-100 hover:border-lime-400 hover:shadow-lg hover:shadow-lime-500/20 hover:-translate-y-1',
                    badge: 'bg-lime-500/20 text-lime-300 border border-lime-500/40',
                    guideDot: 'bg-lime-400 shadow-[0_0_8px_#84cc16]'
                  },
                  {
                    normal: 'bg-gradient-to-b from-[#0e252a] to-[#061316] border-cyan-500/80 border-b-[8px] border-b-cyan-600 text-cyan-100 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1',
                    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
                    guideDot: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                  }
                ];

                const currentPalette = cardColors[idx % cardColors.length];
                let tileStateStyle = currentPalette.normal;
                
                if (selectedOption !== null) {
                  if (isSelected && isCorrect) {
                    tileStateStyle = 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-black border-emerald-300 border-b-[8px] border-b-emerald-700 shadow-2xl shadow-emerald-500/50 scale-102';
                  } else if (isSelected && !isCorrect) {
                    tileStateStyle = 'bg-gradient-to-b from-rose-500 to-rose-700 text-white border-rose-400 border-b-[8px] border-b-rose-800 shadow-xl';
                  } else if (option === currentItem.correctAnswer) {
                    tileStateStyle = 'bg-emerald-950/80 border-2 border-dashed border-emerald-400 text-emerald-300';
                  } else {
                    tileStateStyle = 'opacity-25 border-emerald-950 border-b-4 bg-[#08100b] text-emerald-700';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={selectedOption !== null}
                    className={`group relative min-h-[130px] sm:min-h-[160px] p-6 rounded-3xl border-2 transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer select-none active:translate-y-1 active:border-b-[3px] ${tileStateStyle}`}
                  >
                    {/* Corner letter index indicator badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center font-jakarta shadow-xs ${
                        selectedOption !== null && (isSelected || option === currentItem.correctAnswer)
                          ? 'bg-black/30 text-white'
                          : currentPalette.badge
                      }`}>
                        {letterLabels[idx] || (idx + 1)}
                      </span>
                    </div>

                    {/* ATTRACTIVE MAIN LETTER / WORD TYPOGRAPHY (Plus Jakarta Sans) */}
                    <div className="flex flex-col items-center justify-center">
                      <span className={`font-jakarta tracking-wide transition-transform group-hover:scale-105 ${
                        isSingleLetter
                          ? 'text-6xl sm:text-7xl font-extrabold leading-none py-1.5 drop-shadow-md'
                          : 'text-2xl sm:text-4xl font-extrabold leading-snug py-2'
                      }`}>
                        {option}
                      </span>

                      {/* Directional spatial anchor dot for single letters to prevent rotation confusion */}
                      {isSingleLetter && selectedOption === null && (
                        <span 
                          className={`w-3 h-3 rounded-full mt-2 transition-transform group-hover:scale-125 ${currentPalette.guideDot}`}
                          title="Baseline orientation guide" 
                        />
                      )}
                    </div>

                    {/* Feedback Icon on selection */}
                    {selectedOption !== null && option === currentItem.correctAnswer && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                        <Check className="w-5 h-5 stroke-[3.5]" />
                      </div>
                    )}
                    {selectedOption !== null && isSelected && !isCorrect && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg">
                        <X className="w-5 h-5 stroke-[3.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-selection feedback & Next Button */}
            {selectedOption !== null && (
              <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-900/70">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {selectedOption === currentItem.correctAnswer ? (
                    <span className="text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>Wonderful job! That is correct.</span>
                    </span>
                  ) : (
                    <span className="text-teal-300 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-400" />
                      <span>Good effort! Keep going, practice makes progress!</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentItemIndex < currentStage.items.length - 1 
                      ? 'Next Question' 
                      : currentStageIndex < totalStages - 1 
                      ? `Continue to Stage ${currentStageIndex + 2}` 
                      : 'Finish & View Profile'}
                  </span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
