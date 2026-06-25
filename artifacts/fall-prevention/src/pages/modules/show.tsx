import {
  useGetModule,
  getGetModuleQueryKey,
  useListModules,
  getListModulesQueryKey,
} from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useParams, Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Download, CheckCircle2, Lock, Film, Image as ImageIcon, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { isModuleComplete, setModuleComplete } from "@/lib/progress";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SECTION_LABELS: Record<string, string> = {
  intro: "Introduction",
  overview: "Overview of Balance & Falls",
  assessment: "Fall Self-Assessment",
  ten_point: "Your Fall Prevention Plan",
  fall_response: "If a Fall Happens",
  appendix_a: "Appendix A — Assistive Devices",
  appendix_b: "Appendix B — Home Safety",
};

// Minimal Markdown -> HTML converter for the print/download handout. Handles the
// constructs used in Dr. Angell's content: headings, GFM tables (medication form,
// nutrition tables), ordered/unordered lists, blockquotes, bold, links, autolinks,
// and image placeholders. Kept dependency-free so it can run in the print window.
function inlineMarkdownToHtml(text: string): string {
  let t = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Image placeholders: ![alt](src) -> labeled note (no real media yet)
  t = t.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt) => `<em>[Image: ${alt || "coming soon"}]</em>`);
  // Bold
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Markdown links [text](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Autolinks <https://...> (angle brackets are escaped above)
  t = t.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, '<a href="$1">$1</a>');
  // Escaped asterisks used for footnotes (\*) -> literal *
  t = t.replace(/\\\*/g, "*");
  return t;
}

function markdownToPrintHtml(md: string): string {
  const blocks = md.split(/\n{2,}/);
  const out: string[] = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    const lines = block.split("\n");

    if (block.startsWith("### ")) {
      out.push(`<h3>${inlineMarkdownToHtml(block.slice(4))}</h3>`);
    } else if (block.startsWith("## ")) {
      out.push(`<h2>${inlineMarkdownToHtml(block.slice(3))}</h2>`);
    } else if (block.startsWith("# ")) {
      out.push(`<h1>${inlineMarkdownToHtml(block.slice(2))}</h1>`);
    } else if (lines.every((l) => l.trim().startsWith("|"))) {
      // GFM table
      const rows = lines
        .map((l) => l.trim())
        .filter((l) => !/^\|[\s|:-]+\|?$/.test(l)); // drop the |---|---| separator
      const htmlRows = rows.map((r, idx) => {
        const cells = r
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
        const tag = idx === 0 ? "th" : "td";
        return `<tr>${cells.map((c) => `<${tag}>${inlineMarkdownToHtml(c)}</${tag}>`).join("")}</tr>`;
      });
      out.push(`<table>${htmlRows.join("")}</table>`);
    } else if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
      const items = lines.map((l) => `<li>${inlineMarkdownToHtml(l.trim().replace(/^[-*]\s+/, ""))}</li>`);
      out.push(`<ul>${items.join("")}</ul>`);
    } else if (lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
      const items = lines.map((l) => `<li>${inlineMarkdownToHtml(l.trim().replace(/^\d+\.\s+/, ""))}</li>`);
      out.push(`<ol>${items.join("")}</ol>`);
    } else if (lines.every((l) => l.trim().startsWith(">"))) {
      const inner = lines.map((l) => l.trim().replace(/^>\s?/, "")).join(" ");
      out.push(`<blockquote>${inlineMarkdownToHtml(inner)}</blockquote>`);
    } else {
      out.push(`<p>${inlineMarkdownToHtml(block).replace(/\n/g, "<br/>")}</p>`);
    }
  }
  return out.join("\n");
}

export function ModuleShow() {
  return (
    <ProtectedRoute>
      <ModuleShowContent />
    </ProtectedRoute>
  );
}

function ModuleShowContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: module, isLoading, isError } = useGetModule(slug || "", {
    query: {
      enabled: !!slug,
      queryKey: getGetModuleQueryKey(slug || ""),
    },
  });
  // The ordered program sequence powers "Module X of Y" and Previous/Next.
  const { data: allModules } = useListModules({ query: { queryKey: getListModulesQueryKey() } });
  const { toast } = useToast();

  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (slug) setCompleted(isModuleComplete(slug));
  }, [slug]);

  const sequence = useMemo(() => {
    const ordered = (allModules ?? []).slice().sort((a, b) => a.order - b.order);
    const idx = ordered.findIndex((m) => m.slug === slug);
    const isAvailable = (m: (typeof ordered)[number]) => !m.locked && !m.comingSoon;
    // Skip locked/coming-soon neighbors so Previous/Next never dead-ends on the paywall.
    let prev: (typeof ordered)[number] | null = null;
    for (let i = idx - 1; i >= 0; i--) {
      if (isAvailable(ordered[i])) {
        prev = ordered[i];
        break;
      }
    }
    let next: (typeof ordered)[number] | null = null;
    for (let i = idx + 1; i < ordered.length; i++) {
      if (isAvailable(ordered[i])) {
        next = ordered[i];
        break;
      }
    }
    return { ordered, idx, total: ordered.length, prev, next, loaded: ordered.length > 0 };
  }, [allModules, slug]);

  const handleToggleComplete = () => {
    if (!slug) return;
    const next = !completed;
    setModuleComplete(slug, next);
    setCompleted(next);
    if (next) {
      toast({
        title: "Marked complete",
        description: sequence.next ? "Nice work. Ready for the next one?" : "You've reached the end — well done!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (isError || !module) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Module not found.</p>
          <Link href="/modules">
            <Button variant="outline" className="min-h-[48px] rounded-full">Back to Program</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (module.locked) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-lg w-full border-border shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">Module Locked</h2>
            <p className="text-lg text-muted-foreground mb-8">
              This module is part of the premium program. Upgrade your plan to access all videos and materials.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/pricing">
                <Button className="w-full min-h-[56px] text-lg rounded-full font-bold">View Plans</Button>
              </Link>
              <Link href="/modules">
                <Button variant="ghost" className="w-full min-h-[48px] text-lg">Back to Program</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videoUrl = module.videoEmbedUrl;
  const isRealVideo =
    typeof videoUrl === "string" &&
    /^https?:\/\//.test(videoUrl);
  // A "placeholder:vimeo:Label" value marks a video slot that Dr. Angell's notes
  // call for, before the real footage has been recorded.
  const videoPlaceholderLabel =
    typeof videoUrl === "string" && videoUrl.startsWith("placeholder:")
      ? videoUrl.split(":").slice(2).join(":").trim() || "Video lesson coming soon"
      : null;

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header Bar */}
      <div className="bg-card border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/modules">
            <Button variant="ghost" size="icon" className="shrink-0 min-h-[48px] min-w-[48px]" aria-label="Back to the program list">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary uppercase tracking-wider truncate">
              {SECTION_LABELS[module.planSection] ?? module.planSection.replace(/_/g, " ")}
              {sequence.idx >= 0 ? ` • ${sequence.idx + 1} of ${sequence.total}` : ""}
            </p>
            <h1 className="font-serif text-xl font-bold truncate">{module.title}</h1>
          </div>
          {completed && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-secondary shrink-0">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> Completed
            </span>
          )}
        </div>
        {sequence.total > 0 && sequence.idx >= 0 && (
          <div className="h-1.5 bg-muted w-full" aria-hidden="true">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((sequence.idx + 1) / sequence.total) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* Video Embed */}
        {isRealVideo && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-border bg-black aspect-video relative">
            <iframe
              src={videoUrl!}
              title={`${module.title} — video lesson`}
              className="absolute inset-0 w-full h-full"
              frameBorder={0}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Video slot placeholder (Dr. Angell's notes call for video here) */}
        {!isRealVideo && videoPlaceholderLabel && (
          <div className="mb-12 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 aspect-video flex flex-col items-center justify-center text-center p-6">
            <Film className="w-12 h-12 text-primary/50 mb-3" />
            <p className="font-serif text-xl font-bold text-foreground">Video coming soon</p>
            <p className="text-base text-muted-foreground mt-1 max-w-md">{videoPlaceholderLabel}</p>
          </div>
        )}

        {/* Transcript (ADA): every video lesson has a readable text alternative */}
        {(isRealVideo || videoPlaceholderLabel) && (
          <details className="mb-12 rounded-xl border border-border bg-muted/30">
            <summary className="cursor-pointer list-none flex items-center gap-2 p-4 text-base font-semibold text-foreground">
              <FileText className="w-5 h-5 text-primary" aria-hidden="true" /> Show video transcript
            </summary>
            <div className="px-4 pb-4 text-base text-muted-foreground leading-relaxed">
              A full text transcript will be published here alongside the video, so every lesson
              can be read as well as watched.
            </div>
          </details>
        )}

        {/* Content Body */}
        <div className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:text-primary max-w-none mb-16 prose-p:leading-relaxed prose-li:text-lg prose-li:leading-relaxed prose-strong:text-foreground prose-table:text-base">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Render inline images. When the source is empty/"placeholder",
              // show a labeled image slot instead of a broken-image icon.
              img: ({ src, alt }) => {
                const realSrc = typeof src === "string" && /^https?:\/\//.test(src);
                if (realSrc) {
                  return (
                    <img
                      src={src as string}
                      alt={alt ?? ""}
                      className="rounded-xl border border-border shadow-sm mx-auto"
                    />
                  );
                }
                return (
                  <span className="not-prose flex flex-col items-center justify-center text-center gap-2 my-6 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/60" />
                    <span className="text-base font-medium text-muted-foreground">
                      Image coming soon{alt ? `: ${alt}` : ""}
                    </span>
                  </span>
                );
              },
            }}
          >
            {module.body || "Content coming soon."}
          </ReactMarkdown>
        </div>

        {/* Key Points */}
        {module.keyPoints && module.keyPoints.length > 0 && (
          <Card className="border-border bg-primary/5 mb-12 shadow-sm">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">Key Takeaways</h3>
              <ul className="space-y-4">
                {module.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-border pt-8 mt-12">
          {module.printable && (
            <Button
              variant="outline"
              className="w-full sm:w-auto min-h-[56px] px-6 text-lg rounded-full"
              onClick={() => {
                toast({
                  title: "Preparing your handout",
                  description: "Opening a print-ready view in a new tab.",
                });
                const w = window.open("", "_blank");
                if (!w) return;
                const safeTitle = module.title.replace(/[<>&]/g, "");
                const bodyHtml = markdownToPrintHtml(module.body || "");
                const takeaways = (module.keyPoints || [])
                  .map((p) => `<li>${inlineMarkdownToHtml(p)}</li>`)
                  .join("");
                w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${safeTitle} — Handout</title>
<style>
  body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #222; line-height: 1.6; }
  h1 { font-size: 28px; border-bottom: 2px solid #333; padding-bottom: 8px; }
  h2 { font-size: 22px; margin-top: 32px; }
  h3 { font-size: 18px; margin-top: 24px; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 14px; }
  th, td { border: 1px solid #999; padding: 8px 10px; text-align: left; vertical-align: top; }
  th { background: #f0ebe1; }
  ul, ol { padding-left: 24px; }
  li { margin: 4px 0; }
  blockquote { border-left: 4px solid #8a6d3b; margin: 16px 0; padding: 4px 16px; color: #444; background: #faf7f1; }
  a { color: #1a5; word-break: break-word; }
  .takeaways { background: #f5f0e8; border-left: 4px solid #8a6d3b; padding: 16px 20px; margin: 24px 0; }
  .takeaways h3 { margin-top: 0; }
  @media print { body { margin: 0; } button { display: none; } table, tr { page-break-inside: avoid; } }
</style></head><body>
<h1>${safeTitle}</h1>
<p><em>${inlineMarkdownToHtml(module.subtitle || "")}</em></p>
${bodyHtml}
${takeaways ? `<div class="takeaways"><h3>Key Takeaways</h3><ul>${takeaways}</ul></div>` : ""}
<p style="margin-top:40px;text-align:center;color:#888;font-size:12px;">Fall Prevention Plan — printable handout</p>
<script>window.onload=function(){setTimeout(function(){window.print();},300);};</script>
</body></html>`);
                w.document.close();
              }}
            >
              <Download className="w-5 h-5 mr-2" /> Download Printable Guide
            </Button>
          )}

          <Button
            onClick={handleToggleComplete}
            variant={completed ? "outline" : "default"}
            aria-pressed={completed}
            className={`w-full sm:w-auto min-h-[56px] px-8 text-lg rounded-full font-bold ml-auto ${
              completed ? "border-secondary text-secondary" : ""
            }`}
          >
            {completed ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
              </>
            ) : (
              <>
                Mark as Complete <CheckCircle2 className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Previous / Next module navigation so members move A→Z without backing out.
            Rendered only once the module list has loaded, so the "Finish" fallback
            never flashes mid-program. */}
        {sequence.loaded && (
        <nav className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Move between modules">
          {sequence.prev ? (
            <Link href={`/modules/${sequence.prev.slug}`} className="block">
              <div className="h-full rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Previous
                </span>
                <span className="font-serif text-lg font-bold">{sequence.prev.title}</span>
              </div>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {sequence.next ? (
            <Link href={`/modules/${sequence.next.slug}`} className="block sm:text-right">
              <div className="h-full rounded-xl border-2 border-primary/40 bg-primary/5 p-5 hover:shadow-md transition-shadow">
                <span className="flex items-center sm:justify-end gap-1 text-sm font-bold text-primary uppercase tracking-wider mb-1">
                  Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="font-serif text-lg font-bold">{sequence.next.title}</span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="block sm:text-right">
              <div className="h-full rounded-xl border-2 border-primary/40 bg-primary/5 p-5 hover:shadow-md transition-shadow">
                <span className="flex items-center sm:justify-end gap-1 text-sm font-bold text-primary uppercase tracking-wider mb-1">
                  Finish <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="font-serif text-lg font-bold">Back to your dashboard</span>
              </div>
            </Link>
          )}
        </nav>
        )}
      </div>
    </div>
  );
}
