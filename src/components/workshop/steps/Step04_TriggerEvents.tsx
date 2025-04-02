import { useState } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { TextArea } from '../../shared/TextArea';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import type { TriggerEvent } from '../../../types/workshop';

export const Step04_TriggerEvents = () => {
  const { workshopData, updateWorkshopData } = useWorkshopStore();
  const [newEvent, setNewEvent] = useState('');
  const triggerEvents = workshopData?.triggerEvents || [];

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    
    const event: TriggerEvent = {
      id: Date.now().toString(),
      description: newEvent.trim(),
      source: 'user'
    };

    updateWorkshopData({
      triggerEvents: [...triggerEvents, event]
    });
    setNewEvent('');
  };

  const handleRemoveEvent = (id: string) => {
    updateWorkshopData({
      triggerEvents: triggerEvents.filter(event => event.id !== id)
    });
  };

  const handleSuggestionAccept = (suggestion: any) => {
    if (Array.isArray(suggestion.triggerEvents)) {
      updateWorkshopData({
        triggerEvents: [
          ...triggerEvents,
          ...suggestion.triggerEvents
        ]
      });
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Identify Trigger Events"
        description="What causes your potential customers to start looking for a solution?"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="prose prose-slate max-w-none space-y-8">
          <p className="text-lg">
            Trigger events are specific moments or situations that cause someone to start looking for
            a solution. Understanding these moments helps you identify when and how to reach your
            market effectively.
          </p>

          <Card>
            <div className="space-y-6">
              <TextArea
                label="Add a Trigger Event"
                description="Describe a specific situation or moment that would cause someone to look for a solution."
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Example: A freelancer loses a major client and realizes they need to diversify their income..."
              />
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Event
              </button>
            </div>
          </Card>

          {triggerEvents.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Trigger Events</h3>
              <div className="space-y-4">
                {triggerEvents.map((event) => (
                  <Card key={event.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: {event.source === 'user' ? 'You' : 'AI Assistant'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(event.id)}
                      className="ml-4 p-2 text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-secondary/50">
            <h4 className="text-lg font-semibold mb-3">Tips for Identifying Trigger Events</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Think about moments of frustration or crisis</li>
              <li>Consider changes in business or personal circumstances</li>
              <li>Look for patterns in when people seek solutions</li>
              <li>Include both positive and negative triggers</li>
              <li>Focus on specific moments, not general situations</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-8">
          <ChatInterface
            step={4}
            stepContext="identifying trigger events that cause potential customers to seek solutions"
            questions={STEP_QUESTIONS[4]}
            onSuggestionAccept={handleSuggestionAccept}
          />
          
          <Card className="bg-primary/10 p-4">
            <h4 className="font-semibold mb-2">How the AI Assistant Can Help</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Brainstorm industry-specific trigger events</li>
              <li>Analyze patterns in customer behavior</li>
              <li>Suggest trigger events based on your market</li>
              <li>Help identify emotional and practical triggers</li>
              <li>Provide examples from similar industries</li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Understanding trigger events will help you identify the best timing and context for
          presenting your offer to potential customers.
        </p>
      </div>
    </div>
  );
}; 