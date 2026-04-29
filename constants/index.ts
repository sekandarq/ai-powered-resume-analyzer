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
        }[]; //provide 3-4 questions
      };

      actionItems: {
        id: string; //stable kebab-case identifier
        category: "ats" | "keywords" | "content" | "structure" | "tone" | "skills";
        priority: "critical" | "important" | "minor" | "strength";
        effort: "quick" | "moderate" | "deep";
        title: string; //short action title
        issue: string; //what is wrong or what is already strong
        recommendation: string; //specific next step
        reason: string; //why this matters for ATS or recruiters
        beforeText?: string; //exact weak resume text if identifiable
        suggestedRewrite?: string; //improved bullet or sentence if useful
        keywordsToAdd?: string[]; //only for keyword-related actions
      }[]; //provide 6-10 checklist-ready items, sorted by impact
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  currentDate,
}: {
  jobTitle: string;
  jobDescription: string;
  currentDate: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  If the job description is not in English, translate it to English before analysis.
  Today's date is ${currentDate}. Use this exact date when judging whether resume dates are past, current, future, or outdated.
  Do not claim dates are future, fabricated, outdated, or unrealistic unless they are after ${currentDate} or conflict with the resume's own timeline.
  If a project or role ended before ${currentDate}, treat it as a past completed item, not a future item.
  If a project appears ongoing, recommend using "Present" only when the resume text supports that it is still active.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Identify critical job keywords from the job description, check if they exist in the resume, and report coverage plus matched/missing/extras lists.
  Create checklist-ready actionItems with priority, effort, category, issue, recommendation, and reason.
  For weak resume bullets, include beforeText and suggestedRewrite when you can identify the original text confidently.
  Suggested rewrites must be truthful, specific, concise, and avoid inventing metrics that are not supported by the resume.
  For missing keywords, explain how to add them naturally and include keywordsToAdd.
  Provide 3-4 interview preparation questions tailored to this role with rationale and guidance on how to answer.
  Provide the feedback using the following format: ${AIResponseFormat}
  Use the exact property names shown in the format, including overallScore, toneAndStyle, keywordAlignment, interviewPrep, answerGuidance, and actionItems.
  Use numeric values only for scores and coverage. Do not use strings for numbers.
  Every tip in toneAndStyle, content, structure, and skills must include both tip and explanation.
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;
