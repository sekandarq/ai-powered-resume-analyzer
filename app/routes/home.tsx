import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { Upload, FileText, Link as LinkIcon, Sparkles } from 'lucide-react';
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import React, { useEffect } from 'react'


export function meta({}: Route.MetaArgs) {
    const {isLoading, auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Analysis</span>
        </div>
        
        <h1>Welcome to ResuMatch,<br/>A Smart Resume Analyzer for <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]
          ">Your Dream Job!</span></h1>
        <h2>Unlock your career true potential with AI-powered insights</h2>
      </div>

    {resumes.length > 0 && (
      <div className="resumes-section ">
        {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
    ))}
      </div>

    )}
    </section>
  </main>
}
