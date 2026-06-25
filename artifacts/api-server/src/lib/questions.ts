// Fall Self-Assessment — Dr. Geoff Angell's methodology.
//
// His "Determining Fall Risk" section is built on the Timed Up and Go (TUG) Test:
// the user times how long it takes to stand from a chair, walk ten feet, turn,
// walk back, and sit down, then compares the time to standard data:
//   < 10 seconds   -> Low fall risk
//   10–14.9 seconds -> Moderate fall risk
//   > 15 seconds   -> High fall risk
//
// His "What causes falls?" section lists the common causes of unsteadiness and
// asks: "Did you recognize anything in the list above that might cause you to
// become unsteady and fall?" That list is offered here as a multi-select
// checklist so the result can point members to the most relevant steps.
//
// The assessment is submitted as `answers: [{questionId, value}]`:
//   - { questionId: "tug-seconds", value: "12.4" }   (or value "unable")
//   - { questionId: "risk-factors", value: "muscle-weakness,poor-balance" }

export const RISK_FACTORS = [
  { value: "muscle-joint-stiffness", label: "Muscle or joint stiffness" },
  { value: "poor-endurance", label: "Poor endurance" },
  { value: "muscle-weakness", label: "Muscle weakness" },
  { value: "reduced-sensation", label: "Reduced sensation" },
  { value: "poor-balance", label: "Poor balance" },
  { value: "dizziness", label: "Dizziness" },
  { value: "altered-posture", label: "Altered posture" },
  { value: "low-vision", label: "Low vision" },
  { value: "pain", label: "Pain" },
  { value: "impulsive-movements", label: "Impulsive movements" },
  { value: "abnormal-walking", label: "Abnormal walking patterns" },
  { value: "decreased-cognition", label: "Decreased cognition" },
  { value: "limited-safety-awareness", label: "Limited safety awareness" },
  { value: "low-acceptance-disability", label: "Low acceptance of disability" },
  { value: "reduced-short-term-memory", label: "Reduced short-term memory" },
  { value: "incontinence", label: "Incontinence" },
  { value: "polypharmacy", label: "Polypharmacy (multiple medications)" },
  { value: "medication-side-effects", label: "Adverse medication side effects" },
  { value: "poor-fluid-intake", label: "Poor fluid intake" },
  { value: "inadequate-nutrition", label: "Inadequate nutrition" },
  { value: "poor-footwear", label: "Poorly fitting footwear" },
  { value: "improper-mobility-device", label: "Improperly prescribed or fitted mobility devices" },
  { value: "assistive-device-nonuse", label: "Assistive device non-use" },
  { value: "cluttered-home", label: "Cluttered home environment" },
  { value: "poor-lighting", label: "Poor lighting" },
  { value: "unsafe-terrain", label: "Unsafe / unlevel terrain" },
  { value: "lacking-equipment", label: "Lack of medical equipment in high-risk areas (e.g., shower, toilet)" },
] as const;

// Exposed via GET /assessment/questions. The TUG timer is handled as its own
// step in the UI; this endpoint provides Dr. Angell's risk-factor checklist
// ("What causes falls?") as a single multi-select question.
export const assessmentQuestions = [
  {
    id: "risk-factors",
    category: "What causes falls?",
    prompt: "Which of these might cause you to become unsteady and fall? Select all that apply.",
    helpText:
      "There are many factors that can cause unsteadiness. Understanding what causes your own unsteadiness is the key to improving your safety — it pinpoints the most likely reason you might fall.",
    options: RISK_FACTORS.map((rf) => ({ value: rf.value, label: rf.label, score: 1 })),
  },
] as const;

export type AssessmentQuestion = (typeof assessmentQuestions)[number];

export type RiskLevel = "low" | "moderate" | "high";

// TUG thresholds, per Dr. Angell's standard data table.
const TUG_MODERATE_THRESHOLD = 10; // seconds
const TUG_HIGH_THRESHOLD = 15; // seconds

