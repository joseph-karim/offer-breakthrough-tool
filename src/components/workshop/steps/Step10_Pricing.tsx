import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step10_Pricing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={10}
        title="Determine Your Pricing Strategy"
        description="Set a price that reflects the value you provide and aligns with your market."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll help you determine the optimal pricing strategy for your offer.
        </p>
      </Card>
    </div>
  );
}; 