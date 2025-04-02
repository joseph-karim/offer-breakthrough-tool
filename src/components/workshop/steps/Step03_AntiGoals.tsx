import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step03_AntiGoals: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={3}
        title="Anti-Goals"
        description="Define what you don't want to help clarify what you do want."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you identify anti-goals to create clear boundaries for your offer.
        </p>
      </Card>
    </div>
  );
}; 