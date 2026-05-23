import { useListModules, getListModulesQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, PlayCircle, BookOpen, Clock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { PlanSection } from "@workspace/api-client-react/src/generated/api.schemas";

export function ModulesList() {
  return (
    <ProtectedRoute>
      <ModulesListContent />
    </ProtectedRoute>
  );
}

function ModulesListContent() {
  const { data: modules, isLoading } = useListModules({ query: { queryKey: getListModulesQueryKey() } });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!modules) return null;

  // Group modules by section
  const groupedModules = modules.reduce((acc, mod) => {
    if (!acc[mod.planSection]) acc[mod.planSection] = [];
    acc[mod.planSection].push(mod);
    return acc;
  }, {} as Record<PlanSection, typeof modules>);

  const renderSection = (title: string, sectionKey: PlanSection, description: string) => {
    const sectionModules = groupedModules[sectionKey];
    if (!sectionModules || sectionModules.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-4">
          {sectionModules.sort((a, b) => a.order - b.order).map((mod) => (
            <Card 
              key={mod.slug} 
              className={`overflow-hidden transition-all ${mod.locked ? 'bg-muted/30 border-border/50 opacity-80' : 'hover:shadow-md border-border bg-card'}`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="p-6 flex-1 flex gap-6 items-start">
                    <div className={`mt-1 shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${mod.locked ? 'bg-muted' : 'bg-primary/10'}`}>
                      {mod.locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <span className="font-bold text-primary">{mod.order}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-serif text-xl font-bold">{mod.title}</h3>
                        {mod.comingSoon && <Badge variant="secondary">Coming Soon</Badge>}
                        {mod.durationMin && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {mod.durationMin} min
                          </span>
                        )}
                      </div>
                      {mod.subtitle && <p className="text-muted-foreground text-lg mb-4">{mod.subtitle}</p>}
                    </div>
                  </div>
                  
                  <div className="bg-muted/10 border-t sm:border-t-0 sm:border-l border-border p-6 flex items-center justify-center sm:w-48 shrink-0">
                    {mod.locked ? (
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full min-h-[48px] rounded-full">
                          Upgrade to unlock
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/modules/${mod.slug}`} className="w-full">
                        <Button className="w-full min-h-[48px] rounded-full font-bold">
                          {mod.durationMin ? <><PlayCircle className="w-5 h-5 mr-2" /> Watch</> : <><BookOpen className="w-5 h-5 mr-2" /> Read</>}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">The Program</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Follow the modules in order. Take your time, practice safely, and review sections as often as needed.
          </p>
        </div>

        {renderSection("Introduction", "intro", "Start here to understand the core principles.")}
        {renderSection("The 10-Point Plan", "ten_point", "The complete physical therapy protocol for avoiding falls.")}
        {renderSection("The 5-Point Plan", "five_point", "What to do if a fall occurs — recovery and response.")}
        {renderSection("Appendix A: Equipment", "appendix_a", "Recommended mobility aids and tools.")}
        {renderSection("Appendix B: Home Safety", "appendix_b", "Room-by-room safety modifications.")}
      </div>
    </div>
  );
}
