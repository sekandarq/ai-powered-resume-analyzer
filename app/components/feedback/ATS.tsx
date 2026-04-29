import { AlertTriangle, CheckCircle2, FileSearch } from 'lucide-react';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const boundedScore = Math.max(0, Math.min(100, score));
  const subtitle = score > 69
    ? 'Strong ATS Position'
    : score > 40
      ? 'Competitive But Needs Tuning'
      : 'Critical ATS Gaps Found';

  const improvements = suggestions.filter((suggestion) => suggestion.type === 'improve').slice(0, 4);
  const strengths = suggestions.filter((suggestion) => suggestion.type === 'good').slice(0, 4);

  const toneClass = score > 69
    ? 'border-emerald-200 bg-emerald-50/70'
    : score > 40
      ? 'border-amber-200 bg-amber-50/70'
      : 'border-rose-200 bg-rose-50/70';

  const progressClass = score > 69
    ? 'bg-emerald-500'
    : score > 40
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className={`glass-panel w-full ${toneClass}`}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-700">
              <FileSearch className="size-5" />
            </div>
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ATS Readiness</p>
            <h2 className="text-2xl font-bold text-slate-900">{subtitle}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Prioritize parsing clarity, role keywords, and simple resume structure.
            </p>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{boundedScore}<span className="text-base font-semibold text-slate-500">/100</span></p>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-white/80">
          <div className={`h-full rounded-full transition-all duration-700 ${progressClass}`} style={{ width: `${boundedScore}%` }} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-white/80 p-4">
            <p className="text-sm font-semibold text-rose-700">Fix Next</p>
            <ul className="mt-3 space-y-2">
              {improvements.length ? improvements.map((item, index) => (
                <li key={`${item.tip}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <span>{item.tip}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-600">No urgent ATS fixes identified.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <p className="text-sm font-semibold text-emerald-700">Already Strong</p>
            <ul className="mt-3 space-y-2">
              {strengths.length ? strengths.map((item, index) => (
                <li key={`${item.tip}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item.tip}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-600">Strength details will appear after more analyses.</li>
              )}
            </ul>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Focus on the highest-impact fixes first, then re-run analysis to validate ATS improvement.
        </p>
      </div>
    </div>
  )
}

export default ATS
