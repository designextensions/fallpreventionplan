import { Link, useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useDemoAuth } from "@/lib/demoAuth";
import { AccessibilityMenu } from "./AccessibilityMenu";

export function Header() {
  const { isSignedIn, signOut } = useDemoAuth();
  const { data: me } = useGetMe({ query: { enabled: isSignedIn, queryKey: getGetMeQueryKey() } });
  const [, setLocation] = useLocation();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    signOut();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="w-10 h-10" />
          <span className="font-serif font-bold text-xl text-primary tracking-tight hidden sm:inline-block">
            FallPreventionPlan
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {!isSignedIn && (
            <>
              <Link href="/about" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                About
              </Link>
              <Link href="/assessment" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Self-Assessment
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Pricing
              </Link>
            </>
          )}

          {isSignedIn && (
            <>
              <Link href="/dashboard" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/modules" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                The Plan
              </Link>
              <Link href="/sessions" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Classes
              </Link>
              <Link href="/library" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                Library
              </Link>
              {me?.tier === 'concierge' && (
                <Link href="/concierge" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                  Concierge
                </Link>
              )}
              {me?.tier === 'admin' && (
                <Link href="/admin" className="text-foreground/80 hover:text-foreground font-medium transition-colors">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Always-visible accessibility control (large text, contrast, color, motion) */}
          <AccessibilityMenu />

          {!isSignedIn && (
            <>
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/sign-in" className="text-primary font-medium hover:underline px-4 py-2 min-h-[48px] flex items-center">
                  Sign In
                </Link>
                <Link href="/pricing">
                  <Button className="min-h-[48px] rounded-full px-8 text-base">Get Started</Button>
                </Link>
              </div>

              {/* Mobile Menu Trigger for signed-out */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="min-h-[48px] min-w-[48px]">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuItem onClick={() => setLocation('/about')} className="min-h-[48px] text-lg">About</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/assessment')} className="min-h-[48px] text-lg">Self-Assessment</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/pricing')} className="min-h-[48px] text-lg">Pricing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/sign-in')} className="min-h-[48px] text-lg">Sign In</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(me?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{me?.name || "Member"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {me?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {/* Mobile-only nav items */}
                <div className="md:hidden">
                  <DropdownMenuItem onClick={() => setLocation('/dashboard')} className="min-h-[48px] text-lg">Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/modules')} className="min-h-[48px] text-lg">The Plan</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/sessions')} className="min-h-[48px] text-lg">Classes</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/library')} className="min-h-[48px] text-lg">Library</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem onClick={() => setLocation('/account')} className="min-h-[48px] text-lg">
                  Account & Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="min-h-[48px] text-lg text-destructive focus:text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
