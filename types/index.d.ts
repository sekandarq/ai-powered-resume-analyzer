interface Resume {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
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
}
