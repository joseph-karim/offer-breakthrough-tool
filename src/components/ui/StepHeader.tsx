import React from 'react';

interface StepHeaderProps {
  title: string;
  description?: string;
  step: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ 
  title, 
  description, 
  step
}) => {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 flex justify-center items-center">
        <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-md">
          {step}
        </div>
      </div>
      
      <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      
      <div className="flex justify-center items-center mb-4">
        <div className="h-1 w-20 bg-secondary rounded"></div>
      </div>
      
      {description && (
        <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          {description}
        </p>
      )}
    </div>
  );
};

export default StepHeader; 