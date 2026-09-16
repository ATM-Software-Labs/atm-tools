import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { keccak256 } from 'js-sha3';
import bs58 from 'bs58';

export function Web3Tools({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'hash' | 'sig' | 'unit' | 'encode'>('hash');

  // Keccak
  const [hashInput, setHashInput] = useState('');
  const [keccakOut, setKeccakOut] = useState('');
  
  // Units
  const [wei, setWei] = useState('');
  const [gwei, setGwei] = useState('');
  const [ether, setEther] = useState('');

  // Encode/Decode
  const [encInput, setEncInput] = useState('');
  const [encFormat, setEncFormat] = useState<'utf8' | 'hex' | 'base64'>('utf8');
  const [decFormat, setDecFormat] = useState<'hex' | 'base64'>('hex');
  const [encOutput, setEncOutput] = useState('');
  
  // Addrs / Sigs
  const [addrInput, setAddrInput] = useState('');
  const [addrType, setAddrType] = useState('');

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHash = () => {
    try {
      const isHex = hashInput.startsWith('0x');
      const bytes = isHex ? 
        new Uint8Array(hashInput.slice(2).match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []) 
        : hashInput;
      setKeccakOut('0x' + keccak256(bytes as any));
    } catch {
      setKeccakOut('Error parsing input');
    }
  };

  const updateUnits = (val: string, from: 'wei' | 'gwei' | 'ether') => {
    try {
      if (val === '') { setWei(''); setGwei(''); setEther(''); return; }
      
      let weiVal = 0n;
      if (from === 'wei') weiVal = BigInt(val);
      if (from === 'gwei') {
        const parts = val.split('.');
        weiVal = BigInt(parts[0]) * 1000000000n + (parts[1] ? BigInt(parts[1].padEnd(9, '0').slice(0,9)) : 0n);
      }
      if (from === 'ether') {
        const parts = val.split('.');
        weiVal = BigInt(parts[0]) * 1000000000000000000n + (parts[1] ? BigInt(parts[1].padEnd(18, '0').slice(0,18)) : 0n);
      }

      setWei(weiVal.toString());
      setGwei((Number(weiVal) / 1e9).toLocaleString('fullwide', {useGrouping:false, maximumFractionDigits:9}));
      setEther((Number(weiVal) / 1e18).toLocaleString('fullwide', {useGrouping:false, maximumFractionDigits:18}));
    } catch {
      // Invalid input
    }
  };

  const checkAddress = () => {
    try {
      if (addrInput.startsWith('0x') && addrInput.length === 42) {
        setAddrType('EVM / Ethereum (EIP-55 format not strictly validated here, but length is 42)');
      } else {
        const decoded = bs58.decode(addrInput);
        if (decoded.length === 32 || decoded.length === 64 || addrInput.length >= 32) {
          setAddrType('Solana / Base58 Valid');
        } else {
          setAddrType('Unknown Base58');
        }
      }
    } catch {
      setAddrType('Invalid format');
    }
  };

  const handleEncode = () => {
    try {
      if (encFormat === 'utf8') {
        if (decFormat === 'base64') setEncOutput(btoa(encInput));
        if (decFormat === 'hex') setEncOutput(Array.from(new TextEncoder().encode(encInput)).map(b => b.toString(16).padStart(2, '0')).join(''));
      }
    } catch (e: any) {
      setEncOutput(e.message);
    }
  };

  return (
    <div className="space-y-6 bg-[#0a0e17] border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Web3 / Crypto</h2>
          <p className="text-slate-400">Keccak, Units, Encoders client-side.</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-medium">
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'hash', label: 'Keccak-256' },
          { id: 'unit', label: 'Wei Converter' },
          { id: 'sig', label: 'Address Validator' },
          { id: 'encode', label: 'Encoding' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="bg-slate-900/40 border-slate-800">
        {activeTab === 'hash' && (
          <div className="space-y-4">
            <Label>Input (Text or 0x Hex)</Label>
            <input type="text" className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={hashInput} onChange={e => setHashInput(e.target.value)} />
            <Button onClick={handleHash} className="bg-blue-600 hover:bg-blue-500">Hash Keccak-256</Button>
            {keccakOut && (
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg font-mono text-blue-400 break-all cursor-pointer" onClick={() => copyToClipboard(keccakOut)}>
                {keccakOut}
              </div>
            )}
          </div>
        )}

        {activeTab === 'unit' && (
          <div className="space-y-4">
            <Label>Wei</Label>
            <input type="number" className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={wei} onChange={e => { setWei(e.target.value); updateUnits(e.target.value, 'wei'); }} />
            <Label>Gwei</Label>
            <input type="number" step="any" className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={gwei} onChange={e => { setGwei(e.target.value); updateUnits(e.target.value, 'gwei'); }} />
            <Label>Ether / SOL</Label>
            <input type="number" step="any" className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={ether} onChange={e => { setEther(e.target.value); updateUnits(e.target.value, 'ether'); }} />
          </div>
        )}

        {activeTab === 'sig' && (
          <div className="space-y-4">
            <Label>Address (EVM / Solana)</Label>
            <input type="text" className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={addrInput} onChange={e => setAddrInput(e.target.value)} />
            <Button onClick={checkAddress} className="bg-blue-600 hover:bg-blue-500">Validate</Button>
            {addrType && (
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg font-mono text-blue-400">
                {addrType}
              </div>
            )}
          </div>
        )}

        {activeTab === 'encode' && (
          <div className="space-y-4">
            <Label>Text Input</Label>
            <textarea className="w-full h-32 bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300" value={encInput} onChange={e => setEncInput(e.target.value)} />
            <div className="flex gap-4">
              <Button onClick={handleEncode} className="bg-blue-600 hover:bg-blue-500">Encode to {decFormat}</Button>
              <select className="bg-slate-800 border-slate-700 text-slate-300 rounded px-2" value={decFormat} onChange={e => setDecFormat(e.target.value as any)}>
                <option value="hex">Hex</option>
                <option value="base64">Base64</option>
              </select>
            </div>
            {encOutput && (
              <textarea className="w-full h-32 bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-blue-400" value={encOutput} readOnly />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
