import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  isActive?: boolean;
  defaultExpanded?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  isActive = false,
  defaultExpanded = false,
}) => {
  // Use internal state if not controlled externally
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Update internal state when defaultExpanded changes
  useEffect(() => {
    if (isExpanded === undefined) {
      setInternalExpanded(defaultExpanded);
    }
  }, [defaultExpanded, isExpanded]);

  // Determine if expanded based on props or internal state
  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded;

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  }, [onToggle, internalExpanded]);

  return (
    <div className="accordion-item mb-4">
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: isActive || expanded ? '#fcf720' : '#f9fafb',
          borderRadius: '15px',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
          marginBottom: expanded ? '16px' : '0',
          fontWeight: 600,
          transition: 'background-color 0.2s ease'
        }}
        role="button"
        aria-expanded={expanded}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#1e293b',
          margin: 0
        }}>
          {title}
        </h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div
          id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
          style={{
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            border: '1px solid #e5e7eb',
            marginTop: '8px',
            marginBottom: '16px'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionGroupProps {
  children: ReactNode;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children
}) => {
  return (
    <div className="accordion-group">
      {children}
    </div>
  );
};
