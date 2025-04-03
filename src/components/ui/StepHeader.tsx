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
        primary: '#4f46e5', // indigo
        secondary: '#8b5cf6', // violet
        accent: '#a855f7', // purple
        light: '#eef2ff', // indigo-50
      },
      {
        primary: '#8b5cf6', // violet
        secondary: '#a855f7', // purple
        accent: '#d946ef', // fuchsia
        light: '#f5f3ff', // violet-50
      },
      {
        primary: '#a855f7', // purple
        secondary: '#d946ef', // fuchsia
        accent: '#ec4899', // pink
        light: '#faf5ff', // purple-50
      },
      {
        primary: '#d946ef', // fuchsia
        secondary: '#ec4899', // pink
        accent: '#f43f5e', // rose
        light: '#fdf4ff', // fuchsia-50
      },
      {
        primary: '#ec4899', // pink
        secondary: '#f43f5e', // rose
        accent: '#f97316', // orange
        light: '#fdf2f8', // pink-50
      },
      {
        primary: '#3b82f6', // blue
        secondary: '#6366f1', // indigo
        accent: '#8b5cf6', // violet
        light: '#eff6ff', // blue-50
      },
      {
        primary: '#14b8a6', // teal
        secondary: '#0ea5e9', // sky
        accent: '#3b82f6', // blue
        light: '#f0fdfa', // teal-50
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#4b5563', // gray-600
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