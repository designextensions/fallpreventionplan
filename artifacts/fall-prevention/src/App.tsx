import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { DemoAuthProvider, useDemoAuth } from "./lib/demoAuth";

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
import { AuthPage } from "./pages/auth";
import NotFound from "./pages/not-found";
import { Toaster } from "./components/ui/toaster";

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
