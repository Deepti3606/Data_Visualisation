import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { FileData } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function parseFile(file: File): Promise<FileData> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCsv(file);
    case 'xlsx':
      return parseExcel(file);
    case 'pdf':
      return parsePdf(file);
    default:
      throw new Error('Unsupported file format');
  }
}

function parseCsv(file: File): Promise<FileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          data: results.data as any[]
        });
      },
      error: (error) => reject(error)
    });
  });
}

function parseExcel(file: File): Promise<FileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const headers = Object.keys(jsonData[0]);
        
        resolve({
          headers,
          data: jsonData as any[]
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

async function parsePdf(file: File): Promise<FileData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  
  // Simple table extraction (assumes first line contains headers)
  const lines = textContent.items
    .map((item: any) => item.str)
    .filter((str: string) => str.trim());
  
  const headers = lines[0].split(/\s+/);
  const data = lines.slice(1).map(line => {
    const values = line.split(/\s+/);
    return headers.reduce((obj: any, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });

  return { headers, data };
}