import React, { useState, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Market } from '../../../types/workshop';
import { Users, CheckCircle2, X, Star, AlertCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectMarkets = (state: WorkshopStore) => state.workshopData.markets || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

// Evaluation criteria
const evaluationCriteria = [
  { id: 'size', label: 'Market Size', description: 'How large is this market segment?' },
  { id: 'growth', label: 'Growth Potential', description: 'Is this market growing?' },
  { id: 'accessibility', label: 'Accessibility', description: 'Can you easily reach and connect with this market?' },
  { id: 'profitability', label: 'Profitability', description: 'What is the potential profit margin?' },
  { id: 'competition', label: 'Competition Level', description: 'How saturated is this market?' },
  { id: 'urgency', label: 'Problem Urgency', description: 'How urgent are their problems?' }
];

export const Step08_MarketEvaluation: React.FC = () => {
  const markets = useWorkshopStore(selectMarkets);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const [isSaving, setIsSaving] = useState(false);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const handleScoreChange = useCallback((marketId: string, criteriaId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [marketId]: {
        ...(prev[marketId] || {}),
        [criteriaId]: score
      }
    }));
  }, []);

  const getMarketScore = useCallback((marketId: string) => {
    const marketScores = scores[marketId] || {};
    const totalScore = Object.values(marketScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = evaluationCriteria.length * 5;
    return Math.round((totalScore / maxPossibleScore) * 100);
  }, [scores]);

  const handleSelectMarket = useCallback((market: Market) => {
    setIsSaving(true);
    updateWorkshopData({
      markets: markets.map(m => ({
        ...m,
        selected: m.id === market.id
      }))
    });
    setTimeout(() => setIsSaving(false), 500);
  }, [markets, updateWorkshopData]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={8}
        title="Evaluate Target Markets"
        description="Score each market segment to identify the most promising opportunity."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '0 8px 8px 0',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Users style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Rate each market segment on the criteria below. Choose the market that best aligns with your goals.
          </div>

          {markets.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #d1d5db',
            }}>
              <AlertCircle style={{ height: '24px', width: '24px', margin: '0 auto 12px' }} />
              <p style={{ margin: 0 }}>No markets to evaluate. Go back to the previous step to add some market segments.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '32px' }}>
              {markets.map(market => (
                <div
                  key={market.id}
                  style={{
                    padding: '20px',
                    backgroundColor: market.selected ? '#f0fdf4' : '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: market.selected ? '#86efac' : '#e5e7eb',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 4px',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827'
                      }}>
                        {market.description}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px' 
                      }}>
                        <Star 
                          style={{ 
                            height: '16px', 
                            width: '16px',
                            color: '#eab308'
                          }} 
                        />
                        <span style={{ 
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          Overall Score: {getMarketScore(market.id)}%
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={market.selected ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleSelectMarket(market)}
                    >
                      {market.selected ? (
                        <>
                          <CheckCircle2 size={16} style={{ marginRight: '4px' }} />
                          Selected
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {evaluationCriteria.map(criteria => (
                      <div
                        key={criteria.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, color: '#374151' }}>
                            {criteria.label}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {criteria.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map(score => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange(market.id, criteria.id, score)}
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid',
                                borderColor: (scores[market.id]?.[criteria.id] === score) ? '#4f46e5' : '#d1d5db',
                                borderRadius: '6px',
                                backgroundColor: (scores[market.id]?.[criteria.id] === score) ? '#4f46e5' : 'white',
                                color: (scores[market.id]?.[criteria.id] === score) ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                              }}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 