import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Star, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Check, 
  X,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SpeechReader from '../components/SpeechReader';
import ConfettiCelebration, { triggerStarConfetti } from '../components/ConfettiCelebration';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';

export default function ActivityPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userSentenceSequence, setUserSentenceSequence] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await api.getActivity(id);
        setActivity(data);

        // Determine total rounds count based on content structure
        const rounds = data.content?.rounds || data.content?.questions || [];
        setTotalQuestions(rounds.length || 1);
      } catch (err) {
        console.error('Failed to load activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-semibold text-emerald-300">Loading your reading exercise...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen py-16 px-4 text-center space-y-4 font-jakarta">
        <h2 className="text-2xl font-bold text-white">Activity Not Found</h2>
        <Link to="/activities" className="text-emerald-400 underline font-bold">
          Back to all activities
        </Link>
      </div>
    );
  }

  const rounds = activity.content?.rounds || activity.content?.questions || [];
  const currentRound = rounds[currentRoundIndex];
  const isSentenceBuilder = activity.type === 'sentence_practice';
  const hasPassage = activity.content?.passage;

  // Handle standard option click
  const handleSelectOption = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);

    const isCorrect = option === currentRound?.target;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Handle sentence word click
  const handleTileClick = (word) => {
    if (userSentenceSequence.includes(word)) {
      setUserSentenceSequence(userSentenceSequence.filter(w => w !== word));
    } else {
      setUserSentenceSequence([...userSentenceSequence, word]);
    }
  };

  const handleCheckSentence = () => {
    const correctSeq = currentRound.correctSequence || [];
    const isCorrect = JSON.stringify(userSentenceSequence) === JSON.stringify(correctSeq);
    setSelectedAnswer(isCorrect ? 'CORRECT' : 'INCORRECT');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Next Round or Complete Activity
  const handleNextRound = async () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setUserSentenceSequence([]);

    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      // Complete activity & record score
      const finalScore = score + (selectedAnswer === currentRound?.target || selectedAnswer === 'CORRECT' ? 1 : 0);
      try {
        const res = await api.submitActivity(activity.id, {
          score: finalScore,
          maxScore: rounds.length || 1,
          attempts: 1
        });
        setSubmissionResult(res);
        setCompleted(true);
        triggerStarConfetti();
        if (refreshProfile) refreshProfile();
      } catch (err) {
        console.error('Failed to submit activity score:', err);
        setCompleted(true);
      }
    }
  };

  // ACTIVITY COMPLETED SCREEN (Green + Black Theme)
  if (completed) {
    const earnedStars = activity.starsAwarded || 5;
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 font-jakarta">
        <ConfettiCelebration active={true} />

        <div className="p-8 sm:p-12 rounded-3xl bg-[#0d1611] border-2 border-emerald-500/80 shadow-2xl glow-emerald text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <Award className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Activity Completed!
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white text-glow-green">
              Tremendous Effort, Reader! 🎉
            </h1>
            <p className="text-emerald-200/80 max-w-lg mx-auto text-sm sm:text-base">
              You practiced <span className="font-bold text-white">{activity.title}</span> and strengthened your reading skills.
            </p>
          </div>

          {/* Reward Stars Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 glow-emerald">
            <Star className="w-6 h-6 fill-emerald-400 text-emerald-400" />
            <span className="text-lg font-black text-white">+{earnedStars} Stars Awarded!</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCompleted(false);
                setCurrentRoundIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setUserSentenceSequence([]);
              }}
              className="px-6 py-3.5 rounded-2xl border border-emerald-800 font-bold text-sm text-emerald-300 hover:bg-emerald-950/60 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <Link
              to="/student"
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Back to Student Hub</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE ACTIVITY RUNNER (Green + Black Theme with Plus Jakarta Sans Letters)
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 font-jakarta">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/activities"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Activity</span>
        </Link>
        
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <span>Question {currentRoundIndex + 1} of {rounds.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-[#0a120c] rounded-full overflow-hidden p-0.5 border border-emerald-900/80">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 glow-emerald"
          style={{ width: `${((currentRoundIndex + 1) / rounds.length) * 100}%` }}
        />
      </div>

      {/* Main Activity Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-[#0d1611] border-2 border-emerald-800/80 shadow-2xl glow-emerald space-y-6">
        
        {/* Title & Speech Support */}
        <div className="border-b border-emerald-900/70 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Level {activity.level} Phonics Practice
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {activity.title}
            </h2>
          </div>
          <SpeechReader 
            text={`${activity.title}. ${currentRound?.prompt || activity.content?.passage || ''}`} 
            label="Listen to question" 
          />
        </div>

        {/* RULE TIP BANNER */}
        {activity.content?.ruleTip && (
          <div className="p-4 rounded-2xl bg-[#09120c] border border-emerald-800/70 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-200">
              {activity.content.ruleTip}
            </p>
          </div>
        )}

        {/* PASSAGE TEXT (For Comprehension) */}
        {hasPassage && (
          <div className="p-6 rounded-2xl bg-[#070e0a] border border-emerald-800/70 space-y-3">
            <span className="text-xs uppercase font-bold text-emerald-400/80 tracking-wider">Reading Passage</span>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100 font-jakarta">
              {activity.content.passage}
            </p>
            <div className="pt-2">
              <SpeechReader text={activity.content.passage} label="Read passage out loud" />
            </div>
          </div>
        )}

        {/* QUESTION PROMPT */}
        {currentRound?.prompt && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#102318] to-[#07110b] border border-emerald-700/60 flex items-center justify-between gap-4">
            <p className="text-lg sm:text-xl font-extrabold text-white font-jakarta">
              {currentRound.prompt}
            </p>
            {currentRound.sound && (
              <SpeechReader text={currentRound.sound} label="Play Sound" size="sm" />
            )}
          </div>
        )}

        {/* SENTENCE BUILDER VARIANT */}
        {isSentenceBuilder ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-400/80">Tap words to arrange sentence:</span>
              <div className="min-h-[70px] p-4 rounded-2xl bg-[#070e0a] border-2 border-dashed border-emerald-700/60 flex flex-wrap items-center gap-2">
                {userSentenceSequence.length === 0 ? (
                  <span className="text-sm text-emerald-500/60 italic">Tap words below to place them here...</span>
                ) : (
                  userSentenceSequence.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTileClick(w)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-md hover:bg-emerald-400 transition-colors"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Word bank pool */}
            <div className="flex flex-wrap items-center gap-3">
              {currentRound?.scrambled?.map((word, idx) => {
                const isUsed = userSentenceSequence.includes(word);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTileClick(word)}
                    disabled={isUsed || selectedAnswer !== null}
                    className={`px-5 py-3 rounded-2xl font-black text-base border-2 transition-all font-jakarta ${
                      isUsed
                        ? 'opacity-25 border-emerald-950 bg-[#070e0a] text-emerald-700'
                        : 'bg-[#0f1d14] border-emerald-600/80 text-white hover:scale-105 shadow-md'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {selectedAnswer === null && (
              <button
                onClick={handleCheckSentence}
                disabled={userSentenceSequence.length === 0}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all"
              >
                Check My Sentence
              </button>
            )}
          </div>
        ) : (
          /* STANDARD MULTIPLE CHOICE OPTIONS (Attractive 3D Tactile Plus Jakarta Sans Letters) */
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {currentRound?.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentRound.target;
              const isSingleLetter = option.length <= 2;
              const letterLabels = ['A', 'B', 'C', 'D'];

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

              if (selectedAnswer !== null) {
                if (isSelected && isCorrect) {
                  tileStateStyle = 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-black border-emerald-300 border-b-[8px] border-b-emerald-700 shadow-2xl shadow-emerald-500/50 scale-102';
                } else if (isSelected && !isCorrect) {
                  tileStateStyle = 'bg-gradient-to-b from-rose-500 to-rose-700 text-white border-rose-400 border-b-[8px] border-b-rose-800 shadow-xl';
                } else if (option === currentRound.target) {
                  tileStateStyle = 'bg-emerald-950/80 border-2 border-dashed border-emerald-400 text-emerald-300';
                } else {
                  tileStateStyle = 'opacity-25 border-emerald-950 border-b-4 bg-[#08100b] text-emerald-700';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={selectedAnswer !== null}
                  className={`group relative min-h-[130px] sm:min-h-[160px] p-6 rounded-3xl border-2 transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer select-none active:translate-y-1 active:border-b-[3px] ${tileStateStyle}`}
                >
                  {/* Corner indicator badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                    <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center font-jakarta shadow-xs ${
                      selectedAnswer !== null && (isSelected || option === currentRound.target)
                        ? 'bg-black/30 text-white'
                        : currentPalette.badge
                    }`}>
                      {letterLabels[idx] || (idx + 1)}
                    </span>
                  </div>

                  {/* Attractive Main Letter / Word Typography in Plus Jakarta Sans */}
                  <div className="flex flex-col items-center justify-center">
                    <span className={`font-jakarta tracking-wide transition-transform group-hover:scale-105 ${
                      isSingleLetter
                        ? 'text-6xl sm:text-7xl font-extrabold leading-none py-1.5 drop-shadow-md'
                        : 'text-2xl sm:text-4xl font-extrabold leading-snug py-2'
                    }`}>
                      {option}
                    </span>

                    {/* Directional baseline anchor dot */}
                    {isSingleLetter && selectedAnswer === null && (
                      <span 
                        className={`w-3 h-3 rounded-full mt-2 transition-transform group-hover:scale-125 ${currentPalette.guideDot}`}
                        title="Baseline guide" 
                      />
                    )}
                  </div>

                  {/* Result Icon on select */}
                  {selectedAnswer !== null && option === currentRound.target && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                      <Check className="w-5 h-5 stroke-[3.5]" />
                    </div>
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg">
                      <X className="w-5 h-5 stroke-[3.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* FEEDBACK & NEXT BUTTON */}
        {selectedAnswer !== null && (
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-900/70">
            <div className="flex items-center gap-2 text-sm font-bold">
              {(selectedAnswer === currentRound?.target || selectedAnswer === 'CORRECT') ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>Spot on! Great reading!</span>
                </span>
              ) : (
                <span className="text-teal-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <span>Nice try! The correct match was "{currentRound?.target || currentRound?.fullSentence}".</span>
                </span>
              )}
            </div>

            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentRoundIndex < rounds.length - 1 ? 'Next Challenge' : 'Complete Activity'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
