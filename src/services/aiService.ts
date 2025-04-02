import type { AIMessage, ChatSuggestion, StepQuestion } from '../types/chat';
import { OpenAIService } from './openaiService';

// Define questions for each step
export const STEP_QUESTIONS: Record<number, StepQuestion[]> = {
  3: [
    {
      id: 'anti_goals_input',
      text: 'What are your anti-goals for your business? These are things you want to avoid at all costs in your market, offer, delivery, lifestyle, and values.',
      context: 'Anti-goals help you define boundaries for your business.',
      requirements: 'Consider aspects like target market, type of offer, delivery method, lifestyle impact, and personal values.'
    }
  ],
  4: [
    {
      id: 'trigger_events',
      text: 'What events or situations might trigger someone to seek out your solution?',
      context: 'Trigger events are specific moments when potential customers realize they need your solution.',
      requirements: 'List specific situations, problems, or moments of realization.'
    }
  ],
  5: [
    {
      id: 'jobs_to_be_done',
      text: 'What jobs, tasks, or goals is your customer trying to accomplish?',
      context: 'Jobs to be done focus on what the customer is trying to achieve, not just their problems.',
      requirements: 'Consider functional jobs (tasks), emotional jobs (feelings), and social jobs (perception).'
    }
  ],
  6: [
    {
      id: 'potential_markets',
      text: 'What specific groups of people might benefit from your solution?',
      context: 'Markets are defined by demographics, psychographics, behaviors, and needs.',
      requirements: 'Be specific about who they are, what they do, and what they care about.'
    }
  ],
  7: [
    {
      id: 'market_problems',
      text: 'What problems, pain points, or frustrations does your target market experience?',
      context: 'Problems are the obstacles preventing your market from accomplishing their jobs.',
      requirements: 'Consider both functional problems (practical issues) and emotional problems (feelings).'
    }
  ],
  8: [
    {
      id: 'market_evaluation',
      text: 'Which market do you think would be the best to focus on first, and why?',
      context: 'The ideal market has urgent problems, is willing to pay, is accessible to you, and has growth potential.',
      requirements: 'Consider market size, urgency of problems, willingness to pay, accessibility, and growth potential.'
    }
  ],
  9: [
    {
      id: 'offer_ideas',
      text: 'What specific offer would solve the key problems for your chosen market?',
      context: 'An offer is a specific product or service with a clearly defined outcome, format, and delivery method.',
      requirements: 'Define what the offer is, what format it takes, and what outcome it delivers.'
    }
  ],
  10: [
    {
      id: 'value_metrics',
      text: 'What value metrics would your customers use to measure the success of your solution?',
      context: 'Value metrics are how customers measure the value or ROI of your offer.',
      requirements: 'Consider tangible metrics (time saved, revenue increased) and intangible benefits (peace of mind, confidence).'
    },
    {
      id: 'pricing_model',
      text: 'What pricing model would best align with the value your offer provides?',
      context: 'Pricing models include one-time, subscription, tiered, usage-based, etc.',
      requirements: 'Consider how the pricing structure aligns with how value is delivered and perceived.'
    },
    {
      id: 'positioning_statement',
      text: 'How would you position your offer against alternatives in the market?',
      context: 'Positioning defines how your offer is distinct from alternatives and why that matters to your market.',
      requirements: 'Format: For [target market], [your offer] is the [category] that [key differentiator] because [reason to believe].'
    }
  ],
  11: [
    {
      id: 'workshop_review',
      text: 'Please review the entire workshop and provide analysis and recommendations.',
      context: 'Review the selected market, job to be done, problems, and offer.',
      requirements: 'Provide insights on potential strengths, weaknesses, and suggestions for validation.'
    },
    {
      id: 'next_steps',
      text: 'What specific actions should I take to validate and refine my offer?',
      context: 'Next steps might include customer interviews, prototype creation, or marketing experiments.',
      requirements: 'Provide 3-5 actionable next steps with specific guidance on how to execute them.'
    }
  ]
};

export interface AIServiceConfig {
  apiKey: string;
  endpoint?: string;
}

export class AIService {
  private openai: OpenAIService;
  
  constructor(config: AIServiceConfig) {
    this.openai = new OpenAIService(config.apiKey, config.endpoint);
  }

