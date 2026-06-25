import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, ShieldCheck, Footprints, ArrowRight, ArrowLeft } from "lucide-react";

// Dr. Angell asked that new members be eased in with a few short educational
// intro slides (what a fall is, how balance works) before the full program —
// rather than dropping them into a dense dashboard. Content is drawn from his
// "Overview of Balance and Falls" section.

const ONBOARD_KEY = "fpp.onboarded";

export function markOnboarded() {
  try {
    window.localStorage.setItem(ONBOARD_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(ONBOARD_KEY) === "1";
  } catch {
    return true;
  }
}

const SLIDES = [
  {
    icon: Footprints,
    title: "What is a fall?",
    body: "A fall is an unexpected event where the body comes to rest on the ground. Falls are common as we get older — but here is the good news from Dr. Angell: most falls are preventable, and they do not have to be an inevitable part of aging.",
  },
  {
    icon: Activity,
    title: "How your body keeps you steady",
    body: "Balance is your body's main defense against falling. Your senses gather information about where you are, your brain makes a plan, and your muscles carry it out — automatically, in an instant. When one part weakens, we can strengthen the others. That is what this program trains.",
  },
  {
    icon: ShieldCheck,
    title: "How your plan works",
    body: "First, a short self-assessment estimates your fall risk. Then you work through a simple, step-by-step plan — footwear, vision, medications, home safety, strength, balance, and more — at your own pace, with videos and printable guides. We will guide you the whole way.",
  },
];

export function Onboarding() {
  const [, setLocation] = useLocation();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];
  const Icon = slide.icon;

  const finish = (to: string) => {
    markOnboarded();
    setLocation(to);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-2xl">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-3 rounded-full transition-all ${
                i === index ? "w-10 bg-primary" : "w-3 bg-border"
              }`}
            />
          ))}
        </div>

        <Card className="border-border shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <Icon className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
            <p className="text-base font-bold uppercase tracking-wider text-primary mb-3">
              Step {index + 1} of {SLIDES.length}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed max-w-xl mx-auto">
              {slide.body}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {index > 0 ? (
                <Button
                  variant="ghost"
                  onClick={() => setIndex((i) => i - 1)}
                  className="min-h-[52px] px-6 text-lg w-full sm:w-auto order-2 sm:order-1"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" /> Back
                </Button>
              ) : (
                <span className="hidden sm:block" />
              )}

              {isLast ? (
                <Button
                  onClick={() => finish("/assessment")}
                  className="min-h-[56px] px-8 text-lg font-bold rounded-full w-full sm:w-auto order-1 sm:order-2"
                >
                  Start my Self-Assessment <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  onClick={() => setIndex((i) => i + 1)}
                  className="min-h-[56px] px-8 text-lg font-bold rounded-full w-full sm:w-auto order-1 sm:order-2"
                >
                  Next <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => finish("/dashboard")}
            className="text-base font-semibold text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
