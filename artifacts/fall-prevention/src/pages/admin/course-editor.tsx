import { useEffect, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import {
  useGetAdminModule,
  useCreateAdminModule,
  useUpdateAdminModule,
  getGetAdminModuleQueryKey,
  getListAdminModulesQueryKey,
  getListModulesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminShell } from "./AdminShell";

type PlanSection = "intro" | "ten_point" | "five_point" | "appendix_a" | "appendix_b";

interface FormState {
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  planSection: PlanSection;
  durationMin: string;
  videoEmbedUrl: string;
  body: string;
  keyPointsText: string;
  comingSoon: boolean;
  freeTier: boolean;
  printable: boolean;
}

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  subtitle: "",
  order: 1,
  planSection: "ten_point",
  durationMin: "",
  videoEmbedUrl: "",
  body: "",
  keyPointsText: "",
  comingSoon: false,
  freeTier: false,
  printable: false,
};

export function AdminCourseEditor() {
  return (
    <AdminShell>
      <AdminCourseEditorContent />
    </AdminShell>
  );
}

function AdminCourseEditorContent() {
  const [, params] = useRoute<{ slug: string }>("/admin/courses/:slug");
  const slug = params?.slug;
  const isCreate = !slug || slug === "new";

  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: existing, isLoading } = useGetAdminModule(slug ?? "", {
    query: {
      enabled: !isCreate,
      queryKey: getGetAdminModuleQueryKey(slug ?? ""),
    },
  });

  const createMutation = useCreateAdminModule();
  const updateMutation = useUpdateAdminModule();
  const saving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!isCreate && existing) {
      setForm({
        slug: existing.slug,
        title: existing.title,
        subtitle: existing.subtitle ?? "",
        order: existing.order,
        planSection: existing.planSection as PlanSection,
        durationMin: existing.durationMin?.toString() ?? "",
        videoEmbedUrl: existing.videoEmbedUrl ?? "",
        body: existing.body ?? "",
        keyPointsText: (existing.keyPoints ?? []).join("\n"),
        comingSoon: existing.comingSoon,
        freeTier: existing.freeTier,
        printable: existing.printable,
      });
    }
  }, [isCreate, existing]);

  if (!isCreate && isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      order: Number(form.order),
      planSection: form.planSection,
      durationMin: form.durationMin ? Number(form.durationMin) : null,
      videoEmbedUrl: form.videoEmbedUrl.trim() || null,
      body: form.body.trim() || null,
      keyPoints: form.keyPointsText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      comingSoon: form.comingSoon,
      freeTier: form.freeTier,
      printable: form.printable,
    };

    if (!payload.slug || !payload.title) {
      setError("Slug and title are required.");
      return;
    }

    try {
      if (isCreate) {
        const created = await createMutation.mutateAsync({ data: payload });
        await Promise.all([
          qc.invalidateQueries({ queryKey: getListAdminModulesQueryKey() }),
          qc.invalidateQueries({ queryKey: getListModulesQueryKey() }),
        ]);
        navigate(`/admin/courses/${created.slug}`);
      } else {
        await updateMutation.mutateAsync({ slug: slug!, data: payload });
        await Promise.all([
          qc.invalidateQueries({ queryKey: getListAdminModulesQueryKey() }),
          qc.invalidateQueries({ queryKey: getGetAdminModuleQueryKey(payload.slug) }),
          qc.invalidateQueries({ queryKey: getListModulesQueryKey() }),
        ]);
        if (payload.slug !== slug) {
          navigate(`/admin/courses/${payload.slug}`);
        }
        setSuccess(true);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong saving this module. Please try again.";
      setError(message);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">
          {isCreate ? "New module" : `Edit: ${existing?.title ?? ""}`}
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          {isCreate
            ? "Create a new module. It will appear in the section you choose."
            : "Edit the module content, ordering, and access level. Changes are visible to members immediately."}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-5 h-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6 border-primary/40 bg-primary/5">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <AlertDescription className="text-base text-foreground">
            Saved. Members will see your changes next time they load the program.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basics */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="font-serif text-xl font-bold">Basics</h2>

            <div>
              <Label htmlFor="title" className="text-base">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Module 1 — Understanding Your Fall Risk"
                required
                className="text-base min-h-[44px]"
              />
            </div>

            <div>
              <Label htmlFor="subtitle" className="text-base">Subtitle</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
                placeholder="A short summary that appears on the module card"
                className="text-base min-h-[44px]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="slug" className="text-base">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="module-1-understanding-fall-risk"
                  required
                  className="font-mono text-sm min-h-[44px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in the URL: /modules/{form.slug || "your-slug"}
                </p>
              </div>
              <div>
                <Label htmlFor="duration" className="text-base">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={form.durationMin}
                  onChange={(e) => update("durationMin", e.target.value)}
                  placeholder="12"
                  className="text-base min-h-[44px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placement */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="font-serif text-xl font-bold">Placement</h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-base">Section</Label>
                <Select
                  value={form.planSection}
                  onValueChange={(v) => update("planSection", v as PlanSection)}
                >
                  <SelectTrigger className="text-base min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intro">Introduction</SelectItem>
                    <SelectItem value="ten_point">10-Point Plan</SelectItem>
                    <SelectItem value="five_point">5-Point Plan</SelectItem>
                    <SelectItem value="appendix_a">Appendix A — Worksheets</SelectItem>
                    <SelectItem value="appendix_b">Appendix B — Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order" className="text-base">Order in section</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => update("order", Number(e.target.value))}
                  required
                  className="text-base min-h-[44px]"
                />
                <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="font-serif text-xl font-bold">Content</h2>

            <div>
              <Label htmlFor="video" className="text-base">Video embed URL</Label>
              <Input
                id="video"
                value={form.videoEmbedUrl}
                onChange={(e) => update("videoEmbedUrl", e.target.value)}
                placeholder="https://player.vimeo.com/video/..."
                className="text-base min-h-[44px]"
              />
            </div>

            <div>
              <Label htmlFor="body" className="text-base">Lesson body (Markdown)</Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => update("body", e.target.value)}
                placeholder="Write the lesson content here. Markdown supported."
                className="text-base min-h-[260px] font-mono"
              />
            </div>

            <div>
              <Label htmlFor="keypoints" className="text-base">Key points (one per line)</Label>
              <Textarea
                id="keypoints"
                value={form.keyPointsText}
                onChange={(e) => update("keyPointsText", e.target.value)}
                placeholder={"Keep your living room clear of small rugs\nStand up slowly from chairs\nWear shoes with backs"}
                className="text-base min-h-[140px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold">Settings</h2>

            <ToggleRow
              checked={form.freeTier}
              onChange={(v) => update("freeTier", v)}
              label="Free for everyone"
              hint="Anyone signed in (any tier) can view this module. Off = members only."
            />
            <ToggleRow
              checked={form.comingSoon}
              onChange={(v) => update("comingSoon", v)}
              label="Mark as coming soon"
              hint="Shows a 'Coming soon' badge and prevents access."
            />
            <ToggleRow
              checked={form.printable}
              onChange={(v) => update("printable", v)}
              label="Offer printable version"
              hint="Adds a download/print link for members."
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 sticky bottom-4 z-10">
          <Button
            type="submit"
            disabled={saving}
            className="min-h-[52px] rounded-full px-8 font-bold shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : isCreate ? "Create module" : "Save changes"}
          </Button>
          <Link href="/admin/courses">
            <Button type="button" variant="outline" className="min-h-[52px] rounded-full px-8">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer rounded-lg p-3 -mx-1 hover:bg-muted/40 transition-colors">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-1 size-5"
      />
      <div className="flex-1">
        <p className="text-base font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
    </label>
  );
}
