import React, { type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import { useState } from 'react'
import { FlipButton } from 'components/ui/shadcn-io/flip-button'
import FileUploader from '~/components/FileUploader'
import { usePuterStore } from '~/lib/puter'
import { useNavigate } from 'react-router'
import { convertPdfToImage } from '~/lib/pdf2img'
import { generateUUID } from '~/lib/utils'
import { prepareInstructions } from '../../constants'


const upload = () => {
  const { auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
      setIsProcessing(true);

      setStatusText('Uploading the file...');
      const uploadedFile = await fs.upload([file]);
      if(!uploadedFile) return setStatusText('Error: Failed to upload file');

      setStatusText('Converting to image...');
      const imageFile = await convertPdfToImage(file);
      if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

      setStatusText('Uploading the image...');
      const uploadedImage = await fs.upload([imageFile.file]);
      if(!uploadedImage) return setStatusText('Error: Failed to upload image');

      setStatusText('Preparing data...');
      const uuid = generateUUID();
      const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName, jobTitle, jobDescription,
          feedback: '',
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText('Analyzing...');

      const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({ jobTitle, jobDescription })
      )
      if (!feedback) return setStatusText('Error: Failed to analyze resume');

      const feedbackText = typeof feedback.message.content === 'string'
          ? feedback.message.content
          : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis complete, redirecting...');
      console.log(data);
      navigate(`/resume/${uuid}`);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if(!form) return;
      const formData = new FormData(form);

      const companyName = formData.get('company-name') as string;
      const jobTitle = formData.get('job-title') as string;
      const jobDescription = formData.get('job-description') as string;

      if(!file) return;

      handleAnalyze({ companyName, jobTitle, jobDescription, file });
  }  

  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
        <div className='page-heading'>
            <h1>AI-Powered feedback to get the best out of your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">resumes!</span></h1>
            {isProcessing ? (
              <>
                <h2>{statusText}</h2>
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
