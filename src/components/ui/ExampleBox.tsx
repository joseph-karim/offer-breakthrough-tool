import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExampleBoxProps {
  examples?: string[];
  title?: string;
  initiallyVisible?: boolean;
  children?: ReactNode;
}

export const ExampleBox: React.FC<ExampleBoxProps> = ({
  examples = [],
  title = 'EXAMPLES',
  initiallyVisible = true,
  children
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{
      backgroundColor: '#F0E6FF',
      borderRadius: '15px',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isVisible ? '15px' : '0'
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '14px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          backgroundColor: '#6B46C1',
          padding: '4px 12px',
          borderRadius: '20px'
        }}>
          {title}
        </div>
        <button
          onClick={toggleVisibility}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B46C1',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isVisible ? (
            <>
              Hide <ChevronUp size={16} style={{ marginLeft: '4px' }} />
            </>
          ) : (
            <>
              Show <ChevronDown size={16} style={{ marginLeft: '4px' }} />
            </>
          )}
        </button>
      </div>

      {isVisible && (
        <>
          {examples.length > 0 ? (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#333333',
              fontSize: '14px'
            }}>
              {examples.map((example, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: index < examples.length - 1 ? '10px' : '0',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}
                >
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  {example}
                </li>
              ))}
            </ul>
          ) : (
            children
          )}
        </>
      )}
    </div>
  );
};
