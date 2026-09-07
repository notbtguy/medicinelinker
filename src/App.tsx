import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { SubjectTermSelector } from "./components/SubjectTermSelector";
import { AnalysisResults } from "./components/AnalysisResults";
import { SubjectMatrixModal } from "./components/SubjectMatrixModal";
import { SavedConnectionsDrawer } from "./components/SavedConnectionsDrawer";
import { DeploymentModal } from "./components/DeploymentModal";
import { MEDICAL_SUBJECTS, PRESET_CONNECTIONS } from "./data/medicalSubjects";
import { ConnectionAnalysis, PresetConnection, QuizQuestion, SavedConnection } from "./types";
import { analyzeMedicalConnection, generateMedicalQuiz } from "./services/apiService";
import { Sparkles, AlertCircle, RefreshCw, BookOpen, Layers } from "lucide-react";

export default function App() {
  const [subject1Id, setSubject1Id] = useState<string>("microbiology");
  const [term1, setTerm1] = useState<string>("Plasmodium falciparum (Malaria)");
  const [subject2Id, setSubject2Id] = useState<string>("dermatology");
  const [term2, setTerm2] = useState<string>("Erythema Nodosum");
  const [focusArea, setFocusArea] = useState<string>("Holistic Medical Synthesis");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ConnectionAnalysis | null>(null);
  const [source, setSource] = useState<"server" | "curated">("server");

  // Quiz state
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(false);

  // Saved connections state
  const [savedConnections, setSavedConnections] = useState<SavedConnection[]>(() => {
    try {
      const stored = localStorage.getItem("medical_connections_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal drawers
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);

  // Save to localStorage when savedConnections change
  useEffect(() => {
    try {
      localStorage.setItem("medical_connections_saved", JSON.stringify(savedConnections));
    } catch (e) {
      console.error("Failed to save connections to localStorage", e);
    }
  }, [savedConnections]);

  // Primary Analyze function
  const handleAnalyze = async (overrideParams?: {
    s1?: string;
    t1?: string;
    s2?: string;
    t2?: string;
  }) => {
    const s1Id = overrideParams?.s1 ?? subject1Id;
    const t1Val = overrideParams?.t1 ?? term1;
    const s2Id = overrideParams?.s2 ?? subject2Id;
    const t2Val = overrideParams?.t2 ?? term2;

    const sub1 = MEDICAL_SUBJECTS.find((s) => s.id === s1Id)?.name || s1Id;
    const sub2 = MEDICAL_SUBJECTS.find((s) => s.id === s2Id)?.name || s2Id;

    if (!t1Val.trim() || !t2Val.trim()) {
      setError("Please specify both medical terms to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuiz(null);

    try {
      const { data, source: resultSource } = await analyzeMedicalConnection({
        subject1: sub1,
        term1: t1Val,
        subject2: sub2,
        term2: t2Val,
        focusArea,
      });

      setAnalysis(data);
      setSource(resultSource);

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById("analysis-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Analysis failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing the connection. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: PresetConnection) => {
    const sub1 = MEDICAL_SUBJECTS.find((s) => s.name === preset.subject1)?.id || "microbiology";
    const sub2 = MEDICAL_SUBJECTS.find((s) => s.name === preset.subject2)?.id || "dermatology";

    setSubject1Id(sub1);
    setTerm1(preset.term1);
    setSubject2Id(sub2);
    setTerm2(preset.term2);

    handleAnalyze({
      s1: sub1,
      t1: preset.term1,
      s2: sub2,
      t2: preset.term2,
    });
  };

  // Swap Terms
  const handleSwapTerms = () => {
    const prevSub1 = subject1Id;
    const prevTerm1 = term1;
    setSubject1Id(subject2Id);
    setTerm1(term2);
    setSubject2Id(prevSub1);
    setTerm2(prevTerm1);
  };

  // Branch exploration
  const handleExploreBranch = (newTerm: string, newSubjectName: string) => {
    const matchedSubject =
      MEDICAL_SUBJECTS.find(
        (s) => s.name.toLowerCase() === newSubjectName.toLowerCase() || s.id === newSubjectName
      ) || MEDICAL_SUBJECTS[0];

    // Shift term 2 to term 1, and set branch as term 2
    const nextSub1 = subject2Id;
    const nextTerm1 = term2;
    const nextSub2 = matchedSubject.id;
    const nextTerm2 = newTerm;

    setSubject1Id(nextSub1);
    setTerm1(nextTerm1);
    setSubject2Id(nextSub2);
    setTerm2(nextTerm2);

    handleAnalyze({
      s1: nextSub1,
      t1: nextTerm1,
      s2: nextSub2,
      t2: nextTerm2,
    });
  };

  // Save / Bookmark connection
  const isCurrentSaved =
    analysis !== null &&
    savedConnections.some(
      (c) =>
        c.term1.toLowerCase() === analysis.term1.term.toLowerCase() &&
        c.term2.toLowerCase() === analysis.term2.term.toLowerCase()
    );

  const handleToggleSave = () => {
    if (!analysis) return;

    if (isCurrentSaved) {
      setSavedConnections((prev) =>
        prev.filter(
          (c) =>
            !(
              c.term1.toLowerCase() === analysis.term1.term.toLowerCase() &&
              c.term2.toLowerCase() === analysis.term2.term.toLowerCase()
            )
        )
      );
    } else {
      const newSaved: SavedConnection = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
        subject1: analysis.term1.subject,
        term1: analysis.term1.term,
        subject2: analysis.term2.subject,
        term2: analysis.term2.term,
        coreThesis: analysis.coreThesis,
        analysis,
      };
      setSavedConnections((prev) => [newSaved, ...prev]);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!analysis) return;
    setIsQuizLoading(true);
    try {
      const data = await generateMedicalQuiz({
        term1: analysis.term1.term,
        subject1: analysis.term1.subject,
        term2: analysis.term2.term,
        subject2: analysis.term2.subject,
        coreThesis: analysis.coreThesis,
      });
      setQuiz(data);
    } catch (err) {
      console.error("Quiz error:", err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Load Saved Connection
  const handleLoadSaved = (conn: SavedConnection) => {
    const s1 = MEDICAL_SUBJECTS.find((s) => s.name === conn.subject1)?.id || "anatomy";
    const s2 = MEDICAL_SUBJECTS.find((s) => s.name === conn.subject2)?.id || "pathology";

    setSubject1Id(s1);
    setTerm1(conn.term1);
    setSubject2Id(s2);
    setTerm2(conn.term2);
    setAnalysis(conn.analysis);
  };

  // Delete Saved
  const handleDeleteSaved = (id: string) => {
    setSavedConnections((prev) => prev.filter((c) => c.id !== id));
  };

  // Automatically trigger the initial synthesis on first mount so user sees immediate results
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-teal-500/20 selection:text-teal-900">
      <Navbar
        onOpenMatrix={() => setIsMatrixOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenDeployment={() => setIsDeploymentOpen(true)}
        savedCount={savedConnections.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* App Hero Introduction */}
        <section className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Interdisciplinary Medical AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect Any Two Concepts Across the 19 Medical Subjects
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            From Anatomy and Physiology to Dermatology, Surgery, and Pharmacology — discover the hidden biological cascades, anatomical bridges, and clinical correlations that unite the human body.
          </p>
        </section>

        {/* Input Card */}
        <SubjectTermSelector
          subject1Id={subject1Id}
          term1={term1}
          subject2Id={subject2Id}
          term2={term2}
          focusArea={focusArea}
          isLoading={isLoading}
          onSubject1Change={setSubject1Id}
          onTerm1Change={setTerm1}
          onSubject2Change={setSubject2Id}
          onTerm2Change={setTerm2}
          onFocusAreaChange={setFocusArea}
          onSwapTerms={handleSwapTerms}
          onAnalyze={() => handleAnalyze()}
          onSelectPreset={handleSelectPreset}
        />

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Connection Analysis Error</span>
              <p>{error}</p>
            </div>
            <button
              onClick={() => handleAnalyze()}
              className="text-xs font-semibold text-rose-700 underline hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Analysis Results Section */}
        <section id="analysis-section">
          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
              <div className="w-12 h-12 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Synthesizing Interdisciplinary Pathway...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Cross-referencing cellular pathways, anatomical relations, and clinical literature to bridge{" "}
                  <span className="font-semibold text-teal-700">{term1}</span> and{" "}
                  <span className="font-semibold text-indigo-700">{term2}</span>.
                </p>
              </div>
            </div>
          )}

          {!isLoading && analysis && (
            <AnalysisResults
              analysis={analysis}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSave}
              onExploreBranch={handleExploreBranch}
              quiz={quiz}
              isQuizLoading={isQuizLoading}
              onGenerateQuiz={handleGenerateQuiz}
              source={source}
            />
          )}
        </section>

        {/* 19 Subjects Quick Strip */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                The 19 Medical Curriculum Subjects
              </h3>
            </div>
            <button
              onClick={() => setIsMatrixOpen(true)}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Subject Matrix</span>
              <span>➔</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {MEDICAL_SUBJECTS.map((sub, index) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSubject2Id(sub.id);
                  if (sub.highYieldTerms[0]) {
                    setTerm2(sub.highYieldTerms[0]);
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-xs text-slate-700 transition-colors flex items-center gap-1.5"
                title={`Set ${sub.name} as Concept 2`}
              >
                <span className="text-[10px] text-slate-400 font-mono">{index + 1}.</span>
                <span className="font-medium">{sub.shortName}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Medical Connection</span>
            <span>•</span>
            <span>AI-Driven Interdisciplinary Academic & Clinical Synthesis</span>
          </div>
          <p className="text-[11px] text-slate-400">
            For medical academic learning & clinical conceptual cross-referencing.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SubjectMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        onSelectForSubject1={(id) => {
          setSubject1Id(id);
          const s = MEDICAL_SUBJECTS.find((m) => m.id === id);
          if (s && s.highYieldTerms[0]) setTerm1(s.highYieldTerms[0]);
        }}
        onSelectForSubject2={(id) => {
          setSubject2Id(id);
          const s = MEDICAL_SUBJECTS.find((m) => m.id === id);
          if (s && s.highYieldTerms[0]) setTerm2(s.highYieldTerms[0]);
        }}
      />

      <SavedConnectionsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedConnections={savedConnections}
        onLoadConnection={handleLoadSaved}
        onDeleteConnection={handleDeleteSaved}
      />

      <DeploymentModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
      />
    </div>
  );
}
