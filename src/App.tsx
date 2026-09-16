import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { UniversalConverter } from './components/tools/UniversalConverter';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { MiniStudio } from './components/tools/MiniStudio';
import { PdfManager } from './components/tools/PdfManager';
import { DataCrypto } from './components/tools/DataCrypto';
import { Zap, Eraser, Palette, FileText, Code2 } from 'lucide-react';
import { cn } from './utils/cn';

type Tool = 'converter' | 'bg-remover' | 'studio' | 'pdf' | 'data';

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('converter');

  const tools = [
    { id: 'converter', name: 'Smart Compress & Convert', icon: Zap, component: UniversalConverter, desc: 'Massive optimization engine' },
    { id: 'bg-remover', name: 'AI Background Remover', icon: Eraser, component: BackgroundRemover, desc: 'Local neural network WASM' },
    { id: 'studio', name: 'Mini Studio Editor', icon: Palette, component: MiniStudio, desc: 'Canvas-based design tool' },
    { id: 'pdf', name: 'PDF Studio', icon: FileText, component: PdfManager, desc: 'Merge, split & rotate' },
    { id: 'data', name: 'Data & Crypto', icon: Code2, component: DataCrypto, desc: 'Local dev & security tools' },
  ] as const;

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component || UniversalConverter;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3 font-mono">Tools Suite</h2>
            <nav className="flex flex-col gap-1.5">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "flex flex-col items-start px-4 py-3 rounded-xl transition-all text-left",
                    activeTool === tool.id 
                      ? "bg-sky-600/10 border border-sky-500/20 shadow-inner" 
                      : "border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <tool.icon size={18} className={activeTool === tool.id ? "text-sky-400" : "text-slate-400"} />
                    <span className={cn(
                      "text-sm font-medium",
                      activeTool === tool.id ? "text-sky-400" : "text-slate-200"
                    )}>{tool.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 ml-7">{tool.desc}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        
        <div className="flex-1 min-w-0">
          <ActiveComponent />
        </div>
      </div>
    </Layout>
  );
}

export default App;
