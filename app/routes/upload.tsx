import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, ScanText, ShieldCheck, Sparkles, Type, X } from "lucide-react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import LoadingSpinner from "~/components/LoadingSpinner";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Card from "~/components/ui/Card";
import UsageCostTable from "~/components/UsageCostTable";
import SiteFooter from "~/components/SiteFooter";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage, getPdfPageCount } from "~/lib/pdf2img";
import { useToastStore } from "~/lib/toast";
import { generateUUID } from "~/lib/utils";
import { buildMeta } from "~/lib/meta";
import { prepareInstructions } from "../../constants";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const MAX_RESUME_PAGES = 5;
const MIN_JOB_DESCRIPTION_CHARS = 80;
const MAX_JOB_DESCRIPTION_CHARS = 8000;
const ANALYSIS_COUNT_KEY = "resumatch-analysis-count";
const USAGE_ACKNOWLEDGED_KEY = "resumatch-usage-acknowledged";
const USAGE_REMINDER_SEEN_KEY = "resumatch-usage-reminder-seen";

export const meta = () =>
  buildMeta(
    "ResuMatch | Upload Resume",
    "Upload a resume and job description to generate ATS, keyword, content, structure, and interview feedback."
  );

const extractJsonText = (value: string) => {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1]?.trim() || trimmed;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain JSON.");
  }

  return source.slice(start, end + 1);
};

const isNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value);
const isString = (value: unknown) => typeof value === "string";
const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const toScore = (value: unknown, fallback = 0) => {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numberValue)));
};

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(isString)
    : isString(value)
      ? value.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

const getValue = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (source[key] !== undefined) return source[key];
  }
  return undefined;
};

const normalizeTipType = (type: unknown): "good" | "improve" => {
  if (!isString(type)) return "improve";
  const normalized = type.toLowerCase();
  if (["good", "strength", "positive", "pass"].includes(normalized)) return "good";
  return "improve";
};

const normalizeTips = (value: unknown, needsExplanation = false) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isObject)
    .map((item) => {
      const tip =
        getValue(item, ["tip", "title", "summary", "recommendation", "text"]);
      const explanation =
        getValue(item, ["explanation", "reason", "description", "detail"]);

      return {
        type: normalizeTipType(item.type),
        tip: isString(tip) ? tip : "Review this area for improvement.",
        ...(needsExplanation
          ? {
              explanation: isString(explanation)
                ? explanation
                : isString(tip)
                  ? tip
                  : "This area can be improved for stronger alignment.",
            }
          : {}),
      };
    });
};

const normalizeExplainedScoreSection = (
  value: unknown
) => {
  const section = isObject(value) ? value : {};
  const tips = normalizeTips(
    getValue(section, ["tips", "suggestions", "feedback", "items"]),
    true
  ).map((tip) => ({
    type: tip.type,
    tip: tip.tip,
    explanation: tip.explanation || "This area can be improved for stronger alignment.",
  }));

  return {
    score: toScore(section.score),
    tips,
  };
};

const normalizeAtsScoreSection = (
  value: unknown
) => {
  const section = isObject(value) ? value : {};
  const tips = normalizeTips(
    getValue(section, ["tips", "suggestions", "feedback", "items"]),
    false
  ).map((tip) => ({
    type: tip.type,
    tip: tip.tip,
  }));

  return {
    score: toScore(section.score),
    tips,
  };
};

