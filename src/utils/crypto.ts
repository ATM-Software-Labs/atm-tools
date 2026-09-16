export async function calculateHash(fileOrString: File | string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
  let buffer: BufferSource;
  
  if (typeof fileOrString === 'string') {
    const encoder = new TextEncoder();
    buffer = encoder.encode(fileOrString);
  } else {
    buffer = await fileOrString.arrayBuffer();
  }
  
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch (e) {
    return '';
  }
}

export function decodeBase64(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch (e) {
    return '';
  }
}

export function encodeFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function jsonToCsv(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data) || data.length === 0) return '';
    
    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const stringVal = val === null || val === undefined ? '' : String(val);
        // Escape quotes and wrap in quotes if there's a comma
        if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  } catch (e) {
    throw new Error('Invalid JSON input for CSV conversion');
  }
}

export function csvToJson(csvString: string): string {
  try {
    if (!csvString.trim()) return '[]';
    
    // A simple CSV parser (doesn't handle all edge cases but works for standard CSVs)
    const lines = csvString.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return '[]';
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length || values.length > 0) {
         const obj: Record<string, any> = {};
         for (let j = 0; j < headers.length; j++) {
           obj[headers[j]] = values[j] || '';
         }
         result.push(obj);
      }
    }
    
    return JSON.stringify(result, null, 2);
  } catch (e) {
    throw new Error('Invalid CSV input for JSON conversion');
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
