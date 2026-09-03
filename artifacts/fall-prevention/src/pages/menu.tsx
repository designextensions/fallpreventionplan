import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useListModules, getListModulesQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProgramBanner } from "@/components/program/ProgramBanner";
import { CHAPTERS, chapterOf } from "@/lib/chapters";
import { getCompleted } from "@/lib/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Circle, Lock, Video, MessageCircle, Library as LibraryIcon, Phone, ArrowRight } from "lucide-react";

// Dr. Angell's "Main Menu": the book's table of contents. Six chapters, each listing its
// sections, then General Resources and Premium Resources exactly as his template lays them out.
export function MainMenu() {
  return (
    <ProtectedRoute>
      <MainMenuContent />
    </ProtectedRoute>
  );
}

function MainMenuContent() {
  const { data: modules, isLoading } = useListModules({ query: { queryKey: getListModulesQueryKey() } });
  const [completed, setCompleted] = useState<Set<string>>(() => getCompleted());
  useEffect(() => {
    const refresh = () => setCompleted(getCompleted());
    window.addEventListener("fpp:progress", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("fpp:progress", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (isLoading || !modules) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const ordered = modules.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 bg-background pb-20">
      <ProgramBanner heading="Main Menu" />
      <div className="container mx-auto px-4 max-w-4xl py-10 flex flex-col gap-6">
        {CHAPTERS.map((ch) => {
          const sections = ordered.filter((m) => chapterOf(m.planSection)?.n === ch.n);
          if (sections.length === 0) return null;
          // A chapter's own intro row (subtitle "Chapter n") is not a menu item; the chapter is.
          const items = sections.filter((m) => !(m.subtitle ?? "").startsWith("Chapter"));
          const locked = sections.every((m) => m.locked);
          const done = sections.filter((m) => completed.has(m.slug)).length;
          return (
            <Card key={ch.n} className={`border-border ${locked ? "bg-muted/30" : "bg-card"}`}>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider">Chapter {ch.n}</p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-1">{ch.title}</h2>
                    {!locked && (
                      <p className="text-base text-muted-foreground mt-1">
                        {done === sections.length ? "Completed" : `${done} of ${sections.length} completed`}
                      </p>
                    )}
                  </div>
                  {locked ? (
                    <Link href="/pricing">
                      <Button variant="outline" className="min-h-[56px] rounded-full px-6 text-lg shrink-0">
                        <Lock className="w-5 h-5 mr-2" aria-hidden="true" /> Upgrade to unlock
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/chapters/${ch.n}`}>
                      <Button className="min-h-[56px] rounded-full px-6 text-lg font-bold shrink-0">
                        Open Chapter {ch.n} <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                      </Button>
                    </Link>
                  )}
                </div>
                {items.length > 0 && (
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {items.map((m) => (
                      <li key={m.slug}>
                        <Link
                          href={locked ? "/pricing" : `/chapters/${ch.n}#${m.slug}`}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 min-h-[52px] text-lg hover:bg-muted/60 focus-visible:bg-muted/60"
                        >
                          {completed.has(m.slug) ? (
                            <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" aria-label="Completed" />
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground/50 shrink-0" aria-hidden="true" />
                          )}
                          <span className="min-w-0">
                            {m.subtitle && !m.subtitle.startsWith("Chapter") && (
                              <span className="text-muted-foreground mr-2">{m.subtitle}:</span>
                            )}
                            {m.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Resources, as laid out in the template */}
        <Card className="border-border bg-card">
          <CardContent className="p-6 md:p-8">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">General Resources</p>
            <p className="text-base text-muted-foreground mt-1">Available to all membership levels</p>
            <Link href="/concierge" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 min-h-[52px] text-lg hover:bg-muted/60">
              <Phone className="w-6 h-6 text-primary shrink-0" aria-hidden="true" /> One on One Video Consultation Sessions
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6 md:p-8">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">Premium Resources</p>
            <p className="text-base text-muted-foreground mt-1">Available to Plus and Premium members</p>
            <ul className="mt-4 grid gap-2">
              <li><Link href="/sessions" className="flex items-center gap-3 rounded-xl px-3 py-3 min-h-[52px] text-lg hover:bg-muted/60"><Video className="w-6 h-6 text-primary shrink-0" aria-hidden="true" /> Weekly Group Balance and Exercise Classes</Link></li>
              <li><Link href="/sessions" className="flex items-center gap-3 rounded-xl px-3 py-3 min-h-[52px] text-lg hover:bg-muted/60"><MessageCircle className="w-6 h-6 text-primary shrink-0" aria-hidden="true" /> Monthly Fall Prevention Topic Discussion and Author Q&amp;A</Link></li>
              <li><Link href="/library" className="flex items-center gap-3 rounded-xl px-3 py-3 min-h-[52px] text-lg hover:bg-muted/60"><LibraryIcon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" /> Library: Articles, Interviews, Posts, Monthly Q&amp;A</Link></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
