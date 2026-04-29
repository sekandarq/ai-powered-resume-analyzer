import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

interface InterviewPrepProps {
  questions: Feedback["interviewPrep"]["questions"];
}

const InterviewPrep = ({ questions }: InterviewPrepProps) => {
  return (
    <div className="glass-panel w-full space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Practice Mode</p>
        <h2 className="text-2xl font-bold text-slate-900">Interview Prep</h2>
        <p className="text-slate-600 text-base">
          Use these role-specific questions to practice concise, impact-driven answers.
        </p>
      </div>

      {questions.length ? (
        <Accordion allowMultiple className="space-y-3">
          {questions.map((item, idx) => {
            const id = `q-${idx}`;
            const delayClass = idx % 4 === 1 ? "delay-1" : idx % 4 === 2 ? "delay-2" : idx % 4 === 3 ? "delay-3" : "";
            return (
              <AccordionItem
                key={id}
                id={id}
                className={`border border-slate-200 rounded-2xl bg-white/80 stagger-item ${delayClass}`}
              >
                <AccordionHeader
                  itemId={id}
                  className="py-3 text-left hover:bg-slate-50 rounded-lg"
                  iconPosition="right"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-800 font-semibold">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-900">
                        {item.question}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {item.rationale}
                      </p>
                    </div>
                  </div>
                </AccordionHeader>
                <AccordionContent itemId={id} className="pb-4">
                  <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      <span className="font-semibold">Why it matters: </span>
                      {item.rationale}
                    </p>
                    <p className="text-slate-800 text-sm leading-relaxed">
                      <span className="font-semibold">Answer guidance: </span>
                      {item.answerGuidance}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <p className="text-slate-500 text-base">
          We could not generate interview questions for this role yet.
        </p>
      )}
    </div>
  );
};

export default InterviewPrep;
