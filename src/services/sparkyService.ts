import { OpenAIService } from './openai';
import { WorkshopData } from '../types/workshop';

/**
 * Types for Sparky AI Chat
 */
export interface SparkyMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface SuggestionOption {
  id: string;
  content: string;
  type: string;
}

/**
 * SparkyService - Manages the Sparky AI Chat assistant throughout the workshop
 */
export class SparkyService {
  private openai: OpenAIService;
  private model: string;
  private useMockResponses: boolean;

  constructor(openaiService: OpenAIService, model: string = 'gpt-4.1-2025-04-14', useMockResponses: boolean = true) {
    this.openai = openaiService;
    this.model = model;
    this.useMockResponses = useMockResponses;
  }

  /**
   * Generate a response from Sparky based on the current step and context
   */
  async generateResponse(
    message: string,
    currentStep: number,
    workshopData: WorkshopData,
    chatHistory: SparkyMessage[]
  ): Promise<SparkyMessage> {
    try {
      // If using mock responses, generate a contextual response based on the step and message
      if (this.useMockResponses) {
        return this.generateMockResponse(message, currentStep, workshopData);
      }

      // Get the appropriate system prompt for the current step
      const systemPrompt = this.getSystemPromptForStep(currentStep, workshopData);

      // Format the chat history for the API
      const formattedHistory = this.formatChatHistory(chatHistory);

      // Add the user's new message
      formattedHistory.push({
        role: 'user',
        content: message
      });

      // Generate the response using the OpenAI service
      const response = await this.openai.chatCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedHistory
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      // Format the response as a SparkyMessage
      const assistantMessage: SparkyMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

      return assistantMessage;
    } catch (error) {
      console.error('Error generating Sparky response:', error);

      // Fall back to mock response if API fails
      return this.generateMockResponse(message, currentStep, workshopData);
    }
  }

  /**
   * Generate a mock response based on the current step and user message
   */
  private generateMockResponse(
    message: string,
    currentStep: number,
    workshopData: WorkshopData
  ): SparkyMessage {
    let responseContent = '';

    // Generate a contextual response based on the step
    switch (currentStep) {
      case 2: // Big Idea
        responseContent = this.getMockBigIdeaResponse(message, workshopData);
        break;
      case 3: // Underlying Goal
        responseContent = this.getMockUnderlyingGoalResponse(message, workshopData);
        break;
      case 4: // Trigger Events
        responseContent = this.getMockTriggerEventsResponse(message, workshopData);
        break;
      case 5: // Jobs
        responseContent = this.getMockJobsResponse(message, workshopData);
        break;
      case 6: // Target Buyers
        responseContent = this.getMockTargetBuyersResponse(message, workshopData);
        break;
      case 7: // Painstorming
        responseContent = this.getMockPainstormingResponse(message, workshopData);
        break;
      case 8: // Problem-Up
        responseContent = this.getMockProblemUpResponse(message, workshopData);
        break;
      case 9: // Refine Idea
        responseContent = this.getMockRefineIdeaResponse(message, workshopData);
        break;
      case 10: // Summary & Next Steps
        responseContent = this.getMockSummaryResponse(message, workshopData);
        break;
      default:
        responseContent = "I'm here to help with your workshop! What specific questions do you have about this step?";
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Mock response for Big Idea step
   */
  private getMockBigIdeaResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('example') || lowerMessage.includes('help') || lowerMessage.includes('suggestion')) {
      return "Here are some example Big Idea statements:\n\n1. A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.\n\n2. A template pack that helps consultants quickly create high-converting proposals.\n\n3. A productized service that provides SEO audits specifically for e-commerce stores.\n\nRemember to follow the format: '[What it is] + [What it helps customers do]'";
    }

    if (lowerMessage.includes('format') || lowerMessage.includes('structure')) {
      return "The Big Idea statement should follow this format: '[What it is] + [What it helps customers do]'\n\nFor example: 'A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.'\n\nThe first part describes the format/delivery method, and the second part describes the specific outcome for your customers.";
    }

    return "I'd be happy to help with your Big Idea statement! Remember to follow the format '[What it is] + [What it helps customers do]'. What specific aspect are you struggling with? I can provide examples or help refine what you have.";
  }

