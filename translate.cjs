const fs = require('fs');
const path = require('path');

const map = {
  'UniversalConverter.tsx': 'converter',
  'BackgroundRemover.tsx': 'bg-remover',
  'QuickEditor.tsx': 'editor',
  'PdfManager.tsx': 'pdf',
  'Scanner.tsx': 'scanner',
  'Magnifier.tsx': 'magnifier',
  'SignaturePad.tsx': 'signature',
  'PrivacyBlur.tsx': 'privacy',
  'TextReader.tsx': 'reader',
  'DataCrypto.tsx': 'crypto',
  'NetworkCalc.tsx': 'network',
  'JsonTools.tsx': 'json',
  'UuidGenerator.tsx': 'uuid',
  'EpochConverter.tsx': 'epoch',
  'Web3Tools.tsx': 'web3'
};

const dir = path.join(__dirname, 'src', 'components', 'tools');
for (const [file, id] of Object.entries(map)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Missing ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already done
  if (content.includes('useAppConfig')) continue;
  
  // Add imports
  content = content.replace(/(import React.*?;)/, `$1\nimport { useAppConfig } from '../../utils/useAppConfig';\nimport { i18n } from '../../utils/i18n';`);
  
  // Add hook inside component
  content = content.replace(/(export function [a-zA-Z]+\(.*?\)\s*\{)/, `$1\n  const { lang } = useAppConfig();\n  const dict = i18n[lang];\n`);
  
  // Replace Volver text
  content = content.replace(/>\s*Volver\s*</g, `>{lang === 'ES' ? 'Volver' : lang === 'CA' ? 'Tornar' : 'Back'}<`);
  
  // Replace main header. They are usually h1 or h2 with some text
  content = content.replace(/<h[12][^>]*>.*?<\/h[12]>/, (match) => {
    // preserve the classes
    const tagMatch = match.match(/<(h[12])[^>]*>/)[0];
    const closeTag = match.match(/<\/h[12]>/)[0];
    return `${tagMatch}{dict.tools['${id}'].name}${closeTag}`;
  });
  
  // Replace paragraph right after it
  // Usually <p className="text-slate-400">...</p>
  content = content.replace(/<p className="text-slate-[456]00[^"]*">.*?<\/p>/, (match) => {
    const tagMatch = match.match(/<p[^>]*>/)[0];
    return `${tagMatch}{dict.tools['${id}'].desc}</p>`;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
