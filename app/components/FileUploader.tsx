import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatSize} from '~/lib/utils'
import { FileText, UploadCloud, X } from "lucide-react";
 
interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
    maxFileSize?: number;
    maxPages?: number;
}

const FileUploader = ({onFileSelect, maxFileSize = 10 * 1024 * 1024, maxPages = 5}: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0] || null;

    onFileSelect?.(file);
  }, [onFileSelect]);

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    onDrop,
    multiple: false,
    accept: {'application/pdf': ['.pdf']},
    maxSize: maxFileSize,
})

const file = acceptedFiles[0] || null;
  
  return (
    <div className="w-full gradient-border">
        <div {...getRootProps()} className={`uplader-drag-area ${isDragActive ? "scale-[1.01] border-teal-400 bg-teal-50/80 shadow-[0_20px_50px_-32px_rgba(20,184,166,0.45)]" : "shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]"}`}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
                {file ? (
                    <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <FileText className="h-6 w-6" />
                        </div>
                    <div className='flex-row items-center space-x-3'>
                        <div>
                            <p className='text-sm font-medium text-gray-900 truncate max-w-xs'> 
                                {file.name} 
                            </p>
                            <p className='text-sm text-gray-500'>
                            {formatSize(file.size)}
                            </p>
                        </div>
                    </div>
                    <button className='rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer' onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect?.(null)
                    }}>
                        <X className='h-4 w-4' />
                    </button>

                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/90 text-teal-700 shadow-[0_18px_34px_-24px_rgba(15,23,42,0.4)]'>
                            <UploadCloud className='h-8 w-8'></UploadCloud>
                        </div>
                        <p className='text-lg font-medium text-slate-700'>
                            <span className='font-semibold text-slate-950'>
                                Drop your resume here
                            </span> or drag and drop your files
                        </p>
                        <p className='text-sm text-slate-500'>PDF only, up to {formatSize(maxFileSize)} and {maxPages} pages</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default FileUploader
