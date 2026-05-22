import { ReactNode } from "react";
import { Show } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldAlert } from "lucide-react";

export function ProtectedRoute({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        {children}
      </Show>
      <Show when="signed-out">
        {fallback || (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
              <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold mb-3">Sign in to continue</h2>
              <p className="text-muted-foreground mb-8">
                This content is reserved for members of the Fall Prevention Plan.
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/sign-in">
                  <Button className="w-full min-h-[48px] text-lg rounded-full font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full min-h-[48px] text-lg rounded-full">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Show>
    </>
  );
}
