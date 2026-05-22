export const assessmentQuestions = [
  {
    id: "history-fallen",
    category: "history",
    prompt: "Have you fallen in the past year?",
    helpText: "Any unintended slip, trip, or loss of balance that brought you to the ground counts.",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "once", label: "Yes, once", score: 2 },
      { value: "multiple", label: "Yes, more than once", score: 4 },
    ],
  },
  {
    id: "history-injury",
    category: "history",
    prompt: "If you have fallen, did any fall cause an injury?",
    helpText: "Bruises, sprains, fractures, or anything that needed medical attention.",
    options: [
      { value: "na", label: "I have not fallen", score: 0 },
      { value: "no", label: "No injury", score: 1 },
      { value: "minor", label: "Minor injury", score: 2 },
      { value: "serious", label: "Serious injury", score: 4 },
    ],
  },
  {
    id: "mobility-unsteady",
    category: "mobility",
    prompt: "Do you sometimes feel unsteady when walking or standing?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 2 },
      { value: "often", label: "Often", score: 3 },
    ],
  },
  {
    id: "mobility-support",
    category: "mobility",
    prompt: "Do you steady yourself by holding onto furniture when walking at home?",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "yes", label: "Yes", score: 2 },
    ],
  },
  {
    id: "mobility-aid",
    category: "mobility",
    prompt: "Do you use a cane, walker, or other device to get around?",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "always", label: "Always", score: 2 },
    ],
  },
  {
    id: "mobility-chair",
    category: "mobility",
    prompt: "Do you need to push with your hands to stand up from a chair?",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "yes", label: "Yes", score: 2 },
    ],
  },
  {
    id: "fear",
    category: "psychological",
    prompt: "Are you worried about falling?",
    helpText: "Even mild worry counts. Many people who worry about falls limit what they do, which actually raises their risk.",
    options: [
      { value: "no", label: "Not at all", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
    ],
  },
  {
    id: "vision",
    category: "vision",
    prompt: "Have you had your vision checked in the last year?",
    options: [
      { value: "yes", label: "Yes, within the last year", score: 0 },
      { value: "longer", label: "More than a year ago", score: 1 },
      { value: "never", label: "Not that I remember", score: 2 },
    ],
  },
  {
    id: "meds-count",
    category: "medications",
    prompt: "Do you take four or more prescription medications each day?",
    helpText: "Many medications, especially together, can cause dizziness or unsteadiness.",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "yes", label: "Yes", score: 2 },
    ],
  },
  {
    id: "meds-sleep",
    category: "medications",
    prompt: "Do you take medication that sometimes makes you sleepy or lightheaded?",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "yes", label: "Yes", score: 2 },
    ],
  },
  {
    id: "home-rugs",
    category: "home",
    prompt: "Are there loose rugs, cords, or clutter on the floors where you walk most often?",
    options: [
      { value: "no", label: "No", score: 0 },
      { value: "yes", label: "Yes", score: 1 },
    ],
  },
  {
    id: "home-bath",
    category: "home",
    prompt: "Does your bathroom have grab bars next to the tub, shower, and toilet?",
    options: [
      { value: "yes", label: "Yes, all of them", score: 0 },
      { value: "some", label: "Some of them", score: 1 },
      { value: "none", label: "No grab bars", score: 2 },
    ],
  },
  {
    id: "home-stairs",
    category: "home",
    prompt: "Do the stairways in your home have sturdy handrails on both sides?",
    options: [
      { value: "yes", label: "Yes", score: 0 },
      { value: "one", label: "Only one side", score: 1 },
      { value: "no", label: "No handrails", score: 2 },
      { value: "na", label: "No stairs in my home", score: 0 },
    ],
  },
  {
    id: "activity",
    category: "activity",
    prompt: "Do you exercise or do balance activities at least twice a week?",
    helpText: "Even short walks count. Specific balance work counts the most.",
    options: [
      { value: "often", label: "Yes, regularly", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "rarely", label: "Rarely or never", score: 2 },
    ],
  },
] as const;

export type AssessmentQuestion = typeof assessmentQuestions[number];

export function scoreAssessment(
  answers: { questionId: string; value: string }[],
): {
  score: number;
  level: "low" | "moderate" | "high";
  headline: string;
  summary: string;
  recommendations: string[];
} {
  let score = 0;
  for (const ans of answers) {
    const q = assessmentQuestions.find((qq) => qq.id === ans.questionId);
    if (!q) continue;
    const opt = q.options.find((o) => o.value === ans.value);
    if (opt) score += opt.score;
  }

  let level: "low" | "moderate" | "high";
  let headline: string;
  let summary: string;
  const recommendations: string[] = [];

  if (score <= 6) {
    level = "low";
    headline = "Your current fall risk looks low.";
    summary =
      "Your answers suggest you are managing the most common risk factors well. The best next step is to keep doing what you are doing and add a little structured balance practice each week.";
    recommendations.push(
      "Walk for 20 to 30 minutes most days of the week.",
      "Add two short balance practice sessions each week — even five minutes counts.",
      "Have your vision and medications reviewed once a year.",
    );
  } else if (score <= 14) {
    level = "moderate";
    headline = "You have some moderate fall risk factors worth addressing.";
    summary =
      "A few of your answers point to areas where a small change could meaningfully lower your risk. None of these are emergencies — they are exactly the kind of thing the 10-Point Plan walks you through, step by step.";
    recommendations.push(
      "Begin a gentle, twice-weekly balance and strength routine.",
      "Schedule a vision check and a medication review with your doctor or pharmacist.",
      "Walk through your home and remove tripping hazards (loose rugs, cords, clutter).",
      "Install grab bars in the bathroom if you do not have them.",
    );
  } else {
    level = "high";
    headline = "Your answers suggest a higher fall risk that deserves attention.";
    summary =
      "Higher risk is not the same as inevitable. Most of the risk factors you reported are things we can change — often within a few weeks. The 10-Point Plan is built exactly for situations like yours.";
    recommendations.push(
      "Talk with your doctor about your fall risk at your next visit (sooner is better).",
      "Ask about a referral for a physical therapy balance assessment.",
      "Review every prescription and over-the-counter medication with a pharmacist.",
      "Have a family member or friend walk through your home with you to spot hazards.",
      "Start a guided balance program — even a few weeks of consistent practice helps.",
    );
  }

  return { score, level, headline, summary, recommendations };
}
