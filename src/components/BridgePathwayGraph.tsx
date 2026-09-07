import React, { useState } from "react";
import { BridgeStep } from "../types";
import { GitFork, ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";

interface BridgePathwayGraphProps {
  steps: BridgeStep[];
  term1Name: string;
  term2Name: string;
}

export const BridgePathwayGraph: React.FC<BridgePathwayGraphProps> = ({
  steps,
  term1Name,
  term2Name,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyPathway = () => {
    const text = steps
      .map(
        (s) =>
          `Step ${s.stepNumber} [${s.subject}]: ${s.title}\nMechanism: ${s.mechanism}\nKey entity: ${s.anatomicalOrBiochemicalKey}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(
      `Medical Connection Bridge: ${term1Name} ➔ ${term2Name}\n\n` + text
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Biological & Clinical Bridge Pathway
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step causal chain bridging {term1Name} to {term2Name}
          </p>
        </div>

        <button
          onClick={handleCopyPathway}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied Pathway</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Pathway timeline / nodes */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-teal-500 via-sky-500 to-indigo-500 hidden sm:block" />

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const isExpanded = expandedStep === step.stepNumber || expandedStep === null;

            return (
              <div
                key={step.stepNumber}
                className={`relative pl-0 sm:pl-14 transition-all ${
                  isExpanded ? "opacity-100" : "opacity-90"
                }`}
              >
                {/* Timeline node icon */}
                <div
                  className={`hidden sm:flex absolute left-3.5 -translate-x-1/2 top-4 w-6 h-6 rounded-full items-center justify-center text-xs font-bold shadow-sm transition-transform ${
                    isFirst
                      ? "bg-teal-600 text-white ring-4 ring-teal-100"
                      : isLast
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-white border-2 border-sky-500 text-sky-700"
                  }`}
                >
                  {step.stepNumber}
                </div>

                {/* Step Card */}
                <div
                  className={`rounded-xl border p-4 transition-all ${
                    isFirst
                      ? "bg-teal-50/40 border-teal-200/80"
                      : isLast
                      ? "bg-indigo-50/40 border-indigo-200/80"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="sm:hidden text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        Step {step.stepNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        {step.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedStep(
                          expandedStep === step.stepNumber ? null : step.stepNumber
                        )
                      }
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed font-normal">
                    {step.mechanism}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      Key Biological / Structural Conduit:
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-mono">
                      {step.anatomicalOrBiochemicalKey}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
