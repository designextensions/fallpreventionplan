import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="w-8 h-8 opacity-80" />
              <span className="font-serif font-bold text-lg text-primary tracking-tight">
                FallPreventionPlan.com
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-base">
              A comprehensive program designed by physical therapists to help older adults reduce fall risk and maintain independence.
            </p>
            <p className="text-sm text-muted-foreground mt-8">
              &copy; {new Date().getFullYear()} Active for Life Rehabilitation. All rights reserved.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Program</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center">
                  Free Self-Assessment
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center">
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground inline-flex items-center min-h-[44px]">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground inline-flex items-center min-h-[44px]">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
