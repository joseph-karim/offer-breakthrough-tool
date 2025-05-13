import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ExampleBox } from '../../ui/ExampleBox';
import { InfoBox } from '../../ui/InfoBox';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectRefinedIdea = (state: WorkshopStore) => state.workshopData.refinedIdea;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;

export const Step09_RefineIdea: React.FC = () => {
  const initialBigIdea = useWorkshopStore(selectBigIdea);
  const refinedIdea = useWorkshopStore(selectRefinedIdea);
  const problemUp = useWorkshopStore(selectProblemUp);
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);

  const [formData, setFormData] = useState<BigIdea>({
    description: refinedIdea?.description || '',
    targetCustomers: refinedIdea?.targetCustomers || '',
    version: 'refined'
  });
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
    if (refinedIdea) {
      setFormData({
        description: refinedIdea.description || '',
        targetCustomers: refinedIdea.targetCustomers || '',
        version: 'refined'
      });
    }
  }, [refinedIdea]);

  // Initialize with initial big idea if no refined idea exists
  useEffect(() => {
    if (!refinedIdea && initialBigIdea) {
      setFormData({
        description: initialBigIdea.description || '',
        targetCustomers: initialBigIdea.targetCustomers || '',
        version: 'refined'
      });
    }
  }, [initialBigIdea, refinedIdea]);

  const handleInputChange = useCallback((field: keyof BigIdea, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        refinedIdea: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof BigIdea) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof BigIdea) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };

  // Get selected pains
  const selectedPains = pains.filter(pain =>
    problemUp?.selectedPains?.includes(pain.id)
  );

  // Get selected buyers
  const selectedBuyers = targetBuyers.filter(buyer =>
    problemUp?.selectedBuyers?.includes(buyer.id)
  );

  return (
    <div style={styles.stepContainerStyle} data-sb-object-id="step10">
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
          9
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}
        data-sb-field-path="title"
        >
          Refine Your Big Idea
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p data-sb-field-path="description">We're nearing the finish line! It's time for the fuuuuunn part—let's brainstorm painkiller offer ideas. Sparky is here to help you, but remember that the most original ideas will likely come from your own brain.</p>
      </div>

      {/* Info box with lightbulb icon */}
      <InfoBox>
        A painkiller offer solves profitable problems that buyers will pay to solve
      </InfoBox>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        {/* Context Display */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Your Workshop Context from Previous Steps:
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {/* Big Idea */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Initial Big Idea:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {initialBigIdea?.description || "No big idea defined yet"}
              </div>
            </div>

            {/* Underlying Goal */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Underlying Goal:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {useWorkshopStore.getState().workshopData.underlyingGoal?.businessGoal || "No underlying goal defined yet"}
              </div>
            </div>

            {/* Overarching Job */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Overarching Job Statement:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {useWorkshopStore.getState().workshopData.jobs.find(job => job.isOverarching)?.description || "No overarching job defined yet"}
              </div>
            </div>

            {/* Target Market */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Target Market:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {useWorkshopStore.getState().workshopData.targetMarketProfile?.name || "No target market defined yet"}
              </div>
            </div>

            {/* Primary Buyer */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Primary Target Buyer:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {selectedBuyers.length > 0 ? selectedBuyers[0].description : "No primary buyer selected yet"}
              </div>
            </div>

            {/* Common Traits */}
            {(() => {
              const traits = useWorkshopStore.getState().workshopData.targetMarketProfile?.commonTraits;
              return traits && traits.length > 0 ? (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Common Traits:</p>
                  <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {traits.map((trait, index) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Common Triggers */}
            {(() => {
              const triggers = useWorkshopStore.getState().workshopData.targetMarketProfile?.commonTriggers;
              return triggers && triggers.length > 0 ? (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Common Triggers:</p>
                  <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {triggers.map((trigger, index) => (
                        <li key={index}>{trigger}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Primary Pain */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Primary Pain Point:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {selectedPains.length > 0 ? selectedPains[0].description : "No primary pain selected yet"}
              </div>
            </div>

            {/* Target Problems */}
            {(() => {
              const problems = useWorkshopStore.getState().workshopData.targetProblems;
              const selectedProblems = problems?.filter(problem => problem.selected);
              return selectedProblems && selectedProblems.length > 0 ? (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Target Problems:</p>
                  <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {selectedProblems.map((problem, index) => (
                        <li key={index}>{problem.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Target Moment */}
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Target Moment:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {problemUp?.targetMoment || "No target moment defined yet"}
              </div>
            </div>

            {/* Aha Moments */}
            {useWorkshopStore.getState().workshopData.painstormingResults?.ahaMoments && (
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Your 'Aha!' Moments & Reflections on Pains:</p>
                <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                  {useWorkshopStore.getState().workshopData.painstormingResults?.ahaMoments}
                </div>
              </div>
            )}
          </div>
        </div>

        <AccordionGroup>
          {/* Step 1: Sparky will help you brainstorm */}
          <AccordionItem
            title="Step 1: Sparky will help you brainstorm"
            isExpanded={isStep1Expanded}
            onToggle={toggleStep1}
          >
            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              You'll use the work you've done so far as the foundation for your new offer.
            </p>

            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Answer a few questions and let Sparky generate ideas to kick-off the creative process.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
              <ChatWithSparkyButton
                exerciseKey="refineIdea"
                exerciseTitle="Refine Your Idea with Sparky"
                initialContext={{
                  // Big Idea
                  initialIdea: initialBigIdea?.description,
                  initialTargetCustomers: initialBigIdea?.targetCustomers,

                  // Underlying Goal
                  underlyingGoal: useWorkshopStore.getState().workshopData.underlyingGoal?.businessGoal,

                  // Overarching Job
                  overarchingJob: useWorkshopStore.getState().workshopData.jobs.find(job => job.isOverarching)?.description,

                  // Target Market
                  selectedBuyers: selectedBuyers.map(buyer => buyer.description),
                  targetMarketName: useWorkshopStore.getState().workshopData.targetMarketProfile?.name,
                  commonTraits: useWorkshopStore.getState().workshopData.targetMarketProfile?.commonTraits,
                  commonTriggers: useWorkshopStore.getState().workshopData.targetMarketProfile?.commonTriggers,

                  // Target Problems
                  selectedPains: selectedPains.map(pain => pain.description),
                  targetProblems: useWorkshopStore.getState().workshopData.targetProblems?.filter(problem => problem.selected).map(problem => problem.description),

                  // Additional Context
                  targetMoment: problemUp?.targetMoment,
                  painstormingResults: useWorkshopStore.getState().workshopData.painstormingResults?.ahaMoments
                }}
                systemPromptKey="REFINE_IDEA_PROMPT"
              />
            </div>
          </AccordionItem>

          {/* Step 2: Revamp Your Big Idea */}
          <AccordionItem
            title="Step 2: Revamp Your Big Idea"
            isExpanded={isStep2Expanded}
            onToggle={toggleStep2}
          >
            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Ask yourself:
            </p>

            <ul style={{
              listStyle: 'disc',
              paddingLeft: '24px',
              color: '#4b5563',
              fontSize: '15px',
              margin: '0 0 24px 0'
            }}>
              <li>Does this offer solve a sharp pain?</li>
              <li>Is the solution context-specific? (ie. helps buyers who share common traits or triggers)</li>
              <li>Will this offer deliver a dream outcome?</li>
              <li>Does it feel effortless for customers? (or makes work feel rewarding or playful)</li>
              <li>How might this offer delight buyers</li>
              <li>Does this offer feel fresh yet familiar?</li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="refined-idea-description"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                Your Refined Big Idea
              </label>
              <ResponsiveFloatingTooltip
                content="Describe your refined product or service idea based on the insights from the workshop"
                placement="right"
                maxWidth={300}
              >
                <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                  <HelpCircle size={16} style={{ color: '#6b7280' }} />
                </div>
              </ResponsiveFloatingTooltip>
            </div>
            <textarea
              id="refined-idea-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., An interactive portal with custom GPT tools and battle-tested templates to help consultants brainstorm, validate, and outline scalable product ideas. New tools added monthly."
              style={isFieldEmpty('description') ? styles.errorTextareaStyle : styles.textareaStyle}
            />
            {isFieldEmpty('description') && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('description')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </AccordionItem>

          {/* Example Offer Idea - Not in an accordion as it's just an example */}
          <div style={{
            marginBottom: '32px',
            marginTop: '24px'
          }}>
            <ExampleBox
              title="EXAMPLE OFFER IDEA"
              initiallyVisible={true}
            >
              <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Offer Name:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  The AI Copy Sprint System™
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  High-Level Description:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  A high-ticket hybrid program teaching copywriters how to harness AI (custom GPTs) to produce high-converting, brand-aligned copy at lightning speed. Includes your proprietary Voice Lock™ Framework, a library of custom GPTs trained for sales pages, emails, and ads, plus bite-sized tutorials under 15 minutes each.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Target Market:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Mid-level to seasoned freelance copywriters earning $7K+/month, burned out and afraid of AI-driven obsolescence.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Core Problem Solved:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Inefficient copy processes, brand voice inconsistency, costly revision cycles, and fear of AI replacing their work.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Painkilling Value:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Go from burned out and falling behind to producing polished, high-converting copy in under 4 hours, while confidently positioning themselves as AI-augmented premium copywriters.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Pricing:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  $2,500 one-time or $500/month for 6 months.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Unique Mechanism:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Voice Lock™ Framework + Done-for-You AI Agents.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Effortless Experience:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Plug-and-play GPT agents, templates, and short video lessons.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Scalability:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Digital product with optional recurring subscription for new templates and agents.
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>
                  Potential Challenges:
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Convincing copywriters AI can enhance their value, not replace them.
                </p>
              </div>
            </div>
            </ExampleBox>
          </div>

          {/* Takeaways - Part of Step 2 but outside the accordion for visibility */}
          <div style={{ marginBottom: '32px', marginTop: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              What are your big takeaways from this exercise?
            </h3>

            <textarea
              id="refined-target-customers"
              value={formData.targetCustomers}
              onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
              placeholder="e.g., I should focus on building a productized service rather than a course. This will bring more money in the door and I can use AI and automation to make it scalable."
              style={isFieldEmpty('targetCustomers') ? styles.errorTextareaStyle : styles.textareaStyle}
            />
            {isFieldEmpty('targetCustomers') && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('targetCustomers')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>
        </AccordionGroup>
      </div>
    </div>
  );
};