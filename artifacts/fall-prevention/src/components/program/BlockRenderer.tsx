import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { Film, Image as ImageIcon, FileText, Download, ExternalLink, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Renders a section body written in the Aug 10 2026 content conventions
// (see ../../../../../FPP-WEBSITE-TEMPLATE.md):
//   ---                       one of Dr. Angell's rules = a new "idea block"; blocks alternate shade
//   ![IMG-nn: description]()  image slot (real src once approved; labeled placeholder until then)
//   [video:V4 Label](url)     Vimeo slot (embed when url present; labeled placeholder until then)
//   [printout:Label](url)     printable program PDF button
//   [download:Label](url)     downloadable file button (medication list)
//   [Buy on Amazon](url)      affiliate product button
// Everything else is plain GFM (bold lead sentences, lists, tables).

const BLOCK_SPLIT = /\n[ \t]*-{3,}[ \t]*\n/;

function textOf(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const isHttp = (s: unknown): s is string => typeof s === "string" && /^https?:\/\//.test(s);
// http(s) URL or a site-relative path such as /images/program/IMG-32.webp
const isReady = (s: unknown): s is string => typeof s === "string" && (/^https?:\/\//.test(s) || s.startsWith("/"));

function VideoSlot({ label, href }: { label: string; href?: string }) {
  return (
    <div className="not-prose my-6">
      {isHttp(href) ? (
        <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-black aspect-video relative">
          <iframe
            src={href}
            title={label}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 aspect-video flex flex-col items-center justify-center text-center p-6">
          <Film className="w-12 h-12 text-primary/50 mb-3" aria-hidden="true" />
          <p className="font-serif text-xl font-bold text-foreground">Video coming soon</p>
          <p className="text-base text-muted-foreground mt-1 max-w-md">{label}</p>
        </div>
      )}
      <details className="mt-3 rounded-xl border border-border bg-muted/30">
        <summary className="cursor-pointer list-none flex items-center gap-2 p-3 text-base font-semibold text-foreground">
          <FileText className="w-5 h-5 text-primary" aria-hidden="true" /> Show video transcript
        </summary>
        <div className="px-4 pb-4 text-base text-muted-foreground leading-relaxed">
          A full text transcript will be published here alongside the video, so every lesson can be read as well as watched.
        </div>
      </details>
    </div>
  );
}

function FileButton({ label, href, kind }: { label: string; href?: string; kind: "printout" | "download" | "link" }) {
  const Icon = kind === "link" ? LinkIcon : Download;
  const ready = isReady(href);
  return (
    <span className="not-prose inline-block my-2 mr-3">
      {ready ? (
        <Button asChild variant="outline" className="min-h-[56px] px-6 text-lg rounded-full">
          <a href={href} target={isHttp(href) ? "_blank" : undefined} rel="noreferrer">
            <Icon className="w-5 h-5 mr-2" aria-hidden="true" /> {label}
          </a>
        </Button>
      ) : (
        <Button variant="outline" disabled className="min-h-[56px] px-6 text-lg rounded-full">
          <Icon className="w-5 h-5 mr-2" aria-hidden="true" /> {label} (coming soon)
        </Button>
      )}
    </span>
  );
}

function ImageSlot({ src, alt }: { src?: unknown; alt?: string }) {
  // alt is "IMG-nn: Geoff's description" for slots; strip the id for display
  const desc = (alt ?? "").replace(/^IMG-\w+:\s*/, "");
  if (isReady(src)) {
    return <img src={src} alt={desc} className="rounded-xl border border-border shadow-sm mx-auto" />;
  }
  return (
    <span className="not-prose flex flex-col items-center justify-center text-center gap-2 my-4 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8">
      <ImageIcon className="w-10 h-10 text-muted-foreground/60" aria-hidden="true" />
      <span className="text-base font-medium text-muted-foreground">Image coming soon</span>
      {desc && <span className="text-sm text-muted-foreground/80 max-w-md">{desc}</span>}
    </span>
  );
}

const components = {
  img: ({ src, alt }: { src?: unknown; alt?: string }) => <ImageSlot src={src} alt={alt} />,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    const text = textOf(children).trim();
    const m = /^(video|printout|download|link):\s*(.*)$/s.exec(text);
    if (m) {
      const kind = m[1];
      const label = m[2].trim();
      if (kind === "video") return <VideoSlot label={label} href={href} />;
      return <FileButton label={label} href={href} kind={kind as "printout" | "download" | "link"} />;
    }
    if (text === "Buy on Amazon") {
      return (
        <span className="not-prose inline-block my-2">
          <Button asChild className="min-h-[56px] px-6 text-lg rounded-full font-bold">
            <a href={href} target="_blank" rel="noreferrer sponsored">
              <ExternalLink className="w-5 h-5 mr-2" aria-hidden="true" /> Buy on Amazon
            </a>
          </Button>
        </span>
      );
    }
    return (
      <a href={href} target={isHttp(href) ? "_blank" : undefined} rel="noreferrer" className="underline break-words">
        {children}
      </a>
    );
  },
};

const PROSE =
  "prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:leading-relaxed prose-li:text-lg prose-li:leading-relaxed prose-strong:text-foreground prose-table:text-base";

/** One idea per block, alternating shade so each new concept reads as new. */
export function BlockRenderer({ body, startShade = 0 }: { body: string; startShade?: 0 | 1 }) {
  const blocks = body.split(BLOCK_SPLIT).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        const shaded = (i + startShade) % 2 === 1;
        return (
          <section
            key={i}
            className={`rounded-2xl px-6 py-7 md:px-10 md:py-9 border ${
              shaded ? "bg-primary/[0.06] border-primary/15" : "bg-card border-card-border shadow-sm"
            }`}
          >
            <div className={PROSE}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {block}
              </ReactMarkdown>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Same conventions, no block cards (used where a section is a single flowing letter, e.g. Welcome). */
export function PlainRenderer({ body }: { body: string }) {
  return (
    <div className={PROSE}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body.replace(BLOCK_SPLIT, "\n\n")}
      </ReactMarkdown>
    </div>
  );
}
