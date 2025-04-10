import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Market, MarketEvaluation } from '../../../types/workshop';
import { Users, CheckCircle2, Star, AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectMarkets = (state: WorkshopStore) => state.workshopData.markets || [];
const selectMarketEvaluations = (state: WorkshopStore) => state.workshopData.marketEvaluations || {};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;

const CRITERIA = [
  { id: 'marketSize', label: 'Market Size', description: 'How large is this market segment?' },
  { id: 'growthPotential', label: 'Growth Potential', description: 'How fast is this market segment growing?' },
  { id: 'competitionLevel', label: 'Competition Level', description: 'How strong is the competition in this segment?' },
  { id: 'accessibilityToMarket', label: 'Accessibility', description: 'How easy is it to reach and sell to this market?' },
  { id: 'profitPotential', label: 'Profit Potential', description: 'What is the potential for high profit margins?' },
];

export const Step08_MarketEvaluation: React.FC = () => {
  const storeMarkets = useWorkshopStore(selectMarkets);
  const storeEvaluations = useWorkshopStore(selectMarketEvaluations);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);
  
  // Local state
  const [localMarkets, setLocalMarkets] = useState(storeMarkets);
  const [localScores, setLocalScores] = useState<{ [marketId: string]: MarketEvaluation }>(storeEvaluations);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  // Update local state when store values change
  useEffect(() => {
    setLocalMarkets(storeMarkets);
    setLocalScores(storeEvaluations);
  }, [storeMarkets, storeEvaluations]);

  // Initialize market evaluations if they don't exist
  useEffect(() => {
    // If we have markets but no evaluations, create empty evaluations
    if (storeMarkets.length > 0 && Object.keys(storeEvaluations).length === 0) {
      const initialEvaluations: { [marketId: string]: MarketEvaluation } = {};
      
      // Initialize empty evaluation objects for each market
      storeMarkets.forEach(market => {
        initialEvaluations[market.id] = {};
      });
      
      // Only update if we actually have markets
      if (Object.keys(initialEvaluations).length > 0) {
        updateWorkshopData({ marketEvaluations: initialEvaluations });
      }
    }
  }, [storeMarkets, storeEvaluations, updateWorkshopData]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const saveToStore = useCallback((data: { markets?: Market[], marketEvaluations?: { [marketId: string]: MarketEvaluation } }) => {
    setIsSaving(true);
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    
    saveTimerRef.current = window.setTimeout(() => {
      updateWorkshopData(data);
      setIsSaving(false);
    }, 500);
  }, [updateWorkshopData]);

  const handleScoreChange = useCallback((marketId: string, criteriaId: string, value: number) => {
    const updatedScores = {
      ...localScores,
      [marketId]: {
        ...localScores[marketId],
        [criteriaId]: value
      }
    };
    setLocalScores(updatedScores);
    saveToStore({ marketEvaluations: updatedScores });
  }, [localScores, saveToStore]);

  const handleSelectMarket = useCallback((market: Market) => {
    const updatedMarkets = localMarkets.map(m => ({
      ...m,
      selected: m.id === market.id
    }));
    
    // Batch updates together to prevent multiple renders
    // Update local state immediately, but only trigger store update once
    setLocalMarkets(updatedMarkets);
    
    // Debounced store update
    saveToStore({ 
      markets: updatedMarkets 
    });
  }, [localMarkets, saveToStore]);

  const getMarketScore = useCallback((marketId: string, criteriaId: string): number => {
    return localScores[marketId]?.[criteriaId] || 0;
  }, [localScores]);

  const isMarketIncomplete = useCallback((marketId: string): boolean => {
    // Only compute this when errors should be shown
    if (!showErrors) return false;
    
    // Check if any criteria is zero
    return CRITERIA.some(criteria => getMarketScore(marketId, criteria.id) === 0);
  }, [showErrors, getMarketScore]);

  const getTotalScore = useCallback((marketId: string): number => {
    return CRITERIA.reduce((sum, criteria) => sum + getMarketScore(marketId, criteria.id), 0);
  }, [getMarketScore]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={8}
        title="Market Evaluation"
        description="Score each market segment based on the following criteria to identify the most promising opportunities."
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

          {showErrors && !localMarkets.some(m => m.selected) && (
            <div style={{ 
              color: '#ef4444',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              backgroundColor: '#fef2f2',
              borderRadius: '6px'
            }}>
              <AlertCircle size={14} />
              Please select a target market to proceed
            </div>
          )}

          {localMarkets.length === 0 ? (
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
              {localMarkets.map(market => (
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
                          Overall Score: {getTotalScore(market.id)}%
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

                  {isMarketIncomplete(market.id) && (
                    <div style={{ 
                      color: '#ef4444',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '6px'
                    }}>
                      <AlertCircle size={14} />
                      Please score all criteria for this market
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {CRITERIA.map(criteria => (
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <label 
                              htmlFor={`${market.id}-${criteria.id}`}
                              style={{ 
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#374151',
                                flex: 1
                              }}
                            >
                              {criteria.label}
                            </label>
                            <div 
                              style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#6b7280',
                                fontSize: '14px'
                              }}
                            >
                              <HelpCircle size={14} />
                              {criteria.description}
                            </div>
                          </div>
                          <input
                            id={`${market.id}-${criteria.id}`}
                            type="range"
                            min="0"
                            max="10"
                            value={getMarketScore(market.id, criteria.id)}
                            onChange={(e) => handleScoreChange(market.id, criteria.id, parseInt(e.target.value))}
                            style={{
                              width: '100%',
                              accentColor: showErrors && getMarketScore(market.id, criteria.id) === 0 ? '#ef4444' : '#0ea5e9'
                            }}
                          />
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            <span>Low</span>
                            <span>Score: {getMarketScore(market.id, criteria.id)}</span>
                            <span>High</span>
                          </div>
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