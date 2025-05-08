import React, { useCallback, useState, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { HelpCircle, ExternalLink, FileText } from 'lucide-react';
import { exportWorkshopToPdf } from '../../../utils/pdfExporter';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { useSparkyService } from '../../../hooks/useSparkyService';
import Confetti from 'react-confetti';

// Separate selectors to prevent unnecessary re-renders
const selectWorkshopData = (state: WorkshopStore) => state.workshopData;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectAddChatMessage = (state: WorkshopStore) => state.addChatMessage;


export const Step10_Summary: React.FC = () => {
  const workshopData = useWorkshopStore(selectWorkshopData);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const addChatMessage = useWorkshopStore(selectAddChatMessage);
  const sparkyService = useSparkyService();

  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isGeneratingNextSteps, setIsGeneratingNextSteps] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [formData, setFormData] = useState({
    keyInsights: workshopData.reflections?.keyInsights || '',
    nextSteps: workshopData.reflections?.nextSteps || '',
    personalReflection: workshopData.reflections?.personalReflection || ''
  });

  // Window dimensions for confetti
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window dimensions when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Hide confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Initialize with data from the store
  useEffect(() => {
    setFormData({
      keyInsights: workshopData.reflections?.keyInsights || '',
      nextSteps: workshopData.reflections?.nextSteps || '',
      personalReflection: workshopData.reflections?.personalReflection || ''
    });
  }, [
    workshopData.reflections?.keyInsights,
    workshopData.reflections?.nextSteps,
    workshopData.reflections?.personalReflection
  ]);

  // Generate insights and next steps if they're not already defined
  useEffect(() => {
    const shouldGenerateInsights = !workshopData.reflections?.keyInsights;
    const shouldGenerateNextSteps = !workshopData.reflections?.nextSteps;

    if (shouldGenerateInsights || shouldGenerateNextSteps) {
      generateInsightsAndNextSteps();
    }
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaving(true);

    // Debounce saving to avoid too many updates
    const timeoutId = setTimeout(() => {
      const updatedReflections = {
        keyInsights: field === 'keyInsights' ? value : (workshopData.reflections?.keyInsights || ''),
        nextSteps: field === 'nextSteps' ? value : (workshopData.reflections?.nextSteps || ''),
        personalReflection: field === 'personalReflection' ? value : (workshopData.reflections?.personalReflection || '')
      };

      updateWorkshopData({
        reflections: updatedReflections
      });
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [updateWorkshopData, workshopData.reflections]);

  // Generate insights and next steps
  const generateInsightsAndNextSteps = useCallback(async () => {
    try {
      setIsGeneratingInsights(true);
      setIsGeneratingNextSteps(true);

      // Generate suggestions using the Sparky service
      const keyInsightsSuggestions = await sparkyService.generateSuggestions(10, workshopData, 'keyInsights');
      const nextStepsSuggestions = await sparkyService.generateSuggestions(10, workshopData, 'nextSteps');

      // Update the form data and workshop data
      if (keyInsightsSuggestions.length > 0) {
        const keyInsights = keyInsightsSuggestions.map(s => s.content).join('\n');
        setFormData(prev => ({ ...prev, keyInsights }));
        updateWorkshopData({
          reflections: {
            ...workshopData.reflections,
            keyInsights: keyInsights,
            nextSteps: workshopData.reflections?.nextSteps || '',
            personalReflection: workshopData.reflections?.personalReflection || ''
          }
        });
        setIsGeneratingInsights(false);
      }

      if (nextStepsSuggestions.length > 0) {
        const nextSteps = nextStepsSuggestions.map(s => s.content).join('\n');
        setFormData(prev => ({ ...prev, nextSteps }));
        updateWorkshopData({
          reflections: {
            ...workshopData.reflections,
            keyInsights: workshopData.reflections?.keyInsights || '',
            nextSteps: nextSteps,
            personalReflection: workshopData.reflections?.personalReflection || ''
          }
        });
        setIsGeneratingNextSteps(false);
      }

      // Add a message to the chat
      addChatMessage(10, {
        id: Date.now().toString(),
        content: `I've generated some key insights and next steps based on your workshop journey. Feel free to edit them to better reflect your thoughts and plans. You can also add your personal reflection on the workshop experience.`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error generating insights and next steps:', error);
      setIsGeneratingInsights(false);
      setIsGeneratingNextSteps(false);
    }
  }, [workshopData, sparkyService, updateWorkshopData, addChatMessage]);

  // Download summary as PDF
  const downloadPdfSummary = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportWorkshopToPdf(workshopData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, [workshopData]);

  return (
    <div style={styles.stepContainerStyle}>
      {/* Confetti animation */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

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
          10
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Workshop Summary
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Reflect on your journey, capture key insights, and plan your next steps</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={styles.yellowInfoBoxStyle}>
            Congratulations on completing the Buyer Breakthrough Workshop! Now it's time to reflect on your journey, capture key insights, and create an actionable plan to validate your offer concept before building it.
          </div>

          {/* Your Workshop Results */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Your Workshop Results
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Target Market Focus */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0'
                }}>
                  1. Target Market Focus
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Primary Target Buyer */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Your Primary Target Buyer:
                    </h5>
                    {(workshopData.problemUp?.selectedBuyers && workshopData.problemUp.selectedBuyers.length > 0) ? (
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0'
                      }}>
                        {workshopData.targetBuyers.find(buyer =>
                          buyer.id === workshopData.problemUp?.selectedBuyers[0]
                        )?.description || 'Not specified'}
                      </p>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No primary buyer selected
                      </p>
                    )}
                  </div>

                  {/* Target Moment */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Identified Target Moment:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.problemUp?.targetMoment || 'Not defined'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem Space Solved */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0'
                }}>
                  2. Problem Space Solved
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Primary Pain */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Primary Pain Addressed:
                    </h5>
                    {(workshopData.problemUp?.selectedPains && workshopData.problemUp.selectedPains.length > 0) ? (
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0'
                      }}>
                        {workshopData.pains.find(pain =>
                          pain.id === workshopData.problemUp?.selectedPains[0]
                        )?.description || 'Not specified'}
                      </p>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No primary pain selected
                      </p>
                    )}
                  </div>

                  {/* Overarching Job */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Overarching Job-to-be-Done:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.jobs.find(job => job.isOverarching)?.description || 'Not defined'}
                    </p>
                  </div>

                  {/* Supporting Jobs */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Key Supporting Jobs:
                    </h5>
                    {workshopData.jobs.filter(job => job.selected && !job.isOverarching).length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.jobs
                          .filter(job => job.selected && !job.isOverarching)
                          .map((job, index) => (
                            <li key={index}>{job.description}</li>
                          ))}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No supporting jobs selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Refined Offer Concept */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0'
                }}>
                  3. Your Refined Offer Concept
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Offer Name */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Refined Idea/Offer Name:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.refinedIdea?.name || workshopData.offer?.name || 'Not defined'}
                    </p>
                  </div>

                  {/* Format */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Format:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.refinedIdea?.format || workshopData.offer?.format || 'Not defined'}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Core Value Proposition:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.refinedIdea?.description || workshopData.offer?.description || workshopData.bigIdea?.description || 'Not defined'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Your Reflections & Action Plan */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '24px 0 16px 0'
            }}>
              Your Reflections & Action Plan
            </h3>

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Key Insights & Learnings */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <label
                    htmlFor="key-insights"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      display: 'block'
                    }}
                  >
                    1. My Key Insights & Learnings from this Workshop:
                  </label>
                  <div title="What were your biggest 'aha!' moments? What did you learn about your potential customers, the problems they face, or how your offer can uniquely help?">
                    <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
                  </div>
                </div>

                {isGeneratingInsights ? (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Generating key insights based on your workshop journey...
                  </div>
                ) : (
                  <textarea
                    id="key-insights"
                    value={formData.keyInsights}
                    onChange={(e) => handleInputChange('keyInsights', e.target.value)}
                    placeholder="e.g., I realized my target market is much more specific than I initially thought. The pain points are more emotional than functional. The trigger events show that timing is crucial for my marketing."
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      backgroundColor: '#f8fafc',
                    }}
                  />
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <SaveIndicator saving={isSaving} />
                </div>
              </div>

              {/* Actionable Next Steps */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <label
                    htmlFor="next-steps"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      display: 'block'
                    }}
                  >
                    2. My Actionable Next Steps (Focus on Validation First!):
                  </label>
                  <div title="What specific, small actions will you take in the next 7, 30, and 90 days to validate your refined offer idea with your target market before building anything major?">
                    <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
                  </div>
                </div>

                {isGeneratingNextSteps ? (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Generating actionable next steps for validating your offer...
                  </div>
                ) : (
                  <textarea
                    id="next-steps"
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                    placeholder="e.g., 1. Conduct 5 problem validation interviews with [target buyers] in the next 7 days. 2. Create a simple landing page describing my solution and collect email sign-ups. 3. Analyze 3 competing solutions to identify gaps."
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      backgroundColor: '#f8fafc',
                    }}
                  />
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <SaveIndicator saving={isSaving} />
                </div>
              </div>

              {/* Final Personal Reflection */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <label
                    htmlFor="personal-reflection"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      display: 'block'
                    }}
                  >
                    3. My Overall Reflection & Biggest Takeaway:
                  </label>
                  <div title="What's the one core idea or feeling you're taking away from this workshop that will guide your next moves?">
                    <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
                  </div>
                </div>

                <textarea
                  id="personal-reflection"
                  value={formData.personalReflection}
                  onChange={(e) => handleInputChange('personalReflection', e.target.value)}
                  placeholder="e.g., My biggest takeaway is that I need to focus on solving one specific problem for one specific type of customer at one specific moment, rather than trying to be everything to everyone."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    backgroundColor: '#f8fafc',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <SaveIndicator saving={isSaving} />
                </div>
              </div>
            </div>
          </div>

          {/* Download Summary */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <Button
              onClick={downloadPdfSummary}
              variant="yellow"
              size="lg"
              rightIcon={<FileText size={16} />}
              disabled={isExporting}
            >
              {isExporting ? 'Generating PDF...' : 'Download Workshop Summary (PDF)'}
            </Button>
          </div>

          {/* Example */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd',
            marginTop: '32px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#0369a1',
              margin: '0 0 12px 0'
            }}>
              EXAMPLE
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0369a1',
                  margin: '0 0 8px 0'
                }}>
                  Key Insights & Learnings:
                </h4>
                <ul style={{
                  listStyle: 'disc',
                  paddingLeft: '24px',
                  color: '#0369a1',
                  fontSize: '14px',
                  margin: '0'
                }}>
                  <li>I realized my target market is much more specific than I initially thought - focusing on marketing consultants at a specific revenue ceiling rather than all service providers.</li>
                  <li>The pain points are more emotional than functional - the fear of unpredictable income and missing family events resonated more than just "working too many hours".</li>
                  <li>Trigger events show that timing is crucial - reaching people right after they've lost a major client or turned down work due to capacity constraints.</li>
                  <li>My offer needs to emphasize both the practical systems AND the emotional benefits of stability and work-life balance.</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0369a1',
                  margin: '0 0 8px 0'
                }}>
                  Actionable Next Steps:
                </h4>
                <ol style={{
                  paddingLeft: '24px',
                  color: '#0369a1',
                  fontSize: '14px',
                  margin: '0'
                }}>
                  <li><strong>Problem Validation Interviews (Next 7-10 days):</strong> Talk to 5 marketing consultants who've recently lost a client or turned down work. Focus on understanding their capacity challenges, emotional impact, and what solutions they've tried. <em>This confirms I'm solving a real, painful problem.</em></li>
                  <li><strong>Solution Concept Testing (Next 2 weeks):</strong> Create a simple 1-page description of my "Marketing Systems Accelerator" program and share it with 5-7 potential customers. Ask what resonates, what's confusing, and if they'd be willing to pay my target price. <em>This tests my core messaging and value proposition.</em></li>
                  <li><strong>Competitor Analysis (Next 5 days):</strong> Identify 3-5 existing alternatives marketing consultants might use to solve capacity issues. Study their messaging, pricing, and customer reviews to understand gaps I could fill. <em>This helps refine my unique selling proposition.</em></li>
                  <li><strong>"Smoke Test" Landing Page (Next 2-3 weeks):</strong> Create a simple landing page describing my offer with a sign-up form for "early access pricing." Run minimal LinkedIn ads targeting marketing consultants to gauge interest via email sign-ups. <em>This is a low-cost way to test market interest.</em></li>
                </ol>
              </div>

              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0369a1',
                  margin: '0 0 8px 0'
                }}>
                  Overall Reflection:
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#0369a1',
                  margin: '0'
                }}>
                  My biggest takeaway is that I need to focus on solving one specific problem (scaling without working more hours) for one specific type of customer (marketing consultants hitting a revenue ceiling) at one specific moment (after losing a client or turning down work), rather than trying to be everything to everyone. This clarity will make my marketing more effective and my offer more compelling.
                </p>
              </div>
            </div>
          </div>

          {/* What's Next? */}
          <div style={styles.yellowInfoBoxStyle}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#222222',
              margin: '0 0 12px 0'
            }}>
              What's Next?
            </h3>

            <p style={{
              fontSize: '14px',
              margin: '0 0 16px 0'
            }}>
              Now that you have a refined offer idea and validation plan, it's time to test your concept with real potential buyers before building anything major. Remember, the goal is to validate your assumptions about the problem, solution, and market fit before investing significant time and resources.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="default"
                size="lg"
                rightIcon={<ExternalLink size={16} />}
                onClick={() => window.open('https://customercamp.co', '_blank')}
              >
                Learn More About CustomerCamp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};