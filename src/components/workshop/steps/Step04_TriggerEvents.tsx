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
      <div style={styles.stepHeaderContainerStyle}>
        <div style={styles.stepNumberStyle}>
          4
        </div>
        <h2 style={styles.stepTitleStyle}>
          Identify Trigger Events
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>What specific events or situations cause someone to actively seek a solution like yours?</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={styles.infoBoxStyle}>
          <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#ea580c' }} />
          Focus on the *moment* of change. What just happened that made them realize they need help NOW?
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
                  backgroundColor: '#F0F9FF',
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
            Add Trigger Event:
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              id="newTriggerEvent"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Just got promoted to manager"
              style={styles.inputStyle}
            />
            <Button
              variant="primary"
              onClick={handleAddEvent}
              disabled={!newEvent.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFDD00', color: '#222222' }}
            >
              <Plus size={20} />
              Add
            </Button>
          </div>
        </div>

        {/* Example trigger events */}
        {events.length === 0 && (
          <div style={styles.examplesContainerStyle}>
            <div style={styles.examplesLabelStyle}>
              EXAMPLES
            </div>
            <ul style={styles.examplesListStyle}>
              <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Lost a major client due to poor reporting
              </li>
              <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Team doubled in size in 3 months
              </li>
              <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Received negative feedback about leadership style
              </li>
              <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                Missed quarterly targets for the first time
              </li>
              <li style={styles.exampleItemStyle}>
                <span style={styles.exampleBulletStyle}>•</span>
                New competitor entered the market with better features
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
