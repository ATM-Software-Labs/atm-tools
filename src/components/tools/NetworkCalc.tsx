import React, { useState } from 'react';
import { Card, Button, Label } from '../ui';
import { Network, ArrowLeft, Copy } from 'lucide-react';

export function NetworkCalc({ onBack }: { onBack: () => void }) {
  const [ipInput, setIpInput] = useState('192.168.1.0/24');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateSubnet = () => {
    try {
      setError('');
      const [ip, cidrStr] = ipInput.split('/');
      if (!ip || !cidrStr) throw new Error('Formato inválido. Use formato CIDR (ej: 192.168.1.0/24)');
      
      const cidr = parseInt(cidrStr, 10);
      if (cidr < 0 || cidr > 32) throw new Error('CIDR debe estar entre 0 y 32');

      const ipParts = ip.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(p => p < 0 || p > 255 || isNaN(p))) {
        throw new Error('IP inválida');
      }

      const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
      const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr));
      
      const networkNum = ipNum & maskNum;
      const broadcastNum = networkNum | ~maskNum;
      
      const numToIp = (num: number) => {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255
        ].join('.');
      };

      const usableHosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;
      const totalHosts = Math.pow(2, 32 - cidr);

      let firstHost = cidr >= 31 ? 'N/A' : numToIp(networkNum + 1);
      let lastHost = cidr >= 31 ? 'N/A' : numToIp(broadcastNum - 1);

      setResult({
        ip,
        mask: numToIp(maskNum),
        wildcard: numToIp(~maskNum),
        network: numToIp(networkNum),
        broadcast: numToIp(broadcastNum),
        usableHosts,
        totalHosts,
        firstHost,
        lastHost
      });
    } catch (e: any) {
      setResult(null);
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6 bg-[#0a0e17] border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Redes / SysAdmin</h2>
          <p className="text-slate-400">Calculadora CIDR y Subnet IPv4.</p>
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
        <div className="max-w-md space-y-4">
          <Label>Dirección IP / CIDR</Label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-[#0a0e17] border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500"
              value={ipInput}
              onChange={e => setIpInput(e.target.value)}
              placeholder="192.168.1.1/24"
              onKeyDown={(e) => e.key === 'Enter' && calculateSubnet()}
            />
            <Button onClick={calculateSubnet} className="bg-blue-600 hover:bg-blue-500 shrink-0">Calcular</Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        {result && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Network</span>
              <p className="font-mono text-lg text-white mt-1">{result.network}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Netmask</span>
              <p className="font-mono text-lg text-white mt-1">{result.mask}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Wildcard</span>
              <p className="font-mono text-lg text-white mt-1">{result.wildcard}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Broadcast</span>
              <p className="font-mono text-lg text-white mt-1">{result.broadcast}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">First Usable Host</span>
              <p className="font-mono text-lg text-blue-400 mt-1">{result.firstHost}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Last Usable Host</span>
              <p className="font-mono text-lg text-blue-400 mt-1">{result.lastHost}</p>
            </div>
            <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl sm:col-span-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Usable Hosts / Total</span>
              <p className="font-mono text-lg text-white mt-1">{result.usableHosts} / {result.totalHosts}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
