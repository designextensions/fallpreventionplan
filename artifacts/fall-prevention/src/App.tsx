import { useEffect, useRef } from "react";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { Pricing } from "./pages/pricing";
import { Contact } from "./pages/contact";
import { Assessment } from "./pages/assessment";
import { Dashboard } from "./pages/dashboard";
import { ModulesList } from "./pages/modules/index";
import { ModuleShow } from "./pages/modules/show";
import { Sessions } from "./pages/sessions";
import { Library } from "./pages/library";
import { Account } from "./pages/account/index";
import { Checkout } from "./pages/account/checkout";
import { Concierge } from "./pages/concierge";
import { Admin } from "./pages/admin";
import { AuthPage, SsoCallback } from "./pages/auth";
import NotFound from "./pages/not-found";
import { Toaster } from "./components/ui/toaster";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(210, 50%, 30%)",
    colorForeground: "hsl(210, 20%, 20%)",
    colorMutedForeground: "hsl(210, 10%, 45%)",
    colorDanger: "hsl(0, 60%, 50%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(40, 20%, 96%)",
    colorInputForeground: "hsl(210, 20%, 20%)",
    colorNeutral: "hsl(40, 20%, 85%)",
    fontFamily: "Nunito, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-serif text-2xl font-bold text-primary",
    headerSubtitle: "text-muted-foreground text-base",
    socialButtonsBlockButtonText: "text-foreground font-semibold",
    formFieldLabel: "text-foreground font-semibold text-base",
    footerActionLink: "text-primary hover:text-primary/80 font-bold",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary hover:text-primary/80",
    formFieldSuccessText: "text-green-600",
    alertText: "text-destructive",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground min-h-[48px] text-lg font-bold",
    formFieldInput: "min-h-[48px] text-lg border-border focus:border-primary focus:ring-primary",
  },
};

function SignInPage() {
  return <AuthPage mode="signIn" />;
}

function SignUpPage() {
  return <AuthPage mode="signUp" />;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access your program",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Layout>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/sso-callback" component={SsoCallback} />
            
            {/* Public Pages */}
            <Route path="/about" component={About} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/contact" component={Contact} />
            <Route path="/assessment" component={Assessment} />
            
            {/* Protected Pages */}
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/modules" component={ModulesList} />
            <Route path="/modules/:slug" component={ModuleShow} />
            <Route path="/sessions" component={Sessions} />
            <Route path="/library" component={Library} />
            <Route path="/account" component={Account} />
            <Route path="/account/checkout/:plan" component={Checkout} />
            <Route path="/concierge" component={Concierge} />
            <Route path="/admin" component={Admin} />
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
