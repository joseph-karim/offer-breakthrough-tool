import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetBuyer } from '../../../types/workshop';
import { HelpCircle, Plus, X, Star } from 'lucide-react';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;


export const Step06_TargetBuyers: React.FC = () => {
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the buyers
  const [buyers, setBuyers] = useState<TargetBuyer[]>(targetBuyers || []);
  const [newBuyer, setNewBuyer] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  return (
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={styles.stepHeaderContainerStyle}>
        <div style={styles.stepNumberStyle}>
          06
        </div>
        <h2 style={styles.stepTitleStyle}>
          Identify Target Buyers
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Who might have an urgent need to get the job done and will pay a premium for a solution?</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>


        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={styles.infoBoxStyle}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#22c55e' }} />
            Think contextually about who might need your solution. Consider life factors, business models, industries, job titles, etc.
          </div>

          {/* Add new target buyer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="new-buyer"
                style={styles.labelStyle}
              >
                Add a potential target buyer
              </label>
              <div title="Be specific about who might need your solution">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="new-buyer"
                type="text"
                value={newBuyer}
                onChange={(e) => setNewBuyer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., Burnt out marketing consultants with 3+ years experience"
                style={styles.inputStyle}
              />
              <Button
                onClick={handleAddBuyer}
                disabled={!newBuyer.trim()}
                variant="primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFDD00', color: '#222222' }}
              >
                <Plus size={16} />
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
                    backgroundColor: '#F2F2F2',
                    borderRadius: '15px',
                    border: '1px solid #DDDDDD',
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
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFDD00', color: '#222222' }}>
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
              <div style={styles.examplesContainerStyle}>
              <div style={styles.examplesLabelStyle}>
                EXAMPLES
              </div>
                <ul style={styles.examplesListStyle}>
                  <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Burnt out marketing consultants with 3+ years experience
              </li>
                  <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                E-commerce store owners with 50-200 products and $500K+ annual revenue
              </li>
                  <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                SaaS founders who recently raised seed funding
              </li>
                  <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Freelance copywriters who want to stop trading time for money
              </li>
                  <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Marketing agencies with 5-15 employees struggling with client retention
              </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
