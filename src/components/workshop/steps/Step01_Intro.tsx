export const Step01_Intro = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Welcome to the Offer Breakthrough Workshop</h2>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          This interactive workshop will guide you through the process of uncovering profitable problems
          and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
        </p>

        <h3 className="text-xl font-semibold mt-8">What You'll Achieve</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify and avoid common pitfalls in offer creation</li>
          <li>Discover trigger events that drive buying decisions</li>
          <li>Understand the jobs your customers need done</li>
          <li>Find profitable target markets</li>
          <li>Uncover high-value problems worth solving</li>
          <li>Design a scalable offer that resonates with your market</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">How It Works</h3>
        <p>
          You'll progress through 10 steps, each building on the previous one. Our AI-powered bots will
          help you brainstorm and analyze at key points in the process.
        </p>

        <div className="bg-secondary/50 p-6 rounded-lg mt-8">
          <h4 className="text-lg font-semibold">Before You Begin</h4>
          <p>
            Take a moment to reflect on your current business and what you hope to achieve with your new
            offer. The more thoughtful you are in each step, the better your results will be.
          </p>
        </div>
      </div>

      <div className="border-t pt-6 mt-8">
        <p className="text-muted-foreground">
          Ready to get started? Click the "Next" button below to begin your journey to offer
          breakthrough.
        </p>
      </div>
    </div>
  );
}; 