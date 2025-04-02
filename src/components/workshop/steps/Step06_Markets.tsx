import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step06_Markets: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={6}
        title="Target Markets"
        description="Identify the specific markets that are the best fit for your offer."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you analyze and select target markets that align with your business goals.
        </p>
      </Card>
    </div>
  );
}; 