const normalizeActionItems = (value: unknown): ActionItem[] => {
  if (!Array.isArray(value)) return [];

  const allowedCategories = ["ats", "keywords", "content", "structure", "tone", "skills"] as const;
  const allowedPriorities = ["critical", "important", "minor", "strength"] as const;
  const allowedEfforts = ["quick", "moderate", "deep"] as const;

  return value.filter(isObject).map((item, index) => {
    const title = getValue(item, ["title", "tip", "action", "recommendation"]);
    const category = isString(item.category) && allowedCategories.includes(item.category as ActionItem["category"])
      ? item.category as ActionItem["category"]
      : "content";
    const priority = isString(item.priority) && allowedPriorities.includes(item.priority as ActionItem["priority"])
      ? item.priority as ActionItem["priority"]
      : "important";
    const effort = isString(item.effort) && allowedEfforts.includes(item.effort as ActionItem["effort"])
      ? item.effort as ActionItem["effort"]
      : "quick";

    return {
      id: isString(item.id) ? item.id : `${category}-${index + 1}`,
      category,
      priority,
      effort,
      title: isString(title) ? title : "Improve this resume section",
      issue: isString(item.issue) ? item.issue : "This area needs attention.",
      recommendation: isString(item.recommendation) ? item.recommendation : "Revise this area to better match the target role.",
      reason: isString(item.reason) ? item.reason : "This can improve recruiter clarity and ATS alignment.",
      ...(isString(item.beforeText) ? { beforeText: item.beforeText } : {}),
      ...(isString(item.suggestedRewrite) ? { suggestedRewrite: item.suggestedRewrite } : {}),
      ...(Array.isArray(item.keywordsToAdd) ? { keywordsToAdd: toStringArray(item.keywordsToAdd) } : {}),
    };
  });
};

const normalizeFeedbackPayload = (value: unknown): Feedback => {
  if (!isObject(value)) {
    throw new Error("AI response JSON was not an object.");
  }

  const keywords = getValue(value, ["keywordAlignment", "keyword_alignment", "keywords"]);
  const keywordObject = isObject(keywords) ? keywords : {};
  const interview = getValue(value, ["interviewPrep", "interview_prep", "interview"]);
  const interviewObject = isObject(interview) ? interview : {};

  return {
    overallScore: toScore(getValue(value, ["overallScore", "overall_score", "overall"])),
    ATS: normalizeAtsScoreSection(getValue(value, ["ATS", "ats"])),
    toneAndStyle: normalizeExplainedScoreSection(getValue(value, ["toneAndStyle", "tone_and_style", "tone"])),
    content: normalizeExplainedScoreSection(value.content),
    structure: normalizeExplainedScoreSection(value.structure),
    skills: normalizeExplainedScoreSection(value.skills),
    keywordAlignment: {
      coverage: toScore(getValue(keywordObject, ["coverage", "score", "matchPercentage", "match_percentage"])),
      matched: toStringArray(getValue(keywordObject, ["matched", "matches", "present"])),
      missing: toStringArray(getValue(keywordObject, ["missing", "missingKeywords", "missing_keywords"])),
      extras: toStringArray(getValue(keywordObject, ["extras", "extra", "additional"])),
    },
    interviewPrep: {
      questions: Array.isArray(interviewObject.questions)
        ? interviewObject.questions.filter(isObject).map((item) => ({
            question: isString(item.question) ? item.question : "Tell me about your relevant experience for this role.",
            rationale: isString(item.rationale) ? item.rationale : "This helps assess role fit.",
            answerGuidance: isString(item.answerGuidance)
              ? item.answerGuidance
              : isString(item.answer_guidance)
                ? item.answer_guidance
                : "Answer with a concise example, your actions, and the result.",
          }))
        : [],
    },
    actionItems: normalizeActionItems(getValue(value, ["actionItems", "action_items", "actions"])),
  };
};

const isTipArray = (value: unknown, needsExplanation = false) =>
  Array.isArray(value) &&
  value.every((item) => (
    isObject(item) &&
    (item.type === "good" || item.type === "improve") &&
    isString(item.tip) &&
    (!needsExplanation || isString(item.explanation))
  ));

const isFeedbackPayload = (value: unknown): value is Feedback => {
  if (!isObject(value)) return false;
  const ats = value.ATS;
  const tone = value.toneAndStyle;
  const content = value.content;
  const structure = value.structure;
  const skills = value.skills;
  const keywords = value.keywordAlignment;
  const interview = value.interviewPrep;

  return (
    isNumber(value.overallScore) &&
    isObject(ats) &&
    isNumber(ats.score) &&
    isTipArray(ats.tips) &&
    isObject(tone) &&
    isNumber(tone.score) &&
    isTipArray(tone.tips, true) &&
    isObject(content) &&
    isNumber(content.score) &&
    isTipArray(content.tips, true) &&
    isObject(structure) &&
    isNumber(structure.score) &&
    isTipArray(structure.tips, true) &&
    isObject(skills) &&
    isNumber(skills.score) &&
    isTipArray(skills.tips, true) &&
    isObject(keywords) &&
    isNumber(keywords.coverage) &&
    Array.isArray(keywords.matched) &&
    Array.isArray(keywords.missing) &&
    Array.isArray(keywords.extras) &&
    isObject(interview) &&
    Array.isArray(interview.questions)
  );
};

