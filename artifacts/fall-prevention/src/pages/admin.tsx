import { useGetAdminStats, useListAdminMembers, getGetAdminStatsQueryKey, getListAdminMembersQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

export function Admin() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { data: me, isLoading: meLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  
  // We only enable these queries if user is an admin
  const isAdmin = me?.tier === 'admin';
  
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({ 
    query: { queryKey: getGetAdminStatsQueryKey(), enabled: isAdmin } 
  });
  const { data: members, isLoading: membersLoading } = useListAdminMembers({ 
    query: { queryKey: getListAdminMembersQueryKey(), enabled: isAdmin } 
  });

  if (meLoading || (isAdmin && (statsLoading || membersLoading))) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full border-destructive shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-bold mb-3">Access Denied</h2>
            <p className="text-lg text-muted-foreground mb-8">
              This portal is restricted to program administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">Admin Console</h1>
          <Button variant="outline" className="min-h-[40px] rounded-full">Export CSV</Button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase">Total Members</p>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalMembers}</h3>
                <p className="text-sm text-muted-foreground mt-2">All tiers combined</p>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase">Active Subs</p>
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.subscriptionMembers + stats.conciergeMembers}</h3>
                <p className="text-sm text-muted-foreground mt-2">Plus {stats.oneTimeMembers} one-time</p>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase">MRR</p>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">${(stats.mrrCents / 100).toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-2">Recurring revenue</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase">Assessments</p>
                  <Activity className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.assessmentsCompleted}</h3>
                <p className="text-sm text-muted-foreground mt-2">Completed tests</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="border-border shadow-md overflow-hidden">
          <CardHeader className="bg-card border-b border-border">
            <CardTitle className="font-serif text-xl">Member Directory</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-card">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Tier</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members?.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold">{member.name}</td>
                    <td className="p-4 text-muted-foreground">{member.email}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {member.tier.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{format(new Date(member.signupDate), "MMM d, yyyy")}</td>
                    <td className="p-4">
                      {member.riskLevel ? (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          member.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                          member.riskLevel === 'moderate' ? 'bg-accent/10 text-accent' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {member.riskLevel}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
                {members?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
