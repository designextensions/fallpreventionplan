import { useState } from "react";
import { Link } from "wouter";
import {
  useListAdminModules,
  useDeleteAdminModule,
  getListAdminModulesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Lock, Unlock, Clock, Eye } from "lucide-react";
import { AdminShell } from "./AdminShell";

const SECTION_LABELS: Record<string, string> = {
  intro: "Introduction",
  overview: "Overview of Balance and Falls",
  assessment: "Fall Self-Assessment",
  ten_point: "Personalized Plan (10 Steps)",
  fall_response: "What if a Fall Happens",
  appendix_a: "Appendix A — Assistive Devices",
  appendix_b: "Appendix B — Home Safety",
};

const SECTION_ORDER = [
  "intro",
  "overview",
  "assessment",
  "ten_point",
  "fall_response",
  "appendix_a",
  "appendix_b",
] as const;

export function AdminCourses() {
  return (
    <AdminShell>
      <AdminCoursesContent />
    </AdminShell>
  );
}

function AdminCoursesContent() {
  const qc = useQueryClient();
  const { data: modules, isLoading } = useListAdminModules({
    query: { queryKey: getListAdminModulesQueryKey() },
  });
  const deleteMutation = useDeleteAdminModule({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAdminModulesQueryKey() });
      },
    },
  });
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const grouped = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    modules: (modules ?? [])
      .filter((m) => m.planSection === key)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.modules.length > 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Courses</h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage every module in the program — content, order, tier access, and status.
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="min-h-[48px] rounded-full px-6 font-bold">
            <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
            New module
          </Button>
        </Link>
      </div>

      {grouped.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">No modules yet.</p>
            <Link href="/admin/courses/new">
              <Button className="min-h-[48px] rounded-full">Create the first module</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        grouped.map((section) => (
          <section key={section.key} className="mb-10">
            <h2 className="font-serif text-xl font-bold text-muted-foreground uppercase tracking-wider mb-4">
              {section.label}
            </h2>
            <Card className="border-border shadow-sm overflow-hidden">
              <ul className="divide-y divide-border">
                {section.modules.map((m) => (
                  <li
                    key={m.slug}
                    className="p-4 md:p-5 flex flex-wrap items-center gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {m.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg font-bold leading-tight">{m.title}</h3>
                        {m.comingSoon && <Badge variant="secondary">Coming soon</Badge>}
                        {m.freeTier ? (
                          <Badge variant="outline" className="text-primary border-primary/40">
                            <Unlock className="w-3 h-3 mr-1" /> Free
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <Lock className="w-3 h-3 mr-1" /> Members
                          </Badge>
                        )}
                        {m.durationMin && (
                          <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {m.durationMin} min
                          </span>
                        )}
                      </div>
                      {m.subtitle && (
                        <p className="text-sm text-muted-foreground truncate">{m.subtitle}</p>
                      )}
                      <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{m.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/modules/${m.slug}`}>
                        <Button variant="ghost" size="sm" className="min-h-[40px] rounded-full" title="Preview as member">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/courses/${m.slug}`}>
                        <Button variant="outline" size="sm" className="min-h-[40px] rounded-full">
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-[40px] rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setConfirmSlug(m.slug)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))
      )}

      <AlertDialog open={!!confirmSlug} onOpenChange={(open) => !open && setConfirmSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this module?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes <span className="font-mono">{confirmSlug}</span> and its content.
              Members will no longer see it in the program. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!confirmSlug) return;
                await deleteMutation.mutateAsync({ slug: confirmSlug });
                setConfirmSlug(null);
              }}
            >
              Delete module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
