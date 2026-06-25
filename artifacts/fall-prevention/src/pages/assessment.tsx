import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAssessmentQuestions,
  useSubmitAssessment,
  useGetMe,
  getGetAssessmentQuestionsQueryKey,
  getGetMeQueryKey,
  getGetMyAssessmentQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Timer,
  Play,
  Square,
  RotateCcw,
  Check,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { AssessmentResult } from "@workspace/api-client-react";

const TUG_MODERATE = 10; // seconds
const TUG_HIGH = 15; // seconds

// Plain-language, first-person labels for Dr. Angell's "what causes falls" list,
// grouped so it reads as a friendly self-check rather than a clinical wall. The
// `value` keys MUST match the server's RISK_FACTORS contract; only labels change.
const FRIENDLY_LABELS: Record<string, string> = {
  "muscle-joint-stiffness": "Stiff muscles or joints",
  "poor-endurance": "I tire easily or run low on energy",
  "muscle-weakness": "Weak muscles",
  "poor-balance": "Poor balance",
  "altered-posture": "Stooped or leaning posture",
  "abnormal-walking": "An unsteady or unusual way of walking",
  "reduced-sensation": "Numbness or less feeling in my feet or legs",
  dizziness: "Dizziness or lightheadedness",
  pain: "Pain",
  incontinence: "Often rushing to the bathroom",
  "low-vision": "Trouble seeing clearly",
  "decreased-cognition": "Changes in memory or thinking",
  "reduced-short-term-memory": "Forgetting recent things",
  "limited-safety-awareness": "I don't always notice hazards",
  "impulsive-movements": "I tend to move quickly without thinking",
  "low-acceptance-disability": "I find it hard to accept I need help",
  polypharmacy: "I take several medications",
  "medication-side-effects": "My medications make me drowsy or unsteady",
  "poor-fluid-intake": "I don't drink enough fluids",
  "inadequate-nutrition": "I don't eat as well as I should",
  "poor-footwear": "Unsupportive or loose footwear",
  "improper-mobility-device": "My cane or walker doesn't fit right",
  "assistive-device-nonuse": "I have a cane or walker but don't use it",
  "cluttered-home": "Clutter or loose rugs at home",
  "poor-lighting": "Dim lighting at home",
  "unsafe-terrain": "Uneven floors or ground",
  "lacking-equipment": "No grab bars or equipment where I need them",
};

const FACTOR_GROUPS: { title: string; values: string[] }[] = [
  {
    title: "Your body and movement",
    values: [
      "muscle-weakness",
      "poor-balance",
      "muscle-joint-stiffness",
      "poor-endurance",
      "altered-posture",
      "abnormal-walking",
      "reduced-sensation",
    ],
  },
  {
    title: "How you feel",
    values: ["dizziness", "pain", "incontinence"],
  },
  {
    title: "Your senses, memory, and thinking",
    values: [
      "low-vision",
      "decreased-cognition",
      "reduced-short-term-memory",
      "limited-safety-awareness",
      "impulsive-movements",
      "low-acceptance-disability",
    ],
  },
  {
    title: "Medications and diet",
    values: ["polypharmacy", "medication-side-effects", "poor-fluid-intake", "inadequate-nutrition"],
  },
  {
    title: "Footwear, devices, and your home",
    values: [
      "poor-footwear",
      "improper-mobility-device",
      "assistive-device-nonuse",
      "cluttered-home",
      "poor-lighting",
      "unsafe-terrain",
      "lacking-equipment",
    ],
  },
];

type Step = "intro" | "tug" | "factors";
type TugMode = "timer" | "manual" | "unable";

function tugBand(seconds: number): "low" | "moderate" | "high" {
  if (seconds < TUG_MODERATE) return "low";
  if (seconds < TUG_HIGH) return "moderate";
  return "high";
}

