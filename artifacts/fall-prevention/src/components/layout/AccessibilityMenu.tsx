import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Accessibility } from "lucide-react";
import { useAccessibility, type TextScale } from "@/lib/accessibility";

const SCALE_OPTIONS: { value: TextScale; label: string; sample: string }[] = [
  { value: "normal", label: "Normal", sample: "A" },
  { value: "large", label: "Larger", sample: "A" },
  { value: "xlarge", label: "Largest", sample: "A" },
];

export function AccessibilityMenu() {
  const a11y = useAccessibility();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Accessibility settings"
          className="inline-flex items-center gap-2 min-h-[48px] px-3 rounded-full border border-border bg-background hover:bg-muted/60 text-foreground font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Accessibility className="w-6 h-6" aria-hidden="true" />
          <span className="hidden lg:inline">Accessibility</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-5">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">Accessibility</h2>

        {/* Text size */}
        <div className="mb-5">
          <p className="text-base font-semibold text-foreground mb-2">Text size</p>
          <div
            role="group"
            aria-label="Text size"
            className="grid grid-cols-3 gap-2"
          >
            {SCALE_OPTIONS.map((opt) => {
              const active = a11y.textScale === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => a11y.setTextScale(opt.value)}
                  className={`flex flex-col items-center justify-center gap-1 min-h-[64px] rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <span
                    className={`font-serif font-bold leading-none ${
                      opt.value === "normal" ? "text-base" : opt.value === "large" ? "text-xl" : "text-2xl"
                    }`}
                  >
                    {opt.sample}
                  </span>
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-1">
          <ToggleRow
            id="a11y-contrast"
            label="High contrast"
            description="Darker text and bolder edges"
            checked={a11y.contrast}
            onChange={a11y.toggleContrast}
          />
          <ToggleRow
            id="a11y-grayscale"
            label="Reduce color"
            description="Show the page in grayscale"
            checked={a11y.grayscale}
            onChange={a11y.toggleGrayscale}
          />
          <ToggleRow
            id="a11y-motion"
            label="Reduce motion"
            description="Turn off animations"
            checked={a11y.reduceMotion}
            onChange={a11y.toggleReduceMotion}
          />
        </div>

        <button
          type="button"
          onClick={a11y.reset}
          className="mt-4 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Reset to default
        </button>
      </PopoverContent>
    </Popover>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-3 py-3 cursor-pointer"
    >
      <span>
        <span className="block text-base font-semibold text-foreground">{label}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="scale-125" />
    </label>
  );
}
