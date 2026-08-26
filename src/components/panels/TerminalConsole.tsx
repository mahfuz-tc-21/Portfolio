import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Terminal, X } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'system';
}

export const TerminalConsole: React.FC = () => {
  const { activeLocationId, setActiveLocationId } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Mahfuz OS [Version 1.0.0]', type: 'system' },
    { text: 'Type "help" for a list of available commands.', type: 'system' },
    { text: '', type: 'system' }
  ]);

  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  if (activeLocationId !== 'terminal') return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase();
    if (!cleanInput) return;

    const newHistory = [...history, { text: `> ${inputValue}`, type: 'input' as const }];
    let output: TerminalLine[] = [];

    switch (cleanInput) {
      case 'help':
        output = [
          { text: 'Available commands:', type: 'system' },
          { text: '  about      - Details about Mahfuz Uddin', type: 'system' },
          { text: '  projects   - Featured full-stack software systems', type: 'system' },
          { text: '  ai         - Generative AI & ML pipelines list', type: 'system' },
          { text: '  skills     - Programming languages & tech tools', type: 'system' },
          { text: '  github     - Opens GitHub profile page link', type: 'system' },
          { text: '  contact    - Retrieve contact email information', type: 'system' },
          { text: '  clear      - Clear the console terminal lines', type: 'system' }
        ];
        break;
      case 'about':
        output = [
          { text: 'Builder Profile:', type: 'output' },
          { text: '  Name: Mahfuz Uddin', type: 'output' },
          { text: '  Role: AI Product Engineer & Full-Stack Developer', type: 'output' },
          { text: '  Education: CST at Chattogram Polytechnic Institute', type: 'output' },
          { text: '  Focus: Secure web SaaS platforms & vector pipeline scripts.', type: 'output' }
        ];
        break;
      case 'projects':
        output = [
          { text: 'Featured Software Projects:', type: 'output' },
          { text: '  1. Next-Semester  - Academic coordinator utility', type: 'output' },
          { text: '  2. CPI Room Finder - Classroom indexing portal', type: 'output' },
          { text: '  3. PH-Reels-Cutter - Automation scripts', type: 'output' }
        ];
        break;
      case 'ai':
        output = [
          { text: 'Generative AI/ML Engineering:', type: 'output' },
          { text: '  1. TrendPilot AI               - LLM Opportunity intelligence SaaS', type: 'output' },
          { text: '  2. AI Comment Reply Assistant  - Contextual comments responder', type: 'output' }
        ];
        break;
      case 'skills':
        output = [
          { text: 'Core Technical Stack:', type: 'output' },
          { text: '  Languages: TypeScript, JavaScript, Python, C++', type: 'output' },
          { text: '  Libraries: React, Node.js, Next.js, Express, Three.js', type: 'output' },
          { text: '  Databases: MongoDB, SQL indexing, vector structures', type: 'output' }
        ];
        break;
      case 'github':
        window.open('https://github.com/mahfuz-tc-21', '_blank');
        output = [{ text: 'Opening https://github.com/mahfuz-tc-21 in a new window...', type: 'system' }];
        break;
      case 'contact':
        output = [
          { text: 'Reach out for projects & collaborations:', type: 'output' },
          { text: '  Email: mahfuzuddin2004@gmail.com', type: 'output' },
          { text: '  GitHub: mahfuz-tc-21', type: 'output' }
        ];
        break;
      case 'secret':
        output = [
          { text: '🔑 EASTER EGG DISCOVERED!', type: 'output' },
          { text: "  Log: 'Caffeine Level: 140%, Bugs fixed today: 12. Sleep status: Undefined. Happy coding!'", type: 'output' }
        ];
        break;
      case 'hack':
        output = [
          { text: '🕶️ ACCESS GRANTED!', type: 'output' },
          { text: '  System overload bypassed. You are now the root admin of Mahfuz\'s City.', type: 'output' }
        ];
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      default:
        output = [
          { text: `Command not found: "${cleanInput}".`, type: 'system' },
          { text: 'Type "help" for a list of valid commands.', type: 'system' }
        ];
    }

    setHistory([...newHistory, ...output, { text: '', type: 'system' as const }]);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-slate-950 border border-slate-800 shadow-premium w-full max-w-lg rounded-2xl flex flex-col h-[70vh] animate-in zoom-in-95 duration-200">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 rounded-t-2xl">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal size={14} className="text-emerald-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">mahfuz@portfolio-terminal:~</span>
          </div>
          <button 
            onClick={() => setActiveLocationId(null)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Console logs screen */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 select-text selection:bg-emerald-500/30 selection:text-emerald-400">
          {history.map((line, i) => (
            <div 
              key={i} 
              className={`leading-relaxed whitespace-pre-wrap ${
                line.type === 'input' 
                  ? 'text-white font-bold' 
                  : line.type === 'output' 
                  ? 'text-cyan-400' 
                  : 'text-emerald-400'
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Input prompt form */}
        <form 
          onSubmit={handleCommandSubmit}
          className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-2xl flex items-center gap-2 pointer-events-auto"
        >
          <span className="font-mono text-[10px] font-bold text-emerald-500 select-none">&gt;</span>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-[10px] text-white caret-emerald-400 focus:ring-0 focus:ring-offset-0 p-0"
            placeholder="type 'help' or commands here..."
            autoFocus
          />
          <button 
            type="submit"
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded font-mono text-[9px] cursor-pointer"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
};
export default TerminalConsole;
