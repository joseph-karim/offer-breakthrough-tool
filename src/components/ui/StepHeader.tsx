import React from 'react';
import { Sparkles, Star, Zap } from 'lucide-react';

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
  // Different colors based on step number to add variety
  const getStepColors = () => {
    // Create a rotating color scheme based on step number
    const colorSchemes = [
      {from: 'from-indigo-500', to: 'to-blue-500', textFrom: 'from-indigo-600', textTo: 'to-blue-600'},
      {from: 'from-purple-500', to: 'to-pink-500', textFrom: 'from-purple-600', textTo: 'to-pink-600'},
      {from: 'from-pink-500', to: 'to-rose-500', textFrom: 'from-pink-600', textTo: 'to-rose-600'},
      {from: 'from-rose-500', to: 'to-red-500', textFrom: 'from-rose-600', textTo: 'to-red-600'},
      {from: 'from-amber-500', to: 'to-yellow-500', textFrom: 'from-amber-600', textTo: 'to-yellow-600'},
      {from: 'from-emerald-500', to: 'to-green-500', textFrom: 'from-emerald-600', textTo: 'to-green-600'},
      {from: 'from-teal-500', to: 'to-cyan-500', textFrom: 'from-teal-600', textTo: 'to-cyan-600'},
    ];
    
    const index = (step - 1) % colorSchemes.length;
    return colorSchemes[index];
  };
  
  const colors = getStepColors();

  // Define glass style for description to avoid utility class issues
  const glassDescriptionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  return (
    <div className="mb-12">
      {/* Decorative elements */}
      <div className="absolute left-0 right-0 h-48 overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-2xl"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full blur-3xl"></div>
      </div>
      
      {/* Step number badge with vibrant gradient background */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className={`absolute -inset-5 bg-gradient-to-br ${colors.from} ${colors.to} rounded-full blur-xl opacity-75`}></div>
          <div className={`relative bg-gradient-to-br ${colors.from} ${colors.to} text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white`}>
            {step}
            <span className="absolute -bottom-1 -right-1">
              <Star className="w-5 h-5 text-white fill-white" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Title with decorative elements and gradient text */}
      <div className="text-center relative">
        <h2 className={`font-display text-3xl md:text-4xl font-bold mb-3 inline-flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r ${colors.textFrom} ${colors.textTo}`}>
          {title}
          <Sparkles className="ml-2 h-6 w-6 text-yellow-500" />
        </h2>
        
        {/* Decorative divider with gradient */}
        <div className="flex justify-center items-center my-5">
          <div className="h-0.5 w-6 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <div className={`h-1 w-24 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full mx-2`}></div>
          <div className="h-0.5 w-6 bg-gradient-to-r from-gray-200 to-transparent rounded"></div>
        </div>
        
        {/* Decorative sparkles */}
        <div className="absolute -top-6 left-1/3 transform -translate-x-1/2">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="absolute top-10 right-1/3 transform translate-x-1/2">
          <Sparkles className="h-4 w-4 text-pink-400" />
        </div>
      </div>
      
      {/* Description with glass effect and gradient border */}
      {description && (
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${colors.from} ${colors.to} rounded-2xl blur-sm opacity-30`}></div>
            <p 
              className="relative text-base md:text-lg text-gray-700 leading-relaxed py-6 px-8 rounded-xl text-center"
              style={glassDescriptionStyle}
            >
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepHeader; 