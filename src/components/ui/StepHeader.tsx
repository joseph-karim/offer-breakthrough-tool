import React, { CSSProperties } from 'react';
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
      {
        gradient: 'linear-gradient(to bottom right, #4f46e5, #3b82f6)',
        textGradient: 'linear-gradient(to right, #4338ca, #2563eb)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)',
        textGradient: 'linear-gradient(to right, #7c3aed, #db2777)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #ec4899, #f43f5e)',
        textGradient: 'linear-gradient(to right, #db2777, #e11d48)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #f43f5e, #ef4444)',
        textGradient: 'linear-gradient(to right, #e11d48, #dc2626)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #f59e0b, #eab308)',
        textGradient: 'linear-gradient(to right, #d97706, #ca8a04)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #10b981, #16a34a)',
        textGradient: 'linear-gradient(to right, #059669, #15803d)',
      },
      {
        gradient: 'linear-gradient(to bottom right, #06b6d4, #0ea5e9)',
        textGradient: 'linear-gradient(to right, #0891b2, #0284c7)',
      },
    ];
    
    const index = (step - 1) % colorSchemes.length;
    return colorSchemes[index];
  };
  
  const colors = getStepColors();

  // Define styles to avoid utility class issues
  const glassDescriptionStyle: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const titleStyle: CSSProperties = {
    fontFamily: "'Mada', sans-serif",
    fontWeight: 700,
    color: 'transparent',
    backgroundImage: colors.textGradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
  };

  const badgeGlowStyle: CSSProperties = {
    position: 'absolute',
    inset: '-1.25rem',
    backgroundImage: colors.gradient,
    borderRadius: '9999px',
    opacity: 0.75,
    filter: 'blur(1rem)',
  };

  const badgeStyle: CSSProperties = {
    position: 'relative',
    backgroundImage: colors.gradient,
    color: 'white',
    width: '5rem',
    height: '5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '2px solid white',
  };

  const dividerStyle: CSSProperties = {
    height: '0.25rem',
    width: '6rem',
    backgroundImage: colors.gradient,
    borderRadius: '9999px',
    margin: '0 0.5rem',
  };

  const gradientBorderStyle: CSSProperties = {
    position: 'absolute',
    inset: '-0.25rem',
    backgroundImage: colors.gradient,
    borderRadius: '1rem',
    filter: 'blur(0.25rem)',
    opacity: 0.3,
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
          <div style={badgeGlowStyle}></div>
          <div style={badgeStyle}>
            {step}
            <span className="absolute -bottom-1 -right-1">
              <Star className="w-5 h-5 text-white fill-white" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Title with decorative elements and gradient text */}
      <div className="text-center relative">
        <h2 
          className="text-3xl md:text-4xl mb-3 inline-flex items-center justify-center"
          style={titleStyle}
        >
          {title}
          <Sparkles className="ml-2 h-6 w-6 text-yellow-500" />
        </h2>
        
        {/* Decorative divider with gradient */}
        <div className="flex justify-center items-center my-5">
          <div className="h-0.5 w-6 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <div style={dividerStyle}></div>
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
            <div style={gradientBorderStyle}></div>
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