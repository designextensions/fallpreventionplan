import { useEffect, useState, type FormEvent } from "react";
import { useLocation, Link } from "wouter";
import { useDemoAuth, type DemoTier } from "@/lib/demoAuth";
import { Lock, Mail, User as UserIcon } from "lucide-react";

type Mode = "signIn" | "signUp";

const inputCls =
  "w-full min-h-[52px] px-4 py-3 text-lg bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow";
const primaryBtn =
  "w-full min-h-[52px] rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed";

export function AuthPage({ mode }: { mode: Mode }) {
  const [, setLocation] = useLocation();
  const { isSignedIn, signIn } = useDemoAuth();
  const isSignUp = mode === "signUp";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<DemoTier>("subscription");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSignedIn) setLocation("/dashboard");
  }, [isSignedIn, setLocation]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);

    // Simulate a brief network call so it feels real.
    const fallbackName = email.split("@")[0]!.replace(/[._-]+/g, " ");
    const finalName = (isSignUp ? name.trim() : "") || fallbackName;

    setTimeout(() => {
      signIn({
        email: email.trim().toLowerCase(),
        name: finalName,
        tier: isSignUp ? tier : "subscription",
      });
      setLocation("/dashboard");
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
              ? "Just an email and a password — that's it."
              : "Sign in to continue your program."}
          </p>
        </div>

        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm leading-snug">
          <strong>Demo mode:</strong> this is a prototype. No real authentication —
          any email and password will work.
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-foreground mb-2">
                Your name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${inputCls} pl-12`}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-semibold text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works"
                className={`${inputCls} pl-12`}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="tier" className="block text-base font-semibold text-foreground mb-2">
                Demo membership tier
              </label>
              <select
                id="tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as DemoTier)}
                className={inputCls}
              >
                <option value="one_time">Self-Guided (one-time)</option>
                <option value="subscription">Membership (subscription)</option>
                <option value="concierge">Concierge</option>
              </select>
              <p className="text-sm text-muted-foreground mt-2">
                Use <code className="px-1 py-0.5 bg-muted rounded">admin@fallpreventionplan.com</code> to
                explore the admin view.
              </p>
            </div>
          )}

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
