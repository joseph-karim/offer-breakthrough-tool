import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';

export const Step02_MarketDemand: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={2}
        title="Market Demand Analysis"
        description="Understand what your market truly wants and is willing to pay for."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you analyze your market's demand to create an offer that resonates.
        </p>
      </Card>
    </div>
  );
}; 