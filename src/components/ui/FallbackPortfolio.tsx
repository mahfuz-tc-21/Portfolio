import React from 'react';
import { projectsData, skillsData, learningTimeline } from '../../data/portfolioData';
import { Mail, ExternalLink, GraduationCap, Laptop, Users, Compass, FolderGit2 } from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const FallbackPortfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-blue selection:text-white">
      {/* 2D Fallback Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 py-4 px-6 md:px-12 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-brand-blue tracking-wider">MAHFUZ'S PORTFOLIO</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">2D Fallback Mode</p>
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/mahfuz-tc-21" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800 transition">
            <GithubIcon className="w-[18px] h-[18px]" />
          </a>
          <a href="mailto:mahfuzuddin2004@gmail.com" className="text-slate-500 hover:text-slate-800 transition">
            <Mail size={18} />
          </a>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-soft flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-block bg-brand-blue-light text-brand-blue text-xs font-bold px-3 py-1 rounded-full">
              AI/ML Engineer &amp; Full-Stack Developer
            </div>
            <h2 className="text-3xl font-bold text-slate-800 leading-tight">
              Hello! I am Mahfuz Uddin.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              I learn by building, experiment with generative AI models, and engineer secure, production-ready full-stack applications. Welcome to my portfolio.
            </p>
            <div className="flex gap-3">
              <a 
                href="mailto:mahfuzuddin2004@gmail.com"
                className="bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow-soft transition flex items-center gap-1.5"
              >
                <Mail size={14} />
                <span>Let's Build Something</span>
              </a>
              <a 
                href="https://github.com/mahfuz-tc-21"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>
          <div className="w-36 h-36 bg-gradient-to-tr from-brand-blue to-purple-400 rounded-full flex items-center justify-center text-white shadow-premium">
            <Compass size={64} className="animate-spin-slow text-white/90" />
          </div>
        </section>

        {/* Projects Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderGit2 className="text-brand-blue" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Featured Software Projects</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projectsData.map((proj) => (
              <div key={proj.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft hover:shadow-premium transition space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                    <div className="flex items-center gap-2">
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition">
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{proj.description}</p>
                </div>
                
                <div className="text-[11px] font-medium space-y-2 border-t border-slate-50 pt-3">
                  <div>
                    <span className="text-slate-400 font-bold">Challenge: </span>
                    <span className="text-slate-600">{proj.problem}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Approach: </span>
                    <span className="text-slate-600">{proj.whatIbuilt}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.technologies.map(tech => (
                    <span key={tech} className="text-[9px] bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Timeline split */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills */}
          <section className="space-y-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
              <Laptop className="text-brand-blue" size={18} />
              <h3 className="font-bold text-slate-800 text-base">Skills &amp; Technologies</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(skillsData).map(([category, list]) => (
                <div key={category} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map(skill => (
                      <span key={skill} className="text-xs bg-slate-50 border border-slate-100 text-slate-600 font-semibold px-2.5 py-0.5 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Timeline */}
          <section className="space-y-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
              <GraduationCap className="text-brand-blue" size={18} />
              <h3 className="font-bold text-slate-800 text-base">Education Timeline</h3>
            </div>
            <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
              {learningTimeline.map((item, i) => (
                <div key={i} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-brand-blue" />
                  <h4 className="text-xs font-bold text-slate-700">{item.level}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Tech Cluder Community */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-3xl p-8 shadow-soft flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-soft">
            <Users size={20} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-base">Tech Cluder Community</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              I founded Tech Cluder to bridge academic education and current tech requirements. We aim to equip students with practical web development, Git, coding challenges, and AI application engineering capabilities.
            </p>
            <div className="text-[10px] text-red-600 font-bold">
              • Bootcamps • Code Reviews • Fostering Developer Collaboration
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 border-t border-slate-800 text-[10px] uppercase font-bold tracking-widest">
        Mahfuz Uddin &copy; {new Date().getFullYear()} • BUILD • LEARN • SOLVE • IMPACT
      </footer>
    </div>
  );
};
export default FallbackPortfolio;