  /**
   * Mock response for Underlying Goal step
   */
  private getMockUnderlyingGoalResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('example') || lowerMessage.includes('goal') || lowerMessage.includes('suggestion')) {
      return "Here are some example business goals for your offer:\n\n1. Build a new revenue stream that generates $5k/month within 12 months, separate from client work.\n\n2. Create a lower-tier offer that acts as a feeder for your high-ticket consulting services.\n\n3. Replace 50% of your 1-on-1 service income with a more leveraged group program within 18 months.\n\n4. Develop an asset that generates passive income, requiring less than 5 hours/week maintenance after launch.";
    }

    if (lowerMessage.includes('constraint') || lowerMessage.includes('limitation')) {
      return "Here are some example constraints to consider:\n\n1. Must not require you to do live calls more than once per week.\n\n2. Initial development time limited to 10 hours/week for the next 3 months.\n\n3. Must be deliverable without hiring additional team members initially.\n\n4. Avoid solutions requiring complex custom software development.\n\n5. The offer should complement, not cannibalize, your existing high-end services.";
    }

    return "I'd be happy to help you clarify your business goals and constraints for this offer! Are you looking to create a new revenue stream, replace client work, generate leads, or something else? And what constraints (time, budget, skills) do you need to work within?";
  }

  /**
   * Mock response for Trigger Events step
   */
  private getMockTriggerEventsResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const bigIdea = workshopData.bigIdea?.description || "your offer";

    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return `Here are some example trigger events that might prompt customers to seek ${bigIdea}:\n\n1. Just landed their first big client presentation but realized their DIY materials look amateurish.\n\n2. Received a quote for custom work that was 5x their available budget.\n\n3. Wasted a whole weekend trying to do it themselves and felt completely unproductive.\n\n4. Saw a competitor launch with a polished solution and felt immediate pressure to level up.\n\n5. Facing an upcoming deadline and realizing they don't have the skills to complete the work in time.`;
    }

    if (lowerMessage.includes('type') || lowerMessage.includes('kind')) {
      return "There are several types of trigger events to consider:\n\n1. Situational triggers: External events like deadlines, launches, or new opportunities\n\n2. Emotional triggers: Internal feelings like frustration, overwhelm, or FOMO\n\n3. Social triggers: Comparisons to peers, client expectations, or industry standards\n\n4. Anticipated triggers: Future concerns or risks they want to avoid\n\nWhich types would you like to explore for your offer?";
    }

    return `I'd be happy to help you identify trigger events for ${bigIdea}! These are the specific moments when potential customers realize they need your solution. Think about: What was happening right before your past clients hired you? What frustrations or pressures might create urgency? What's the "final straw" that pushes someone to seek help?`;
  }

  /**
   * Mock response for Jobs step
   */
  private getMockJobsResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return "Here are some example Job Statements in the proper format:\n\n1. Help me establish a professional brand identity quickly and affordably when launching my business.\n\n2. Help me streamline my client onboarding process without sacrificing the personal touch.\n\n3. Help me create consistent content for my audience when I'm short on time and ideas.\n\n4. Help me convert more discovery calls into paying clients without feeling pushy or salesy.\n\nNotice how each follows the format: Help me [VERB] my [OBJECT] [CONTEXT].";
    }

    if (lowerMessage.includes('format') || lowerMessage.includes('structure')) {
      return "The Job Statement should follow this format: 'Help me [VERB] my [OBJECT] [CONTEXT]'\n\nFor example: 'Help me establish a professional brand identity quickly and affordably when launching my business.'\n\n- VERB: Use active verbs like establish, create, streamline, transform, etc.\n- OBJECT: What they're trying to improve or change\n- CONTEXT: The specific situation, constraints, or emotional state\n\nThis format captures the progress your customers are trying to make.";
    }

    return "I'd be happy to help you define the Job-to-be-Done! This is about understanding the progress your customers are trying to make, not just what they're buying. Think about: What underlying struggle are they trying to resolve? What outcome would make that struggle go away? Let's craft this in the format 'Help me [VERB] my [OBJECT] [CONTEXT]'.";
  }

  /**
   * Mock response for Target Buyers step
   */
  private getMockTargetBuyersResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const jobStatement = workshopData.jobs?.find(job => job.selected)?.description || "the job-to-be-done";

    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return `Here are some example target buyer segments who might experience ${jobStatement} intensely:\n\n1. First-time online course creators preparing for their initial launch.\n\n2. Side-hustlers transitioning to full-time freelancing needing a professional web presence.\n\n3. Brick-and-mortar businesses launching their first e-commerce site.\n\n4. Non-profit organizations applying for grants needing a credible brand image.\n\n5. Solopreneur coaches/consultants who primarily get clients via referrals but want to look more established online.`;
    }

    if (lowerMessage.includes('criteria') || lowerMessage.includes('evaluate')) {
      return "When evaluating potential target segments, consider these criteria:\n\n1. Urgency: How badly and how soon do they need this problem solved?\n\n2. Willingness to Pay: Do they have budget and see this as a high-value problem?\n\n3. Long-term Value: Could they become repeat customers or lead to other opportunities?\n\n4. Solution Fit: How well does your solution match their specific needs?\n\n5. Accessibility: Can you easily reach and communicate with this segment?\n\nWhich segments score highest across these criteria?";
    }

    return `I'd be happy to help you identify target buyer segments who experience ${jobStatement} most intensely! Think about: What types of people or businesses frequently find themselves in this situation? Are there specific industries, roles, business stages, or personality types that seem particularly relevant? Let's brainstorm some specific segments.`;
  }

  /**
   * Mock response for Painstorming step
   */
  private getMockPainstormingResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const segments = workshopData.targetBuyers?.filter(buyer => buyer.selected).map(buyer => buyer.description) || ["your target segments"];

    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return `Here are some example pain points for ${segments[0] || "your target segment"}:\n\n1. Spending weeks stuck on design tasks instead of focusing on their core business. (Functional, FIRE)\n\n2. Fear that a DIY look will make potential customers question their expertise. (Emotional/Social, FIRE)\n\n3. Feeling overwhelmed by the number of elements needed (website, social media, marketing materials). (Emotional)\n\n4. Worrying that investing in professional help is too expensive before validating their idea. (Anticipated/Financial)\n\n5. Inability to create consistent visuals across different platforms and materials. (Functional)`;
    }

    if (lowerMessage.includes('type') || lowerMessage.includes('kind')) {
      return "There are several types of pains to consider:\n\n1. Functional Pains: Processes that break down, inefficiencies, technical roadblocks\n\n2. Emotional Pains: Frustration, overwhelm, anxiety, fear of failure\n\n3. Social Pains: How others perceive them, reputation risks, comparison to peers\n\n4. Anticipated Pains: Future risks or negative outcomes they worry about\n\nFIRE pains (Frequent, Intense, Recurring, Expensive) are especially important to identify.";
    }

    return `I'd be happy to help you identify pain points for ${segments.join(", ")}! Think about: What functional roadblocks do they hit? What emotional costs do they experience? How might others perceive them if they struggle with this job? What future risks do they worry about? Let's identify those FIRE pains (Frequent, Intense, Recurring, Expensive).`;
  }

  /**
   * Mock response for Problem-Up step
   */
  private getMockProblemUpResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const firePains = workshopData.pains?.filter(pain => pain.isFire).map(pain => pain.description) || ["the FIRE pains"];

    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return "Here are some example Problem Focus Statements:\n\n1. My offer will focus on solving the problems of achieving a professional look quickly and reducing branding overwhelm for new business launchers.\n\n2. This solution targets the pain of brand credibility and the functional bottleneck of DIY design for time-strapped founders.\n\n3. We will address the emotional pain of brand embarrassment and the functional pain of complex branding tasks for budget-conscious startups.";
    }

    if (lowerMessage.includes('market') || lowerMessage.includes('target')) {
      return "Here are some example Refined Target Market definitions:\n\n1. Targeting solopreneurs in their first 3 months of business who feel overwhelmed by branding tasks and worry about looking unprofessional.\n\n2. Focusing on non-designers launching their first online course who need professional visuals quickly but lack the budget for custom work.\n\n3. Serving founders who have just received negative feedback on their DIY branding and need an immediate, affordable fix.";
    }

    return `I'd be happy to help you select which problems to focus on! Looking at the pains you've identified (especially ${firePains.join(", ")}), which ones do you feel most qualified or excited to solve? Which ones align best with your skills and goals? We can then refine your target market based on who experiences these specific problems most acutely.`;
  }

  /**
   * Mock response for Refine Idea step
   */
  private getMockRefineIdeaResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const targetMarket = workshopData.problemUp?.targetMoment || "your target market";
    const problems = workshopData.problemUp?.selectedPains?.map(id => {
      const pain = workshopData.pains?.find(p => p.id === id);
      return pain ? pain.description : '';
    }).filter(Boolean) || ["the key problems"];

    if (lowerMessage.includes('concept') || lowerMessage.includes('format')) {
      return `Here are some example offer concepts for ${targetMarket}:\n\n**Concept Name:** Brand Launchpad Kit\n**Format:** Productized Service Package\n**Description:** Delivers essential logo, color, font, and brand guide assets within 7 days for new solopreneurs needing a professional look fast.\n\n**Concept Name:** DIY Brand Confidence Kit\n**Format:** Template + Video Training Product\n**Description:** Provides easy-to-use templates (Canva/Figma) for logos/social assets plus short video guides, helping budget-conscious founders overcome design overwhelm.\n\n**Concept Name:** Credibility Kickstarter Session\n**Format:** 2-Hour 1:1 Intensive Workshop\n**Description:** A focused virtual session guiding a new business owner through defining their core brand message and visual direction, providing immediate clarity.`;
    }

    if (lowerMessage.includes('statement') || lowerMessage.includes('idea')) {
      return `Here are some refined Big Idea statements:\n\n1. A fixed-scope brand kit service that helps first-time founders establish a professional visual identity quickly and affordably.\n\n2. A 'Brand Starter Pack' product that helps solopreneurs overcome design overwhelm and launch with a credible look in under a week.\n\n3. A productized design package that helps budget-conscious startups get essential, consistent branding assets without custom design fees.`;
    }

    return `I'd be happy to help you refine your offer concept! Based on the problems (${problems.join(", ")}) and target market (${targetMarket}), let's consider: What format would best solve these problems? Would a Done-For-You service, a DIY template/course, or a Done-With-You coaching model work best? How can we incorporate your unique skills and work within your constraints?`;
  }

  /**
   * Mock response for Summary step
   */
  private getMockSummaryResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const refinedIdea = workshopData.refinedIdea?.description || workshopData.bigIdea?.description || "your offer";
    const targetMarket = workshopData.problemUp?.targetMoment || workshopData.bigIdea?.targetCustomers || "your target market";

    if (lowerMessage.includes('validate') || lowerMessage.includes('test')) {
      return `Here are some ways to validate ${refinedIdea} before building it:\n\n1. Conduct 5 short 'problem validation' interviews with people matching the ${targetMarket} profile to confirm they experience these problems acutely.\n\n2. Draft a simple one-paragraph description of your offer focusing on the core problem/outcome, and get feedback on its clarity and appeal from 5 potential buyers.\n\n3. Create a basic 'coming soon' landing page outlining the offer and problem, then drive a small amount of targeted traffic to gauge interest via email sign-ups.\n\n4. Identify 3-5 existing 'alternative solutions' your target market might use today and analyze how your offer provides a distinctly better way to achieve the job.\n\n5. Reach out to 10 people in your network who fit the target profile, briefly explain the core problem and your proposed solution concept, and ask 'Does this resonate?'`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('recap')) {
      return `Here's a summary of your workshop progress:\n\n- Target Market: ${targetMarket}\n\n- Key Problems: ${workshopData.problemUp?.selectedPains?.map(id => {
        const pain = workshopData.pains?.find(p => p.id === id);
        return pain ? pain.description : '';
      }).filter(Boolean).join(", ") || "Not specified"}\n\n- Refined Offer: ${refinedIdea}\n\nThe crucial next step is validating this with real potential customers before building the full solution. This will save you time and ensure you're creating something people actually want.`;
    }

    return `I'd be happy to help with next steps for ${refinedIdea}! The most important thing now is to validate your concept with real potential customers before building the full solution. What's the single biggest assumption you need to test? Would you like some specific validation ideas that you could implement in the next 1-4 weeks?`;
  }

  /**
   * Generate suggestions based on the current step and context
   */
  async generateSuggestions(
    currentStep: number,
    workshopData: WorkshopData,
    type: string
  ): Promise<SuggestionOption[]> {
    try {
      // If using mock responses, generate mock suggestions
      if (this.useMockResponses) {
        return this.generateMockSuggestions(currentStep, type, workshopData);
      }

      // Get the appropriate suggestion prompt for the current step and type
      const suggestionPrompt = this.getSuggestionPromptForStep(currentStep, type, workshopData);

      // Generate the suggestions using the OpenAI service
      const response = await this.openai.generateCompletion(
        suggestionPrompt.system,
        suggestionPrompt.user,
        0.7,
        this.model
      );

      // Parse the suggestions from the response
      return this.parseSuggestions(response, type);
    } catch (error) {
      console.error('Error generating suggestions:', error);

      // Fall back to mock suggestions if API fails
      return this.generateMockSuggestions(currentStep, type, workshopData);
    }
  }

  /**
   * Generate mock suggestions based on the current step and type
   */
  private generateMockSuggestions(
    currentStep: number,
    type: string,
    workshopData: WorkshopData
  ): SuggestionOption[] {
    // Generate 3-5 mock suggestions based on the step and type
    const suggestions: SuggestionOption[] = [];

    switch (currentStep) {
      case 2: // Big Idea
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'A template pack that helps consultants quickly create high-converting proposals.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'A productized service that provides SEO audits specifically for e-commerce stores.', type }
        );
        break;

      case 3: // Underlying Goal
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'Build a new revenue stream that generates $5k/month within 12 months, separate from client work.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Create a lower-tier offer that acts as a feeder for your high-ticket consulting services.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Replace 50% of your 1-on-1 service income with a more leveraged group program within 18 months.', type }
        );
        break;

      case 4: // Trigger Events
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'Just landed their first big client presentation but realized their DIY materials look amateurish.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Received a quote for custom work that was 5x their available budget.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Wasted a whole weekend trying to do it themselves and felt completely unproductive.', type }
        );
        break;

      case 5: // Jobs
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'Help me establish a professional brand identity quickly and affordably when launching my business.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Help me streamline my client onboarding process without sacrificing the personal touch.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Help me create consistent content for my audience when I\'m short on time and ideas.', type }
        );
        break;

      case 6: // Target Buyers
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'First-time online course creators preparing for their initial launch.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Side-hustlers transitioning to full-time freelancing needing a professional web presence.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Brick-and-mortar businesses launching their first e-commerce site.', type }
        );
        break;

      case 7: // Painstorming
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'Spending weeks stuck on design tasks instead of focusing on their core business. (Functional, FIRE)', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Fear that a DIY look will make potential customers question their expertise. (Emotional/Social, FIRE)', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Feeling overwhelmed by the number of elements needed (website, social media, marketing materials). (Emotional)', type }
        );
        break;

      case 8: // Problem-Up
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'My offer will focus on solving the problems of achieving a professional look quickly and reducing branding overwhelm for new business launchers.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'This solution targets the pain of brand credibility and the functional bottleneck of DIY design for time-strapped founders.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'We will address the emotional pain of brand embarrassment and the functional pain of complex branding tasks for budget-conscious startups.', type }
        );
        break;

      case 9: // Refine Idea
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'A fixed-scope brand kit service that helps first-time founders establish a professional visual identity quickly and affordably.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'A "Brand Starter Pack" product that helps solopreneurs overcome design overwhelm and launch with a credible look in under a week.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'A productized design package that helps budget-conscious startups get essential, consistent branding assets without custom design fees.', type }
        );
        break;

      case 10: // Summary & Next Steps
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'Conduct 5 short "problem validation" interviews with people matching your target market profile to confirm they experience these problems acutely.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Create a basic "coming soon" landing page outlining the offer and problem, then drive a small amount of targeted traffic to gauge interest via email sign-ups.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Reach out to 10 people in your network who fit the target profile, briefly explain the core problem and your proposed solution concept, and ask "Does this resonate?"', type }
        );
        break;

      default:
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'I can help you brainstorm ideas for this step.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Would you like some examples or templates to help with this exercise?', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Let me know what specific aspect you need help with.', type }
        );
    }

    return suggestions;
  }

  /**
   * Format the chat history for the OpenAI API
   */
  private formatChatHistory(chatHistory: SparkyMessage[]): Array<{role: 'user' | 'assistant' | 'system', content: string}> {
    // Take the last 10 messages to stay within context limits
    const recentMessages = chatHistory.slice(-10);

    return recentMessages.map(message => ({
      role: message.role,
      content: message.content
    }));
  }

  /**
   * Parse suggestions from the OpenAI response
   */
  private parseSuggestions(response: string, type: string): SuggestionOption[] {
    try {
      // Split the response by lines and filter out empty lines
      const lines = response.split('\n').filter(line => line.trim());

      // Extract suggestions (lines that start with a number followed by a period)
      const suggestions: SuggestionOption[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if the line starts with a number followed by a period
        if (/^\d+\./.test(line)) {
          const content = line.replace(/^\d+\.\s*/, '').trim();

          if (content) {
            suggestions.push({
              id: `suggestion-${Date.now()}-${i}`,
              content,
              type
            });
          }
        }
      }

      return suggestions;
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return [];
    }
  }

  /**
   * Get the system prompt for the current step
   */
  private getSystemPromptForStep(currentStep: number, workshopData: WorkshopData): string {
    // Global context for all steps
    const globalContext = `You are Sparky, an AI workshop assistant for the Buyer Breakthrough Workshop.
You help users brainstorm, refine ideas, and navigate the exercises.
You are currently on Step ${currentStep} of the workshop.
Be conversational, helpful, and concise.
Provide specific, actionable guidance based on the user's inputs.

Core Principles:
- Persistence: The chat history and context are maintained across steps.
- Context-Awareness: Use data entered in the workshop and previous chat messages to inform responses.
- Proactive & Reactive: Offer help at certain steps or react when the user explicitly asks.
- Structured Suggestions: When generating options (ideas, statements), provide 3-5 distinct choices.
- Guidance: Use conversational prompts to guide users, clarify inputs, and explain concepts.`;

    // Step-specific prompts
    let stepPrompt = '';

    switch (currentStep) {
      case 1: // Introduction
        stepPrompt = `You are introducing the user to the Buyer Breakthrough Workshop.
Welcome them and explain that you're here to help them brainstorm, refine ideas, and navigate the exercises.
Let them know they can ask questions anytime or click 'Get AI Help' on specific steps for targeted suggestions.`;
        break;

      case 2: // Describe Your Big Idea
        stepPrompt = `Help the user articulate their initial product/service idea using the "[What it is] + [What it helps customers do]" framework.
If the user has no idea, brainstorm possibilities based on their background.

Example guidance questions:
- "What's the core thing you're offering (e.g., 'a course', 'a template package', 'a workshop')? And what's the main result someone gets from it?"
- "Based on your background, what kinds of problems do you often see your clients facing?"

The goal is to help them create a clear, concise statement that describes their offer and its primary benefit.`;
        break;

      case 3: // Clarify Your Underlying Goal
        stepPrompt = `Help the user define their business goal for creating the new offer and identify key constraints.

Example guidance questions:
- "Is the main goal to replace client income, add a new stream, generate leads for services, or something else?"
- "How much time per week can you realistically dedicate to this new offer initially?"
- "Are there types of work or customers you definitely want to avoid with this offer?"

The goal is to clarify why they're creating this offer and what constraints they need to work within.`;
        break;

      case 4: // Identify Buying Triggers
        stepPrompt = `Help the user brainstorm specific Trigger Events (situational, physical, social, internal/emotional) that would push their potential customers to seek a solution like the one described in their "Big Idea".

Example guidance questions:
- "What was going on in your best clients' businesses right before they hired you?"
- "What external pressures might make someone urgently need the outcome your offer provides?"
- "What internal feelings might bubble up? Overwhelm? Frustration? Fear of missing out?"

The goal is to identify specific moments or situations when potential customers would be most motivated to seek their solution.`;
        break;

      case 5: // Define Job-to-be-Done
        stepPrompt = `Help the user brainstorm potential jobs (Overarching & Supporting) their customers are trying to get done, guide them to select relevant jobs based on their skills, and refine ONE key job statement using the Help me [VERB] my [OBJECT] [CONTEXT] format.

Example guidance questions:
- "Looking at those trigger events, what's the underlying struggle they represent? What outcome would make that struggle go away?"
- "Let's use the 'so that...' method. A customer wants [Outcome from Big Idea]... so that... they can achieve what?"
- "Considering your own skills, which of these potential jobs do you feel uniquely equipped to help people solve?"

The goal is to define the core progress the customer is trying to make when they seek a solution like the user's.`;
        break;

      case 6: // Identify Potential Target Buyers
        stepPrompt = `Help the user brainstorm potential target buyer segments who experience the chosen Job-to-be-Done intensely, guide them through narrowing the list based on gut check and criteria (Urgency, Willingness to Pay, Long-term Value, Solution Fit, Accessibility), resulting in 3 top segments.

Example guidance questions:
- "Considering the context in your Job Statement, what types of people or businesses frequently find themselves in that specific situation?"
- "Are there specific industries, roles, business stages, or personality types that seem particularly relevant to this job?"
- "Let's do a gut check on your brainstormed list. Which segments are a 'Hell Yes!' for you, based on your interest or expertise?"

The goal is to identify specific target buyer segments who strongly experience the job-to-be-done.`;
        break;

      case 7: // Do Rapid Painstorming
        stepPrompt = `For the user's top 3 target buyer segments, help brainstorm specific pains (Functional, Emotional, Social, Anticipated) they experience related to the chosen Job-to-be-Done. Highlight potential FIRE pains (Frequent, Intense, Recurring, Expensive). Identify overlapping pains.

Example guidance questions:
- "For [Segment 1], what functional roadblocks might they hit trying to do this job? What processes break down?"
- "What are the emotional costs for [Segment 2] if they fail to get this job done well?"
- "How might [Segment 3]'s peers or clients perceive them if they struggle with this job? (Social pains)"
- "Which of these pains feel like 'FIRE' pains – Frequent, Intense, Recurring, Expensive?"

The goal is to identify specific pain points for each target segment related to the job-to-be-done.`;
        break;

      case 8: // Problem-Up
        stepPrompt = `Help the user audit their brainstormed pain points (especially overlapping and FIRE ones) against their skills, interests, and goals. Guide them to select 2-5 specific, high-potential problems to focus their offer on. Help them refine their target market based on these problems (focusing on specific traits OR trigger moments).

Example guidance questions:
- "Which of these problems have you personally experienced or helped clients overcome before?"
- "Are there any problems on the list where current solutions seem particularly weak or frustrating?"
- "Considering your goal, which problems, if solved, would best help you achieve that?"
- "Based on the problems you're selecting, should we refine the target market? Are we focusing more on people with specific traits who experience these problems, or people experiencing specific trigger moments?"

The goal is to identify the most promising problems to solve and refine the target market accordingly.`;
        break;

      case 9: // Refine Your Big Idea
        stepPrompt = `Help the user refine their initial "Big Idea" statement OR brainstorm new offer concepts, incorporating the insights gained (Job Statement, Target Market, Focused Problems). Guide them to consider format, delivery, skills, and constraints. Help them write a V2 Big Idea statement.

Example guidance questions:
- "Given the problem is [Problem], would a 'Done-For-You' service, a 'Do-It-Yourself' template/course, or a 'Done-With-You' coaching model seem most effective for [Target Market]?"
- "How could you leverage your unique skill in [User Skill] to solve [Problem] in a way competitors don't?"
- "Considering your constraint of [Constraint], which offer format seems most feasible to deliver initially?"
- "Let's draft a V2 Big Idea statement using the framework: '[What it is] + [What it helps customers do]', but now infused with the specific job, problems, and target market."

The goal is to refine the offer concept based on all the insights gained throughout the workshop.`;
        break;

      case 10: // Summary & Next Steps
        stepPrompt = `Summarize the user's key outputs (Target Market, Problems, Refined Offer). Reinforce the next step: testing the message/offer before building.

Example guidance questions:
- "Based on your refined offer for [Target Market] solving [Problem], what's the single biggest assumption you need to test before building?"
- "How could you quickly test if your message resonates? Perhaps a simple landing page or some targeted conversations?"
- "Remember, validating the message before building the product can save immense time and effort."

The goal is to summarize the workshop outputs and guide the user on next steps for validation.`;
        break;

      default:
        stepPrompt = `You are helping the user with Step ${currentStep} of the Buyer Breakthrough Workshop.`;
    }

    return `${globalContext}\n\n${stepPrompt}`;
  }

  /**
   * Get the suggestion prompt for the current step and type
   */
  private getSuggestionPromptForStep(currentStep: number, type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the appropriate suggestion prompt based on the step and type
    switch (currentStep) {
      case 2: // Big Idea
        return this.getBigIdeaSuggestionPrompt(type, workshopData);
      case 3: // Underlying Goal
        return this.getUnderlyingGoalSuggestionPrompt(type, workshopData);
      case 4: // Trigger Events
        return this.getTriggerEventsSuggestionPrompt(type, workshopData);
      case 5: // Jobs
        return this.getJobsSuggestionPrompt(type, workshopData);
      case 6: // Target Buyers
        return this.getTargetBuyersSuggestionPrompt(type, workshopData);
      case 7: // Painstorming
        return this.getPainstormingSuggestionPrompt(type, workshopData);
      case 8: // Problem-Up
        return this.getProblemUpSuggestionPrompt(type, workshopData);
      case 9: // Refine Idea
        return this.getRefineIdeaSuggestionPrompt(type, workshopData);
      case 10: // Summary & Next Steps
        return this.getSummaryNextStepsSuggestionPrompt(type, workshopData);
      default:
        // Default suggestion prompt
        return {
          system: `You are an AI assistant generating suggestions for Step ${currentStep} of the Buyer Breakthrough Workshop.
Generate 3-5 distinct, specific suggestions for the user based on their workshop progress.`,
          user: `Please generate 3-5 suggestions for ${type} based on the workshop data.`
        };
    }
  }

  /**
   * Get suggestion prompt for Step 2: Big Idea
   */
  private getBigIdeaSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Check if we're refining an existing idea or brainstorming from scratch
    const isRefining = workshopData.bigIdea?.description?.trim().length > 0;

    if (isRefining) {
      // Refining an existing idea
      return {
        system: `You are an AI assistant helping a user refine their initial product/service idea for the Buyer Breakthrough Workshop. The user has provided some initial thoughts, potentially vague. Your task is to generate 3-5 concise "Big Idea" statements adhering strictly to the specified format.

# Task Description
Generate 3-5 concise "Big Idea" statements using the format "[What it is] + [what will it help customers do]".

# Input Context
* Initial Idea Draft: ${workshopData.bigIdea?.description || ""}
* User Background (Optional): ${workshopData.bigIdea?.targetCustomers || ""}

# Methodology & Constraints
-   Statements must follow the format: "[What it is] + [what will it help customers do]".
-   "[What it is]" should describe a scalable offer type (course, productized service, template, workshop, software tool, etc.) relevant to service providers moving towards productization.
-   "[what will it help customers do]" must be a clear, concise benefit or outcome for the customer.
-   Generate 3-5 distinct options.

# Output Format
Provide exactly 3-5 distinct options, each on a new line, following the specified format. Do not include any introductory or concluding text, only the list of options.`,
        user: `Please generate 3-5 refined "Big Idea" statements based on the user's initial idea: "${workshopData.bigIdea?.description || ""}"`
      };
    } else {
      // Brainstorming from scratch
      return {
        system: `You are an AI assistant helping a user brainstorm scalable offer ideas based on their background for the Buyer Breakthrough Workshop. The user has shared their website/LinkedIn/expertise but has no initial idea. Your task is to generate 3-5 distinct, scalable offer concepts relevant to their field.

# Task Description
Generate 3-5 distinct, scalable offer concepts (course, productized service, template, workshop, software tool idea, etc.). For each concept, provide a clear name and a concise description focusing on the primary benefit or problem solved.

# Input Context
* User Background/Expertise: ${workshopData.bigIdea?.targetCustomers || "Limited information available"}

# Methodology & Constraints
-   Generate 3-5 distinct concepts.
-   Each concept must include a **Concept Name** and a **Description**.
-   The Description should briefly state what the offer is and the primary benefit or problem solved for the customer.
-   Concepts should be scalable alternatives to traditional 1-on-1 services.
-   Ensure concepts are relevant to the user's provided background/expertise.

# Output Format
Provide exactly 3-5 distinct options. Format each option as follows, with no introductory or concluding text:
**Concept Name:** [Example: SEO Audit Template Package]
**Description:** [Example: A set of templates and guides that help SaaS companies conduct their own technical SEO audits to improve rankings.]`,
        user: `Please generate 3-5 scalable offer concepts based on the user's background: "${workshopData.bigIdea?.targetCustomers || "Limited information available"}"`
      };
    }
  }

  /**
   * Get suggestion prompt for Step 3: Underlying Goal
   */
  private getUnderlyingGoalSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    return {
      system: `You are an AI assistant helping a user articulate their underlying business goal and key constraints for creating a new, scalable offer (like a course, productized service, etc.), often as a transition from traditional service models. Your task is to generate 3-5 distinct, realistic examples for *each* category (Goals, Constraints).

# Task Description
Generate 3-5 distinct examples for Underlying Business Goals and 3-5 distinct examples for Key Constraints relevant to service providers creating scalable offers.

# Input Context
* Big Idea: "${workshopData.bigIdea?.description || "Not specified"}"
* Draft Goal/Constraints: "${workshopData.underlyingGoal?.businessGoal || ""} / ${workshopData.underlyingGoal?.constraints || ""}"

# Methodology & Constraints
-   Generate 3-5 distinct options for Goals.
-   Generate 3-5 distinct options for Constraints.
-   Goals should focus on tangible business outcomes (e.g., specific revenue targets, lifestyle changes like reduced 1-on-1 time, lead generation impact, strategic positioning).
-   Constraints should focus on realistic limitations (e.g., specific time commitments per week/month, budget limits, preferred delivery models, avoiding certain tasks or client types).
-   Ensure examples are highly relevant to someone moving from services to a more scalable model.

# Output Format
Provide 3-5 options for Goals and 3-5 options for Constraints, clearly labeled. Do not include any introductory or concluding text, only the lists.`,
      user: `Please generate examples of business goals and constraints for the user's Big Idea: "${workshopData.bigIdea?.description || "Not specified"}"`
    };
  }

  /**
   * Get suggestion prompt for Step 4: Trigger Events
   */
  private getTriggerEventsSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    return {
      system: `You are an AI assistant helping a user brainstorm Trigger Events for their specific offer idea, applying JTBD principles. Your task is to generate 3-5 distinct, specific Trigger Events from the customer's perspective that would create urgency for the user's solution.

# Task Description
Generate 3-5 distinct, specific Trigger Events (situations, 'final straws', moments of realization) from the *customer's* perspective that would create urgency for the user's solution.

# Input Context
* Big Idea: "${workshopData.bigIdea?.description || "Not specified"}"
* Target Customers: "${workshopData.bigIdea?.targetCustomers || "Not specified"}"
* Existing Triggers: ${workshopData.triggerEvents?.length > 0 ? workshopData.triggerEvents.map(t => `"${t.description}"`).join(', ') : "None yet"}

# Methodology & Constraints
-   Generate 3-5 distinct Trigger Events.
-   Each event must be described clearly from the *customer's* viewpoint.
-   Events must create *urgency* or represent a *struggle/catalyst* directly related to the problem the Big Idea solves.
-   Aim for specificity and realism based on the provided context (Big Idea, Target Customers).
-   Attempt to include a mix of trigger types (Situational, Emotional, Social) if plausible.

# Output Format
Provide exactly 3-5 distinct Trigger Event options, each described clearly from the customer's viewpoint. Do not include any introductory or concluding text, only the list of options.`,
      user: `Please generate 3-5 specific trigger events for the user's Big Idea: "${workshopData.bigIdea?.description || "Not specified"}"`
    };
  }

  /**
   * Get suggestion prompt for Step 5: Jobs
   */
  private getJobsSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Check if we're brainstorming or refining
    const isRefining = type === 'refine' && workshopData.jobs.some(job => job.selected);

    if (isRefining) {
      // Get the selected job to refine
      const selectedJob = workshopData.jobs.find(job => job.selected);

      return {
        system: `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology by Clayton Christensen and Bob Moesta. The user has provided a draft Job Statement and context. Your task is to analyze the draft based on JTBD principles and generate 3-5 revised options that strictly adhere to the format "Help me [VERB] my [OBJECT] [CONTEXT]".

# Task Description
Refine the user's draft Job Statement into 3-5 options adhering to the specified format and JTBD principles.

# Input Context
* **User's Draft Job Statement:** "${selectedJob?.description || ""}"
* **Product/Service Idea:** "${workshopData.bigIdea?.description || ""}"
* **Desired Outcomes:** "${workshopData.underlyingGoal?.businessGoal || ""}"
* **Trigger Events:** ${workshopData.triggerEvents?.map(t => `"${t.description}"`).join(', ') || "None specified"}

# Methodology & Constraints
-   **Focus on Progress:** Job statements MUST describe the customer's desired progress, *not* the product's features or the solution itself.
-   **Solution-Agnostic:** The statement should be broad enough that multiple different solutions could potentially fulfill the job.
-   **Format:** Strictly adhere to the format: "Help me [VERB] my [OBJECT] [CONTEXT]". Use clear, active verbs.
-   **Context is Key:** Incorporate relevant context (time constraints, resource limitations, emotional states, etc.) derived from the trigger events and desired outcomes.
-   **Avoid Common Mistakes:** Do not generate statements that are product-focused, too vague, feature-oriented, or treat the solution category as the job itself.
-   **Verb Bank (Reference):** Achieve, Accelerate, Align, Alleviate, Boost, Build, Capture, Clarify, Create, Eliminate, Enhance, Establish, Free, Improve, Increase, Maintain, Navigate, Protect, Reduce, Secure, Simplify, Streamline, Transform, Validate.

# Output Format
Provide 3-5 distinct revised Job Statement options strictly in the required format. Do not include any additional commentary or explanation.`,
        user: `Please refine this draft job statement: "${selectedJob?.description || ""}" into 3-5 improved options that follow the "Help me [VERB] my [OBJECT] [CONTEXT]" format.`
      };
    } else {
      // Brainstorming new job statements
      return {
        system: `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology by Clayton Christensen and Bob Moesta. Your task is to analyze the user's input about their business/product idea, desired outcomes, and key trigger events to generate accurate, progress-focused Job Statements.

# Task Description
Generate 3-5 distinct potential Job Statements (can be a mix of overarching and supporting) that represent the progress the user's target customers are trying to make when they might "hire" the user's product or service, based on the provided context.

# Input Context
You will be provided with the following information from the user:
1.  **Product/Service Idea:** "${workshopData.bigIdea?.description || ""}"
2.  **Desired Outcomes:** "${workshopData.underlyingGoal?.businessGoal || ""}"
3.  **Trigger Events:** ${workshopData.triggerEvents?.map(t => `"${t.description}"`).join(', ') || "None specified"}

# Methodology & Constraints
-   **Focus on Progress:** Job statements MUST describe the customer's desired progress, *not* the product's features or the solution itself.
-   **Solution-Agnostic:** The statement should be broad enough that multiple different solutions could potentially fulfill the job.
-   **Format:** Use the format "Help me [VERB] my [OBJECT] [CONTEXT]" where possible, but prioritize capturing the core job accurately even if the format needs slight variation. Use clear, active verbs.
-   **Context is Key:** Incorporate relevant context (time constraints, resource limitations, emotional states, etc.) derived from the trigger events and desired outcomes.
-   **Avoid Common Mistakes:** Do not generate statements that are product-focused, too vague, feature-oriented, or treat the solution category as the job itself.

# Output Format
Provide 3-5 distinct potential Job Statement options. Do not include any additional commentary or explanation.`,
        user: `Please generate 3-5 potential job statements based on the user's Big Idea: "${workshopData.bigIdea?.description || ""}" and trigger events.`
      };
    }
  }

  /**
   * Get suggestion prompt for Step 6: Target Buyers
   */
  private getTargetBuyersSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the selected job
    const selectedJob = workshopData.jobs.find(job => job.selected);

    return {
      system: `You are an AI assistant helping a user brainstorm specific target buyer segments for their chosen Job Statement, following the Problem-Up method. Your task is to generate 3-5 distinct, specific potential buyer segments likely to experience the Job's context intensely.

# Task Description
Analyze the user's Job Statement, paying close attention to the OBJECT and especially the CONTEXT. Generate 3-5 distinct, *specific* potential buyer segments.

# Input Context
* Chosen Job Statement: "${selectedJob?.description || "Not specified"}"
* User's Business/Skills (Optional): "${workshopData.bigIdea?.targetCustomers || ""}"

# Methodology & Constraints
-   Generate 3-5 distinct, *specific* buyer segments.
-   Segments should be defined by shared traits (industry, role, business stage, psychographics) or circumstances that make them likely to experience the Job's context intensely and value a solution.
-   Segments should logically connect to the Job Statement's context and object.
-   Focus on traits or circumstances that imply high potential pain or urgency related to the job.
-   Avoid overly broad or generic categories like "small businesses"; aim for specificity (e.g., "e-commerce businesses under $1M ARR", "Consultants specializing in X").

# Output Format
Provide 3-5 distinct potential target buyer segment options. Do not include any introductory or concluding text, only the list of options.`,
      user: `Please generate 3-5 specific target buyer segments for the job statement: "${selectedJob?.description || "Not specified"}"`
    };
  }

  /**
   * Get suggestion prompt for Step 7: Painstorming
   */
  private getPainstormingSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the selected job
    const selectedJob = workshopData.jobs.find(job => job.selected);

    // Get the top 3 buyer segments (those marked as selected, or the first 3)
    const topBuyers = workshopData.targetBuyers
      .filter(buyer => buyer.selected)
      .slice(0, 3);

    // Format the buyer segments for the prompt
    const buyerSegments = topBuyers.map(buyer => buyer.description).join('\n* ');

    return {
      system: `You are an AI assistant specialized in Painstorming based on JTBD. Your task is to generate specific pain points for each of the user's top 3 target buyer segments related to their chosen Job Statement.

# Task Description
For *each* of the 3 target segments provided, generate 3-5 specific pain points they likely experience when trying to achieve the Job Statement. Identify potential overlapping pains across segments.

# Input Context
* Chosen Job Statement: "${selectedJob?.description || "Not specified"}"
* Top Buyer Segments:
* ${buyerSegments || "Not specified yet"}
* Big Idea (for context): "${workshopData.bigIdea?.description || ""}"

# Methodology & Constraints
-   Address each of the 3 target segments individually.
-   Generate 3-5 specific pains *per segment*.
-   Ensure pains cover a mix of types (Functional, Emotional, Social, Anticipated) and are directly related to the struggle of getting the Job done *for that specific segment*.
-   Explicitly label the type for each pain: (Functional), (Emotional), (Social), or (Anticipated).
-   Optionally, suggest if a pain might be a FIRE pain (Frequent, Intense, Recurring, Expensive) by adding "(FIRE?)".
-   Identify 1-2 key pains that seem likely to overlap across multiple provided segments at the end.
-   Ensure pains are specific and plausible for the segment and job context.

# Output Format
Structure the output clearly by segment, then list overlapping pains. Do not include any introductory or concluding text, only the formatted output.`,
      user: `Please generate specific pain points for each of these buyer segments related to the job statement: "${selectedJob?.description || "Not specified"}"`
    };
  }

  /**
   * Get suggestion prompt for Step 8: Problem-Up
   */
  private getProblemUpSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the selected pains (or the first 5 if none are explicitly selected)
    const selectedPains = workshopData.problemUp?.selectedPains || [];
    const pains = workshopData.pains
      .filter(pain => selectedPains.includes(pain.id) || pain.isFire)
      .slice(0, 5)
      .map(pain => pain.description)
      .join('\n* ');

    // Get the selected buyer segments
    const selectedBuyers = workshopData.problemUp?.selectedBuyers || [];
    const segments = workshopData.targetBuyers
      .filter(buyer => selectedBuyers.includes(buyer.id) || buyer.selected)
      .map(buyer => buyer.description)
      .join('\n* ');

    return {
      system: `You are an AI assistant guiding a user through the "Problem-Up" step, helping them connect specific problems to their offer focus and target market definition. The user has reviewed their painstorming results and identified 2-5 key pain points they want to address. Your task is to generate 3-5 options for EITHER a Problem Focus Statement OR a Refined Target Market Definition based *only* on these selected pains.

# Task Description
Generate 3-5 options for EITHER:
A) A concise "Problem Focus Statement" articulating which selected pains the offer will solve for which initial segment(s).
OR
B) A refined "Target Market Definition" narrowing the focus based on the selected pains, emphasizing specific traits or trigger moments.

# Input Context
* Chosen Job Statement: "${workshopData.jobs.find(job => job.selected)?.description || "Not specified"}"
* Selected Pain Points:
* ${pains || "Not specified yet"}
* Initial Top Buyer Segments:
* ${segments || "Not specified yet"}
* User's Skills/Interests (Optional): "${workshopData.bigIdea?.targetCustomers || ""}"

# Methodology & Constraints
-   Base suggestions *strictly* on the user's selected 2-5 pain points and initial segments.
-   Option A (Problem Focus Statement) must link the selected pains to one or more of the initial segments (e.g., "My offer focuses on alleviating [Pain A] and [Pain B] for [Segment Type]").
-   Option B (Refined Market) must define the market *through the lens of the selected pains* (e.g., "Targeting [Segment Type] specifically when they are experiencing [Trigger related to Pain A] and struggling with [Pain B]").
-   Generate 3-5 distinct options for *only one* category (A or B), clearly labeling which.
-   Do not introduce new pains or segments not provided in the context.

# Output Format
Provide 3-5 distinct options for either a Problem Focus Statement OR a Refined Target Market Definition. Clearly label which type you are providing. Do not include any introductory or concluding text.`,
      user: `Based on the selected pains and buyer segments, please generate either Problem Focus Statements OR Refined Target Market Definitions.`
    };
  }

  /**
   * Get suggestion prompt for Step 9: Refine Idea
   */
  private getRefineIdeaSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Check if we're generating offer concepts or refining the big idea
    if (type === 'offer-concepts') {
      // Get the selected problems
      const selectedPains = workshopData.problemUp?.selectedPains || [];
      const problems = workshopData.pains
        .filter(pain => selectedPains.includes(pain.id))
        .map(pain => pain.description)
        .join(', ');

      // Get the refined target market
      const targetMarket = workshopData.problemUp?.targetMoment || 'the target market';

      return {
        system: `You are an AI assistant helping a user brainstorm concrete, scalable offer concepts based on their workshop progress. Your task is to generate 3-5 distinct offer ideas based on the user's defined context.

# Task Description
Generate 3-5 distinct offer ideas. Each idea must specify a scalable format and briefly describe how it solves the *focused problems* for the *refined target market*, while respecting the user's *skills* and *constraints*.

# Input Context
* Underlying Goal: "${workshopData.underlyingGoal?.businessGoal || ""}"
* Job Statement: "${workshopData.jobs.find(job => job.selected)?.description || ""}"
* Focused Problems: ${problems || "Not specified yet"}
* Refined Target Market: "${targetMarket}"
* User Skills: "${workshopData.bigIdea?.targetCustomers || ""}"
* Key Constraints: "${workshopData.underlyingGoal?.constraints || ""}"

# Methodology & Constraints
-   Generate 3-5 distinct Offer Concepts.
-   Each concept must include a **Concept Name**, **Format**, and **Description**.
-   The **Format** must be a scalable type (e.g., Productized Service, Online Course, Template Kit, Group Workshop, Software Tool).
-   The **Description** must explicitly link the offer to solving the *Focused Problems* for the *Refined Target Market*.
-   The **Description** should implicitly or explicitly align with the user's *Goal, Skills, and Constraints*.
-   Focus only on *scalable* formats, avoiding traditional 1-on-1 service models unless productized.

# Output Format
Provide 3-5 distinct Offer Concept options. Format each option as follows, with no introductory or concluding text:
**Concept Name:** [Catchy Name, e.g., "Brand Launchpad Kit"]
**Format:** [e.g., Productized Service Package]
**Description:** [Briefly explain what it includes and how it solves the core problems for the target market, aligning with constraints/skills.]`,
        user: `Please generate 3-5 distinct offer concepts that solve the problems: ${problems || "identified in the workshop"} for ${targetMarket}.`
      };
    } else {
      // Refining the big idea statement
      return {
        system: `You are an AI assistant helping a user write a refined "Big Idea" statement (V2) using the framework "[What it is] + [what will it help customers do]". Your task is to generate 3-5 options for the V2 statement, incorporating insights from the user's workshop progress to make it more specific and compelling than their V1 idea.

# Task Description
Generate 3-5 distinct options for the refined Big Idea statement (V2), strictly following the format "[What it is] + [what will it help customers do]".

# Input Context
* Big Idea V1: "${workshopData.bigIdea?.description || ""}"
* Job Statement: "${workshopData.jobs.find(job => job.selected)?.description || ""}"
* Focused Problems: ${workshopData.problemUp?.selectedPains.map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? pain.description : '';
        }).filter(Boolean).join(', ') || "Not specified yet"}
* Refined Target Market: "${workshopData.problemUp?.targetMoment || ""}"

# Methodology & Constraints
-   Generate 3-5 distinct options for the refined Big Idea statement (V2).
-   Strictly adhere to the format: "[What it is] + [what will it help customers do]".
-   "[What it is]" should describe a specific, scalable offer type derived from the context.
-   "[what will it help customers do]" should clearly reference the progress related to the Job Statement and Focused Problems for the Refined Target Market.
-   Ensure V2 is significantly more specific and targeted than V1, reflecting the workshop insights.

# Output Format
Provide 3-5 distinct options for the refined Big Idea statement (V2), following the specified format. Do not include any introductory or concluding text.`,
        user: `Please generate 3-5 refined Big Idea statements that improve upon the original: "${workshopData.bigIdea?.description || ""}"`
      };
    }
  }

  /**
   * Get suggestion prompt for Step 10: Summary & Next Steps
   */
  private getSummaryNextStepsSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the refined big idea
    const refinedIdea = workshopData.refinedIdea?.description || workshopData.bigIdea?.description || 'your offer';

    // Get the selected problems
    const selectedPains = workshopData.problemUp?.selectedPains || [];
    const problems = workshopData.pains
      .filter(pain => selectedPains.includes(pain.id))
      .map(pain => pain.description)
      .join(', ');

    // Get the refined target market
    const targetMarket = workshopData.problemUp?.targetMoment || workshopData.bigIdea?.targetCustomers || 'your target market';

    return {
      system: `You are an AI assistant summarizing the user's workshop progress and suggesting concrete next steps focused *purely on validation*. The user has defined their target market, key problems to solve, and a refined offer concept. Your task is to generate 3-5 specific, actionable next steps designed to test the core assumptions of the offer and its messaging with the target market *before* significant product development.

# Task Description
Generate 3-5 specific, actionable next steps focused on testing/validating the offer concept and messaging with the target market *before* building the full product.

# Input Context
* Refined Target Market: "${targetMarket}"
* Focused Problems: ${problems || "Not specified yet"}
* Refined Offer Concept: "${refinedIdea}"

# Methodology & Constraints
-   Generate 3-5 distinct validation steps.
-   Steps must focus *exclusively* on *testing assumptions* with the target market (e.g., problem validation, message resonance, offer appeal, price sensitivity).
-   Actions must be concrete and specific (e.g., "Conduct 5 interviews focusing on X...", "Create a 1-page description detailing Y and ask Z...", "Run a $50 ad test comparing message A vs B...").
-   Emphasize testing *before* building the actual product/service.
-   Do *not* suggest building the product/service itself as a next step.
-   Steps should be practical and achievable in the short term (e.g., next 1-4 weeks).

# Output Format
Provide 3-5 distinct, actionable validation steps. Do not include any introductory or concluding text, only the list of options.`,
      user: `Please suggest 3-5 specific next steps to validate "${refinedIdea}" with ${targetMarket} before building the full product.`
    };
  }
}
