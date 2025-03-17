import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initializeHubspotCard, getHubspotDealData } from "@/lib/hubspot";

interface DealData {
  dealId: string;
  dealName: string;
}

export default function HubspotCard() {
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const targetUrl = "https://example.com"; // Replace with your target URL

  useEffect(() => {
    const initCard = async () => {
      try {
        await initializeHubspotCard();
        const data = await getHubspotDealData();
        setDealData(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize HubSpot card. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initCard();
  }, [toast]);

  const handleRedirect = () => {
    try {
      window.open(targetUrl, '_blank');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open the target URL. Please try again.",
      });
    }
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {dealData?.dealName || "Deal Details"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">
              View additional information about this deal on our external platform.
            </p>
          </div>
          <Button 
            onClick={handleRedirect}
            className="w-full"
          >
            Open External Page
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
