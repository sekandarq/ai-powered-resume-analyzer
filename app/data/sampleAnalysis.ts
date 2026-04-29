export const SAMPLE_RESUME: Resume = {
  id: "sample-analysis",
  companyName: "Northstar Analytics",
  jobTitle: "Junior Frontend Developer",
  resumePath: "",
  imagePath: "",
  jobDescription:
    "Northstar Analytics is hiring a Junior Frontend Developer to build responsive React interfaces, collaborate with product and design, improve accessibility, consume REST APIs, and ship production-quality UI with TypeScript, Tailwind CSS, and modern testing practices.",
  feedback: {
    overallScore: 78,
    ATS: {
      score: 74,
      tips: [
        {
          type: "good",
          tip: "The resume uses clear section headings that most ATS systems can parse.",
        },
        {
          type: "improve",
          tip: "Add more role-specific frontend keywords such as accessibility, REST APIs, and TypeScript.",
        },
        {
          type: "improve",
          tip: "Keep formatting simple for project bullets and avoid dense multi-column content.",
        },
      ],
    },
    toneAndStyle: {
      score: 82,
      tips: [
        {
          type: "good",
          tip: "The tone is professional and appropriate for an entry-level developer role.",
          explanation:
            "The wording is confident without sounding inflated, which helps the candidate feel credible.",
        },
        {
          type: "improve",
          tip: "Make the summary more specific to frontend product work.",
          explanation:
            "The current summary is clear, but it would be stronger if it mentioned React, UI quality, and collaboration with design or product teams.",
        },
      ],
    },
    content: {
      score: 76,
      tips: [
        {
          type: "good",
          tip: "Project descriptions show practical experience building user-facing interfaces.",
          explanation:
            "The resume gives evidence of hands-on development through projects rather than relying only on coursework.",
        },
        {
          type: "improve",
          tip: "Add measurable outcomes to the strongest projects.",
          explanation:
            "Recruiters can evaluate impact faster when bullets include numbers such as load-time improvements, users supported, or feature completion results.",
        },
        {
          type: "improve",
          tip: "Connect each project more directly to the target role requirements.",
          explanation:
            "A few bullets mention general development work but do not explicitly show API integration, accessibility, or responsive UI decisions.",
        },
      ],
    },
    structure: {
      score: 80,
      tips: [
        {
          type: "good",
          tip: "The resume is easy to scan with a logical order of summary, skills, projects, and education.",
          explanation:
            "The layout supports quick recruiter review and keeps the most relevant information near the top.",
        },
        {
          type: "improve",
          tip: "Move the strongest frontend project above less relevant experience.",
          explanation:
            "Prioritizing the most role-aligned evidence will make the resume stronger in the first 10 seconds of review.",
        },
      ],
    },
    skills: {
      score: 79,
      tips: [
        {
          type: "good",
          tip: "The skills section includes modern frontend tools such as React, TypeScript, and Tailwind CSS.",
          explanation:
            "These tools align well with the target role and should remain easy to find.",
        },
        {
          type: "improve",
          tip: "Group skills by category for faster scanning.",
          explanation:
            "Separating languages, frameworks, tooling, and testing makes the section easier for recruiters and ATS systems to interpret.",
        },
      ],
    },
    keywordAlignment: {
      coverage: 72,
      matched: ["React", "TypeScript", "Tailwind CSS", "responsive UI", "Git"],
      missing: ["accessibility", "REST APIs", "component testing", "design collaboration"],
      extras: ["Python", "Firebase", "Figma"],
    },
    interviewPrep: {
      questions: [
        {
          question:
            "Tell me about a React project where you improved the user experience.",
          rationale:
            "The role needs someone who can explain product impact, not only technical implementation.",
          answerGuidance:
            "Use a project example, explain the original user problem, describe your UI or code changes, and end with the outcome.",
        },
        {
          question:
            "How do you make sure a frontend interface works well across devices?",
          rationale:
            "Responsive UI is one of the clearest requirements in the target job description.",
          answerGuidance:
            "Mention layout strategy, browser testing, responsive constraints, and how you handle edge cases on small screens.",
        },
        {
          question:
            "Describe a time you consumed data from an API in a frontend application.",
          rationale:
            "API integration is missing from the resume but likely important for the role.",
          answerGuidance:
            "Discuss request handling, loading and error states, data shape assumptions, and how the UI responds to failure.",
        },
      ],
    },
    actionItems: [
      {
        id: "sample-keywords-accessibility",
        category: "keywords",
        priority: "important",
        effort: "quick",
        title: "Add accessibility evidence naturally",
        issue:
          "The job description values accessible UI, but the resume does not clearly mention accessibility work.",
        recommendation:
          "Add a truthful bullet that mentions semantic HTML, keyboard navigation, ARIA usage, contrast checks, or accessible form states.",
        reason:
          "Accessibility keywords improve role alignment and show professional frontend judgment.",
        keywordsToAdd: ["accessibility", "semantic HTML", "keyboard navigation"],
      },
      {
        id: "sample-content-project-outcomes",
        category: "content",
        priority: "important",
        effort: "moderate",
        title: "Quantify the strongest frontend project",
        issue:
          "The project bullets describe what was built but do not show measurable value.",
        recommendation:
          "Add metrics such as reduced load time, improved Lighthouse score, number of screens built, or users tested.",
        reason:
          "Measured outcomes make project work feel more credible and recruiter-ready.",
        suggestedRewrite:
          "Built a responsive React dashboard with reusable TypeScript components, improving Lighthouse performance from 72 to 91 and reducing repeated UI code across 6 screens.",
      },
      {
        id: "sample-ats-formatting",
        category: "ats",
        priority: "minor",
        effort: "quick",
        title: "Simplify dense formatting in project bullets",
        issue:
          "Dense bullet formatting can make some ATS parsers less reliable.",
        recommendation:
          "Use straightforward bullet text with clear verbs, tools, and outcomes instead of compact symbol-heavy formatting.",
        reason:
          "Cleaner formatting improves both machine parsing and human scanning.",
      },
      {
        id: "sample-structure-priority",
        category: "structure",
        priority: "minor",
        effort: "quick",
        title: "Place the most relevant frontend project first",
        issue:
          "The strongest role-aligned work should appear before general technical projects.",
        recommendation:
          "Move the React dashboard or resume analyzer project to the top of the projects section.",
        reason:
          "Recruiters often scan from the top down, so ordering can materially affect first impression.",
      },
      {
        id: "sample-strength-modern-stack",
        category: "skills",
        priority: "strength",
        effort: "quick",
        title: "Keep the modern frontend stack visible",
        issue:
          "React, TypeScript, and Tailwind CSS are strong matches for the role.",
        recommendation:
          "Keep these tools near the beginning of the skills section and reinforce them in project bullets.",
        reason:
          "Repeated, truthful evidence helps both ATS matching and recruiter confidence.",
      },
    ],
  },
};
