import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SuggestionBubbleProps {
  id: string;
  content: string;
  type: string;
  onAdd: (id: string, content: string, type: string) => void;
  isAdded?: boolean;
}

export const SuggestionBubble: React.FC<SuggestionBubbleProps> = ({
  id,
  content,
  type,
  onAdd,
  isAdded = false
}) => {
  return (
    <div
      style={{
        backgroundColor: isAdded ? '#F0FFF4' : '#FFFFFF',
        border: `1px solid ${isAdded ? '#10B981' : '#EEEEEE'}`,
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{
        fontSize: '15px',
        lineHeight: 1.5,
        color: '#333333',
        marginBottom: '12px'
      }}>
        {content}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '13px',
          color: '#666666',
          fontStyle: 'italic'
        }}>
          {getTypeLabel(type)}
        </div>
        
        <Button
          variant={isAdded ? "success" : "yellow"}
          size="sm"
          onClick={() => !isAdded && onAdd(id, content, type)}
          disabled={isAdded}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isAdded ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <Plus size={14} />
              Add to Workshop
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Helper function to get a human-readable label for the suggestion type
function getTypeLabel(type: string): string {
  switch (type) {
    case 'big-idea':
      return 'Big Idea Statement';
    case 'underlying-goal':
      return 'Business Goal';
    case 'trigger-events':
      return 'Trigger Event';
    case 'jobs':
      return 'Job Statement';
    case 'target-buyers':
      return 'Target Buyer Segment';
    case 'pains':
      return 'Pain Point';
    case 'problem-up':
      return 'Problem Focus';
    case 'offer-concepts':
      return 'Offer Concept';
    case 'next-steps':
      return 'Next Step';
    default:
      return 'Suggestion';
  }
}
