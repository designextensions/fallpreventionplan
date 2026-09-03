import { Link } from "wouter";
import { useGetModule, getGetModuleQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { BlockRenderer } from "@/components/program/BlockRenderer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, BookOpen } from "lucide-react";
import { ProgramBanner } from "@/components/program/ProgramBanner";

// Dr. Angell's welcome letter: the first page a member sees after signing in.
export function Welcome() {
  return (
    <ProtectedRoute>
      <WelcomeContent />
    </ProtectedRoute>
  );
}

function WelcomeContent() {
  const { data: module, isLoading } = useGetModule("welcome", { query: { queryKey: getGetModuleQueryKey("welcome") } });

  return (
    <div className="flex-1 bg-background pb-20">
      <ProgramBanner eyebrow="Welcome to" />
      <div className="container mx-auto px-4 max-w-4xl py-10">
        {isLoading && (
          <div className="flex justify-center p-12"><Spinner className="size-8 text-primary" /></div>
        )}
        {module?.body && <BlockRenderer body={module.body} />}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link href="/menu" className="flex-1">
            <Button className="w-full min-h-[64px] text-xl rounded-full font-bold">
              <BookOpen className="w-6 h-6 mr-2" aria-hidden="true" /> Open the Main Menu
            </Button>
          </Link>
          <Link href="/chapters/1" className="flex-1">
            <Button variant="outline" className="w-full min-h-[64px] text-xl rounded-full font-bold">
              Start with Chapter 1 <ArrowRight className="w-6 h-6 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
