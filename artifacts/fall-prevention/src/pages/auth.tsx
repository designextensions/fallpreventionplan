import { useState, type FormEvent } from "react";
import { useSignIn, useSignUp, AuthenticateWithRedirectCallback } from "@clerk/react";
import { useLocation } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

type Mode = "signIn" | "signUp";

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

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
const secondaryBtn =
  "w-full min-h-[56px] text-lg font-semibold rounded-full bg-card border-2 border-border hover:border-primary/40 hover:bg-muted text-foreground flex items-center justify-center gap-3 transition";

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
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoaded = signInLoaded && signUpLoaded;
  const isSignUp = mode === "signUp";

  async function handleGoogle() {
    if (!signIn) return;
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${basePath}/sso-callback`,
        redirectUrlComplete: `${basePath}/dashboard`,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (isSignUp) {
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0] || undefined;
        const lastName = parts.slice(1).join(" ") || undefined;
        await signUp!.create({ emailAddress: email, firstName, lastName });
        await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
      } else {
        const attempt = await signIn!.create({ identifier: email });
        const factor = attempt.supportedFirstFactors?.find((f) => f.strategy === "email_code") as
          | { strategy: "email_code"; emailAddressId: string }
          | undefined;
        if (!factor) {
          throw new Error("Email code sign-in isn't available for this account.");
        }
        await signIn!.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: factor.emailAddressId,
        });
      }
      setStep("code");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleCodeSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (isSignUp) {
        const result = await signUp!.attemptEmailAddressVerification({ code });
        if (result.status === "complete") {
          await setSignUpActive!({ session: result.createdSessionId });
          setLocation("/dashboard");
        } else {
          setError("We couldn't finish signing you up. Please try again.");
        }
      } else {
        const result = await signIn!.attemptFirstFactor({ strategy: "email_code", code });
        if (result.status === "complete") {
          await setSignInActive!({ session: result.createdSessionId });
          setLocation("/dashboard");
        } else {
          setError("That code didn't work. Please double-check and try again.");
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Just your email — we'll send a code to sign you in."
    : "Enter your email and we'll send you a code.";

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <ErrorBanner message={error} />

      {step === "email" ? (
        <>
          <button type="button" onClick={handleGoogle} className={secondaryBtn} disabled={!isLoaded}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-muted-foreground text-base">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-foreground mb-2">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Jane Smith"
                />
              </div>
            )}
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
            <button type="submit" className={primaryBtn} disabled={busy || !isLoaded}>
              {busy ? "Sending code..." : "Send me a code"}
            </button>
            <p className="text-sm text-muted-foreground text-center pt-1">
              No password needed. We'll email you a 6-digit code.
            </p>
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
        </>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-5">
          <p className="text-base text-foreground">
            We sent a 6-digit code to <span className="font-semibold">{email}</span>. Check your inbox and enter it
            below.
          </p>
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
            {busy ? "Verifying..." : isSignUp ? "Create my account" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="w-full text-base text-muted-foreground hover:text-foreground py-2"
          >
            Use a different email
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function SsoCallback() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-serif text-2xl text-primary mb-2">Signing you in...</div>
        <div className="text-muted-foreground">One moment.</div>
      </div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl={`${basePath}/dashboard`}
        signUpFallbackRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}
