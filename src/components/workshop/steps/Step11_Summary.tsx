import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step11_Summary: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={11}
        title="Workshop Summary & Next Steps"
        description="Review your offer breakthrough and plan your path forward."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll provide a summary of your workshop progress and suggest next steps.
        </p>
      </Card>
    </div>
  );
}; 