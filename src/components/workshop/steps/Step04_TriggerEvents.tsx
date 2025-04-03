import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step04_TriggerEvents: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={4}
        title="Identify Trigger Events"
        description="Pinpoint the moments that make your target audience seek out solutions like yours."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll help you understand the critical trigger events for your market.
        </p>
      </Card>
    </div>
  );
}; 