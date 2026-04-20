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
import LoadingSpinner from '~/components/LoadingSpinner'
import { useToastStore } from '~/lib/toast'
import Button from '~/components/ui/Button'
import Input from '~/components/ui/Input'
import Textarea from '~/components/ui/Textarea'
import Card from '~/components/ui/Card'
import Alert from '~/components/ui/Alert'

export const meta = () => ([
    { title: 'ResuMatch | Upload Resume' },
    { name: 'description', content: 'Upload your resume to get detailed feedback' },
])

const upload = () => {
  const { auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobSource, setJobSource] = useState<"text" | "image" | "link">("text");
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [jobLink, setJobLink] = useState("");
  const [jobLinkStatus, setJobLinkStatus] = useState<string>("");
  const [jobLinkError, setJobLinkError] = useState<string>("");

  const progressSteps = [
    "Uploading resume",
    "Converting PDF to image",
    "Uploading resume preview",
    "Preparing job context",
    "Running AI analysis",
    "Finalizing dashboard",
  ];

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const extractTextFromHtml = (html: string) => {
    // Try to pluck likely job description nodes, fallback to stripped text
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const selectors = [
      "#jobDescriptionText",
      "[data-testid='jobDescriptionText']",
      ".jobsearch-JobComponent",
      "article",
      ".jobDescriptionContent",
    ];
    for (const sel of selectors) {
      const el = doc.querySelector(sel);
      if (el) return el.textContent?.trim() || "";
    }
    return doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
  };

  const handleJobImage = async (imageFile: File | null) => {
    setJobImage(imageFile);
    if (!imageFile) return;
    if (!ai?.img2txt) {
      addToast({
        type: "error",
        title: "Image extraction unavailable",
        description: "The image-to-text tool is not available right now.",
      });
      return;
    }
    setIsProcessing(true);
    setStatusText("Extracting text from image...");
    try {
      const text = await ai.img2txt(imageFile);
      if (text) {
        setJobDescription(text);
        setJobSource("text"); // switch to text for review
        setStatusText("Text extracted from image. Review below.");
        addToast({
          type: "success",
          title: "Text extracted",
          description: "Review and edit the extracted description before analysis.",
        });
      } else {
        setStatusText("No text extracted from image.");
        addToast({
          type: "error",
          title: "No text found",
          description: "Try a clearer image or paste the job description as text.",
        });
      }
    } catch (err) {
      setStatusText("Failed to extract text from image.");
      addToast({
        type: "error",
        title: "Extraction failed",
        description: "Could not read text from the uploaded image.",
      });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJobLinkFetch = async () => {
    if (!jobLink) return;
    setJobLinkError("");
    setJobLinkStatus("Fetching job description from link...");
    try {
      const res = await fetch(jobLink);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const html = await res.text();
      const text = extractTextFromHtml(html);
      if (!text) {
        setJobLinkError("Could not parse job description from the link. Please paste it manually.");
        setJobLinkStatus("");
        addToast({
          type: "error",
          title: "Could not parse link",
          description: "Paste the job description manually if parsing is blocked.",
        });
        return;
      }
      setJobDescription(text);
      setJobSource("text");
      setJobLinkStatus("Job description loaded from link. Review below.");
      addToast({
        type: "success",
        title: "Job description loaded",
        description: "Review and edit the extracted text before analysis.",
      });
    } catch (err) {
      setJobLinkError("Failed to fetch job description (site may block direct fetch). Please paste it manually.");
      addToast({
        type: "error",
        title: "Fetch failed",
        description: "This site blocked direct fetch. Please paste the description manually.",
      });
      console.error(err);
    }
  };

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
    try {
      setIsProcessing(true);

      setStatusText('Uploading resume');
      const uploadedFile = await fs.upload([file]);
      if(!uploadedFile) {
        setStatusText('Failed to upload file.');
        addToast({ type: 'error', title: 'Upload failed', description: 'Resume upload did not complete.' });
        return;
      }

      setStatusText('Converting PDF to image');
      const imageFile = await convertPdfToImage(file);
      if(!imageFile.file) {
        setStatusText('Failed to convert PDF to image.');
        addToast({ type: 'error', title: 'Conversion failed', description: 'Could not convert resume PDF to image.' });
        return;
      }

      setStatusText('Uploading resume preview');
      const uploadedImage = await fs.upload([imageFile.file]);
      if(!uploadedImage) {
        setStatusText('Failed to upload image.');
        addToast({ type: 'error', title: 'Image upload failed', description: 'Could not upload converted resume preview image.' });
        return;
      }

      setStatusText('Preparing job context');
      const uuid = generateUUID();
      const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName, jobTitle, jobDescription,
          feedback: '',
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText('Running AI analysis');

      const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({ jobTitle, jobDescription })
      )
      if (!feedback) {
        setStatusText('Failed to analyze resume.');
        addToast({ type: 'error', title: 'Analysis failed', description: 'AI analysis did not return a valid result.' });
        return;
      }

      const feedbackText = typeof feedback.message.content === 'string'
          ? feedback.message.content
          : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Finalizing dashboard');
      addToast({ type: 'success', title: 'Analysis complete', description: 'Opening your feedback dashboard.' });
      console.log(data);
      navigate(`/resume/${uuid}`);
    } catch (err) {
      setStatusText('Something went wrong during analysis.');
      addToast({
        type: 'error',
        title: 'Unexpected error',
        description: 'Please try again in a moment.',
      });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if(!form) return;
      const formData = new FormData(form);

      const companyName = formData.get('company-name') as string;
      const jobTitle = formData.get('job-title') as string;
      const jobDescriptionValue = jobDescription;

      if(!file) return;
      if(!jobDescriptionValue) {
        setStatusText("Please provide a job description via text, image, or link.");
        addToast({
          type: 'info',
          title: 'Job description required',
          description: 'Add job details using text, image, or a link before analysis.',
        });
        return;
      }

      handleAnalyze({ companyName, jobTitle, jobDescription: jobDescriptionValue, file });
  }  

  return (
   <main className="app-shell">
    <Navbar />

    <section className="main-section">
        <div className='page-heading stagger-rise'>
            <div className="hero-pill">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>Guided Analysis Flow</span>
            </div>
            <h1>AI-Powered feedback to get the best out of your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">resumes!</span></h1>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="step-chip"><span className="dot">1</span> Job context</span>
              <span className="step-chip"><span className="dot">2</span> Resume upload</span>
              <span className="step-chip"><span className="dot">3</span> AI feedback</span>
            </div>
            {isProcessing ? (
              <Card className='w-full'>
                <LoadingSpinner label={statusText} className='py-8' />
                <div className="mt-6 grid grid-cols-1 gap-2 text-left sm:grid-cols-2">
                  {progressSteps.map((step, index) => {
                    const isActive = step === statusText;
                    const isCompleted = progressSteps.indexOf(statusText) > index;

                    return (
                      <div
                        key={step}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${
                          isActive
                            ? "border-cyan-300 bg-cyan-50 text-cyan-900"
                            : isCompleted
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        {step}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : (
              <h2>we review it, provide ATS score, and give improvement tips to land your dream job.</h2>
            )}

            {!isProcessing &&  (
              <form id='upload-form' onSubmit={handleSubmit} className='glass-panel mt-2 flex w-full flex-col gap-4'>
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 to-lime-300 text-xs text-slate-900">1</span>
                  Company + role details
                </div>

                <div className='form-div'>
                  <label htmlFor='company-name'>Company Name</label>
                  <Input type="text" id='company-name' name="company-name" placeholder='Enter Company Name' />

                </div>
                <div className='form-div'>
                  <label htmlFor='job-title'>Job Title</label>
                  <Input type="text" id='job-title' name="job-title" placeholder='Enter Job Title' />
                </div>

                <div className="mt-2 mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 to-lime-300 text-xs text-slate-900">2</span>
                  Job description source
                </div>

                <div className='form-div'>
                  <label>Job Description</label>
                  <div className="flex flex-wrap gap-2">
                    {["text", "image", "link"].map((src) => (
                      <Button
                        key={src}
                        type="button"
                        variant={jobSource === src ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setJobSource(src as typeof jobSource)}
                      >
                        {src === "text" ? "Paste text" : src === "image" ? "Upload image" : "Paste link"}
                      </Button>
                    ))}
                  </div>

                  {jobSource === "text" && (
                    <Textarea id="job-description" name="job-description" rows={6} placeholder='Paste Job Description here...' value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}/>
                  
                  )}

                  {jobSource === "image" && (
                    <div className="flex flex-col gap-3 mt-2">
                      <label htmlFor="job-image" className="text-sm text-gray-700">Upload an image of the job description</label>
                      <Input id="job-image" type="file" accept="image/*" onChange={(e) => handleJobImage(e.target.files?.[0] || null)}
                      className="cursor-pointer"/>

                      {jobImage && (
                        <p className="text-sm text-gray-600">Selected: {jobImage.name}</p>
                      )}
                      {jobDescription && (
                        <Textarea rows={4} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                        placeholder="Extracted text will appear here for editing..."/>
                      )}
                    </div>
                  )}

                  {jobSource === "link" && (
                    <div className="flex flex-col gap-3 mt-2">
                      <Input type="url" placeholder="https://example.com/job-posting" value={jobLink} onChange={(e) => setJobLink(e.target.value)} />
                      <Button type="button" onClick={handleJobLinkFetch}>
                        Fetch Job Description
                      </Button>
                      {jobLinkStatus && (
                        <Alert tone='success'>{jobLinkStatus}</Alert>
                      )}
                      {jobLinkError && (
                        <Alert tone='error'>{jobLinkError}</Alert>
                      )}

                      {jobDescription && (
                        <Textarea rows={4} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Fetched job description will appear here for editing..."/>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-2 mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 to-lime-300 text-xs text-slate-900">3</span>
                  Upload resume + analyze
                </div>

                <div className='form-div'>
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
