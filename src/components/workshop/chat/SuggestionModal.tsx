import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';

interface Suggestion {
  id: string;
  content: string;
  type: 'overarching' | 'supporting';
}

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  currentInput: string;
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  currentInput,
  suggestions,
  onSelectSuggestion
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [ratings, setRatings] = useState<Record<string, 'up' | 'down' | null>>({});

  const handleRating = (suggestionId: string, rating: 'up' | 'down') => {
    setRatings(prev => ({
      ...prev,
      [suggestionId]: prev[suggestionId] === rating ? null : rating
    }));
  };

  const handleSelect = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleConfirm = () => {
    if (selectedSuggestion) {
      onSelectSuggestion(selectedSuggestion);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={20} color="#666666" />
          </button>
        </div>

        {/* Description */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6 }}>{description}</p>
        </div>

        {/* Context Panel */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>Your Current Input:</h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{currentInput}</p>
        </div>

        {/* Suggestions Grid */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {suggestions.map(suggestion => (
              <div
                key={suggestion.id}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: `2px solid ${selectedSuggestion?.id === suggestion.id ? '#0ea5e9' : '#e5e7eb'}`,
                  backgroundColor: selectedSuggestion?.id === suggestion.id ? '#f0f9ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                onClick={() => handleSelect(suggestion)}
              >
                <div style={{ fontSize: '15px', lineHeight: 1.6 }}>
                  {suggestion.content}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(suggestion.id, 'up');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: ratings[suggestion.id] === 'up' ? '#16a34a' : '#6b7280'
                      }}
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(suggestion.id, 'down');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: ratings[suggestion.id] === 'down' ? '#dc2626' : '#6b7280'
                      }}
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                  {selectedSuggestion?.id === suggestion.id && (
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      borderRadius: '9999px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Check size={12} />
                      Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedSuggestion}
          >
            Use Selected
          </Button>
        </div>
      </div>
    </Modal>
  );
};
