import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetBuyer } from '../../../types/workshop';
import { HelpCircle, Plus, X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';
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
  const [potentialBuyers, setPotentialBuyers] = useState<string[]>([]);
  const [newPotentialBuyer, setNewPotentialBuyer] = useState('');
  const [shortlistedBuyers, setShortlistedBuyers] = useState<string[]>([]);
  const [topThreeBuyers, setTopThreeBuyers] = useState<string[]>([]);
  const [newTopBuyer, setNewTopBuyer] = useState('');
  // const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Accordion states
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);
  const [isStep3Expanded, setIsStep3Expanded] = useState(false);

  // Update local state when store value changes
  useEffect(() => {
    setBuyers(targetBuyers || []);

    // Extract shortlisted and top buyers from store data
    const shortlisted = targetBuyers?.filter(b => b.shortlisted).map(b => b.description) || [];
    setShortlistedBuyers(shortlisted);

    const topThree = targetBuyers?.filter(b => b.isTopThree).map(b => b.description) || [];
    setTopThreeBuyers(topThree);

    // Extract all potential buyers
    const allBuyerDescriptions = targetBuyers?.map(b => b.description) || [];
    setPotentialBuyers(allBuyerDescriptions);
  }, [targetBuyers]);

  // Handle adding a new potential buyer (Step 1)
  const handleAddPotentialBuyer = useCallback(() => {
    if (newPotentialBuyer.trim() !== '') {
      // Add to potential buyers list
      setPotentialBuyers(prev => [...prev, newPotentialBuyer.trim()]);

      // Also add to formal buyers list
      const buyer: TargetBuyer = {
        id: `user-${Date.now()}`,
        description: newPotentialBuyer.trim(),
        source: 'user',
        urgency: 0,
        willingness: 0,
        longTermValue: 0,
        solutionFit: 0,
        accessibility: 0,
        shortlisted: false,
        isTopThree: false
      };

      const updatedBuyers = [...buyers, buyer];
      setBuyers(updatedBuyers);
      updateWorkshopData({ targetBuyers: updatedBuyers });
      setNewPotentialBuyer(''); // Clear input
    }
  }, [newPotentialBuyer, buyers, updateWorkshopData]);

  // Handle adding a shortlisted buyer (Step 2)
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
        accessibility: 0,
        shortlisted: true
      };

      const updatedBuyers = [...buyers, buyer];
      setBuyers(updatedBuyers);
      setShortlistedBuyers(prev => [...prev, newBuyer.trim()]);
      setNewBuyer(''); // Clear input
      updateWorkshopData({ targetBuyers: updatedBuyers });
    }
  }, [newBuyer, buyers, updateWorkshopData]);

  // Handle adding a top 3 buyer (Step 3)
  const handleAddTopBuyer = useCallback(() => {
    if (newTopBuyer.trim() !== '' && topThreeBuyers.length < 3) {
      setTopThreeBuyers(prev => [...prev, newTopBuyer.trim()]);

      // Update the full buyers list
      const existingBuyer = buyers.find(b => b.description === newTopBuyer.trim());

      if (existingBuyer) {
        // Mark an existing buyer as top three
        const updatedBuyers = buyers.map(b =>
          b.id === existingBuyer.id ? { ...b, isTopThree: true } : b
        );
        setBuyers(updatedBuyers);
        updateWorkshopData({ targetBuyers: updatedBuyers });
      } else {
        // Create a new buyer and mark as top three
        const buyer: TargetBuyer = {
          id: `user-${Date.now()}`,
          description: newTopBuyer.trim(),
          source: 'user',
          urgency: 0,
          willingness: 0,
          longTermValue: 0,
          solutionFit: 0,
          accessibility: 0,
          shortlisted: true,
          isTopThree: true
        };

        const updatedBuyers = [...buyers, buyer];
        setBuyers(updatedBuyers);
        updateWorkshopData({ targetBuyers: updatedBuyers });
      }

      setNewTopBuyer(''); // Clear input
    }
  }, [newTopBuyer, topThreeBuyers, buyers, updateWorkshopData]);

  const handleDeleteBuyer = useCallback((id: string) => {
    const buyerToDelete = buyers.find(buyer => buyer.id === id);
    const updatedBuyers = buyers.filter(buyer => buyer.id !== id);
    setBuyers(updatedBuyers);

    if (buyerToDelete) {
      // Remove from shortlisted or top three if necessary
      if (buyerToDelete.shortlisted) {
        setShortlistedBuyers(prev => prev.filter(desc => desc !== buyerToDelete.description));
      }

      if (buyerToDelete.isTopThree) {
        setTopThreeBuyers(prev => prev.filter(desc => desc !== buyerToDelete.description));
      }

      // Remove from potential buyers list
      setPotentialBuyers(prev => prev.filter(desc => desc !== buyerToDelete.description));
    }

    updateWorkshopData({ targetBuyers: updatedBuyers });
  }, [buyers, updateWorkshopData]);

  const handleRemoveTopBuyer = useCallback((description: string) => {
    setTopThreeBuyers(prev => prev.filter(desc => desc !== description));

    // Update the full buyers list
    const updatedBuyers = buyers.map(b =>
      b.description === description ? { ...b, isTopThree: false } : b
    );

    setBuyers(updatedBuyers);
    updateWorkshopData({ targetBuyers: updatedBuyers });
  }, [buyers, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  }, []);

  const handleRateBuyer = useCallback((id: string, field: keyof TargetBuyer, value: number) => {
    const updatedBuyers = buyers.map(buyer =>
      buyer.id === id ? { ...buyer, [field]: value } : buyer
    );
    setBuyers(updatedBuyers);
    updateWorkshopData({ targetBuyers: updatedBuyers });
  }, [buyers, updateWorkshopData]);

  const toggleShortlistBuyer = useCallback((description: string) => {
    const buyer = buyers.find(b => b.description === description);

    if (buyer) {
      const isCurrentlyShortlisted = buyer.shortlisted;

      // Update shortlisted status
      const updatedBuyers = buyers.map(b =>
        b.id === buyer.id ? { ...b, shortlisted: !isCurrentlyShortlisted } : b
      );

      setBuyers(updatedBuyers);
      updateWorkshopData({ targetBuyers: updatedBuyers });

      // Update shortlisted list
      if (isCurrentlyShortlisted) {
        setShortlistedBuyers(prev => prev.filter(desc => desc !== description));
      } else {
        setShortlistedBuyers(prev => [...prev, description]);
      }
    }
  }, [buyers, updateWorkshopData]);

  // Toggle accordion sections
  const toggleStep1 = useCallback(() => {
    setIsStep1Expanded(prev => !prev);
  }, []);

  const toggleStep2 = useCallback(() => {
    setIsStep2Expanded(prev => !prev);
  }, []);

  const toggleStep3 = useCallback(() => {
    setIsStep3Expanded(prev => !prev);
  }, []);

  return (
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#fcf720',
          color: 'black',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '15px',
          marginTop: '3px'
        }}>
          5
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Identify Potential Buyers
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Let's identify high-potential target customers. These are specific types of people who are likely to need to get the job done and get value from your solution. This is a 3-part exercise.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
          <label
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e293b',
              display: 'inline-flex',
              alignItems: 'center',
              margin: 0
            }}
          >
            Identify Potential Buyers
          </label>
          <ResponsiveFloatingTooltip
            content="Think contextually about who might need to get the job done. Consider specific life factors, business models, industries, job titles, etc."
            placement="right"
            maxWidth={300}
          >
            <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
              <HelpCircle size={16} style={{ color: '#6b7280' }} />
            </div>
          </ResponsiveFloatingTooltip>
        </div>

        {/* Step 1: Buyer Brainstorm - ACCORDION */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '12px 16px',
              backgroundColor: isStep1Expanded ? '#fcf720' : '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '12px',
              fontWeight: 600
            }}
            onClick={toggleStep1}
          >
            Step 1: Buyer Brainstorm
            {isStep1Expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {isStep1Expanded && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Who might have an urgent need to get the job done? Do a brain dump and make a long list of potential buyers.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={newPotentialBuyer}
                  onChange={(e) => setNewPotentialBuyer(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleAddPotentialBuyer)}
                  placeholder="e.g., Burnt out marketing consultants who feel stuck"
                  style={styles.inputStyle}
                />
                <Button
                  onClick={handleAddPotentialBuyer}
                  disabled={!newPotentialBuyer.trim()}
                  variant="primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fcf720',
                    color: '#222222',
                    borderRadius: '15px',
                  }}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>

              {/* List of potential buyers */}
              {potentialBuyers.length > 0 ? (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {potentialBuyers.map((description, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#374151' }}>{description}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleShortlistBuyer(description)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: shortlistedBuyers.includes(description) ? '#FFDD00' : '#6b7280',
                          }}
                          title={shortlistedBuyers.includes(description) ? "Remove from shortlist" : "Add to shortlist"}
                        >
                          <Star size={16} fill={shortlistedBuyers.includes(description) ? '#FFDD00' : 'none'} />
                        </button>

                        {/* Find the buyer object with this description and delete it */}
                        {(() => {
                          const buyer = buyers.find(b => b.description === description);
                          return buyer ? (
                            <button
                              onClick={() => handleDeleteBuyer(buyer.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              title="Remove buyer"
                            >
                              <X size={16} />
                            </button>
                          ) : null;
                        })()}
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
          )}
        </div>

        {/* Step 2: Make Shortlist & Rate Buyers - ACCORDION */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '12px 16px',
              backgroundColor: isStep2Expanded ? '#fcf720' : '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '12px',
              fontWeight: 600
            }}
            onClick={toggleStep2}
          >
            Step 2: Make Shortlist & Rate Buyers
            {isStep2Expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {isStep2Expanded && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Which 5 potential buyers do you think have the most potential? Narrow your list down to your top 5 potential buyers.
              </p>

              {/* Add shortlisted buyer */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={newBuyer}
                    onChange={(e) => setNewBuyer(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleAddBuyer)}
                    placeholder="e.g., Serial online entrepreneurs building a new venture"
                    style={styles.inputStyle}
                  />
                  <Button
                    onClick={handleAddBuyer}
                    disabled={!newBuyer.trim()}
                    variant="primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#fcf720',
                      color: '#222222',
                      borderRadius: '15px',
                    }}
                  >
                    <Plus size={16} />
                    Add
                  </Button>
                </div>

                {/* Shortlisted buyers */}
                {shortlistedBuyers.length > 0 && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {buyers.filter(b => b.shortlisted).map(buyer => (
                      <div
                        key={buyer.id}
                        style={{
                          backgroundColor: '#F2F2F2',
                          borderRadius: '15px',
                          border: '1px solid #DDDDDD',
                          overflow: 'hidden',
                        }}
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
                              { key: 'urgency' as const, label: 'Urgency to get job done' },
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
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Choose 3 Buyers to Explore Further - ACCORDION */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '12px 16px',
              backgroundColor: isStep3Expanded ? '#fcf720' : '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '12px',
              fontWeight: 600
            }}
            onClick={toggleStep3}
          >
            Step 3: Choose 3 Buyers to Explore Further
            {isStep3Expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {isStep3Expanded && (
            <div>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Which 3 specific buyer segments will you explore further? Choose your top 3.
              </p>

              {/* Add top 3 buyer */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <select
                  value={newTopBuyer}
                  onChange={(e) => setNewTopBuyer(e.target.value)}
                  style={styles.inputStyle}
                >
                  <option value="">Select a buyer from your shortlist</option>
                  {shortlistedBuyers.map((buyer, index) => (
                    <option
                      key={index}
                      value={buyer}
                      disabled={topThreeBuyers.includes(buyer)}
                    >
                      {buyer} {topThreeBuyers.includes(buyer) ? '(Already selected)' : ''}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleAddTopBuyer}
                  disabled={!newTopBuyer.trim() || topThreeBuyers.length >= 3}
                  variant="primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fcf720',
                    color: '#222222',
                    borderRadius: '15px',
                  }}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>

              {/* Display top 3 buyers */}
              {topThreeBuyers.length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: '0 0 12px 0'
                  }}>
                    Your Top 3 Buyers:
                  </h4>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {topThreeBuyers.map((description, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          backgroundColor: '#f0fdf4',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}>
                            {index + 1}
                          </div>
                          <span style={{ color: '#166534', fontWeight: 500 }}>{description}</span>
                        </div>

                        <button
                          onClick={() => handleRemoveTopBuyer(description)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    {topThreeBuyers.length < 3 && (
                      <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px dashed #d1d5db',
                        color: '#6b7280',
                        fontSize: '14px',
                        textAlign: 'center',
                      }}>
                        {3 - topThreeBuyers.length} more buyer{3 - topThreeBuyers.length > 1 ? 's' : ''} needed
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#F0E6FF', // Purple background
                  borderRadius: '15px',
                  padding: '20px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    backgroundColor: '#6B46C1',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    TOP 3 EXAMPLE
                  </div>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: '#333333',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                      Solo marketers for hire (eg. Marketing consultants, freelancers, fractionals)
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                      Traditional marketing service agency owners (eg. ads, SEO, content, brand strategy, positioning, etc.)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                      Serial online entrepreneurs building a new venture
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};