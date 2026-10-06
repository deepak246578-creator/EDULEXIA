import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Brain, 
  Headphones, 
  HeartHandshake,
  Star,
  Users,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';
import SpeechReader from '../components/SpeechReader';

export default function Home() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleStartRole = async (role, destination) => {
    await switchRole(role);
    navigate(destination);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 font-jakarta">
      {/* Medical Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* Hero Section */}
      <div className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs sm:text-sm font-black border border-emerald-500/40 glow-emerald">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>EDULEXIA • Dyslexia Learning Support Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Empowering Every Reader with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Personalized Learning & Encouragement
          </span>
        </h1>

        <p className="text-base sm:text-xl text-emerald-200/80 max-w-3xl mx-auto leading-relaxed">
          A welcoming, accessibility-first platform providing structured 7-stage reading screenings, 
          positive skill profiles, and AI-recommended phonics activities. Built to celebrate effort, growth, and confidence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/screening"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Start 7-Stage Screening</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </Link>
          <Link
            to="/student"
            className="px-6 py-3.5 rounded-2xl bg-[#0d1611] border border-emerald-800 hover:border-emerald-500 text-emerald-200 font-bold text-base transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Student Hub</span>
          </Link>
          <SpeechReader text="Welcome to EDULEXIA, the Dyslexia Learning Support Platform. Start your 7-stage reading screening or explore personalized learning activities tailored to your needs." label="Listen to overview" />
        </div>
      </div>

      {/* Role Selection Jump Cards */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white">Choose Your Portal Experience</h2>
          <p className="text-sm text-emerald-400/70">Jump directly into any tailored persona with pre-loaded demo data:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#112419] to-[#0a150f] border-2 border-emerald-500/80 shadow-xl glow-emerald transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black shadow-md">
                <Star className="w-6 h-6 fill-black" />
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Student Hub
              </h3>
              <p className="text-sm text-emerald-200/80 leading-relaxed">
                Take the friendly screening, discover your skill profile, earn badges and stars, and practice fun phonics games.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('student', '/screening')}
              className="mt-6 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start as Leo (Student)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Parent Card */}
          <div className="rounded-3xl p-6 bg-[#0d1611] border border-emerald-900/80 hover:border-emerald-600 shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Parent Portal
              </h3>
              <p className="text-sm text-emerald-300/70 leading-relaxed">
                Gain supportive visibility into your child’s screening summary, practice streaks, skill domains, and home tips.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('parent', '/parent')}
              className="mt-6 w-full py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter as Sarah (Parent)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Card */}
          <div className="rounded-3xl p-6 bg-[#0d1611] border border-emerald-900/80 hover:border-emerald-600 shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Teacher Portal
              </h3>
              <p className="text-sm text-emerald-300/70 leading-relaxed">
                Monitor authorized students, review phonological domain heatmaps, track progress history, and plan classroom support.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('teacher', '/teacher')}
              className="mt-6 w-full py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter as Ms. Vance (Teacher)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Stage Screening Curriculum Roadmap */}
      <div className="rounded-3xl p-8 bg-[#0d1611] border border-emerald-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-emerald-400" />
              <span>Structured 7-Stage Screening Sequence</span>
            </h3>
            <p className="text-sm text-emerald-300/70 mt-1">
              Carefully designed progressive domains with audio support, high readability, and modular weights.
            </p>
          </div>
          <Link
            to="/screening"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
          >
            <span>Launch Screening</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '1', title: 'Letter Recognition', focus: 'b, d, p, q mirror discrimination', weight: '10%' },
            { num: '2', title: 'Letter–Sound Matching', focus: 'C → /k/, S → /s/, F → /f/', weight: '15%' },
            { num: '3', title: 'Phonological Skills', focus: 'Blending /k/+/æ/+/t/, segmentation', weight: '20%' },
            { num: '4', title: 'Word Recognition', focus: 'Ladder: cat → cap → map → mop', weight: '20%' },
            { num: '5', title: 'Sentence Reading', focus: 'Contextual sentence comprehension', weight: '15%' },
            { num: '6', title: 'Passage Reading', focus: 'Short story fluency', weight: '15%' },
            { num: '7', title: 'Optional Voice Reading', focus: 'Oral speech exploration (skippable)', weight: '5%' }
          ].map((s) => (
            <div
              key={s.num}
              className="p-4 rounded-2xl bg-[#070e0a] border border-emerald-900/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                    {s.num}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400/80 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                    Weight: {s.weight}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-emerald-300/60 mt-1">{s.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility & Ethical Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-900/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-white">Plus Jakarta Sans & Accessibility</h4>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Plus Jakarta Sans and high-legibility fonts, customizable letter/line spacing, reading ruler, and Web Speech audio narration.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-900/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-white">Positive Reinforcement</h4>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Results never label a student as having failed. Effort, streaks, and stars are celebrated without toxic competitive pressure.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-900/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-white">Ethical Screening Guardrails</h4>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Clear distinction between educational screening indicators and clinical medical diagnoses. Never outputs pseudo-diagnostic percentages.
          </p>
        </div>
      </div>
    </div>
  );
}
