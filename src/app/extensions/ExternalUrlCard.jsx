import { 
  Divider,
  Button,
  Link,
  Text,
  hubspot,
  Modal 
} from '@hubspot/ui-extensions';
import React from 'react'; //Import React for useState

// Define the card component
hubspot.extend(({ context, runServerless, actions }) => (
  <ExternalUrlCard 
    context={context} 
    runServerless={runServerless} 
    actions={actions} 
  />
));

const ExternalUrlCard = ({ context }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { urlProperty } = context.propertyConfiguration;
  const dealProperties = context.propertyValues;
  const externalUrl = dealProperties[urlProperty];

  const handleOpenModal = () => {
    if (externalUrl) {
      setIsModalOpen(true);
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
        Open in modal
      </Button>

      {externalUrl && (
        <Link href={externalUrl} target="_blank">
          {externalUrl}
        </Link>
      )}

      {isModalOpen && (
        <Modal
          title="External Content"
          onClose={() => setIsModalOpen(false)}
        >
          <iframe
            src={externalUrl}
            style={{
              width: '100%',
              height: '600px',
              border: 'none'
            }}
          />
        </Modal>
      )}
    </>
  );
};