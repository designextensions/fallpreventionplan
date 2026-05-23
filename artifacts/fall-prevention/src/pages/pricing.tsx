import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";
import { useDemoAuth } from "@/lib/demoAuth";

export function Pricing() {
  const [, setLocation] = useLocation();
  const { isSignedIn } = useDemoAuth();
  const { data: me } = useGetMe({ query: { enabled: isSignedIn } });

  const handleSelectPlan = (plan: string) => {
    if (isSignedIn) {
      if (plan === 'concierge') {
        setLocation('/contact?plan=concierge');
      } else {
        setLocation(`/account/checkout/${plan}`);
      }
    } else {
      setLocation('/sign-up');
    }
  };

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Invest in your independence
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose the plan that fits your needs. Whether you want to learn independently or want ongoing guidance from a professional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* One-Time */}
          <Card className="flex flex-col relative overflow-hidden border-border/50">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-serif text-2xl text-foreground">Self-Guided</CardTitle>
              <CardDescription className="text-base mt-2">For independent learners</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1">
              <div className="my-6">
                <span className="text-5xl font-bold text-primary">$50</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-4 text-left mt-8">
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Lifetime access to the 10-Point Plan</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>The 5-Point "If a Fall Occurs" Plan</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Equipment & Home Modification Guides</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan('one_time')} 
                variant="outline" 
                className="w-full min-h-[56px] text-lg rounded-full border-primary/20 hover:bg-primary/5"
              >
                Select Self-Guided
              </Button>
            </CardFooter>
          </Card>

          {/* Subscription */}
          <Card className="flex flex-col relative overflow-hidden border-primary shadow-xl scale-100 md:scale-105 z-10 bg-primary/5">
            <div className="absolute top-0 inset-x-0 bg-primary text-primary-foreground text-center py-1.5 text-sm font-bold tracking-wide uppercase">
              Recommended
            </div>
            <CardHeader className="text-center pb-2 mt-6">
              <CardTitle className="font-serif text-2xl text-foreground">Community Plus</CardTitle>
              <CardDescription className="text-base mt-2">For ongoing support and accountability</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1">
              <div className="my-6">
                <span className="text-5xl font-bold text-primary">$19</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
              <ul className="space-y-4 text-left mt-8">
                <li className="flex items-start gap-3 text-lg font-bold">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Everything in Self-Guided, plus:</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Live Group Exercise Classes (3-5x/week)</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Weekly Live Q&A with Geoff</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Access to the full content library</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan('subscription')} 
                className="w-full min-h-[56px] text-lg rounded-full font-bold shadow-md hover:shadow-lg"
              >
                Select Community Plus
              </Button>
            </CardFooter>
          </Card>

          {/* Concierge */}
          <Card className="flex flex-col relative overflow-hidden border-border/50 bg-card">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-serif text-2xl text-foreground">Concierge</CardTitle>
              <CardDescription className="text-base mt-2">For personalized 1-on-1 oversight</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1">
              <div className="my-6">
                <span className="text-xl font-bold text-muted-foreground uppercase tracking-wider">By Application</span>
              </div>
              <ul className="space-y-4 text-left mt-8">
                <li className="flex items-start gap-3 text-lg font-bold">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Everything in Community Plus, plus:</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Proactive weekly outreach</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Dedicated concierge dashboard</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span>Priority 1-on-1 session booking</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectPlan('concierge')} 
                variant="outline" 
                className="w-full min-h-[56px] text-lg rounded-full"
              >
                Contact Us to Apply
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-20 max-w-3xl mx-auto bg-muted/50 rounded-2xl p-8 flex items-start gap-6">
          <Info className="w-8 h-8 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-serif text-xl font-bold mb-2">Have a question before joining?</h4>
            <p className="text-lg text-muted-foreground mb-4">
              We want you to feel completely confident in this program. If you or your family have questions about which plan is right for you, we are here to help.
            </p>
            <Link href="/contact">
              <span className="text-primary font-bold hover:underline text-lg cursor-pointer">
                Send us a message
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
