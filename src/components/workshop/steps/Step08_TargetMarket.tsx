import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetMarketProfile } from '../../../types/workshop';
import { Plus, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { SaveIndicator } from '../../ui/SaveIndicator';
import * as styles from '../../../styles/stepStyles';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { InfoBox } from '../../ui/InfoBox';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';

// Separate selectors to prevent unnecessary re-renders
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectTargetMarketProfile = (state: WorkshopStore) => state.workshopData.targetMarketProfile;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents;
const selectTargetProblems = (state: WorkshopStore) => state.workshopData.targetProblems;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step08_TargetMarket: React.FC = () => {
  const problemUp = useWorkshopStore(selectProblemUp);
  const targetMarketProfile = useWorkshopStore(selectTargetMarketProfile);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const jobs = useWorkshopStore(selectJobs);
  const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const targetProblems = useWorkshopStore(selectTargetProblems) || [];
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Get selected problems from previous step
  const selectedProblems = targetProblems.filter(problem => problem.selected);

  // Get the primary buyer (top-rated buyer)
  const topBuyers = targetBuyers.filter(buyer => buyer.isTopThree).slice(0, 1);
  const primaryBuyer = topBuyers.length > 0 ? topBuyers[0] : undefined;

  // Get the primary pain (first selected problem)
  const primaryPain = selectedProblems.length > 0
    ? { description: selectedProblems[0].description }
    : undefined;

  const overarchingJob = jobs.find(job => job.isOverarching);

  // Get relevant trigger events
  const relevantTriggers = problemUp?.relevantTriggerIds
    ? triggerEvents.filter(trigger => problemUp.relevantTriggerIds?.includes(trigger.id))
    : [];

  // Get all selected pains and buyers for context
  const selectedPains = selectedProblems.map(problem => ({
    description: problem.description
  }));

  const selectedBuyers = targetBuyers.filter(buyer => buyer.isTopThree);

  // Local state for form values
  const [formData, setFormData] = useState<TargetMarketProfile>({
    name: targetMarketProfile?.name || '',
    commonTraits: targetMarketProfile?.commonTraits || [],
    commonTriggers: targetMarketProfile?.commonTriggers || []
  });

  const [newTrait, setNewTrait] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // State for accordion expansion
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);

  // Toggle functions for accordions
  const toggleStep1 = useCallback(() => {
    setIsStep1Expanded(!isStep1Expanded);
  }, [isStep1Expanded]);

  const toggleStep2 = useCallback(() => {
    setIsStep2Expanded(!isStep2Expanded);
  }, [isStep2Expanded]);

  // Update local state when store value changes
  useEffect(() => {
    if (targetMarketProfile) {
      setFormData({
        name: targetMarketProfile.name || '',
        commonTraits: targetMarketProfile.commonTraits || [],
        commonTriggers: targetMarketProfile.commonTriggers || []
      });
    }
  }, [targetMarketProfile]);

  // Handle input change for text fields
  const handleInputChange = useCallback((field: keyof TargetMarketProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        targetMarketProfile: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Handle adding a new trait
  const handleAddTrait = useCallback(() => {
    if (newTrait.trim()) {
      const updatedTraits = [...formData.commonTraits, newTrait.trim()];
      setFormData(prev => ({ ...prev, commonTraits: updatedTraits }));
      updateWorkshopData({
        targetMarketProfile: {
          ...formData,
          commonTraits: updatedTraits
        }
      });
      setNewTrait('');
    }
  }, [newTrait, formData, updateWorkshopData]);

  // Handle adding a new trigger
  const handleAddTrigger = useCallback(() => {
    if (newTrigger.trim()) {
      const updatedTriggers = [...formData.commonTriggers, newTrigger.trim()];
      setFormData(prev => ({ ...prev, commonTriggers: updatedTriggers }));
      updateWorkshopData({
        targetMarketProfile: {
          ...formData,
          commonTriggers: updatedTriggers
        }
      });
      setNewTrigger('');
    }
  }, [newTrigger, formData, updateWorkshopData]);

  // Handle removing a trait
  const handleRemoveTrait = useCallback((index: number) => {
    const updatedTraits = formData.commonTraits.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, commonTraits: updatedTraits }));
    updateWorkshopData({
      targetMarketProfile: {
        ...formData,
        commonTraits: updatedTraits
      }
    });
  }, [formData, updateWorkshopData]);

  // Handle removing a trigger
  const handleRemoveTrigger = useCallback((index: number) => {
    const updatedTriggers = formData.commonTriggers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, commonTriggers: updatedTriggers }));
    updateWorkshopData({
      targetMarketProfile: {
        ...formData,
        commonTriggers: updatedTriggers
      }
    });
  }, [formData, updateWorkshopData]);

  // Handle key press for adding items
  const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
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
          8
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }} data-sb-field-path="title">
          Choose Target Market
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>You're clear on the problems you aim to solve. Before you begin brainstorming offer ideas, let's first refine your target market. You'll choose a market that shares common traits, common triggers, and/or common transformation.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <InfoBox>
          Choosing a specific target market inspires product differentiation and makes marketing easier.
        </InfoBox>

        <AccordionGroup>
          {/* Step 1: Brainstorm with Sparky */}
          <AccordionItem
            title="Step 1: Brainstorm Your Target Market with Sparky"
            isExpanded={isStep1Expanded}
            onToggle={toggleStep1}
          >
            <p style={{ marginBottom: '16px' }}>
              Sparky will help you define a specific target market profile based on your selected buyers, pains, and other context.
            </p>

            {/* Context Window */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px 0'
              }}>
                Your Context
              </h3>

              {/* Overarching Job */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Overarching Job-to-be-Done:</p>
                <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                  {overarchingJob?.description || "No overarching job defined yet"}
                </div>
              </div>

              {/* Focus Problems */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Focus Problems:</p>
                <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                  {selectedProblems.length > 0 ? (
                    <ul style={{ margin: '0', paddingLeft: '16px' }}>
                      {selectedProblems.map((problem, index) => (
                        <li key={index}>{problem.description}</li>
                      ))}
                    </ul>
                  ) : (
                    "No focus problems selected yet"
                  )}
                </div>
              </div>

              {/* Target Buyers */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Target Buyers:</p>
                <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                  {selectedBuyers.length > 0 ? (
                    <ul style={{ margin: '0', paddingLeft: '16px' }}>
                      {selectedBuyers.map((buyer, index) => (
                        <li key={index}>{buyer.description}</li>
                      ))}
                    </ul>
                  ) : (
                    "No target buyers selected yet"
                  )}
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <ChatWithSparkyButton
                exerciseKey="targetMarket"
                exerciseTitle="Define Your Target Market with Sparky"
                initialContext={{
                  primaryBuyer: primaryBuyer?.description,
                  allBuyers: selectedBuyers.map(b => b.description),
                  primaryPain: primaryPain?.description,
                  allPains: selectedPains.map(p => p.description),
                  targetMoment: problemUp?.targetMoment,
                  relevantTriggers: relevantTriggers.map(t => t.description),
                  overarchingJob: overarchingJob?.description || ""
                }}
                systemPromptKey="TARGET_MARKET_PROMPT"
              />
            </div>
          </AccordionItem>

          {/* Step 2: Define Target Market Profile */}
          <AccordionItem
            title="Step 2: Define Your Target Market Profile"
            isExpanded={isStep2Expanded}
            onToggle={toggleStep2}
          >
            {/* Market Name */}
            <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="market-name"
              style={styles.labelStyle}
            >
              What will you name this specific target market profile?
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              Create a descriptive name that captures the essence of your target market
            </p>



            <input
              id="market-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Plateaued Agency Owners Seeking Scalability"
              style={styles.inputStyle}
            />
          </div>

          {/* Common Traits */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="common-traits"
              style={styles.labelStyle}
            >
              COMMON TRAITS
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              List the most defining shared characteristics of this audience. Only consider traits that might inform product design (ie. demographic, firmographic, etc.)
            </p>



            {/* Add trait input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                id="common-traits"
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleAddTrait)}
                placeholder="e.g., Senior consultants, fractional CMOs, solo strategists, brand architects, or marketing agency owners"
                style={{
                  ...styles.inputStyle,
                  flex: 1
                }}
              />
              <Button
                onClick={handleAddTrait}
                disabled={!newTrait.trim()}
                variant="primary"
              >
                <Plus size={16} />
                Add Trait
              </Button>
            </div>

            {/* List of traits */}
            {formData.commonTraits.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                {formData.commonTraits.map((trait, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{trait}</span>
                    <button
                      onClick={() => handleRemoveTrait(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        padding: '4px',
                      }}
                      title="Remove trait"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px dashed #e2e8f0',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Add traits that define your target market (e.g., "Senior consultants", "Agency owners with 3-5 employees")
              </div>
            )}
          </div>

          {/* Common Triggers */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="common-triggers"
              style={styles.labelStyle}
            >
              COMMON TRIGGERS
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              List specific triggers this audience shares. Think specifically about triggers that might inform product design.
            </p>



            {/* Add trigger input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                id="common-triggers"
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleAddTrigger)}
                placeholder="e.g., They've hit a revenue plateau in their business"
                style={{
                  ...styles.inputStyle,
                  flex: 1
                }}
              />
              <Button
                onClick={handleAddTrigger}
                disabled={!newTrigger.trim()}
                variant="primary"
              >
                <Plus size={16} />
                Add Trigger
              </Button>
            </div>

            {/* List of triggers */}
            {formData.commonTriggers.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                {formData.commonTriggers.map((trigger, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{trigger}</span>
                    <button
                      onClick={() => handleRemoveTrigger(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        padding: '4px',
                      }}
                      title="Remove trigger"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px dashed #e2e8f0',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Add triggers that prompt your target market to seek solutions (e.g., "Revenue plateau", "Failed launch")
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <SaveIndicator saving={isSaving} />
          </div>
          </AccordionItem>
        </AccordionGroup>
      </div>
    </div>
  );
};