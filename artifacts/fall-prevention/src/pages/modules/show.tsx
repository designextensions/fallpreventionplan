import { useGetModule, getGetModuleQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, CheckCircle2, Lock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

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
  const { toast } = useToast();

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
    videoUrl.length > 0 &&
    !videoUrl.startsWith("stub:");

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header Bar */}
      <div className="bg-card border-b border-border sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/modules">
            <Button variant="ghost" size="icon" className="shrink-0 min-h-[48px] min-w-[48px]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary uppercase tracking-wider truncate">
              {module.planSection.replace('_', ' ')} • Module {module.order}
            </p>
            <h1 className="font-serif text-xl font-bold truncate">{module.title}</h1>
          </div>
        </div>
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

        {/* Content Body */}
        <div className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:text-primary max-w-none mb-16 prose-p:leading-relaxed prose-li:text-lg prose-li:leading-relaxed prose-strong:text-foreground">
          <ReactMarkdown>
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
                const bodyHtml = (module.body || "")
                  .split("\n\n")
                  .map((para) => {
                    const trimmed = para.trim();
                    if (trimmed.startsWith("### ")) return `<h3>${trimmed.slice(4)}</h3>`;
                    if (trimmed.startsWith("## ")) return `<h2>${trimmed.slice(3)}</h2>`;
                    if (trimmed.startsWith("# ")) return `<h1>${trimmed.slice(2)}</h1>`;
                    return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
                  })
                  .join("\n");
                const takeaways = (module.keyPoints || [])
                  .map((p) => `<li>${p}</li>`)
                  .join("");
                w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${safeTitle} — Handout</title>
<style>
  body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #222; line-height: 1.6; }
  h1 { font-size: 28px; border-bottom: 2px solid #333; padding-bottom: 8px; }
  h2 { font-size: 22px; margin-top: 32px; }
  h3 { font-size: 18px; margin-top: 24px; }
  .takeaways { background: #f5f0e8; border-left: 4px solid #8a6d3b; padding: 16px 20px; margin: 24px 0; }
  .takeaways h3 { margin-top: 0; }
  @media print { body { margin: 0; } button { display: none; } }
</style></head><body>
<h1>${safeTitle}</h1>
<p><em>${module.subtitle || ""}</em></p>
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

          <Button className="w-full sm:w-auto min-h-[56px] px-8 text-lg rounded-full font-bold ml-auto">
            Mark as Complete <CheckCircle2 className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
