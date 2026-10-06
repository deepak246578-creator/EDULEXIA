import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  User, 
  Users, 
  GraduationCap, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Flame, 
  Star, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Navbar() {
  const { user, profile, switchRole, logout } = useAuth();
  const { drawerOpen, setDrawerOpen, isSpeaking, stopSpeaking } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = async (targetRole) => {
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    await switchRole(targetRole);
    if (targetRole === 'student') navigate('/screening');
    else if (targetRole === 'parent') navigate('/parent');
    else if (targetRole === 'teacher') navigate('/teacher');
  };

  const navLinks = [
    { label: 'Overview', path: '/overview' },
    { label: '7-Stage Screening', path: '/screening', roleRequired: 'student' },
    { label: 'Student Hub', path: '/student', roleRequired: 'student' },
    { label: 'Reading Practice', path: '/activities', roleRequired: 'student' },
    { label: 'Parent Portal', path: '/parent', roleRequired: 'parent' },
    { label: 'Teacher Portal', path: '/teacher', roleRequired: 'teacher' }
  ];

  const visibleNavLinks = navLinks.filter(link => {
    if (!user) {
      return link.path === '/overview';
    }
    if (link.roleRequired) {
      return user.role === link.roleRequired;
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-40 bg-[#070a08]/95 backdrop-blur-md border-b border-emerald-900/60 transition-colors shadow-md font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-green-400 to-emerald-300 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl tracking-wider text-white block leading-tight font-jakarta">
                EDULEXIA
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block font-jakarta">
                Learning Support Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {visibleNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-jakarta transition-all ${
                    isActive
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-md shadow-emerald-950/50'
                      : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-800/80 bg-[#0e1611] text-emerald-300 hover:border-emerald-500 transition-colors shadow-xs font-jakarta cursor-pointer"
                title="Switch active role profile"
              >
                {user?.role === 'parent' ? (
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                ) : user?.role === 'teacher' ? (
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="capitalize">{user?.name?.split(' ')[0] || 'User'} ({user?.role || 'Guest'})</span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0d1611] border border-emerald-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 glow-emerald">
                  <div className="px-3.5 py-1.5 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                    Demo Role Switcher
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold hover:bg-emerald-950/80 flex items-center justify-between text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Leo Martin (Student)
                    </span>
                    {user?.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('parent')}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold hover:bg-emerald-950/80 flex items-center justify-between text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Sarah Martin (Parent)
                    </span>
                    {user?.role === 'parent' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('teacher')}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold hover:bg-emerald-950/80 flex items-center justify-between text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Ms. Vance (Teacher)
                    </span>
                    {user?.role === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                  <div className="my-1.5 border-t border-emerald-900/60" />
                  <button
                    onClick={() => { setRoleDropdownOpen(false); navigate('/login'); }}
                    className="w-full px-3.5 py-2 text-left text-xs font-bold hover:bg-emerald-950/80 text-emerald-300 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sign In with Custom Account</span>
                  </button>
                  {user && (
                    <button
                      onClick={() => { setRoleDropdownOpen(false); logout(); navigate('/'); }}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold hover:bg-rose-950/60 text-rose-400 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Speech Stop Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors animate-pulse cursor-pointer"
                title="Stop Audio"
                aria-label="Stop audio reading"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            {/* Accessibility Settings Trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95 font-jakarta cursor-pointer"
              title="Open Accessibility Controls (Font, Theme, Spacing, Audio)"
              aria-label="Accessibility settings"
            >
              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Aa Reading Mode</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-emerald-400 hover:bg-emerald-950/60 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-emerald-900/60 space-y-2 bg-[#09120c] rounded-2xl p-3 mt-2 font-jakarta">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-200 hover:bg-emerald-950/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
