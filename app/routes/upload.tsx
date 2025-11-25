import React, { type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import { useState } from 'react'
import { FlipButton } from 'components/ui/shadcn-io/flip-button'
import FileUploader from '~/components/FileUploader'
import { usePuterStore } from '~/lib/puter'
import { useNavigate } from 'react-router'
import { convertPdfToImage } from '~/lib/pdf2img'

const upload = () => {
  const { auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate(); // Placeholder for navigate function
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusTest, setStatusTest] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
    setIsProcessing(true);
    setStatusTest("Uploading your resume...");

    const uploadedFile = await fs.upload([file]);
    if(!uploadedFile) return setStatusTest("Error: Failed to upload file.");

    setStatusTest("Analyzing your resume...");
    const imageFile = await convertPdfToImage(file);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({companyName, jobTitle, jobDescription, file } );

  }  

  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
        <div className='page-heading'>
            <h1>AI-Powered feedback to get the best out of your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">resumes!</span></h1>
            {isProcessing ? (
              <>
                <h2>{statusTest}</h2>
                <img src="/images/resume-scan.gif" className="w-full" />
              </>
            ) : (
              <h2>we review it, provide ATS score, and give improvement tips to land your dream job.</h2>
            )}

            {!isProcessing &&  (
              <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
                <div className='form-div py-2'>
                  <label htmlFor='company-name'>Company Name</label>
                  <input type="text" id='company-name' name="company-name" placeholder='Enter Company Name' />

                </div>
                <div className='form-div py-2'>
                  <label htmlFor='job-title'>Job Title</label>
                  <input type="text" id='job-title' name="job-title" placeholder='Enter Job Title' />
                </div>

                <div className='form-div py-2'>
                  <label htmlFor='job-description'>Job Description</label>
                  <textarea id="job-description" name="job-description" rows={6} placeholder='Paste Job Description here...' ></textarea>
                </div>

                <div className='form-div py-2'>
                  <label htmlFor='uploader'>Upload Your Resume</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>

                <FlipButton frontText='Upload Your Resume' backText='Ready For Analysis..' from='top' className='w-full' type='submit'
                frontClassName='bg-linear-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] font-bold' backClassName='bg-linear-to-r from-[#d53369] via-[#daae51] to-[#d53369] font-bold'>
                  Analyze Resume
                </FlipButton>

              </form>

            )}
        </div>

    </section>
   </main>
  )
}

export default upload
