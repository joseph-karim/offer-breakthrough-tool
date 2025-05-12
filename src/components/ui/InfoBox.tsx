import React, { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface InfoBoxProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  showIcon?: boolean;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  className = '',
  style = {},
  title,
  showIcon = true
}) => {
  return (
    <div 
      className={`p-3 rounded mb-4 ${className}`}
      style={{
        backgroundColor: '#feffb7',
        borderColor: '#e5e0a3',
        padding: '12px 15px',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#222222',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '1.5',
        ...style
      }}
    >
      {title && (
        <h4 style={{ 
          fontWeight: 600, 
          fontSize: '15px', 
          marginTop: 0,
          marginBottom: '8px',
          color: '#222222',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {showIcon && <Lightbulb size={16} style={{ color: '#222222' }} />}
          {title}
        </h4>
      )}
      <div style={{ 
        display: showIcon && !title ? 'flex' : 'block',
        alignItems: showIcon && !title ? 'flex-start' : undefined,
        gap: showIcon && !title ? '8px' : undefined
      }}>
        {showIcon && !title && <Lightbulb size={16} style={{ color: '#222222', marginTop: '3px', flexShrink: 0 }} />}
        <div>{children}</div>
      </div>
    </div>
  );
};
