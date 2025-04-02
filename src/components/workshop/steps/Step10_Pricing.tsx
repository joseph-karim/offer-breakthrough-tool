import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step10_Pricing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={10}
        title="Pricing Strategy"
        description="Develop a pricing approach that maximizes value for both you and your customers."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you develop a pricing strategy that reflects the value of your offer.
        </p>
      </Card>
    </div>
  );
}; 