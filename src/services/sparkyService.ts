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
  stepContext?: number; // The step this message is associated with
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
        content: response.choices[0].message.content || '',
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
  private getMockBigIdeaResponse(message: string, _workshopData: WorkshopData): string {
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
  private getMockUnderlyingGoalResponse(message: string, _workshopData: WorkshopData): string {
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
   * Implements the revised guided questioning flow for broader trigger event brainstorming
   */
  private getMockTriggerEventsResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();

    // Store user responses for the guided questioning flow
    // In a real implementation, these would be stored in state
    // For mock purposes, we'll infer from the message content

    // Check if this is the first question about business description
    if (workshopData.triggerEvents.length === 0 &&
        !lowerMessage.includes('example') &&
        !lowerMessage.includes('suggestion') &&
        !lowerMessage.includes('type') &&
        !lowerMessage.includes('kind')) {

      // Store the business description (in a real implementation)
      // For now, just respond with the next question
      return "Thanks! Now, thinking about the kinds of customers you've worked with, or the types of problems your expertise typically solves:\n\nLooking back, what kind of specific situations, events, or acute frustrations have you noticed that seem to *push* people to finally reach out or start searching for a solution related to what you do?\n\n(For example: Did they miss a deadline? Did a competitor make a move? Did they get some tough feedback? Did a system break?)";
    }

    // Check if this is the second question about observed situations
    if (workshopData.triggerEvents.length === 0 &&
        lowerMessage.includes('miss') ||
        lowerMessage.includes('deadline') ||
        lowerMessage.includes('competitor') ||
        lowerMessage.includes('feedback') ||
        lowerMessage.includes('system')) {

      // Store the observed situations (in a real implementation)
      // For now, just respond with the optional third question
      return "That's helpful! And in those situations, what kind of feelings do you think these potential customers are experiencing?\n\n(e.g., Overwhelmed? Anxious? Embarrassed? Pressured? FOMO?) You can list a few, or I can also draw on common patterns.";
    }

    // Check if this is the third question about feelings
    if (workshopData.triggerEvents.length === 0 &&
        lowerMessage.includes('overwhelm') ||
        lowerMessage.includes('anxious') ||
        lowerMessage.includes('embarrass') ||
        lowerMessage.includes('pressure') ||
        lowerMessage.includes('fomo')) {

      // Store the feelings (in a real implementation)
      // For now, just respond with the transition to AI generation
      return "Excellent! Based on your business and those situations/frustrations you've seen, I'm going to brainstorm a broader range of potential Buying Triggers. This might include common feelings and pressures people experience in such scenarios.\n\nThis will give us a good list to start with. Give me a moment to generate these...";
    }

    // Standard responses for common questions
    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      return `Here are some example trigger events that might prompt customers to seek solutions in your field:\n\n1. Launched a DIY social media ad campaign for a seasonal promotion, only to see it get zero engagement and generate no new customers, leading to a feeling of wasted money and frustration.\n\n2. A new, slick competitor opened up down the street and immediately started running targeted online ads, making the business owner feel invisible and anxious about losing market share.\n\n3. Received a scathing 1-star online review from a customer that specifically mentioned how hard it was to find information about their services online, causing public embarrassment and immediate concern for their reputation.\n\n4. Spent an entire weekend trying to update their outdated website themselves, only to break something crucial and realize they are completely out of their depth and overwhelmed.\n\n5. Attended a local business networking event and felt a pang of jealousy as peers discussed successful online marketing strategies, highlighting their own lack of a clear plan.`;
    }

    if (lowerMessage.includes('type') || lowerMessage.includes('kind')) {
      return "There are several types of trigger events to consider:\n\n1. Situational triggers: External events like deadlines, launches, or new opportunities\n\n2. Internal/Emotional triggers: Internal feelings like frustration, overwhelm, or FOMO\n\n3. Social triggers: Comparisons to peers, client expectations, or industry standards\n\n4. Performance Gaps/Physical triggers: When systems break down, metrics drop, or physical evidence of a problem appears\n\nA good brainstorming session includes a mix of all these types to capture the full range of potential buying triggers.";
    }

    // Default response
    return "I'm here to help you brainstorm buying triggers! These are those specific moments or 'final straw' situations that shift a potential customer from just having a problem to actively looking for a solution.\n\nTo give you the most helpful suggestions, I'd like to understand:\n1. Your business or area of expertise\n2. Situations you've observed that push people to seek solutions\n3. Feelings customers might experience in those moments\n\nWould you like to start by telling me about your business?";
  }

  /**
   * Mock response for Jobs step
   */
  private getMockJobsResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const triggerEvents = workshopData.triggerEvents || [];
    const bigIdea = workshopData.bigIdea?.description || "your business";

    // Get the overarching job and supporting jobs
    const overarchingJob = workshopData.jobs.find(job => job.isOverarching);
    const supportingJobs = workshopData.jobs.filter(job => !job.isOverarching);

    // Check if we're in the initial overarching job discussion
    if (!overarchingJob && supportingJobs.length === 0) {
      if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
        return "Here are some example Overarching Job Statements in the proper format:\n\n1. Help me generate predictable revenue from my existing audience without spending more on ads.\n\n2. Help me build a sustainable business that doesn't depend on my constant presence.\n\n3. Help me transform my expertise into a scalable solution that serves more people.\n\nNotice how each follows the format: Help me [VERB] my [OBJECT] [CONTEXT]. These are big-picture statements that capture the fundamental progress your customers are trying to make.";
      }

      if (lowerMessage.includes('trigger') || lowerMessage.includes('context')) {
        const sampleTriggers = triggerEvents.slice(0, 2).map(t => `"${t.description}"`).join(' or ');
        return `Looking at your trigger events like ${sampleTriggers || "the ones we discussed"}, we can see patterns in what pushes customers to seek solutions. These triggers often reveal the underlying job they're trying to get done. For example, if a trigger is "Just saw a competitor's polished marketing materials," the job might be "Help me establish a professional brand identity that stands out from competitors."`;
      }

      if (lowerMessage.includes('format') || lowerMessage.includes('structure')) {
        return "The Overarching Job Statement should follow this format: 'Help me [VERB] my [OBJECT] [CONTEXT]'\n\nFor example: 'Help me generate predictable revenue from my existing audience without spending more on ads.'\n\n- VERB: Use active verbs like generate, build, transform, establish, etc.\n- OBJECT: What they're trying to improve or change\n- CONTEXT: The specific situation, constraints, or emotional state\n\nThis format captures the fundamental progress your customers are trying to make.";
      }

      return `I'd be happy to help you define the Overarching Job Statement for ${bigIdea}! This is about understanding the main progress your customers are trying to make, not just what they're buying.\n\nThink about: What fundamental problem are they trying to solve or aspiration are they trying to reach? What's the big-picture outcome they want?\n\nLet's craft this in the format 'Help me [VERB] my [OBJECT] [CONTEXT]'.`;
    }

    // If we have an overarching job but no supporting jobs, focus on supporting jobs
    if (overarchingJob && supportingJobs.length === 0) {
      if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
        return `Now that we have your Overarching Job Statement: "${overarchingJob.description}", let's think about Supporting Jobs.\n\nHere are some examples:\n\n1. Help me stay top-of-mind with my audience between launches.\n\n2. Help me convert more subscribers into paying customers.\n\n3. Help me feel confident my marketing systems are working.\n\n4. Help me maximize the value of each email subscriber.\n\nThese are more specific jobs that help achieve the main Overarching Job.`;
      }

      if (lowerMessage.includes('so that') || lowerMessage.includes('technique')) {
        return `The "so that" technique is a great way to refine job statements! Start with what customers think they want, then keep asking "so that..." to dig deeper.\n\nFor example:\n"I want email sequences... so that... I can sell to my list... so that... I can generate revenue... so that... I can have predictable income without constantly chasing new leads."\n\nThis reveals the true job: "Help me generate predictable revenue from my existing audience without spending more on ads or constantly creating new content."`;
      }

      return `Great! Now that we have your Overarching Job Statement: "${overarchingJob.description}", let's break it down into Supporting Jobs.\n\nWhat smaller, more specific 'jobs' or tasks would someone need to accomplish to get that main job done? Think about the steps, challenges, or related activities involved.`;
    }

    // If we have both overarching and supporting jobs
    if (lowerMessage.includes('next') || lowerMessage.includes('step')) {
      return `You've done a great job defining both your Overarching Job Statement and Supporting Jobs! Next, we'll use these to identify potential buyer segments who experience these jobs most intensely. This will help you target your offer to the right people.`;
    }

    if (lowerMessage.includes('refine') || lowerMessage.includes('improve')) {
      return `To refine your job statements further, try the "so that" technique. Take one of your current statements and ask "so that I can achieve what?" several times to get to the deeper motivation.\n\nAlso, make sure your statements follow the format "Help me [VERB] my [OBJECT] [CONTEXT]" and focus on the progress customers want to make, not the features they want to buy.`;
    }

    return `You've made great progress defining your Jobs-to-be-Done! You have an Overarching Job Statement: "${overarchingJob?.description || 'Not defined yet'}" and ${supportingJobs.length} Supporting Job(s).\n\nIs there anything specific about these job statements you'd like help with? I can help you refine them, add more supporting jobs, or explain how to use them in the next steps of the workshop.`;
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
      return `Here are some example pain points for ${segments[0] || "your target segment"} with FIRE evaluations:\n\n1. Spending weeks stuck on design tasks instead of focusing on their core business. (Functional) - FIRE Score: 10/12 (F:3, I:3, R:2, E:2) (High FIRE)\n\n2. Fear that a DIY look will make potential customers question their expertise. (Emotional/Social) - FIRE Score: 9/12 (F:3, I:3, R:1, E:2) (Medium FIRE)\n\n3. Feeling overwhelmed by the number of elements needed (website, social media, marketing materials). (Emotional) - FIRE Score: 7/12 (F:2, I:2, R:1, E:2) (Medium FIRE)\n\n4. Worrying that investing in professional help is too expensive before validating their idea. (Anticipated) - FIRE Score: 6/12 (F:1, I:2, R:1, E:2) (Low FIRE)\n\n5. Inability to create consistent visuals across different platforms and materials. (Functional) - FIRE Score: 8/12 (F:3, I:2, R:2, E:1) (Medium FIRE)`;
    }

    if (lowerMessage.includes('fire') || lowerMessage.includes('frequent') || lowerMessage.includes('intense') || lowerMessage.includes('recurring') || lowerMessage.includes('expensive')) {
      return "FIRE problems are the most painful and urgent issues your customers face. They are:\n\n- **F**requent: They happen often, not just occasionally\n- **I**ntense: They cause significant pain or frustration\n- **R**ecurring: They keep coming back even after temporary fixes\n- **E**xpensive: They cost time, money, opportunities, or reputation\n\nFIRE problems are the ones customers are most willing to pay to solve. When identifying pains, look for those that meet multiple FIRE criteria.\n\nYou can now evaluate each pain on a 1-3 scale for each FIRE dimension by clicking the expand button on any pain card. This helps you systematically identify which problems are most likely to drive buying decisions.";
    }

    if (lowerMessage.includes('score') || lowerMessage.includes('rating') || lowerMessage.includes('evaluate')) {
      return "The FIRE scoring system helps you evaluate each pain point across four dimensions:\n\n1. **Frequency (1-3)**: How often does this problem occur?\n   - Low (1): Rarely happens (quarterly or less)\n   - Medium (2): Happens occasionally (monthly)\n   - High (3): Happens frequently (weekly or daily)\n\n2. **Intensity (1-3)**: How painful is this problem when it occurs?\n   - Low (1): Minor annoyance\n   - Medium (2): Significant frustration\n   - High (3): Major pain point/blocker\n\n3. **Recurring (1-3)**: How often does this problem come back after being temporarily solved?\n   - Low (1): Once solved, it stays solved\n   - Medium (2): Returns occasionally\n   - High (3): Constantly returns despite attempts to fix it\n\n4. **Expensive (1-3)**: How costly is this problem in terms of money, time, opportunity, or reputation?\n   - Low (1): Minor cost/impact\n   - Medium (2): Noticeable cost/impact\n   - High (3): Significant cost/impact\n\nThe total FIRE score (4-12) helps you prioritize which problems to focus on. Problems with scores of 10-12 are considered 'High FIRE' and are most likely to drive buying decisions.";
    }

    if (lowerMessage.includes('type') || lowerMessage.includes('kind')) {
      return "There are several types of pains to consider:\n\n1. Functional Pains: Processes that break down, inefficiencies, technical roadblocks\n\n2. Emotional Pains: Frustration, overwhelm, anxiety, fear of failure\n\n3. Social Pains: How others perceive them, reputation risks, comparison to peers\n\n4. Anticipated Pains: Future risks or negative outcomes they worry about\n\nFIRE pains (Frequent, Intense, Recurring, Expensive) are especially important to identify.";
    }

    if (lowerMessage.includes('sort') || lowerMessage.includes('filter')) {
      return "You can now sort and filter your pain points to focus on the most important ones:\n\n- **Sort by FIRE score**: Click the 'Sort by FIRE score' button to arrange pains from highest to lowest FIRE score. This helps you quickly identify your hottest problems.\n\n- **Filter FIRE problems**: Click the 'Show FIRE problems only' button to display only pains that are marked as FIRE or have a FIRE score of 7 or higher. This helps you focus on the problems most likely to drive buying decisions.\n\nThese tools are especially useful when you have many pain points and need to identify which ones to prioritize for your offer.";
    }

    return `I'm here to help you identify and evaluate the painful problems your target buyers experience. What specific aspect of painstorming would you like help with? I can help you:\n\n- Brainstorm pain points for specific buyer segments\n- Explain the different types of pains (functional, emotional, social, anticipated)\n- Guide you through evaluating FIRE scores (Frequent, Intense, Recurring, Expensive)\n- Show you how to sort and filter your pain points to find the hottest problems\n\nYou can now expand each pain card to rate it on all four FIRE dimensions, giving you a systematic way to identify which problems are most likely to drive buying decisions.`;
  }

  /**
   * Mock response for Problem-Up step
   */
  private getMockProblemUpResponse(message: string, workshopData: WorkshopData): string {
    const lowerMessage = message.toLowerCase();
    const firePains = workshopData.pains?.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7)).map(pain => pain.description) || ["the FIRE pains"];
    const selectedBuyers = workshopData.targetBuyers?.filter(buyer => buyer.selected).map(buyer => buyer.description) || ["your target buyers"];
    const relevantTriggers = workshopData.triggerEvents?.filter(trigger => workshopData.problemUp?.relevantTriggerIds?.includes(trigger.id)).map(trigger => trigger.description) || [];

    // Check if the user is asking about target moment
    if (lowerMessage.includes('target moment') || lowerMessage.includes('define moment')) {
      return "A good Target Moment statement connects your primary buyer, a key trigger event, and their most acute pain into a specific scenario that drives buying decisions.\n\nThe format often follows this pattern:\n\n\"When [Target Buyer] experiences [Trigger Event], they acutely feel [Key Pain], making them look for a solution.\"\n\nFor example:\n\n\"When a marketing consultant loses a major client unexpectedly, they acutely feel the pain of unpredictable income and the intense pressure to find new leads fast, pushing them to find a reliable client acquisition system.\"\n\nThis clearly defines WHO is experiencing WHAT pain at WHICH moment, creating a focused foundation for your offer.";
    }

    // Check if the user is asking about connecting triggers
    if (lowerMessage.includes('trigger') || lowerMessage.includes('connect')) {
      return "Connecting trigger events to your primary pain and buyer is crucial for defining your Target Moment. Look for trigger events that:\n\n1. Most directly lead to your buyer experiencing the pain acutely\n2. Create urgency or emotional intensity\n3. Shift the buyer from 'aware of the problem' to 'actively seeking a solution'\n\nFor example, if your primary buyer is 'marketing consultants' and the primary pain is 'can't scale without working more hours', relevant triggers might include:\n- Losing a major client unexpectedly\n- Turning down a potential client due to capacity constraints\n- Missing family events due to work overload\n\nThese specific moments create the emotional intensity that drives buying decisions.";
    }

    // Check if the user is asking for examples or suggestions
    if (lowerMessage.includes('example') || lowerMessage.includes('suggestion')) {
      if (workshopData.problemUp?.selectedPains?.length === 1 && workshopData.problemUp?.selectedBuyers?.length === 1 && relevantTriggers.length > 0) {
        // They have made selections, so provide a personalized example
        const primaryPain = workshopData.pains.find(p => p.id === workshopData.problemUp?.selectedPains[0])?.description || firePains[0];
        const primaryBuyer = workshopData.targetBuyers.find(b => b.id === workshopData.problemUp?.selectedBuyers[0])?.description || selectedBuyers[0];
        const trigger = relevantTriggers[0];

        return `Based on your selections, here are some Target Moment options:\n\n1. When ${primaryBuyer} experiences ${trigger}, they acutely feel the pain of ${primaryPain}, driving them to urgently seek a solution.\n\n2. The moment ${primaryBuyer} realizes ${trigger}, the frustration of ${primaryPain} becomes unbearable, pushing them to find a way to solve this problem once and for all.\n\n3. After ${trigger}, ${primaryBuyer} can no longer ignore the pain of ${primaryPain}, creating an urgent need for a solution that addresses this specific challenge.`;
      } else {
        // Generic examples
        return "Here are some example Target Moment statements:\n\n1. When a marketing consultant loses a major client unexpectedly, they acutely feel the pain of unpredictable income and the intense pressure to find new leads fast, pushing them to find a reliable client acquisition system.\n\n2. The moment a course creator realizes their launch failed to meet sales targets, the frustration of inconsistent revenue becomes unbearable, driving them to seek a more predictable business model.\n\n3. After repeatedly missing family events due to work overload, a service provider can no longer ignore the pain of being unable to scale without working more hours, creating an urgent need for systems and automation.";
      }
    }

    if (lowerMessage.includes('market') || lowerMessage.includes('target')) {
      return "Here are some example Refined Target Market definitions:\n\n1. Targeting solopreneurs in their first 3 months of business who feel overwhelmed by branding tasks and worry about looking unprofessional.\n\n2. Focusing on non-designers launching their first online course who need professional visuals quickly but lack the budget for custom work.\n\n3. Serving founders who have just received negative feedback on their DIY branding and need an immediate, affordable fix.";
    }

    return `I'm here to help you define your "Target Moment" - the specific scenario where your ideal buyer feels a key pain acutely and becomes ready to seek a solution. This step connects your insights from previous steps into a focused foundation for your offer.\n\nTo create your Target Moment:\n\n1. Select ONE primary buyer segment and ONE primary pain that represent your strongest opportunity\n2. Connect these to the trigger events that most directly lead to this situation\n3. Define your Target Moment using the format: "When [Buyer] experiences [Trigger], they acutely feel [Pain], making them look for a solution"\n\nWhat specific aspect of this process would you like help with?`;
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
    const refinedIdeaName = workshopData.refinedIdea?.name || workshopData.offer?.name || "your offer";
    const refinedIdeaFormat = workshopData.refinedIdea?.format || workshopData.offer?.format || "";

    // Get the primary pain
    const primaryPainId = workshopData.problemUp?.selectedPains?.[0] || '';
    const primaryPain = workshopData.pains.find(p => p.id === primaryPainId);
    const primaryPainDesc = primaryPain?.description || '';

    // Get the primary buyer
    const primaryBuyerId = workshopData.problemUp?.selectedBuyers?.[0] || '';
    const primaryBuyer = workshopData.targetBuyers.find(b => b.id === primaryBuyerId);
    const primaryBuyerDesc = primaryBuyer?.description || '';

    // Get the selected job
    const selectedJob = workshopData.jobs.find(job => job.selected);
    const overarchingJob = workshopData.jobs.find(job => job.isOverarching);
    const jobStatement = selectedJob?.description || overarchingJob?.description || '';

    if (lowerMessage.includes('validate') || lowerMessage.includes('test') || lowerMessage.includes('next step')) {
      return `Great question about validation! Here are some effective ways to test your offer before building it:\n\n1. **Problem Validation Interviews (Next 7-10 days)**: Talk to 5-7 people who match your "${primaryBuyerDesc || 'target buyer'}" profile who might be experiencing your defined Target Moment. Focus on understanding if they truly experience the problem you're solving (${primaryPainDesc || 'your identified pain'}), how they currently address it, and what they'd value in a solution. *This confirms you're solving a real, painful problem.*\n\n2. **Solution Concept Testing (Next 2 weeks)**: Create a simple 1-page description of your solution and share it with potential customers. Ask specific questions about what resonates, what's confusing, and if they'd be willing to pay for it. *This tests your core messaging and value proposition.*\n\n3. **Competitor Analysis (Next 5 days)**: Identify 3-5 existing alternatives your target market might be using. Study their messaging, pricing, and customer reviews to understand gaps you could fill. *This helps refine your unique selling proposition and differentiation.*\n\n4. **"Smoke Test" Landing Page (Next 2-3 weeks)**: Create a simple landing page describing your offer with a sign-up form for "early access." Run minimal ads to drive traffic and measure conversion rates. *This is a low-cost way to test initial market interest.*\n\nRemember, the goal is to validate your assumptions before investing significant time and resources into building the full solution.`;
    }

    if (lowerMessage.includes('insight') || lowerMessage.includes('learn')) {
      return `Based on your workshop journey, here are some key insights you've likely gained:\n\n- **Target Clarity**: You've moved from a broad initial idea to a focused understanding of exactly who your offer serves (${primaryBuyerDesc || 'your target buyer'}) and when they most need it (your Target Moment).\n\n- **Problem Depth**: You've identified that ${primaryPainDesc || 'your primary pain point'} is not just a surface-level annoyance but a deeply felt FIRE problem (Frequent, Intense, Recurring, Expensive) for your target buyers.\n\n- **Trigger Awareness**: You now understand the specific catalysts that push your buyers from "aware of the problem" to "actively seeking a solution" - this timing insight is crucial for marketing messaging.\n\n- **Solution Alignment**: Your refined offer has evolved to directly address the specific job-to-be-done and pain points of your target buyers, rather than being a generic solution looking for a problem.\n\nThese insights provide a solid foundation for creating an offer that truly resonates with your target market.`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('recap')) {
      return `Here's a summary of your workshop journey:\n\n**Target Market Focus:**\n- Primary Target Buyer: ${primaryBuyerDesc || 'Not specified'}\n- Identified Target Moment: ${workshopData.problemUp?.targetMoment || 'Not specified'}\n\n**Problem Space Solved:**\n- Primary Pain Addressed: ${primaryPainDesc || 'Not specified'}\n- Overarching Job-to-be-Done: ${jobStatement || 'Not specified'}\n- Key Supporting Jobs: ${workshopData.jobs.filter(job => job.selected && !job.isOverarching).map(job => job.description).join(', ') || 'Not specified'}\n\n**Your Refined Offer:**\n- Name: ${refinedIdeaName}\n- Format: ${refinedIdeaFormat}\n- Description: ${refinedIdea}\n\nThe crucial next step is validating this with real potential customers before building the full solution. This will save you time and ensure you're creating something people actually want.`;
    }

    if (lowerMessage.includes('interview') || lowerMessage.includes('validation interview')) {
      return `For Problem Validation Interviews, the key is to listen more than you talk. Here are a few tips:\n\n1. **Goal:** Confirm the problem is real, frequent, and painful for them. Understand their current process and its frustrations. *Don't pitch your solution yet!*\n\n2. **Who to Talk To:** People who *exactly* match your '${primaryBuyerDesc || 'target buyer'}' profile and might be in (or have recently experienced) your Target Moment.\n\n3. **Key Questions to Ask:**\n   * "Tell me about the last time you dealt with ${primaryPainDesc || 'this problem'}..."\n   * "What was going on that made that particularly challenging?"\n   * "What did you try to do about it? How did that work out?"\n   * "What was the most frustrating part of that experience?"\n   * "If you could wave a magic wand, what would the ideal solution look like for you?"\n\n4. **Listen for:** Specific stories, emotions, workarounds, and the actual words they use to describe their pain.\n\nAim for about 5 insightful conversations. Would you like more example questions or tips on finding people for these interviews?`;
    }

    return `Congratulations on completing the Buyer Breakthrough Workshop! You've made incredible progress in defining your offer.\n\nYou've identified your primary target buyer (${primaryBuyerDesc || 'your target market'}), the key pain you're solving (${primaryPainDesc || 'your primary pain'}), and refined your offer concept (${refinedIdea}).\n\nThe most important next step is to validate your concept with real potential buyers before building the full solution. Would you like me to suggest specific validation activities you could implement in the next few weeks? Or would you prefer to discuss key insights from your workshop journey?`;
  }

  /**
   * Generate suggestions based on the current step and context
   */
  async generateSuggestions(
    currentStep: number,
    workshopData: WorkshopData,
    type: string,
    userMessage?: string
  ): Promise<SuggestionOption[]> {
    try {
      // If using mock responses, generate mock suggestions
      if (this.useMockResponses) {
        return this.generateMockSuggestions(currentStep, type, workshopData, userMessage);
      }

      // Get the appropriate suggestion prompt for the current step and type
      const suggestionPrompt = this.getSuggestionPromptForStep(currentStep, type, workshopData);

      // If we have a user message, add it to the prompt
      let userPrompt = suggestionPrompt.user;
      if (userMessage && userMessage.trim()) {
        userPrompt += `\n\nPlease consider the user's latest message when generating suggestions: "${userMessage}"`;
      }

      // Generate the suggestions using the OpenAI service
      const response = await this.openai.generateCompletion(
        suggestionPrompt.system,
        userPrompt,
        0.7,
        this.model
      );

      // Parse the suggestions from the response
      return this.parseSuggestions(response, type);
    } catch (error) {
      console.error('Error generating suggestions:', error);

      // Fall back to mock suggestions if API fails
      return this.generateMockSuggestions(currentStep, type, workshopData, userMessage);
    }
  }

  /**
   * Generate mock suggestions based on the current step and type
   */
  private generateMockSuggestions(
    currentStep: number,
    type: string,
    _workshopData: WorkshopData,
    userMessage?: string
  ): SuggestionOption[] {
    // Generate 3-5 mock suggestions based on the step and type
    const suggestions: SuggestionOption[] = [];

    // If we have a user message for step 2 (Big Idea) that mentions AI, coding, or courses,
    // generate custom suggestions
    if (currentStep === 2 && userMessage && /ai|artificial intelligence|coding|course|lead magnet/i.test(userMessage)) {
      return [
        {
          id: `suggestion-${Date.now()}-1`,
          content: `An 8-week course that teaches non-technical marketers how to create AI-powered lead magnets using no-code tools.`,
          type
        },
        {
          id: `suggestion-${Date.now()}-2`,
          content: `A step-by-step program that helps content creators build AI-enhanced lead generation tools without coding knowledge.`,
          type
        },
        {
          id: `suggestion-${Date.now()}-3`,
          content: `A workshop series that teaches digital marketers how to use AI coding tools like Bolt to create personalized lead magnets.`,
          type
        }
      ];
    }

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
          { id: `suggestion-${Date.now()}-1`, content: 'Launched a DIY social media ad campaign for a seasonal promotion, only to see it get zero engagement and generate no new customers, leading to a feeling of wasted money and frustration.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'A new, slick competitor opened up down the street and immediately started running targeted online ads, making the business owner feel invisible and anxious about losing market share.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Received a scathing 1-star online review from a customer that specifically mentioned how hard it was to find information about their services online, causing public embarrassment and immediate concern for their reputation.', type },
          { id: `suggestion-${Date.now()}-4`, content: 'Spent an entire weekend trying to update their outdated website themselves, only to break something crucial and realize they are completely out of their depth and overwhelmed.', type },
          { id: `suggestion-${Date.now()}-5`, content: 'Attended a local business networking event and felt a pang of jealousy as peers discussed successful online marketing strategies, highlighting their own lack of a clear plan.', type },
          { id: `suggestion-${Date.now()}-6`, content: 'Their most reliable referral source unexpectedly dried up, creating a sudden and urgent need to find new, consistent ways to attract customers.', type },
          { id: `suggestion-${Date.now()}-7`, content: 'Realized their children are more tech-savvy about online promotion than they are, leading to a moment of self-doubt about their ability to keep the business modern.', type },
          { id: `suggestion-${Date.now()}-8`, content: 'Noticed foot traffic has been steadily declining for three consecutive months, forcing them to confront that "word-of-mouth" alone isn\'t cutting it anymore.', type },
          { id: `suggestion-${Date.now()}-9`, content: 'A potential customer called, explicitly stating they "couldn\'t find much about you online" before choosing a more visible competitor.', type },
          { id: `suggestion-${Date.now()}-10`, content: 'After calculating year-end financials, they saw that marketing spend was high but new customer acquisition was flat, triggering a need for a more effective approach.', type }
        );
        break;

      case 5: // Jobs
        // Check if we're looking for overarching or supporting jobs
        if (type === 'overarching' || (!_workshopData.jobs.find(job => job.isOverarching))) {
          suggestions.push(
            { id: `suggestion-${Date.now()}-1`, content: 'Help me generate predictable revenue from my existing audience without spending more on ads.', type },
            { id: `suggestion-${Date.now()}-2`, content: 'Help me build a sustainable business that doesn\'t depend on my constant presence.', type },
            { id: `suggestion-${Date.now()}-3`, content: 'Help me transform my expertise into a scalable solution that serves more people.', type }
          );
        } else {
          suggestions.push(
            { id: `suggestion-${Date.now()}-1`, content: 'Help me stay top-of-mind with my audience between launches.', type },
            { id: `suggestion-${Date.now()}-2`, content: 'Help me convert more subscribers into paying customers.', type },
            { id: `suggestion-${Date.now()}-3`, content: 'Help me feel confident my marketing systems are working.', type },
            { id: `suggestion-${Date.now()}-4`, content: 'Help me maximize the value of each email subscriber.', type }
          );
        }
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
          { id: `suggestion-${Date.now()}-1`, content: 'Spending weeks stuck on design tasks instead of focusing on their core business. (Functional) - FIRE Score: 10/12 (F:3, I:3, R:2, E:2) (High FIRE)', type },
          { id: `suggestion-${Date.now()}-2`, content: 'Fear that a DIY look will make potential customers question their expertise. (Emotional/Social) - FIRE Score: 9/12 (F:3, I:3, R:1, E:2) (Medium FIRE)', type },
          { id: `suggestion-${Date.now()}-3`, content: 'Feeling overwhelmed by the number of elements needed (website, social media, marketing materials). (Emotional) - FIRE Score: 7/12 (F:2, I:2, R:1, E:2) (Medium FIRE)', type },
          { id: `suggestion-${Date.now()}-4`, content: 'Worrying that investing in professional help is too expensive before validating their idea. (Anticipated) - FIRE Score: 6/12 (F:1, I:2, R:1, E:2) (Low FIRE)', type }
        );
        break;

      case 8: // Problem-Up
        suggestions.push(
          { id: `suggestion-${Date.now()}-1`, content: 'When a marketing consultant loses a major client unexpectedly, they acutely feel the pain of unpredictable income and the intense pressure to find new leads fast, pushing them to find a reliable client acquisition system.', type },
          { id: `suggestion-${Date.now()}-2`, content: 'The moment a course creator realizes their launch failed to meet sales targets, the frustration of inconsistent revenue becomes unbearable, driving them to seek a more predictable business model.', type },
          { id: `suggestion-${Date.now()}-3`, content: 'After repeatedly missing family events due to work overload, a service provider can no longer ignore the pain of being unable to scale without working more hours, creating an urgent need for systems and automation.', type }
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
        if (type === 'keyInsights') {
          suggestions.push(
            { id: `suggestion-${Date.now()}-1`, content: '- **Target Clarity**: You\'ve moved from a broad initial idea to a focused understanding of exactly who your offer serves and when they most need it (your Target Moment).', type },
            { id: `suggestion-${Date.now()}-2`, content: '- **Problem Depth**: You\'ve identified that your primary pain point is not just a surface-level annoyance but a deeply felt FIRE problem (Frequent, Intense, Recurring, Expensive) for your target buyers.', type },
            { id: `suggestion-${Date.now()}-3`, content: '- **Trigger Awareness**: You now understand the specific catalysts that push your buyers from "aware of the problem" to "actively seeking a solution" - this timing insight is crucial for marketing messaging.', type },
            { id: `suggestion-${Date.now()}-4`, content: '- **Solution Alignment**: Your refined offer has evolved to directly address the specific job-to-be-done and pain points of your target buyers, rather than being a generic solution looking for a problem.', type }
          );
        } else if (type === 'nextSteps') {
          suggestions.push(
            { id: `suggestion-${Date.now()}-1`, content: '1. **Problem Validation Interviews (Next 7-10 days)**: Talk to 5-7 people who match your target buyer profile who might be experiencing your defined Target Moment. Focus on understanding if they truly experience the problem you\'re solving, how they currently address it, and what they\'d value in a solution. *This confirms you\'re solving a real, painful problem.*', type },
            { id: `suggestion-${Date.now()}-2`, content: '2. **Solution Concept Testing (Next 2 weeks)**: Create a simple 1-page description of your solution and share it with potential customers. Ask specific questions about what resonates, what\'s confusing, and if they\'d be willing to pay for it. *This tests your core messaging and value proposition.*', type },
            { id: `suggestion-${Date.now()}-3`, content: '3. **Competitor Analysis (Next 5 days)**: Identify 3-5 existing alternatives your target market might be using. Study their messaging, pricing, and customer reviews to understand gaps you could fill. *This helps refine your unique selling proposition and differentiation.*', type },
            { id: `suggestion-${Date.now()}-4`, content: '4. **"Smoke Test" Landing Page (Next 2-3 weeks)**: Create a simple landing page describing your offer with a sign-up form for "early access." Run minimal ads to drive traffic and measure conversion rates. *This is a low-cost way to test initial market interest.*', type }
          );
        } else {
          suggestions.push(
            { id: `suggestion-${Date.now()}-1`, content: 'What were your biggest "aha!" moments during this workshop?', type },
            { id: `suggestion-${Date.now()}-2`, content: 'What specific validation activities would be most appropriate for your offer and target market?', type },
            { id: `suggestion-${Date.now()}-3`, content: 'What\'s the single biggest assumption about your offer that needs testing?', type }
          );
        }
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
  private getSystemPromptForStep(currentStep: number, _workshopData: WorkshopData): string {
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
        stepPrompt = `Help the user explore Buying Triggers through a guided questioning flow that shifts from narrowly focusing on their current Big Idea V1 to a broader exploration of potential triggers related to the user's general business/expertise and the types of problems such businesses often solve.

Guided Questioning Flow:
1. First, gather context about the user's business or primary area of expertise
2. Next, ask about observed situations or frustrations that push customers to seek solutions
3. Optionally, ask about associated feelings customers might experience
4. Then transition to AI-generated suggestions for a broader range of potential triggers

Example guidance questions:
- "Tell me a bit about your business or your primary area of expertise. What do you generally do?"
- "What kind of specific situations or acute frustrations have you noticed that seem to *push* people to finally reach out?"
- "In those situations, what kind of feelings might these potential customers be experiencing?"

The goal is to identify a broad range of specific moments or situations (10-15) when potential customers would be motivated to seek a solution, without being overly constrained by the user's initial Big Idea V1.`;
        break;

      case 5: // Define Job-to-be-Done
        stepPrompt = `Help the user brainstorm potential jobs their customers are trying to get done, clearly separating Overarching Jobs from Supporting Jobs. Use the user's business context and trigger events from previous steps to inform your suggestions.

Guided Questioning Flow:
1. First, help the user identify the Overarching Job (the main, high-level progress a customer is trying to make)
2. Once an Overarching Job is defined, help the user identify Supporting Jobs (more specific tasks that help achieve the main job)
3. Use the "so that" technique to refine job statements if needed

Example guidance questions:
- "Looking at your business and those Buying Triggers we brainstormed, what's the main, high-level 'job' or 'progress' a customer is trying to make?"
- "Now that we have your Overarching Job, what smaller, more specific 'jobs' would someone need to accomplish to get that main job done?"
- "Let's use the 'so that...' method. A customer wants [Initial Desire]... so that... they can achieve what?"

The goal is to define both the Overarching Job (the fundamental progress) and Supporting Jobs (more specific tasks) that customers are trying to accomplish.`;
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
        stepPrompt = `For the user's top 3 target buyer segments, help brainstorm specific pains (Functional, Emotional, Social, Anticipated) they experience related to the chosen Job-to-be-Done. Guide them in using the enhanced FIRE evaluation system (Frequent, Intense, Recurring, Expensive) with 1-3 ratings for each dimension.

Example guidance questions:
- "For [Segment 1], what functional roadblocks might they hit trying to do this job? What processes break down?"
- "What are the emotional costs for [Segment 2] if they fail to get this job done well?"
- "How might [Segment 3]'s peers or clients perceive them if they struggle with this job? (Social pains)"
- "For this pain, how would you rate its frequency on a scale of 1-3?"
- "How intense is this pain when it occurs? Is it a minor annoyance or a major blocker?"
- "Does this problem keep recurring even after temporary fixes?"
- "How expensive is this problem in terms of money, time, opportunity, or reputation?"

Explain the FIRE scoring system (4-12 scale) and how it helps prioritize problems:
- Frequency (1-3): How often the problem occurs
- Intensity (1-3): How painful the problem is when it occurs
- Recurring (1-3): How often the problem returns after being temporarily solved
- Expensive (1-3): How costly the problem is in various dimensions

Also guide them in using the sort and filter features to focus on the highest-scoring FIRE problems.

The goal is to systematically identify and prioritize the most painful problems worth solving.`;
        break;

      case 8: // Problem-Up
        stepPrompt = `Help the user define their "Target Moment" - the specific scenario where their ideal buyer feels a key pain acutely and becomes ready to seek a solution. Guide them through connecting their primary buyer, primary pain, and relevant trigger events into a focused statement.

Example guidance questions:
- "Which ONE primary buyer segment represents your strongest opportunity?"
- "Which ONE primary pain point do you feel most qualified or excited to solve?"
- "Which trigger events most directly lead this buyer to experience this pain acutely?"
- "How would you describe the exact moment when this buyer becomes ready to seek a solution?"

The goal is to create a clear Target Moment statement that follows this pattern:
"When [Target Buyer] experiences [Trigger Event], they acutely feel [Key Pain], making them look for a solution."

This Target Moment will be the foundation for their offer design in subsequent steps.`;
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
        stepPrompt = `You are "Sparky," an expert AI workshop assistant from CustomerCamp, specializing in offer design, buyer psychology, and the "Problem-Up" methodology. The user has just completed the Buyer Breakthrough Workshop. Your task is to help them synthesize their entire workshop journey into key insights and actionable next steps.

Example guidance questions:
- "Based on your journey from initial idea to refined offer, what were your biggest 'aha!' moments about your target market or the problems they face?"
- "Looking at your defined Target Moment: When [Buyer] experiences [Trigger], they acutely feel [Pain] - what's the single biggest assumption here that needs validation?"
- "What specific, small actions could you take in the next 7-30 days to validate your offer concept with real potential buyers before building anything major?"
- "Which validation method would be most appropriate for your specific offer and target market: problem interviews, solution interviews, a landing page test, or something else?"

The goal is to help the user reflect meaningfully on their workshop journey, identify key insights, and create a concrete, validation-focused action plan as their next steps.`;
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
  private getBigIdeaSuggestionPrompt(_type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Check if we're refining an existing idea or brainstorming from scratch
    const isRefining = workshopData.bigIdea?.description ? workshopData.bigIdea.description.trim().length > 0 : false;

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
  private getUnderlyingGoalSuggestionPrompt(_type: string, workshopData: WorkshopData): {
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
  private getTriggerEventsSuggestionPrompt(_type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Extract user's business description from the chat history if available
    // In a real implementation, this would come from stored state
    const userBusinessDescription = workshopData.bigIdea?.targetCustomers || "Not directly provided";

    // Extract observed situations from the chat history if available
    // In a real implementation, this would come from stored state
    const userObservedSituations = workshopData.triggerEvents?.length > 0
      ? workshopData.triggerEvents.map(t => t.description).join(', ')
      : "Not directly provided";

    return {
      system: `You are an expert in consumer behavior, deeply familiar with the work of Katelyn Bourgoin, Bob Moesta, Alan Klement, Byron Sharp, and Robert Cialdini. Your task is to help a user brainstorm a comprehensive list of potential buying Triggers (also known as "trigger events") that might push a new customer into the buying journey for products or services related to the user's general line of business or expertise. The user is early in their offer design process and may not have a specific "Big Idea" or "Target Customer" fully defined yet.

# Task Description
Generate 10-15 distinct, plausible Trigger Events. These events must represent specific moments, situations, or realizations (the 'final straw') that would likely create urgency and push a potential customer from passively experiencing a struggle (related to the user's business area) to actively seeking a solution.

# Input Context
1. User's Business / Area of Expertise: "${userBusinessDescription}" - What the user generally does or offers.
2. Observed Situations/Frustrations by User: "${userObservedSituations}" - Specific scenarios the user has seen that indicate a customer might need a solution.
3. User's Big Idea (Optional): "${workshopData.bigIdea?.description || "Not fully defined yet"}" - The user's initial product/service concept.

# Methodology & Constraints
- Trigger Definition: Buying triggers are specific events or stimuli that push a customer towards a purchase decision. Focus strictly on identifying specific catalyst events, situations, experiences, or realizations that move the customer into the buying journey. These are the moments that create urgency and make the status quo unacceptable.
- Broad Brainstorming: Since the user is early in the process, aim for a diverse range of triggers relevant to the user's general field of business. Do not overly constrain triggers to a single, narrow V1 idea if the user's business description is broader.
- Customer Perspective: Phrase all triggers vividly from the *customer's* viewpoint and experience. What actually happens to them? What do they think or feel in that moment?
- Specificity & Concreteness: Avoid vague triggers. Aim for concrete moments. *Instead of* "Needs better marketing," *prefer* "Just saw a competitor's ad campaign that made their own marketing look amateurish and outdated."
- Mix of Types: Generate a mix of trigger types:
  - **(Situational):** e.g., "Their main client, representing 40% of revenue, just announced they're not renewing their contract."
  - **(Internal/Emotional):** e.g., "Woke up at 3 AM for the fifth night in a row, stressed about whether the business will survive the current downturn, and realized something fundamental has to change."
  - **(Social):** e.g., "Overheard a respected peer at a conference casually mention how a new tool tripled their team's productivity, making them feel acutely behind the curve."
  - **(Performance Gaps/Physical):** e.g., "The custom-coded website crashed during the biggest sales event of the year, losing thousands in potential orders."
- Infer Emotions: Use your broad knowledge to infer and incorporate likely strong emotions into the trigger descriptions to make them more compelling.

# Output Format
Provide exactly 10-15 distinct Trigger Event options, each described clearly and specifically from the customer's viewpoint. Try to subtly weave in the implied emotion or state of mind. Do not include any introductory or concluding text, only the list of options.

1. [Trigger Event Option 1: Specific situation/moment/realization reflecting the inputs, incorporating likely emotions]
2. [Trigger Event Option 2]
... (up to 15)`,
      user: `Please generate 10-15 specific trigger events based on the user's business area: "${userBusinessDescription}" and observed situations: "${userObservedSituations}"`
    };
  }

  /**
   * Get suggestion prompt for Step 5: Jobs
   */
  private getJobsSuggestionPrompt(type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the overarching job
    const overarchingJob = workshopData.jobs.find(job => job.isOverarching);

    // Check if we're refining
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
    } else if (type === 'overarching' || !overarchingJob) {
      // Generating Overarching Job statements
      return {
        system: `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology by Clayton Christensen and Bob Moesta. Your primary task is to help the user formulate a single, compelling "Overarching Job Statement" based on their business context and previously identified customer buying triggers.

# Task Description
Generate 2-3 distinct "Overarching Job Statement" options that represent the main, high-level progress a potential customer is trying to make, which would lead them to seek solutions related to the user's business/expertise.

# Input Context Provided by User/Workshop:
1.  User's Business / Area of Expertise: "${workshopData.bigIdea?.description || ""}"
2.  Key Buying Triggers Observed/Brainstormed: [${workshopData.triggerEvents?.map(t => `"${t.description}"`).join(', ') || "None specified"}]
3.  User's Desired Business Outcomes for their new offer: "${workshopData.underlyingGoal?.businessGoal || ""}"

# Methodology & Constraints
-   Focus on Progress: The Overarching Job Statement MUST describe the customer's fundamental desired progress or problem to be solved, NOT the user's product features.
-   Solution-Agnostic: The statement should be broad enough that multiple different solutions could potentially fulfill this main job.
-   Format: Strictly adhere to: "Help me [VERB] my [OBJECT] [CONTEXT]". Use clear, active verbs.
-   Context is Key: Incorporate relevant high-level context (e.g., life stage, business stage, core motivations) derived from the inputs. The "CONTEXT" part of the statement should reflect the circumstances or desired state.
-   High-Level: This is the "big picture" job. Avoid getting too granular; that's for supporting jobs.
-   Avoid Common Mistakes: Do not generate statements that are product-focused, too vague, feature-oriented, or treat a solution category as the job itself.

# Output Format
Provide exactly 2-3 distinct Overarching Job Statement options. Each statement should be on a new line. Do not include any other labels or introductory text.

Help me [VERB] my [OBJECT] [CONTEXT]
Help me [VERB] my [OBJECT] [CONTEXT]
Help me [VERB] my [OBJECT] [CONTEXT]`,
        user: `Please generate 2-3 Overarching Job Statement options based on my business: "${workshopData.bigIdea?.description || "Not specified"}" and the trigger events I've identified.`
      };
    } else {
      // Generating Supporting Job statements
      return {
        system: `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology. The user has defined an Overarching Job Statement. Your task is to generate 3-5 distinct "Supporting Job Statements" that represent more specific tasks, goals, or progress a customer needs to make to successfully achieve that Overarching Job.

# Task Description
Generate 3-5 distinct "Supporting Job Statements".

# Input Context Provided by User/Workshop:
1.  User's Defined Overarching Job Statement: "${overarchingJob?.description || ""}"
2.  User's Business / Area of Expertise: "${workshopData.bigIdea?.description || ""}"
3.  Key Buying Triggers Observed/Brainstormed: [${workshopData.triggerEvents?.map(t => `"${t.description}"`).join(', ') || "None specified"}]
4.  User's Desired Business Outcomes: "${workshopData.underlyingGoal?.businessGoal || ""}"

# Methodology & Constraints
-   Directly Support Overarching Job: Each Supporting Job MUST be a logical sub-component, prerequisite, or related activity necessary for achieving the Overarching Job Statement.
-   Focus on Progress: Statements MUST describe the customer's desired progress.
-   Solution-Agnostic: Statements should be broad enough that multiple different solutions could potentially fulfill them.
-   Format: Strictly adhere to the format: "Help me [VERB] my [OBJECT] [CONTEXT]". Use clear, active verbs.
-   Context is Key: Incorporate relevant context derived from the inputs, particularly how it relates to the Overarching Job.
-   Granularity: These jobs are more specific than the Overarching Job but should not be mere task-list items. They are still "jobs" in themselves.
-   Avoid Common Mistakes: Do not generate statements that are product-focused, too vague, or feature-oriented.

# Output Format
Provide exactly 3-5 distinct Supporting Job Statement options. Each statement should be on a new line. Do not include any other labels or introductory text.

Help me [VERB] my [OBJECT] [CONTEXT]
Help me [VERB] my [OBJECT] [CONTEXT]
Help me [VERB] my [OBJECT] [CONTEXT]`,
        user: `Please generate 3-5 Supporting Job Statements that would help achieve the Overarching Job: "${overarchingJob?.description || "Not specified"}"`
      };
    }
  }

  /**
   * Get suggestion prompt for Step 6: Target Buyers
   */
  private getTargetBuyersSuggestionPrompt(_type: string, workshopData: WorkshopData): {
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
  private getPainstormingSuggestionPrompt(_type: string, workshopData: WorkshopData): {
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
      system: `You are an AI assistant specialized in Painstorming based on JTBD. Your task is to generate specific pain points for each of the user's top 3 target buyer segments related to their chosen Job Statement, and provide initial FIRE scores for each pain.

# Task Description
For *each* of the 3 target segments provided, generate 3-5 specific pain points they likely experience when trying to achieve the Job Statement. Evaluate each pain using the FIRE framework and identify potential overlapping pains across segments.

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
-   For each pain, provide an initial FIRE evaluation with scores for each dimension:
    * Frequency (1-3): How often the problem occurs
    * Intensity (1-3): How painful the problem is when it occurs
    * Recurring (1-3): How often the problem returns after being temporarily solved
    * Expensive (1-3): How costly the problem is in various dimensions
-   Calculate a total FIRE score (4-12) for each pain.
-   Mark pains with high FIRE scores (10-12) as "(High FIRE)", medium scores (7-9) as "(Medium FIRE)", and low scores (4-6) as "(Low FIRE)".
-   Identify 1-2 key pains that seem likely to overlap across multiple provided segments at the end.
-   Ensure pains are specific and plausible for the segment and job context.

# Output Format
Structure the output clearly by segment, then list overlapping pains. For each pain, include the FIRE evaluation in a concise format. Do not include any introductory or concluding text, only the formatted output.

Example format for each pain:
"[Pain description] (Pain Type) - FIRE Score: [Total]/12 (F:[Score], I:[Score], R:[Score], E:[Score]) (High/Medium/Low FIRE)"`,
      user: `Please generate specific pain points for each of these buyer segments related to the job statement: "${selectedJob?.description || "Not specified"}". For each pain, include a FIRE evaluation (Frequency, Intensity, Recurring, Expensive) on a 1-3 scale for each dimension.`
    };
  }

  /**
   * Get suggestion prompt for Step 8: Problem-Up
   */
  private getProblemUpSuggestionPrompt(_type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the primary pain if selected
    const primaryPainId = workshopData.problemUp?.selectedPains?.[0] || '';
    const primaryPain = workshopData.pains.find(p => p.id === primaryPainId);

    // Get the primary buyer if selected
    const primaryBuyerId = workshopData.problemUp?.selectedBuyers?.[0] || '';
    const primaryBuyer = workshopData.targetBuyers.find(b => b.id === primaryBuyerId);

    // Get the relevant trigger events
    const relevantTriggerIds = workshopData.problemUp?.relevantTriggerIds || [];
    const relevantTriggers = workshopData.triggerEvents
      .filter(trigger => relevantTriggerIds.includes(trigger.id))
      .map(trigger => trigger.description)
      .join('\n* ');

    // Get the selected job
    const selectedJob = workshopData.jobs.find(job => job.selected);

    return {
      system: `You are an expert offer design assistant specializing in crafting precise "Target Moment" statements. A Target Moment defines the specific scenario where an ideal buyer, prompted by a trigger, acutely experiences a key pain, making them actively seek a solution.

# Task Description
Generate 2-3 distinct, compelling "Target Moment" statements based on the user's selected primary Target Buyer, primary Pain, and the Trigger Event(s) they've identified as most relevant to this combination.

# Input Context Provided by User/Workshop:
1.  Primary Target Buyer: "${primaryBuyer?.description || "Not specified yet"}"
2.  Primary Key Pain: "${primaryPain?.description || "Not specified yet"}"
3.  Most Relevant Trigger Event(s): [${relevantTriggers || "Not specified yet"}]
4.  (Optional Context) Overarching Job Statement: "${selectedJob?.description || "Not specified yet"}"

# Methodology & Constraints
-   Synthesis: Combine the Buyer, Trigger(s), and Pain into a concise narrative moment.
-   Format: Aim for a structure like: "When [Target Buyer] experiences [Trigger Event(s)], they are confronted with the intense problem of [Pain], driving them to urgently seek a solution that helps them achieve [related aspect of Job Statement, if applicable]."
    - OR "The moment [Target Buyer] realizes [Trigger Event outcome], the frustration of [Pain] becomes unbearable, pushing them to find a way to [related aspect of Job Statement, if applicable]."
-   Focus on Urgency & Action: The statement should imply why the buyer is now *actively looking*.
-   Clarity & Specificity: Ensure the moment is clearly understandable and specific.
-   Customer-Centric Language: Phrase from the perspective of understanding the buyer's world.

# Output Format
Provide 2-3 distinct Target Moment statement options. Each statement should be on a new line. Do not include any other labels or introductory text.

[Target Moment Option 1]
[Target Moment Option 2]
[Target Moment Option 3 (Optional)]`,
      user: `Please generate 2-3 Target Moment statements based on my selected primary buyer, primary pain, and relevant trigger events.`
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
  private getSummaryNextStepsSuggestionPrompt(_type: string, workshopData: WorkshopData): {
    system: string;
    user: string;
  } {
    // Get the refined big idea
    const refinedIdea = workshopData.refinedIdea?.description || workshopData.bigIdea?.description || 'your offer';
    const refinedIdeaName = workshopData.refinedIdea?.name || workshopData.offer?.name || 'your offer';
    const refinedIdeaFormat = workshopData.refinedIdea?.format || workshopData.offer?.format || '';

    // Get the selected job
    const selectedJob = workshopData.jobs.find(job => job.selected);
    const overarchingJob = workshopData.jobs.find(job => job.isOverarching);
    const jobStatement = selectedJob?.description || overarchingJob?.description || '';

    // Get the primary pain
    const primaryPainId = workshopData.problemUp?.selectedPains?.[0] || '';
    const primaryPain = workshopData.pains.find(p => p.id === primaryPainId);
    const primaryPainDesc = primaryPain?.description || '';

    // Get the primary buyer
    const primaryBuyerId = workshopData.problemUp?.selectedBuyers?.[0] || '';
    const primaryBuyer = workshopData.targetBuyers.find(b => b.id === primaryBuyerId);
    const primaryBuyerDesc = primaryBuyer?.description || '';

    // Get the target moment
    const targetMoment = workshopData.problemUp?.targetMoment || '';

    // Get relevant trigger events
    const relevantTriggerIds = workshopData.problemUp?.relevantTriggerIds || [];
    const relevantTriggersText = workshopData.triggerEvents
      .filter(trigger => relevantTriggerIds.includes(trigger.id))
      .map(trigger => trigger.description)
      .join(', ');

    return {
      system: `You are "Sparky," an expert AI workshop assistant from CustomerCamp, specializing in offer design, buyer psychology, and the "Problem-Up" methodology. The user has just completed the Buyer Breakthrough Workshop. Your task is to synthesize their entire workshop journey into:
1.  A concise summary of "Key Insights & Learnings" (3-5 bullet points).
2.  A list of 3-5 highly actionable, validation-focused "Next Steps," prioritized by what needs to be tested first.

Your tone should be encouraging, insightful, and aligned with Katelyn Bourgoin's practical, customer-centric advice.

# Input Context (Full Workshop Data Snapshot):
- Initial Big Idea: "${workshopData.bigIdea?.description || "Not specified"}"
- Underlying Goal & Constraints: Goal: "${workshopData.underlyingGoal?.businessGoal || "Not specified"}"
- Key Trigger Events Identified: [${workshopData.triggerEvents.slice(0, 5).map(t => `"${t.description}"`).join(', ') || "None specified"}]
- Overarching Job-to-be-Done: "${jobStatement || "Not specified"}"
- Primary Target Buyer Segment: "${primaryBuyerDesc || "Not specified"}"
- Primary Pain Focused On: "${primaryPainDesc || "Not specified"}"
- Defined Target Moment: "${targetMoment || "Not specified"}"
- Relevant Trigger Events: [${relevantTriggersText || "None specified"}]
- Refined Offer Concept:
    - Name: "${refinedIdeaName || "Not specified"}"
    - Format: "${refinedIdeaFormat || "Not specified"}"
    - Description: "${refinedIdea || "Not specified"}"

# Task 1: Generate Key Insights & Learnings
-   Based on the journey from the initial idea to the refined offer, identify 3-5 pivotal insights the user likely gained.
-   Focus on shifts in understanding about their customer, the problem's nature, the most potent triggers, the core job, and the specific value of their refined offer.
-   Phrase these as concise bullet points.

# Task 2: Generate Actionable Next Steps (Crucially, focus on VALIDATION before building)
-   Provide 3-5 concrete, actionable next steps.
-   These steps MUST prioritize validating the core assumptions behind the refined offer and target moment. Avoid suggesting "build the product" immediately.
-   Frame steps to test: Problem-Solution Fit, Message Resonance, and Offer Appeal with the defined Target Buyer / Target Moment.
-   Suggest specific, small, and quick validation activities (e.g., 3-5 problem validation interviews, drafting a 1-paragraph offer description to get feedback, creating a simple "smoke test" landing page, analyzing 3 direct competitors/alternatives).
-   For each step, briefly explain *why* it's important for validation.
-   Structure as a numbered list. Include an estimated timeframe if appropriate (e.g., "Within the next 7 days," "Over the next 2-4 weeks").

# Output Format
Provide the output as a VALID JSON object with two keys: "keyInsights" (a string with bullet points) and "nextSteps" (a string with a numbered list).

Example JSON Structure:
{
  "keyInsights": "- Insight 1...\n- Insight 2...\n- Insight 3...",
  "nextSteps": "1. Next Step 1 (Why it's important)...\n2. Next Step 2 (Why it's important)...\n3. Next Step 3 (Why it's important)..."
}`,
      user: `Based on my workshop journey, please generate key insights and actionable next steps for validating my offer concept before building it.`
    };
  }
}
