import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";

interface ComparisonSummaryProps {
  current: Resume;
  previous: Resume;
}

const getDeltaTone = (delta: number) => {
  if (delta > 0) return "text-emerald-700";
  if (delta < 0) return "text-rose-700";
  return "text-slate-600";
};

const DeltaIcon = ({ delta }: { delta: number }) => {
  if (delta > 0) return <ArrowUp className="size-4" />;
  if (delta < 0) return <ArrowDown className="size-4" />;
  return <ArrowRight className="size-4" />;
};

const formatDelta = (delta: number, suffix = "") => {
  if (delta > 0) return `+${delta}${suffix}`;
  return `${delta}${suffix}`;
};

const MetricDelta = ({
  label,
  previous,
  current,
  suffix = "",
}: {
  label: string;
  previous: number;
  current: number;
  suffix?: string;
}) => {
  const delta = current - previous;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <p className="text-2xl font-bold text-slate-950">
          {previous}{suffix} <span className="text-slate-400">{"->"}</span> {current}{suffix}
        </p>
        <span className={cn("inline-flex items-center gap-1 rounded-full border bg-slate-50 px-2.5 py-1 text-sm font-bold", getDeltaTone(delta))}>
          <DeltaIcon delta={delta} />
          {formatDelta(delta, suffix)}
        </span>
      </div>
    </div>
  );
};

const normalize = (value: string) => value.trim().toLowerCase();

const getResolvedKeywords = (current: Feedback, previous: Feedback) => {
  const currentMatched = new Set(current.keywordAlignment.matched.map(normalize));
  return previous.keywordAlignment.missing.filter((keyword) => currentMatched.has(normalize(keyword)));
};

const getStillMissingKeywords = (current: Feedback, previous: Feedback) => {
  const previousMissing = new Set(previous.keywordAlignment.missing.map(normalize));
  return current.keywordAlignment.missing.filter((keyword) => previousMissing.has(normalize(keyword)));
};

const ComparisonSummary = ({ current, previous }: ComparisonSummaryProps) => {
  const currentFeedback = current.feedback;
  const previousFeedback = previous.feedback;
  const resolvedKeywords = getResolvedKeywords(currentFeedback, previousFeedback);
  const stillMissingKeywords = getStillMissingKeywords(currentFeedback, previousFeedback);
  const categories = [
    ["Tone", previousFeedback.toneAndStyle.score, currentFeedback.toneAndStyle.score],
    ["Content", previousFeedback.content.score, currentFeedback.content.score],
    ["Structure", previousFeedback.structure.score, currentFeedback.structure.score],
    ["Skills", previousFeedback.skills.score, currentFeedback.skills.score],
  ] as const;

  return (
    <section className="glass-panel w-full space-y-5 border-teal-100 bg-teal-50/50">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Re-analysis Comparison
          </p>
          <h2 className="text-2xl font-bold text-slate-950">
            Version {previous.version || 1} to Version {current.version || 2}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            This compares the revised resume against the previous saved analysis using the same role context.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-3 py-2 text-sm font-semibold text-teal-800">
          <Sparkles className="size-4" />
          Improvement loop
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <MetricDelta label="Overall" previous={previousFeedback.overallScore} current={currentFeedback.overallScore} />
        <MetricDelta label="ATS" previous={previousFeedback.ATS.score} current={currentFeedback.ATS.score} />
        <MetricDelta label="Keyword Match" previous={previousFeedback.keywordAlignment.coverage} current={currentFeedback.keywordAlignment.coverage} suffix="%" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(([label, previousScore, currentScore]) => (
          <MetricDelta key={label} label={label} previous={previousScore} current={currentScore} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="size-4" />
            <p className="text-sm font-semibold">Resolved keyword gaps</p>
          </div>
          {resolvedKeywords.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {resolvedKeywords.map((keyword) => (
                <span key={`resolved-${keyword}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No previous missing keywords have moved into the matched list yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white/85 p-4">
          <p className="text-sm font-semibold text-amber-800">Still missing from the previous run</p>
          {stillMissingKeywords.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {stillMissingKeywords.map((keyword) => (
                <span key={`still-${keyword}`} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nice: none of the previous missing keywords are still flagged as missing.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSummary;
