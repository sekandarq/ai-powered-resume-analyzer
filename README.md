# ResuMatch

ResuMatch is an AI-powered resume analysis web app that helps job seekers compare a resume against a target role. It reviews ATS readiness, keyword alignment, structure, content quality, tone, skills, and interview preparation signals in one focused dashboard.

The app is built as a portfolio-ready product demo with a no-login sample analysis path, plus an authenticated workflow for creating saved analyses, tracking edits, and comparing improved resume versions through Puter.

## Features

- Role-targeted resume analysis using a pasted or image-extracted job description.
- PDF upload with file size and page count validation.
- Resume preview generation from the uploaded PDF.
- AI feedback across ATS, tone, content, structure, skills, keyword alignment, and interview prep.
- Prioritized action plan with progress tracking in local storage.
- Resume evidence mapping that connects feedback to likely resume sections, snippets, pages, and confidence levels.
- Before/after rewrite workflow with suggested rewrites, alternate rewrite variants, copy actions, and applied-state tracking.
- Re-analysis flow for revised resumes using the same saved job context.
- Version comparison showing score deltas, category changes, resolved keyword gaps, and remaining missing keywords.
- Saved analysis dashboard for authenticated users.
- No-login sample analysis at `/sample-analysis` for quick portfolio demos, including comparison, evidence mapping, and rewrite examples.
- Privacy and usage notices before visitors upload sensitive documents.

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS 4
- Zustand
- Lucide React
- PDF.js
- Puter auth, file storage, KV storage, image-to-text, and AI chat
- Vercel React Router preset

## Demo Flow

For portfolio reviewers, start with:

```text
/sample-analysis
```

This route shows a realistic static analysis without requiring login, file upload, or AI usage.
It demonstrates the latest resume feedback experience, including:

- A version-to-version comparison summary.
- Evidence-backed action items.
- Suggested before/after rewrites.
- Keyword and ATS feedback.
- Interview preparation prompts.

For the full workflow:

1. Sign in with Puter.
2. Open `/upload`.
3. Add company and role details.
4. Paste the job description or upload a screenshot/image of it.
5. Upload a PDF resume.
6. Review the generated analysis dashboard.
7. Use evidence-backed action items and suggested rewrites to update your resume.
8. Re-analyze the updated PDF from the feedback dashboard.
9. Compare the revised analysis against the previous version.

## Feedback Dashboard

Each analysis includes:

- Overall, ATS, keyword, tone, content, structure, and skills scoring.
- A prioritized action plan sorted by impact and completion state.
- Evidence blocks that show where feedback likely came from in the resume.
- Suggested rewrites and rewrite variants for high-impact improvements.
- Keyword alignment against the target job description.
- Interview prep questions tailored to the role.
- A resume preview modal when the uploaded PDF preview is available.

When an analysis is created as a revision, the dashboard also shows a comparison against the previous version.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Quality Checks

Run TypeScript checks:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

## Privacy Notes

Uploaded resumes, generated previews, job descriptions, and feedback are stored in the signed-in user's Puter workspace. AI feedback may be incomplete or inaccurate, so suggestions should be reviewed before being used in real job applications.

Visitors should avoid uploading highly sensitive information such as national ID numbers, financial data, medical data, or private documents not intended for AI processing.

## Author

Built and deployed by Aliff Iskandar.

Connect on LinkedIn: [Mohamad Aliff Iskandar](https://www.linkedin.com/in/mohamad-aliff-iskandar/)
