import React, { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface ContextBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ContextBox: React.FC<ContextBoxProps> = ({
  title = 'Context for Sparky:',
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`bg-yellow-100 p-3 rounded border border-yellow-300 mb-4 ${className}`}
      style={{
        backgroundColor: '#feffb7',
        borderColor: '#e5e0a3',
        ...style
      }}
    >
      <h4 className="font-semibold text-sm text-yellow-800 mb-2" style={{
        color: '#6b5900',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Lightbulb size={16} style={{ color: '#6b5900' }} />
        {title}
      </h4>
      <div className="text-sm text-yellow-700" style={{ color: '#6b5900' }}>
        {children}
      </div>
    </div>
  );
};
