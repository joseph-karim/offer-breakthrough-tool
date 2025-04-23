import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Problem } from '../../../types/workshop';
import { AlertCircle, Plus, X, ChevronUp, ChevronDown, MessageSquare, CheckCircle, Lightbulb } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';

// Separate selectors to prevent unnecessary re-renders
const selectProblems = (state: WorkshopStore) => state.workshopData.problems || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step07_Problems: React.FC = () => {
  const storeProblems = useWorkshopStore(selectProblems);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);

  // Local state
  const [localProblems, setLocalProblems] = useState(storeProblems);
  const [newProblem, setNewProblem] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'A' | 'B'>('A'); // A = Product-First, B = Problem-First
  const saveTimerRef = useRef<number | null>(null);

  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store values change
  useEffect(() => {
    setLocalProblems(storeProblems);
  }, [storeProblems]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const saveToStore = useCallback((problems: Problem[]) => {
    setIsSaving(true);
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      updateWorkshopData({ problems });
      setIsSaving(false);
    }, 500);
  }, [updateWorkshopData]);

  const handleAddProblem = useCallback(() => {
    if (!newProblem.trim()) return;

    const problem: Problem = {
      id: Date.now().toString(),
      description: newProblem.trim(),
      ranking: localProblems.length + 1,
      selected: false
    };

    const updatedProblems = [...localProblems, problem];
    setLocalProblems(updatedProblems);
    setNewProblem('');
    saveToStore(updatedProblems);
  }, [newProblem, localProblems, saveToStore]);

  const handleDeleteProblem = useCallback((id: string) => {
    const updatedProblems = localProblems.filter((p: Problem) => p.id !== id);
    setLocalProblems(updatedProblems);
    saveToStore(updatedProblems);
  }, [localProblems, saveToStore]);

  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;

    const newProblems = [...localProblems];
    [newProblems[index - 1], newProblems[index]] = [newProblems[index], newProblems[index - 1]];

    // Update rankings
    newProblems.forEach((p: Problem, i: number) => {
      p.ranking = i + 1;
    });

    setLocalProblems(newProblems);
    saveToStore(newProblems);
  }, [localProblems, saveToStore]);

  const handleMoveDown = useCallback((index: number) => {
    if (index >= localProblems.length - 1) return;

    const newProblems = [...localProblems];
    [newProblems[index], newProblems[index + 1]] = [newProblems[index + 1], newProblems[index]];

    // Update rankings
    newProblems.forEach((p: Problem, i: number) => {
      p.ranking = i + 1;
    });

    setLocalProblems(newProblems);
    saveToStore(newProblems);
  }, [localProblems, saveToStore]);

  const handleToggleSelect = useCallback((id: string) => {
    const updatedProblems = localProblems.map((p: Problem) =>
      p.id === id ? { ...p, selected: !p.selected } : p
    );
    setLocalProblems(updatedProblems);
    saveToStore(updatedProblems);
  }, [localProblems, saveToStore]);

  // Generate step context for AI
  const stepContext = `
    Workshop Step: Key Problems

    Problems are the obstacles, pain points, or frustrations that prevent customers from accomplishing their jobs to be done.

    Current problems:
    ${localProblems.map((problem: Problem) => `- ${problem.description}`).join('\n')}
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={7}
        title="Match Problems to Solutions"
        description="Identify your unique capabilities and match them to your customers' key problems"
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
            step={7}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[7] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(7)}
          />
        </Card>
      )}

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Path Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              Choose Your Path
            </h3>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setSelectedPath('A')}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: selectedPath === 'A' ? '#3b82f6' : '#e5e7eb',
                  backgroundColor: selectedPath === 'A' ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: selectedPath === 'A' ? '#1e40af' : '#374151'
                }}>
                  Path A: Product-First
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  You already have a clear idea of what your productized service could be
                </span>
              </button>

              <button
                onClick={() => setSelectedPath('B')}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: selectedPath === 'B' ? '#3b82f6' : '#e5e7eb',
                  backgroundColor: selectedPath === 'B' ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: selectedPath === 'B' ? '#1e40af' : '#374151'
                }}>
                  Path B: Problem-First
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  You want to identify high-value problems first, then design your solution
                </span>
              </button>
            </div>
          </div>

          {/* 5A: Capability Inventory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              5A: Capability Inventory
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              List your unique capabilities, systems, frameworks, and methods that set you apart:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Example Capabilities:</p>
              <ul style={{
                margin: '0',
                paddingLeft: '16px',
                listStyleType: 'disc',
                color: '#334155',
                fontSize: '14px'
              }}>
                <li>System for creating email sequences that combine nurturing and selling</li>
                <li>Methods for segmenting audiences for targeted campaigns</li>
                <li>Templates for quick content creation without sacrificing quality</li>
                <li>Frameworks for creating evergreen funnels that sell on autopilot</li>
                <li>Process for testing and optimizing email performance</li>
              </ul>
            </div>
          </div>

          {/* 5B: Solution-Problem Matching */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              5B: Solution-Problem Matching
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Match your capabilities (solutions) to specific customer problems:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e0f2fe'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#0369a1'
                    }}>
                      Your solution:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      Systematic approach to email marketing
                    </p>
                  </div>
                  <CheckCircle size={24} color="#0ea5e9" />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#9f1239'
                    }}>
                      Customer problem:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      The Overwhelmed Creator's lack of systems
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e0f2fe'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#0369a1'
                    }}>
                      Your solution:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      Conversion-focused templates
                    </p>
                  </div>
                  <CheckCircle size={24} color="#0ea5e9" />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#9f1239'
                    }}>
                      Customer problem:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      The Conversion Challenged's struggle with effective CTAs
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e0f2fe'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#0369a1'
                    }}>
                      Your solution:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      Evergreen funnel framework
                    </p>
                  </div>
                  <CheckCircle size={24} color="#0ea5e9" />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      color: '#9f1239'
                    }}>
                      Customer problem:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      The Revenue Rollercoaster's inconsistent income
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5C: Identifying Strongest Matches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              5C: Identifying Strongest Matches
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Identify which problem-solution matches offer the greatest opportunity:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              border: '1px solid #a7f3d0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <Lightbulb size={24} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#065f46',
                  fontStyle: 'italic'
                }}>
                  "I'm seeing that my skills are particularly well-suited to solving problems in the 'Revenue Rollercoaster' cluster. I have frameworks and systems that directly address predictable revenue generation."
                </p>
              </div>

              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#047857'
              }}>
                When you find a strong match between your unique capabilities and your customers' most pressing problems, you've identified a high-value opportunity for your productized service.
              </p>
            </div>
          </div>

          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fff1f2',
            borderLeft: '4px solid #e11d48',
            borderRadius: '0 8px 8px 0',
            color: '#9f1239',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#e11d48' }} />
            Focus on the most painful or urgent problems. What keeps your target market up at night?
          </div>

          {showErrors && localProblems.length === 0 && (
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
              Please add at least one problem to proceed
            </div>
          )}

          {/* Add new problem */}
          <div>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={newProblem}
                onChange={(e) => setNewProblem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddProblem();
                  }
                }}
                placeholder="Describe a specific problem or pain point..."
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                }}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleAddProblem}
                disabled={!newProblem.trim()}
                leftIcon={<Plus size={20} />}
              >
                Add
              </Button>
            </div>
          </div>

          {/* List of problems */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {localProblems.map((problem: Problem, index: number) => (
              <div
                key={problem.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: problem.selected ? '#f0fdf4' : '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: problem.selected ? '#86efac' : '#e5e7eb',
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    style={{ padding: '4px' }}
                  >
                    <ChevronUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === localProblems.length - 1}
                    style={{ padding: '4px' }}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#6b7280'
                    }}>
                      Problem #{problem.ranking}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    color: '#374151',
                    fontSize: '16px',
                    lineHeight: 1.5
                  }}>
                    {problem.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={problem.selected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleToggleSelect(problem.id)}
                  >
                    {problem.selected ? "Selected" : "Select"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProblem(problem.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {localProblems.length === 0 && (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #d1d5db',
              }}>
                No problems added yet. Add some key problems or pain points that your target market experiences.
              </div>
            )}
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
};