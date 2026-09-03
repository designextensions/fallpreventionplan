// The title band Dr. Angell put at the top of every member page in his template
// ("THE FALL PREVENTION PLAN / A Comprehensive Online Program to Improve Balance
// and Decrease Fall Risk"). One component so the wording stays identical everywhere.
export function ProgramBanner({ eyebrow, heading }: { eyebrow?: string; heading?: string }) {
  return (
    <div className="bg-primary/[0.08] border-b border-primary/15">
      <div className="container mx-auto px-4 max-w-4xl py-8 text-center">
        {eyebrow && <p className="text-lg font-semibold text-muted-foreground mb-1">{eyebrow}</p>}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary tracking-tight uppercase">
          The Fall Prevention Plan
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mt-2">
          A Comprehensive Online Program to Improve Balance and Decrease Fall Risk
        </p>
        {heading && (
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-6">{heading}</h2>
        )}
      </div>
    </div>
  );
}
