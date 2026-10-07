import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Navbar from './components/Navbar';
import AccessibilityDrawer from './components/AccessibilityDrawer';
import { getUserNickname } from './utils/userUtils';

// Pages
import Home from './pages/Home';
import ScreeningAssessment from './pages/ScreeningAssessment';
import StudentHub from './pages/StudentHub';
import ActivitiesList from './pages/ActivitiesList';
import ActivityPlayer from './pages/ActivityPlayer';
import ParentPortal from './pages/ParentPortal';
import TeacherPortal from './pages/TeacherPortal';
import Login from './pages/Login';

// Root Route: When opening website, shows Login first if unauthenticated
function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-emerald-400">Loading EDULEXIA...</p>
      </div>
    );
  }

  // Not logged in -> Show Login page first
  if (!user) {
    return <Login />;
  }

  // If student -> Direct to 7-Stage Screening Test
  if (user.role === 'student') {
    return <Navigate to="/screening" replace />;
  }

  // If parent -> Direct to Parent Portal
  if (user.role === 'parent') {
    return <Navigate to="/parent" replace />;
  }

  // If teacher -> Direct to Teacher Portal
  if (user.role === 'teacher') {
    return <Navigate to="/teacher" replace />;
  }

  return <Login />;
}

// Student Screening Guard: Only student login can access screening test
function StudentScreeningRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-emerald-400">Verifying student credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strictly student only
  if (user.role !== 'student') {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center space-y-6 font-jakarta">
        <div className="p-8 rounded-3xl bg-[#0d1611] border-2 border-emerald-800 shadow-2xl glow-emerald space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
            🎓
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Student Assessment Only
          </h2>
          <p className="text-sm text-emerald-200/80 leading-relaxed">
            The 7-Stage Screening Assessment is exclusively calibrated for <strong className="text-emerald-300">Student learners</strong>. 
            You are currently signed in as a <strong className="capitalize text-emerald-400">{user.role}</strong> (@{getUserNickname(user)}).
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={user.role === 'parent' ? '/parent' : '/teacher'}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-md transition-all"
            >
              Open {user.role === 'parent' ? 'Parent Portal' : 'Teacher Portal'}
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-emerald-800 text-emerald-300 font-bold text-sm hover:bg-emerald-950/60 transition-all"
            >
              Switch to Student Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ScreeningAssessment />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityProvider>
          <div className="min-h-screen flex flex-col font-jakarta transition-colors duration-200 bg-[#070a08] text-emerald-50">
            {/* Top Navigation */}
            <Navbar />

            {/* Accessibility Settings Drawer */}
            <AccessibilityDrawer />

            {/* Main Application Routes */}
            <main className="flex-1 pb-16">
              <Routes>
                {/* When first opening web, Login comes first */}
                <Route path="/" element={<RootRoute />} />
                <Route path="/overview" element={<Home />} />
                
                {/* 7-Stage Screening: Only accessible if Student is logged in */}
                <Route path="/screening" element={<StudentScreeningRoute />} />
                
                <Route path="/student" element={<StudentHub />} />
                <Route path="/activities" element={<ActivitiesList />} />
                <Route path="/activities/:id" element={<ActivityPlayer />} />
                <Route path="/parent" element={<ParentPortal />} />
                <Route path="/teacher" element={<TeacherPortal />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>

            {/* Accessible Footer (Green + Black Theme) */}
            <footer className="border-t border-emerald-950/80 bg-[#050806]/95 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 text-xs text-emerald-400/60 font-jakarta">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                  <p className="font-extrabold text-emerald-300 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>EDULEXIA • Dyslexia Learning Support Platform</span>
                  </p>
                  <p className="mt-1 max-w-xl text-[11px] text-emerald-300/60 leading-relaxed">
                    Powered by Plus Jakarta Sans typography, adaptive sensory feedback, and Web Speech audio narration. 
                    This tool is an educational screening aid and not a substitute for clinical or psychological assessment.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                  <Link to="/overview" className="text-emerald-400/70 hover:text-emerald-300 transition-colors">
                    Overview
                  </Link>
                  <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Sign In / Switch Persona
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </AccessibilityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
