import React, { useState } from "react";
import { MEDICAL_SUBJECTS, PRESET_CONNECTIONS } from "../data/medicalSubjects";
import { MedicalSubject, PresetConnection } from "../types";
import { SubjectIcon } from "./SubjectIcon";
import { ArrowRight, ArrowLeftRight, Sparkles, Search, Compass, ChevronDown } from "lucide-react";

interface SubjectTermSelectorProps {
  subject1Id: string;
  term1: string;
  subject2Id: string;
  term2: string;
  focusArea: string;
  isLoading: boolean;
  onSubject1Change: (id: string) => void;
  onTerm1Change: (term: string) => void;
  onSubject2Change: (id: string) => void;
  onTerm2Change: (term: string) => void;
  onFocusAreaChange: (focus: string) => void;
  onSwapTerms: () => void;
  onAnalyze: () => void;
  onSelectPreset: (preset: PresetConnection) => void;
}

export const SubjectTermSelector: React.FC<SubjectTermSelectorProps> = ({
  subject1Id,
  term1,
  subject2Id,
  term2,
  focusArea,
  isLoading,
  onSubject1Change,
  onTerm1Change,
  onSubject2Change,
  onTerm2Change,
  onFocusAreaChange,
  onSwapTerms,
  onAnalyze,
  onSelectPreset,
}) => {
  const currentSub1 = MEDICAL_SUBJECTS.find((s) => s.id === subject1Id) || MEDICAL_SUBJECTS[0];
  const currentSub2 = MEDICAL_SUBJECTS.find((s) => s.id === subject2Id) || MEDICAL_SUBJECTS[10];

  const [showSub1Picker, setShowSub1Picker] = useState(false);
  const [showSub2Picker, setShowSub2Picker] = useState(false);

  const canAnalyze = term1.trim().length > 0 && term2.trim().length > 0 && !isLoading;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      <div className="flex flex-col lg:flex-row items-center gap-4 relative">
        {/* Term 1 Card */}
        <div className="w-full lg:w-1/2 p-5 rounded-xl bg-slate-50/80 border border-slate-200/90 transition-all hover:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Concept 1 (Source Subject)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
              {currentSub1.phase}
            </span>
          </div>

          {/* Subject Dropdown / Selector */}
          <div className="relative mb-3">
            <button
              type="button"
              onClick={() => setShowSub1Picker(!showSub1Picker)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white rounded-lg border border-slate-200 text-left hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${currentSub1.badgeColor}`}>
                  <SubjectIcon name={currentSub1.iconName} className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {currentSub1.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Subject #{MEDICAL_SUBJECTS.findIndex((s) => s.id === currentSub1.id) + 1} of 19
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showSub1Picker && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto p-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1">
                  Pick from 19 Medical Subjects
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {MEDICAL_SUBJECTS.map((sub, idx) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        onSubject1Change(sub.id);
                        setShowSub1Picker(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        sub.id === subject1Id
                          ? "bg-teal-50 text-teal-900 font-medium"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] w-4 text-slate-400 font-mono">
                          {idx + 1}.
                        </span>
                        <SubjectIcon name={sub.iconName} className="w-3.5 h-3.5 text-slate-500" />
                        <span>{sub.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{sub.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Term Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Medical Term, Disease, or Anatomical Structure
            </label>
            <div className="relative">
              <input
                type="text"
                value={term1}
                onChange={(e) => onTerm1Change(e.target.value)}
                placeholder={`e.g., ${currentSub1.highYieldTerms[0]} or custom term...`}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Quick High-Yield Term Pills */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Popular High-Yield Topics in {currentSub1.shortName}:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {currentSub1.highYieldTerms.slice(0, 5).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onTerm1Change(term)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Central Interconnection Node & Swap Action */}
        <div className="flex lg:flex-col items-center justify-center my-2 lg:my-0 z-10">
          <button
            type="button"
            onClick={onSwapTerms}
            className="p-3 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-teal-700 hover:border-teal-300 hover:scale-105 active:scale-95 transition-all"
            title="Swap Term 1 and Term 2"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Term 2 Card */}
        <div className="w-full lg:w-1/2 p-5 rounded-xl bg-slate-50/80 border border-slate-200/90 transition-all hover:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Concept 2 (Target Subject)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
              {currentSub2.phase}
            </span>
          </div>

          {/* Subject Dropdown / Selector */}
          <div className="relative mb-3">
            <button
              type="button"
              onClick={() => setShowSub2Picker(!showSub2Picker)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white rounded-lg border border-slate-200 text-left hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${currentSub2.badgeColor}`}>
                  <SubjectIcon name={currentSub2.iconName} className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {currentSub2.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Subject #{MEDICAL_SUBJECTS.findIndex((s) => s.id === currentSub2.id) + 1} of 19
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showSub2Picker && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto p-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1">
                  Pick from 19 Medical Subjects
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {MEDICAL_SUBJECTS.map((sub, idx) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        onSubject2Change(sub.id);
                        setShowSub2Picker(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        sub.id === subject2Id
                          ? "bg-teal-50 text-teal-900 font-medium"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] w-4 text-slate-400 font-mono">
                          {idx + 1}.
                        </span>
                        <SubjectIcon name={sub.iconName} className="w-3.5 h-3.5 text-slate-500" />
                        <span>{sub.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{sub.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Term Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Medical Term, Disease, or Anatomical Structure
            </label>
            <div className="relative">
              <input
                type="text"
                value={term2}
                onChange={(e) => onTerm2Change(e.target.value)}
                placeholder={`e.g., ${currentSub2.highYieldTerms[0]} or custom term...`}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Quick High-Yield Term Pills */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Popular High-Yield Topics in {currentSub2.shortName}:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {currentSub2.highYieldTerms.slice(0, 5).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onTerm2Change(term)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Area & Action Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Compass className="w-4 h-4 text-slate-500 hidden sm:block" />
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            Pathway Lens:
          </span>
          <select
            value={focusArea}
            onChange={(e) => onFocusAreaChange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="Holistic Medical Synthesis">Holistic Synthesis (All Angles)</option>
            <option value="Pathophysiological & Biomolecular Cascade">
              Pathophysiology & Biomolecular Cascade
            </option>
            <option value="Anatomical Relations & Structural Pathways">
              Anatomical Relations & Structural Pathway
            </option>
            <option value="Clinical Presentation & Diagnostic Correlates">
              Clinical Presentation & Diagnosis
            </option>
            <option value="Pharmacological & Therapeutic Interplay">
              Pharmacology & Therapeutic Overlap
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm ${
            canAnalyze
              ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.99] hover:shadow-teal-600/20"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Interconnection...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Medical Connection</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Preset Sparks Carousel */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            High-Yield Interdisciplinary Sparks (Click to load):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_CONNECTIONS.slice(0, 4).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-300 text-left transition-all group"
            >
              <div className="text-[10px] font-semibold text-teal-700 mb-1 line-clamp-1">
                {preset.badge}
              </div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900 leading-snug line-clamp-1">
                {preset.term1}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 my-0.5">
                <span>connected to</span>
                <span className="text-teal-600 font-medium">{preset.term2}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {preset.teaser}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
