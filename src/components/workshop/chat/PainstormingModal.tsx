import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { createPortal } from 'react-dom';

interface PainstormingModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string | null;
  onConfirmSelection: (selectedProblems: string[]) => void;
}

// Basic regex to find the overlapping problems section and individual problems
const overlappingSectionRegex = /Top 4-8 Overlapping Problems Across Segments:([\s\S]*)/i;
const problemRegex = /^\s*(?:\d+\.\s+)?(?:\*\*FIRE Problem:|Problem:)?\s*"([^"]+)"/gm;

export const PainstormingModal: React.FC<PainstormingModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
  onConfirmSelection
}) => {
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [overlappingProblemsList, setOverlappingProblemsList] = useState<string[]>([]);
  const [mainContent, setMainContent] = useState<string>('');
  const [overlappingContent, setOverlappingContent] = useState<string>('');

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

  useEffect(() => {
    if (markdownContent) {
      // Find where the overlapping problems start
      const sectionMatch = markdownContent.match(overlappingSectionRegex);

      if (sectionMatch) {
        // Split the content into main analysis and overlapping problems
        setMainContent(markdownContent.substring(0, sectionMatch.index));
        setOverlappingContent(sectionMatch[0]);

        // Extract the individual problems from the overlapping section
        const sectionText = sectionMatch[1];
        const problems: string[] = [];
        let match;

        // Reset the regex lastIndex to ensure we start from the beginning
        problemRegex.lastIndex = 0;

        while ((match = problemRegex.exec(sectionText)) !== null) {
          problems.push(match[1]); // Capture the text within quotes
        }

        setOverlappingProblemsList(problems);
      } else {
        // If no overlapping section is found, use the entire content
        setMainContent(markdownContent);
        setOverlappingContent('');
        setOverlappingProblemsList([]);
      }

      // Reset selection when content changes
      setSelectedProblems([]);
    } else {
      setMainContent('');
      setOverlappingContent('');
      setOverlappingProblemsList([]);
      setSelectedProblems([]);
    }
  }, [markdownContent]);

  const handleCheckboxChange = (problem: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(problem)) {
        return prev.filter(p => p !== problem);
      } else {
        return [...prev, problem];
      }
    });
  };

  const handleConfirm = () => {
    onConfirmSelection(selectedProblems);
    onClose();
  };

  if (!isOpen || !markdownContent) return null;

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
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Painstorming Analysis</h2>
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

        {/* Modal Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(90vh - 140px)',
          overflow: 'hidden'
        }}>
          {/* Main Analysis Section */}
          <div style={{
            flex: 1,
            padding: '20px 24px',
            overflowY: 'auto',
            borderBottom: '1px solid #EEEEEE'
          }}>
            <ReactMarkdown>{mainContent}</ReactMarkdown>

            {overlappingContent && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#FFFDF5',
                borderRadius: '8px',
                border: '1px solid #FFECB3'
              }}>
                <h3 style={{ marginTop: 0 }}>Top Overlapping Problems Across Segments</h3>
                <ReactMarkdown>{overlappingContent}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Problem Selection Section */}
          {overlappingProblemsList.length > 0 && (
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#F9FAFB',
              borderTop: '1px solid #EEEEEE'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Select Key Problems to Focus On</h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '12px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {overlappingProblemsList.map((problem, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: selectedProblems.includes(problem) ? '#F0FFF4' : '#FFFFFF',
                      border: `1px solid ${selectedProblems.includes(problem) ? '#10B981' : '#EEEEEE'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleCheckboxChange(problem)}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `2px solid ${selectedProblems.includes(problem) ? '#10B981' : '#D1D5DB'}`,
                      backgroundColor: selectedProblems.includes(problem) ? '#10B981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {selectedProblems.includes(problem) && (
                        <Check size={14} color="#FFFFFF" />
                      )}
                    </div>
                    <span style={{ fontSize: '14px' }}>{problem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer with Actions */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #EEEEEE',
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
              variant="yellow"
              onClick={handleConfirm}
              disabled={selectedProblems.length === 0}
            >
              Confirm {selectedProblems.length} Problem{selectedProblems.length !== 1 ? 's' : ''} & Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>,
    modalElement
  );
};
