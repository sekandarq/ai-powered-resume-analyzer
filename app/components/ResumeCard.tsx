import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const getImprovements = (feedback: Feedback) => {
  const tips = [
    ...(feedback.toneAndStyle?.tips || []),
    ...(feedback.content?.tips || []),
    ...(feedback.structure?.tips || []),
    ...(feedback.skills?.tips || []),
    ...(feedback.ATS?.tips || []),
  ].filter((t) => t.type === "improve");

  return tips.slice(0, 3).map((t) => t.tip);
};

const truncate = (text: string, limit = 180) =>
  text.length > limit ? text.slice(0, limit).trimEnd() + "..." : text;

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, jobDescription = "" },
}: {
  resume: Resume;
}) => {
  const improvementTips = getImprovements(feedback);
  const jobSummary =
    jobDescription?.trim() ||
    "No job description saved. Open the analysis to add one.";
  const title = [jobTitle, companyName && `at ${companyName}`].filter(Boolean).join(" ");

  return (
    <article className="resume-card relative animate-in fade-in duration-1000">
      <Link
        to={`/resume/${id}`}
        className="absolute inset-0 z-0 rounded-[28px]"
        aria-label={`Open saved analysis${title ? ` for ${title}` : ""}`}
      />

      <div className="resume-card-header relative z-10 pointer-events-none">
        <div className="flex flex-col gap-3">
          <span className="step-chip w-fit">Saved analysis</span>
          <div>
            <h2 className="font-bold break-words text-slate-950">
              {companyName}
            </h2>
            <h3 className="mt-1 text-lg break-words text-slate-600">{jobTitle}</h3>
          </div>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border pointer-events-none relative z-10 h-full animate-in fade-in duration-1000">
        <div className="flex h-full flex-col gap-3 rounded-[23px] bg-white/82 p-4">
        <div className="rounded-[20px] border border-slate-200/70 bg-white/92 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.4)]">
          <p className="mb-1 text-sm font-semibold text-slate-600">
            Job description (summary)
          </p>
          <p className="text-base leading-relaxed text-slate-800">
            {truncate(jobSummary)}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-2 rounded-[20px] border border-slate-200/70 bg-white/92 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.4)]">
          <p className="text-sm font-semibold text-slate-600">
            Top improvements
          </p>
          {improvementTips.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-800">
              {improvementTips.map((tip, idx) => (
                <li key={`${id}-tip-${idx}`}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No improvement tips captured. Open the analysis to view details.
            </p>
          )}
        </div>
        </div>
      </div>
    </article>
  );
};

export default ResumeCard;
