import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step11_Summary: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={11}
        title="Summary & Action Plan"
        description="Review your workshop results and plan your next steps."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you summarize your workshop insights and create an actionable plan for implementing your offer.
        </p>
      </Card>
    </div>
  );
}; 