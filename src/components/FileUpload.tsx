import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { parseFile } from '../utils/fileParser';

interface FileUploadProps {
  onDataParsed: (data: any) => void;
}

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const data = await parseFile(file);
      onDataParsed(data);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please try again with a different file.');
    }
  }, [onDataParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-lg text-gray-600">
        {isDragActive
          ? "Drop your file here..."
          : "Drag & drop your file here, or click to select"}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Supported formats: CSV, Excel, PDF
      </p>
    </div>
  );
}