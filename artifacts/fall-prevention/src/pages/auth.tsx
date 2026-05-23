import { useState, useEffect, type FormEvent } from "react";
import { useSignIn, useSignUp, useAuth } from "@clerk/react";
import { useLocation } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

type Mode = "signIn" | "signUp";

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="px-8 pt-10 pb-2 text-center">
          <img src={`${basePath}/logo.svg`} alt="" className="w-14 h-14 mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-primary">{title}</h1>
          <p className="text-muted-foreground text-base mt-2">{subtitle}</p>
        </div>
        <div className="px-8 pt-6 pb-10">{children}</div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-destructive text-base mb-4">
      {message}
    </div>
  );
}

const inputClass =
  "w-full min-h-[56px] text-lg px-4 rounded-lg bg-muted border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground";
const primaryBtn =
  "w-full min-h-[56px] text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "errors" in err) {
    const errs = (err as { errors?: Array<{ longMessage?: string; message?: string }> }).errors;
    if (errs && errs.length > 0) return errs[0].longMessage || errs[0].message || "Something went wrong.";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function AuthPage({ mode }: { mode: Mode }) {
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  useEffect(() => {
    if (isSignedIn) setLocation("/dashboard");
  }, [isSignedIn, setLocation]);

  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoaded = signInLoaded && signUpLoaded;
  const isSignUp = mode === "signUp";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (isSignUp) {
        const result = await signUp!.create({ emailAddress: email, password });
        if (result.status === "complete") {
          await setSignUpActive!({ session: result.createdSessionId });
          setLocation("/dashboard");
          return;
        }
        await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("verify");
      } else {
        const result = await signIn!.create({ identifier: email, password, strategy: "password" });
        if (result.status === "complete") {
          await setSignInActive!({ session: result.createdSessionId });
          setLocation("/dashboard");
        } else {
          setError("We couldn't sign you in. Please check your email and password.");
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      const result = await signUp!.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive!({ session: result.createdSessionId });
        setLocation("/dashboard");
      } else {
        setError("That code didn't work. Please double-check and try again.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Just an email and a password — that's it."
    : "Sign in to access your program.";

  if (step === "verify") {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a code to ${email}.`}>
        <ErrorBanner message={error} />
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="code" className="block text-base font-semibold text-foreground mb-2">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
              className={`${inputClass} text-center tracking-[0.5em] text-2xl`}
              placeholder="• • • • • •"
            />
          </div>
          <button type="submit" className={primaryBtn} disabled={busy || code.length < 4}>
            {busy ? "Verifying..." : "Finish creating my account"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setError(null);
            }}
            className="w-full text-base text-muted-foreground hover:text-foreground py-2"
          >
            Start over
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-base font-semibold text-foreground mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-base font-semibold text-foreground mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={isSignUp ? "Pick any password (8+ characters)" : "Your password"}
          />
          {isSignUp && (
            <p className="text-sm text-muted-foreground mt-2">
              Any 8 characters work — letters, numbers, whatever you'll remember.
            </p>
          )}
        </div>
        <div id="clerk-captcha" />
        <button type="submit" className={primaryBtn} disabled={busy || !isLoaded}>
          {busy ? "Please wait..." : isSignUp ? "Create my account" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-base text-muted-foreground mt-8">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <button
          type="button"
          onClick={() => setLocation(isSignUp ? "/sign-in" : "/sign-up")}
          className="text-primary font-bold hover:underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </AuthShell>
  );
}
