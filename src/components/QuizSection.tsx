import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

interface QuizSectionProps {
  quiz: QuizQuestion | null;
  isLoading: boolean;
  onGenerateQuiz: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quiz,
  isLoading,
  onGenerateQuiz,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    onGenerateQuiz();
  };

  if (!quiz && !isLoading) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          Test Your Interdisciplinary Comprehension
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Challenge yourself with an AI-generated clinical vignette testing the exact causal bridge between these two terms.
        </p>
        <button
          onClick={onGenerateQuiz}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-medium text-xs hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate Clinical Case Question
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-700">
          Formulating board-style clinical challenge...
        </p>
      </div>
    );
  }

  if (!quiz) return null;

  const isCorrect = selectedOption === quiz.correctAnswerIndex;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Clinical Vignette Challenge
          </span>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Question
        </button>
      </div>

      {/* Case Vignette */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs text-slate-700 leading-relaxed font-serif">
        <span className="font-semibold text-slate-900 block mb-1 font-sans">
          Patient Scenario:
        </span>
        {quiz.vignette}
      </div>

      {/* Question */}
      <p className="text-sm font-bold text-slate-900 mb-4">{quiz.question}</p>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {quiz.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          let btnStyle = "bg-white border-slate-200 hover:border-slate-300 text-slate-800";

          if (hasSubmitted) {
            if (idx === quiz.correctAnswerIndex) {
              btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
            } else if (idx === selectedOption) {
              btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
            } else {
              btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={hasSubmitted}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${btnStyle}`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 mt-0.5">
                {letter}
              </span>
              <span className="flex-1">{opt}</span>
              {hasSubmitted && idx === quiz.correctAnswerIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {hasSubmitted && idx === selectedOption && idx !== quiz.correctAnswerIndex && (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation reveal */}
      {hasSubmitted && (
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isCorrect
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              : "bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1.5">
            {isCorrect ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Correct Answer: Option{" "}
                {String.fromCharCode(65 + quiz.correctAnswerIndex)}
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Explanation (Correct: Option{" "}
                {String.fromCharCode(65 + quiz.correctAnswerIndex)})
              </span>
            )}
          </div>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};
