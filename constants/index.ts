export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 82,
        matched: ["JavaScript", "React", "TypeScript", "UI", "Testing"],
        missing: ["Webpack", "Accessibility"],
        extras: ["Next.js"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Walk me through how you optimized a React app for performance.",
            rationale: "Tests depth in frontend optimization for a large codebase.",
            answerGuidance:
              "Describe metrics, profiling steps, key changes (memoization, code splitting), and measurable impact.",
          },
        ],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 60,
        matched: ["Azure", "CI/CD", "Linux"],
        missing: ["Terraform", "Kubernetes", "Networking"],
        extras: ["Python"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Explain a time you improved cloud cost efficiency.",
            rationale: "Checks cost-awareness, a priority for the role.",
            answerGuidance:
              "Quantify savings, detail monitoring, right-sizing, and guardrails you put in place.",
          },
        ],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 73,
        matched: ["Swift", "iOS", "UIKit", "MVVM"],
        missing: ["SwiftUI", "Combine"],
        extras: ["GraphQL"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Describe a complex gesture or animation you implemented.",
            rationale: "Assesses UIKit/iOS craftsmanship.",
            answerGuidance:
              "Cover user need, architecture, performance considerations, and testing.",
          },
        ],
      },
    },
  },
    {
    id: "4",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 82,
        matched: ["JavaScript", "React", "TypeScript", "UI", "Testing"],
        missing: ["Webpack", "Accessibility"],
        extras: ["Next.js"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Walk me through how you optimized a React app for performance.",
            rationale: "Tests depth in frontend optimization for a large codebase.",
            answerGuidance:
              "Describe metrics, profiling steps, key changes (memoization, code splitting), and measurable impact.",
          },
        ],
      },
    },
  },
  {
    id: "5",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 60,
        matched: ["Azure", "CI/CD", "Linux"],
        missing: ["Terraform", "Kubernetes", "Networking"],
        extras: ["Python"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Explain a time you improved cloud cost efficiency.",
            rationale: "Checks cost-awareness, a priority for the role.",
            answerGuidance:
              "Quantify savings, detail monitoring, right-sizing, and guardrails you put in place.",
          },
        ],
      },
    },
  },
  {
    id: "6",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
      keywordAlignment: {
        coverage: 73,
        matched: ["Swift", "iOS", "UIKit", "MVVM"],
        missing: ["SwiftUI", "Combine"],
        extras: ["GraphQL"],
      },
      interviewPrep: {
        questions: [
          {
            question: "Describe a complex gesture or animation you implemented.",
            rationale: "Assesses UIKit/iOS craftsmanship.",
            answerGuidance:
              "Cover user need, architecture, performance considerations, and testing.",
          },
        ],
      },
    },
  },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };

      keywordAlignment: {
        coverage: number; //0-100 percentage of critical job keywords present in the resume
        matched: string[]; //keywords detected in the resume
        missing: string[]; //high-priority keywords from the job description not present
        extras: string[]; //keywords in the resume that are not in the job description but relevant
      };

      interviewPrep: {
        questions: {
          question: string; //concise interview question
          rationale: string; //why this is asked for this role
          answerGuidance: string; //practical guidance to craft a strong answer
        }[]; //provide 4-6 questions
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  If the job description is not in English, translate it to English before analysis.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Identify critical job keywords from the job description, check if they exist in the resume, and report coverage plus matched/missing/extras lists.
  Provide 4-6 interview preparation questions tailored to this role with rationale and guidance on how to answer.
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;

