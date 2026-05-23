import { useMemo } from "react";
import { Link } from "wouter";
import { format, isToday, isTomorrow, isThisWeek, differenceInCalendarDays } from "date-fns";
import {
  useGetMe,
  useGetMyAssessment,
  useListUpcomingSessions,
  useListModules,
  useListLibraryItems,
  getGetMeQueryKey,
  getGetMyAssessmentQueryKey,
  getListUpcomingSessionsQueryKey,
  getListModulesQueryKey,
  getListLibraryItemsQueryKey,
} from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  PlayCircle,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Video,
  FileText,
  Mic,
  ClipboardList,
  Lock,
  Clock,
} from "lucide-react";

function moduleImage(slug: string, w = 480, h = 320): string {
  // picsum.photos returns a stable, deterministic stock photo per seed —
  // perfect placeholder imagery for a prototype.
  return `https://picsum.photos/seed/fpp-${slug}/${w}/${h}`;
}

export function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function friendlyDate(d: Date): string {
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow at ${format(d, "h:mm a")}`;
  if (isThisWeek(d, { weekStartsOn: 0 })) {
    return `${format(d, "EEEE")} at ${format(d, "h:mm a")}`;
  }
  const days = differenceInCalendarDays(d, new Date());
  if (days >= 0 && days < 14) return format(d, "EEEE, MMM d • h:mm a");
  return format(d, "MMM d, yyyy • h:mm a");
}

function todayHeading(): string {
  return format(new Date(), "EEEE, MMMM d");
}

function DashboardContent() {
  const { data: me, isLoading: meLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey() },
  });
  const { data: assessment, isLoading: assessmentLoading } = useGetMyAssessment({
    query: { queryKey: getGetMyAssessmentQueryKey() },
  });
  const { data: sessions, isLoading: sessionsLoading } = useListUpcomingSessions({
    query: { queryKey: getListUpcomingSessionsQueryKey() },
  });
  const { data: modules, isLoading: modulesLoading } = useListModules({
    query: { queryKey: getListModulesQueryKey() },
  });
  const { data: library, isLoading: libraryLoading } = useListLibraryItems({
    query: { queryKey: getListLibraryItemsQueryKey() },
  });

  const isLoading =
    meLoading || assessmentLoading || sessionsLoading || modulesLoading || libraryLoading;

  // Compute "where you are in the plan"
  const planStats = useMemo(() => {
    if (!modules) return null;
    const plan = modules
      .filter((m) => m.planSection === "ten_point")
      .sort((a, b) => a.order - b.order);
    const available = plan.filter((m) => !m.locked && !m.comingSoon);
    const next = available[0] ?? plan[0] ?? null;
    return {
      plan,
      totalInPlan: plan.length,
      availableCount: available.length,
      nextModule: next,
      lockedCount: plan.length - available.length,
    };
  }, [modules]);

  const nextSession = sessions && sessions.length > 0 ? sessions[0] : null;
  const upcomingThree = sessions?.slice(0, 3) ?? [];
  const featuredLibrary = library?.slice(0, 3) ?? [];

  const firstName = me?.name?.split(" ")[0] || "Member";
  const hasLiveAccess = me?.tier === "subscription" || me?.tier === "concierge" || me?.tier === "admin";

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Greeting */}
        <header className="mb-8 md:mb-10">
          <p className="text-base md:text-lg text-muted-foreground mb-1">{todayHeading()}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary leading-tight">
            Welcome back, {firstName}.
          </h1>
          {assessment && (
            <div className="mt-4 inline-flex items-center gap-2 text-base text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>
                Risk profile: <span className="font-semibold text-foreground">{assessment.headline}</span>
              </span>
              <span aria-hidden="true" className="text-muted-foreground/50">·</span>
              <Link href="/assessment" className="text-primary font-semibold hover:underline">
                Retake
              </Link>
            </div>
          )}
        </header>

        {/* HERO: Your Next Step */}
        <section className="mb-10" aria-labelledby="next-step-heading">
          <Card className="border-2 border-primary/30 shadow-lg overflow-hidden">
            <div className="h-2 bg-primary w-full" aria-hidden="true" />
            <CardContent className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <div className="bg-primary/10 rounded-full p-6 shrink-0 self-start md:self-auto">
                  <PlayCircle className="w-14 h-14 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold uppercase tracking-wider text-primary mb-2">
                    Your next step
                  </p>
                  <h2 id="next-step-heading" className="font-serif text-2xl md:text-3xl font-bold mb-3">
                    {planStats?.nextModule
                      ? planStats.nextModule.title
                      : assessment
                      ? "Browse your library"
                      : "Start with the Self-Assessment"}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                    {planStats?.nextModule?.subtitle ??
                      (assessment
                        ? "Continue at your own pace — every session is recorded."
                        : "A few quick questions to set your baseline. Takes about 5 minutes.")}
                  </p>
                  <div>
                    {planStats?.nextModule ? (
                      <Link href={`/modules/${planStats.nextModule.slug}`}>
                        <Button className="min-h-[56px] rounded-full px-8 text-lg font-bold w-full sm:w-auto">
                          <PlayCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                          Start this module
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/assessment">
                        <Button className="min-h-[56px] rounded-full px-8 text-lg font-bold w-full sm:w-auto">
                          <ClipboardList className="w-5 h-5 mr-2" aria-hidden="true" />
                          Take the assessment
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Two big areas: Live Sessions + Library */}
        <section className="grid gap-6 md:gap-8 md:grid-cols-2 mb-10" aria-label="Main areas">
          {/* Live Sessions */}
          <Card className="border-border shadow-md flex flex-col">
            <CardContent className="p-6 md:p-7 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 rounded-full p-2.5">
                  <Calendar className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Live Sessions</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-5">
                Join your therapist and other members.
              </p>

              {nextSession ? (
                <div className="space-y-4 mb-5">
                  {upcomingThree.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`rounded-xl p-4 border ${
                        idx === 0
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      {idx === 0 && (
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                          Next up
                        </span>
                      )}
                      <p className="font-serif text-lg font-bold leading-tight mb-1">{s.title}</p>
                      <p className="text-base text-primary font-semibold">
                        {friendlyDate(new Date(s.startsAt))}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">with {s.host}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base text-muted-foreground bg-muted/40 rounded-xl p-4 mb-5">
                  No sessions on the calendar right now. Check back soon.
                </p>
              )}

              {hasLiveAccess ? (
                <Link href="/sessions" className="mt-auto">
                  <Button className="w-full min-h-[52px] rounded-full text-lg font-bold">
                    See full schedule <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              ) : (
                <div className="mt-auto">
                  <p className="text-base text-muted-foreground mb-3 text-center">
                    Live sessions are part of the Membership plan.
                  </p>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      className="w-full min-h-[52px] rounded-full text-lg"
                    >
                      View plans
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Library */}
          <Card className="border-border shadow-md flex flex-col">
            <CardContent className="p-6 md:p-7 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 rounded-full p-2.5">
                  <Video className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Your Library</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-5">
                Recorded classes, articles, and interviews.
              </p>

              {featuredLibrary.length > 0 ? (
                <ul className="space-y-3 mb-5">
                  {featuredLibrary.map((item) => (
                    <li key={item.id}>
                      <Link
                        href="/library"
                        className="flex items-start gap-3 rounded-xl p-3 -mx-1 hover:bg-muted/50 transition-colors"
                      >
                        <LibraryKindIcon kind={item.kind} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base leading-snug">{item.title}</p>
                          <p className="text-sm text-muted-foreground capitalize mt-0.5">
                            {item.kind}
                            {item.durationMin ? ` • ${item.durationMin} min` : ""}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base text-muted-foreground bg-muted/40 rounded-xl p-4 mb-5">
                  No items yet — new content is added each week.
                </p>
              )}

              <Link href="/library" className="mt-auto">
                <Button className="w-full min-h-[52px] rounded-full text-lg font-bold">
                  Open library <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Complete 10-Point Plan gallery */}
        {planStats && planStats.plan.length > 0 && (
          <section className="mb-10" aria-labelledby="full-plan-heading">
            <div className="mb-6">
              <h2
                id="full-plan-heading"
                className="font-serif text-2xl md:text-3xl font-bold text-primary mb-1"
              >
                The complete 10-Point Plan
              </h2>
              <p className="text-lg text-muted-foreground">
                All ten modules — take them in order, at your own pace.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {planStats.plan.map((mod) => {
                const isLocked = mod.locked || mod.comingSoon;
                const isNext = !isLocked && mod.slug === planStats.nextModule?.slug;
                const href = isLocked ? "/pricing" : `/modules/${mod.slug}`;
                const shortTitle = mod.title.replace(/^Module \d+ — /, "");
                return (
                  <Link
                    key={mod.slug}
                    href={href}
                    className={`group block rounded-xl overflow-hidden border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                      isNext ? "border-primary border-2" : "border-border"
                    }`}
                    aria-label={`${mod.title}${isLocked ? " (locked)" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={moduleImage(mod.slug, 480, 360)}
                        alt=""
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          isLocked ? "grayscale opacity-60" : ""
                        }`}
                      />
                      <div className="absolute top-2 left-2 bg-white/95 rounded-full w-10 h-10 flex items-center justify-center font-serif font-bold text-primary text-lg shadow-sm">
                        {mod.order}
                      </div>
                      {isNext && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                          Next
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-white rounded-full p-3 shadow-md">
                            <Lock className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-bold leading-snug mb-1">
                        {shortTitle}
                      </h3>
                      {mod.subtitle && (
                        <p className="text-sm text-muted-foreground leading-snug line-clamp-2 mb-3">
                          {mod.subtitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        {mod.durationMin ? (
                          <span className="text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            {mod.durationMin} min
                          </span>
                        ) : (
                          <span />
                        )}
                        <span
                          className={`font-bold inline-flex items-center gap-1 ${
                            isLocked ? "text-muted-foreground" : "text-primary"
                          }`}
                        >
                          {isLocked ? (
                            <>Unlock</>
                          ) : (
                            <>
                              {isNext ? "Start" : "Open"}
                              <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

function LibraryKindIcon({ kind }: { kind: "recording" | "article" | "interview" }) {
  const wrapper = "rounded-lg p-2 shrink-0 bg-primary/10 text-primary";
  if (kind === "recording") return <div className={wrapper}><Video className="w-5 h-5" aria-hidden="true" /></div>;
  if (kind === "article") return <div className={wrapper}><FileText className="w-5 h-5" aria-hidden="true" /></div>;
  return <div className={wrapper}><Mic className="w-5 h-5" aria-hidden="true" /></div>;
}
