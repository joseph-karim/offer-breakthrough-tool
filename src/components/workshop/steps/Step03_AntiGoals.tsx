import { useWorkshopStore } from '../../../store/workshopStore';
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Set Your Anti-Goals</h2>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          Before defining what you want, it's important to be clear about what you don't want. Anti-goals
          help you avoid creating an offer that conflicts with your values and desired lifestyle.
        </p>

        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-lg font-semibold mb-2">Market Anti-Goals</label>
            <p className="text-muted-foreground mb-3">
              What types of markets or customers do you want to avoid working with?
            </p>
            <textarea
              value={antiGoals.market}
              onChange={handleChange('market')}
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              placeholder="Example: Markets that require 24/7 availability..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Offer Anti-Goals</label>
            <p className="text-muted-foreground mb-3">
              What types of products or services do you want to avoid offering?
            </p>
            <textarea
              value={antiGoals.offer}
              onChange={handleChange('offer')}
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              placeholder="Example: Products that require constant updates..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Delivery Anti-Goals</label>
            <p className="text-muted-foreground mb-3">
              What delivery or fulfillment methods do you want to avoid?
            </p>
            <textarea
              value={antiGoals.delivery}
              onChange={handleChange('delivery')}
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              placeholder="Example: Services that require in-person delivery..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Lifestyle Anti-Goals</label>
            <p className="text-muted-foreground mb-3">
              What impact on your lifestyle do you want to avoid?
            </p>
            <textarea
              value={antiGoals.lifestyle}
              onChange={handleChange('lifestyle')}
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              placeholder="Example: Work schedules that interfere with family time..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Values Anti-Goals</label>
            <p className="text-muted-foreground mb-3">
              What would compromise your values or ethics?
            </p>
            <textarea
              value={antiGoals.values}
              onChange={handleChange('values')}
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              placeholder="Example: Business practices that harm the environment..."
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-8">
        <p className="text-muted-foreground">
          Your anti-goals will serve as guardrails throughout the workshop, helping you design an offer
          that aligns with your values and desired lifestyle.
        </p>
      </div>
    </div>
  );
}; 