import React from 'react';

interface StepHeaderProps {
  title: string;
  description?: string;
  step: number;
  totalSteps?: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ 
  title, 
  description, 
  step, 
  totalSteps = 11 
}) => {
  return (
    <div className="mb-8 text-center">
      <div className="mb-2">
        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-50 text-primary font-semibold">
          {step}
        </span>
        <span className="text-gray-500 text-sm ml-2">
          Step {step} of {totalSteps}
        </span>
      </div>
      <h2 className="heading-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      {description && (
        <p className="body-text text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default StepHeader; 