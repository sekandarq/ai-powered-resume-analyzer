import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Eye, ShieldCheck, Sparkles, X } from "lucide-react";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useToastStore } from "~/lib/toast";
import Card from "~/components/ui/Card";
import Alert from "~/components/ui/Alert";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/lib/utils";
import UsageCostTable from "~/components/UsageCostTable";
import SiteFooter from "~/components/SiteFooter";
import { buildMeta } from "~/lib/meta";

const PRIVACY_NOTICE_ACCEPTED_KEY = "resumatch-privacy-notice-v2-accepted";

export const meta = () =>
  buildMeta(
    "ResuMatch | AI Resume Analyzer",
    "Analyze ATS readiness, keyword fit, resume structure, and interview signals in a polished AI-powered dashboard.",
    { path: "/" }
  );

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const addToast = useToastStore((state) => state.addToast);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const accepted = window.localStorage.getItem(PRIVACY_NOTICE_ACCEPTED_KEY);
    if (!accepted) {
      setShowPrivacyNotice(true);
    }
  }, []);

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
  const startAnalysisHref = auth.isAuthenticated ? "/upload" : "/auth?next=/upload";
  const acceptPrivacyNotice = () => {
    window.localStorage.setItem(PRIVACY_NOTICE_ACCEPTED_KEY, "true");
    setShowPrivacyNotice(false);
  };

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
            Turn every resume into a
            <span className="text-gradient">
              {' '}high-conversion profile.
            </span>
          </h1>

          <p className="max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
            Your resume might be <span className="font-bold text-red-500">costing you interviews</span> without you realizing it.
            Discover exactly what recruiters and ATS systems see, fix what is holding you back, and turn your <span className="font-bold text-green-600">application</span> into one that gets <span className="font-bold text-green-600">noticed</span>.          
          </p>
          <div className="grid w-full gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="glass-panel premium-glass text-left">
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Product Snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">One <span className="text-gradient-highlight">workspace</span> for role-targeted resume reviews</h2>
                  </div>
                  <span className="step-chip"><span className="dot">Live</span> AI-guided</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-slate-200/70 bg-white/92 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ATS Fit</p>
                    <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950">Instant</p>
                    <p className="mt-2 text-sm text-slate-600">Spot scanability, structure issues, and formatting risks.</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200/70 bg-white/92 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Keyword Match</p>
                    <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950">Role-based</p>
                    <p className="mt-2 text-sm text-slate-600">Compare your resume against the actual job context.</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200/70 bg-white/92 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Next Actions</p>
                    <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950">Focused</p>
                    <p className="mt-2 text-sm text-slate-600">Prioritize the highest-impact edits before you reapply.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-panel premium-glass text-left">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">What You Get</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">A more <span className="text-gradient-highlight">credible</span>, recruiter-ready resume loop</h2>
                </div>
                <div className="space-y-3">
                  <div className="rounded-[20px] border border-slate-200/70 bg-white/90 p-4">
                    <p className="text-sm font-semibold text-slate-950">Sharper scoring</p>
                    <p className="mt-1 text-sm text-slate-600">See overall quality and category-level performance in one glance.</p>
                  </div>
                  <div className="rounded-[20px] border border-slate-200/70 bg-white/90 p-4">
                    <p className="text-sm font-semibold text-slate-950">Cleaner iteration</p>
                    <p className="mt-1 text-sm text-slate-600">Move from generic edits to job-specific improvements.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

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

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/sample-analysis"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "min-w-60 gap-2 text-center shadow-[0_22px_42px_-20px_rgba(13,148,136,0.72)]"
                )}
              >
                <Eye className="h-4 w-4" />
                Browse sample analysis
              </Link>
              <Link
                to={startAnalysisHref}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-w-48 text-center")}
              >
                Start new analysis
              </Link>
              {resumes.length > 0 && (
                <Link
                  to={`/resume/${resumes[0].id}`}
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "min-w-48 text-center")}
                >
                  View latest analysis
                </Link>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600">
              Want to look around first? The sample analysis needs no login, upload, or AI usage.
            </p>
          </div>
        </div>

        <Card className="w-full stagger-rise delay-1">
          <div className="flex flex-col gap-4">
            <h3 className="text-left text-lg font-bold tracking-[-0.03em] text-slate-950">How it works</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="glass-panel text-left">
                <span className="step-chip"><span className="dot">1</span> Add Job Context</span>
                <p className="mt-3 text-sm text-slate-600">Paste text or upload a screenshot to anchor your analysis.</p>
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

        {!auth.isAuthenticated && !isLoading ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <ShieldCheck className="h-8 w-8 text-teal-700" />
            <div>
              <p className="text-xl font-semibold text-slate-950">Sign in to create and save analyses</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                You can browse the product publicly. Uploading resumes and saving feedback require an account.
              </p>
            </div>
            <div className="flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/sample-analysis" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full max-w-xs gap-2 text-center")}>
                <Eye className="h-4 w-4" />
                Browse sample analysis
              </Link>
              <Link to="/auth?next=/upload" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full max-w-xs text-center")}>
                Sign in to start
              </Link>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              The sample dashboard shows the full product experience without requiring a resume upload or account.
            </p>
          </Card>
        ) : loadingResumes ? (
          <Card className="w-full">
            <LoadingSpinner label="Loading your resume analyses..." className="py-10" />
          </Card>
        ) : showEmpty ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <p className="text-xl text-slate-700">
              No analyses yet. Upload your first resume to get tailored feedback.
            </p>
            <Link to="/upload" className={cn(buttonVariants({ variant: "primary", size: "lg", fullWidth: true }), "max-w-xs text-center")}>
              Upload now
            </Link>
          </Card>
        ) : (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />

      {showPrivacyNotice && (
        <div className="notice-modal" role="dialog" aria-modal="true" aria-label="Privacy and disclaimer notice">
          <div className="notice-backdrop" />
          <div className="notice-dialog">
            <button
              type="button"
              className="notice-close-button"
              aria-label="Close notice"
              onClick={acceptPrivacyNotice}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-teal-50 text-teal-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Before You Upload</p>
                <h2 className="text-2xl font-bold text-slate-950">Privacy and AI disclaimer</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
            <p>
              ResuMatch uses the resume and job details you provide to generate tailored feedback. Your files, job context, previews,
              and results are saved in your signed-in Puter workspace so you can revisit them later.
            </p>
            <p>
              The feedback is designed to guide and speed up your resume improvement process. Because it is AI-generated, some suggestions
              may need your review or adjustment before you use them in real applications.
            </p>
            <p>
              To protect your privacy, please avoid uploading highly sensitive information such as ID numbers, financial data, or medical records.
            </p>            
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-sm leading-6 text-amber-900">
              By continuing, you agree that your content may be processed through Puter and trusted AI services to generate your analysis.
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Estimated Puter usage</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Each analysis may consume resources from your connected Puter account. Actual cost depends on resume length,
                  job description length, and model pricing.
                </p>
              </div>
              <UsageCostTable />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2 text-center sm:min-w-56")}
                onClick={acceptPrivacyNotice}
              >
                <Eye className="h-4 w-4" />
                Browse homepage 
              </Link>
              <Link
                to="/auth?next=/upload"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "text-center sm:min-w-44")}
                onClick={acceptPrivacyNotice}
              >
                Accept and sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
