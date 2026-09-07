import React from "react";
import { GitFork, BookOpen, Bookmark, Server } from "lucide-react";

interface NavbarProps {
  onOpenMatrix: () => void;
  onOpenSaved: () => void;
  onOpenDeployment: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMatrix,
  onOpenSaved,
  onOpenDeployment,
  savedCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <GitFork className="w-5 h-5 rotate-90" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Medical Connection
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                AI Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Interdisciplinary Pathways Across the 19 Medical Subjects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDeployment}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="GitHub & Deployment Information"
          >
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">GitHub / Deploy</span>
          </button>

          <button
            onClick={onOpenMatrix}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Browse all 19 subjects"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">19 Subjects</span> Matrix
          </button>

          <button
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 transition-colors relative"
            title="View saved connections"
          >
            <Bookmark className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
