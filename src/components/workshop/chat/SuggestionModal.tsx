import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { createPortal } from 'react-dom';

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

  // Create a div for the modal root if it doesn't exist
  const getOrCreateModalRoot = () => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    return modalRoot;
  };

  // Create a div for this specific modal instance
  const [modalElement] = useState(() => document.createElement('div'));

  // Add styles to ensure modal is on top
  useEffect(() => {
    if (isOpen) {
      const modalRoot = getOrCreateModalRoot();

      // Apply styles to the modal element
      modalElement.style.position = 'fixed';
      modalElement.style.top = '0';
      modalElement.style.left = '0';
      modalElement.style.right = '0';
      modalElement.style.bottom = '0';
      modalElement.style.zIndex = '2147483647'; // Max possible z-index
      modalElement.style.display = 'flex';
      modalElement.style.justifyContent = 'center';
      modalElement.style.alignItems = 'center';

      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';

      // Append the element to the modal root
      modalRoot.appendChild(modalElement);

      // Add a class to the body to help with styling
      document.body.classList.add('modal-open');

      return () => {
        // Clean up when the component unmounts or when isOpen changes to false
        modalRoot.removeChild(modalElement);
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen, modalElement]);

  if (!isOpen) return null;

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

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2147483647
      }}
      onClick={(e) => {
        // Close the modal when clicking on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#222222',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #333333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }}>{title}</h2>
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
            <X size={20} color="#AAAAAA" />
          </button>
        </div>

        {/* Description */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #333333',
          backgroundColor: '#333333'
        }}>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#CCCCCC' }}>{description}</p>
        </div>

        {/* Context Panel */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #333333',
          backgroundColor: '#444444',
          borderLeft: '4px solid #FFDD00'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>Your Current Input:</h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#CCCCCC' }}>{currentInput}</p>
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
                  borderRadius: '15px',
                  border: `2px solid ${selectedSuggestion?.id === suggestion.id ? '#FFDD00' : '#444444'}`,
                  backgroundColor: selectedSuggestion?.id === suggestion.id ? '#444444' : '#333333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                onClick={() => handleSelect(suggestion)}
              >
                <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#FFFFFF' }}>
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
                        color: ratings[suggestion.id] === 'up' ? '#10B981' : '#AAAAAA'
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
                        color: ratings[suggestion.id] === 'down' ? '#ef4444' : '#AAAAAA'
                      }}
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                  {selectedSuggestion?.id === suggestion.id && (
                    <div style={{
                      backgroundColor: '#FFDD00',
                      color: 'black',
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
          borderTop: '1px solid #333333',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button
            variant="outline"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid #FFDD00',
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedSuggestion}
            style={{
              backgroundColor: '#FFDD00',
              color: 'black',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}
          >
            Use Selected
          </Button>
        </div>
      </div>
    </div>,
    modalElement
  );
};
