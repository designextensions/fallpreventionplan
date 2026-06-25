import { useEffect, useState, type FormEvent } from "react";
import { useLocation, Link } from "wouter";
import { useDemoAuth } from "@/lib/demoAuth";
import { hasOnboarded } from "@/pages/onboarding";
import { Lock, Mail, User as UserIcon, Eye, EyeOff } from "lucide-react";

type Mode = "signIn" | "signUp";

const inputCls =
  "w-full min-h-[52px] px-4 py-3 text-lg bg-input/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow";
const primaryBtn =
  "w-full min-h-[52px] rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed";

export function AuthPage({ mode }: { mode: Mode }) {
  const [, setLocation] = useLocation();
  const { isSignedIn, signIn } = useDemoAuth();
  const isSignUp = mode === "signUp";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Send already-signed-in users to the right place: new members who have not
  // seen the intro slides go to onboarding; everyone else to the dashboard.
  useEffect(() => {
    if (isSignedIn) setLocation(hasOnboarded() ? "/dashboard" : "/onboarding");
  }, [isSignedIn, setLocation]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const fallbackName = email.split("@")[0]!.replace(/[._-]+/g, " ");
    const finalName = (isSignUp ? name.trim() : "") || fallbackName;

    // Brief delay so it feels real. Tier is "subscription" by default; the
    // server promotes configured admin emails automatically. Real plan
    // selection happens via Pricing → checkout, not here.
    setTimeout(() => {
      signIn({
        email: email.trim().toLowerCase(),
        name: finalName,
        tier: "subscription",
      });
      setLocation(isSignUp || !hasOnboarded() ? "/onboarding" : "/dashboard");
    }, 400);
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="FallPreventionPlan"
            className="w-14 h-14 mx-auto mb-4"
          />
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isSignUp
              ? "Just your name, email, and a password — that's it."
              : "Sign in to continue your program."}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/40 text-destructive text-base font-medium"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-foreground mb-2">
                Your name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={`${inputCls} pl-12`}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-base font-semibold text-foreground mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${inputCls} pl-12`}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-semibold text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className={`${inputCls} pl-12 pr-14`}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isSignUp && (
              <div className="mt-2 text-right">
                <Link href="/contact" className="text-base font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <button type="submit" className={primaryBtn} disabled={submitting}>
            {submitting ? "Please wait…" : isSignUp ? "Create my account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-base text-muted-foreground mt-8">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="text-primary font-bold hover:underline"
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
