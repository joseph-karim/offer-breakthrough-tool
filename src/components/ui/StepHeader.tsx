import { CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
}

export const StepHeader = ({ stepNumber, title, description }: StepHeaderProps) => {
  // Get color scheme based on step number
  const getStepColors = (step: number) => {
    const schemes = [
      { 
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#222222', // Black
        accent: '#6B46C1', // Purple accent
        light: '#FFFFFF', // Light background
      },
    ];
    
    // Use modulo to cycle through color schemes
    return schemes[(step - 1) % schemes.length];
  };
  
  const colors = getStepColors(stepNumber);
  
  // Create container styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '32px',
  };
  
  const badgeContainerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '16px',
  };
  
  const badgeStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: colors.secondary,
    fontWeight: 700,
    fontSize: '18px',
    marginRight: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };
  
  // Title styles
  const titleContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };
  
  const titleStyle: CSSProperties = {
    fontSize: '32px',
    fontWeight: 800,
    color: colors.secondary,
    position: 'relative',
    marginRight: '12px',
  };
  
  const sparkleStyle: CSSProperties = {
    color: colors.primary,
  };
  
  // Decorative divider
  const dividerStyle: CSSProperties = {
    height: '4px',
    width: '80px',
    backgroundColor: colors.primary,
    borderRadius: '2px',
    marginBottom: '20px',
  };
  
  const descriptionCardStyle: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #EEEEEE',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#333333',
    maxWidth: '800px',
  };
  
  return (
    <>
      <div style={containerStyle}>
        <div style={badgeContainerStyle}>
          <div style={badgeStyle}>
            {stepNumber}
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.secondary,
          }}>
            Step {stepNumber}
          </span>
        </div>
        
        <div style={titleContainerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <Sparkles style={{...sparkleStyle, width: '24px', height: '24px'}} />
        </div>
        
        <div style={dividerStyle}></div>
        
        <div style={descriptionCardStyle}>
          {description}
        </div>
      </div>
    </>
  );
};       