import React, { useState } from "react";
import { MEDICAL_SUBJECTS } from "../data/medicalSubjects";
import { SubjectIcon } from "./SubjectIcon";
import { X, Search, Sparkles, ArrowRight } from "lucide-react";

interface SubjectMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForSubject1: (id: string) => void;
  onSelectForSubject2: (id: string) => void;
}

export const SubjectMatrixModal: React.FC<SubjectMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectForSubject1,
  onSelectForSubject2,
}) => {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("All");

  if (!isOpen) return null;

  const filtered = MEDICAL_SUBJECTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.highYieldTerms.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchPhase = phaseFilter === "All" || s.phase === phaseFilter;
    return matchSearch && matchPhase;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                The 19 Medical Curriculum Subjects
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                Complete Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any discipline to configure Concept 1 or Concept 2 in your connection analysis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects or terms..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
            {["All", "Pre-Clinical", "Para-Clinical", "Clinical"].map((phase) => (
              <button
                key={phase}
                onClick={() => setPhaseFilter(phase)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  phaseFilter === phase
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((sub, index) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    #{index + 1}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {sub.phase}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${sub.badgeColor}`}>
                    <SubjectIcon name={sub.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {sub.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sub.shortName}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {sub.description}
                </p>

                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block font-semibold mb-1">
                    Key Terms:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sub.highYieldTerms.slice(0, 3).map((term) => (
                      <span
                        key={term}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons to select for Term 1 or Term 2 */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onSelectForSubject1(sub.id);
                    onClose();
                  }}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors text-center"
                >
                  Set Concept 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectForSubject2(sub.id);
                    onClose();
                  }}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-colors text-center"
                >
                  Set Concept 2
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
