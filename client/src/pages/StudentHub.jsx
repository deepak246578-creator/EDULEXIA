import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Flame, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Award, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Target, 
  Clock, 
  Compass 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SpeechReader from '../components/SpeechReader';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';
import { getUserNickname } from '../utils/userUtils';

export default function StudentHub() {
  const { user, profile, switchRole, loading: authLoading } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const loadStudentData = async () => {
      try {
        setLoading(true);
        if (user && user.role !== 'student') {
          await switchRole('student');
        }
        const [prog, rec, ach] = await Promise.all([
          api.getStudentProgress(),
          api.getRecommendations(),
          api.getStudentAchievements()
        ]);
        setProgressData(prog);
        setRecommendations(rec);
        setAchievements(ach);
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user?.role, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-semibold text-emerald-300">Loading your learning dashboard...</p>
      </div>
    );
  }

  const stats = progressData?.stats || {};
  const currentLevel = stats.currentLevel || profile?.learningLevel || 2;
  const starsCount = stats.starsCount ?? profile?.starsCount ?? 45;
  const streakDays = stats.streakDays ?? profile?.streakDays ?? 4;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 font-jakarta">
      
      {/* Top Welcome Banner (Emerald & Jade Gradient) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-black shadow-2xl glow-emerald-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-black">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Student Learning Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Welcome back, {getUserNickname(user)}! 🌟
          </h1>
          <p className="text-emerald-950 font-semibold text-sm sm:text-base max-w-xl">
            You are reading at <span className="font-black underline decoration-black">Level {currentLevel}</span>. 
            Keep up your fabulous practice streak!
          </p>
          <div className="pt-1">
            <SpeechReader 
              text={`Welcome back, ${getUserNickname(user)}! You are currently practicing at Level ${currentLevel}. You have collected ${starsCount} stars and a ${streakDays} day practice streak.`} 
              label="Listen to dashboard greeting" 
            />
          </div>
        </div>

        {/* Stats Counters */}
        <div className="flex items-center gap-4 z-10">
          {/* Stars */}
          <div className="px-5 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-black/40 text-center min-w-[105px] shadow-lg">
            <div className="flex items-center justify-center gap-1 text-emerald-300">
              <Star className="w-5 h-5 fill-emerald-300" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{starsCount}</div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Stars</span>
          </div>

          {/* Streak */}
          <div className="px-5 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-black/40 text-center min-w-[105px] shadow-lg">
            <div className="flex items-center justify-center gap-1 text-teal-300">
              <Flame className="w-5 h-5 fill-teal-300" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{streakDays}</div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Day Streak</span>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/15 blur-2xl pointer-events-none" />
      </div>

      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact={true} />

      {/* AI Personalized Recommendations Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-emerald-400" />
              <span>Recommended For You Today</span>
            </h2>
            <p className="text-sm text-emerald-300/70">
              Personalized phonics activities tailored by our adaptive engine.
            </p>
          </div>
          <Link
            to="/activities"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All Activities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Primary Recommended Activity Card */}
        {recommendations?.primaryActivity ? (
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border-2 border-emerald-500/80 shadow-2xl glow-emerald flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Top Recommendation</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {recommendations.primaryActivity.title}
              </h3>
              <p className="text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
                {recommendations.primaryActivity.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs font-black px-3 py-1 rounded-lg bg-[#070e0a] text-emerald-300 border border-emerald-900">
                  Level {recommendations.primaryActivity.level}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800">
                  Reason: {recommendations.primaryActivity.recommendationReason || 'Targeted phonics skill'}
                </span>
              </div>
            </div>

            <Link
              to={`/activities/${recommendations.primaryActivity.id}`}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 shrink-0"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Start Activity Now</span>
            </Link>
          </div>
        ) : null}

        {/* Secondary Recommendations Grid */}
        {recommendations?.secondaryActivities?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.secondaryActivities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-[#0d1611] border border-emerald-900/80 hover:border-emerald-600 shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Level {act.level}
                    </span>
                    <span className="text-xs text-emerald-400/60 capitalize font-medium">
                      {act.skillArea?.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-emerald-300/70 line-clamp-2">{act.description}</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-emerald-950/60 mt-3">
                  <span className="text-[11px] font-medium text-emerald-400/80 italic">
                    {act.recommendationReason}
                  </span>
                  <Link
                    to={`/activities/${act.id}`}
                    className="p-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-800"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retake Screening */}
        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-800/80 shadow-lg flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500 text-black shrink-0 font-black">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-white">7-Stage Screening Assessment</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Check in on your reading progress anytime. It only takes about 5 minutes and updates your personalized learning level.
            </p>
            <Link
              to="/screening"
              className="inline-flex items-center gap-2 pt-1 font-bold text-xs text-emerald-400 hover:text-emerald-300"
            >
              <span>Take Screening Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* All Activities Library */}
        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-800/80 shadow-lg flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-500 text-black shrink-0 font-black">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-white">Full Practice Activity Library</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Explore word building ladders, letter-sound matching, sight words, sentence builders, and fluent reading passages.
            </p>
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 pt-1 font-bold text-xs text-teal-400 hover:text-teal-300"
            >
              <span>Browse All Phonics Activities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border border-emerald-800/80 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Earned Badges & Milestones</span>
            </h3>
            <p className="text-xs text-emerald-300/70 mt-0.5">
              Celebrating your hard work, practice consistency, and courage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements?.length > 0 ? (
            achievements.map((ach) => (
              <div 
                key={ach.id}
                className="p-4 rounded-2xl bg-[#070e0a] border border-emerald-900/80 text-center space-y-2 flex flex-col items-center justify-center hover:border-emerald-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-xl shadow-xs">
                  {ach.icon || '🏅'}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white">{ach.title}</h4>
                <p className="text-[11px] text-emerald-400/60">{ach.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-sm text-emerald-500/60">
              Practice activities to unlock your first celebration badges!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
