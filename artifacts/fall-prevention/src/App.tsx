import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { DemoAuthProvider, useDemoAuth } from "./lib/demoAuth";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Spinner } from "./components/ui/spinner";
import { Toaster } from "./components/ui/toaster";

// Lazy-load every page so Vite only fetches the dep tree for the route
// the user is actually on. Eagerly importing all 17 pages was making the
// dev bundle fetch hundreds of modules up-front and spike CPU.
const Home = lazy(() => import("./pages/home").then((m) => ({ default: m.Home })));
const About = lazy(() => import("./pages/about").then((m) => ({ default: m.About })));
const Pricing = lazy(() => import("./pages/pricing").then((m) => ({ default: m.Pricing })));
const Contact = lazy(() => import("./pages/contact").then((m) => ({ default: m.Contact })));
const Assessment = lazy(() => import("./pages/assessment").then((m) => ({ default: m.Assessment })));
const Dashboard = lazy(() => import("./pages/dashboard").then((m) => ({ default: m.Dashboard })));
const ModulesList = lazy(() => import("./pages/modules/index").then((m) => ({ default: m.ModulesList })));
const ModuleShow = lazy(() => import("./pages/modules/show").then((m) => ({ default: m.ModuleShow })));
const Sessions = lazy(() => import("./pages/sessions").then((m) => ({ default: m.Sessions })));
const Library = lazy(() => import("./pages/library").then((m) => ({ default: m.Library })));
const Account = lazy(() => import("./pages/account/index").then((m) => ({ default: m.Account })));
const Checkout = lazy(() => import("./pages/account/checkout").then((m) => ({ default: m.Checkout })));
const Concierge = lazy(() => import("./pages/concierge").then((m) => ({ default: m.Concierge })));
const Admin = lazy(() => import("./pages/admin").then((m) => ({ default: m.Admin })));
const AuthPage = lazy(() => import("./pages/auth").then((m) => ({ default: m.AuthPage })));
const NotFound = lazy(() => import("./pages/not-found"));

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function SignInPage() {
  return <AuthPage mode="signIn" />;
}

function SignUpPage() {
  return <AuthPage mode="signUp" />;
}

function HomeRedirect() {
  const { isSignedIn } = useDemoAuth();
  return isSignedIn ? <Redirect to="/dashboard" /> : <Home />;
}

function PageFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <Spinner className="size-8 text-primary" />
    </div>
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

function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in" component={SignInPage} />
          <Route path="/sign-up" component={SignUpPage} />

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
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <DemoAuthProvider>
          <AppRoutes />
          <Toaster />
        </DemoAuthProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
