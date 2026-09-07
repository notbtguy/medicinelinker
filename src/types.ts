export interface MedicalSubject {
  id: string;
  name: string;
  shortName: string;
  phase: "Pre-Clinical" | "Para-Clinical" | "Clinical";
  iconName: string;
  badgeColor: string;
  accentColor: string;
  description: string;
  highYieldTerms: string[];
}

export interface BridgeStep {
  stepNumber: number;
  title: string;
  subject: string;
  mechanism: string;
  anatomicalOrBiochemicalKey: string;
}

export interface ConnectionAnalysis {
  term1: {
    subject: string;
    term: string;
    definition: string;
  };
  term2: {
    subject: string;
    term: string;
    definition: string;
  };
  coreThesis: string;
  connectionStrength: "Direct Causality" | "Systemic Cascade" | "Multifactorial / Syndromic" | "Pharmacotherapeutic Bridge" | string;
  bridgePathway: BridgeStep[];
  pathophysiologicalLink: {
    title: string;
    description: string;
    keyMoleculesOrSystems: string[];
  };
  anatomicalStructuralLink: {
    title: string;
    description: string;
    structuresInvolved: string[];
  };
  clinicalCorrelation: {
    title: string;
    presentation: string;
    diagnosticClues: string[];
    riskFactorsOrComplications: string[];
  };
  pharmacologicalTherapeuticLink: {
    title: string;
    description: string;
    drugClassesOrInterventions: string[];
  };
  clinicalCaseVignette: {
    title: string;
    patientAgeGender: string;
    presentingComplaint: string;
    investigationFindings: string;
    clinicalResolution: string;
  };
  highYieldExamPearls: string[];
  crossSubjectCuriosities: Array<{
    term: string;
    subject: string;
    whyExplore: string;
  }>;
}

export interface QuizQuestion {
  vignette: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PresetConnection {
  id: string;
  subject1: string;
  term1: string;
  subject2: string;
  term2: string;
  badge: string;
  teaser: string;
}

export interface SavedConnection {
  id: string;
  timestamp: number;
  subject1: string;
  term1: string;
  subject2: string;
  term2: string;
  coreThesis: string;
  analysis: ConnectionAnalysis;
}
