import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step06_Markets: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={6}
        title="Select Your Target Market"
        description="Identify the most profitable and reachable customer segment for your offer."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll assist you in evaluating and selecting the ideal target market.
        </p>
      </Card>
    </div>
  );
}; 