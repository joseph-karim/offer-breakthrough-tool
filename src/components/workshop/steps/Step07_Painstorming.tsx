import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Pain } from '../../../types/workshop';
import { AlertCircle, HelpCircle, Plus, X, Flame } from 'lucide-react';

import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step07_Painstorming: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the pains
  const [painsList, setPainsList] = useState<Pain[]>(pains || []);
  const [newPain, setNewPain] = useState('');
  const [selectedBuyerSegment, setSelectedBuyerSegment] = useState<string>('');
  const [selectedPainType, setSelectedPainType] = useState<'functional' | 'emotional' | 'social' | 'anticipated'>('functional');
  const [isFire, setIsFire] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    setPainsList(pains || []);
  }, [pains]);

  // Set default buyer segment if none selected
  useEffect(() => {
    if (targetBuyers.length > 0 && !selectedBuyerSegment) {
      setSelectedBuyerSegment(targetBuyers[0].description);
    }
  }, [targetBuyers, selectedBuyerSegment]);

  const handleAddPain = useCallback(() => {
    if (newPain.trim() !== '' && selectedBuyerSegment) {
      const pain: Pain = {
        id: `user-${Date.now()}`,
        description: newPain.trim(),
        buyerSegment: selectedBuyerSegment,
        type: selectedPainType,
        isFire,
        source: 'user'
      };

      setPainsList(prev => [...prev, pain]);
      setNewPain(''); // Clear input
      updateWorkshopData({ pains: [...painsList, pain] });
    }
  }, [newPain, selectedBuyerSegment, selectedPainType, isFire, painsList, updateWorkshopData]);

  const handleDeletePain = useCallback((id: string) => {
    const updatedPains = painsList.filter(pain => pain.id !== id);
    setPainsList(updatedPains);
    updateWorkshopData({ pains: updatedPains });
  }, [painsList, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddPain();
    }
  }, [handleAddPain]);

  const toggleFireStatus = useCallback((id: string) => {
    const updatedPains = painsList.map(pain =>
      pain.id === id ? { ...pain, isFire: !pain.isFire } : pain
    );
    setPainsList(updatedPains);
    updateWorkshopData({ pains: updatedPains });
  }, [painsList, updateWorkshopData]);

  // Get pain type label
  const getPainTypeLabel = (type: string): string => {
    switch (type) {
      case 'functional': return 'Functional';
      case 'emotional': return 'Emotional';
      case 'social': return 'Social';
      case 'anticipated': return 'Anticipated';
      default: return type;
    }
  };

  // Get pain type color
  const getPainTypeColor = (type: string): string => {
    switch (type) {
      case 'functional': return '#3b82f6'; // Blue
      case 'emotional': return '#ec4899'; // Pink
      case 'social': return '#8b5cf6'; // Purple
      case 'anticipated': return '#f59e0b'; // Amber
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={7}
        title="Painstorming"
        description="Identify the painful problems your target buyers experience when trying to get the job done"
      />

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fff1f2',
            borderLeft: '4px solid #e11d48',
            borderRadius: '0 8px 8px 0',
            color: '#9f1239',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#e11d48' }} />
            The more urgent, painful, and expensive the problems, the more people will pay for your solution.
          </div>

          {/* Add new pain */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="new-pain"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Add a painful problem
              </label>
              <div title="Describe a specific problem your target buyers face">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Buyer segment selector */}
              <div>
                <label
                  htmlFor="buyer-segment"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#4b5563',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  Buyer segment:
                </label>
                <select
                  id="buyer-segment"
                  value={selectedBuyerSegment}
                  onChange={(e) => setSelectedBuyerSegment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="" disabled>Select a buyer segment</option>
                  {targetBuyers.map(buyer => (
                    <option key={buyer.id} value={buyer.description}>
                      {buyer.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pain type selector */}
              <div>
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#4b5563',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  Pain type:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['functional', 'emotional', 'social', 'anticipated'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedPainType(type)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedPainType === type ? getPainTypeColor(type) : '#d1d5db',
                        backgroundColor: selectedPainType === type ? `${getPainTypeColor(type)}20` : 'transparent',
                        color: selectedPainType === type ? getPainTypeColor(type) : '#6b7280',
                        fontSize: '14px',
                        fontWeight: selectedPainType === type ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {getPainTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* FIRE toggle */}
              <div>
                <button
                  onClick={() => setIsFire(!isFire)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isFire ? '#ef4444' : '#d1d5db',
                    backgroundColor: isFire ? '#fee2e2' : 'transparent',
                    color: isFire ? '#b91c1c' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: isFire ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  <Flame size={16} color={isFire ? '#ef4444' : '#6b7280'} fill={isFire ? '#ef4444' : 'none'} />
                  {isFire ? 'This is a F.I.R.E. problem' : 'Mark as F.I.R.E. problem'}
                </button>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  F.I.R.E. = Frequent, Intense, Requires action, Expensive
                </div>
              </div>

              {/* Pain description input */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="new-pain"
                  type="text"
                  value={newPain}
                  onChange={(e) => setNewPain(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., Struggles to find time to create content consistently"
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
                  onClick={handleAddPain}
                  disabled={!newPain.trim() || !selectedBuyerSegment}
                  variant="yellow"
                  rightIcon={<Plus size={16} />}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* List of pains */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Painful Problems Identified
            </h3>

            {painsList.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {painsList.map(pain => (
                  <div
                    key={pain.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      borderLeft: `3px solid ${getPainTypeColor(pain.type)}`,
                    }}
                    onMouseEnter={() => setHoveredId(pain.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      flex: 1,
                    }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#1e293b',
                      }}>
                        {pain.description}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#6b7280',
                      }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: `${getPainTypeColor(pain.type)}20`,
                          color: getPainTypeColor(pain.type),
                          fontWeight: 500,
                        }}>
                          {getPainTypeLabel(pain.type)}
                        </span>
                        <span>
                          {pain.buyerSegment}
                        </span>
                        {pain.source === 'assistant' && (
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FFDD00',
                            color: '#1e293b',
                            fontWeight: 500,
                          }}>
                            AI
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleFireStatus(pain.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                        aria-label={pain.isFire ? "Remove FIRE status" : "Mark as FIRE problem"}
                        title={pain.isFire ? "Remove FIRE status" : "Mark as FIRE problem"}
                      >
                        <Flame
                          size={20}
                          color={pain.isFire ? '#ef4444' : '#6b7280'}
                          fill={pain.isFire ? '#ef4444' : 'none'}
                        />
                      </button>

                      <button
                        onClick={() => handleDeletePain(pain.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: hoveredId === pain.id ? 1 : 0,
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                        aria-label="Delete pain"
                      >
                        <X size={16} color="#6b7280" />
                      </button>
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
                  Example painful problems:
                </p>
                <ul style={{
                  listStyle: 'disc',
                  paddingLeft: '24px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  <li>Struggles to find time to create content consistently (Functional)</li>
                  <li>Feels overwhelmed by the constant pressure to stay visible online (Emotional)</li>
                  <li>Worries about being perceived as irrelevant by peers and clients (Social)</li>
                  <li>Fears their service business will be disrupted by AI (Anticipated)</li>
                  <li>Can't scale their business without working more hours (Functional, FIRE)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
