import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { TextArea } from '../../shared/TextArea';
import type { AntiGoals } from '../../../types/workshop';

export const Step03_AntiGoals = () => {
  const { workshopData, updateWorkshopData } = useWorkshopStore();
  const antiGoals = workshopData?.antiGoals || {
    market: '',
    offer: '',
    delivery: '',
    lifestyle: '',
    values: '',
  };

  const handleChange = (field: keyof AntiGoals) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateWorkshopData({
      antiGoals: {
        ...antiGoals,
        [field]: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Set Your Anti-Goals"
        description="Define what you don't want to help avoid creating an offer that conflicts with your values and desired lifestyle."
      />

      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          Anti-goals are just as important as your positive goals. They help you avoid paths that might
          lead to success but would make you miserable. Take time to think about what you definitely
          don't want in your business.
        </p>

        <Card className="mt-8">
          <div className="space-y-8">
            <TextArea
              label="Market Anti-Goals"
              description="What types of markets or customers do you want to avoid working with?"
              value={antiGoals.market}
              onChange={handleChange('market')}
              placeholder="Example: Markets that require 24/7 availability, customers who consistently demand discounts..."
            />

            <TextArea
              label="Offer Anti-Goals"
              description="What types of products or services do you want to avoid offering?"
              value={antiGoals.offer}
              onChange={handleChange('offer')}
              placeholder="Example: Products that require constant updates, services with high liability risks..."
            />

            <TextArea
              label="Delivery Anti-Goals"
              description="What delivery or fulfillment methods do you want to avoid?"
              value={antiGoals.delivery}
              onChange={handleChange('delivery')}
              placeholder="Example: Services that require in-person delivery, products that need complex shipping..."
            />

            <TextArea
              label="Lifestyle Anti-Goals"
              description="What impact on your lifestyle do you want to avoid?"
              value={antiGoals.lifestyle}
              onChange={handleChange('lifestyle')}
              placeholder="Example: Work schedules that interfere with family time, constant travel requirements..."
            />

            <TextArea
              label="Values Anti-Goals"
              description="What would compromise your values or ethics?"
              value={antiGoals.values}
              onChange={handleChange('values')}
              placeholder="Example: Business practices that harm the environment, misleading marketing tactics..."
            />
          </div>
        </Card>

        <Card className="bg-secondary/50 mt-8">
          <h4 className="text-lg font-semibold mb-3">Tips for Setting Anti-Goals</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be specific about what you want to avoid</li>
            <li>Consider past experiences that you don't want to repeat</li>
            <li>Think about what drains your energy or causes stress</li>
            <li>Include both practical and ethical considerations</li>
            <li>Focus on what's truly important to you, not others' expectations</li>
          </ul>
        </Card>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Your anti-goals will serve as guardrails throughout the workshop, helping you design an offer
          that aligns with your values and desired lifestyle.
        </p>
      </div>
    </div>
  );
}; 