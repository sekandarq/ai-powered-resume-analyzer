import React from "react";
import { cn } from "~/lib/utils";

interface KeywordAlignmentProps {
  jobTitle?: string;
  jobDescription?: string;
  data: Feedback["keywordAlignment"];
}

const KeywordPill = ({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "good" | "warn" | "extra" | "neutral";
}) => {
  const toneStyles: Record<typeof tone, string> = {
    good: "bg-green-50 text-green-700 border border-green-200",
    warn: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    extra: "bg-blue-50 text-blue-700 border border-blue-200",
    neutral: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
        toneStyles[tone]
      )}
    >
      <span className="font-semibold leading-tight">{label}</span>
    </span>
  );
};

const KeywordAlignment: React.FC<KeywordAlignmentProps> = ({
  jobTitle,
  jobDescription,
  data,
}) => {
  const coverageTone =
    data.coverage > 74 ? "text-green-700" : data.coverage > 49 ? "text-amber-700" : "text-red-700";

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 space-y-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <img src="/icons/attention.svg" alt="Attention Icon" className="w-16 h-16" />
          <h2 className="text-2xl font-bold">Live ATS Keyword Alignment</h2>
        </div>

        <p className="text-gray-600 text-lg">
          We extracted critical terms from the job description and mapped them against your resume.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              data.coverage > 74
                ? "bg-green-500"
                : data.coverage > 49
                ? "bg-amber-400"
                : "bg-red-400"
            )}
            style={{ width: `${Math.min(Math.max(data.coverage, 0), 100)}%` }}
          />
        </div>
        <p className={cn("text-xl font-semibold min-w-[80px] text-right", coverageTone)}>
          {Math.round(data.coverage)}%
        </p>
      </div>

      {(jobTitle || jobDescription) && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-gray-700">
          {jobTitle && <p className="font-semibold">Role: {jobTitle}</p>}
          {jobDescription && (
            <p className="text-sm md:text-base max-h-20 overflow-hidden text-ellipsis">
              Job Highlights: <span className="font-medium">{jobDescription}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <img src="/icons/check.svg" alt="matched" className="w-5 h-5" />
            Matched keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {data.matched.length
              ? data.matched.map((item) => (
                  <KeywordPill key={`matched-${item}`} label={item} tone="good" />
                ))
              : <p className="text-gray-500 text-sm">No matches detected yet.</p>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-amber-700 flex items-center gap-2">
            <img src="/icons/warning.svg" alt="missing" className="w-5 h-5" />
            Missing (high priority)
          </p>
          <div className="flex flex-wrap gap-2">
            {data.missing.length
              ? data.missing.map((item) => (
                  <KeywordPill key={`missing-${item}`} label={item} tone="warn" />
                ))
              : <p className="text-gray-500 text-sm">No critical gaps found.</p>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <img src="/icons/pin.svg" alt="extras" className="w-5 h-5" />
            Relevant extras
          </p>
          <div className="flex flex-wrap gap-2">
            {data.extras.length
              ? data.extras.map((item) => (
                  <KeywordPill key={`extra-${item}`} label={item} tone="extra" />
                ))
              : <p className="text-gray-500 text-sm">No extras highlighted.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordAlignment;
