import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Sparkles } from "lucide-react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
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
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [isLoading, auth.isAuthenticated, kv]);

  const showEmpty = !loadingResumes && resumes.length === 0;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar/>

      <section className="main-section">
        <div className="page-heading">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>

          <h1>
            Welcome to ResuMatch,<br /> A Smart Resume Analyzer for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">
              Your Dream Job!
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            {resumes.length > 0 && (
              <Link to={`/resume/${resumes[0].id}`} className="back-button w-fit max-w-xs text-center">
                View latest analysis
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
            {error}
          </div>
        )}

        {loadingResumes ? (
          <div className="resumes-section">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="resume-card animate-pulse bg-gray-100 border border-gray-200"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-64 bg-gray-200 rounded-2xl mt-4" />
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center gap-4 bg-white/70 rounded-2xl p-8 shadow">
            <p className="text-xl text-gray-700 text-center">
              No analyses yet. Upload your first resume to get tailored feedback.
            </p>
            <Link to="/upload" className="primary-button max-w-xs text-center">
              Upload now
            </Link>
          </div>
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
