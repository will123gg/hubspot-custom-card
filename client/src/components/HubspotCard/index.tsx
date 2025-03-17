import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initializeHubspotCard, getHubspotDealData } from "@/lib/hubspot";

interface DealData {
  dealId: string;
  dealName: string;
  amount?: string;
  stage?: string;
  externalUrl?: string;
}

/**
 * @hubspot/ui-extension
 * @name External URL Viewer Card
 * @description A custom card that displays deal information and allows opening an external URL.
 * @cardType DEAL
 * @properties
 *   - dealId: string - The ID of the HubSpot deal.
 *   - dealName: string - The name of the HubSpot deal.
 *   - amount: string - The amount of the HubSpot deal (optional).
 *   - stage: string - The stage of the HubSpot deal (optional).
 *   - externalUrl: string - The external URL associated with the deal (optional).
 */
export function HubspotCard() {
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initCard = async () => {
      try {
        await initializeHubspotCard();
        const data = await getHubspotDealData();
        setDealData(data);
      } catch (error) {
        console.error("Error initializing card:", error);
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Using demo data for preview purposes.",
        });
        // Set demo data even if initialization fails
        setDealData({
          dealId: "demo-deal",
          dealName: "Demo Deal",
          amount: "$10,000",
          stage: "Proposal",
          externalUrl: "https://example.com/demo-deal"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initCard();
  }, [toast]);

  const handleOpenUrl = () => {
    if (!dealData?.externalUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No external URL available for this deal.",
      });
      return;
    }
    window.open(dealData.externalUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="w-full min-h-[200px] flex items-center justify-center">
        <CardContent>
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-[200px] bg-primary/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative max-w-lg mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {dealData?.dealName || "Deal Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealData?.amount && (
              <p className="text-sm">Amount: {dealData.amount}</p>
            )}
            {dealData?.stage && (
              <p className="text-sm">Stage: {dealData.stage}</p>
            )}
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">
                View additional information about this deal on our external platform.
              </p>
            </div>
            <Button 
              onClick={handleOpenUrl}
              className="w-full"
              variant="outline"
              disabled={!dealData?.externalUrl}
            >
              Open External Page
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HubspotCard;