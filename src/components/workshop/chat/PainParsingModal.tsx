import React, { useState, useEffect } from 'react';
import { X, Check, Flame } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { createPortal } from 'react-dom';
import { Pain } from '../../../types/workshop';

interface PainParsingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedPains: {
    buyerSegmentPains: {
      [buyerSegment: string]: Pain[];
    };
    overlappingPains: Pain[];
  };
  onConfirmSelection: (selectedPains: Pain[]) => void;
}

export const PainParsingModal: React.FC<PainParsingModalProps> = ({
  isOpen,
  onClose,
  parsedPains,
  onConfirmSelection
}) => {
  const [selectedPains, setSelectedPains] = useState<Pain[]>([]);
  const [buyerSegments, setBuyerSegments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overlapping');

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

  // Extract buyer segments from parsed pains
  useEffect(() => {
    if (parsedPains) {
      const segments = Object.keys(parsedPains.buyerSegmentPains);
      setBuyerSegments(segments);
      
      // Set default active tab to overlapping if available, otherwise first segment
      if (parsedPains.overlappingPains.length > 0) {
        setActiveTab('overlapping');
      } else if (segments.length > 0) {
        setActiveTab(segments[0]);
      }
    }
  }, [parsedPains]);

  const handlePainToggle = (pain: Pain) => {
    setSelectedPains(prev => {
      const exists = prev.some(p => p.id === pain.id);
      if (exists) {
        return prev.filter(p => p.id !== pain.id);
      } else {
        return [...prev, pain];
      }
    });
  };

  const handleConfirm = () => {
    onConfirmSelection(selectedPains);
    onClose();
  };

  const handleSelectAll = (pains: Pain[]) => {
    setSelectedPains(prev => {
      const newSelection = [...prev];
      
      // Add all pains that aren't already selected
      pains.forEach(pain => {
        if (!newSelection.some(p => p.id === pain.id)) {
          newSelection.push(pain);
        }
      });
      
      return newSelection;
    });
  };

  const handleDeselectAll = (pains: Pain[]) => {
    setSelectedPains(prev => 
      prev.filter(p => !pains.some(pain => pain.id === p.id))
    );
  };

  if (!isOpen) return null;

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
        zIndex: 2147483647,
        padding: '20px'
      }}
      onClick={(e) => {
        // Close the modal when clicking on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        style={{
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Parsed Pain Points</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} color="#666666" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #EEEEEE',
          overflowX: 'auto',
          padding: '0 16px'
        }}>
          {parsedPains.overlappingPains.length > 0 && (
            <button
              onClick={() => setActiveTab('overlapping')}
              style={{
                padding: '12px 16px',
                border: 'none',
                borderBottom: activeTab === 'overlapping' ? '2px solid #fcf720' : '2px solid transparent',
                background: 'none',
                fontWeight: activeTab === 'overlapping' ? 600 : 400,
                cursor: 'pointer'
              }}
            >
              Overlapping Pains ({parsedPains.overlappingPains.length})
            </button>
          )}
          
          {buyerSegments.map(segment => (
            <button
              key={segment}
              onClick={() => setActiveTab(segment)}
              style={{
                padding: '12px 16px',
                border: 'none',
                borderBottom: activeTab === segment ? '2px solid #fcf720' : '2px solid transparent',
                background: 'none',
                fontWeight: activeTab === segment ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {segment} ({parsedPains.buyerSegmentPains[segment]?.length || 0})
            </button>
          ))}
        </div>

        {/* Pain List */}
        <div style={{
          flex: 1,
          padding: '20px 24px',
          overflowY: 'auto'
        }}>
          {/* Select/Deselect All Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px',
            gap: '8px'
          }}>
            <Button
              variant="outline"
              onClick={() => handleSelectAll(
                activeTab === 'overlapping' 
                  ? parsedPains.overlappingPains 
                  : parsedPains.buyerSegmentPains[activeTab] || []
              )}
              style={{ fontSize: '14px' }}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDeselectAll(
                activeTab === 'overlapping' 
                  ? parsedPains.overlappingPains 
                  : parsedPains.buyerSegmentPains[activeTab] || []
              )}
              style={{ fontSize: '14px' }}
            >
              Deselect All
            </Button>
          </div>

          {/* Pain Items */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {activeTab === 'overlapping' 
              ? parsedPains.overlappingPains.map(pain => (
                <PainItem 
                  key={pain.id} 
                  pain={pain} 
                  isSelected={selectedPains.some(p => p.id === pain.id)}
                  onToggle={() => handlePainToggle(pain)}
                />
              ))
              : (parsedPains.buyerSegmentPains[activeTab] || []).map(pain => (
                <PainItem 
                  key={pain.id} 
                  pain={pain} 
                  isSelected={selectedPains.some(p => p.id === pain.id)}
                  onToggle={() => handlePainToggle(pain)}
                />
              ))
            }
          </div>
        </div>

        {/* Footer with Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {selectedPains.length} pain{selectedPains.length !== 1 ? 's' : ''} selected
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="yellow"
              onClick={handleConfirm}
              disabled={selectedPains.length === 0}
            >
              Save Selected Pains
            </Button>
          </div>
        </div>
      </Card>
    </div>,
    modalElement
  );
};

// Pain Item Component
const PainItem: React.FC<{
  pain: Pain;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ pain, isSelected, onToggle }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: isSelected ? '#F0FFF4' : '#FFFFFF',
        border: `1px solid ${isSelected ? '#10B981' : '#EEEEEE'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={onToggle}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: `2px solid ${isSelected ? '#10B981' : '#D1D5DB'}`,
        backgroundColor: isSelected ? '#10B981' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px'
      }}>
        {isSelected && (
          <Check size={14} color="#FFFFFF" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <span style={{ 
            fontSize: '15px', 
            fontWeight: 500,
            color: '#1e293b'
          }}>
            {pain.description}
          </span>
          {pain.isFire && (
            <Flame size={16} color="#ef4444" />
          )}
        </div>
        <div style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          display: 'flex',
          gap: '8px'
        }}>
          <span>Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}</span>
          {pain.isFire && <span style={{ color: '#ef4444' }}>FIRE Problem</span>}
        </div>
      </div>
    </div>
  );
};
