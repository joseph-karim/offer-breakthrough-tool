import React, { useCallback, useState } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { HelpCircle, ExternalLink, FileText } from 'lucide-react';
import { exportWorkshopToPdf } from '../../../utils/pdfExporter';
import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectWorkshopData = (state: WorkshopStore) => state.workshopData;


export const Step10_Summary: React.FC = () => {
  const workshopData = useWorkshopStore(selectWorkshopData);
  const [isExporting, setIsExporting] = useState(false);

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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={10}
        title="Workshop Summary"
        description="Review your journey and plan your next steps"
      />

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #22c55e',
            borderRadius: '0 8px 8px 0',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#22c55e' }} />
            Congratulations on completing the Buyer Breakthrough Workshop! Here's a summary of your journey.
          </div>

          {/* Workshop Journey */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Your Workshop Journey
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Initial vs Refined Idea */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      Initial Big Idea
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0 0 8px 0'
                    }}>
                      {workshopData.bigIdea?.description || 'Not defined'}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      fontStyle: 'italic',
                      margin: '0'
                    }}>
                      Target customers: {workshopData.bigIdea?.targetCustomers || 'None specified'}
                    </p>
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: '0 0 8px 0'
                    }}>
                      Refined Big Idea
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0 0 8px 0'
                    }}>
                      {workshopData.refinedIdea?.description || 'Not defined'}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      fontStyle: 'italic',
                      margin: '0'
                    }}>
                      Target customers: {workshopData.refinedIdea?.targetCustomers || 'None specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
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
                  Key Insights
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Underlying Goal */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Underlying Goal:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.underlyingGoal?.businessGoal || 'Not defined'}
                    </p>
                  </div>

                  {/* Trigger Events */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Key Trigger Events:
                    </h5>
                    {workshopData.triggerEvents.length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.triggerEvents.slice(0, 3).map((event, index) => (
                          <li key={index}>{event.description}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No trigger events defined
                      </p>
                    )}
                  </div>

                  {/* Jobs */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Key Jobs to be Done:
                    </h5>
                    {workshopData.jobs.length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.jobs.slice(0, 3).map((job, index) => (
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
                        No jobs defined
                      </p>
                    )}
                  </div>

                  {/* Target Buyers */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Selected Target Buyers:
                    </h5>
                    {workshopData.targetBuyers.filter(buyer =>
                      buyer.selected || workshopData.problemUp?.selectedBuyers.includes(buyer.id)
                    ).length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.targetBuyers
                          .filter(buyer => buyer.selected || workshopData.problemUp?.selectedBuyers.includes(buyer.id))
                          .map((buyer, index) => (
                            <li key={index}>{buyer.description}</li>
                          ))}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No target buyers selected
                      </p>
                    )}
                  </div>

                  {/* Key Pains */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Selected Painful Problems:
                    </h5>
                    {workshopData.pains.filter(pain =>
                      workshopData.problemUp?.selectedPains.includes(pain.id)
                    ).length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.pains
                          .filter(pain => workshopData.problemUp?.selectedPains.includes(pain.id))
                          .map((pain, index) => (
                            <li key={index}>{pain.description}</li>
                          ))}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>
                        No pains selected
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
                      Target Moment:
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

              {/* Reflections */}
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
                  Reflections & Next Steps
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Key Insights */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Key Insights:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-line'
                    }}>
                      {workshopData.reflections?.keyInsights || 'No insights recorded'}
                    </p>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Next Steps:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-line'
                    }}>
                      {workshopData.reflections?.nextSteps || 'No next steps recorded'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Summary */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
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

          {/* Next Steps */}
          <div style={{
            padding: '16px',
            backgroundColor: '#fffbeb',
            borderRadius: '8px',
            border: '1px solid #fbbf24',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#92400e',
              margin: '0 0 12px 0'
            }}>
              What's Next?
            </h3>

            <p style={{
              fontSize: '14px',
              color: '#92400e',
              margin: '0 0 16px 0'
            }}>
              Now that you have a refined offer idea, it's time to test it with real buyers. The best way to do this is to pre-sell your offer before building it.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="default"
                size="lg"
                rightIcon={<ExternalLink size={16} />}
                onClick={() => window.open('https://example.com/painkiller', '_blank')}
              >
                Learn More About PAINKILLER
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
