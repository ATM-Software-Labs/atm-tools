import React, { useState } from 'react';
import { useAppConfig } from '../../utils/useAppConfig';
import { i18n } from '../../utils/i18n';
import { Card, Button, Label } from '../ui';
import { ArrowLeft, Copy, Check, FileJson } from 'lucide-react';

export function JsonTools({ onBack }: { onBack: () => void }) {
  const { lang } = useAppConfig();
  const dict = i18n[lang];

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const formatJson = () => {
    try {
      setError('');
      setSuccess('');
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setSuccess('JSON Válido. Formateado correctamente.');
    } catch (e: any) {
      setError(`Error de validación: ${e.message}`);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      setError('');
      setSuccess('');
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setSuccess('JSON Válido. Minificado correctamente.');
    } catch (e: any) {
      setError(`Error de validación: ${e.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 bg-[#0a0e17] border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{dict.tools['json'].name}</h2>
          <p className="text-slate-400">{dict.tools['json'].desc}</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <ArrowLeft size={18} />{lang === 'ES' ? 'Volver' : lang === 'CA' ? 'Tornar' : 'Back'}</button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center h-[24px]">
              <Label>Input JSON</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sangría:</span>
                <select 
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  value={indent}
                  onChange={e => setIndent(parseInt(e.target.value))}
                >
                  <option value={2}>2 espacios</option>
                  <option value={4}>4 espacios</option>
                </select>
              </div>
            </div>
            <textarea 
              className="w-full h-[400px] bg-[#0a0e17] border border-slate-800 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500 custom-scrollbar"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='{"key": "value"}'
            />
            <div className="flex gap-2">
              <Button onClick={formatJson} className="flex-1 bg-blue-600 hover:bg-blue-500">Formatear / Validar</Button>
              <Button onClick={minifyJson} className="flex-1 bg-slate-700 hover:bg-slate-600">Minificar</Button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2 font-mono">{error}</p>}
            {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
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
              className="w-full h-[400px] bg-[#0a0e17] border border-slate-800 rounded-lg p-4 text-sm font-mono text-blue-400 focus:outline-none custom-scrollbar whitespace-pre"
              value={output}
              readOnly
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
