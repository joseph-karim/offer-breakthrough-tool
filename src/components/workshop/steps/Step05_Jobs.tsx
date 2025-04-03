import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';

export const Step05_Jobs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={5}
        title="Uncover Jobs To Be Done"
        description="Determine the underlying motivations and goals your customers are trying to achieve."
      />
      
      <Card variant="default" padding="lg" shadow="md">
        <p className="text-gray-700">
          This step is coming soon. We'll help you uncover the 'jobs' your customers are hiring your product/service to do.
        </p>
      </Card>
    </div>
  );
}; 