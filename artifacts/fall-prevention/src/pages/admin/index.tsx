import {
  useGetAdminStats,
  useListAdminMembers,
  getGetAdminStatsQueryKey,
  getListAdminMembersQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { AdminShell } from "./AdminShell";

export function AdminOverview() {
  return (
    <AdminShell>
      <AdminOverviewContent />
    </AdminShell>
  );
}

function AdminOverviewContent() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() },
  });
  const { data: members, isLoading: membersLoading } = useListAdminMembers({
    query: { queryKey: getListAdminMembersQueryKey() },
  });

  if (statsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="font-serif text-3xl font-bold">Overview</h1>
        <Button variant="outline" className="min-h-[40px] rounded-full">Export CSV</Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Members" value={stats.totalMembers} icon={Users} sub="All tiers combined" />
          <StatCard
            label="Active Subs"
            value={stats.subscriptionMembers + stats.conciergeMembers}
            icon={TrendingUp}
            sub={`Plus ${stats.oneTimeMembers} one-time`}
          />
          <StatCard
            label="MRR"
            value={`$${(stats.mrrCents / 100).toLocaleString()}`}
            icon={DollarSign}
            sub="Recurring revenue"
          />
          <StatCard label="Assessments" value={stats.assessmentsCompleted} icon={Activity} sub="Completed tests" />
        </div>
      )}

      <Card className="border-border shadow-md overflow-hidden">
        <CardHeader className="bg-card border-b border-border">
          <CardTitle className="font-serif text-xl">Recent Members</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-card">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Tier</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members?.slice(0, 10).map((member) => (
                <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold">{member.name}</td>
                  <td className="p-4 text-muted-foreground">{member.email}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {member.tier.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {format(new Date(member.signupDate), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">
                    {member.riskLevel ? (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          member.riskLevel === "high"
                            ? "bg-destructive/10 text-destructive"
                            : member.riskLevel === "moderate"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
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
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  sub: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-bold text-muted-foreground uppercase">{label}</p>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground mt-2">{sub}</p>
      </CardContent>
    </Card>
  );
}
