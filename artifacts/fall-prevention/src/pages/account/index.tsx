import { useGetBillingSummary, getGetBillingSummaryQueryKey, useCancelSubscription } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CreditCard, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export function Account() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { data: billing, isLoading } = useGetBillingSummary({ query: { queryKey: getGetBillingSummaryQueryKey() } });
  const cancelSub = useCancelSubscription();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your subscription? You will lose access to live sessions and the library at the end of your billing period.")) {
      cancelSub.mutate(undefined, {
        onSuccess: () => {
          toast({ title: "Subscription canceled", description: "Your cancellation has been processed." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to cancel subscription. Please contact support.", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="flex-1 bg-muted/30 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-primary mb-8">Account & Billing</h1>

        <div className="grid gap-8">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-wider text-primary mb-1">
                    {billing?.tier.replace('_', ' ') || 'Free Tier'}
                  </h3>
                  {billing?.priceLabel && (
                    <p className="text-muted-foreground text-lg">{billing.priceLabel}</p>
                  )}
                  {billing?.nextChargeAt && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-3">
                      <Calendar className="w-4 h-4" /> Next charge: {format(new Date(billing.nextChargeAt), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  {billing?.tier !== 'concierge' && (
                    <Link href="/pricing" className="w-full sm:w-auto">
                      <Button className="w-full min-h-[48px] rounded-full font-bold">Upgrade Plan</Button>
                    </Link>
                  )}
                  {billing?.tier === 'subscription' && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={cancelSub.isPending}
                      className="w-full sm:w-auto min-h-[48px] rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      {cancelSub.isPending ? "Canceling..." : "Cancel Subscription"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billing?.invoices && billing.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-sm font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-bold">Date</th>
                        <th className="pb-3 px-4 font-bold">Description</th>
                        <th className="pb-3 pl-4 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {billing.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-4 pr-4 text-base whitespace-nowrap">
                            {format(new Date(inv.paidAt), "MMM d, yyyy")}
                          </td>
                          <td className="py-4 px-4 text-base font-medium">
                            {inv.description}
                          </td>
                          <td className="py-4 pl-4 text-base text-right font-mono">
                            ${(inv.amountCents / 100).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No billing history found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
