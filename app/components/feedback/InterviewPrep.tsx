import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

interface InterviewPrepProps {
  questions: Feedback["interviewPrep"]["questions"];
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ questions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Interview Prep</h2>
        <p className="text-gray-600 text-lg">
          Use these role-specific questions to practice concise, impact-driven answers.
        </p>
      </div>

      {questions.length ? (
        <Accordion allowMultiple className="divide-y divide-gray-100">
          {questions.map((item, idx) => {
            const id = `q-${idx}`;
            return (
              <AccordionItem key={id} id={id} className="border-none">
                <AccordionHeader
                  itemId={id}
                  className="px-0 py-3 text-left hover:bg-gray-50 rounded-lg"
                  iconPosition="right"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-semibold text-gray-900">
                        {item.question}
                      </p>
                      <p className="text-lg text-gray-600 line-clamp-2">
                        {item.rationale}
                      </p>
                    </div>
                  </div>
                </AccordionHeader>
                <AccordionContent itemId={id} className="px-0 pb-4">
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Why it matters: </span>
                      {item.rationale}
                    </p>
                    <p className="text-gray-800">
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
        <p className="text-gray-500 text-base">
          We could not generate interview questions for this role yet.
        </p>
      )}
    </div>
  );
};

export default InterviewPrep;
