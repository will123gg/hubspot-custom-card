declare global {
  interface Window {
    HubSpotCard?: {
      init: () => Promise<void>;
      getDealId: () => Promise<string>;
      getDealProperties: (dealId: string) => Promise<any>;
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
      external_url: "https://example.com/deal/123" // Added external_url property
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

    return {
      dealId,
      dealName: dealProperties.dealname || "Sample Deal",
      amount: dealProperties.amount,
      stage: dealProperties.stage,
      externalUrl: dealProperties.external_url // Added externalUrl to return object
    };
  } catch (error) {
    console.error("Failed to fetch deal data:", error);
    // Return default data instead of throwing
    return {
      dealId: "demo-deal",
      dealName: "Demo Deal",
      amount: "10000",
      stage: "proposal",
      externalUrl: "https://example.com/demo-deal" // Added default external URL
    };
  }
}