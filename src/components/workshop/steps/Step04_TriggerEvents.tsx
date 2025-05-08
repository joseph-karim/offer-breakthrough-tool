import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TriggerEvent } from '../../../types/workshop';
import { Info, Plus, X } from 'lucide-react';
import * as styles from '../../../styles/stepStyles';


// Separate selectors to prevent unnecessary re-renders
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;


export const Step04_TriggerEvents: React.FC = () => {
  const storeEvents = useWorkshopStore(selectTriggerEvents);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

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
        alignItems: 'center',
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
          position: 'relative',
          top: '4px'
        }}>
          3
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0,
          lineHeight: '1'
        }}>
          Identify Trigger Events
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Let's explore the specific moments in your prospective buyer's life that might trigger them to realize they need a solution like yours. These trigger events provide clues about what your customers really want to get done.</p>
        <p>Trigger events can be:<br />
        Situational (eg. losing a client, getting divorced, hiring a new team member, etc.)<br />
        Physical (eg. being cold, hip pain, etc.)<br /> 
        Social (eg. feeling embarrassed, a fight with a colleague)<br />
        Internal/emotional (eg. feeling overwhelmed, being bored, etc.)</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={styles.yellowInfoBoxStyle}>
          <p style={{ margin: 0 }}>Focus on the *moment* that triggered them to begin the buying journey.</p>
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