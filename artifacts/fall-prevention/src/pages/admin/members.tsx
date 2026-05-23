import {
  useListAdminMembers,
  getListAdminMembersQueryKey,
} from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { AdminShell } from "./AdminShell";

export function AdminMembers() {
  return (
    <AdminShell>
      <AdminMembersContent />
    </AdminShell>
  );
}

function AdminMembersContent() {
  const { data: members, isLoading } = useListAdminMembers({
    query: { queryKey: getListAdminMembersQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Members</h1>
        <p className="text-base text-muted-foreground mt-1">
          Every account in the program, newest first.
        </p>
      </div>

      <Card className="border-border shadow-md overflow-hidden">
        <CardHeader className="bg-card border-b border-border">
          <CardTitle className="font-serif text-xl">
            {members?.length ?? 0} member{members?.length === 1 ? "" : "s"}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-card">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Tier</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Last Login</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members?.map((member) => (
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
                  <td className="p-4 text-muted-foreground">
                    {format(new Date(member.lastLogin), "MMM d, yyyy")}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {member.assessmentScore ?? "—"}
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
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No members yet.
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
