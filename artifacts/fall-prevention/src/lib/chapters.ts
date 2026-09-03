// The program is a book: six chapters, each made of sections (rows in `modules`).
// Chapter membership is derived from `planSection`, so no schema change was needed
// when the Aug 10 2026 content plan reorganized the app around long-scroll chapters.
import type { PlanSection } from "@workspace/api-client-react";

export interface Chapter {
  n: number;
  slug: string;
  title: string;      // as it appears in Geoff's Main Menu
  heading: string;    // as it appears at the top of the chapter page (his caps)
  sections: PlanSection[];
  navLabel: string;   // his member nav bar wording
}

export const CHAPTERS: Chapter[] = [
  { n: 1, slug: "getting-started", title: "Getting Started", heading: "Chapter 1: Getting Started", sections: ["intro", "overview", "assessment"], navLabel: "Getting Started" },
  { n: 2, slug: "creating-a-fall-prevention-plan", title: "Creating a Fall Prevention Plan", heading: "Chapter 2: Creating a Personalized Fall Prevention Plan", sections: ["ten_point"], navLabel: "10 Point Plan" },
  { n: 3, slug: "if-a-fall-occurs", title: "If a Fall Occurs", heading: "Chapter 3: What if a Fall Happens", sections: ["fall_response"], navLabel: "If a Fall Occurs" },
  { n: 4, slug: "assistive-devices-appendix", title: "Assistive Devices Appendix", heading: "Chapter 4: Appendix of Assistive Devices", sections: ["appendix_a"], navLabel: "Appendixes" },
  { n: 5, slug: "home-safety-appendix", title: "Home Safety Equipment and Modification Appendix", heading: "Chapter 5: Appendix of Home Safety Modification and Equipment", sections: ["appendix_b"], navLabel: "Appendixes" },
  { n: 6, slug: "summing-it-up", title: "Summing It Up", heading: "Chapter 6: Summing It Up", sections: ["summary"], navLabel: "Summary" },
];

export function chapterOf(planSection: PlanSection): Chapter | null {
  return CHAPTERS.find((c) => c.sections.includes(planSection)) ?? null;
}

export function chapterByNumber(n: number): Chapter | null {
  return CHAPTERS.find((c) => c.n === n) ?? null;
}

export const SECTION_LABELS: Record<PlanSection, string> = {
  welcome: "Welcome",
  intro: "Getting Started",
  overview: "Getting Started",
  assessment: "Getting Started",
  ten_point: "Creating a Fall Prevention Plan",
  fall_response: "If a Fall Occurs",
  appendix_a: "Assistive Devices Appendix",
  appendix_b: "Home Safety Appendix",
  summary: "Summing It Up",
};
