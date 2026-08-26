import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Compass, BookOpen, Cpu, Globe, FolderGit2, Users, Flame, X, ArrowLeft } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  icon: React.ReactNode;
  content: string[];
  highlight: string;
}

export const MuseumViewer: React.FC = () => {
  const { activeLocationId, setActiveLocationId } = useStore();
  const [activeRoomId, setActiveRoomId] = useState('prog');

  if (activeLocationId !== 'museum') return null;

  const rooms: Room[] = [
    {
      id: 'prog',
      name: '01 • Programming Core',
      icon: <BookOpen size={14} />,
      highlight: 'Strong structural coding principles, logical database indexing, and performance optimization.',
      content: [
        'Mastery in JavaScript and TypeScript (ES6+, asynchronous event architecture).',
        'Strong backend core in Python (used for data scraping and generative models).',
        'Academics in C/C++ (exploring pointers, system allocation, and fundamental algorithms).'
      ]
    },
    {
      id: 'web',
      name: '02 • Web Engineering',
      icon: <Globe size={14} />,
      highlight: 'Engineering fast, secure, and production-ready web experiences with clean layouts.',
      content: [
        'Full-stack architecture using React (v19), Next.js (App Router), and Vite.',
        'Responsive layout design using Tailwind CSS and custom PostCSS configurations.',
        'Backend server APIs built with Node.js, Express, and MongoDB document databases.'
      ]
    },
    {
      id: 'ai',
      name: '03 • AI / ML Innovation',
      icon: <Cpu size={14} />,
      highlight: 'Harnessing generative AI models and semantic vectors to build intelligent SaaS tools.',
      content: [
        'Large Language Model integrations via Gemini API, prompt engineering, and response mapping.',
        'Data extraction pipelines with context-aware semantic parsing and LLM sanitization.',
        'Experience building intelligent scoring systems like AI Opportunity Scores for trends.'
      ]
    },
    {
      id: 'proj',
      name: '04 • Projects Gallery',
      icon: <FolderGit2 size={14} />,
      highlight: 'Actual software products engineered to solve user problems and automate complex pipelines.',
      content: [
        'TrendPilot AI: Multi-tenant SaaS content intelligence platform.',
        'AI Comment Reply Assistant: Contextual auto-reply generator for social growth.',
        'Next-Semester: Academic calculator & resources coordinator for CST students.'
      ]
    },
    {
      id: 'comm',
      name: '05 • Tech Community',
      icon: <Users size={14} />,
      highlight: 'Fostering developer growth, hosting open-source seminars, and mentoring in Bangladesh.',
      content: [
        'Founded Tech Cluder community, growing a local network of programming learners.',
        'Mentored and guided bootcamps, workshops, and open-source contribution drives.',
        'Led peer-to-peer coding bootcamps and profile optimization guidance.'
      ]
    },
    {
      id: 'exp',
      name: '06 • Active Experiments',
      icon: <Flame size={14} />,
      highlight: 'Pushing browser boundaries with real-time 3D, animations, and programmatic audios.',
      content: [
        '3D city design: Built using Three.js, React Three Fiber (R3F), and Drei custom meshes.',
        'Dynamic sound synth: Oscillator-driven synthesizers using native browser Web Audio API.',
        'High-performance instanced models rendering for dense virtual trees and details.'
      ]
    }
  ];

  const selectedRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-soft">
              <Compass size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Developer Museum</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Archive of my developer journey</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveLocationId(null)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body split layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-[360px] overflow-hidden">
          {/* Left Rooms Navigation */}
          <div className="w-full md:w-56 bg-slate-50 border-r border-slate-100 p-4 space-y-1.5 overflow-y-auto shrink-0">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Exhibition Rooms</span>
            {rooms.map((r) => {
              const isActive = activeRoomId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRoomId(r.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-[10px] font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 border-purple-600 text-white shadow-soft'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {r.icon}
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Room Display */}
          <div className="flex-1 p-6 space-y-5 overflow-y-auto animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">
                {selectedRoom.name.split('•')[1].trim()}
              </h3>
              <div className="mt-2 bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-xl">
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">
                  "{selectedRoom.highlight}"
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">Room Exhibits</span>
              <ul className="space-y-2.5">
                {selectedRoom.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[10px] text-slate-600 leading-relaxed font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
          <button 
            onClick={() => setActiveLocationId(null)}
            className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider"
          >
            <ArrowLeft size={10} />
            <span>Return to City</span>
          </button>
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            ROOM ARCHIVE • MAHFUZ UDDIN • CST Chattogram
          </span>
        </div>
      </div>
    </div>
  );
};
export default MuseumViewer;
