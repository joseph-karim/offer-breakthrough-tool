import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step03_AntiGoals: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={3}
        title="Define Your Anti-Goals"
        description="Clarify what you *don't* want to happen as a result of your offer."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll guide you in defining anti-goals to refine your offer strategy.
        </p>
      </Card>
    </div>
  );
}; 