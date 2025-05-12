import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TriggerEvent } from '../../../types/workshop';
import { Plus, X } from 'lucide-react';
import * as styles from '../../../styles/stepStyles';
import { InfoBox } from '../../ui/InfoBox';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';


// Separate selectors to prevent unnecessary re-renders
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectWorkshopData = (state: WorkshopStore) => state.workshopData;


export const Step03_TriggerEvents: React.FC = () => {
  const storeEvents = useWorkshopStore(selectTriggerEvents);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const workshopData = useWorkshopStore(selectWorkshopData);

  // Use local state for the events
  const [events, setEvents] = useState<TriggerEvent[]>(storeEvents);
  const [newEvent, setNewEvent] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
          3
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Identify Trigger Events
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>Let's explore the specific moments in your prospective buyer's life that might trigger them to realize they need a solution like yours. These trigger events provide clues about what your customers really want to get done.</p>
        <p>Trigger events can be:</p>
        <ul style={{ paddingLeft: '20px', margin: '10px 0', listStyleType: 'disc' }}>
          <li style={{ marginBottom: '5px', display: 'list-item' }}>Situational (eg. losing a client, getting divorced, hiring a new team member, etc.)</li>
          <li style={{ marginBottom: '5px', display: 'list-item' }}>Physical (eg. being cold, hip pain, etc.)</li>
          <li style={{ marginBottom: '5px', display: 'list-item' }}>Social (eg. feeling embarrassed, a fight with a colleague)</li>
          <li style={{ marginBottom: '5px', display: 'list-item' }}>Internal/emotional (eg. feeling overwhelmed, being bored, etc.)</li>
        </ul>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <InfoBox>
          Focus on the *moment* that triggered them to begin the buying journey.
        </InfoBox>

        {/* Context from previous steps */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginTop: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Your Context
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Your Big Idea:</p>
            <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
              {workshopData.bigIdea?.description || "Not specified yet"}
            </div>
          </div>
        </div>

        {/* Sparky Chat Button */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px', textAlign: 'center' }}>
            Your trusty pal Sparky is here to help you brainstorm buying triggers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ChatWithSparkyButton
              exerciseKey="triggerBrainstorm"
              exerciseTitle="Brainstorm Buying Triggers"
              initialContext={{
                triggers: events.map(event => event.description),
                userV1BigIdea: workshopData.bigIdea?.description || '',
                currentUserSolution: '',
                pastBuyerPushPoints: '',
                additionalNewOfferContext: ''
              }}
              systemPromptKey="TRIGGER_BRAINSTORM_PROMPT"
            />
          </div>
        </div>

        {/* List of existing events */}
        {events.length > 0 && (
          <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#F2F2F2',
                  borderRadius: '15px',
                  border: '1px solid #DDDDDD',
                }}
              >
                <span style={{ flex: 1, color: '#333333' }}>{event.description}</span>
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
        <div style={styles.formGroupStyle}>
          <label
            htmlFor="newTriggerEvent"
            style={styles.labelStyle}
          >
            What might trigger someone to need a solution like yours?
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              id="newTriggerEvent"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Lost a major client and realized need for stable income."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '15px',
                border: '1px solid #DDDDDD',
                fontSize: '14px',
                backgroundColor: '#F2F2F2',
                color: '#333333',
              }}
            />
            <Button
              variant="primary"
              onClick={handleAddEvent}
              disabled={!newEvent.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fcf720',
                color: '#222222',
                borderRadius: '15px',
              }}
            >
              <Plus size={20} />
              Add
            </Button>
          </div>
        </div>

        {/* Example trigger events */}
        {events.length === 0 && (
          <div style={{
            backgroundColor: '#F0E6FF', // Purple background
            borderRadius: '15px',
            padding: '20px'
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
              EXAMPLES
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#333333',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Hit a revenue plateau in business and feel stuck
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Missed family event due to work
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Spent weeks working on a new offer, launched it, and it didn't sell as hoped
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Rejected for promotion due to skills gap
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Team doubled in size in 3 months
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Received negative feedback about leadership style
              </li>
              <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                Missed quarterly targets for the first time
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                New competitor entered the market with better features
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};