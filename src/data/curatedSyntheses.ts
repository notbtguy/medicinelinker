import { ConnectionAnalysis, QuizQuestion } from "../types";

export interface CuratedEntry {
  analysis: ConnectionAnalysis;
  quiz: QuizQuestion;
}

export const CURATED_SYNTHESES: Record<string, CuratedEntry> = {
  "malaria-erythema-nodosum": {
    analysis: {
      term1: {
        subject: "Microbiology",
        term: "Plasmodium falciparum (Malaria)",
        definition:
          "An intracellular protozoan parasite transmitted by female Anopheles mosquitoes that infects human erythrocytes, leading to cyclical hemolysis, severe inflammatory responses, and microvascular sequestration.",
      },
      term2: {
        subject: "Dermatology, Venereology & Leprosy",
        term: "Erythema Nodosum",
        definition:
          "A distinct form of septal panniculitis clinically presenting as exquisitely tender, erythematous, non-ulcerating subcutaneous nodules most commonly distributed symmetrically over the anterior tibial surfaces.",
      },
      coreThesis:
        "The massive release of protozoal antigens and parasitic hemozoin during Plasmodium falciparum schizogony induces an intense systemic pro-inflammatory cytokine storm (TNF-α, IFN-γ, IL-6) and circulating immune complex formation, which precipitates Type III/Type IV hypersensitivity-mediated septal panniculitis (Erythema Nodosum) in dependent pretibial microvasculature.",
      connectionStrength: "Systemic Cascade",
      bridgePathway: [
        {
          stepNumber: 1,
          title: "Intra-Erythrocytic Schizogony & Hemolysis",
          subject: "Microbiology",
          mechanism:
            "Plasmodium falciparum replicates within host red blood cells, leading to periodic synchronous rupture, releasing merozoites, malarial antigens, and crystalline hemozoin into systemic circulation.",
          anatomicalOrBiochemicalKey: "Malarial Antigen / Hemozoin Release",
        },
        {
          stepNumber: 2,
          title: "Endotoxin-Like Toll-Like Receptor Activation",
          subject: "Pathology",
          mechanism:
            "Hemozoin and parasitic GPI anchors bind macrophage TLR-2 and TLR-4, driving transcription of massive pro-inflammatory cytokines including TNF-α, IL-1β, and IL-6.",
          anatomicalOrBiochemicalKey: "TLR-4 / NF-κB / Macrophage Axis",
        },
        {
          stepNumber: 3,
          title: "Immune Complex Deposition in Subcutaneous Venules",
          subject: "General Medicine",
          mechanism:
            "Circulating parasitic antigen-antibody complexes become trapped in the slow-flowing, dependent venules of the pretibial subcutaneous septa, activating complement C3a and C5a.",
          anatomicalOrBiochemicalKey: "Pretibial Subcutaneous Venular Plexus",
        },
        {
          stepNumber: 4,
          title: "Septal Neutrophilic & Histiocytic Infiltration",
          subject: "Dermatology",
          mechanism:
            "Complement chemoattractants summon neutrophils and histiocytes into fibrous interlobular septa of the hypodermis without true necrotizing vasculitis, creating tender inflammatory nodules.",
          anatomicalOrBiochemicalKey: "Miescher's Radial Granulomas / Septal Panniculitis",
        },
      ],
      pathophysiologicalLink: {
        title: "Reactive Hypersensitivity & Cytokine-Driven Panniculitis",
        description:
          "Erythema Nodosum is not an active cutaneous infection by the parasite, but an indirect, hyper-reactive delayed immunological phenomenon. High levels of TNF-alpha and circulating antigens stimulate vascular endothelial adhesion molecules (ICAM-1, VCAM-1) in adipose septa, leading to localized histiocytic aggregation.",
        keyMoleculesOrSystems: ["TNF-alpha", "TLR-2 / TLR-4", "Circulating Immune Complexes", "IL-6"],
      },
      anatomicalStructuralLink: {
        title: "Pretibial Interlobular Septa & Gravity-Dependent Stasis",
        description:
          "The anterior tibial region has poor deep venous valvular cushioning compared to the calf, cold cutaneous temperature, and thin subcutaneous cushion directly overlying the tibia, causing sluggish venular flow and preferential deposition of bulky circulating immune complexes.",
        structuresInvolved: [
          "Hypodermal Fibrous Septa",
          "Pretibial Subcutaneous Venous Plexus",
          "Anterior Compartment Fascia of Leg",
        ],
      },
      clinicalCorrelation: {
        title: "Post-Infectious Reactive Dermatosis Following Tropical Fever",
        presentation:
          "A patient recovering from or actively treated for acute falciparum malaria develops sudden, painful, bilateral, warm red nodules on the anterior shins that bruise through green-yellow stages (erythema contusiformis) without ulcerating.",
        diagnosticClues: [
          "Recent travel to malaria-endemic region with documented febrile paroxysms",
          "Tender pretibial subcutaneous nodules that do not break down into ulcers",
          "Biopsy showing septal panniculitis with Miescher's radial microgranulomas and absent leukocytoclastic vasculitis",
        ],
        riskFactorsOrComplications: [
          "Incomplete parasitic clearance or delayed artemisinin therapy",
          "Concurrent secondary streptococcal or mycobacterial exposure",
          "Severe chronic inflammatory state precipitating arthritis or arthralgia",
        ],
      },
      pharmacologicalTherapeuticLink: {
        title: "Eradication of Parasitic Trigger & Anti-inflammatory Palliation",
        description:
          "Targeting the underlying microbiology using Artemisinin-based Combination Therapies (ACTs - e.g., Artemether-Lumefantrine) terminates the antigenic reservoir. Cutaneous inflammation is managed conservatively with leg elevation, NSAIDs (e.g., Naproxen), or potassium iodide; systemic corticosteroids should be avoided during active untreated parasitemia.",
        drugClassesOrInterventions: [
          "Artemisinin-based Combination Therapy (ACT)",
          "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)",
          "Rest, Leg Elevation & Compression",
        ],
      },
      clinicalCaseVignette: {
        title: "The Recurrent Febrile Traveler with Painful Shin Plaques",
        patientAgeGender: "32-year-old male geologist",
        presentingComplaint:
          "Severe anterior shin tenderness and fever spikes that began 10 days after returning from rural fieldwork in Ghana.",
        investigationFindings:
          "Thin and thick blood smear confirms Plasmodium falciparum ring forms (3.5% parasitemia). Elevated ESR (68 mm/hr) and CRP (45 mg/L). Punch biopsy of a pretibial nodule demonstrates marked expansion of subcutaneous septa with histiocytic and lymphocytic infiltration, consistent with acute Erythema Nodosum.",
        clinicalResolution:
          "Initiation of oral Artemether-Lumefantrine cleared the peripheral parasitemia within 72 hours. Bed rest, bilateral lower extremity elevation, and a 10-day course of Naproxen resulted in complete flattening and resolution of all shin nodules without permanent scarring.",
      },
      highYieldExamPearls: [
        "Erythema Nodosum is a prototype of SEPTAL panniculitis WITHOUT primary vasculitis; lobular panniculitis without vasculitis is seen in Erythema Induratum (Bazin's disease).",
        "Miescher's radial microgranulomas (aggregates of histiocytes surrounding a tiny cleft) are pathognomonic histological features of acute Erythema Nodosum.",
        "Remember the 'NO-PILLS' mnemonic for Erythema Nodosum: No cause (idiopathic), OCPs/Pregnancy, Penicillin/Sulfonamides, Infections (TB, Strep, Leprosy, Malaria), Leukemia/Lymphoma, Sarcoidosis.",
      ],
      crossSubjectCuriosities: [
        {
          term: "Blackwater Fever (Massive Intravascular Hemolysis)",
          subject: "Pathology",
          whyExplore:
            "Severe hemoglobinuria and acute tubular necrosis induced by quinine therapy or overwhelming P. falciparum erythrocyte lysis.",
        },
        {
          term: "Erythema Induratum of Bazin",
          subject: "Dermatology",
          whyExplore:
            "A posterior calf lobular panniculitis associated with Mycobacterium tuberculosis, contrasting sharply with anterior septal EN.",
        },
        {
          term: "Artemisinin Resistance & Kelch13 Mutations",
          subject: "Pharmacology",
          whyExplore:
            "Genetic mutations in the PfKelch13 gene leading to delayed parasitic clearance in Southeast Asia and Africa.",
        },
      ],
    },
    quiz: {
      vignette:
        "A 32-year-old traveler presents with intense bilateral anterior shin pain and firm, warm, non-ulcerating red nodules 12 days after treatment for Plasmodium falciparum malaria. Skin biopsy demonstrates marked inflammatory thickening of the interlobular subcutaneous septa with collections of histiocytes and lymphocytes, without necrotizing vasculitis.",
      question:
        "Which of the following pathophysiological mechanisms accounts for the appearance of these dermatological lesions?",
      options: [
        "Direct cutaneous infiltration and proliferation of Plasmodium falciparum merozoites in subcutaneous adipocytes",
        "Type III/IV delayed hypersensitivity reaction with immune complex deposition in pretibial adipose septa",
        "Type I IgE-mediated degranulation causing mast cell extravasation and dermal urticarial plaques",
        "Primary necrotizing leukocytoclastic vasculitis of medium-sized dermal muscular arteries",
        "Direct thrombotic occlusion of dermal capillaries by sickled parasitemic erythrocytes",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Erythema Nodosum is a reactive septal panniculitis triggered by systemic antigenic stimulation, including severe infections like Plasmodium falciparum. It is mediated by delayed-type hypersensitivity and immune complex deposition in the septa of subcutaneous fat, rather than direct parasitic invasion of the skin.",
    },
  },

  "mitral-stenosis-ortner": {
    analysis: {
      term1: {
        subject: "General Medicine",
        term: "Mitral Valve Stenosis",
        definition:
          "A valvular heart condition, most commonly a late sequela of acute rheumatic fever, characterized by narrowing of the mitral valve orifice that impairs blood flow from the left atrium into the left ventricle.",
      },
      term2: {
        subject: "Otorhinolaryngology (ENT)",
        term: "Hoarseness / Ortner's Syndrome",
        definition:
          "Cardiovocal syndrome wherein hoarseness of voice arises from mechanical compression and paralysis of the left recurrent laryngeal nerve against adjacent cardiovascular structures.",
      },
      coreThesis:
        "Severe Mitral Valve Stenosis elevates left atrial pressures and causes progressive left atrial enlargement and pulmonary arterial hypertension, which displaces the pulmonary artery superiorly and compresses the left recurrent laryngeal nerve against the aortic arch within the aortopulmonary window, resulting in left vocal cord palsy (Ortner's Syndrome).",
      connectionStrength: "Direct Causality",
      bridgePathway: [
        {
          stepNumber: 1,
          title: "Rheumatic Scarring & Orifice Narrowing",
          subject: "Pathology",
          mechanism:
            "Post-streptococcal cross-reactive antibodies and Aschoff bodies produce commissural fusion, leaflet thickening, and shortening of chordae tendineae.",
          anatomicalOrBiochemicalKey: "Mitral Valve Leaflets & Chordae",
        },
        {
          stepNumber: 2,
          title: "Left Atrial Pressure & Volume Overload",
          subject: "General Medicine",
          mechanism:
            "Impaired diastolic emptying into the left ventricle causes chronic elevation of left atrial pressure (>25 mmHg), resulting in massive left atrial chamber dilatation.",
          anatomicalOrBiochemicalKey: "Left Atrial Myocardium & Posterior Mediastinum",
        },
        {
          stepNumber: 3,
          title: "Pulmonary Arterial Hypertension & Truncus Elevation",
          subject: "Physiology",
          mechanism:
            "Retrograde transmission of elevated pressures through pulmonary veins generates pulmonary venous congestion and reactive pulmonary arterial hypertension, dilating the pulmonary trunk.",
          anatomicalOrBiochemicalKey: "Left Pulmonary Artery / Aortopulmonary Window",
        },
        {
          stepNumber: 4,
          title: "Nerve Entrapment & Left Vocal Fold Atrophy",
          subject: "Otorhinolaryngology (ENT)",
          mechanism:
            "The left recurrent laryngeal nerve, which loops under the aortic arch at the ligamentum arteriosum, is crushed against the aorta by the dilated pulmonary artery and left atrium, causing denervation of intrinsic laryngeal muscles.",
          anatomicalOrBiochemicalKey: "Left Recurrent Laryngeal Nerve / Posterior Cricoarytenoid",
        },
      ],
      pathophysiologicalLink: {
        title: "Hemodynamic Obstruction to Mediastinal Nerve Compression",
        description:
          "The mechanical obstacle at the mitral valve forces compensatory chamber dilation. Because the mediastinum is an anatomically rigid compartment bounded by the vertebral column posteriorly and the sternum anteriorly, chamber expansion directly compresses compliant neurovascular structures.",
        keyMoleculesOrSystems: ["Left Atrial Dilation", "Pulmonary Arterial Hypertension", "Ligamentum Arteriosum Axis"],
      },
      anatomicalStructuralLink: {
        title: "The Aortopulmonary Window Trajectory of the Left Recurrent Laryngeal Nerve",
        description:
          "Unlike the right recurrent laryngeal nerve (which hooks under the right subclavian artery in the neck), the left nerve descends into the superior mediastinum, loops under the aortic arch immediately lateral to the ligamentum arteriosum, and ascends in the tracheoesophageal groove. A 2-3 cm expansion in pulmonary artery or left atrium obliterates this narrow window.",
        structuresInvolved: [
          "Left Recurrent Laryngeal Nerve (CN X)",
          "Aortopulmonary Window",
          "Ligamentum Arteriosum",
          "Dilated Left Pulmonary Artery",
        ],
      },
      clinicalCorrelation: {
        title: "Cardiovocal Syndrome (Ortner's Syndrome)",
        presentation:
          "A female patient in her 40s presents with progressive breathy hoarseness of voice, low-pitched diastolic rumbling murmur at the apex, dyspnea on exertion, and orthopnea.",
        diagnosticClues: [
          "Laryngoscopy demonstrates left vocal cord fixed in the paramedian or cadaveric position",
          "Transthoracic echocardiogram reveals thickened, calcified mitral leaflets with 'hockey-stick' anterior leaflet motion and planimetry orifice < 1.0 cm²",
          "Chest radiograph reveals double right cardiac border (left atrial enlargement), splaying of the subcarinal angle (>90°), and fullness of the pulmonary bay",
        ],
        riskFactorsOrComplications: [
          "Untreated Rheumatic Heart Disease",
          "Atrial Fibrillation with Left Atrial Appendage Thrombus",
          "Irreversible recurrent laryngeal axonotmesis if compression is prolonged",
        ],
      },
      pharmacologicalTherapeuticLink: {
        title: "Diuresis, Rate Control & Valvuloplasty Intervention",
        description:
          "Initial medical management utilizes loop diuretics (Furosemide) and beta-blockers to prolong diastole and decrease left atrial volume. Definitive decompression requires Percutaneous Balloon Mitral Valvotomy (PBMV) or surgical Mitral Valve Replacement, which can promptly relieve nerve compression if performed early.",
        drugClassesOrInterventions: [
          "Loop Diuretics (Furosemide)",
          "Beta-Adrenergic Blockers (Metoprolol) / Digoxin",
          "Percutaneous Transvenous Mitral Commissurotomy (PTMC)",
        ],
      },
      clinicalCaseVignette: {
        title: "The Dyspneic Soprano with Sudden Voice Failure",
        patientAgeGender: "44-year-old woman",
        presentingComplaint:
          "Progressive voice weakness and inability to project her voice over 3 months, accompanied by worsening shortness of breath when climbing stairs.",
        investigationFindings:
          "Direct laryngoscopy reveals complete paralysis of the left vocal fold with normal overlying mucosa. Echocardiogram demonstrates severe mitral stenosis (mitral valve area 0.8 cm², mean gradient 14 mmHg) and massive left atrial enlargement (volume index 62 mL/m²). Chest CT confirms compression of the left recurrent laryngeal nerve between the dilated left pulmonary artery and the aortic arch.",
        clinicalResolution:
          "The patient underwent successful Percutaneous Balloon Mitral Valvotomy. Post-procedure mitral area expanded to 1.9 cm² with normalization of left atrial pressures; left vocal cord mobility and normal voice quality returned completely by 12 weeks post-procedure.",
      },
      highYieldExamPearls: [
        "Ortner's Syndrome (Cardiovocal Syndrome) is hoarseness due to left recurrent laryngeal nerve compression caused by cardiovascular pathology (most classically Mitral Stenosis, but also aortic aneurysm).",
        "The left recurrent laryngeal nerve is vulnerable because of its long mediastinal course looping around the aortic arch; the right recurrent laryngeal loops much higher around the subclavian artery.",
        "On chest X-ray, left atrial enlargement produces 'splaying of the carina' (subcarinal angle widening beyond 90 degrees) and a 'double-density' heart border.",
      ],
      crossSubjectCuriosities: [
        {
          term: "Pancoast Tumor & Horner's Syndrome",
          subject: "Radiology",
          whyExplore:
            "Apical thoracic tumors compressing the cervical sympathetic chain, comparing thoracic neural compression pathways.",
        },
        {
          term: "Aschoff Nodules & Anitschkow Cells",
          subject: "Pathology",
          whyExplore:
            "The pathognomonic pathognomonic histopathological features of rheumatic carditis displaying 'caterpillar' chromatin nuclei.",
        },
        {
          term: "Intrinsic Laryngeal Muscles Anatomy",
          subject: "Anatomy",
          whyExplore:
            "All intrinsic laryngeal muscles are supplied by the recurrent laryngeal nerve EXCEPT the cricothyroid (supplied by the external laryngeal nerve).",
        },
      ],
    },
    quiz: {
      vignette:
        "A 46-year-old woman presents to an ENT clinic with a 4-month history of painless, progressive hoarseness. Direct fiberoptic laryngoscopy reveals complete immobility of the left vocal cord in the paramedian position. Auscultation of the chest reveals a loud first heart sound, an opening snap, and a low-pitched mid-diastolic rumbling murmur best heard at the apex in the left lateral decubitus position.",
      question:
        "At which specific anatomical landmark is the involved nerve mechanically compressed in this clinical condition?",
      options: [
        "In the carotid sheath between the internal jugular vein and common carotid artery",
        "Within the aortopulmonary window between the dilated pulmonary artery and the aortic arch",
        "Underneath the right subclavian artery at the root of the neck",
        "Between the posterior cricoid lamina and the upper esophageal sphincter",
        "Within the stylomastoid foramen at the base of the skull",
      ],
      correctAnswerIndex: 1,
      explanation:
        "In Ortner's syndrome (cardiovocal syndrome) caused by severe mitral stenosis, the left recurrent laryngeal nerve is compressed against the aortic arch in the aortopulmonary window by the dilated left pulmonary artery and enlarged left atrium. The right nerve does not enter the thorax and loops under the right subclavian artery.",
    },
  },

  "ankylosing-uveitis": {
    analysis: {
      term1: {
        subject: "Orthopaedics",
        term: "Ankylosing Spondylitis (Bamboo Spine)",
        definition:
          "A chronic, progressive inflammatory seronegative spondyloarthropathy primarily affecting the axial skeleton, sacroiliac joints, and spinal entheses, leading to bony fusion and syndesmophyte formation.",
      },
      term2: {
        subject: "Ophthalmology",
        term: "Anterior Uveitis (Iridocyclitis)",
        definition:
          "Inflammation of the iris and ciliary body of the uveal tract, manifesting with ciliary flush, anterior chamber cells and flare, hypopyon, and photophobia.",
      },
      coreThesis:
        "Ankylosing Spondylitis and acute Anterior Uveitis are genetically bound by strong linkage to HLA-B27; aberrant peptide presentation, misfolded MHC heavy chains, and IL-23/IL-17 axis hyperactivation trigger targeted entheseal and intraocular vascular inflammation.",
      connectionStrength: "Direct Causality",
      bridgePathway: [
        {
          stepNumber: 1,
          title: "Genetic Predisposition: HLA-B27 Expression",
          subject: "Biochemistry",
          mechanism:
            "Inheritance of HLA-B27 (MHC Class I allele) leads to formation of heavy chain homodimers and endoplasmic reticulum stress during protein folding.",
          anatomicalOrBiochemicalKey: "MHC Class I Heavy Chain / ER Stress / UPR",
        },
        {
          stepNumber: 2,
          title: "Gut Microbiome & IL-23 / IL-17 Axis Activation",
          subject: "Microbiology",
          mechanism:
            "Subclinical gut mucosal barrier dysbiosis allows microbial peptidoglycan translocation, stimulating dendritic cells to produce IL-23, activating entheseal and uveal Th17 cells.",
          anatomicalOrBiochemicalKey: "IL-23 / IL-17 Inflammatory Axis",
        },
        {
          stepNumber: 3,
          title: "Axial Enthesitis & Syndesmophyte Formation",
          subject: "Orthopaedics",
          mechanism:
            "Mechanical stress at spinal entheses triggers bone erosion followed by paradoxical chondrocyte metaplasia and syndesmophytes, fusing the vertebral column ('Bamboo Spine').",
          anatomicalOrBiochemicalKey: "Sacroiliac Joints & Annulus Fibrosus Entheses",
        },
        {
          stepNumber: 4,
          title: "Uveal Microvascular Breakdown & Ocular Attack",
          subject: "Ophthalmology",
          mechanism:
            "Activated Th17 cells and TNF-α break down the blood-aqueous barrier in the iris and ciliary body, pouring leukocytes (cells) and protein (flare) into the anterior chamber.",
          anatomicalOrBiochemicalKey: "Blood-Aqueous Barrier / Iris / Ciliary Body",
        },
      ],
      pathophysiologicalLink: {
        title: "HLA-B27 Misfolding, Molecular Mimicry & The IL-17 Highway",
        description:
          "Up to 90% of patients with Ankylosing Spondylitis and 50% with acute anterior uveitis possess the HLA-B27 allele. Entheses and the anterior uvea share high biomechanical and vascular shear stresses, making them primary sites for IL-17-mediated damage.",
        keyMoleculesOrSystems: ["HLA-B27", "IL-17A", "IL-23", "TNF-alpha"],
      },
      anatomicalStructuralLink: {
        title: "Entheseal Connective Tissue & Ciliary Body Stroma",
        description:
          "Both spinal ligaments inserting into periosteum (entheses) and the ciliary body-iris root complex are rich in type II and type IX collagens, proteoglycans, and dense resident populations of gamma-delta T cells.",
        structuresInvolved: ["Sacroiliac Joints", "Anterior Chamber Angle", "Iris Stroma", "Supraspinal Ligaments"],
      },
      clinicalCorrelation: {
        title: "Seronegative Spondyloarthropathy with Red Eye Paroxysms",
        presentation:
          "A 28-year-old male presents with morning stiffness in the lower back lasting >60 minutes, alternating buttock pain, and acute unilateral painful photophobic red eye.",
        diagnosticClues: [
          "Positive Schober's test (<5 cm expansion on lumbar flexion)",
          "Pelvic radiograph shows bilateral Grade 3-4 sacroiliitis with sclerosis and joint space obliteration",
          "Slit-lamp examination reveals circumcorneal ciliary injection with fine keratic precipitates and grade 3+ cells and flare in the anterior chamber",
        ],
        riskFactorsOrComplications: [
          "Posterior synechiae formation causing irregular pupil and secondary glaucoma",
          "Complete spinal ankylosis with cervical spine fracture after trivial trauma",
          "Aortic root dilation and aortic regurgitation",
        ],
      },
      pharmacologicalTherapeuticLink: {
        title: "Topical Mydriatics, Steroids & Targeted Biologics",
        description:
          "Ocular emergencies require immediate topical cycloplegics/mydriatics (Atropine or Cyclopentolate) to prevent posterior synechiae, combined with potent topical corticosteroid drops (Prednisolone acetate). Systemic spinal disease is treated with TNF-α inhibitors (Adalimumab, Infliximab) or IL-17 inhibitors (Secukinumab). Note: Etanercept is effective for spine but less effective for preventing uveitis flares.",
        drugClassesOrInterventions: [
          "Topical Corticosteroids (Prednisolone Acetate 1%)",
          "Cycloplegic/Mydriatic Drops (Cyclopentolate / Atropine)",
          "Monoclonal anti-TNF antibodies (Adalimumab / Infliximab)",
        ],
      },
      clinicalCaseVignette: {
        title: "The Stiff Engineer with the Blinding Red Eye",
        patientAgeGender: "29-year-old software architect",
        presentingComplaint:
          "Sudden onset of severe, throbbing pain, photophobia, and decreased vision in his left eye for 48 hours, alongside chronic lower back pain that improves with exercise.",
        investigationFindings:
          "Slit lamp exam: intense left ciliary flush, 3+ inflammatory cells in anterior chamber with fibrin strands, and early iris adhesion to the anterior lens capsule. Lumbosacral X-ray demonstrates squaring of vertebral bodies and bilateral sacroiliac joint sclerosis. HLA-B27 PCR is strongly positive.",
        clinicalResolution:
          "Intensive topical 1% prednisolone acetate hourly and cyclopentolate drops aborted the uveitis attack and broke the early posterior synechiae within 5 days. For chronic axial inflammation, he was initiated on subcutaneous Adalimumab, which provided dramatic spinal pain relief and prevented subsequent ocular recurrences.",
      },
      highYieldExamPearls: [
        "Acute anterior uveitis is the most common extra-articular manifestation of Ankylosing Spondylitis (occurring in 25-40% of patients).",
        "HLA-B27 associated anterior uveitis is characteristically UNILATERAL, acute in onset, recurrent, and alternating between eyes.",
        "Monoclonal TNF inhibitors (Infliximab, Adalimumab) significantly decrease the recurrence rate of uveitis, whereas soluble TNF receptor fusion protein (Etanercept) is noticeably less effective for uveitis.",
      ],
      crossSubjectCuriosities: [
        {
          term: "Reactive Arthritis (Reiter's Syndrome)",
          subject: "Microbiology",
          whyExplore:
            "The classic triad of urethritis, conjunctivitis, and arthritis triggered by Chlamydia trachomatis or Campylobacter.",
        },
        {
          term: "Syndesmophytes vs Osteophytes",
          subject: "Radiology",
          whyExplore:
            "Syndesmophytes grow vertically from the annulus fibrosus in spondyloarthropathies, whereas degenerative osteophytes project horizontally.",
        },
        {
          term: "HLA-B51 and Behçet's Disease",
          subject: "Pathology",
          whyExplore:
            "Another HLA-linked disease presenting with severe hypopyon uveitis and oral/genital aphthous ulcers.",
        },
      ],
    },
    quiz: {
      vignette:
        "A 30-year-old man presents with acute-onset photophobia, deep ocular pain, and blurred vision in his right eye. Slit-lamp biomicroscopy reveals ciliary injection, 3+ leukocytes in the anterior chamber, and keratic precipitates. Upon questioning, he reports a 2-year history of morning back stiffness that eases after playing tennis. Radiography of the pelvis shows bilateral symmetrical sacroiliitis.",
      question:
        "Which of the following biologic agents is LEAST effective at preventing recurrent episodes of this patient's ocular condition, despite being effective for his axial arthritis?",
      options: [
        "Adalimumab",
        "Infliximab",
        "Etanercept",
        "Golimumab",
        "Certolizumab pegol",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Etanercept is a recombinant human TNF-receptor p75 Fc fusion protein. While effective for axial symptoms in ankylosing spondylitis, clinical trials and registry data demonstrate it is significantly less effective at preventing or treating acute anterior uveitis compared to monoclonal antibodies directed against TNF-α (such as Adalimumab or Infliximab).",
    },
  },
};

export function findCuratedSynthesis(
  term1: string,
  subject1: string,
  term2: string,
  subject2: string
): CuratedEntry | null {
  const t1 = term1.toLowerCase();
  const t2 = term2.toLowerCase();
  const s1 = subject1.toLowerCase();
  const s2 = subject2.toLowerCase();

  // 1. Check direct matches
  if (
    (t1.includes("malaria") || t1.includes("falciparum")) &&
    (t2.includes("erythema") || t2.includes("nodosum"))
  ) {
    return CURATED_SYNTHESES["malaria-erythema-nodosum"];
  }
  if (
    (t2.includes("malaria") || t2.includes("falciparum")) &&
    (t1.includes("erythema") || t1.includes("nodosum"))
  ) {
    return CURATED_SYNTHESES["malaria-erythema-nodosum"];
  }

  if (
    (t1.includes("mitral") || t1.includes("stenosis")) &&
    (t2.includes("ortner") || t2.includes("hoarse") || t2.includes("laryngeal"))
  ) {
    return CURATED_SYNTHESES["mitral-stenosis-ortner"];
  }
  if (
    (t2.includes("mitral") || t2.includes("stenosis")) &&
    (t1.includes("ortner") || t1.includes("hoarse") || t1.includes("laryngeal"))
  ) {
    return CURATED_SYNTHESES["mitral-stenosis-ortner"];
  }

  if (
    (t1.includes("ankylosing") || t1.includes("spondylitis") || t1.includes("bamboo")) &&
    (t2.includes("uveitis") || t2.includes("iridocyclitis") || t2.includes("eye"))
  ) {
    return CURATED_SYNTHESES["ankylosing-uveitis"];
  }
  if (
    (t2.includes("ankylosing") || t2.includes("spondylitis") || t2.includes("bamboo")) &&
    (t1.includes("uveitis") || t1.includes("iridocyclitis") || t1.includes("eye"))
  ) {
    return CURATED_SYNTHESES["ankylosing-uveitis"];
  }

  return null;
}
