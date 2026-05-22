import { useListUpcomingSessions, getListUpcomingSessionsQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Clock, User, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export function Sessions() {
  return (
    <ProtectedRoute>
      <SessionsContent />
    </ProtectedRoute>
  );
}

function SessionsContent() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: sessions, isLoading } = useListUpcomingSessions({ query: { queryKey: getListUpcomingSessionsQueryKey() } });
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const hasAccess = me?.tier === 'subscription' || me?.tier === 'concierge' || me?.tier === 'admin';

  if (!hasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-lg w-full border-border shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Live Sessions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Live group exercise classes and weekly Q&A sessions are available on the Community Plus plan.
            </p>
            <Button className="w-full min-h-[56px] text-lg rounded-full font-bold">Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">Live Sessions</h1>
            <p className="text-xl text-muted-foreground">Join our community for guided exercises and live Q&A.</p>
          </div>
          <Button variant="outline" className="min-h-[48px] rounded-full flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Sync to my Calendar
          </Button>
        </div>

        {sessions && sessions.length > 0 ? (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-muted/30 p-6 md:w-64 border-b md:border-b-0 md:border-r border-border shrink-0 flex flex-col justify-center items-center text-center">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {format(new Date(session.startsAt), "EEEE")}
                    </span>
                    <span className="font-serif text-3xl font-bold text-primary mb-1">
                      {format(new Date(session.startsAt), "MMM d")}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {format(new Date(session.startsAt), "h:mm a")}
                    </span>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-3">
                        {session.kind.replace('_', ' ')}
                      </div>
                      <h3 className="font-serif text-2xl font-bold mb-2">{session.title}</h3>
                      {session.description && (
                        <p className="text-muted-foreground text-lg mb-4">{session.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> {session.durationMin} minutes
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" /> {session.host}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex flex-col gap-3 min-w-[160px]">
                      <Button 
                        onClick={() => toast({ title: "Connecting to Zoom...", description: "This would launch Zoom in production." })}
                        className="w-full min-h-[56px] text-lg rounded-full font-bold bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Video className="w-5 h-5 mr-2" /> Join
                      </Button>
                      <Button variant="ghost" className="w-full min-h-[48px] rounded-full text-muted-foreground">
                        <PlusCircle className="w-4 h-4 mr-2" /> Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border bg-muted/20">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-serif text-2xl font-bold mb-2">No upcoming sessions</h3>
              <p className="text-muted-foreground text-lg">Check back later for the new schedule.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
