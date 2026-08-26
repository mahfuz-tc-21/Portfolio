import React from 'react';
import { useStore } from '../../store/useStore';
import { locationsData, projectsData, skillsData, learningTimeline } from '../../data/portfolioData';
import { X, ExternalLink, ArrowRight, Brain, Laptop, GraduationCap, Users, FolderGit2, Mail, CheckCircle } from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const InfoPanel: React.FC = () => {
  const { activeLocationId, setActiveLocationId } = useStore();

  if (!activeLocationId) return null;

  // Prevent generic InfoPanel from rendering for custom interactive locations
  const customInteractiveLocationIds = ['playground', 'museum', 'cafe', 'terminal'];
  if (customInteractiveLocationIds.includes(activeLocationId)) return null;

  const location = locationsData.find((l) => l.id === activeLocationId);
  if (!location) return null;

  // Filter projects relative to the selected location
  const projects = projectsData.filter((p) => {
    if (location.id === 'ai-lab') return p.category === 'ai_ml';
    if (location.id === 'project-avenue') return p.category === 'full_stack' || p.category === 'tools';
    if (location.id === 'github-center') return p.featured;
    return false;
  });

  const handleClose = () => {
    setActiveLocationId(null);
  };

  return (
    <div 
      className="fixed top-24 right-6 bottom-24 z-40 w-[420px] max-w-[calc(100vw-48px)] bg-white/95 backdrop-blur-md rounded-2xl shadow-premium border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-right-6 duration-300"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          {/* Custom icon matching selected building */}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-soft"
            style={{ backgroundColor: location.color }}
          >
            {location.icon === 'Brain' && <Brain size={16} />}
            {location.icon === 'Laptop' && <Laptop size={16} />}
            {location.icon === 'GraduationCap' && <GraduationCap size={16} />}
            {location.icon === 'Users' && <Users size={16} />}
            {location.icon === 'FolderGit2' && <FolderGit2 size={16} />}
            {location.icon === 'Building2' && <FolderGit2 size={16} />}
            {location.icon === 'Github' && <GithubIcon className="w-4 h-4" />}
            {location.icon === 'Send' && <Mail size={16} />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">{location.name}</h2>
            <p className="text-[10px] text-slate-400 font-semibold">{location.subtitle}</p>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* About Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {location.description}
          </p>
        </div>

        {/* 1. CPI CAMPUS - Timeline visualizer */}
        {location.id === 'cpi-campus' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Timeline</h3>
            <div className="space-y-3 border-l-2 border-brand-blue-light pl-4 ml-2">
              {learningTimeline.map((item, index) => (
                <div key={index} className="relative space-y-1">
                  {/* Bullet */}
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-white shadow-soft" />
                  <h4 className="text-xs font-bold text-slate-700">{item.level}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. DEVELOPER HQ - Technical skills */}
        {location.id === 'developer-hq' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tech Stack &amp; Skills</h3>
            
            {/* Loop skill categories */}
            <div className="space-y-3">
              {Object.entries(skillsData).map(([category, list]) => (
                <div key={category} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">{category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((skill) => (
                      <span 
                        key={skill}
                        className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md hover:border-brand-blue transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROJECTS DISPLAY (AI Lab, Project Avenue, GitHub Center) */}
        {projects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {location.id === 'ai-lab' ? 'Featured AI/ML Models' : 'Featured Software Projects'}
            </h3>
            
            <div className="space-y-4">
              {projects.map((proj) => (
                <div 
                  key={proj.id}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 hover:border-brand-blue/30 transition shadow-sm hover:shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{proj.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <a 
                        href={proj.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-700 transition"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                      {proj.liveUrl && (
                        <a 
                          href={proj.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-700 transition"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{proj.description}</p>
                  
                  {/* Dynamic context details */}
                  <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2 text-[9px] font-medium">
                    <div>
                      <span className="text-slate-400 font-bold">Challenge: </span>
                      <span className="text-slate-600">{proj.problem}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Approach: </span>
                      <span className="text-slate-600">{proj.whatIbuilt}</span>
                    </div>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {proj.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="text-[9px] bg-white border border-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TECH CLUDER - Community initiatives */}
        {location.id === 'tech-cluder' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Founder / Initiative</h3>
            
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-bold text-red-600">Tech Cluder Community</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                I founded Tech Cluder to bridge academic education and current tech requirements. We aim to equip students with practical web development, Git, coding challenges, and AI application engineering capabilities.
              </p>
            </div>
            
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Activities</h4>
              <div className="space-y-2 text-[10px] font-medium text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle size={10} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Interactive web design workshops &amp; bootcamp guidance.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={10} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Open-source collaboration sessions &amp; GitHub profile optimization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={10} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Problem-solving circles &amp; peer-to-peer coding bootcamps.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CITY EXIT - Contact form & links */}
        {location.id === 'city-exit' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Let's Connect</h3>
            
            <div className="bg-brand-blue-light border border-brand-blue/15 rounded-xl p-4 text-center space-y-2">
              <h4 className="text-xs font-bold text-brand-blue">Got a project in mind?</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Feel free to email me regarding full-stack work, AI integrations, or local community events.
              </p>
              
              <div className="pt-2">
                <a 
                  href="mailto:mahfuzuddin2004@gmail.com" 
                  className="inline-flex items-center gap-1 bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-soft transition"
                >
                  <Mail size={10} />
                  <span>Send an Email</span>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social Links</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                <a 
                  href="https://github.com/mahfuz-tc-21" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-slate-100 hover:border-brand-blue p-2.5 rounded-lg transition hover:bg-slate-50"
                >
                  <span className="flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </span>
                  <ArrowRight size={10} className="text-slate-400" />
                </a>
                
                <a 
                  href="https://linkedin.com" // Default placeholder
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-slate-100 hover:border-brand-blue p-2.5 rounded-lg transition hover:bg-slate-50"
                >
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-3.5 h-3.5 bg-blue-600 text-white rounded flex items-center justify-center text-[8px] font-black">in</span>
                    <span>LinkedIn</span>
                  </span>
                  <ArrowRight size={10} className="text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
          BUILD • LEARN • SOLVE • IMPACT
        </span>
      </div>
    </div>
  );
};
export default InfoPanel;
