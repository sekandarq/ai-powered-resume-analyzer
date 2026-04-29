import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Filter,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "~/lib/utils";

type ActionFilter =
  | "all"
  | "critical"
  | "ats"
  | "keywords"
  | "content"
  | "structure"
  | "completed";

interface ActionPlanProps {
  items: ActionItem[];
  completedIds: string[];
  onToggle: (id: string) => void;
}

const priorityStyles: Record<ActionItem["priority"], string> = {
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  important: "border-amber-200 bg-amber-50 text-amber-700",
  minor: "border-slate-200 bg-slate-50 text-slate-600",
  strength: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const effortLabels: Record<ActionItem["effort"], string> = {
  quick: "Quick fix",
  moderate: "Moderate",
  deep: "Deep rewrite",
};

const categoryLabels: Record<ActionItem["category"], string> = {
  ats: "ATS",
  keywords: "Keywords",
  content: "Content",
  structure: "Structure",
  tone: "Tone",
  skills: "Skills",
};

const filterLabels: Array<{ id: ActionFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "ats", label: "ATS" },
  { id: "keywords", label: "Keywords" },
  { id: "content", label: "Content" },
  { id: "structure", label: "Structure" },
  { id: "completed", label: "Done" },
];

const ActionPlan = ({
  items,
  completedIds,
  onToggle,
}: ActionPlanProps) => {
  const [activeFilter, setActiveFilter] = useState<ActionFilter>("all");
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const sortedItems = useMemo(() => {
    const priorityRank: Record<ActionItem["priority"], number> = {
      critical: 0,
      important: 1,
      minor: 2,
      strength: 3,
    };

    return items.slice().sort((a, b) => {
      const aDone = completedSet.has(a.id) ? 1 : 0;
      const bDone = completedSet.has(b.id) ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return priorityRank[a.priority] - priorityRank[b.priority];
    });
  }, [completedSet, items]);

  const filteredItems = sortedItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return completedSet.has(item.id);
    if (activeFilter === "critical") return item.priority === "critical";
    return item.category === activeFilter;
  });

  const topOpenItems = sortedItems
    .filter((item) => !completedSet.has(item.id) && item.priority !== "strength")
    .slice(0, 3);

  const completedCount = items.filter((item) => completedSet.has(item.id)).length;
  const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  const getFilterCount = (filter: ActionFilter) => {
    if (filter === "all") return items.length;
    if (filter === "completed") return completedCount;
    if (filter === "critical") {
      return items.filter((item) => item.priority === "critical").length;
    }
    return items.filter((item) => item.category === filter).length;
  };

  return (
    <section className="glass-panel w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Improvement Plan
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Fix the {""} 
            <span className="bg-gradient-to-r from-red-600 to-lime-500 bg-clip-text text-transparent inline-block font-bold">highest-impact</span> {""}
             items first
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Track the changes that will most improve ATS fit, recruiter clarity,
            and role alignment.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Progress
          </p>
          <p className="text-2xl font-extrabold text-slate-950">{progress}%</p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {topOpenItems.length > 0 && (
        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
          <div className="flex items-center gap-2 text-teal-800">
            <Sparkles className="size-4" />
            <p className="text-sm font-semibold">Start Here</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {topOpenItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className="rounded-xl border border-white/80 bg-white/85 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Priority {index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                  {item.recommendation}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <Filter className="size-3.5" />
          Filter
        </div>
        {filterLabels.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              activeFilter === filter.id
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white/80 text-slate-600 hover:text-slate-950"
            )}
          >
            {filter.label}
            <span className="ml-1 text-slate-400">{getFilterCount(filter.id)}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.length ? (
          filteredItems.map((item) => {
            const isDone = completedSet.has(item.id);
            return (
              <article
                key={item.id}
                className={cn(
                  "rounded-2xl border bg-white/86 p-4 shadow-sm transition",
                  isDone
                    ? "border-emerald-100 bg-emerald-50/50"
                    : "border-slate-200 hover:border-teal-200"
                )}
              >
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onToggle(item.id)}
                    className="mt-0.5 shrink-0 text-slate-400 transition hover:text-teal-700"
                    aria-label={isDone ? "Mark item as incomplete" : "Mark item as completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]",
                          priorityStyles[item.priority]
                        )}
                      >
                        {item.priority}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        {categoryLabels[item.category]}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        {effortLabels[item.effort]}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "mt-3 text-base font-bold text-slate-950",
                        isDone && "text-slate-500 line-through"
                      )}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.issue}
                    </p>

                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="mt-0.5 size-4 shrink-0 text-teal-700" />
                        <p className="text-sm leading-6 text-slate-700">
                          {item.recommendation}
                        </p>
                      </div>
                    </div>

                    {item.suggestedRewrite && (
                      <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                          Suggested Rewrite
                        </p>
                        <p className="mt-1 text-sm leading-6 text-emerald-900">
                          {item.suggestedRewrite}
                        </p>
                      </div>
                    )}

                    {item.keywordsToAdd?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.keywordsToAdd.map((keyword) => (
                          <span
                            key={`${item.id}-${keyword}`}
                            className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center">
            <AlertTriangle className="mx-auto size-5 text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              No items match this filter.
            </p>
          </div>
        )}
      </div>

      {completedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              {completedCount} item{completedCount === 1 ? "" : "s"} completed
            </p>
            <p className="text-sm text-emerald-700">
              Re-run analysis after updating your resume to validate the score change.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <RefreshCw className="size-3.5" />
            Ready to re-check
          </div>
        </div>
      )}
    </section>
  );
};

export default ActionPlan;
