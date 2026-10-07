import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Brain, 
  Star, 
  Flame, 
  BookOpen, 
  Compass, 
  FileText,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SpeechReader from '../components/SpeechReader';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';
import { getUserNickname } from '../utils/userUtils';

export default function ParentPortal() {
  const { user, switchRole, loading: authLoading } = useAuth();
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchParentOverview = async () => {
      try {
        setLoading(true);
        if (user && user.role !== 'parent') {
          await switchRole('parent');
        }
        const data = await api.getParentStudentData();
        setParentData(data);
      } catch (err) {
        console.error('Failed to load parent overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchParentOverview();
  }, [user?.role, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-semibold text-emerald-300">Loading your child's progress portal...</p>
      </div>
    );
  }

  const student = parentData?.student || {};
  const profile = parentData?.profile || {};
  const latestScreening = parentData?.latestScreening;
  const history = parentData?.screeningHistory || [];
  const recentActivities = parentData?.recentActivityResults || [];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 font-jakarta">
      
      {/* Header (Green + Black Theme) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-black shadow-2xl glow-emerald-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-black">
            <Users className="w-3.5 h-3.5 text-black" />
            <span>Parent Support Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Learning Progress for {getUserNickname(student) || 'Your Child'}
          </h1>
          <p className="text-emerald-950 font-semibold text-sm sm:text-base max-w-xl">
            Supportive, non-stigmatizing insights into your child's phonics development, 
            reading milestones, and tailored home learning guidance.
          </p>
          <div className="pt-1">
            <SpeechReader 
              text={`Parent progress overview for ${getUserNickname(student) || 'your child'}. Reading level is currently Level ${profile.learningLevel || 2}.`} 
              label="Listen to summary" 
            />
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4">
          <div className="px-5 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-black/40 text-center min-w-[105px]">
            <div className="text-xs uppercase font-bold text-emerald-200">Current Track</div>
            <div className="text-3xl font-black text-white mt-1">Level {profile.learningLevel || 2}</div>
            <span className="text-[11px] text-emerald-200 font-semibold">Phonics Path</span>
          </div>

          <div className="px-5 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-black/40 text-center min-w-[105px]">
            <div className="text-xs uppercase font-bold text-emerald-200">Consistency</div>
            <div className="text-3xl font-black text-white mt-1">{profile.streakDays || 4} Days</div>
            <span className="text-[11px] text-emerald-200 font-semibold">Current Streak</span>
          </div>
        </div>
      </div>

      <MedicalDisclaimerBanner compact={false} />

      {/* Latest Screening Assessment Profile */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border border-emerald-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Latest Screening Assessment
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {latestScreening?.supportLevel || 'Mild Indicator Profile'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              Phonics Skill Diagnostics & Breakdown
            </h3>
          </div>
          <span className="text-xs text-emerald-400/60 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {latestScreening ? new Date(latestScreening.timestamp).toLocaleDateString() : 'Recent'}</span>
          </span>
        </div>

        {/* Skill areas badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {latestScreening?.skillProfile && Object.entries(latestScreening.skillProfile).map(([skill, rating]) => (
            <div key={skill} className="p-3.5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 text-center">
              <span className="text-[11px] font-bold text-emerald-400/80 block truncate capitalize">
                {skill.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className={`inline-block mt-2 text-xs font-black px-2 py-0.5 rounded-full ${
                rating === 'Strong'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : rating === 'Moderate'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {rating}
              </span>
            </div>
          ))}
        </div>

        {/* Key parent focus areas */}
        <div className="p-5 rounded-2xl bg-[#09120c] border border-emerald-800/60 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>Targeted Phonics Areas for Gentle Home Reinforcement</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {latestScreening?.supportAreas?.map((area, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-800">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Home Learning Strategies */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border border-emerald-800/80 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Recommended Home Reading Strategies</h3>
            <p className="text-xs text-emerald-300/70">Empowering daily routines that build confidence without frustration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h5 className="font-bold text-sm text-emerald-300">1. Multisensory Tracing</h5>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Trace challenging letter pairs (such as 'b' and 'd') on textured paper or sand while pronouncing their distinctive phonetic sounds aloud.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h5 className="font-bold text-sm text-emerald-300">2. Paired Echo Reading</h5>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Read short sentences aloud first with natural cadence, then invite your child to repeat with high finger-tracking engagement.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h5 className="font-bold text-sm text-emerald-300">3. Positive Micro-Sessions</h5>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Keep practice sessions playful and under 10–12 minutes to sustain dopamine and enthusiasm without reading fatigue.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Practice History */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border border-emerald-800/80 shadow-xl space-y-4">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>Recent Activity Completions</span>
        </h3>

        {recentActivities?.length > 0 ? (
          <div className="divide-y divide-emerald-950/80">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{act.activityTitle}</h4>
                  <p className="text-xs text-emerald-400/60">
                    {new Date(act.timestamp).toLocaleDateString()} • {act.percentage}% accuracy
                  </p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {act.score}/{act.maxScore} Correct
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-emerald-500/60 py-4">No recent practice history recorded yet.</p>
        )}
      </div>

    </div>
  );
}
