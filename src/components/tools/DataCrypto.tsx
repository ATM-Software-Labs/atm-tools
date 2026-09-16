import React, { useState } from 'react';
import { Card, Button, Label } from '../ui';
import { FileJson, Hash, Binary, Copy } from 'lucide-react';
import { jsonToCsv, csvToJson, encodeBase64, decodeBase64, calculateHash, encodeFileBase64 } from '../../utils/crypto';

export function DataCrypto() {
  const [activeTab, setActiveTab] = useState<'json-csv' | 'base64' | 'hash'>('json-csv');

  // JSON/CSV state
  const [jsonCsvInput, setJsonCsvInput] = useState('');
  const [jsonCsvOutput, setJsonCsvOutput] = useState('');
  const [jsonCsvMode, setJsonCsvMode] = useState<'toCsv' | 'toJson'>('toCsv');

  // Base64 state
  const [b64Input, setB64Input] = useState('');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  // Hash state
  const [hashInputText, setHashInputText] = useState('');
  const [hashInputFile, setHashInputFile] = useState<File | null>(null);
  const [hashOutput, setHashOutput] = useState('');
  const [hashAlgo, setHashAlgo] = useState<'SHA-256' | 'SHA-512'>('SHA-256');

  const handleJsonCsv = () => {
    try {
      if (jsonCsvMode === 'toCsv') {
        setJsonCsvOutput(jsonToCsv(jsonCsvInput));
      } else {
        setJsonCsvOutput(csvToJson(jsonCsvInput));
      }
    } catch (e: any) {
      setJsonCsvOutput(`Error: ${e.message}`);
    }
  };

  const handleBase64 = async () => {
    try {
      if (b64Mode === 'encode') {
        setB64Output(encodeBase64(b64Input));
      } else {
        setB64Output(decodeBase64(b64Input));
      }
    } catch (e: any) {
      setB64Output(`Error: ${e.message}`);
    }
  };

  const handleBase64File = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await encodeFileBase64(file);
      setB64Output(b64);
      setB64Input(`[File: ${file.name}]`);
    } catch (e: any) {
      setB64Output(`Error: ${e.message}`);
    }
  };

  const handleHash = async () => {
    try {
      const input = hashInputFile || hashInputText;
      if (!input) return;
      const hash = await calculateHash(input, hashAlgo);
      setHashOutput(hash);
    } catch (e: any) {
      setHashOutput(`Error: ${e.message}`);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">Data & Crypto</h2>
        <p className="text-slate-400">Local processing for data conversion, encoding, and hashing.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg w-fit border border-slate-800">
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'json-csv' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setActiveTab('json-csv')}
        >
          <FileJson size={16} /> JSON ↔ CSV
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'base64' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setActiveTab('base64')}
        >
          <Binary size={16} /> Base64
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'hash' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setActiveTab('hash')}
        >
          <Hash size={16} /> Hash Generator
        </button>
      </div>

      <Card>
        {activeTab === 'json-csv' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Input ({jsonCsvMode === 'toCsv' ? 'JSON' : 'CSV'})</Label>
                <button 
                  className="text-xs text-sky-400 hover:text-sky-300"
                  onClick={() => {
                    setJsonCsvMode(prev => prev === 'toCsv' ? 'toJson' : 'toCsv');
                    setJsonCsvInput(jsonCsvOutput);
                    setJsonCsvOutput('');
                  }}
                >
                  Swap Direction
                </button>
              </div>
              <textarea 
                className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 custom-scrollbar"
                value={jsonCsvInput}
                onChange={e => setJsonCsvInput(e.target.value)}
                placeholder={jsonCsvMode === 'toCsv' ? '[{"id":1,"name":"Test"}]' : 'id,name\n1,Test'}
              />
              <Button onClick={handleJsonCsv} className="w-full mt-2">Convert</Button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Output ({jsonCsvMode === 'toCsv' ? 'CSV' : 'JSON'})</Label>
                <button className="text-slate-400 hover:text-slate-200" onClick={() => copyToClipboard(jsonCsvOutput)} title="Copy">
                  <Copy size={16} />
                </button>
              </div>
              <textarea 
                className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none custom-scrollbar"
                value={jsonCsvOutput}
                readOnly
              />
            </div>
          </div>
        )}

        {activeTab === 'base64' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 p-1 bg-slate-900/80 rounded-lg w-fit border border-slate-800">
                <button 
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${b64Mode === 'encode' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  onClick={() => setB64Mode('encode')}
                >
                  Encode
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${b64Mode === 'decode' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  onClick={() => setB64Mode('decode')}
                >
                  Decode
                </button>
              </div>

              <div className="space-y-2">
                <Label>Input Text</Label>
                <textarea 
                  className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 custom-scrollbar"
                  value={b64Input}
                  onChange={e => setB64Input(e.target.value)}
                />
              </div>

              {b64Mode === 'encode' && (
                <div className="space-y-2">
                  <Label>Or Encode File (Data URI)</Label>
                  <input 
                    type="file" 
                    onChange={handleBase64File}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-900/30 file:text-sky-400 hover:file:bg-sky-900/50"
                  />
                </div>
              )}

              <Button onClick={handleBase64}>Process</Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Output</Label>
                <button className="text-slate-400 hover:text-slate-200" onClick={() => copyToClipboard(b64Output)} title="Copy">
                  <Copy size={16} />
                </button>
              </div>
              <textarea 
                className="w-full h-[280px] bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none custom-scrollbar break-all"
                value={b64Output}
                readOnly
              />
            </div>
          </div>
        )}

        {activeTab === 'hash' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Algorithm</Label>
                <select 
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  value={hashAlgo}
                  onChange={e => setHashAlgo(e.target.value as any)}
                >
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-512">SHA-512</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Input Text</Label>
                <textarea 
                  className="w-full h-24 bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 custom-scrollbar"
                  value={hashInputText}
                  onChange={e => {
                    setHashInputText(e.target.value);
                    setHashInputFile(null);
                  }}
                  disabled={!!hashInputFile}
                />
              </div>

              <div className="space-y-2">
                <Label>Or Input File</Label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setHashInputFile(e.target.files[0]);
                        setHashInputText('');
                      }
                    }}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-900/30 file:text-sky-400 hover:file:bg-sky-900/50"
                  />
                  {hashInputFile && (
                    <button className="text-sm text-red-400 hover:text-red-300 shrink-0" onClick={() => setHashInputFile(null)}>Clear File</button>
                  )}
                </div>
              </div>

              <Button onClick={handleHash} className="w-full">Generate Hash</Button>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <Label>Hash Output</Label>
                <button className="text-slate-400 hover:text-slate-200" onClick={() => copyToClipboard(hashOutput)} title="Copy">
                  <Copy size={16} />
                </button>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 font-mono text-sm text-sky-400 break-all min-h-[60px] flex items-center">
                {hashOutput || 'Result will appear here...'}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