function parseTug(answers: { questionId: string; value: string }[]): {
  seconds: number | null;
  unable: boolean;
} {
  const a = answers.find((x) => x.questionId === "tug-seconds");
  if (!a) return { seconds: null, unable: false };
  if (a.value.trim().toLowerCase() === "unable") return { seconds: null, unable: true };
  const n = Number.parseFloat(a.value);
  return { seconds: Number.isFinite(n) ? n : null, unable: false };
}

function recognizedFactors(answers: { questionId: string; value: string }[]): string[] {
  const a = answers.find((x) => x.questionId === "risk-factors");
  if (!a) return [];
  return a.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function scoreAssessment(
  answers: { questionId: string; value: string }[],
): {
  score: number;
  level: RiskLevel;
  headline: string;
  summary: string;
  recommendations: string[];
} {
  const { seconds, unable } = parseTug(answers);
  const factors = recognizedFactors(answers);
  const factorCount = factors.length;

  // Determine risk level from the TUG result.
  let level: RiskLevel;
  let score: number;
  if (unable) {
    // Being unable to complete the TUG safely is itself a high-risk indicator.
    level = "high";
    score = TUG_HIGH_THRESHOLD;
  } else if (seconds == null) {
    // No measured time — fall back to a conservative moderate result.
    level = "moderate";
    score = 0;
  } else {
    score = Math.round(seconds);
    if (seconds < TUG_MODERATE_THRESHOLD) level = "low";
    else if (seconds < TUG_HIGH_THRESHOLD) level = "moderate";
    else level = "high";
  }

  const timePhrase = unable
    ? "You indicated you were unable to complete the Timed Up and Go (TUG) Test."
    : seconds == null
      ? "We did not record a Timed Up and Go (TUG) time."
      : `Your Timed Up and Go (TUG) time was about ${seconds % 1 === 0 ? seconds : seconds.toFixed(1)} seconds.`;

  const factorPhrase =
    factorCount > 0
      ? ` You also recognized ${factorCount} factor${factorCount === 1 ? "" : "s"} from Dr. Angell's "what causes falls" list that may apply to you — pay special attention to the related steps of the plan.`
      : "";

  let headline: string;
  let summary: string;
  const recommendations: string[] = [];

  if (level === "low") {
    headline = "Your fall risk looks low.";
    summary = `${timePhrase} A TUG time under 10 seconds corresponds to a low fall risk. The goal now is to maintain and protect your balance.${factorPhrase}`;
    recommendations.push(
      "Keep your balance sharp with a higher-level Balance Program (Level 5 or 6).",
      "Continue regular strength and endurance exercise from the Strength Training step.",
      "Stay current with eye exams and an annual medication review.",
      "Revisit any risk factors you recognized above and address the related steps.",
    );
  } else if (level === "moderate") {
    headline = "You have a moderate fall risk worth addressing.";
    summary = `${timePhrase} A TUG time of 10 to 14.9 seconds corresponds to a moderate fall risk. These are exactly the kinds of factors the 10-step plan is built to address, one step at a time.${factorPhrase}`;
    recommendations.push(
      "Work through the 10-step Personalized Fall Prevention Plan.",
      "Begin the Level 3 Balance Program (Moderate Fall Risk) and a Home Exercise Program.",
      "Review your footwear, vision, and medications (Steps 2, 3, and 4).",
      "Address the specific risk factors you recognized above.",
    );
  } else {
    headline = "Your result suggests a higher fall risk that deserves attention.";
    summary = `${timePhrase} ${unable ? "Being unable to complete the test, or" : "A TUG time over 15 seconds,"} corresponds to a high fall risk. Higher risk is not the same as inevitable — most of these factors can be changed.${factorPhrase}`;
    recommendations.push(
      "Talk with your doctor about your fall risk (sooner is better).",
      "Start the Level 1 Balance Program (High Fall Risk) and the Level 1 Home Exercise Program.",
      "Consider whether an assistive device would help (Step 8 and Appendix A).",
      "Make your home safer (Step 7 and Appendix B — Home Safety Modifications & Equipment).",
      "Work through the full 10-step Personalized Fall Prevention Plan.",
    );
  }

  return { score, level, headline, summary, recommendations };
}
