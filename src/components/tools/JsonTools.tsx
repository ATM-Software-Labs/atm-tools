import React, { useState } from 'react';
import { Card, Button, Label } from '../ui';
import { ArrowLeft, Copy, Check, FileJson } from 'lucide-react';

export function JsonTools({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    }
  };

  const minifyJson = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 bg-[#0b1329] border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Formateo JSON</h2>
          <p className="text-slate-400">Formatter, Minifier y visor rápido local.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Input JSON</Label>
            <textarea 
              className="w-full h-[400px] bg-[#0b1329] border border-slate-800 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500 custom-scrollbar"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='{"key": "value"}'
            />
            <div className="flex gap-2">
              <Button onClick={formatJson} className="flex-1 bg-blue-600 hover:bg-blue-500">Format</Button>
              <Button onClick={minifyJson} className="flex-1 bg-slate-700 hover:bg-slate-600">Minify</Button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center h-[24px]">
              <Label>Output</Label>
              <button 
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-sm transition-colors" 
                onClick={copyToClipboard}
              >
                {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                {copied ? <span className="text-green-400">Copied</span> : 'Copy'}
              </button>
            </div>
            <textarea 
              className="w-full h-[400px] bg-[#0b1329] border border-slate-800 rounded-lg p-4 text-sm font-mono text-blue-400 focus:outline-none custom-scrollbar whitespace-pre"
              value={output}
              readOnly
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