  // Get a suggestion for a specific step
  async getStepSuggestion(step: number, context: string): Promise<ChatSuggestion | null> {
    try {
      switch (step) {
        case 3: // Anti-Goals
          const antiGoalsPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate suggestions for anti-goals in these categories:
            - Market anti-goals (types of customers or markets to avoid)
            - Offer anti-goals (types of products or services to avoid)
            - Delivery anti-goals (ways of delivering value to avoid)
            - Lifestyle anti-goals (lifestyle impacts to avoid)
            - Values anti-goals (values or principles to avoid compromising)
            
            Return a valid JSON object with this structure:
            {
              "antiGoals": {
                "market": "string with market anti-goals",
                "offer": "string with offer anti-goals",
                "delivery": "string with delivery anti-goals",
                "lifestyle": "string with lifestyle anti-goals",
                "values": "string with values anti-goals"
              }
            }
          `;
          
          const antiGoalsResponse = await this.openai.generateStructuredJson(antiGoalsPrompt);
          
          return {
            step,
            content: antiGoalsResponse,
            rawResponse: antiGoalsResponse
          };
          
        case 4: // Trigger Events
          const triggerEventsPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate 3-5 specific trigger events that would cause someone to seek out a solution.
            A trigger event is a specific situation, realization, or moment when a potential customer recognizes they need a solution.
            
            For each trigger event, provide:
            - A short description of the event
            - The emotional state of the person experiencing the event
            - The urgency level (low, medium, high)
            
            Return a valid JSON object with this structure:
            {
              "triggerEvents": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the trigger event",
                  "emotionalState": "The emotional state during this event",
                  "urgency": "high/medium/low",
                  "source": "assistant"
                },
                ... additional events ...
              ]
            }
          `;
          
          const triggerEventsResponse = await this.openai.generateStructuredJson(triggerEventsPrompt);
          
          return {
            step,
            content: triggerEventsResponse,
            rawResponse: triggerEventsResponse
          };
          
        case 5: // Jobs
          const jobsPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate 3-5 jobs to be done that your potential customers are trying to accomplish.
            Jobs to be done are the tasks, goals, or objectives that customers are trying to achieve.
            
            For each job, provide:
            - A short description of what the customer is trying to accomplish
            - The job type (functional, emotional, social)
            - The importance level (low, medium, high)
            
            Return a valid JSON object with this structure:
            {
              "jobs": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the job to be done",
                  "type": "functional/emotional/social",
                  "importance": "high/medium/low"
                },
                ... additional jobs ...
              ]
            }
          `;
          
          const jobsResponse = await this.openai.generateStructuredJson(jobsPrompt);
          
          return {
            step,
            content: jobsResponse,
            rawResponse: jobsResponse
          };
          
        case 6: // Markets
          const marketsPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate 3-5 potential target markets that might benefit from a solution.
            A market is a specific group of people with shared characteristics, problems, and needs.
            
            For each market, provide:
            - A descriptive name/title for this market segment
            - A detailed description including demographics, psychographics, and behaviors
            - Key characteristics that define this market
            
            Return a valid JSON object with this structure:
            {
              "markets": [
                {
                  "id": "unique_id_1",
                  "title": "Title for this market segment",
                  "description": "Detailed description of this market",
                  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"]
                },
                ... additional markets ...
              ]
            }
          `;
          
          const marketsResponse = await this.openai.generateStructuredJson(marketsPrompt);
          
          return {
            step,
            content: marketsResponse,
            rawResponse: marketsResponse
          };
          
        case 7: // Problems
          const problemsPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate 3-5 specific problems that your target market experiences.
            Problems are the obstacles, pain points, or frustrations that prevent customers from accomplishing their jobs to be done.
            
            For each problem, provide:
            - A short description of the problem
            - The problem type (functional, emotional)
            - The severity level (low, medium, high)
            
            Return a valid JSON object with this structure:
            {
              "problems": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the problem",
                  "type": "functional/emotional",
                  "severity": "high/medium/low"
                },
                ... additional problems ...
              ]
            }
          `;
          
          const problemsResponse = await this.openai.generateStructuredJson(problemsPrompt);
          
          return {
            step,
            content: problemsResponse,
            rawResponse: problemsResponse
          };
          
        case 8: // Market Evaluation
          const marketEvalPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Evaluate the markets mentioned and recommend which one to focus on first.
            Consider factors like:
            - Size and growth potential
            - Urgency of problems
            - Willingness to pay
            - Accessibility (how easy it is to reach them)
            - Competitive landscape
            
            For each market, provide scores (1-10) for the criteria above and an overall recommendation.
            
            Return a valid JSON object with this structure:
            {
              "marketScores": [
                {
                  "marketDescription": "Description of market 1",
                  "scores": {
                    "size": 7,
                    "urgency": 8,
                    "willingness": 9,
                    "accessibility": 6,
                    "competition": 7
                  },
                  "total": 37,
                  "comments": "Comments about this market's strengths and weaknesses"
                },
                ... additional markets ...
              ],
              "recommendedMarket": "Description of the recommended market",
              "rationale": "Explanation of why this market is recommended"
            }
          `;
          
          const marketEvalResponse = await this.openai.generateStructuredJson(marketEvalPrompt);
          
          return {
            step,
            content: marketEvalResponse,
            rawResponse: marketEvalResponse
          };
          
        case 9: // Offer Exploration
          const offerPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Generate 2-3 potential offers that would solve the key problems for the selected market.
            For each offer, provide:
            - A name/title
            - A detailed description
            - The format (course, coaching, service, product, etc.)
            - Key benefits and outcomes
            - How it solves the identified problems
            
            Return a valid JSON object with this structure:
            {
              "offers": [
                {
                  "name": "Name of the offer",
                  "description": "Detailed description of the offer",
                  "format": "The format of the offer",
                  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
                  "problemsSolved": ["problem addressed 1", "problem addressed 2"]
                },
                ... additional offers ...
              ]
            }
          `;
          
          const offerResponse = await this.openai.generateStructuredJson(offerPrompt);
          
          return {
            step,
            content: offerResponse,
            rawResponse: offerResponse
          };
        
        case 10: // Pricing & Positioning
          const pricingPrompt = `
            Based on the following context from a workshop about creating a business offer:
            ${context}
            
            Create a comprehensive pricing and positioning strategy for the selected offer.
            
            Include:
            1. Value Metrics - How customers will measure the value of your solution
            2. Pricing Model - Recommended pricing approach (one-time, subscription, tiered, etc.)
            3. Price Points - Suggested price points with justification
            4. Positioning Statement - How to position against alternatives
            5. Key Differentiators - What makes this offer unique
            
            Return a valid JSON object with this structure:
            {
              "pricingStrategy": {
                "valueMetrics": ["metric 1", "metric 2", "metric 3"],
                "pricingModel": "Description of recommended pricing model",
                "pricePoints": [
                  {
                    "tier": "Tier name/level",
                    "price": "Price amount",
                    "included": ["Feature/benefit 1", "Feature/benefit 2"]
                  },
                  ... additional price points if applicable ...
                ],
                "rationale": "Explanation of why this pricing approach makes sense"
              },
              "positioning": {
                "statement": "For [target market], [your offer] is the [category] that [key differentiator] because [reason to believe].",
                "differentiators": ["differentiator 1", "differentiator 2", "differentiator 3"],
                "alternativesComparison": "How this positioning compares to alternatives"
              }
            }
          `;
          
          const pricingResponse = await this.openai.generateStructuredJson(pricingPrompt);
          
          return {
            step,
            content: pricingResponse,
            rawResponse: pricingResponse
          };

        case 11: // Summary & Analysis
          const summaryPrompt = `
            Based on the following complete workshop data about creating a business offer:
            ${context}
            
            Provide a comprehensive analysis of the workshop results, including:
            1. Overall Assessment - Strengths and potential weaknesses of the selected market and offer
            2. Validation Plan - Specific steps to validate assumptions
            3. Refinement Suggestions - Areas that could be improved or need more clarity
            4. Marketing Approach - Initial ideas for messaging and channels
            5. Next Actions - Prioritized list of next steps
            
            Return a valid JSON object with this structure:
            {
              "analysis": {
                "strengths": ["strength 1", "strength 2", "strength 3"],
                "risks": ["risk 1", "risk 2", "risk 3"],
                "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
              },
              "validationPlan": [
                {
                  "activity": "Validation activity description",
                  "objective": "What you're trying to learn",
                  "method": "How to conduct this validation"
                },
                ... additional validation activities ...
              ],
              "nextSteps": [
                {
                  "action": "Specific action to take",
                  "priority": "high/medium/low",
                  "timeframe": "immediate/short-term/long-term",
                  "resources": "Resources needed for this action"
                },
                ... additional next steps ...
              ]
            }
          `;
          
          const summaryResponse = await this.openai.generateStructuredJson(summaryPrompt);
          
          return {
            step,
            content: summaryResponse,
            rawResponse: summaryResponse
          };
          
        default:
          console.warn(`No suggestion logic defined for step ${step}`);
          return null;
      }
    } catch (error) {
      console.error('Error getting step suggestion:', error);
      
      // Fallback to mock suggestions for demo purposes
      return this.getMockSuggestion(step);
    }
  }

  // Answer a follow-up question based on the step context
  async answerFollowUpQuestion(step: number, question: string, context: string): Promise<AIMessage> {
    try {
      const prompt = `
        You are an AI assistant helping someone complete a business offer workshop.
        
        Current workshop context:
        ${context}
        
        The user is currently on Step ${step} and has asked the following question:
        "${question}"
        
        Provide a helpful, actionable response that guides them through this step of the workshop.
        Focus on being practical, specific, and encouraging.
        If appropriate, give examples and suggestions to help them move forward.
      `;
      
      const response = await this.openai.generateCompletion(prompt);
      
      return {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error answering follow-up question:', error);
      
      // Fallback response
      return {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble processing your question right now. Could you please try rephrasing it, or we can move on to another aspect of the workshop?",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Private method for mock suggestions (demo/fallback only)
  private getMockSuggestion(step: number): ChatSuggestion | null {
    // Mock suggestions for demo purposes
    switch (step) {
      case 3: // Anti-Goals
        return {
          step,
          content: {
            antiGoals: {
              market: "Low-budget clients who don't value quality work",
              offer: "Time-intensive services with low margins",
              delivery: "Processes requiring constant personal attention 24/7",
              lifestyle: "Work schedules that interfere with family time",
              values: "Projects that require ethical compromises"
            }
          },
          rawResponse: '{"antiGoals": {...}}'
        };
        
      case 4: // Trigger Events
        return {
          step,
          content: {
            triggerEvents: [
              {
                id: "trigger_1",
                description: "Losing a major client unexpectedly",
                emotionalState: "Anxious and uncertain",
                urgency: "high",
                source: "assistant"
              },
              {
                id: "trigger_2",
                description: "Feeling overwhelmed by too many small clients",
                emotionalState: "Stressed and scattered",
                urgency: "medium",
                source: "assistant"
              }
            ]
          },
          rawResponse: '{"triggerEvents": [...]}'
        };
        
      case 5: // Jobs
        return {
          step,
          content: {
            jobs: [
              {
                id: "job_1",
                description: "Find a reliable stream of high-quality clients",
                type: "functional",
                importance: "high"
              },
              {
                id: "job_2",
                description: "Gain confidence in business development",
                type: "emotional",
                importance: "medium"
              }
            ]
          },
          rawResponse: '{"jobs": [...]}'
        };
        
      case 6: // Markets
        return {
          step,
          content: {
            markets: [
              {
                id: "market_1",
                title: "Early-Stage SaaS Founders",
                description: "Tech entrepreneurs who have launched a SaaS product but are struggling with customer acquisition and retention.",
                characteristics: ["Technical background", "Bootstrapped or early funding", "B2B focus"]
              },
              {
                id: "market_2",
                title: "Independent Consultants Scaling Up",
                description: "Successful solo consultants who want to build a larger practice but struggle with systems and processes.",
                characteristics: ["5+ years experience", "Expertise-driven", "Client overflow"]
              }
            ]
          },
          rawResponse: '{"markets": [...]}'
        };
        
      case 7: // Problems
        return {
          step,
          content: {
            problems: [
              {
                id: "problem_1",
                description: "Inconsistent lead generation leading to feast-or-famine cycles",
                type: "functional",
                severity: "high"
              },
              {
                id: "problem_2",
                description: "Anxiety about long-term business sustainability",
                type: "emotional",
                severity: "medium"
              }
            ]
          },
          rawResponse: '{"problems": [...]}'
        };
        
      case 8: // Market Evaluation
        return {
          step,
          content: {
            marketScores: [
              {
                marketDescription: "Early-Stage SaaS Founders",
                scores: {
                  size: 7,
                  urgency: 9,
                  willingness: 8,
                  accessibility: 6,
                  competition: 7
                },
                total: 37,
                comments: "High urgency and willingness to pay, moderate competition"
              }
            ],
            recommendedMarket: "Early-Stage SaaS Founders",
            rationale: "This market has the highest overall score with particularly strong urgency and willingness to pay."
          },
          rawResponse: '{"marketScores": [...], "recommendedMarket": "Early-Stage SaaS Founders", ...}'
        };
        
      case 9: // Offer Exploration
        return {
          step,
          content: {
            offers: [
              {
                name: "SaaS Growth Blueprint",
                description: "A 90-day program combining strategic consulting and implementation support to establish sustainable customer acquisition channels.",
                format: "Hybrid coaching and implementation program",
                benefits: [
                  "Clear customer acquisition strategy", 
                  "Optimized conversion funnel", 
                  "Increased MRR"
                ],
                problemsSolved: [
                  "Inconsistent lead generation", 
                  "Low conversion rates"
                ]
              }
            ]
          },
          rawResponse: '{"offers": [...]}'
        };
        
      case 10: // Pricing & Positioning
        return {
          step,
          content: {
            pricingStrategy: {
              valueMetrics: [
                "Increase in monthly recurring revenue (MRR)",
                "Reduction in customer acquisition cost (CAC)",
                "Improvement in conversion rates"
              ],
              pricingModel: "Tiered subscription with performance incentives",
              pricePoints: [
                {
                  tier: "Essentials",
                  price: "$5,000/month (3-month minimum)",
                  included: ["Strategy development", "Weekly coaching", "Core metrics tracking"]
                },
                {
                  tier: "Premium",
                  price: "$8,000/month (3-month minimum)",
                  included: ["Everything in Essentials", "Implementation support", "Team training", "Custom dashboard"]
                }
              ],
              rationale: "Tiered subscription aligns with the recurring revenue model of SaaS businesses and allows clients to choose their level of support."
            },
            positioning: {
              statement: "For early-stage SaaS founders, the SaaS Growth Blueprint is the guided implementation program that delivers a proven customer acquisition system because it combines strategic expertise with hands-on execution support.",
              differentiators: [
                "Combined strategy and implementation",
                "SaaS-specific frameworks and metrics",
                "Performance-based incentives"
              ],
              alternativesComparison: "Unlike generic marketing consultants who deliver recommendations but not results, or agencies who execute without strategic guidance, this program bridges the gap with both strategic direction and practical implementation."
            }
          },
          rawResponse: '{"pricingStrategy": {...}, "positioning": {...}}'
        };
        
      case 11: // Summary & Action Plan
        return {
          step,
          content: {
            analysis: {
              strengths: [
                "Target market has clear, urgent problems",
                "Offer directly addresses key pain points",
                "Positioning is differentiated from alternatives"
              ],
              risks: [
                "Price point may be too high for very early-stage founders",
                "Implementation capacity could be limited with multiple clients",
                "Requires specialized knowledge of multiple SaaS marketing channels"
              ],
              opportunities: [
                "Potential to create standardized frameworks that scale",
                "Possibility for additional revenue through tool recommendations",
                "Natural upsell to retained advisory services after initial program"
              ]
            },
            validationPlan: [
              {
                activity: "Problem validation interviews",
                objective: "Confirm the severity and urgency of identified problems",
                method: "Schedule 5-8 calls with target market representatives who fit the ideal client profile"
              },
              {
                activity: "Offer messaging test",
                objective: "Validate that the positioning resonates with the target market",
                method: "Create a simple landing page and run limited ad campaign to gauge interest and collect feedback"
              }
            ],
            nextSteps: [
              {
                action: "Create ideal client profile document",
                priority: "high",
                timeframe: "immediate",
                resources: "Existing customer data, market research"
              },
              {
                action: "Develop interview script for validation calls",
                priority: "high",
                timeframe: "immediate",
                resources: "Problem and jobs statements from workshop"
              },
              {
                action: "Schedule 5 validation interviews",
                priority: "high",
                timeframe: "short-term",
                resources: "Network connections, LinkedIn outreach"
              }
            ]
          },
          rawResponse: '{"analysis": {...}, "validationPlan": [...], "nextSteps": [...]}'
        };
        
      default:
        return null;
    }
  }
} 