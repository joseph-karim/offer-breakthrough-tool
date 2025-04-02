import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step04_TriggerEvents: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={4}
        title="Trigger Events"
        description="Identify the specific moments when your customers are most likely to seek your solution."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you identify key trigger events that prompt your customers to look for solutions.
        </p>
      </Card>
    </div>
  );
}; 