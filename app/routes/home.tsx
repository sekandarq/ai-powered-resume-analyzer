import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Sparkles } from "lucide-react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useToastStore } from "~/lib/toast";
import Card from "~/components/ui/Card";
import Alert from "~/components/ui/Alert";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/lib/utils";

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      if (isLoading || !auth.isAuthenticated) return;
      setLoadingResumes(true);
      setError(null);
      try {
        const items = await kv.list("resume:*", true);
        if (!items || !Array.isArray(items)) {
          setResumes([]);
          return;
        }
        const parsed: Resume[] = [];
        for (const entry of items) {
          const val = typeof entry === "string" ? entry : (entry as KVItem).value;
          if (!val) continue;
          try {
            const data = JSON.parse(val);
            parsed.push(data);
          } catch (err) {
            console.error("Failed to parse resume entry", err);
          }
        }
        // newest first if we have modified timestamp
        parsed.sort((a, b) => {
          const aTime = (a as any).updatedAt || 0;
          const bTime = (b as any).updatedAt || 0;
          return bTime - aTime;
        });
        setResumes(parsed);
      } catch (err) {
        console.error(err);
        setError("Failed to load your resumes. Please try again.");
        addToast({
          type: "error",
          title: "Could not load resumes",
          description: "Please refresh and try again.",
        });
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [isLoading, auth.isAuthenticated, kv, addToast]);

  const showEmpty = !loadingResumes && resumes.length === 0;

  return (
    <main className="app-shell">
      <Navbar/>

      <section className="main-section">
        <div className="page-heading stagger-rise">
          <div className="hero-pill">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Intelligence</span>
          </div>

          <h1>
            Welcome to ResuMatch,<br /> Turn your resume into a
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">
              {' '}high-conversion profile.
            </span>
          </h1>

          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            Analyze ATS readiness, keyword fit, and interview prep signals in one flow.
            Iterate faster with clear strengths, gaps, and next actions.
          </p>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="feature-stat stagger-rise delay-1">
              <p className="label">Saved Analyses</p>
              <p className="value">{resumes.length}</p>
            </div>
            <div className="feature-stat stagger-rise delay-2">
              <p className="label">Feedback Dimensions</p>
              <p className="value">6</p>
            </div>
            <div className="feature-stat stagger-rise delay-3">
              <p className="label">Best Use Case</p>
              <p className="value">Job-Specific Resume</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            {resumes.length > 0 && (
              <Link
                to={`/resume/${resumes[0].id}`}
                className={cn(buttonVariants({ variant: "secondary", size: "md" }), "max-w-xs text-center")}
              >
                View latest analysis
              </Link>
            )}
          </div>
        </div>

        <Card className="w-full stagger-rise delay-1">
          <div className="flex flex-col gap-4">
            <h3 className="text-left text-lg font-bold text-slate-900">How it works</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="glass-panel text-left">
                <span className="step-chip"><span className="dot">1</span> Add Job Context</span>
                <p className="mt-3 text-sm text-slate-600">Paste text, upload screenshot, or fetch from a link to anchor your analysis.</p>
              </div>
              <div className="glass-panel text-left">
                <span className="step-chip"><span className="dot">2</span> Upload Resume</span>
                <p className="mt-3 text-sm text-slate-600">We process your resume and evaluate ATS alignment, structure, and tone.</p>
              </div>
              <div className="glass-panel text-left">
                <span className="step-chip"><span className="dot">3</span> Improve Faster</span>
                <p className="mt-3 text-sm text-slate-600">Use targeted feedback and interview prep to iterate your next version with confidence.</p>
              </div>
            </div>
          </div>
        </Card>

        {error && (
          <Alert tone="error" className="w-full max-w-2xl justify-center text-center">
            {error}
          </Alert>
        )}

        {loadingResumes ? (
          <Card className="w-full">
            <LoadingSpinner label="Loading your resume analyses..." className="py-10" />
          </Card>
        ) : showEmpty ? (
          <Card className="flex flex-col items-center gap-4">
            <p className="text-xl text-gray-700 text-center">
              No analyses yet. Upload your first resume to get tailored feedback.
            </p>
            <Link to="/upload" className={cn(buttonVariants({ variant: "primary", size: "lg", fullWidth: true }), "max-w-xs text-center")}>
              Upload now
            </Link>
          </Card>
        ) : (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
