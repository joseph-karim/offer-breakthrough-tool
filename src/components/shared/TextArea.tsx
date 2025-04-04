import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
}

export const TextArea = ({ label, description, className = '', ...props }: TextAreaProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold" style={{ 
        color: '#FFDD00',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 700
      }}>
        <span style={{ 
          backgroundColor: 'rgba(255, 221, 0, 0.2)', 
          width: '24px', 
          height: '24px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid rgba(255, 221, 0, 0.4)'
        }}>✏️</span>
        {label}
      </label>
      {description && (
        <p className="mb-2" style={{ 
          color: '#FFFFFF',
          paddingLeft: '32px',
          fontSize: '15px'
        }}>✨ {description}</p>
      )}
      <textarea
        className={`w-full min-h-[100px] p-3 rounded-md ${className}`}
        style={{
          backgroundColor: '#333333',
          color: '#FFFFFF',
          border: '1px solid #444444',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '15px',
          lineHeight: 1.6
        }}
        {...props}
      />
    </div>
  );
};  