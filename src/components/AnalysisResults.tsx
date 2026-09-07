import React, { useState, useEffect } from "react";
import { ConnectionAnalysis, QuizQuestion } from "../types";
import { BridgePathwayGraph } from "./BridgePathwayGraph";
import { QuizSection } from "./QuizSection";
import {
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Activity,
  Layers,
  Stethoscope,
  Pill,
  Sparkles,
  ArrowRight,
  GraduationCap,
  UserCheck,
  FileText,
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: ConnectionAnalysis;
  isSaved: boolean;
  onToggleSave: () => void;
  onExploreBranch: (term: string, subject: string) => void;
  quiz: QuizQuestion | null;
  isQuizLoading: boolean;
  onGenerateQuiz: () => void;
  source?: "server" | "curated";
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  isSaved,
  onToggleSave,
  onExploreBranch,
  quiz,
  isQuizLoading,
  onGenerateQuiz,
  source = "server",
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "pathway" | "clinical" | "exam">("overview");

  // Web Speech API text-to-speech
  const handleToggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported by your browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${analysis.term1.term} in ${analysis.term1.subject} connects to ${analysis.term2.term} in ${analysis.term2.subject}. ${analysis.coreThesis}. In clinical presentation, ${analysis.clinicalCorrelation.presentation}. High yield pearl: ${analysis.highYieldExamPearls[0] || ""}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [analysis]);

  const handleShare = () => {
    const text = `Medical Connection:\n${analysis.term1.term} (${analysis.term1.subject}) ↔ ${analysis.term2.term} (${analysis.term2.subject})\n\nCore Thesis: ${analysis.coreThesis}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Core Synthesis Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {analysis.connectionStrength}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600">
              {analysis.term1.subject} ➔ {analysis.term2.subject}
            </span>
            {source === "server" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Live Gemini AI Synthesis
              </span>
            )}
            {source === "curated" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Peer-Reviewed Landmark Case
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isPlayingAudio
                  ? "bg-teal-50 border-teal-300 text-teal-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              title="Listen to synthesized explanation"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-teal-600" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audio Brief</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              title="Copy connection thesis"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleSave}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isSaved
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              title={isSaved ? "Saved to Library" : "Save Connection"}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Concept pair header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 block mb-1">
              {analysis.term1.subject}
            </span>
            <h3 className="text-base font-bold text-slate-900">{analysis.term1.term}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {analysis.term1.definition}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block mb-1">
              {analysis.term2.subject}
            </span>
            <h3 className="text-base font-bold text-slate-900">{analysis.term2.term}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {analysis.term2.definition}
            </p>
          </div>
        </div>

        {/* Core Thesis Highlight */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-teal-50/70 via-slate-50 to-indigo-50/70 border border-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              The Medical Interconnection Thesis
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
            {analysis.coreThesis}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mt-6 -mb-2 gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Multi-Disciplinary Links" },
            { id: "pathway", label: "Bridge Pathway Flow" },
            { id: "clinical", label: "Clinical Case Vignette" },
            { id: "exam", label: "Exam Pearls & Quiz" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Multidisciplinary Links */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pathophysiology */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {analysis.pathophysiologicalLink.title}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {analysis.pathophysiologicalLink.description}
            </p>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Molecules & Biological Systems:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.pathophysiologicalLink.keyMoleculesOrSystems.map((item, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-red-50/70 border border-red-200/80 text-red-700 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Anatomical / Structural */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {analysis.anatomicalStructuralLink.title}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {analysis.anatomicalStructuralLink.description}
            </p>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Structural & Fascial Planes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.anatomicalStructuralLink.structuresInvolved.map((item, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-amber-50/70 border border-amber-200/80 text-amber-800 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical & Diagnostic Correlation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {analysis.clinicalCorrelation.title}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              {analysis.clinicalCorrelation.presentation}
            </p>

            <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Diagnostic Clues:
                </span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  {analysis.clinicalCorrelation.diagnosticClues.map((clue, idx) => (
                    <li key={idx}>{clue}</li>
                  ))}
                </ul>
              </div>

              {analysis.clinicalCorrelation.riskFactorsOrComplications.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-rose-600 block mb-1">
                    Complications / Red Flags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.clinicalCorrelation.riskFactorsOrComplications.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pharmacological / Therapeutics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Pill className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {analysis.pharmacologicalTherapeuticLink.title}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {analysis.pharmacologicalTherapeuticLink.description}
            </p>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Therapeutic Agents & Countermeasures:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.pharmacologicalTherapeuticLink.drugClassesOrInterventions.map(
                  (item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-purple-50/70 border border-purple-200/80 text-purple-700 font-medium"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bridge Pathway Graph */}
      {activeTab === "pathway" && (
        <BridgePathwayGraph
          steps={analysis.bridgePathway}
          term1Name={analysis.term1.term}
          term2Name={analysis.term2.term}
        />
      )}

      {/* Tab 3: Clinical Case Vignette */}
      {activeTab === "clinical" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {analysis.clinicalCaseVignette.title}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Simulated Patient Case: {analysis.clinicalCaseVignette.patientAgeGender}
              </span>
            </div>
          </div>

          <div className="space-y-4 font-serif text-slate-800 text-sm leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                History & Presenting Complaints
              </h5>
              <p>{analysis.clinicalCaseVignette.presentingComplaint}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Investigation & Workup
              </h5>
              <p>{analysis.clinicalCaseVignette.investigationFindings}</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
                Clinical Resolution & Interdisciplinary Insight
              </h5>
              <p className="text-slate-900">
                {analysis.clinicalCaseVignette.clinicalResolution}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Exam Pearls & Quiz */}
      {activeTab === "exam" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  High-Yield Academic Pearls
                </h3>
                <p className="text-xs text-slate-500">
                  Board exam testable concepts (USMLE / NEET-PG / PLAB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.highYieldExamPearls.map((pearl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{pearl}</span>
                </div>
              ))}
            </div>
          </div>

          <QuizSection
            quiz={quiz}
            isLoading={isQuizLoading}
            onGenerateQuiz={onGenerateQuiz}
          />
        </div>
      )}

      {/* Cross-Subject Curiosity Branches */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Branch Out: Deepen Your Medical Connections
            </h4>
          </div>
          <span className="text-xs text-slate-400">Click to explore next link</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {analysis.crossSubjectCuriosities.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onExploreBranch(item.term, item.subject)}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 text-left transition-all group"
            >
              <span className="text-[10px] font-semibold text-teal-700 block mb-1">
                {item.subject}
              </span>
              <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900 flex items-center justify-between">
                <span>{item.term}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {item.whyExplore}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
