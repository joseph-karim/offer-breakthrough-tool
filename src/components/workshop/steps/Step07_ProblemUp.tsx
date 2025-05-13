import React, { useState, useCallback } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetProblem } from '../../../types/workshop';
import { Check, Plus, X, Flame } from 'lucide-react';
import { Button } from '../../ui/Button';
import { InfoBox } from '../../ui/InfoBox';
import * as styles from '../../../styles/stepStyles';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ExampleBox } from '../../ui/ExampleBox';

// Separate selectors to prevent unnecessary re-renders
const selectTargetProblems = (state: WorkshopStore) => state.workshopData.targetProblems;
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectPainstormingResults = (state: WorkshopStore) => state.workshopData.painstormingResults;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step07_ProblemUp: React.FC = () => {
  const targetProblems = useWorkshopStore(selectTargetProblems) || [];
  const pains = useWorkshopStore(selectPains) || [];
  const targetBuyers = useWorkshopStore(selectTargetBuyers) || [];
  const painstormingResults = useWorkshopStore(selectPainstormingResults);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Local state
  const [newProblem, setNewProblem] = useState('');
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);

  // Get top buyer segments
  const topBuyers = targetBuyers.filter(buyer => buyer.isTopThree).slice(0, 3);

  // Get FIRE pains - the most critical problems
  const firePains = pains.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7));

  // Get overlapping problems (not associated with a specific buyer segment)
  const overlappingPains = pains.filter(pain =>
    pain.buyerSegment === 'All segments' ||
    pain.buyerSegment === 'Overlapping' ||
    pain.buyerSegment.toLowerCase().includes('overlap')
  );

  // Get buyer-specific problems
  const buyerSpecificPains = topBuyers.map(buyer => ({
    buyer,
    pains: pains.filter(pain =>
      pain.buyerSegment === buyer.description &&
      !firePains.some(fp => fp.id === pain.id) &&
      !overlappingPains.some(op => op.id === pain.id)
    )
  }));

  // Toggle accordion sections
  const toggleStep1 = useCallback(() => {
    setIsStep1Expanded(prev => !prev);
  }, []);

  const toggleStep2 = useCallback(() => {
    setIsStep2Expanded(prev => !prev);
  }, []);

  // Handle adding a new problem
  const handleAddProblem = useCallback(() => {
    if (newProblem.trim() !== '') {
      const problem: TargetProblem = {
        id: `problem-${Date.now()}`,
        description: newProblem.trim(),
        selected: false
      };

      const updatedProblems = [...targetProblems, problem];
      updateWorkshopData({ targetProblems: updatedProblems });
      setNewProblem(''); // Clear input
    }
  }, [newProblem, targetProblems, updateWorkshopData]);

  // Handle selecting/deselecting a problem
  const handleToggleProblem = useCallback((id: string) => {
    const updatedProblems = targetProblems.map(problem =>
      problem.id === id ? { ...problem, selected: !problem.selected } : problem
    );
    updateWorkshopData({ targetProblems: updatedProblems });
  }, [targetProblems, updateWorkshopData]);

  // Handle deleting a problem
  const handleDeleteProblem = useCallback((id: string) => {
    const updatedProblems = targetProblems.filter(problem => problem.id !== id);
    updateWorkshopData({ targetProblems: updatedProblems });
  }, [targetProblems, updateWorkshopData]);

  // Handle key press (Enter) for adding a problem
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddProblem();
    }
  }, [handleAddProblem]);

  // Convert a pain to a target problem
  const handleAddPainAsProblem = useCallback((pain: { id: string; description: string }) => {
    // Check if this pain is already added as a problem
    const exists = targetProblems.some(p =>
      p.description.toLowerCase() === pain.description.toLowerCase()
    );

    if (!exists) {
      const problem: TargetProblem = {
        id: `problem-${Date.now()}-${pain.id}`,
        description: pain.description,
        selected: false
      };

      const updatedProblems = [...targetProblems, problem];
      updateWorkshopData({ targetProblems: updatedProblems });
    }
  }, [targetProblems, updateWorkshopData]);

  // Parse a text list of problems and add them as target problems
  const handleAddProblemFromText = useCallback((text: string) => {
    if (!text.trim()) return;

    // Split by newlines and look for bullet points or numbered lists
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Process each line
    lines.forEach(line => {
      // Remove bullet points, numbers, or dashes at the beginning
      let cleanLine = line.replace(/^[\s•\-–—*]+|^\d+[\s.)\]]+/, '').trim();

      // Skip if it's a header or too short
      if (cleanLine.length < 5 || cleanLine.endsWith(':')) return;

      // Check if this problem already exists
      const exists = targetProblems.some(p =>
        p.description.toLowerCase() === cleanLine.toLowerCase()
      );

      if (!exists) {
        const problem: TargetProblem = {
          id: `problem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          description: cleanLine,
          selected: false
        };

        updateWorkshopData({
          targetProblems: [...targetProblems, problem]
        });
      }
    });
  }, [targetProblems, updateWorkshopData]);

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
          7
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }} data-sb-field-path="title">
          Choose Target Problems
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>You've identified a bunch of problems you could solve with your new offer. But you don't need to solve all the problems with one product. Let's narrow down your options and find the specific problems you're best suited to solve.</p>
      </div>

      {/* Info box with lightbulb icon */}
      <InfoBox>
        You can choose overlapping problems or focus on problems that are specific to one buyer segment
      </InfoBox>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <AccordionGroup>
          {/* Step 1: Analyze problem lists */}
          <AccordionItem
            title="Step 1) Analyze your problem lists to find profitable problems"
            defaultExpanded={isStep1Expanded}
            onToggle={toggleStep1}
          >
            <p style={{ marginBottom: '16px', fontSize: '15px', color: '#4b5563' }}>
              <strong>Ask yourself:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', fontSize: '15px', color: '#4b5563' }}>
              <li style={{ marginBottom: '8px' }}>What problems do buyers know they have?</li>
              <li style={{ marginBottom: '8px' }}>Which problems align with your skills and interests?</li>
              <li style={{ marginBottom: '8px' }}>What existing resources or assets can you leverage?</li>
              <li style={{ marginBottom: '8px' }}>What problems have you solved already, either for your own business or for your clients?</li>
              <li style={{ marginBottom: '8px' }}>Which problems are poorly solved by existing solutions?</li>
              <li style={{ marginBottom: '8px' }}>Which problems align with your broader business strategy?</li>
              <li style={{ marginBottom: '8px' }}>Which problems, if solved well, can create a profitable domino effect in your business?</li>
            </ul>

            {/* Display problems from painstorming */}
            {pains.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                  Problems from Painstorming:
                </h4>

                {/* FIRE Problems */}
                {firePains.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h5 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        margin: 0,
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Flame size={16} style={{ color: '#ef4444' }} />
                        FIRE Problems:
                      </h5>
                      <Button
                        onClick={() => firePains.forEach(pain => handleAddPainAsProblem(pain))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          padding: '4px 8px'
                        }}
                      >
                        <Plus size={14} />
                        Add All
                      </Button>
                    </div>
                    <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                      {firePains.map(pain => (
                        <div
                          key={pain.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#fff1f2',
                            borderRadius: '6px',
                            border: '1px solid #fecdd3',
                          }}
                        >
                          <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                            <strong>{pain.buyerSegment}:</strong> {pain.description}
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                              Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddPainAsProblem(pain)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '13px',
                              padding: '4px 8px'
                            }}
                          >
                            <Plus size={14} />
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overlapping Problems */}
                {overlappingPains.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h5 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#1e293b' }}>
                        Overlapping Problems:
                      </h5>
                      <Button
                        onClick={() => overlappingPains.forEach(pain => handleAddPainAsProblem(pain))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          padding: '4px 8px'
                        }}
                      >
                        <Plus size={14} />
                        Add All
                      </Button>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {overlappingPains.map(pain => (
                        <div
                          key={pain.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                            {pain.description}
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                              Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddPainAsProblem(pain)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '13px',
                              padding: '4px 8px'
                            }}
                          >
                            <Plus size={14} />
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buyer-specific problems */}
                {buyerSpecificPains.map(({ buyer, pains: buyerPains }) =>
                  buyerPains.length > 0 ? (
                    <div key={buyer.id} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#1e293b' }}>
                          {buyer.description} Problems:
                        </h5>
                        <Button
                          onClick={() => buyerPains.forEach(pain => handleAddPainAsProblem(pain))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            padding: '4px 8px'
                          }}
                        >
                          <Plus size={14} />
                          Add All
                        </Button>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {buyerPains.map(pain => (
                          <div
                            key={pain.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 12px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                              {pain.description}
                              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                                Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleAddPainAsProblem(pain)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px',
                                padding: '4px 8px'
                              }}
                            >
                              <Plus size={14} />
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}

                {/* Legacy text-based problems */}
                {painstormingResults && Object.values(painstormingResults).some(val => val && val.trim() !== '') && pains.length === 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '16px'
                    }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>
                        You have text-based problems from the previous step. Consider going back to Step 6 to convert them to structured problems.
                      </p>
                      {painstormingResults.overlappingPains && (
                        <div style={{ marginBottom: '12px' }}>
                          <h6 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>Overlapping Problems:</h6>
                          <div style={{ whiteSpace: 'pre-line', fontSize: '14px' }}>{painstormingResults.overlappingPains}</div>
                          <Button
                            onClick={() => handleAddProblemFromText(painstormingResults.overlappingPains)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '13px',
                              padding: '4px 8px',
                              marginTop: '8px'
                            }}
                          >
                            <Plus size={14} />
                            Add All
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                Add Your Own Problem:
              </h4>
              <textarea
                value={newProblem}
                onChange={(e) => setNewProblem(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., Marketers running service based businesses likely already know they want to launch a new offer to scale their business. They've likely already tried and past attempts have fizzled."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '15px',
                  resize: 'vertical',
                }}
                data-sb-field-path="placeholders.problemPlaceholder"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Button onClick={handleAddProblem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                Add Problem
              </Button>
            </div>

            {targetProblems.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                  Your Problem List:
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {targetProblems.map(problem => (
                    <div
                      key={problem.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        backgroundColor: problem.selected ? '#f0fdf4' : '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: problem.selected ? '#22c55e' : '#e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: problem.selected ? '#22c55e' : '#d1d5db',
                          backgroundColor: problem.selected ? '#22c55e' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleToggleProblem(problem.id)}
                      >
                        {problem.selected && <Check size={14} color="#FFFFFF" />}
                      </div>
                      <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                        {problem.description}
                      </div>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          display: 'flex',
                          padding: '4px',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionItem>

          {/* Step 2: Choose specific problems */}
          <AccordionItem
            title="Step 2) Which 1-5 specific problems are you interested in solving?"
            defaultExpanded={isStep2Expanded}
            onToggle={toggleStep2}
          >
            <p style={{ marginBottom: '16px', fontSize: '15px', color: '#4b5563' }}>
              Narrow in on 1-5 to build your offer around.
            </p>
            <p style={{ marginBottom: '20px', fontSize: '15px', color: '#4b5563' }}>
              You can choose overlapping problems or focus on problems that are specific to one buyer segment.
              You can still solve other problems, but the problems you focus on will help you brainstorm more targeted offer ideas.
            </p>

            {targetProblems.filter(p => p.selected).length > 0 ? (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                  Your Selected Problems:
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {targetProblems
                    .filter(problem => problem.selected)
                    .map(problem => (
                      <div
                        key={problem.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          backgroundColor: '#f0fdf4',
                          borderRadius: '6px',
                          border: '1px solid #22c55e',
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: '1px solid #22c55e',
                            backgroundColor: '#22c55e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={14} color="#FFFFFF" />
                        </div>
                        <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                          {problem.description}
                        </div>
                        <button
                          onClick={() => handleToggleProblem(problem.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #d1d5db',
                color: '#6b7280',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                No problems selected yet. Select problems from your list above.
              </div>
            )}
          </AccordionItem>
        </AccordionGroup>

        {/* Examples */}
        <div data-sb-field-path="examples">
          <ExampleBox
            examples={[
              "Struggles to find time to create content consistently",
              "Feels overwhelmed by the constant pressure to stay visible online",
              "Worries about being perceived as irrelevant by peers and clients",
              "Fears their service business will be disrupted by AI",
              "Can't scale their business without working more hours"
            ]}
            title="EXAMPLE PROBLEMS"
            initiallyVisible={true}
          />
        </div>
      </div>
    </div>
  );
};
