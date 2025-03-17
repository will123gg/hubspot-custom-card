import { 
  Divider,
  Button,
  Link,
  Text,
  IFrameModal 
} from '@hubspot/ui-extensions';

// Define the card component
hubspot.extend(({ context }) => {
  const { urlProperty } = context.propertyConfiguration;
  const dealProperties = context.propertyValues;
  const externalUrl = dealProperties[urlProperty];

  // Create an instance of IFrameModal
  const modal = new IFrameModal({
    uri: externalUrl,
    width: 1024,
    height: 768
  });

  const handleOpenModal = () => {
    if (externalUrl) {
      modal.open();
    }
  };

  return (
    <>
      <Text>
        <Text format={{ fontWeight: "bold" }}>
          {dealProperties.dealname || "Deal Details"}
        </Text>
      </Text>

      <Divider />

      {dealProperties.amount && (
        <Text>
          Amount: {dealProperties.amount}
        </Text>
      )}

      {dealProperties.dealstage && (
        <Text>
          Stage: {dealProperties.dealstage}
        </Text>
      )}

      <Text format={{ marginTop: 12 }}>
        View additional information about this deal on our external platform.
      </Text>

      <Button
        variant="primary"
        onClick={handleOpenModal}
        disabled={!externalUrl}
      >
        Open External URL
      </Button>

      {externalUrl && (
        <Link href={externalUrl} target="_blank">
          {externalUrl}
        </Link>
      )}
    </>
  );
});