const parseFeedbackPayload = (feedbackText: string): Feedback => {
  const parsed = JSON.parse(extractJsonText(feedbackText));
  const normalized = normalizeFeedbackPayload(parsed);

  if (!isFeedbackPayload(normalized)) {
    throw new Error("AI response JSON did not match the expected feedback shape.");
  }

  return normalized;
};

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobSource, setJobSource] = useState<"text" | "image">("text");
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [usageAcknowledged, setUsageAcknowledged] = useState(() => (
    typeof window !== "undefined" &&
    window.localStorage.getItem(USAGE_ACKNOWLEDGED_KEY) === "true"
  ));
  const [showUsageReminder, setShowUsageReminder] = useState(false);
  const [pendingResumeId, setPendingResumeId] = useState<string | null>(null);

  const progressSteps = [
    "Uploading resume",
    "Converting PDF to image",
    "Uploading resume preview",
    "Preparing job context",
    "Running AI analysis",
    "Finalizing dashboard",
  ];

  const completedStepCount = useMemo(() => {
    let count = 0;
    if (jobDescription.trim()) count += 1;
    if (file) count += 1;
    return count;
  }, [file, jobDescription]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  const acknowledgeUsage = (checked: boolean) => {
    setUsageAcknowledged(checked);
    if (checked) {
      window.localStorage.setItem(USAGE_ACKNOWLEDGED_KEY, "true");
    } else {
      window.localStorage.removeItem(USAGE_ACKNOWLEDGED_KEY);
    }
  };

  const recordCompletedAnalysis = () => {
    const currentCount = Number(window.localStorage.getItem(ANALYSIS_COUNT_KEY) || "0");
    const nextCount = Number.isFinite(currentCount) ? currentCount + 1 : 1;
    window.localStorage.setItem(ANALYSIS_COUNT_KEY, String(nextCount));
    return nextCount;
  };

  const continueToResume = () => {
    if (!pendingResumeId) return;
    window.localStorage.setItem(USAGE_REMINDER_SEEN_KEY, "true");
    setShowUsageReminder(false);
    navigate(`/resume/${pendingResumeId}`);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleJobImage = async (imageFile: File | null) => {
    setJobImage(imageFile);
    if (!imageFile) return;

    if (!ai?.img2txt) {
      addToast({
        type: "error",
        title: "Image extraction unavailable",
        description: "The image-to-text tool is not available right now.",
      });
      return;
    }

    setIsProcessing(true);
    setStatusText("Extracting text from image...");

    try {
      const text = await ai.img2txt(imageFile);
      if (text) {
        setJobDescription(text);
        setJobSource("text");
        setStatusText("Text extracted from image. Review below.");
        addToast({
          type: "success",
          title: "Text extracted",
          description: "Review and edit the extracted description before analysis.",
        });
      } else {
        setStatusText("No text extracted from image.");
        addToast({
          type: "error",
          title: "No text found",
          description: "Try a clearer image or paste the job description as text.",
        });
      }
    } catch (error) {
      setStatusText("Failed to extract text from image.");
      addToast({
        type: "error",
        title: "Extraction failed",
        description: "Could not read text from the uploaded image.",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription: currentJobDescription,
    file: currentFile,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      if (currentFile.size > MAX_RESUME_BYTES) {
        setStatusText("Resume file is too large.");
        addToast({
          type: "error",
          title: "File too large",
          description: "Upload a PDF under 10 MB for reliable browser processing.",
        });
        return;
      }

      if (currentJobDescription.trim().length < MIN_JOB_DESCRIPTION_CHARS) {
        setStatusText("Job description is too short.");
        addToast({
          type: "info",
          title: "Add more job context",
          description: "Use at least 80 characters so the AI can compare your resume against the role.",
        });
        return;
      }

      const boundedJobDescription = currentJobDescription.trim().slice(0, MAX_JOB_DESCRIPTION_CHARS);

      setStatusText("Checking resume length");
      const pageCount = await getPdfPageCount(currentFile);
      if (pageCount > MAX_RESUME_PAGES) {
        setStatusText("Resume has too many pages.");
        addToast({
          type: "error",
          title: "Resume too long",
          description: `Upload a resume with ${MAX_RESUME_PAGES} pages or fewer.`,
        });
        return;
      }

      setStatusText("Uploading resume");
      const uploadedFile = await fs.upload([currentFile]);
      if (!uploadedFile) {
        setStatusText("Failed to upload file.");
        addToast({ type: "error", title: "Upload failed", description: "Resume upload did not complete." });
        return;
      }

      setStatusText("Converting PDF to image");
      const imageFile = await convertPdfToImage(currentFile);
      if (!imageFile.file) {
        setStatusText("Failed to convert PDF to image.");
        addToast({ type: "error", title: "Conversion failed", description: "Could not convert resume PDF to image." });
        return;
      }

      setStatusText("Uploading resume preview");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        setStatusText("Failed to upload image.");
        addToast({ type: "error", title: "Image upload failed", description: "Could not upload converted resume preview image." });
        return;
      }

      setStatusText("Preparing job context");
      const uuid = generateUUID();
      const data: Omit<Resume, "feedback"> & { feedback: Feedback | "" } = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription: boundedJobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Running AI analysis");
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({
          jobTitle,
          jobDescription: boundedJobDescription,
          currentDate: new Date().toLocaleDateString("en-CA"),
        })
      );

      if (!feedback) {
        setStatusText("Failed to analyze resume.");
        addToast({ type: "error", title: "Analysis failed", description: "AI analysis did not return a valid result." });
        return;
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      data.feedback = parseFeedbackPayload(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Finalizing dashboard");
      addToast({ type: "success", title: "Analysis complete", description: "Opening your feedback dashboard." });
      const completedCount = recordCompletedAnalysis();
      const usageReminderSeen = window.localStorage.getItem(USAGE_REMINDER_SEEN_KEY) === "true";
      if (completedCount >= 3 && !usageReminderSeen) {
        setPendingResumeId(uuid);
        setShowUsageReminder(true);
        return;
      }
      navigate(`/resume/${uuid}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again in a moment.";
      setStatusText("Something went wrong during analysis.");
      addToast({
        type: "error",
        title: "Unexpected error",
        description: message,
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;

    if (!file) {
      addToast({
        type: "info",
        title: "Resume required",
        description: "Upload a resume PDF before starting analysis.",
      });
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      addToast({
        type: "error",
        title: "File too large",
        description: "Upload a PDF under 10 MB.",
      });
      return;
    }

    if (!jobDescription.trim()) {
      setStatusText("Please provide a job description via text or image.");
      addToast({
        type: "info",
        title: "Job description required",
        description: "Add job details using pasted text or an uploaded image before analysis.",
      });
      return;
    }

    if (jobDescription.trim().length < MIN_JOB_DESCRIPTION_CHARS) {
      setStatusText("Please add more detail to the job description.");
      addToast({
        type: "info",
        title: "More context needed",
        description: "Paste at least a short paragraph from the job post before analysis.",
      });
      return;
    }

    if (!usageAcknowledged) {
      addToast({
        type: "info",
        title: "Usage acknowledgement required",
        description: "Review and accept the AI and Puter usage disclaimer before analysis.",
      });
      return;
    }

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription: jobDescription.slice(0, MAX_JOB_DESCRIPTION_CHARS),
      file,
    });
  };

  if (isLoading || !auth.isAuthenticated) {
    return (
      <main className="app-shell">
        <Navbar />
        <section className="main-section">
          <Card className="w-full">
            <LoadingSpinner label="Preparing secure upload..." className="py-10" />
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Navbar />

      <section className="main-section">
        <div className="page-heading stagger-rise">
          <div className="hero-pill">
            <Sparkles className="h-4 w-4" />
            <span>Guided Analysis Flow</span>
          </div>

          <h1>
            Build stronger application with <span className="text-gradient">ResuMatch</span>.
          </h1>

          <p className="max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
            Get the role, upload your resume, and stop guessing why applications get ignored.
            Get a cleaner, smarter review with ATS insights and recruiter-style feedback that helps you improve fast.          
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="step-chip"><span className="dot">1</span> Job context</span>
            <span className="step-chip"><span className="dot">2</span> Resume upload</span>
            <span className="step-chip"><span className="dot">3</span> AI feedback</span>
          </div>

          {isProcessing ? (
            <Card className="w-full">
              <LoadingSpinner label={statusText} className="py-8" />
              <div className="mt-6 grid grid-cols-1 gap-2 text-left sm:grid-cols-2">
                {progressSteps.map((step, index) => {
                  const isActive = step === statusText;
                  const isCompleted = progressSteps.indexOf(statusText) > index;

                  return (
                    <div
                      key={step}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        isActive
                          ? "border-cyan-300 bg-cyan-50 text-cyan-900"
                          : isCompleted
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <div className="grid w-full gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="glass-panel premium-glass text-left">
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Analysis Flow</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Three steps to a <span className="text-gradient-highlight">sharper resume</span>  review</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[22px] border border-slate-200/70 bg-white/90 p-4">
                      <p className="text-sm font-semibold text-slate-950">Role context first</p>
                      <p className="mt-1 text-sm text-slate-600">Anchor the feedback to a specific job instead of reviewing blindly.</p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200/70 bg-white/90 p-4">
                      <p className="text-sm font-semibold text-slate-950">Professional upload state</p>
                      <p className="mt-1 text-sm text-slate-600">Use the resume preview pipeline to prepare your analysis dashboard.</p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200/70 bg-white/90 p-4">
                      <p className="text-sm font-semibold text-slate-950">Actionable output</p>
                      <p className="mt-1 text-sm text-slate-600">Get scores, priorities, and suggestions you can actually use.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel premium-glass text-left">
                <div className="flex h-full flex-col justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Readiness</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950"><span className="text-gradient-highlight">Complete</span> the flow as you go</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-[20px] border border-slate-200/70 bg-white/90 p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Job description added</p>
                        <p className="mt-1 text-sm text-slate-600">Paste text or upload an image to anchor your analysis.</p>
                      </div>
                      {jobDescription.trim() ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : <span className="text-sm font-semibold text-slate-400">Pending</span>}
                    </div>
                    <div className="flex items-center justify-between rounded-[20px] border border-slate-200/70 bg-white/90 p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Resume uploaded</p>
                        <p className="mt-1 text-sm text-slate-600">PDF upload with preview generation for analysis.</p>
                      </div>
                      {file ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : <span className="text-sm font-semibold text-slate-400">Pending</span>}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-teal-100 bg-teal-50/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Progress</p>
                    <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-950">{completedStepCount}/2 ready</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="glass-panel mt-2 flex w-full flex-col gap-6">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="space-y-4">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Flow overview</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-[18px] border border-slate-200/70 bg-slate-50/80 p-3">
                        <p className="text-sm font-semibold text-slate-950">1. Company + role</p>
                        <p className="mt-1 text-sm text-slate-600">Capture the hiring context.</p>
                      </div>
                      <div className="rounded-[18px] border border-slate-200/70 bg-slate-50/80 p-3">
                        <p className="text-sm font-semibold text-slate-950">2. Job description</p>
                        <p className="mt-1 text-sm text-slate-600">Choose the source that fits your workflow.</p>
                      </div>
                      <div className="rounded-[18px] border border-slate-200/70 bg-slate-50/80 p-3">
                        <p className="text-sm font-semibold text-slate-950">3. Resume upload</p>
                        <p className="mt-1 text-sm text-slate-600">Send the final PDF for scoring and suggestions.</p>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="space-y-6">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full text-xs">1</span>
                      Company + role details
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <Input type="text" id="company-name" name="company-name" placeholder="Enter company name" />
                      </div>
                      <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <Input type="text" id="job-title" name="job-title" placeholder="Enter job title" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full text-xs">2</span>
                      Job description source
                    </div>

                    <div className="form-div">
                      <label>Job Description</label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          { key: "text", label: "Paste text", icon: Type, description: "Best for clean editing and longer descriptions." },
                          { key: "image", label: "Upload image", icon: ScanText, description: "Extract text from a screenshot or photo." },
                        ].map(({ key, label, icon: Icon, description }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setJobSource(key as typeof jobSource)}
                            className={`rounded-[22px] border p-4 text-left transition ${
                              jobSource === key
                                ? "border-teal-200 bg-teal-50/70 shadow-[0_18px_40px_-34px_rgba(13,148,136,0.45)]"
                                : "border-slate-200/70 bg-white/90 hover:border-slate-300 hover:bg-white"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${jobSource === key ? "text-teal-700" : "text-slate-500"}`} />
                            <p className="mt-3 text-sm font-semibold text-slate-950">{label}</p>
                            <p className="mt-1 text-sm text-slate-600">{description}</p>
                          </button>
                        ))}
                      </div>

                      {jobSource === "text" && (
                        <Textarea
                          id="job-description"
                          name="job-description"
                          rows={8}
                          placeholder="Paste job description here..."
                          value={jobDescription}
                          onChange={(event) => setJobDescription(event.target.value)}
                          className="mt-4"
                        />
                      )}

                      {jobSource === "image" && (
                        <div className="mt-4 flex flex-col gap-3">
                          <label htmlFor="job-image" className="text-sm text-slate-700">Upload an image of the job description</label>
                          <Input
                            id="job-image"
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleJobImage(event.target.files?.[0] || null)}
                            className="cursor-pointer"
                          />

                          {jobImage && (
                            <p className="text-sm text-slate-600">Selected: {jobImage.name}</p>
                          )}
                          {jobDescription && (
                            <Textarea
                              rows={5}
                              value={jobDescription}
                              onChange={(event) => setJobDescription(event.target.value)}
                              placeholder="Extracted text will appear here for editing..."
                            />
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="dot inline-flex h-6 w-6 items-center justify-center rounded-full text-xs">3</span>
                      Upload resume + analyze
                    </div>

                    <div className="form-div">
                      <label htmlFor="uploader">Upload Your Resume</label>
                      <FileUploader
                        onFileSelect={handleFileSelect}
                        maxFileSize={MAX_RESUME_BYTES}
                        maxPages={MAX_RESUME_PAGES}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-slate-600">
                        We&apos;ll generate a preview, run the AI review, and open your dashboard automatically.
                      </p>
                      <Button type="submit" size="lg" className="w-full md:w-auto md:min-w-56">
                        Analyze Resume
                      </Button>
                    </div>

                    <div className="usage-acknowledgement mt-5">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={usageAcknowledged}
                          onChange={(event) => acknowledgeUsage(event.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-amber-300 text-teal-700"
                        />
                        <span className="text-sm leading-6 text-amber-950">
                          I understand that AI feedback may be incomplete or inaccurate, resume analysis may consume
                          resources from my connected Puter account (Free Plan: 0.25$ total), and I should review suggestions before using them
                          in real job applications.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {!isProcessing && (
            <Card className="w-full text-left">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] bg-teal-50 text-teal-700">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">AI and Usage Disclaimer</p>
                    <h2 className="text-2xl font-bold text-slate-950">Usage & Feedback Guidelines</h2>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  AI Analysis may consume
                  resources from your connected Puter account (Free Plan: 0.25$ total). Avoid uploading highly sensitive personal information,
                  and always review suggestions before using them in real applications. You can check your usage and balance here: <a href="https://puter.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Puter Dashboard</a>.
                </p>
                <UsageCostTable />
              </div>
            </Card>
          )}
        </div>
      </section>

      <SiteFooter />

      {showUsageReminder && (
        <div className="notice-modal" role="dialog" aria-modal="true" aria-label="AI usage reminder">
          <div className="notice-backdrop" />
          <div className="notice-dialog">
            <button
              type="button"
              className="notice-close-button"
              aria-label="Close usage reminder"
              onClick={continueToResume}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-teal-50 text-teal-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Usage reminder</p>
                <h2 className="text-2xl font-bold text-slate-950">You have analyzed several resumes</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
              <p>
                Each analysis uses AI resources from your connected Puter account. To stretch your free balance,
                review previous feedback before re-running similar resumes and keep job descriptions focused.
              </p>
              <p>
                These estimates are approximate and can change based on resume length, job description length,
                model pricing, and provider billing behavior.
              </p>
            </div>

            <div className="mt-5">
              <UsageCostTable />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="button" size="lg" onClick={continueToResume} className="min-w-44">
                Continue to feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Upload;
