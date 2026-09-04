import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, XCircle, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminShell } from "./AdminShell";
import {
  useListImageDecisions,
  getListImageDecisionsQueryKey,
  useUpsertImageDecision,
} from "@workspace/api-client-react";

// Contact sheet for Dr. Angell's in-person image review. Reads the published copy of
// content/images.manifest.json, shows each slot's description and generated candidates,
// and records decisions locally (Y = approve the highlighted candidate, N = reject,
// arrows = move). "Copy decisions" exports JSON for tools/apply-image-decisions.py.

type Slot = {
  id: string;
  slotNumber: number | null;
  kind: string;
  page: string;
  chapter: number | null;
  section: string | null;
  geoffDescription: string;
  candidates?: string[];
  status: string;
  notes?: string | null;
};
type Decision = { decision: "approve" | "reject"; file?: string; notes?: string };
const KEY = "fpp.imageDecisions";

function loadDecisions(): Record<string, Decision> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

export function AdminImages() {
  return (
    <AdminShell>
      <AdminImagesContent />
    </AdminShell>
  );
}

function AdminImagesContent() {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>(loadDecisions);
  // Server copy: what Dr. Angell decided from wherever he is. Merge it in on load; save every change.
  const { data: remote } = useListImageDecisions({ query: { queryKey: getListImageDecisionsQueryKey() } });
  const upsert = useUpsertImageDecision();
  useEffect(() => {
    if (!remote) return;
    setDecisions((prev) => {
      const merged = { ...prev };
      for (const r of remote) merged[r.slotId] = { decision: r.decision, file: r.file ?? undefined, notes: r.notes ?? undefined };
      return merged;
    });
  }, [remote]);
  const save = (slotId: string, d: Decision) =>
    upsert.mutate({ slotId, data: { decision: d.decision, file: d.file ?? null, notes: d.notes ?? null } });
  const [cursor, setCursor] = useState(0);        // which slot
  const [pick, setPick] = useState(0);            // which candidate within the slot
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}images/program/manifest.json`)
      .then((r) => r.json())
      .then((m: { images: Slot[] }) =>
        setSlots(m.images.filter((s) => (s.candidates?.length ?? 0) > 0 || s.kind === "editorial" || s.kind === "diagram")),
      )
      .catch(() => setSlots([]));
  }, []);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(decisions)); }, [decisions]);

  const current = slots?.[cursor];
  const decide = (d: Decision["decision"]) => {
    if (!current) return;
    const file = current.candidates?.[pick];
    const next: Decision = { decision: d, file: d === "approve" ? file : undefined, notes: decisions[current.id]?.notes };
    setDecisions((prev) => ({ ...prev, [current.id]: next }));
    save(current.id, next);
    setCursor((c) => Math.min(c + 1, (slots?.length ?? 1) - 1)); setPick(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "y" || e.key === "Y") decide("approve");
      else if (e.key === "n" || e.key === "N") decide("reject");
      else if (e.key === "ArrowRight") setCursor((c) => Math.min(c + 1, (slots?.length ?? 1) - 1));
      else if (e.key === "ArrowLeft") setCursor((c) => Math.max(c - 1, 0));
      else if (e.key === "1" || e.key === "2" || e.key === "3") setPick(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stats = useMemo(() => {
    const vals = Object.values(decisions);
    return { approved: vals.filter((d) => d.decision === "approve").length, rejected: vals.filter((d) => d.decision === "reject").length };
  }, [decisions]);

  if (!slots) return <div className="flex-1 flex items-center justify-center p-12"><Spinner className="size-8 text-primary" /></div>;
  if (!current) return <div className="p-12 text-lg">No image slots found in the manifest.</div>;
  const mine = decisions[current.id];

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">Image review</h1>
            <p className="text-muted-foreground">Slot {cursor + 1} of {slots.length}. Keys: Y approve, N reject, 1/2 pick a candidate, arrows move. {stats.approved} approved, {stats.rejected} rejected. Decisions save automatically.</p>
          </div>
          <Button variant="outline" className="min-h-[48px] rounded-full" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(decisions, null, 2));
            toast({ title: "Decisions copied", description: "Paste into decisions.json and run tools/apply-image-decisions.py" });
          }}>
            <Copy className="w-4 h-4 mr-2" /> Copy decisions
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-6 md:p-8">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">{current.id} · {current.kind} · {current.page}{current.section ? ` · ${current.section}` : ""}</p>
            <p className="text-xl mt-2 mb-6">“{current.geoffDescription}”</p>

            {current.candidates && current.candidates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {current.candidates.map((c, i) => (
                  <button key={c} type="button" onClick={() => setPick(i)}
                    className={`rounded-2xl overflow-hidden border-4 text-left ${pick === i ? "border-primary" : "border-transparent"} ${mine?.file === c ? "ring-4 ring-secondary" : ""}`}>
                    <img src={`${import.meta.env.BASE_URL}${c.replace(/^\//, "")}`} alt={`Candidate ${i + 1}`} className="w-full" />
                    <span className="block px-3 py-2 text-sm text-muted-foreground">Candidate {i + 1}{mine?.file === c ? " · approved" : ""}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">No candidates generated yet for this slot.</p>
            )}

            <textarea
              className="mt-6 w-full rounded-xl border border-input bg-background p-3 text-base"
              rows={2}
              placeholder="Notes for a regenerate (what to change)"
              value={mine?.notes ?? ""}
              onChange={(e) => setDecisions((prev) => ({ ...prev, [current.id]: { decision: prev[current.id]?.decision ?? "reject", file: prev[current.id]?.file, notes: e.target.value } }))}
              onBlur={() => { const d = decisions[current.id]; if (d) save(current.id, d); }}
            />

            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" className="min-h-[52px] rounded-full" onClick={() => setCursor((c) => Math.max(c - 1, 0))}><ChevronLeft className="w-5 h-5" /> Back</Button>
              <Button className="min-h-[52px] rounded-full px-6 font-bold" onClick={() => decide("approve")} disabled={!current.candidates?.length}><CheckCircle2 className="w-5 h-5 mr-2" /> Approve candidate {pick + 1} (Y)</Button>
              <Button variant="outline" className="min-h-[52px] rounded-full px-6 border-destructive text-destructive" onClick={() => decide("reject")}><XCircle className="w-5 h-5 mr-2" /> Reject (N)</Button>
              <Button variant="ghost" className="min-h-[52px] rounded-full ml-auto" onClick={() => setCursor((c) => Math.min(c + 1, slots.length - 1))}>Skip <ChevronRight className="w-5 h-5" /></Button>
            </div>
            {mine && <p className="mt-4 text-sm text-muted-foreground">Recorded: {mine.decision}{mine.file ? ` (${mine.file.split("/").pop()})` : ""}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
