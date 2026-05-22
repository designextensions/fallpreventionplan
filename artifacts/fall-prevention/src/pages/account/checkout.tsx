import { useLocation, useParams } from "wouter";
import { useMockCheckout } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CheckoutInputPlan } from "@workspace/api-client-react/src/generated/api.schemas";

export function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const { plan } = useParams<{ plan: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const checkout = useMockCheckout();

  // Validate plan type
  const isValidPlan = plan === 'one_time' || plan === 'subscription';
  
  if (!isValidPlan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <h2 className="font-serif text-2xl font-bold mb-4">Invalid Plan Selected</h2>
        <Button onClick={() => setLocation('/pricing')} className="min-h-[48px] rounded-full">
          Return to Pricing
        </Button>
      </div>
    );
  }

  const planType = plan as CheckoutInputPlan;
  const isOneTime = planType === 'one_time';
  const price = isOneTime ? "$50.00" : "$19.00";
  const title = isOneTime ? "Self-Guided Plan" : "Community Plus Subscription";

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    checkout.mutate(
      { data: { plan: planType } },
      {
        onSuccess: () => {
          toast({ title: "Payment Successful", description: "Welcome to the program!" });
          setLocation('/dashboard');
        },
        onError: () => {
          toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="flex-1 bg-muted/30 py-12 md:py-20 flex flex-col">
      <div className="container mx-auto px-4 max-w-xl flex-1 flex flex-col justify-center">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Complete your purchase</h1>
          <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" /> Secure SSL Checkout
          </p>
        </div>

        <Card className="border-border shadow-xl overflow-hidden">
          <div className="bg-primary text-primary-foreground p-6">
            <h2 className="font-serif text-2xl font-bold">{title}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{price}</span>
              <span className="text-primary-foreground/80">{isOneTime ? 'one-time' : '/ month'}</span>
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8">
            <form id="mock-checkout" onSubmit={handleCheckout} className="space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                  <h3 className="font-bold text-lg">Payment Details</h3>
                  <div className="flex gap-2">
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cc" className="text-base font-bold">Card Number</Label>
                  <div className="relative">
                    <Input id="cc" required placeholder="0000 0000 0000 0000" className="min-h-[48px] text-lg pl-10 font-mono" />
                    <CreditCard className="w-5 h-5 text-muted-foreground absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp" className="text-base font-bold">Expiry</Label>
                    <Input id="exp" required placeholder="MM/YY" className="min-h-[48px] text-lg font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-base font-bold">CVC</Label>
                    <Input id="cvc" required placeholder="123" className="min-h-[48px] text-lg font-mono" />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="name" className="text-base font-bold">Name on Card</Label>
                  <Input id="name" required placeholder="Jane Doe" className="min-h-[48px] text-lg" />
                </div>
              </div>
            </form>

            <div className="mt-8 bg-muted/50 p-4 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a secure mock checkout for demonstration purposes. 
                No real transactions will be processed.
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-6 md:p-8 pt-0 border-t border-border bg-card flex flex-col gap-4">
            <Button 
              type="submit" 
              form="mock-checkout"
              disabled={checkout.isPending}
              className="w-full min-h-[56px] text-xl font-bold rounded-full shadow-md"
            >
              {checkout.isPending ? "Processing..." : `Pay ${price}`}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              By confirming, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
