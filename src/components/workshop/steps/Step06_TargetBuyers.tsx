import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetBuyer } from '../../../types/workshop';
import { AlertCircle, HelpCircle, MessageSquare, Plus, X, Star } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';
import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step06_TargetBuyers: React.FC = () => {
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);

  // Use local state for the buyers
  const [buyers, setBuyers] = useState<TargetBuyer[]>(targetBuyers || []);
  const [newBuyer, setNewBuyer] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store value changes
  useEffect(() => {
    setBuyers(targetBuyers || []);
  }, [targetBuyers]);

  const handleAddBuyer = useCallback(() => {
    if (newBuyer.trim() !== '') {
      const buyer: TargetBuyer = {
        id: `user-${Date.now()}`,
        description: newBuyer.trim(),
        source: 'user',
        urgency: 0,
        willingness: 0,
        longTermValue: 0,
        solutionFit: 0,
        accessibility: 0
      };
      
      setBuyers(prev => [...prev, buyer]);
      setNewBuyer(''); // Clear input
      updateWorkshopData({ targetBuyers: [...buyers, buyer] });
    }
  }, [newBuyer, buyers, updateWorkshopData]);

  const handleDeleteBuyer = useCallback((id: string) => {
    const updatedBuyers = buyers.filter(buyer => buyer.id !== id);
    setBuyers(updatedBuyers);
    updateWorkshopData({ targetBuyers: updatedBuyers });
  }, [buyers, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddBuyer();
    }
  }, [handleAddBuyer]);
  
  const handleRateBuyer = useCallback((id: string, field: keyof TargetBuyer, value: number) => {
    const updatedBuyers = buyers.map(buyer => 
      buyer.id === id ? { ...buyer, [field]: value } : buyer
    );
    setBuyers(updatedBuyers);
    updateWorkshopData({ targetBuyers: updatedBuyers });
  }, [buyers, updateWorkshopData]);
  
  // Generate step context for AI
  const stepContext = `
    Workshop Step: Target Buyers
    
    The user is identifying potential target buyers for their offer.
    
    Current target buyers:
    ${buyers.map(buyer => `- ${buyer.description}`).join('\n')}
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={6}
        title="Identify Target Buyers"
        description="Who might have an urgent need to get the job done and will pay a premium for a solution?"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          variant="ghost"
          onClick={() => setShowChat(!showChat)}
          rightIcon={<MessageSquare size={16} />}
        >
          {showChat ? 'Hide AI Assistant' : 'Get AI Help'}
        </Button>
      </div>
      
      {showChat && (
        <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
          <ChatInterface 
            step={6}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[6] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(6)}
          />
        </Card>
      )}
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #22c55e',
            borderRadius: '0 8px 8px 0',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#22c55e' }} />
            Think contextually about who might need your solution. Consider life factors, business models, industries, job titles, etc.
          </div>
          
          {/* Add new target buyer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="new-buyer"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Add a potential target buyer
              </label>
              <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} title="Be specific about who might need your solution" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="new-buyer"
                type="text"
                value={newBuyer}
                onChange={(e) => setNewBuyer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., Burnt out marketing consultants with 3+ years experience"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              />
              <Button
                onClick={handleAddBuyer}
                disabled={!newBuyer.trim()}
                variant="yellow"
                rightIcon={<Plus size={16} />}
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* List of target buyers */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Your Potential Target Buyers
            </h3>
            
            {buyers.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {buyers.map(buyer => (
                  <div 
                    key={buyer.id}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={() => setHoveredId(buyer.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#1e293b',
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: buyer.source === 'assistant' ? '#FFDD00' : '#e5e7eb',
                          color: '#1e293b',
                          textAlign: 'center',
                          lineHeight: '24px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}>
                          {buyer.source === 'assistant' ? 'AI' : '👤'}
                        </span>
                        {buyer.description}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteBuyer(buyer.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: hoveredId === buyer.id ? 1 : 0,
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                        aria-label="Delete buyer"
                      >
                        <X size={16} color="#6b7280" />
                      </button>
                    </div>
                    
                    <div style={{ padding: '12px 16px' }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#1e293b',
                        margin: '0 0 8px 0'
                      }}>
                        Rate this buyer segment (1-5):
                      </h4>
                      
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {[
                          { key: 'urgency' as const, label: 'Urgency to solve the problem' },
                          { key: 'willingness' as const, label: 'Willingness to pay' },
                          { key: 'longTermValue' as const, label: 'Long-term value' },
                          { key: 'solutionFit' as const, label: 'Your ability to serve them' },
                          { key: 'accessibility' as const, label: 'Your access to this market' }
                        ].map(({ key, label }) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              fontSize: '14px', 
                              color: '#4b5563',
                              width: '180px',
                              flexShrink: 0
                            }}>
                              {label}:
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {[1, 2, 3, 4, 5].map(value => (
                                <button
                                  key={value}
                                  onClick={() => handleRateBuyer(buyer.id, key, value)}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    border: '1px solid',
                                    borderColor: buyer[key] === value ? '#FFDD00' : '#d1d5db',
                                    backgroundColor: buyer[key] === value ? '#FFDD00' : 'transparent',
                                    color: buyer[key] === value ? '#1e293b' : '#6b7280',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: buyer[key] === value ? 600 : 400,
                                  }}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ 
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <Star size={16} color="#FFDD00" fill="#FFDD00" />
                        Total score: {
                          (buyer.urgency || 0) + 
                          (buyer.willingness || 0) + 
                          (buyer.longTermValue || 0) + 
                          (buyer.solutionFit || 0) + 
                          (buyer.accessibility || 0)
                        } / 25
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #d1d5db'
              }}>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  marginBottom: '12px'
                }}>
                  Example target buyers:
                </p>
                <ul style={{ 
                  listStyle: 'disc',
                  paddingLeft: '24px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  <li>Burnt out marketing consultants with 3+ years experience</li>
                  <li>E-commerce store owners with 50-200 products and $500K+ annual revenue</li>
                  <li>SaaS founders who recently raised seed funding</li>
                  <li>Freelance copywriters who want to stop trading time for money</li>
                  <li>Marketing agencies with 5-15 employees struggling with client retention</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
