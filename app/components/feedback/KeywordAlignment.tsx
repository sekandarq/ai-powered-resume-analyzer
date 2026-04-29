import { Lightbulb } from "lucide-react";
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

const KeywordAlignment = ({
  jobTitle,
  jobDescription,
  data,
}: KeywordAlignmentProps) => {
  const coverage = Math.round(Math.min(Math.max(data.coverage, 0), 100));
  const coverageTone =
    coverage > 74 ? "text-green-700" : coverage > 49 ? "text-amber-700" : "text-red-700";

  const progressClass = coverage > 74
    ? "bg-emerald-500"
    : coverage > 49
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div className="glass-panel w-full space-y-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Keyword Alignment</p>
            <h2 className="text-2xl font-bold text-slate-900">Live ATS Keyword Match</h2>
          </div>
          <p className={cn("text-3xl font-extrabold", coverageTone)}>{coverage}%</p>
        </div>

        <p className="text-slate-600 text-base">
          We extracted critical terms from the job description and mapped them against your resume.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              progressClass
            )}
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Matched</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">{data.matched.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Missing</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">{data.missing.length}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Extras</p>
          <p className="mt-1 text-2xl font-bold text-sky-800">{data.extras.length}</p>
        </div>
      </div>

      {data.missing.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                How to add missing keywords naturally
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Add these terms only where they are truthful: skills, project
                descriptions, summary lines, or achievement bullets with measurable
                evidence.
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {data.missing.slice(0, 4).map((keyword) => (
                  <div
                    key={`usage-${keyword}`}
                    className="rounded-xl border border-white/80 bg-white/75 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {keyword}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      Work it into a bullet that proves experience, not a keyword
                      list with no context.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {(jobTitle || jobDescription) && (
        <div className="rounded-2xl border border-white/80 bg-white/75 p-4 space-y-2 text-slate-700">
          {jobTitle && <p className="font-semibold">Role Focus: {jobTitle}</p>}
          {jobDescription && (
            <p className="text-sm md:text-base max-h-20 overflow-hidden text-ellipsis leading-relaxed">
              Job Highlights: <span className="font-medium">{jobDescription}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-green-700 flex items-center gap-2">
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
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700 flex items-center gap-2">
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
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700 flex items-center gap-2">
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
