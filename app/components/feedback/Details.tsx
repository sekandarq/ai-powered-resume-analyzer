import { cn } from "~/lib/utils";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69
          ? "bg-badge-green"
          : score > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center py-2">
      <div className="flex items-center gap-3">
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
      <p className="text-sm text-slate-500">{categoryScore}/100</p>
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  const improvements = tips.filter((tip) => tip.type === "improve");
  const strengths = tips.filter((tip) => tip.type === "good");

  const renderTip = (
    tip: { type: "good" | "improve"; tip: string; explanation: string },
    index: number
  ) => {
    const isStrength = tip.type === "good";

    return (
      <div
        key={`${tip.type}-${index}-${tip.tip}`}
        className={cn(
          "rounded-2xl border p-4",
          isStrength
            ? "border-emerald-100 bg-emerald-50/70"
            : "border-amber-100 bg-amber-50/70"
        )}
      >
        <div className="flex items-start gap-2">
          {isStrength ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          )}
          <div>
            <p
              className={cn(
                "text-base font-semibold",
                isStrength ? "text-emerald-900" : "text-amber-900"
              )}
            >
              {tip.tip}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed",
                isStrength ? "text-emerald-800" : "text-amber-800"
              )}
            >
              {tip.explanation}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
          Improvements
        </p>
        {improvements.length ? (
          improvements.map(renderTip)
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No improvement notes for this category.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Strengths
        </p>
        {strengths.length ? (
          strengths.map(renderTip)
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No strengths captured for this category yet.
          </p>
        )}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="glass-panel flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deep Dive</p>
          <h2 className="text-2xl font-bold text-slate-900">Detailed Feedback</h2>
        </div>
      </div>

      <Accordion className="space-y-3">
        <AccordionItem id="tone-style" className="rounded-2xl border border-slate-200 bg-white/80 px-2">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content" className="rounded-2xl border border-slate-200 bg-white/80 px-2">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure" className="rounded-2xl border border-slate-200 bg-white/80 px-2">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills" className="rounded-2xl border border-slate-200 bg-white/80 px-2">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
