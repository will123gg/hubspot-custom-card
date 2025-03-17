declare global {
  interface Window {
    HubSpotCard?: {
      init: () => Promise<void>;
      getDealId: () => Promise<string>;
      getDealProperties: (dealId: string) => Promise<any>;
    };
  }
}

export async function initializeHubspotCard(): Promise<void> {
  if (!window.HubSpotCard) {
    throw new Error("HubSpot Card SDK not found");
  }
  
  try {
    await window.HubSpotCard.init();
  } catch (error) {
    console.error("Failed to initialize HubSpot card:", error);
    throw new Error("Failed to initialize HubSpot card");
  }
}

export async function getHubspotDealData() {
  if (!window.HubSpotCard) {
    throw new Error("HubSpot Card SDK not found");
  }

  try {
    const dealId = await window.HubSpotCard.getDealId();
    const dealProperties = await window.HubSpotCard.getDealProperties(dealId);
    
    return {
      dealId,
      dealName: dealProperties.dealname || "Unnamed Deal",
    };
  } catch (error) {
    console.error("Failed to fetch deal data:", error);
    throw new Error("Failed to fetch deal data");
  }
}
