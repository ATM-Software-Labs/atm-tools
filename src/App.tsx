import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { UniversalConverter } from './components/tools/UniversalConverter';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { QuickEditor } from './components/tools/QuickEditor';
import { PdfManager } from './components/tools/PdfManager';
import { Image, Eraser, FileText, Sun } from 'lucide-react';
import { cn } from './utils/cn';

type Tool = 'home' | 'converter' | 'bg-remover' | 'editor' | 'pdf';

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('home');

  const tools = [
    { id: 'bg-remover', name: 'Quitar Fondo', icon: Eraser, desc: 'Borra el fondo de cualquier foto para dejar solo a la persona u objeto.' },
    { id: 'editor', name: 'Mejorar Foto', icon: Sun, desc: 'Dale más luz, más color o pon tu foto en blanco y negro fácilmente.' },
    { id: 'converter', name: 'Cambiar Formato', icon: Image, desc: 'Prepara tu foto para enviarla reduciendo su peso.' },
    { id: 'pdf', name: 'Documentos PDF', icon: FileText, desc: 'Junta varios documentos en uno solo de forma sencilla.' },
  ] as const;

  const renderTool = () => {
    switch (activeTool) {
      case 'converter': return <UniversalConverter onBack={() => setActiveTool('home')} />;
      case 'bg-remover': return <BackgroundRemover onBack={() => setActiveTool('home')} />;
      case 'editor': return <QuickEditor onBack={() => setActiveTool('home')} />;
      case 'pdf': return <PdfManager onBack={() => setActiveTool('home')} />;
      default: return null;
    }
  };

  return (
    <Layout>
      {activeTool === 'home' ? (
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-slate-100 mb-4">Herramientas Sencillas</h1>
            <p className="text-xl text-slate-400">¿Qué te gustaría hacer hoy? Haz clic en una opción.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className="flex items-start gap-6 p-8 bg-[#0f172a]/60 hover:bg-[#0f172a] border border-slate-800 rounded-3xl transition-all text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-900/30 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <tool.icon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-slate-200 mb-2">{tool.name}</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {renderTool()}
        </div>
      )}
    </Layout>
  );
}

export default App;
