export const Step02_MarketDemand = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Understanding Market Demand</h2>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          Before diving into specific markets and problems, it's crucial to understand what drives
          demand in your industry. This foundation will help you make better decisions throughout the
          workshop.
        </p>

        <h3 className="text-xl font-semibold mt-8">Key Market Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-card p-6 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">Pain Points</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Urgent problems needing solutions</li>
              <li>Frustrations with current options</li>
              <li>Gaps in the market</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">Buying Signals</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Active search for solutions</li>
              <li>Budget allocation</li>
              <li>Timing of purchases</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">Market Dynamics</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Industry trends</li>
              <li>Competitive landscape</li>
              <li>Market maturity</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">Customer Behavior</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decision-making process</li>
              <li>Information sources</li>
              <li>Purchase timing</li>
            </ul>
          </div>
        </div>

        <div className="bg-secondary/50 p-6 rounded-lg mt-8">
          <h4 className="text-lg font-semibold">Reflection Questions</h4>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>What problems do you consistently see in your industry?</li>
            <li>How do customers currently solve these problems?</li>
            <li>What triggers someone to look for a solution?</li>
            <li>What makes timing critical in your market?</li>
          </ul>
        </div>
      </div>

      <div className="border-t pt-6 mt-8">
        <p className="text-muted-foreground">
          Keep these market dynamics in mind as we move forward. They'll help inform your decisions
          about target markets and offer design.
        </p>
      </div>
    </div>
  );
}; 