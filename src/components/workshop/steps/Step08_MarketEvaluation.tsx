import React, { useState, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Users, CheckCircle2, Star, AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Static criteria definitions
const CRITERIA = [
  { id: 'marketSize', label: 'Market Size', description: 'How large is this market segment?' },
  { id: 'growthPotential', label: 'Growth Potential', description: 'How fast is this market segment growing?' },
  { id: 'competitionLevel', label: 'Competition Level', description: 'How strong is the competition in this segment?' },
  { id: 'accessibilityToMarket', label: 'Accessibility', description: 'How easy is it to reach and sell to this market?' },
  { id: 'profitPotential', label: 'Profit Potential', description: 'What is the potential for high profit margins?' },
];

export const Step08_MarketEvaluation: React.FC = () => {
  // Only get the minimal state we need directly from the store
  const store = useWorkshopStore();
  const markets = store.workshopData.markets || [];
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle score change
  const handleScoreChange = useCallback((marketId: string, criteriaId: string, value: number) => {
    setIsSaving(true);
    
    // Create a new evaluations object if needed
    const currentEvaluations = store.workshopData.marketEvaluations || {};
    
    // Safely create or update the market evaluation
    const updatedEvaluations = {
      ...currentEvaluations,
      [marketId]: {
        ...(currentEvaluations[marketId] || {}),
        [criteriaId]: value
      }
    };
    
    // Update the store
    setTimeout(() => {
      store.updateWorkshopData({ marketEvaluations: updatedEvaluations });
      setIsSaving(false);
    }, 300);
  }, [store]);
  
  // Handle market selection
  const handleSelectMarket = useCallback((marketId: string) => {
    setIsSaving(true);
    
    // Update all markets' selection state
    const updatedMarkets = markets.map(market => ({
      ...market,
      selected: market.id === marketId
    }));
    
    // Update the store
    setTimeout(() => {
      store.updateWorkshopData({ markets: updatedMarkets });
      setIsSaving(false);
    }, 300);
  }, [markets, store]);
  
  // Get the current score safely
  const getScore = useCallback((marketId: string, criteriaId: string) => {
    const evaluations = store.workshopData.marketEvaluations || {};
    return evaluations[marketId]?.[criteriaId] || 0;
  }, [store.workshopData.marketEvaluations]);
  
  // Calculate total score
  const getTotalScore = useCallback((marketId: string) => {
    return CRITERIA.reduce((sum, criteria) => {
      return sum + getScore(marketId, criteria.id);
    }, 0);
  }, [getScore]);
  
  // Check if market is complete
  const isMarketIncomplete = useCallback((marketId: string) => {
    if (!store.validationErrors) return false;
    return CRITERIA.some(criteria => getScore(marketId, criteria.id) === 0);
  }, [store.validationErrors, getScore]);

  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        stepNumber={8}
        title="Market Evaluation"
        description="Score each market segment based on the following criteria to identify the most promising opportunities."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div className="grid gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 flex items-center text-sm font-medium">
            <Users className="w-5 h-5 mr-2 flex-shrink-0 text-blue-500" />
            Rate each market segment on the criteria below. Choose the market that best aligns with your goals.
          </div>

          {store.validationErrors && !markets.some(m => m.selected) && (
            <div className="bg-red-50 text-red-500 p-3 text-sm flex items-center gap-1 rounded">
              <AlertCircle size={14} />
              Please select a target market to proceed
            </div>
          )}

          {markets.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded">
              <AlertCircle className="w-6 h-6 mx-auto mb-3" />
              <p className="m-0">No markets to evaluate. Go back to the previous step to add some market segments.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {markets.map(market => (
                <div
                  key={market.id}
                  className={`p-5 rounded border ${
                    market.selected 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {market.description}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Overall Score: {getTotalScore(market.id)}%
                      </div>
                    </div>
                    <Button
                      variant={market.selected ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleSelectMarket(market.id)}
                    >
                      {market.selected ? (
                        <>
                          <CheckCircle2 size={16} className="mr-1" />
                          Selected
                        </>
                      ) : 'Select'}
                    </Button>
                  </div>

                  {isMarketIncomplete(market.id) && (
                    <div className="bg-red-50 text-red-500 p-3 text-sm flex items-center gap-1 rounded mb-3">
                      <AlertCircle size={14} />
                      Please score all criteria for this market
                    </div>
                  )}

                  <div className="grid gap-3">
                    {CRITERIA.map(criteria => (
                      <div
                        key={criteria.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                      >
                        <div className="w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <label 
                              htmlFor={`${market.id}-${criteria.id}`}
                              className="text-sm font-medium text-gray-700 flex-1"
                            >
                              {criteria.label}
                            </label>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <HelpCircle size={14} />
                              {criteria.description}
                            </div>
                          </div>
                          <input
                            id={`${market.id}-${criteria.id}`}
                            type="range"
                            min="0"
                            max="10"
                            value={getScore(market.id, criteria.id)}
                            onChange={(e) => handleScoreChange(market.id, criteria.id, parseInt(e.target.value))}
                            className="w-full"
                            style={{
                              accentColor: store.validationErrors && getScore(market.id, criteria.id) === 0 
                                ? '#ef4444' 
                                : '#0ea5e9'
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>Score: {getScore(market.id, criteria.id)}</span>
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