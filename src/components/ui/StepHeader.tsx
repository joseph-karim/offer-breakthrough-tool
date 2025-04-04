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
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
      },
      {
        primary: '#FFDD00', // CustomerCamp Yellow
        secondary: '#6B46C1', // CustomerCamp Purple
        accent: '#FFDD00', // CustomerCamp Yellow
        light: '#333333', // Dark background
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
  
  // Badge styles with pulsing glow
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
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color: 'white',
    fontWeight: 700,
    fontSize: '18px',
    marginRight: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };
  
  const badgeGlowStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${colors.primary}00, ${colors.primary}40)`,
    filter: 'blur(8px)',
    animation: 'pulse 2s infinite',
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
    backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    position: 'relative',
    marginRight: '12px',
  };
  
  const sparkleStyle: CSSProperties = {
    color: colors.accent,
  };
  
  // Decorative divider
  const dividerStyle: CSSProperties = {
    height: '4px',
    width: '80px',
    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
    borderRadius: '2px',
    marginBottom: '20px',
  };
  
  // Description styles with glassmorphism card
  const descriptionCardStyle: CSSProperties = {
    backgroundColor: 'rgba(34, 34, 34, 0.8)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 221, 0, 0.3)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#FFFFFF', // White text
    maxWidth: '800px',
  };
  
  // Create animations
  const animationStyles = `
    @keyframes pulse {
      0% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.15); }
      100% { opacity: 0.4; transform: scale(1); }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
  `;
  
  return (
    <>
      <style>{animationStyles}</style>
      <div style={containerStyle}>
        <div style={badgeContainerStyle}>
          <div style={badgeStyle}>
            <div style={badgeGlowStyle}></div>
            {stepNumber}
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.primary,
          }}>
            Step {stepNumber}
          </span>
        </div>
        
        <div style={titleContainerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <Sparkles style={{...sparkleStyle, width: '24px', height: '24px', animation: 'float 3s ease-in-out infinite'}} />
        </div>
        
        <div style={dividerStyle}></div>
        
        <div style={descriptionCardStyle}>
          {description}
        </div>
      </div>
    </>
  );
};    