import { useGetMe, useGetMyAssessment, useListUpcomingSessions, getGetMeQueryKey, getGetMyAssessmentQueryKey, getListUpcomingSessionsQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlayCircle, Calendar, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

export function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: me, isLoading: meLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: assessment, isLoading: assessmentLoading } = useGetMyAssessment({ query: { queryKey: getGetMyAssessmentQueryKey() } });
  const { data: sessions, isLoading: sessionsLoading } = useListUpcomingSessions({ query: { queryKey: getListUpcomingSessionsQueryKey() } });

  const isLoading = meLoading || assessmentLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const nextSession = sessions && sessions.length > 0 ? sessions[0] : null;

  return (
    <div className="flex-1 bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Welcome back, {me?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-lg text-muted-foreground">
            Current plan: <span className="font-bold capitalize">{me?.tier.replace('_', ' ')}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Continue Learning */}
            <Card className="border-border shadow-md overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">The 10-Point Plan</CardTitle>
                <CardDescription className="text-lg">Continue your progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-xl p-6 border border-border mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                      <PlayCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold mb-2">Module 1: Understanding Your Risk</h4>
                      <p className="text-muted-foreground mb-4">Learn the primary factors that contribute to falls and how to spot them in your environment.</p>
                      <Link href="/modules/module-1">
                        <Button className="min-h-[48px] rounded-full px-6 text-base font-bold">
                          Resume Module
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href="/modules" className="text-primary font-bold hover:underline flex items-center gap-2 text-lg min-h-[48px]">
                    View all modules <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Result */}
            {assessment && (
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Your Risk Profile</CardTitle>
                  <CardDescription className="text-lg">Based on your latest assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 p-6 rounded-xl border border-border bg-card">
                    <div className="shrink-0">
                      {assessment.level === 'low' && <CheckCircle2 className="w-12 h-12 text-primary" />}
                      {assessment.level === 'moderate' && <AlertCircle className="w-12 h-12 text-accent" />}
                      {assessment.level === 'high' && <ShieldAlert className="w-12 h-12 text-destructive" />}
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold mb-1">{assessment.headline}</h4>
                      <p className="text-muted-foreground">Score: {assessment.score} • Taken {format(new Date(assessment.completedAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="ml-auto">
                      <Link href="/assessment">
                        <Button variant="outline" className="min-h-[48px] rounded-full">
                          Retake
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!assessment && (
               <Card className="border-border shadow-md bg-primary/5 border-primary/20">
               <CardHeader>
                 <CardTitle className="font-serif text-2xl">Take the Self-Assessment</CardTitle>
                 <CardDescription className="text-lg">Establish your baseline risk profile</CardDescription>
               </CardHeader>
               <CardContent>
                 <Link href="/assessment">
                   <Button className="min-h-[48px] rounded-full px-8 text-base">
                     Start Assessment
                   </Button>
                 </Link>
               </CardContent>
             </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-border shadow-md">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {nextSession ? (
                  <div className="space-y-4">
                    <div>
                      <span className="inline-block bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider">
                        {nextSession.kind.replace('_', ' ')}
                      </span>
                      <h4 className="font-serif font-bold text-lg leading-tight mb-1">{nextSession.title}</h4>
                      <p className="text-primary font-semibold">
                        {format(new Date(nextSession.startsAt), "MMM d • h:mm a")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">Host: {nextSession.host}</p>
                    
                    {me?.tier !== 'one_time' && me?.tier !== 'guest' ? (
                      <Link href="/sessions">
                        <Button className="w-full min-h-[48px] rounded-full mt-2">View Details</Button>
                      </Link>
                    ) : (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-3">Live sessions are available on the Community Plus plan.</p>
                        <Link href="/account">
                          <Button variant="outline" size="sm" className="w-full min-h-[40px] rounded-full">Upgrade</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming sessions scheduled.</p>
                )}
                
                <div className="mt-6 pt-4 border-t border-border text-center">
                  <Link href="/sessions" className="text-primary font-bold hover:underline text-sm inline-flex min-h-[44px] items-center">
                    View Full Schedule
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md bg-card">
              <CardContent className="p-6">
                <h4 className="font-serif font-bold text-lg mb-2">Need help?</h4>
                <p className="text-sm text-muted-foreground mb-4">Have questions about an exercise or need technical support?</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full min-h-[48px] rounded-full border-primary/20">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
