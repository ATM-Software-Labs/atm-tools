import { PDFDocument, degrees } from 'pdf-lib';

export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
}

export async function splitPdf(file: File, pageRanges: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  const indicesToExtract = new Set<number>();
  
  // Parse ranges like "1-3, 5, 7-9"
  const parts = pageRanges.split(',').map(p => p.trim());
  for (const part of parts) {
    if (!part) continue;
    
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) {
            indicesToExtract.add(i - 1);
          }
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indicesToExtract.add(pageNum - 1);
      }
    }
  }
  
  const sortedIndices = Array.from(indicesToExtract).sort((a, b) => a - b);
  if (sortedIndices.length === 0) {
    throw new Error('No valid pages selected');
  }
  
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdf, sortedIndices);
  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });
  
  const newPdfBytes = await newPdf.save();
  return new Blob([newPdfBytes as any], { type: 'application/pdf' });
}

export async function rotatePdf(file: File, rotationDegrees: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  const pages = pdf.getPages();
  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotationDegrees));
  }
  
  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
