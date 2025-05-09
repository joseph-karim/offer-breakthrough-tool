import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TargetMarketProfile } from '../../../types/workshop';
import { Plus, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { SaveIndicator } from '../../ui/SaveIndicator';
import * as styles from '../../../styles/stepStyles';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { ContextBox } from '../ContextBox';

// Separate selectors to prevent unnecessary re-renders
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectTargetMarketProfile = (state: WorkshopStore) => state.workshopData.targetMarketProfile;
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
// const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;



export const Step08_TargetMarket: React.FC = () => {
  const problemUp = useWorkshopStore(selectProblemUp);
  const targetMarketProfile = useWorkshopStore(selectTargetMarketProfile);
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const jobs = useWorkshopStore(selectJobs);
  // const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);



  // Get the primary pain, buyer, and job
  const primaryPain = problemUp?.selectedPains && problemUp.selectedPains.length > 0
    ? pains.find(pain => pain.id === problemUp.selectedPains[0])
    : undefined;

  const primaryBuyer = problemUp?.selectedBuyers && problemUp.selectedBuyers.length > 0
    ? targetBuyers.find(buyer => buyer.id === problemUp.selectedBuyers[0])
    : undefined;

  const overarchingJob = jobs.find(job => job.isOverarching);

  // const relevantTriggers = problemUp?.relevantTriggerIds
  //   ? triggerEvents.filter(trigger => problemUp.relevantTriggerIds.includes(trigger.id))
  //   : [];

  // Local state for form values
  const [formData, setFormData] = useState<TargetMarketProfile>({
    name: targetMarketProfile?.name || '',
    commonTraits: targetMarketProfile?.commonTraits || [],
    commonTriggers: targetMarketProfile?.commonTriggers || [],
    coreTransformation: targetMarketProfile?.coreTransformation || ''
  });

  const [newTrait, setNewTrait] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    if (targetMarketProfile) {
      setFormData({
        name: targetMarketProfile.name || '',
        commonTraits: targetMarketProfile.commonTraits || [],
        commonTriggers: targetMarketProfile.commonTriggers || [],
        coreTransformation: targetMarketProfile.coreTransformation || ''
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
          08
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Define Your Focused Target Market
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>You're clear on the problems you aim to solve and the target moment. Now, let's crystallize the definition of your target market based on shared characteristics relevant to your upcoming offer.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={styles.yellowInfoBoxStyle}>
          Defining your market by shared traits, triggers, and their desired transformation helps create differentiated offers and makes marketing much easier.
        </div>

        {/* Context Display */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Refining based on your Problem-Up Focus:
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Primary Target Buyer Segment Selected:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {primaryBuyer?.description || "No primary buyer selected yet"}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Primary Pain Focused On:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {primaryPain?.description || "No primary pain selected yet"}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Defined Target Moment:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {problemUp?.targetMoment || "No target moment defined yet"}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Overarching Job Statement:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {overarchingJob?.description || "No overarching job statement defined yet"}
              </div>
            </div>
          </div>
        </div>

        <AccordionGroup>
          {/* Step 1: Brainstorm with Sparky */}
          <AccordionItem
            title="Step 1: Brainstorm Market Descriptors with Sparky"
            defaultExpanded={true}
          >
            <ContextBox>
              <ul className="list-disc list-inside">
                <li><strong>Primary Buyer:</strong> {primaryBuyer?.description || "Not selected yet"}</li>
                <li><strong>Primary Pain:</strong> {primaryPain?.description || "Not selected yet"}</li>
                <li><strong>Target Moment:</strong> {problemUp?.targetMoment || "Not defined yet"}</li>
              </ul>
            </ContextBox>

            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Sparky can help you brainstorm common traits, relevant triggers, and the core transformation promise for the market segment you focused on in the previous step.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <ChatWithSparkyButton
                exerciseKey="targetMarket"
                exerciseTitle="Define Your Target Market with Sparky"
                initialContext={{
                  primaryBuyer: primaryBuyer?.description,
                  primaryPain: primaryPain?.description,
                  targetMoment: problemUp?.targetMoment,
                  overarchingJob: overarchingJob?.description
                }}
                systemPromptKey="TARGET_MARKET_PROMPT"
              />
            </div>
          </AccordionItem>

          {/* Step 2: Describe Target Market Profile */}
          <AccordionItem
            title="Step 2: Describe Your Focused Target Market Profile"
          >
            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Add the key descriptors for this specific market segment. Focus only on attributes most relevant for shaping your offer. You can use Sparky's suggestions as a starting point.
            </p>

          {/* Market Profile Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="market-name"
              style={styles.labelStyle}
            >
              What will you name this specific target market profile?
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              Give this focused group a descriptive name.
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
              Key Common Traits
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              List the most defining shared characteristics (demographic, firmographic, psychographic).
            </p>

            {/* Add trait input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                id="common-traits"
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleAddTrait)}
                placeholder="e.g., Runs a 5-10 person service agency, Revenue $500k-$2M, Feels overworked..."
                style={styles.inputStyle}
              />
              <Button
                onClick={handleAddTrait}
                disabled={!newTrait.trim()}
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
                      padding: '10px 16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#374151' }}>{trait}</span>
                    <button
                      onClick={() => handleRemoveTrait(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
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
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                No traits added yet. Add traits that define this market segment.
              </div>
            )}
          </div>

          {/* Common Triggers */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="common-triggers"
              style={styles.labelStyle}
            >
              Most Relevant Common Triggers
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              List the specific triggers most relevant to this group experiencing the target moment/pain.
            </p>

            {/* Add trigger input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                id="common-triggers"
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleAddTrigger)}
                placeholder="e.g., Lost a major client recently, Competitor launched superior offer..."
                style={styles.inputStyle}
              />
              <Button
                onClick={handleAddTrigger}
                disabled={!newTrigger.trim()}
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
                      padding: '10px 16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#374151' }}>{trigger}</span>
                    <button
                      onClick={() => handleRemoveTrigger(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
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
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                No triggers added yet. Add triggers that are common for this market segment.
              </div>
            )}
          </div>

          {/* Core Transformation */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="core-transformation"
              style={styles.labelStyle}
            >
              Core Transformation Promise (Derived from Job Statement)
            </label>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
              Rephrase their Overarching Job Statement into a concise 'From X to Y' transformation they seek.
            </p>
            <textarea
              id="core-transformation"
              value={formData.coreTransformation}
              onChange={(e) => handleInputChange('coreTransformation', e.target.value)}
              placeholder="Sparky can help! e.g., Go from feeling stuck and overworked to having a clear, scalable growth plan."
              style={styles.textareaStyle}
              rows={3}
            />
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              fontStyle: 'italic',
              margin: '4px 0 0 0'
            }}>
              Based on Job: '{overarchingJob?.description || "No job statement defined yet"}'
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <SaveIndicator saving={isSaving} />
          </div>
          </AccordionItem>
        </AccordionGroup>
      </div>
    </div>
  );
};