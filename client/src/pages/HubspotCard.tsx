import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initializeHubspotCard, getHubspotDealData } from "@/lib/hubspot";

interface DealData {
  dealId: string;
  dealName: string;
  amount?: string;
  stage?: string;
}

export default function HubspotCard() {
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  const { toast } = useToast();

  // Replace with your actual target URL
  const targetUrl = "https://example.com";

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
          stage: "Proposal"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initCard();
  }, [toast]);

  const toggleIframe = () => {
    setShowIframe(!showIframe);
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
              onClick={toggleIframe}
              className="w-full"
              variant="outline"
            >
              {showIframe ? "Close External Page" : "Open External Page"}
              {showIframe ? (
                <X className="ml-2 h-4 w-4" />
              ) : (
                <ExternalLink className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Iframe overlay */}
      {showIframe && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50"
              onClick={toggleIframe}
            >
              <X className="h-4 w-4" />
            </Button>
            <iframe
              src={targetUrl}
              className="w-full h-full rounded-lg"
              title="External Content"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}