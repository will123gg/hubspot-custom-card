declare global {
  interface Window {
    HubSpotCard?: {
      init: () => Promise<void>;
      getDealId: () => Promise<string>;
      getDealProperties: (dealId: string) => Promise<any>;
      getCardConfiguration: () => Promise<{
        urlPropertyName: string;
      }>;
    };
  }
}

// Mock HubSpot SDK for development
const mockHubSpotCard = {
  init: async () => {
    console.log("Mock HubSpot Card initialized");
    return Promise.resolve();
  },
  getDealId: async () => {
    return Promise.resolve("mock-deal-123");
  },
  getDealProperties: async () => {
    return Promise.resolve({
      dealname: "Sample Deal",
      amount: "10000",
      stage: "proposal",
      custom_url: "https://example.com/deal/123" // Using custom property name
    });
  },
  getCardConfiguration: async () => {
    return Promise.resolve({
      urlPropertyName: "custom_url" // This would be configured in HubSpot
    });
  }
};

// Initialize mock SDK if real one is not available
if (typeof window !== "undefined" && !window.HubSpotCard) {
  window.HubSpotCard = mockHubSpotCard;
}

export async function initializeHubspotCard(): Promise<void> {
  if (!window.HubSpotCard) {
    console.warn("HubSpot Card SDK not found, using mock implementation");
    window.HubSpotCard = mockHubSpotCard;
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
    console.warn("HubSpot Card SDK not found, using mock implementation");
    window.HubSpotCard = mockHubSpotCard;
  }

  try {
    const dealId = await window.HubSpotCard.getDealId();
    const dealProperties = await window.HubSpotCard.getDealProperties(dealId);
    const config = await window.HubSpotCard.getCardConfiguration();

    // Use the configured property name to get the URL
    const externalUrl = dealProperties[config.urlPropertyName];

    return {
      dealId,
      dealName: dealProperties.dealname || "Sample Deal",
      amount: dealProperties.amount,
      stage: dealProperties.stage,
      externalUrl: externalUrl // URL from configured property
    };
  } catch (error) {
    console.error("Failed to fetch deal data:", error);
    // Return default data instead of throwing
    return {
      dealId: "demo-deal",
      dealName: "Demo Deal",
      amount: "10000",
      stage: "proposal",
      externalUrl: "https://example.com/demo-deal"
    };
  }
}