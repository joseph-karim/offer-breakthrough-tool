import React, { useState, useCallback } from 'react';
import { Flame, ChevronDown, ChevronUp, X, HelpCircle } from 'lucide-react';
import { Pain } from '../../../types/workshop';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';

// Selectors
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

interface PainItemInteractiveCardProps {
  pain: Pain;
  onDelete: (id: string) => void;
}

export const PainItemInteractiveCard: React.FC<PainItemInteractiveCardProps> = ({
  pain,
  onDelete
}) => {
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Initialize FIRE scores if they don't exist
  const fireScores = pain.fireScores || {
    frequency: 1,
    intensity: 1,
    recurring: 1,
    expensive: 1
  };

  // Calculate FIRE score
  const calculatedFireScore = pain.calculatedFireScore || 
    (fireScores.frequency + fireScores.intensity + fireScores.recurring + fireScores.expensive);

  // Get fire score color
  const getFireScoreColor = (score: number) => {
    if (score >= 10) return '#ef4444'; // High - red
    if (score >= 7) return '#f97316'; // Medium - orange
    return '#6b7280'; // Low - gray
  };

  // Get fire score label
  const getFireScoreLabel = (score: number) => {
    if (score >= 10) return 'High FIRE';
    if (score >= 7) return 'Medium FIRE';
    return 'Low FIRE';
  };

  // Handle score change
  const handleScoreChange = useCallback((dimension: 'frequency' | 'intensity' | 'recurring' | 'expensive', value: number) => {
    const newFireScores = {
      ...fireScores,
      [dimension]: value
    };
    
    const newCalculatedFireScore = 
      newFireScores.frequency + 
      newFireScores.intensity + 
      newFireScores.recurring + 
      newFireScores.expensive;
    
    const updatedPain = {
      ...pain,
      fireScores: newFireScores,
      calculatedFireScore: newCalculatedFireScore,
      isFire: newCalculatedFireScore >= 7 // Automatically mark as FIRE if score is medium or high
    };
    
    // Update the pain in the store
    updateWorkshopData({
      pains: useWorkshopStore.getState().workshopData.pains.map(p => 
        p.id === pain.id ? updatedPain : p
      )
    });
  }, [pain, fireScores, updateWorkshopData]);

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

  // Tooltip component
  const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '8px',
            maxWidth: '250px',
            textAlign: 'center'
          }}>
            {text}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1e293b'
            }} />
          </div>
        )}
      </div>
    );
  };

  // Render score selector
  const ScoreSelector = ({ 
    dimension, 
    value, 
    label, 
    helpText 
  }: { 
    dimension: 'frequency' | 'intensity' | 'recurring' | 'expensive', 
    value: number, 
    label: string,
    helpText: string
  }) => {
    return (
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, marginRight: '8px' }}>{label}</label>
          <Tooltip text={helpText}>
            <HelpCircle size={14} color="#6b7280" />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3].map((score) => (
            <button
              key={score}
              onClick={() => handleScoreChange(dimension, score)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: value === score ? '#0ea5e9' : '#d1d5db',
                backgroundColor: value === score ? '#e0f2fe' : 'transparent',
                color: value === score ? '#0369a1' : '#6b7280',
                fontSize: '14px',
                fontWeight: value === score ? 600 : 400,
                cursor: 'pointer',
                flex: 1,
                textAlign: 'center'
              }}
            >
              {score === 1 ? 'Low' : score === 2 ? 'Medium' : 'High'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white',
      marginBottom: '12px'
    }}>
      {/* Main card content */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#f9fafb',
      }}>
        {/* FIRE score indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: pain.calculatedFireScore ? '#fee2e2' : 'transparent',
          border: '1px solid',
          borderColor: pain.calculatedFireScore ? '#fca5a5' : '#d1d5db',
          color: getFireScoreColor(calculatedFireScore),
          fontWeight: 600,
          fontSize: '14px',
          flexShrink: 0
        }}>
          {pain.calculatedFireScore ? (
            <>
              <Flame size={16} color={getFireScoreColor(calculatedFireScore)} fill={getFireScoreColor(calculatedFireScore)} />
              <span style={{ fontSize: '12px' }}>{calculatedFireScore}</span>
            </>
          ) : (
            <Flame size={16} color="#6b7280" />
          )}
        </div>

        {/* Pain description and type */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
            {pain.description}
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
            <span>{getPainTypeLabel(pain.type)}</span>
            <span>•</span>
            <span>{pain.buyerSegment}</span>
            {pain.calculatedFireScore && (
              <>
                <span>•</span>
                <span style={{ color: getFireScoreColor(calculatedFireScore) }}>
                  {getFireScoreLabel(calculatedFireScore)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280',
              transition: 'color 0.2s ease'
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={() => onDelete(pain.id)}
            onMouseEnter={() => setHoveredId(pain.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: hoveredId === pain.id ? '#ef4444' : '#6b7280',
              transition: 'color 0.2s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Expanded FIRE evaluation section */}
      {isExpanded && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
            Evaluate FIRE Score
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
            Rate each dimension to calculate how much of a FIRE problem this is. FIRE problems are more likely to drive buying decisions.
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            <ScoreSelector
              dimension="frequency"
              value={fireScores.frequency}
              label="Frequency"
              helpText="How often does this problem occur for your target buyer?"
            />
            <ScoreSelector
              dimension="intensity"
              value={fireScores.intensity}
              label="Intensity"
              helpText="How painful or frustrating is this problem when it occurs?"
            />
            <ScoreSelector
              dimension="recurring"
              value={fireScores.recurring}
              label="Recurring"
              helpText="How often does this problem come back after being temporarily solved?"
            />
            <ScoreSelector
              dimension="expensive"
              value={fireScores.expensive}
              label="Expensive"
              helpText="How costly is this problem in terms of money, time, opportunity, or reputation?"
            />
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Total FIRE Score
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Higher scores indicate hotter problems
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: getFireScoreColor(calculatedFireScore),
              fontWeight: 600
            }}>
              <Flame size={16} color={getFireScoreColor(calculatedFireScore)} fill={getFireScoreColor(calculatedFireScore)} />
              {calculatedFireScore} / 12
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
