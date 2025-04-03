import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Market } from '../../../types/workshop';
import { Users, Plus, X, AlertCircle, MessageSquare, BarChart3, CheckCircle2, Target } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';

// Separate selectors to prevent unnecessary re-renders
const selectMarkets = (state: WorkshopStore) => state.workshopData.markets || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

// Scoring criteria for evaluating market segments
type ScoreCriteria = {
  name: string;
  description: string;
};

const SCORING_CRITERIA: ScoreCriteria[] = [
  {
    name: "Problem Size",
    description: "How big/painful is the problem for this segment?"
  },
  {
    name: "Solution Satisfaction",
    description: "How satisfied are they with current solutions?"
  },
  {
    name: "Willingness to Pay",
    description: "How likely are they to pay for a better solution?"
  },
  {
    name: "Accessibility",
    description: "How easily can you reach and acquire these customers?"
  }
];

export const Step06_Markets: React.FC = () => {
  const storeMarkets = useWorkshopStore(selectMarkets);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showError = useWorkshopStore(selectValidationErrors);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);

  // Use local state for the markets
  const [markets, setMarkets] = useState<Market[]>(storeMarkets);
  const [newMarket, setNewMarket] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'identify' | 'evaluate'>('identify');
  
  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store value changes
  useEffect(() => {
    setMarkets(storeMarkets);
  }, [storeMarkets]);

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
  
  // Generate step context for AI
  const stepContext = `
    Workshop Step: Target Markets
    
    Markets are specific groups of people or organizations that might benefit from your solution.
    
    Current markets:
    ${markets.map(market => `- ${market.description}`).join('\n')}
  `;

  // Render score scale 1-10 (used in the scoring section)
  const renderScoreScale = (score: number, maxScore: number = 10) => {
    const dots = [];
    for (let i = 1; i <= maxScore; i++) {
      dots.push(
        <div 
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: i <= score ? '#0ea5e9' : '#e5e7eb',
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={6}
        title="Score Market Segments"
        description="Identify and evaluate potential market segments to find your ideal target audience"
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
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setActiveTab('identify')}
          style={{
            padding: '12px 24px',
            fontWeight: 500,
            color: activeTab === 'identify' ? '#0ea5e9' : '#64748b',
            borderBottom: activeTab === 'identify' ? '2px solid #0ea5e9' : '2px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          1. Identify Segments
        </button>
        <button
          onClick={() => setActiveTab('evaluate')}
          style={{
            padding: '12px 24px',
            fontWeight: 500,
            color: activeTab === 'evaluate' ? '#0ea5e9' : '#64748b',
            borderBottom: activeTab === 'evaluate' ? '2px solid #0ea5e9' : '2px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          2. Evaluate Segments
        </button>
      </div>
      
      {activeTab === 'identify' && (
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

            {/* 6A: Identify Potential Segments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#1e293b',
                margin: 0
              }}>
                6A: Identify Potential Segments
              </h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
                List specific groups of people or organizations that could benefit from your solution:
              </p>
              
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Example Market Segments:</p>
                <ul style={{ 
                  margin: '0',
                  paddingLeft: '16px',
                  listStyleType: 'disc',
                  color: '#334155',
                  fontSize: '14px'
                }}>
                  <li>Course creators with established audiences (1000+ subscribers)</li>
                  <li>Service business owners with repeat purchase opportunities</li>
                  <li>Membership site owners with monthly recurring revenue</li>
                  <li>Ecommerce businesses with product lines under $100</li>
                </ul>
              </div>
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
                  placeholder="e.g., Course creators with established audiences (1000+ subscribers)"
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
                  Other example target markets:
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
      )}
      
      {activeTab === 'evaluate' && (
        <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* 6B: Segment Evaluation Framework */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#1e293b',
                margin: 0
              }}>
                6B: Segment Evaluation Framework
              </h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
                Evaluate your market segments using these four criteria, scoring each from 1-10:
              </p>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '8px'
              }}>
                {SCORING_CRITERIA.map((criteria, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {index === 0 && <BarChart3 size={18} color="#0ea5e9" />}
                      {index === 1 && <CheckCircle2 size={18} color="#0ea5e9" />}
                      {index === 2 && <Users size={18} color="#0ea5e9" />}
                      {index === 3 && <Target size={18} color="#0ea5e9" />}
                      {criteria.name}
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      color: '#64748b' 
                    }}>
                      {criteria.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 6C: Segment Scoring Examples */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#1e293b',
                margin: 0
              }}>
                6C: Segment Scoring Examples
              </h3>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {/* Course Creators Segment */}
                <div style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontWeight: 600, 
                      fontSize: '16px', 
                      color: '#1e293b' 
                    }}>
                      Course Creators with Established Audiences
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      backgroundColor: '#eff6ff',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1e40af'
                    }}>
                      <span>Total:</span>
                      <span>32/40</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Problem Size */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        minWidth: '120px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#334155' 
                      }}>
                        Problem Size:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        flex: 1
                      }}>
                        {renderScoreScale(9)}
                      </div>
                      <div style={{ 
                        minWidth: '40px', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#0ea5e9',
                        textAlign: 'right'
                      }}>
                        9/10
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: '#64748b',
                      paddingLeft: '128px'
                    }}>
                      Frequently face feast-or-famine cycles with course launches
                    </p>
                    
                    {/* Solution Satisfaction */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ 
                        minWidth: '120px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#334155' 
                      }}>
                        Solution Satisfaction:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        flex: 1
                      }}>
                        {renderScoreScale(8)}
                      </div>
                      <div style={{ 
                        minWidth: '40px', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#0ea5e9',
                        textAlign: 'right'
                      }}>
                        8/10
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: '#64748b',
                      paddingLeft: '128px'
                    }}>
                      Many use basic email marketing but few have systematic approaches
                    </p>
                    
                    {/* Willingness to Pay */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ 
                        minWidth: '120px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#334155' 
                      }}>
                        Willingness to Pay:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        flex: 1
                      }}>
                        {renderScoreScale(7)}
                      </div>
                      <div style={{ 
                        minWidth: '40px', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#0ea5e9',
                        textAlign: 'right'
                      }}>
                        7/10
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: '#64748b',
                      paddingLeft: '128px'
                    }}>
                      Understand the value of email marketing for course sales
                    </p>
                    
                    {/* Accessibility */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ 
                        minWidth: '120px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#334155' 
                      }}>
                        Accessibility:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        flex: 1
                      }}>
                        {renderScoreScale(8)}
                      </div>
                      <div style={{ 
                        minWidth: '40px', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#0ea5e9',
                        textAlign: 'right'
                      }}>
                        8/10
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: '#64748b',
                      paddingLeft: '128px'
                    }}>
                      Active in online communities, podcasts, social media
                    </p>
                  </div>
                </div>
                
                {/* Membership Site Owners */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '2px solid #86efac'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontWeight: 600, 
                      fontSize: '16px', 
                      color: '#166534'
                    }}>
                      Membership Site Owners (HIGHEST POTENTIAL)
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      backgroundColor: '#dcfce7',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#166534'
                    }}>
                      <span>Total:</span>
                      <span>33/40</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ minWidth: '120px', fontSize: '14px', fontWeight: 500, color: '#166534' }}>Problem Size:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                        {renderScoreScale(9)}
                      </div>
                      <div style={{ minWidth: '40px', fontSize: '14px', fontWeight: 600, color: '#166534', textAlign: 'right' }}>9/10</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#15803d', paddingLeft: '128px' }}>
                      Retention and engagement directly impact monthly revenue
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ minWidth: '120px', fontSize: '14px', fontWeight: 500, color: '#166534' }}>Solution Satisfaction:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                        {renderScoreScale(9)}
                      </div>
                      <div style={{ minWidth: '40px', fontSize: '14px', fontWeight: 600, color: '#166534', textAlign: 'right' }}>9/10</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#15803d', paddingLeft: '128px' }}>
                      Few solutions address the specific needs of membership retention
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ minWidth: '120px', fontSize: '14px', fontWeight: 500, color: '#166534' }}>Willingness to Pay:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                        {renderScoreScale(8)}
                      </div>
                      <div style={{ minWidth: '40px', fontSize: '14px', fontWeight: 600, color: '#166534', textAlign: 'right' }}>8/10</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#15803d', paddingLeft: '128px' }}>
                      Clear ROI — retained members equal predictable revenue
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ minWidth: '120px', fontSize: '14px', fontWeight: 500, color: '#166534' }}>Accessibility:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                        {renderScoreScale(7)}
                      </div>
                      <div style={{ minWidth: '40px', fontSize: '14px', fontWeight: 600, color: '#166534', textAlign: 'right' }}>7/10</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#15803d', paddingLeft: '128px' }}>
                      Active in specific membership owner communities
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 6D: Decision Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#1e293b',
                margin: 0
              }}>
                6D: Decision Analysis
              </h3>
              
              <div style={{ 
                padding: '16px',
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                border: '1px solid #a7f3d0'
              }}>
                <p style={{ 
                  margin: '0 0 16px 0',
                  lineHeight: 1.6, 
                  color: '#065f46',
                  fontWeight: 500,
                  fontSize: '15px'
                }}>
                  <span style={{ fontWeight: 600 }}>Highest potential segment:</span> Membership Site Owners (33/40)
                </p>
                
                <ul style={{ 
                  margin: '0',
                  paddingLeft: '16px',
                  color: '#065f46',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}>
                  <li>They have a clear need for consistent engagement to prevent churn</li>
                  <li>The problem directly impacts their monthly recurring revenue</li>
                  <li>Current solutions don't specifically address their unique needs</li>
                  <li>They understand the value of member retention</li>
                </ul>
                
                <p style={{ 
                  margin: '16px 0 0 0',
                  fontStyle: 'italic',
                  color: '#065f46',
                  fontSize: '14px'
                }}>
                  "I've never specifically targeted membership site owners before, but looking at this objectively, they seem to have the most painful problems that my skills can solve. The recurring revenue aspect of their business model aligns perfectly with my goal of creating systems for predictable revenue."
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}; 