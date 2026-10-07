import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  Clock, 
  Calendar, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Star, 
  BookOpen 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SpeechReader from '../components/SpeechReader';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';
import { getUserNickname } from '../utils/userUtils';

export default function TeacherPortal() {
  const { user, switchRole, loading: authLoading } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        if (user && user.role !== 'teacher') {
          await switchRole('teacher');
        }
        const data = await api.getTeacherStudents();
        setStudents(data.students || []);
      } catch (err) {
        console.error('Failed to load students roster:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user?.role, authLoading]);

  const handleOpenDetail = async (studentId) => {
    setSelectedStudentId(studentId);
    try {
      setDetailLoading(true);
      const data = await api.getTeacherStudentDetail(studentId);
      setStudentDetail(data);
    } catch (err) {
      console.error('Failed to load student details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 font-jakarta">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-black shadow-2xl glow-emerald-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-black">
            <GraduationCap className="w-3.5 h-3.5 text-black" />
            <span>Educator & Specialist Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Classroom Reading Support Hub
          </h1>
          <p className="text-emerald-950 font-semibold text-sm sm:text-base max-w-xl">
            Monitor authorized students' screening indicators, review phonological domain heatmaps, 
            and implement structured classroom accommodations.
          </p>
          <div className="pt-1">
            <SpeechReader 
              text="Teacher and Educator Portal. Review classroom screening summaries, domain matrices, and IEP accommodations." 
              label="Listen to overview" 
            />
          </div>
        </div>

        <div className="px-6 py-5 rounded-2xl bg-black/30 backdrop-blur-md border border-black/40 text-center min-w-[200px]">
          <span className="text-xs uppercase font-extrabold text-emerald-200 tracking-wider">Active Roster</span>
          <div className="text-3xl font-black text-white mt-1">{students.length} Student{students.length !== 1 ? 's' : ''}</div>
          <span className="text-xs text-emerald-200/80 mt-1 block">Authorized under your profile</span>
        </div>
      </div>

      <MedicalDisclaimerBanner compact={false} />

      {/* Classroom Domain Heatmap / Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1611] border-2 border-emerald-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
          <div>
            <span className="text-xs uppercase font-black tracking-wider text-emerald-400">
              Diagnostic Matrix
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">
              Phonological & Reading Domain Heatmap
            </h2>
          </div>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Classroom Summary</span>
          </button>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-900/80 text-xs font-bold text-emerald-400/80 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Letter Rec.</th>
                <th className="py-3 px-3">Sound Match</th>
                <th className="py-3 px-3">Phonology</th>
                <th className="py-3 px-3">Word Rec.</th>
                <th className="py-3 px-3">Sentence</th>
                <th className="py-3 px-3">Passage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {students.map((st) => {
                const sp = st.skillProfile || {};
                const renderPill = (val) => {
                  if (!val) return <span className="text-emerald-800 text-xs">-</span>;
                  const isStrong = val === 'Strong';
                  const isMod = val === 'Moderate';
                  return (
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-black ${
                      isStrong 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : isMod 
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {val}
                    </span>
                  );
                };

                return (
                  <tr key={st.id} className="hover:bg-[#08120c] transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      {getUserNickname(st)}
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-extrabold text-xs text-emerald-300 bg-[#070e0a] px-2.5 py-1 rounded-lg border border-emerald-800">
                        Lvl {st.learningLevel}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs font-medium text-emerald-200">
                        {st.supportLevel}
                      </span>
                    </td>
                    <td className="py-4 px-3">{renderPill(sp.letterRecognition)}</td>
                    <td className="py-4 px-3">{renderPill(sp.letterSoundMatching)}</td>
                    <td className="py-4 px-3">{renderPill(sp.phonologicalSkills)}</td>
                    <td className="py-4 px-3">{renderPill(sp.wordRecognition)}</td>
                    <td className="py-4 px-3">{renderPill(sp.sentenceReading)}</td>
                    <td className="py-4 px-3">{renderPill(sp.passageReading)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(st.id)}
                        className="p-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Drilldown</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classroom Accommodations Guide */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1611] border border-emerald-800/80 space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span>Classroom Accommodations & Instructional Strategies</span>
          </h3>
          <p className="text-xs text-emerald-300/70 mt-1">
            Universal Design for Learning (UDL) interventions recommended for students showing reading variance:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h4 className="font-bold text-sm text-emerald-300">High-Legibility Typography</h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Format reading materials and tests using clean typography with distinct shapes (Plus Jakarta Sans, Lexend) with increased letter and line spacing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h4 className="font-bold text-sm text-emerald-300">Pacing & Extra Time</h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Provide 1.5x time on written reading assessments. Decoding unfamiliar words requires extra cognitive bandwidth; additional time prevents anxiety.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e0a] border border-emerald-900/70 space-y-2">
            <h4 className="font-bold text-sm text-emerald-300">Multi-Sensory Word Ladders</h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Utilize tactile letter blocks and color-coded vowels to physically model sound changes (e.g. <em>cat → cap → map → mop</em>) during small-group instruction.
            </p>
          </div>
        </div>
      </div>

      {/* STUDENT DETAIL DRILLDOWN MODAL */}
      {selectedStudentId && studentDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#0d1611] rounded-3xl shadow-2xl border-2 border-emerald-500/80 overflow-hidden space-y-6 p-6 sm:p-8 max-h-[90vh] overflow-y-auto glow-emerald">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-emerald-900/70 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Individual Student Profile
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {getUserNickname(studentDetail.student)}
                </h3>
                <p className="text-xs text-emerald-400/70">
                  Current Track: Level {studentDetail.profile?.learningLevel || 1} • {studentDetail.profile?.starsCount || 0} Stars
                </p>
              </div>
              <button
                onClick={() => { setSelectedStudentId(null); setStudentDetail(null); }}
                className="p-2 rounded-xl hover:bg-emerald-950/80 text-emerald-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Screening Details */}
            {studentDetail.latestScreening ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#070e0a] border border-emerald-800">
                  <h4 className="font-bold text-sm text-emerald-200">
                    {studentDetail.latestScreening.positiveHeadline}
                  </h4>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    {studentDetail.latestScreening.positiveMessage}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {studentDetail.latestScreening.skillProfile && Object.entries(studentDetail.latestScreening.skillProfile).map(([skill, val]) => (
                    <div key={skill} className="p-3 rounded-xl bg-[#070e0a] border border-emerald-900/60">
                      <span className="text-xs text-emerald-400/80 capitalize block truncate">
                        {skill.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-xs font-bold text-white mt-0.5 block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-emerald-400/60">No screening recorded yet for this student.</p>
            )}

            {/* Print & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-900/70">
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Student Report</span>
              </button>

              <button
                onClick={() => { setSelectedStudentId(null); setStudentDetail(null); }}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs cursor-pointer shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