// Short tone so the user can hear the countdown and the "go" after setting the
// phone down, and the finish — useful for a low-vision or solo senior.
function beep(freq = 880, ms = 160) {
  try {
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000 + 0.02);
    osc.onended = () => ctx.close();
  } catch {
    // ignore — audio is an enhancement, not required
  }
}

export function Assessment() {
  const { data: questions, isLoading, isError } = useGetAssessmentQuestions({
    query: { queryKey: getGetAssessmentQuestionsQueryKey() },
  });
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const submitAssessment = useSubmitAssessment();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("intro");
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // TUG state — default to manual entry, which is the only mode a senior doing
  // the test alone can reliably use (they walk 10 ft away from the phone).
  const [tugMode, setTugMode] = useState<TugMode>("manual");
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [manualSeconds, setManualSeconds] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Risk-factor checklist state
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const riskFactorQuestion = questions?.find((q) => q.id === "risk-factors") ?? questions?.[0];

  // Resolve the TUG seconds (or null if "unable" / not provided)
  const tugSeconds: number | null = useMemo(() => {
    if (tugMode === "unable") return null;
    if (tugMode === "manual") {
      const n = Number.parseFloat(manualSeconds);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return elapsedMs > 0 ? Math.round((elapsedMs / 1000) * 10) / 10 : null;
  }, [tugMode, manualSeconds, elapsedMs]);

  const tugReady = tugMode === "unable" || tugSeconds != null;

  const startTimerNow = () => {
    startRef.current = performance.now() - elapsedMs;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      if (startRef.current != null) setElapsedMs(performance.now() - startRef.current);
    }, 100);
  };

  // A 3-2-1 countdown (with beeps) gives the user time to set the phone down and
  // get to the chair before timing begins.
  const beginCountdown = () => {
    setCountdown(3);
    beep(660, 120);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c == null) return null;
        const nextV = c - 1;
        if (nextV <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          beep(990, 260); // "go!"
          startTimerNow();
          return null;
        }
        beep(660, 120);
        return nextV;
      });
    }, 1000);
  };

  // Clear BOTH the running timer and any in-progress countdown. Used by every
  // exit path so a 3-2-1 countdown can't keep beeping / auto-start after the
  // user navigates away or switches modes.
  const cancelTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    setCountdown(null);
    setRunning(false);
  };

  const stopTimer = () => {
    const wasRunning = running || intervalRef.current != null;
    cancelTimers();
    if (wasRunning) beep(880, 220); // finished tone only on a genuine stop
  };

  const resetTimer = () => {
    cancelTimers();
    setElapsedMs(0);
    startRef.current = null;
  };

  const toggleFactor = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleSubmit = () => {
    const answers = [
      {
        questionId: "tug-seconds",
        value: tugMode === "unable" ? "unable" : String(tugSeconds ?? ""),
      },
      { questionId: "risk-factors", value: Array.from(selected).join(",") },
    ];
    submitAssessment.mutate(
      { data: { answers } },
      {
        onSuccess: (data) => {
          setResult(data);
          // Refresh the dashboard's cached risk profile so a signed-in member
          // sees the new result immediately instead of a stale/empty one.
          queryClient.invalidateQueries({ queryKey: getGetMyAssessmentQueryKey() });
        },
        onError: (err) => console.error("Failed to submit assessment", err),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (isError || !questions) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't load the assessment. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()} className="min-h-[48px] rounded-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (result) {
    const signedIn = me?.signedIn;
    return (
      <div className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card
            className="border-t-8 shadow-xl overflow-hidden"
            style={{
              borderTopColor:
                result.level === "high"
                  ? "hsl(var(--destructive))"
                  : result.level === "moderate"
                    ? "hsl(var(--accent))"
                    : "hsl(var(--primary))",
            }}
          >
            <CardHeader className="text-center bg-muted/30 pb-8 pt-10">
              {result.level === "low" && <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />}
              {result.level === "moderate" && <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />}
              {result.level === "high" && <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />}
              <CardTitle className="font-serif text-3xl md:text-4xl font-bold mb-4">
                {result.headline}
              </CardTitle>
              <p className="text-xl text-muted-foreground">{result.summary}</p>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border pb-2">
                Recommended Next Steps
              </h3>
              <ul className="space-y-4 mb-10">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg bg-muted/20 p-4 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
                <h4 className="font-serif text-2xl font-bold mb-4">
                  {signedIn ? "Continue to your plan" : "Take the next step"}
                </h4>
                <p className="text-lg text-muted-foreground mb-8">
                  {signedIn
                    ? "Your result is saved. Head to your dashboard to begin working through the Fall Prevention Plan."
                    : "Get the complete Fall Prevention Plan — the 10-step program, exercise videos, and home safety guides."}
                </p>
                <Link href={signedIn ? "/dashboard" : "/pricing"}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-h-[56px] text-lg rounded-full font-bold px-10 shadow-md"
                  >
                    {signedIn ? "Go to my dashboard" : "View the Program Plans"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stepIndex = step === "intro" ? 0 : step === "tug" ? 1 : 2;
  const progress = Math.round((stepIndex / 3) * 100);
  const elapsedSeconds = Math.round((elapsedMs / 1000) * 10) / 10;

  return (
    <div className="flex-1 bg-background py-12 md:py-20 flex flex-col">
      <div className="container mx-auto px-4 max-w-2xl flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Fall Self-Assessment
            </span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* ---------- INTRO ---------- */}
        {step === "intro" && (
          <Card className="flex-1 border-border shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Let's estimate your fall risk
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 text-lg leading-relaxed space-y-4">
              <p>
                This short self-assessment uses Dr. Angell's method. It has two parts:
              </p>
              <ol className="space-y-3 list-decimal pl-6">
                <li>
                  The <strong>Timed Up and Go (TUG) Test</strong> — we'll time how long it takes you to
                  stand from a chair, walk ten feet, turn, walk back, and sit down.
                </li>
                <li>
                  A short <strong>checklist of common causes of falls</strong> — you'll mark anything
                  that might apply to you.
                </li>
              </ol>
              <p className="bg-muted/40 rounded-xl p-4 text-base">
                Please make sure you are safe before the timed test: clear the path, wear your normal
                footwear, use your cane or walker if you use one, and have someone nearby if you feel
                unsteady.
              </p>
            </CardContent>
            <CardFooter className="pt-6 border-t border-border flex justify-end bg-muted/10 rounded-b-xl">
              <Button
                onClick={() => setStep("tug")}
                className="min-h-[48px] px-8 text-lg rounded-full font-bold"
              >
                Begin <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ---------- TUG TEST ---------- */}
        {step === "tug" && (
          <Card className="flex-1 border-border shadow-lg flex flex-col">
            <CardHeader>
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">
                Step 1 of 2 · The TUG Test
              </span>
              <CardTitle className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                Time yourself standing, walking, and sitting
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <ol className="space-y-2 list-decimal pl-6 text-lg leading-relaxed">
                <li>Place a sturdy chair in an open area.</li>
                <li>Mark a line ten feet from the chair.</li>
                <li>
                  Time yourself as you stand, walk to the line at a normal pace, turn, walk back, and
                  sit down.
                </li>
              </ol>

              {/* Mode chooser — "Enter my time" is first and recommended because a
                  senior testing alone walks away from the phone and cannot reach
                  it to stop a running timer. */}
              <div role="group" aria-label="How to record your time" className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  aria-pressed={tugMode === "manual"}
                  variant={tugMode === "manual" ? "default" : "outline"}
                  className="min-h-[48px] rounded-full text-base"
                  onClick={() => {
                    resetTimer();
                    setTugMode("manual");
                  }}
                >
                  Enter my time
                </Button>
                <Button
                  type="button"
                  aria-pressed={tugMode === "timer"}
                  variant={tugMode === "timer" ? "default" : "outline"}
                  className="min-h-[48px] rounded-full text-base"
                  onClick={() => {
                    resetTimer();
                    setTugMode("timer");
                  }}
                >
                  Use the timer
                </Button>
                <Button
                  type="button"
                  aria-pressed={tugMode === "unable"}
                  variant={tugMode === "unable" ? "default" : "outline"}
                  className="min-h-[48px] rounded-full text-base"
                  onClick={() => {
                    resetTimer();
                    setTugMode("unable");
                  }}
                >
                  I couldn't complete it
                </Button>
              </div>

              {tugMode === "manual" && (
                <div className="rounded-2xl border border-border bg-muted/20 p-6">
                  <Label htmlFor="manual-seconds" className="text-lg">
                    Time to complete the test (in seconds)
                  </Label>
                  <p className="text-base text-muted-foreground mt-1 mb-2">
                    Easiest with a helper: have someone time you with a phone or watch, then type the
                    number of seconds here.
                  </p>
                  <Input
                    id="manual-seconds"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 12.5"
                    value={manualSeconds}
                    onChange={(e) => setManualSeconds(e.target.value)}
                    className="mt-1 text-xl min-h-[56px] max-w-[200px]"
                  />
                  {manualSeconds.trim() !== "" && tugSeconds == null && (
                    <p role="alert" className="text-base text-destructive font-medium mt-2">
                      Please enter the number of seconds (for example, 12.5).
                    </p>
                  )}
                </div>
              )}

              {tugMode === "timer" && (
                <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center">
                  <p className="text-base text-muted-foreground mb-4">
                    Press <strong>Start</strong>, then set the phone down during the 3‑2‑1 countdown.
                    Do the test, and press the big <strong>Stop</strong> button when you sit back down.
                  </p>
                  {countdown != null ? (
                    <div
                      className="font-serif text-7xl font-bold text-primary mb-6"
                      role="status"
                      aria-live="assertive"
                    >
                      {countdown}
                    </div>
                  ) : (
                    <>
                      <Timer className="w-10 h-10 text-primary mx-auto mb-3" aria-hidden="true" />
                      <div className="font-serif text-6xl font-bold tabular-nums mb-6" aria-hidden="true">
                        {elapsedSeconds.toFixed(1)}
                        <span className="text-2xl text-muted-foreground ml-2">sec</span>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col items-center gap-4">
                    {running ? (
                      <Button
                        onClick={stopTimer}
                        className="w-full min-h-[72px] text-2xl rounded-full font-bold"
                      >
                        <Square className="w-6 h-6 mr-2" /> Stop
                      </Button>
                    ) : countdown != null ? (
                      <Button disabled className="w-full min-h-[72px] text-2xl rounded-full font-bold">
                        Get ready…
                      </Button>
                    ) : (
                      <Button
                        onClick={() => (elapsedMs > 0 ? startTimerNow() : beginCountdown())}
                        className="w-full min-h-[72px] text-2xl rounded-full font-bold"
                      >
                        <Play className="w-6 h-6 mr-2" /> {elapsedMs > 0 ? "Resume" : "Start"}
                      </Button>
                    )}
                    {elapsedMs > 0 && !running && countdown == null && (
                      <Button
                        variant="outline"
                        onClick={resetTimer}
                        className="min-h-[52px] px-6 text-lg rounded-full"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" /> Reset
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {tugMode === "unable" && (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-lg">
                  Not being able to complete the test safely is itself an important sign. We'll record
                  this as a higher fall risk and point you to the right starting place in the plan.
                </div>
              )}

              {/* Live risk band preview */}
              {tugMode !== "unable" && tugSeconds != null && (
                <div className="text-center text-lg" aria-live="polite" aria-atomic="true">
                  Based on{" "}
                  <strong>{tugSeconds % 1 === 0 ? tugSeconds : tugSeconds.toFixed(1)} seconds</strong>,
                  this falls in the{" "}
                  <strong
                    className={
                      tugBand(tugSeconds) === "high"
                        ? "text-destructive"
                        : tugBand(tugSeconds) === "moderate"
                          ? "text-accent"
                          : "text-primary"
                    }
                  >
                    {tugBand(tugSeconds)} fall risk
                  </strong>{" "}
                  range.
                </div>
              )}

              <div className="text-sm text-muted-foreground border-t border-border pt-4">
                <p className="font-bold mb-1">Standard data</p>
                <p>Less than 10 seconds = Low · 10–14.9 seconds = Moderate · Greater than 15 seconds = High</p>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t border-border flex justify-between bg-muted/10 rounded-b-xl">
              <Button
                variant="ghost"
                onClick={() => {
                  resetTimer();
                  setStep("intro");
                }}
                className="min-h-[48px] px-6 text-lg"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Back
              </Button>
              <Button
                onClick={() => {
                  cancelTimers();
                  setStep("factors");
                }}
                disabled={!tugReady}
                className="min-h-[48px] px-8 text-lg rounded-full font-bold"
              >
                Next <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ---------- RISK FACTORS ---------- */}
        {step === "factors" && riskFactorQuestion && (
          <Card className="flex-1 border-border shadow-lg flex flex-col">
            <CardHeader>
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">
                Step 2 of 2 · {riskFactorQuestion.category}
              </span>
              <CardTitle className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                {riskFactorQuestion.prompt}
              </CardTitle>
              {riskFactorQuestion.helpText && (
                <p className="text-lg text-muted-foreground mt-4 italic border-l-4 border-primary/30 pl-4 py-1">
                  {riskFactorQuestion.helpText}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-base text-muted-foreground mb-6 bg-muted/40 rounded-xl p-4">
                There are no wrong answers. Check anything that sounds like you — it just helps us
                point you to the steps that will help the most. Or check none at all.
              </p>

              {(() => {
                const byValue = new Map(riskFactorQuestion.options.map((o) => [o.value, o]));
                const grouped = new Set<string>();
                const renderButton = (value: string, label: string) => {
                  const isSelected = selected.has(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleFactor(value)}
                      className={`flex items-center gap-3 text-left rounded-xl border p-4 min-h-[56px] transition-colors ${
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <Check className="w-5 h-5" />}
                      </span>
                      <span className="text-lg leading-snug">{FRIENDLY_LABELS[value] ?? label}</span>
                    </button>
                  );
                };
                return (
                  <div className="space-y-7">
                    {FACTOR_GROUPS.map((group) => {
                      const opts = group.values
                        .map((v) => byValue.get(v))
                        .filter((o): o is NonNullable<typeof o> => Boolean(o));
                      if (opts.length === 0) return null;
                      opts.forEach((o) => grouped.add(o.value));
                      return (
                        <div key={group.title}>
                          <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                            {group.title}
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {opts.map((o) => renderButton(o.value, o.label))}
                          </div>
                        </div>
                      );
                    })}
                    {(() => {
                      const leftovers = riskFactorQuestion.options.filter((o) => !grouped.has(o.value));
                      if (leftovers.length === 0) return null;
                      return (
                        <div>
                          <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                            Other
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {leftovers.map((o) => renderButton(o.value, o.label))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </CardContent>
            <CardFooter className="pt-6 border-t border-border flex justify-between bg-muted/10 rounded-b-xl">
              <Button
                variant="ghost"
                onClick={() => setStep("tug")}
                disabled={submitAssessment.isPending}
                className="min-h-[48px] px-6 text-lg"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitAssessment.isPending}
                className="min-h-[48px] px-8 text-lg rounded-full font-bold"
              >
                {submitAssessment.isPending ? (
                  <>
                    Processing... <Spinner className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  "Get my results"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
