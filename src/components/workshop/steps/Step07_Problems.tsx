import React, { useState, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Problem } from '../../../types/workshop';
import { AlertCircle, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectProblems = (state: WorkshopStore) => state.workshopData.problems || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step07_Problems: React.FC = () => {
  const problems = useWorkshopStore(selectProblems);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const [newProblem, setNewProblem] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddProblem = useCallback(() => {
    if (!newProblem.trim()) return;

    const problem: Problem = {
      id: Date.now().toString(),
      description: newProblem.trim(),
      ranking: problems.length + 1,
      selected: false
    };

    setIsSaving(true);
    updateWorkshopData({
      problems: [...problems, problem]
    });
    setNewProblem('');
    setTimeout(() => setIsSaving(false), 500);
  }, [newProblem, problems, updateWorkshopData]);

  const handleDeleteProblem = useCallback((id: string) => {
    setIsSaving(true);
    updateWorkshopData({
      problems: problems.filter(p => p.id !== id)
    });
    setTimeout(() => setIsSaving(false), 500);
  }, [problems, updateWorkshopData]);

  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    
    setIsSaving(true);
    const newProblems = [...problems];
    [newProblems[index - 1], newProblems[index]] = [newProblems[index], newProblems[index - 1]];
    
    // Update rankings
    newProblems.forEach((p, i) => {
      p.ranking = i + 1;
    });

    updateWorkshopData({ problems: newProblems });
    setTimeout(() => setIsSaving(false), 500);
  }, [problems, updateWorkshopData]);

  const handleMoveDown = useCallback((index: number) => {
    if (index >= problems.length - 1) return;
    
    setIsSaving(true);
    const newProblems = [...problems];
    [newProblems[index], newProblems[index + 1]] = [newProblems[index + 1], newProblems[index]];
    
    // Update rankings
    newProblems.forEach((p, i) => {
      p.ranking = i + 1;
    });

    updateWorkshopData({ problems: newProblems });
    setTimeout(() => setIsSaving(false), 500);
  }, [problems, updateWorkshopData]);

  const handleToggleSelect = useCallback((id: string) => {
    setIsSaving(true);
    updateWorkshopData({
      problems: problems.map(p => 
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    });
    setTimeout(() => setIsSaving(false), 500);
  }, [problems, updateWorkshopData]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={7}
        title="Identify Key Problems"
        description="What specific problems or pain points does your target market experience?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
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
            {problems.map((problem, index) => (
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
                    disabled={index === problems.length - 1}
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

            {problems.length === 0 && (
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