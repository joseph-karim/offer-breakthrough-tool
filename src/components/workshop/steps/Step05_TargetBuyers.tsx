import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetBuyer } from '../../../types/workshop';
import { Plus, X, Star } from 'lucide-react';
import { Button } from '../../ui/Button';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step05_TargetBuyers: React.FC = () => {
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

  // Accordion states
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);
  const [isStep3Expanded, setIsStep3Expanded] = useState(false);

  // Force re-render when accordion state changes
  const [, forceUpdate] = useState({});

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
    forceUpdate({});
  }, []);

  const toggleStep2 = useCallback(() => {
    setIsStep2Expanded(prev => !prev);
    forceUpdate({});
  }, []);

  const toggleStep3 = useCallback(() => {
    setIsStep3Expanded(prev => !prev);
    forceUpdate({});
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
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>Let's identify high-potential target customers. These are specific types of people who are likely to need to get the job done and get value from your solution. This is a 3-part exercise.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <AccordionGroup>
          {/* Step 1: Buyer Brainstorm */}
          <AccordionItem
            title="Step 1: Buyer Brainstorm"
            isExpanded={isStep1Expanded}
            onToggle={toggleStep1}
          >
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Who might have an urgent need to get the job done?
              </p>

              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Work with Sparky to brainstorm and make a long list of potential buyers.
              </p>

              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Remember to think contextually about who might need to get the job done.
                Consider specific life factors, business models, industries, job titles, etc.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <ChatWithSparkyButton
                  exerciseKey="buyerBrainstorm"
                  exerciseTitle="Brainstorm Potential Buyers"
                  initialContext={{
                    jobs: buyers.map(buyer => buyer.description)
                  }}
                  systemPromptKey="BUYER_BRAINSTORM_PROMPT"
                />
              </div>
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
          </AccordionItem>

          {/* Step 2: Make Shortlist & Rate Buyers */}
          <AccordionItem
            title="Step 2: Make Shortlist & Rate Buyers"
            isExpanded={isStep2Expanded}
            onToggle={toggleStep2}
          >
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Which 5 potential buyers do you think have the most potential?
                Narrow your list down to your top 5 potential buyers.
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

                {/* Spreadsheet-style table for rating buyers */}
                <div style={{ marginTop: '24px', overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '30%'
                        }}>
                          ADD YOUR POTENTIAL BUYERS BELOW<br />
                          AND RATE EACH 1-5
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '12%'
                        }}>
                          Buyer's<br />urgency to<br />get job done<br />
                          <span style={{ fontWeight: 400, fontSize: '12px' }}>(1-5)</span>
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '12%'
                        }}>
                          Buyers'<br />willingness<br />to pay<br />
                          <span style={{ fontWeight: 400, fontSize: '12px' }}>(1-5)</span>
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '12%'
                        }}>
                          Long-<br />term value<br /><br />
                          <span style={{ fontWeight: 400, fontSize: '12px' }}>(1-5)</span>
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '12%'
                        }}>
                          Ability to<br />serve<br />buyers<br />
                          <span style={{ fontWeight: 400, fontSize: '12px' }}>(1-5)</span>
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '12%'
                        }}>
                          Your access<br />to these<br />buyers<br />
                          <span style={{ fontWeight: 400, fontSize: '12px' }}>(1-5)</span>
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          backgroundColor: '#f8fafc',
                          borderBottom: '1px solid #e5e7eb',
                          borderLeft: '1px solid #e5e7eb',
                          fontWeight: 600,
                          width: '10%'
                        }}>
                          TOTAL<br />SCORE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyers.filter(b => b.shortlisted).map((buyer, index) => (
                        <tr key={buyer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{
                            padding: '12px 16px',
                            position: 'relative',
                            borderRight: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px'
                            }}>
                              <span style={{ fontStyle: 'italic' }}>
                                {index + 1}) {buyer.description}
                              </span>
                              <button
                                onClick={() => handleDeleteBuyer(buyer.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                aria-label="Delete buyer"
                              >
                                <X size={16} color="#6b7280" />
                              </button>
                            </div>
                          </td>
                          {[
                            { key: 'urgency' as const },
                            { key: 'willingness' as const },
                            { key: 'longTermValue' as const },
                            { key: 'solutionFit' as const },
                            { key: 'accessibility' as const }
                          ].map(({ key }) => (
                            <td key={key} style={{
                              padding: '12px 8px',
                              textAlign: 'center',
                              borderRight: '1px solid #e5e7eb'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                <select
                                  value={buyer[key] || 0}
                                  onChange={(e) => handleRateBuyer(buyer.id, key, parseInt(e.target.value))}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: buyer[key] ? '#FFDD00' : 'white',
                                    color: '#1e293b',
                                    fontWeight: buyer[key] ? 600 : 400,
                                    width: '50px',
                                    textAlign: 'center'
                                  }}
                                >
                                  <option value="0">-</option>
                                  {[1, 2, 3, 4, 5].map(value => (
                                    <option key={value} value={value}>{value}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          ))}
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            fontWeight: 600,
                            backgroundColor: '#f8fafc'
                          }}>
                            {(buyer.urgency || 0) +
                             (buyer.willingness || 0) +
                             (buyer.longTermValue || 0) +
                             (buyer.solutionFit || 0) +
                             (buyer.accessibility || 0)}
                          </td>
                        </tr>
                      ))}
                      {shortlistedBuyers.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                            Add your potential buyers above to rate them
                          </td>
                        </tr>
                      )}
                      {/* Example row */}
                      {shortlistedBuyers.length === 0 && (
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <td style={{
                            padding: '12px 16px',
                            borderRight: '1px solid #e5e7eb',
                            fontStyle: 'italic',
                            color: '#6b7280'
                          }}>
                            e.g., Serial online entrepreneurs building a new venture
                          </td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280'
                          }}>4</td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280'
                          }}>4</td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280'
                          }}>3</td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280'
                          }}>4</td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280'
                          }}>5</td>
                          <td style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            fontWeight: 600,
                            backgroundColor: '#f8fafc',
                            color: '#6b7280'
                          }}>20</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Step 3: Choose 3 Buyers to Explore Further */}
          <AccordionItem
            title="Step 3: Choose 3 buyers to explore further"
            isExpanded={isStep3Expanded}
            onToggle={toggleStep3}
          >
            <div>
              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Which 3 specific buyer segments will you explore further?
              </p>

              <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
                Choose your top 3.
              </p>

              {/* Add top 3 buyer */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={newTopBuyer}
                  onChange={(e) => setNewTopBuyer(e.target.value)}
                  placeholder="e.g., Solo marketers for hire (eg. Marketing consultants, freelancers, fractionals)"
                  style={styles.inputStyle}
                />
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
                    EXAMPLE OF TOP 3 BUYERS
                  </div>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: '#333333',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>1.</span>
                      Solo marketers for hire (eg. Marketing consultants, freelancers, fractionals)
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>2.</span>
                      Traditional marketing service agency owners (eg. ads, SEO, content, brand strategy, positioning, etc.)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>3.</span>
                      Serial online entrepreneurs building a new venture
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </AccordionItem>
        </AccordionGroup>
      </div>
    </div>
  );
};
