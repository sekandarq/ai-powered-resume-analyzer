interface Resume {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    resumePath: string;
    jobDescription?: string;
    feedback: Feedback;
    createdAt?: number;
    updatedAt?: number;
    revisionOf?: string;
    previousAnalysisId?: string;
    version?: number;
}

interface ResumeEvidence {
    section?: string;
    originalText?: string;
    page?: number;
    confidence: "high" | "medium" | "low";
    explanation?: string;
}

interface RewriteVariant {
    tone: "concise" | "impact" | "ats";
    text: string;
}

interface RewriteProgress {
    selectedRewrite?: string;
    copiedAt?: number;
    appliedAt?: number;
}

interface ActionItem {
    id: string;
    category: "ats" | "keywords" | "content" | "structure" | "tone" | "skills";
    priority: "critical" | "important" | "minor" | "strength";
    effort: "quick" | "moderate" | "deep";
    title: string;
    issue: string;
    recommendation: string;
    reason: string;
    beforeText?: string;
    suggestedRewrite?: string;
    rewriteVariants?: RewriteVariant[];
    keywordsToAdd?: string[];
    evidence?: ResumeEvidence;
}

interface Feedback {
    overallScore: number; // max 100
    ATS: {
        score: number;
        tips: { type: "good" | "improve"; 
            tip: string; 
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: { type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: { type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: { type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: { type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };

    keywordAlignment: {
        coverage: number; // percent of priority keywords matched
        matched: string[];
        missing: string[];
        extras: string[];
    };

    interviewPrep: {
        questions: {
            question: string;
            rationale: string;
            answerGuidance: string;
        }[];
    };

    actionItems?: ActionItem[];
}
