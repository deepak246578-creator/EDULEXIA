import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Star, 
  BookOpen, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';

export default function Login() {
  const { user, login, register, switchRole, error } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDemoSelect = async (selectedRole) => {
    try {
      setLoading(true);
      await switchRole(selectedRole);
      if (selectedRole === 'student') navigate('/screening');
      else if (selectedRole === 'parent') navigate('/parent');
      else if (selectedRole === 'teacher') navigate('/teacher');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }

      if (role === 'parent') navigate('/parent');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/screening');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-jakarta">
      
      {/* Platform Hero / Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dyslexia Learning & Multi-Sensory Phonics</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
          <BookOpen className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-emerald-400 text-glow-green">EDULEXIA</span>
        </h1>
        <p className="text-sm text-emerald-200/80 max-w-lg mx-auto leading-relaxed">
          Sign in or select a demo profile below. Only verified <strong className="text-emerald-300 font-bold">Student profiles</strong> can unlock the 7-Stage Screening Assessment.
        </p>
      </div>

      <MedicalDisclaimerBanner compact={true} />

      {/* 1-Click Instant Demo Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Instant 1-Click Demo Profiles</span>
          </span>
          <span className="text-[11px] text-emerald-400/70">No password required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STUDENT CARD - Highlighted for screening */}
          <button
            onClick={() => handleDemoSelect('student')}
            className="p-5 rounded-3xl bg-gradient-to-b from-[#112318] to-[#0a160f] hover:from-[#152e1f] hover:to-[#0d1e14] border-2 border-emerald-500/80 text-left transition-all hover:scale-102 flex flex-col justify-between shadow-lg shadow-emerald-950/50 group relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
              Screening Ready
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black shadow-md">
                <Star className="w-5 h-5 fill-black" />
              </div>
              <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition-colors">
                Leo Martin
              </h3>
              <p className="text-xs text-emerald-300/80">Student • Level 2 Phonics</p>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Start 7-Stage Screening</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* PARENT CARD */}
          <button
            onClick={() => handleDemoSelect('parent')}
            className="p-5 rounded-3xl bg-[#0c1510] hover:bg-[#101b14] border border-emerald-900/60 hover:border-emerald-700/60 text-left transition-all hover:scale-102 flex flex-col justify-between shadow-md group"
          >
            <div className="space-y-2 pt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                Sarah Martin
              </h3>
              <p className="text-xs text-emerald-400/60">Parent • Linked to Leo</p>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-400/80 group-hover:text-emerald-300">
              <span>Enter Parent Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* TEACHER CARD */}
          <button
            onClick={() => handleDemoSelect('teacher')}
            className="p-5 rounded-3xl bg-[#0c1510] hover:bg-[#101b14] border border-emerald-900/60 hover:border-emerald-700/60 text-left transition-all hover:scale-102 flex flex-col justify-between shadow-md group"
          >
            <div className="space-y-2 pt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                Ms. Vance
              </h3>
              <p className="text-xs text-emerald-400/60">Teacher • Classroom Roster</p>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-400/80 group-hover:text-emerald-300">
              <span>Enter Teacher Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      {/* Manual Credentials Form */}
      <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#0d1611] border border-emerald-800/80 shadow-2xl glow-emerald space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <h2 className="font-extrabold text-base text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{isRegister ? 'Create New Account' : 'Account Sign In'}</span>
          </h2>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
          >
            {isRegister ? 'Already registered? Sign In' : 'New here? Register'}
          </button>
        </div>

        {(localError || error) && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500/70" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-900/80 bg-[#070d09] text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder-emerald-800"
                    placeholder="e.g. Leo Martin"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1.5">Select Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/80 bg-[#070d09] text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="student">Student (Eligible for Screening)</option>
                  <option value="parent">Parent (Progress Oversight)</option>
                  <option value="teacher">Teacher (Classroom Analytics)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-emerald-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-900/80 bg-[#070d09] text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder-emerald-800"
                placeholder="e.g. student@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-emerald-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-900/80 bg-[#070d09] text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder-emerald-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>
      </div>

    </div>
  );
}
