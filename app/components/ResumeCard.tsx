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

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="text-black! font-bold wrap-break-words">
            {companyName}
          </h2>
          <h3 className="text-lg wrap-break-word text-gray-700">{jobTitle}</h3>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="flex flex-col gap-3 gradient-border animate-in fade-in duration-1000 h-full">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-semibold mb-1">
            Job description (summary)
          </p>
          <p className="text-base text-gray-800 leading-relaxed">
            {truncate(jobSummary)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <p className="text-sm text-gray-600 font-semibold">
            Top improvements
          </p>
          {improvementTips.length ? (
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {improvementTips.map((tip, idx) => (
                <li key={`${id}-tip-${idx}`}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No improvement tips captured. Open the analysis to view details.
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
