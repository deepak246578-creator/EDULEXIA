import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Filter, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  Brain,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import SpeechReader from '../components/SpeechReader';
import MedicalDisclaimerBanner from '../components/MedicalDisclaimerBanner';

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await api.getActivities();
        setActivities(data);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const skillOptions = [
    { id: 'ALL', name: 'All Skills' },
    { id: 'letterRecognition', name: 'Letter Recognition' },
    { id: 'letterSoundMatching', name: 'Letter–Sound Matching' },
    { id: 'phonologicalSkills', name: 'Phonological Awareness' },
    { id: 'wordRecognition', name: 'Word Recognition' },
    { id: 'sentenceReading', name: 'Sentence Reading' },
    { id: 'passageReading', name: 'Passage Reading' }
  ];

  const levelOptions = ['ALL', 1, 2, 3, 4, 5, 6];

  const filteredActivities = activities.filter((act) => {
    const levelMatch = selectedLevel === 'ALL' || act.level === Number(selectedLevel);
    const skillMatch = selectedSkill === 'ALL' || act.skillArea === selectedSkill;
    return levelMatch && skillMatch;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-jakarta">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-black border border-emerald-500/40 glow-emerald">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Structured Phonics Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Reading Practice Activities
          </h1>
          <p className="text-sm text-emerald-200/80 max-w-2xl mt-1 leading-relaxed">
            Carefully crafted, multi-sensory reading exercises designed to strengthen phonological awareness, 
            letter discrimination, and fluency at your own pace.
          </p>
        </div>
        <SpeechReader text="Reading Practice Activities library. Filter by skill area or level to pick an activity." label="Listen to overview" />
      </div>

      <MedicalDisclaimerBanner compact={true} />

      {/* Filter Controls (Green + Black Theme) */}
      <div className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-800/80 shadow-xl glow-emerald space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-white">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filter Practice Library:</span>
        </div>

        {/* Level filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-emerald-400/70 mr-1">Level:</span>
          {levelOptions.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md glow-emerald'
                  : 'bg-[#070e0a] border-emerald-900/80 text-emerald-300 hover:border-emerald-600'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
            </button>
          ))}
        </div>

        {/* Skill filter buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/60">
          <span className="text-xs font-bold text-emerald-400/70 mr-1">Domain:</span>
          {skillOptions.map((sk) => (
            <button
              key={sk.id}
              onClick={() => setSelectedSkill(sk.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedSkill === sk.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-transparent border-transparent text-emerald-400/60 hover:bg-emerald-950/60 hover:text-emerald-300'
              }`}
            >
              {sk.name}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-emerald-300">Loading activities...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="py-16 text-center space-y-3 p-8 rounded-3xl bg-[#0d1611] border border-dashed border-emerald-700/80">
          <p className="text-base font-semibold text-emerald-200">
            No activities match your current filter combination.
          </p>
          <button
            onClick={() => { setSelectedLevel('ALL'); setSelectedSkill('ALL'); }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs cursor-pointer shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-6 rounded-3xl bg-[#0d1611] border border-emerald-900/80 hover:border-emerald-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Level {act.level}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400/60 capitalize">
                    {act.skillArea?.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {act.title}
                </h3>

                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <SpeechReader text={`${act.title}. ${act.description}`} label="Read aloud" size="sm" />
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-950/80 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~3-5 mins</span>
                </div>

                <Link
                  to={`/activities/${act.id}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Practice</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
