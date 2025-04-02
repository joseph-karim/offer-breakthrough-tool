import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step05_Jobs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={5}
        title="Jobs To Be Done"
        description="Understand what your customers are really trying to accomplish."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you identify the key jobs your customers need done through their purchase.
        </p>
      </Card>
    </div>
  );
}; 