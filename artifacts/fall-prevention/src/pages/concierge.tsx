import { useGetMyConciergeDashboard, getGetMyConciergeDashboardQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MessageSquare, Clock, Phone, HeartHandshake } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export function Concierge() {
  return (
    <ProtectedRoute>
      <ConciergeContent />
    </ProtectedRoute>
  );
}

function ConciergeContent() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: dashboard, isLoading } = useGetMyConciergeDashboard({ 
    query: { 
      queryKey: getGetMyConciergeDashboardQueryKey(),
      enabled: me?.tier === 'concierge' || me?.tier === 'admin'
    } 
  });
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (me?.tier !== 'concierge' && me?.tier !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-lg w-full border-border shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartHandshake className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Concierge Access Required</h2>
            <p className="text-lg text-muted-foreground mb-8">
              This area is reserved for members with 1-on-1 concierge support.
            </p>
            <Link href="/pricing">
              <Button className="w-full min-h-[56px] text-lg rounded-full font-bold">Learn About Concierge</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">Concierge Support</h1>
            <p className="text-xl text-muted-foreground">Your dedicated 1-on-1 progress portal.</p>
          </div>
          <Button 
            size="lg" 
            onClick={() => toast({ title: "Opening Scheduler", description: "This would launch Calendly in production." })}
            className="min-h-[56px] rounded-full font-bold px-8 shadow-md"
          >
            <Calendar className="w-5 h-5 mr-2" /> Book 1-on-1 Session
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="border-border shadow-sm bg-card">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="font-serif text-2xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Latest Check-in
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-lg">{dashboard.latestCheckIn.fromName}</span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {format(new Date(dashboard.latestCheckIn.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed">{dashboard.latestCheckIn.message}</p>
                  
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" className="min-h-[48px] rounded-full px-6">
                      Reply to Check-in
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" /> Session Notes
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                {dashboard.notes.map((note) => (
                  <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-foreground">{note.authorName}</span>
                        <span className="text-sm text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="text-base text-muted-foreground" dangerouslySetInnerHTML={{ __html: note.body }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-border shadow-sm border-t-4 border-t-primary">
              <CardContent className="pt-8 text-center">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Next Scheduled Outreach</h3>
                <div className="font-serif text-3xl font-bold text-foreground mb-6">
                  {format(new Date(dashboard.nextOutreachAt), "EEEE, MMM d")}
                </div>
                <p className="text-muted-foreground mb-6">
                  Geoff will reach out to check on your progress.
                </p>
                <div className="flex items-center justify-center gap-2 text-primary font-bold bg-primary/5 py-3 rounded-xl">
                  <Phone className="w-5 h-5" /> Phone Call
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border shadow-sm">
               <CardHeader>
                 <CardTitle className="font-serif text-xl">Quick Contact</CardTitle>
                 <CardDescription>Need assistance before your next check-in?</CardDescription>
               </CardHeader>
               <CardContent>
                 <Button variant="outline" className="w-full min-h-[48px] rounded-full border-primary/30">
                   Send Secure Message
                 </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
