import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ResumePageNavbar from "~/components/ResumePageNavbar";
import Summary from "~/components/feedback/Summary";
import ATS from "~/components/feedback/ATS";
import Details from "~/components/feedback/Details";
import KeywordAlignment from "~/components/feedback/KeywordAlignment";
import InterviewPrep from "~/components/feedback/InterviewPrep";


export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [jobInfo, setJobInfo] = useState<{title: string; description: string; company: string}>({
        title: '',
        description: '',
        company: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);


    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);
            setJobInfo({
                title: data.jobTitle || '',
                description: data.jobDescription || '',
                company: data.companyName || ''
            });

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <ResumePageNavbar />
        <section className="main-section">
        <div className='flex flex-col items-center mt-3'>
            <h1>Resume<span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]"> Feedback</span></h1>
        </div>
        
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section bg-cover h-350 sticky top-0 items-center justify-center">
                {imageUrl && resumeUrl && (
                    <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                title="resume"
                            />
                        </a>
                    </div>
                )}
            </section>  
            <section className="feedback-section">
                {feedback ? (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                        <Summary feedback={feedback}/>
                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                        {feedback.keywordAlignment && (
                            <KeywordAlignment
                                jobTitle={jobInfo.title}
                                jobDescription={jobInfo.description}
                                data={feedback.keywordAlignment}
                            />
                        )}
                        <Details feedback={feedback}/>
                        {feedback.interviewPrep && (
                            <InterviewPrep questions={feedback.interviewPrep.questions || []}/>
                        )}
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" className="w-full"/>
                )}
            </section>  
        </div>
        </section>
    </main>
    )
}
export default Resume
