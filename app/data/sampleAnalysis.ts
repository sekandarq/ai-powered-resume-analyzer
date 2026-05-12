const SAMPLE_PREVIOUS_CREATED_AT = 1761609600000;
const SAMPLE_CURRENT_CREATED_AT = 1762214400000;

export const SAMPLE_PREVIOUS_RESUME: Resume = {
  id: "sample-analysis-v1",
  companyName: "Northstar Analytics",
  jobTitle: "Junior Frontend Developer",
  resumePath: "",
  imagePath: "",
  jobDescription:
    "Northstar Analytics is hiring a Junior Frontend Developer to build responsive React interfaces, collaborate with product and design, improve accessibility, consume REST APIs, and ship production-quality UI with TypeScript, Tailwind CSS, and modern testing practices.",
  createdAt: SAMPLE_PREVIOUS_CREATED_AT,
  updatedAt: SAMPLE_PREVIOUS_CREATED_AT,
  version: 1,
  feedback: {
    overallScore: 68,
    ATS: {
      score: 63,
      tips: [
        {
          type: "good",
          tip: "The resume uses recognizable headings such as Skills, Projects, and Education.",
        },
        {
          type: "improve",
          tip: "Add role-specific frontend keywords such as accessibility, REST APIs, and component testing.",
        },
        {
          type: "improve",
          tip: "Simplify dense project formatting so ATS parsers can read bullets more reliably.",
        },
      ],
    },
    toneAndStyle: {
      score: 73,
      tips: [
        {
          type: "good",
          tip: "The resume sounds professional and clear.",
          explanation: "The tone is appropriate for an entry-level developer role.",
        },
        {
          type: "improve",
          tip: "Make the summary more specific to frontend product work.",
          explanation: "The summary is broad and does not yet emphasize React, UI quality, or collaboration.",
        },
      ],
    },
    content: {
      score: 66,
      tips: [
        {
          type: "good",
          tip: "Project entries show hands-on development experience.",
          explanation: "The resume includes practical projects instead of relying only on coursework.",
        },
        {
          type: "improve",
          tip: "Add measurable outcomes to project bullets.",
          explanation: "The strongest projects describe tasks but do not show impact or scale.",
        },
      ],
    },
    structure: {
      score: 70,
      tips: [
        {
          type: "good",
          tip: "The resume follows a conventional section order.",
          explanation: "Recruiters can quickly find summary, skills, projects, and education.",
        },
        {
          type: "improve",
          tip: "Move the most relevant frontend project higher.",
          explanation: "The first project should carry the strongest evidence for the target role.",
        },
      ],
    },
    skills: {
      score: 69,
      tips: [
        {
          type: "good",
          tip: "The skills section includes React and Tailwind CSS.",
          explanation: "These tools are relevant to the target job.",
        },
        {
          type: "improve",
          tip: "Group skills by category and add testing/accessibility tools.",
          explanation: "A categorized skills section would make role alignment easier to scan.",
        },
      ],
    },
    keywordAlignment: {
      coverage: 54,
      matched: ["React", "Tailwind CSS", "responsive UI", "Git"],
      missing: ["TypeScript", "accessibility", "REST APIs", "component testing", "design collaboration"],
      extras: ["Python", "Firebase"],
    },
    interviewPrep: {
      questions: [
        {
          question: "Tell me about a frontend project you built with React.",
          rationale: "The role requires hands-on React experience.",
          answerGuidance: "Explain the user problem, the components you built, and what improved.",
        },
      ],
    },
    actionItems: [
      {
        id: "sample-v1-keywords-accessibility",
        category: "keywords",
        priority: "critical",
        effort: "quick",
        title: "Add accessibility evidence naturally",
        issue: "The role values accessible UI, but the resume does not mention accessibility.",
        recommendation: "Add truthful evidence about semantic HTML, keyboard navigation, ARIA usage, or contrast checks.",
        reason: "Accessibility is a high-signal frontend keyword for this role.",
        keywordsToAdd: ["accessibility", "semantic HTML"],
      },
    ],
  },
};

export const SAMPLE_RESUME: Resume = {
  id: "sample-analysis",
  companyName: "Northstar Analytics",
  jobTitle: "Junior Frontend Developer",
  resumePath: "",
  imagePath: "",
  createdAt: SAMPLE_CURRENT_CREATED_AT,
  updatedAt: SAMPLE_CURRENT_CREATED_AT,
  revisionOf: SAMPLE_PREVIOUS_RESUME.id,
  previousAnalysisId: SAMPLE_PREVIOUS_RESUME.id,
  version: 2,
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
        evidence: {
          section: "Projects",
          originalText:
            "Built responsive pages with React and Tailwind CSS for a student dashboard.",
          page: 1,
          confidence: "medium",
          explanation:
            "This project bullet is the best place to add truthful accessibility evidence because it already describes UI implementation.",
        },
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
        beforeText:
          "Built a responsive React dashboard with reusable components.",
        suggestedRewrite:
          "Built a responsive React dashboard with reusable TypeScript components, improving Lighthouse performance from 72 to 91 and reducing repeated UI code across 6 screens.",
        rewriteVariants: [
          {
            tone: "concise",
            text:
              "Built a responsive React dashboard with reusable TypeScript components across 6 screens.",
          },
          {
            tone: "ats",
            text:
              "Developed a responsive React and TypeScript dashboard using reusable components, Tailwind CSS, and accessibility-minded UI patterns.",
          },
        ],
        evidence: {
          section: "Projects",
          originalText:
            "Built a responsive React dashboard with reusable components.",
          page: 1,
          confidence: "high",
          explanation:
            "The original bullet is clear but does not yet show measurable impact or enough target-role keywords.",
        },
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
        evidence: {
          section: "Projects",
          originalText:
            "React dashboard | Tailwind | Firebase | UI components",
          page: 1,
          confidence: "medium",
          explanation:
            "Compact symbol-heavy formatting can be harder for some ATS systems to interpret than normal bullet sentences.",
        },
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
        evidence: {
          section: "Projects",
          page: 1,
          confidence: "low",
          explanation:
            "The strongest frontend project appears to be present, but exact ordering should be checked in the resume editor.",
        },
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
