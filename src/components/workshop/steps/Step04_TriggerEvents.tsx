import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TriggerEvent } from '../../../types/workshop';
import { Info, Plus, X, MessageSquare } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';

// Separate selectors to prevent unnecessary re-renders
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step04_TriggerEvents: React.FC = () => {
  const storeEvents = useWorkshopStore(selectTriggerEvents);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);

  // Use local state for the events
  const [events, setEvents] = useState<TriggerEvent[]>(storeEvents);
  const [newEvent, setNewEvent] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store value changes
  useEffect(() => {
    setEvents(storeEvents);
  }, [storeEvents]);

  const handleAddEvent = useCallback(() => {
    if (newEvent.trim() !== '') {
      const event: TriggerEvent = {
        id: `user-${Date.now()}`,
        description: newEvent.trim(),
        source: 'user'
      };
      
      setEvents(prev => [...prev, event]);
      setNewEvent(''); // Clear input
      updateWorkshopData({ triggerEvents: [...events, event] });
    }
  }, [newEvent, events, updateWorkshopData]);

  const handleDeleteEvent = useCallback((id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    updateWorkshopData({ triggerEvents: updatedEvents });
  }, [events, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddEvent();
    }
  }, [handleAddEvent]);
  
  // Generate step context for AI
  const stepContext = `
    Workshop Step: Trigger Events
    
    Trigger events are specific moments when potential customers realize they need a solution.
    
    Current trigger events:
    ${events.map(event => `- ${event.description}`).join('\n')}
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={4}
        title="Identify Trigger Events"
        description="What specific events or situations cause someone to actively seek a solution like yours?"
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
            step={4}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[4] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(4)}
          />
        </Card>
      )}
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#eef2ff',
            borderLeft: '4px solid #4f46e5',
            borderRadius: '0 8px 8px 0',
            color: '#3730a3',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#4f46e5' }} />
            Focus on the *moment* of change. What just happened that made them realize they need help NOW?
          </div>

          {/* List of existing events */}
          {events.length > 0 && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {events.map(event => (
                <div 
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ flex: 1, color: '#374151' }}>{event.description}</span>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    onMouseEnter={() => setHoveredId(event.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      padding: '4px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: hoveredId === event.id ? '#ef4444' : '#6b7280',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new event input */}
          <div>
            <label 
              htmlFor="newTriggerEvent"
              style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}
            >
              Add Trigger Event:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="newTriggerEvent"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Just got promoted to manager"
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
                onClick={handleAddEvent}
                disabled={!newEvent.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={20} />
                Add
              </Button>
            </div>
          </div>

          {/* Example trigger events */}
          {events.length === 0 && (
            <div style={{ 
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #d1d5db'
            }}>
              <p style={{ 
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic',
                marginBottom: '12px'
              }}>
                Example trigger events:
              </p>
              <ul style={{ 
                listStyle: 'disc',
                paddingLeft: '24px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <li>Lost a major client due to poor reporting</li>
                <li>Team doubled in size in 3 months</li>
                <li>Received negative feedback about leadership style</li>
                <li>Missed quarterly targets for the first time</li>
                <li>New competitor entered the market with better features</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};