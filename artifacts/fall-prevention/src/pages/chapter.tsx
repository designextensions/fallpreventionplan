import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  useListModules,
  getListModulesQueryKey,
  useGetModule,
  getGetModuleQueryKey,
  type ModuleSummary,
} from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProgramBanner } from "@/components/program/ProgramBanner";
import { BlockRenderer } from "@/components/program/BlockRenderer";
import { CHAPTERS, chapterByNumber, chapterOf } from "@/lib/chapters";
import { isModuleComplete, setModuleComplete } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Lock } from "lucide-react";

// One long-scroll page per chapter: the reader goes straight down through every section
// and only "flips the page" when the subject changes. This is the layout Dr. Angell asked
// for after watching seniors get lost in a per-module navigation tree.
export function ChapterPage() {
  return (
    <ProtectedRoute>
      <ChapterContent />
    </ProtectedRoute>
  );
}

function ChapterContent() {
  const params = useParams<{ n: string }>();
  const n = Number(params.n);
  const chapter = chapterByNumber(n);
  const { data: modules, isLoading } = useListModules({ query: { queryKey: getListModulesQueryKey() } });
  const [location] = useLocation();

  const sections = useMemo(
    () =>
      (modules ?? [])
        .filter((m) => chapterOf(m.planSection)?.n === n)
        .sort((a, b) => a.order - b.order),
    [modules, n],
  );

  // Jump to #section when arriving from the Main Menu (after the sections have rendered).
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || sections.length === 0) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [sections.length, location]);

  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">That chapter does not exist.</p>
          <Link href="/menu"><Button variant="outline" className="min-h-[48px] rounded-full">Return to Main Menu</Button></Link>
        </div>
      </div>
    );
  }
  if (isLoading || !modules) {
    return <div className="flex-1 flex items-center justify-center p-8"><Spinner className="size-8 text-primary" /></div>;
  }

  const prev = CHAPTERS.find((c) => c.n === n - 1) ?? null;
  const next = CHAPTERS.find((c) => c.n === n + 1) ?? null;
  const jumpItems = sections.filter((m) => !(m.subtitle ?? "").startsWith("Chapter"));

  return (
    <div className="flex-1 bg-background pb-20">
      <ProgramBanner heading={chapter.heading} />

      {/* Sticky section jump list */}
      {jumpItems.length > 1 && (
        <nav aria-label="Sections in this chapter" className="sticky top-20 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl py-3 flex gap-2 overflow-x-auto">
            {jumpItems.map((m) => (
              <a
                key={m.slug}
                href={`#${m.slug}`}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-2 min-h-[44px] flex items-center text-base font-medium hover:bg-muted"
              >
                {m.subtitle && !m.subtitle.startsWith("Chapter") ? `${m.subtitle}: ` : ""}{m.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="container mx-auto px-4 max-w-4xl py-10 flex flex-col gap-14">
        {sections.map((m) => <Section key={m.slug} summary={m} />)}

        {/* Chapter footer nav: his "Return to Main Menu" / "Move onto Chapter n" buttons */}
        <div className="flex flex-col sm:flex-row gap-4 border-t border-border pt-10">
          {prev && (
            <Link href={`/chapters/${prev.n}`} className="flex-1">
              <Button variant="outline" className="w-full min-h-[64px] text-lg rounded-full">
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" /> Return to Chapter {prev.n}
              </Button>
            </Link>
          )}
          <Link href="/menu" className="flex-1">
            <Button variant="outline" className="w-full min-h-[64px] text-lg rounded-full">
              <BookOpen className="w-5 h-5 mr-2" aria-hidden="true" /> Return to Main Menu
            </Button>
          </Link>
          {next && (
            <Link href={`/chapters/${next.n}`} className="flex-1">
              <Button className="w-full min-h-[64px] text-lg rounded-full font-bold">
                Move on to Chapter {next.n} <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ summary }: { summary: ModuleSummary }) {
  const { data: module, isLoading } = useGetModule(summary.slug, {
    query: { queryKey: getGetModuleQueryKey(summary.slug), enabled: !summary.locked },
  });
  const [completed, setCompleted] = useState(() => isModuleComplete(summary.slug));
  const isChapterIntro = (summary.subtitle ?? "").startsWith("Chapter");

  const toggle = () => {
    const nextVal = !completed;
    setModuleComplete(summary.slug, nextVal);
    setCompleted(nextVal);
  };

  return (
    <article id={summary.slug} className="scroll-mt-40">
      <header className="mb-6">
        {summary.subtitle && !isChapterIntro && (
          <p className="text-base font-bold text-primary uppercase tracking-wider">{summary.subtitle}</p>
        )}
        {!isChapterIntro && (
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-1">{summary.title}</h2>
        )}
      </header>

      {summary.locked ? (
        <Card className="border-border bg-muted/30">
          <CardContent className="p-8 text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <p className="text-lg text-muted-foreground mb-6">This section is part of the full program.</p>
            <Link href="/pricing"><Button className="min-h-[56px] rounded-full px-8 text-lg font-bold">View Plans</Button></Link>
          </CardContent>
        </Card>
      ) : isLoading || !module ? (
        <div className="flex justify-center p-8"><Spinner className="size-6 text-primary" /></div>
      ) : (
        <>
          <BlockRenderer body={module.body ?? ""} />
          {!isChapterIntro && (
            <div className="flex justify-end mt-6">
              <Button
                onClick={toggle}
                variant={completed ? "outline" : "default"}
                aria-pressed={completed}
                className={`min-h-[56px] px-8 text-lg rounded-full font-bold ${completed ? "border-secondary text-secondary" : ""}`}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" /> {completed ? "Completed" : "Mark as Complete"}
              </Button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
