import React from 'react';
import { Sparkles } from 'lucide-react';

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
    <div className="mb-10">
      {/* Step number badge with gradient background */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-lg opacity-75"></div>
          <div className="relative bg-gradient-to-br from-primary to-secondary text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
            {step}
          </div>
        </div>
      </div>
      
      {/* Title with decorative elements */}
      <div className="text-center relative">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3 inline-flex items-center justify-center">
          {title}
          <Sparkles className="ml-2 h-6 w-6 text-yellow-500" />
        </h2>
        
        {/* Decorative divider */}
        <div className="flex justify-center items-center my-4">
          <div className="h-0.5 w-10 bg-gray-200 rounded"></div>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded mx-2"></div>
          <div className="h-0.5 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Description with subtle shadow and border */}
      {description && (
        <div className="max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed py-4 px-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepHeader; 