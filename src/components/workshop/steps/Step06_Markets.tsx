import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Market } from '../../../types/workshop';
import { Users, Plus, X, AlertCircle } from 'lucide-react';

// Separate selectors to prevent unnecessary re-renders
const selectMarkets = (state: WorkshopStore) => state.workshopData.markets || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectCanProceedToNextStep = (state: WorkshopStore) => state.canProceedToNextStep;

export const Step06_Markets: React.FC = () => {
  const storeMarkets = useWorkshopStore(selectMarkets);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const canProceedToNextStep = useWorkshopStore(selectCanProceedToNextStep);

  // Use local state for the markets
  const [markets, setMarkets] = useState<Market[]>(storeMarkets);
  const [newMarket, setNewMarket] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Update local state when store value changes
  useEffect(() => {
    setMarkets(storeMarkets);
  }, [storeMarkets]);

  // Show error when trying to proceed without completing
  useEffect(() => {
    if (!canProceedToNextStep()) {
      setShowError(true);
    }
  }, [canProceedToNextStep]);

  const handleAddMarket = useCallback(() => {
    if (newMarket.trim() !== '') {
      const market: Market = {
        id: `user-${Date.now()}`,
        description: newMarket.trim(),
        source: 'user'
      };
      
      setMarkets(prev => [...prev, market]);
      setNewMarket(''); // Clear input
      updateWorkshopData({ markets: [...markets, market] });
      setShowError(false);
    }
  }, [newMarket, markets, updateWorkshopData]);

  const handleDeleteMarket = useCallback((id: string) => {
    const updatedMarkets = markets.filter(market => market.id !== id);
    setMarkets(updatedMarkets);
    updateWorkshopData({ markets: updatedMarkets });
  }, [markets, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddMarket();
    }
  }, [handleAddMarket]);

  const isListEmpty = () => showError && markets.length === 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={6}
        title="Define Target Markets"
        description="Who are the specific groups of people or organizations that would benefit most from your solution?"
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
            Be specific about who your ideal customers are. Consider demographics, behaviors, and pain points.
          </div>

          {/* List of existing markets */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {markets.map(market => (
              <div 
                key={market.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span style={{ flex: 1, color: '#374151' }}>{market.description}</span>
                <button
                  onClick={() => handleDeleteMarket(market.id)}
                  onMouseEnter={() => setHoveredId(market.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: hoveredId === market.id ? '#ef4444' : '#6b7280',
                    transition: 'color 0.2s ease'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {isListEmpty() && (
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
                Add at least one target market to proceed
              </div>
            )}
          </div>

          {/* Add new market input */}
          <div>
            <label 
              htmlFor="newMarket"
              style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}
            >
              Add Target Market:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="newMarket"
                value={newMarket}
                onChange={(e) => setNewMarket(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Mid-sized SaaS companies (50-200 employees)"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isListEmpty() ? '#ef4444' : '#d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                }}
              />
              <Button 
                variant="primary"
                onClick={handleAddMarket}
                disabled={!newMarket.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={20} />
                Add
              </Button>
            </div>
          </div>

          {/* Example markets */}
          {markets.length === 0 && (
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
                Example target markets:
              </p>
              <ul style={{ 
                listStyle: 'disc',
                paddingLeft: '24px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <li>Mid-sized SaaS companies (50-200 employees)</li>
                <li>Product managers at enterprise tech firms</li>
                <li>E-commerce businesses doing $1M-5M annual revenue</li>
                <li>Marketing agencies with 5-20 employees</li>
                <li>B2B software startups in growth phase</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}; 