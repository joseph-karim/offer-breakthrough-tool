import React from 'react';
import { Check } from 'lucide-react';
import { BrainstormIdea } from '../../../services/brainstormService';

interface BrainstormSuggestionProps {
  idea: BrainstormIdea;
  onUse: (idea: BrainstormIdea) => void;
  isUsed?: boolean;
}

export const BrainstormSuggestion: React.FC<BrainstormSuggestionProps> = ({
  idea,
  onUse,
  isUsed = false
}) => {
  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '15px',
        border: '1px solid',
        borderColor: isUsed ? '#10B981' : '#EEEEEE',
        backgroundColor: isUsed ? '#F0FDF4' : '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isUsed && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: 'bold',
          borderBottomLeftRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Check size={12} />
          Used
        </div>
      )}
      
      <h4 style={{
        margin: '0 0 8px 0',
        fontSize: '16px',
        fontWeight: 600,
        color: '#333333'
      }}>
        {idea.conceptName}
      </h4>
      
      <p style={{
        margin: '0 0 16px 0',
        fontSize: '14px',
        lineHeight: 1.5,
        color: '#555555'
      }}>
        {idea.description}
      </p>
      
      {!isUsed && (
        <button
          onClick={() => onUse(idea)}
          style={{
            backgroundColor: '#FFDD00',
            color: '#333333',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Use this idea
        </button>
      )}
    </div>
  );
};
