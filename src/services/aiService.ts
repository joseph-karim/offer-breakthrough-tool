import type { AIMessage, ChatSuggestion, StepQuestion, AssistantType } from '../types/chat';
import { OpenAIService } from './openaiService';

// Define questions for each step
export const STEP_QUESTIONS: Record<number, StepQuestion[]> = {
  3: [
    {
      id: 'anti_goals_market',
      text: 'What types of customers or market segments would you prefer to avoid working with?',
      context: 'Anti-goals help you define boundaries for your business.',
      requirements: 'Consider demographics, behaviors, or attitudes that would make clients difficult to work with.'
    },
    {
      id: 'anti_goals_business',
      text: 'What business models or revenue approaches do you want to avoid?',
      context: 'Setting anti-goals around business models helps focus your offer design.',
      requirements: 'Consider pricing structures, delivery methods, or business approaches you dislike.'
    },
    {
      id: 'anti_goals_delivery',
      text: 'Are there specific delivery methods or service aspects you want to avoid?',
      context: 'Delivery anti-goals define how you won\'t provide your solution.',
      requirements: 'Think about time commitments, technology requirements, or service aspects.'
    },
    {
      id: 'anti_goals_lifestyle',
      text: 'What business lifestyle factors do you want to avoid?',
      context: 'Your business should support your desired lifestyle, not detract from it.',
      requirements: 'Consider work hours, travel requirements, stress levels, or team management.'
    },
    {
      id: 'anti_goals_values',
      text: 'What ethical boundaries or values are non-negotiable for you?',
      context: 'Value-based anti-goals keep your business aligned with your principles.',
      requirements: 'Think about industries, practices, or approaches that would conflict with your values.'
    }
  ],
  4: [
    {
      id: 'trigger_events_situations',
      text: 'Think about your ideal clients. What specific situations or events happen right before they realize they need a solution like yours?',
      context: 'Trigger events are specific moments when potential customers recognize they need your solution.',
      requirements: 'Be specific about the situation, problem, or realization moment.'
    },
    {
      id: 'trigger_events_urgency',
      text: 'What makes these trigger events urgent enough for someone to take action?',
      context: 'Understanding urgency helps identify which trigger events are most likely to lead to sales.',
      requirements: 'Consider financial, emotional, or timeline factors that create urgency.'
    }
  ],
  5: [
    {
      id: 'jtbd_main',
      text: 'What is the main job (or jobs) that your customer is trying to accomplish?',
      context: 'The Main Job is the primary outcome your customer wants to achieve.',
      requirements: 'Express this as "I want to [verb] [object] [qualifier]" - e.g., "I want to increase revenue without hiring more salespeople."'
    },
    {
      id: 'jtbd_related',
      text: 'What related tasks or outcomes are needed to accomplish this main job?',
      context: 'Related jobs are the supporting tasks that help achieve the main job.',
      requirements: 'List specific, actionable tasks that contribute to the main job.'
    }
  ],
  6: [
    {
      id: 'markets_brainstorm',
      text: 'Based on the jobs you\'ve identified, what specific markets or customer segments might need to accomplish these jobs?',
      context: 'Markets are defined groups with common characteristics and needs.',
      requirements: 'Be specific about demographics, psychographics, behaviors, and needs.'
    },
    {
      id: 'markets_ratings',
      text: 'How would you rate each market on interest (how interested you are in serving them) and capability (how capable you are of serving them)?',
      context: 'Evaluating markets on interest and capability helps prioritize focus.',
      requirements: 'Rate each market on a scale of 1-10 for both interest and capability.'
    }
  ],
  7: [
    {
      id: 'problems_brainstorm',
      text: 'For your selected market/job combinations, what specific problems or pain points do they experience?',
      context: 'Problems are the obstacles preventing your market from accomplishing their jobs.',
      requirements: 'Consider functional problems (practical issues), emotional problems (feelings), and social problems (perception).'
    },
    {
      id: 'problems_ratings',
      text: 'How would you rate each problem on intensity (how painful it is), frequency (how often it occurs), and financial impact (how much it costs)?',
      context: 'Rating problems helps identify which ones are most worth solving.',
      requirements: 'Rate each problem on a scale of 1-10 for intensity, frequency, and financial impact.'
    }
  ],
  8: [
    {
      id: 'market_evaluation_problem_size',
      text: 'For each market segment, how would you rate the size of the problem they face? (1-10 scale)',
      context: 'Problem size considers how many people have this problem and how severe it is.',
      requirements: 'Consider both the number of people affected and the severity of the problem.'
    },
    {
      id: 'market_evaluation_solution_fit',
      text: 'How well does your solution fit each market\'s specific needs? (1-10 scale)',
      context: 'Solution fit measures how perfectly your solution addresses their exact problem.',
      requirements: 'Consider your expertise, experience, and capability to solve their specific problem.'
    },
    {
      id: 'market_evaluation_economic_value',
      text: 'What is the economic value of solving this problem for each market? (1-10 scale)',
      context: 'Economic value measures how much solving the problem is worth financially.',
      requirements: 'Consider how much money they could save or make by solving this problem.'
    },
    {
      id: 'market_evaluation_joy',
      text: 'How much would you enjoy serving each market? (1-10 scale)',
      context: 'Joy to serve matters for long-term satisfaction and motivation.',
      requirements: 'Consider who you would most enjoy working with and why.'
    }
  ],
  9: [
    {
      id: 'offer_confirmation',
      text: 'Confirm your target Market, the Job they\'re trying to do, and the Problem you\'re solving.',
      context: 'Clear Market-Job-Problem alignment is essential for a compelling offer.',
      requirements: 'Restate your chosen market, their primary job, and the key problem you\'re solving.'
    },
    {
      id: 'offer_format',
      text: 'What format(s) would work best for your solution? (e.g., course, coaching, service, product, software)',
      context: 'Format determines how your solution is delivered and consumed.',
      requirements: 'Consider the pros and cons of different formats for your specific solution.'
    }
  ],
  10: [
    {
      id: 'value_metrics',
      text: 'What is the primary value metric for your offer (e.g., per user, per project, per outcome)?',
      context: 'Value metrics determine how customers measure the value they receive.',
      requirements: 'Consider what customers actually value and how they measure success.'
    },
    {
      id: 'buyer_willingness',
      text: 'Who is your target buyer and what is their typical budget range or willingness to pay for solving this problem?',
      context: 'Understanding budget constraints helps set appropriate pricing.',
      requirements: 'Consider what they\'re currently spending to address this problem or similar ones.'
    },
    {
      id: 'pricing_models',
      text: 'What pricing models are common in your market?',
      context: 'Industry norms provide a starting point for pricing strategy.',
      requirements: 'Research competitors and adjacent solutions to understand pricing patterns.'
    },
    {
      id: 'pricing_tiers',
      text: 'Do you want to offer tiers? If so, what differentiates them?',
      context: 'Tiered pricing can increase accessibility and lifetime value.',
      requirements: 'Consider features, service levels, or outcomes that could differentiate tiers.'
    }
  ],
  11: [
    {
      id: 'workshop_review',
      text: 'Let\'s review your entire workshop and provide analysis and recommendations.',
      context: 'A comprehensive review identifies strengths, weaknesses, and next steps.',
      requirements: 'Consider coherence, differentiation, and market viability.'
    },
    {
      id: 'next_steps',
      text: 'What specific actions should you take to validate and refine your offer?',
      context: 'Validation helps confirm assumptions before full implementation.',
      requirements: 'Prioritize 3-5 concrete actions you can take in the next 1-2 weeks.'
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
  async getStepSuggestion(
    step: number, 
    context: string, 
    assistantType: AssistantType = 'default'
  ): Promise<ChatSuggestion | null> {
    try {
      // Customize the prompt based on the selected assistant type
      switch (step) {
        case 3: // Anti-Goals
          let antiGoalsPrompt = `
            You are a CustomerCamp AI assistant specializing in buyer psychology and the 'Why We Buy' framework.
            
            Based on the user's answers regarding draining customers, undesirable business models, industries to avoid, delivery methods off the table, and unacceptable price points provided in the chat history below, synthesize these into a clear, actionable list of Anti-Goals.
            
            Context:
            ${context}
            
            Structure the output as a valid JSON object with this structure:
            {
              "antiGoals": {
                "market": "string with market anti-goals",
                "offer": "string with offer anti-goals",
                "delivery": "string with delivery anti-goals",
                "lifestyle": "string with lifestyle anti-goals",
                "values": "string with values anti-goals"
              }
            }
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for anti-goal-generator
          if (assistantType === 'anti-goal-generator') {
            antiGoalsPrompt = `
              You are the Anti-Goal Generator, a CustomerCamp AI specialist in identifying boundaries and constraints.
              
              Based on the user's answers regarding draining customers, undesirable business models, industries to avoid, delivery methods off the table, and unacceptable price points provided in the chat history below, synthesize these into a comprehensive and strategic list of Anti-Goals.
              
              Go beyond the obvious boundaries to identify deeper patterns that should be avoided. Consider both explicit statements and implicit signals.
              
              Context:
              ${context}
              
              Structure the output as a valid JSON object with this structure:
              {
                "antiGoals": {
                  "market": "string with detailed market anti-goals, including customer types, behaviors, and red flags",
                  "offer": "string with comprehensive offer anti-goals, focusing on pricing models, value delivery, and service constraints",
                  "delivery": "string with specific delivery anti-goals, including time commitments, communications, and support boundaries",
                  "lifestyle": "string with lifestyle anti-goals related to work/life balance, stress factors, and personal wellbeing",
                  "values": "string with values-based anti-goals that protect core ethics and principles"
                }
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const antiGoalsResponse = await this.openai.generateStructuredJson(antiGoalsPrompt);
          
          return {
            step,
            content: antiGoalsResponse,
            rawResponse: antiGoalsResponse
          };
          
        case 4: // Trigger Events
          let triggerEventsPrompt = `
            You are a CustomerCamp AI assistant trained in buyer psychology. 

            Analyze the user's description of client situations and urgency factors provided in the context below. Generate a list of 5-10 specific, concrete Trigger Events (situations or 'final straws') that might lead someone to seek solutions related to the user's described experiences. 
            
            Focus on specific happenings, not general needs. These should be the moments when potential customers realize they need a solution.
            
            Context:
            ${context}
            
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
            
            Only respond with the JSON object, nothing else.
          `;
          
          const triggerEventsResponse = await this.openai.generateStructuredJson(triggerEventsPrompt);
          
          return {
            step,
            content: triggerEventsResponse,
            rawResponse: triggerEventsResponse
          };
          
        case 5: // Jobs
          let jobsPrompt = `
            You are a CustomerCamp AI assistant applying JTBD principles.
            
            The user identified Main Job(s) and provided initial thoughts in the context below. Generate 5-7 specific, actionable Related Jobs (tasks/outcomes needed) for each Main Job.
            
            Context:
            ${context}
            
            Return a valid JSON object with this structure:
            {
              "jobs": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the job to be done",
                  "type": "functional/emotional/social",
                  "importance": "high/medium/low",
                  "source": "assistant"
                },
                ... additional jobs ...
              ]
            }
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for job-statement-refiner
          if (assistantType === 'job-statement-refiner') {
            jobsPrompt = `
              You are the Job Statement Refiner, a CustomerCamp AI specialist in the Jobs-to-be-Done framework.
              
              The user identified preliminary Main Job(s) in the context below. Your goal is to apply the "so that" technique to progressively refine these statements to uncover deeper motivations.
              
              For each job statement, generate a chain of 3-5 "so that" connections to reveal the ultimate desired outcome. Then craft 5-7 specific, actionable Related Jobs that would help achieve the refined Main Job.
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "refinedJobs": [
                  {
                    "original": "The original job statement",
                    "refinementChain": [
                      "Original statement... so that...",
                      "Next level reason... so that...",
                      "Deeper reason... so that...",
                      "Ultimate motivation"
                    ],
                    "finalRefinedStatement": "The final refined job statement that reveals the true motivation"
                  }
                ],
                "jobs": [
                  {
                    "id": "unique_id_1",
                    "description": "Description of the job to be done based on refined understanding",
                    "type": "functional/emotional/social",
                    "importance": "high/medium/low",
                    "source": "assistant"
                  },
                  ... additional jobs ...
                ]
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const jobsResponse = await this.openai.generateStructuredJson(jobsPrompt);
          
          return {
            step,
            content: jobsResponse,
            rawResponse: jobsResponse
          };
          
        case 6: // Markets
          let marketsPrompt = `
            You are a CustomerCamp AI assistant.
            
            Based on the Related Jobs the user selected in the context below, suggest 5 additional, diverse potential market segments (specific types of businesses or individuals) who frequently need to accomplish these jobs.
            
            Context:
            ${context}
            
            Return a valid JSON object with this structure:
            {
              "markets": [
                {
                  "id": "unique_id_1",
                  "title": "Title for this market segment",
                  "description": "Detailed description of this market",
                  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"],
                  "source": "assistant"
                },
                ... additional markets ...
              ]
            }
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for market-evaluator
          if (assistantType === 'market-evaluator') {
            marketsPrompt = `
              You are the Market Evaluator, a CustomerCamp AI specialist in market intelligence and segment analysis.
              
              Based on the Related Jobs the user selected in the context below, analyze potential market segments who need to accomplish these jobs. For each suggested segment, provide in-depth evaluation of:
              
              1. Problem Size - How widespread and painful is the problem for this segment
              2. Solution Satisfaction - How well existing solutions meet their needs
              3. Willingness to Pay - Their budget constraints and value perception
              4. Accessibility - How reachable they are through marketing channels
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "markets": [
                  {
                    "id": "unique_id_1",
                    "title": "Title for this market segment",
                    "description": "Detailed description of this market",
                    "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"],
                    "evaluation": {
                      "problemSize": {
                        "score": 8,
                        "rationale": "Detailed explanation of the problem size score"
                      },
                      "solutionSatisfaction": {
                        "score": 6,
                        "rationale": "Detailed explanation of the solution satisfaction score"
                      },
                      "willingnessToPay": {
                        "score": 7,
                        "rationale": "Detailed explanation of the willingness to pay score"
                      },
                      "accessibility": {
                        "score": 9,
                        "rationale": "Detailed explanation of the accessibility score"
                      },
                      "totalScore": 30,
                      "recommendation": "Overall recommendation for this segment"
                    },
                    "source": "assistant"
                  },
                  ... additional markets ...
                ]
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const marketsResponse = await this.openai.generateStructuredJson(marketsPrompt);
          
          return {
            step,
            content: marketsResponse,
            rawResponse: marketsResponse
          };
          
        case 7: // Problems
          let problemsPrompt = `
            You are a CustomerCamp AI assistant performing Painstorming.
            
            For the market and related jobs described in the context below, brainstorm a list of 10-15 specific potential problems or pains they might face. Consider functional, emotional, social, and situational aspects based on buyer psychology principles.
            
            Context:
            ${context}
            
            Return a valid JSON object with this structure:
            {
              "problems": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the problem",
                  "type": "functional/emotional/social",
                  "severity": "high/medium/low"
                },
                ... additional problems ...
              ]
            }
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for problem-expander
          if (assistantType === 'problem-expander') {
            problemsPrompt = `
              You are the Problem Expander, a CustomerCamp AI specialist in identifying and exploring customer pain points.
              
              For the market and related jobs described in the context below, conduct an exhaustive exploration of potential problems. Go beyond obvious issues to identify hidden, underlying, and emerging pains. Consider:
              
              1. Direct functional problems with current solutions
              2. Emotional frustrations and anxieties
              3. Social perception and status concerns
              4. Time and opportunity costs
              5. Risk factors (financial, operational, personal)
              6. Knowledge and skill gaps
              
              Generate 15-20 specific, concrete problems across these categories.
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "problems": [
                  {
                    "id": "unique_id_1",
                    "description": "Detailed description of the problem",
                    "type": "functional/emotional/social/time/risk/knowledge",
                    "severity": "high/medium/low",
                    "frequency": "how often this problem occurs",
                    "impact": "explanation of the consequences of this problem",
                    "hiddenInsight": "non-obvious aspect of this problem others might miss"
                  },
                  ... additional problems ...
                ]
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          // Enhance prompt for capability-analyzer
          if (assistantType === 'capability-analyzer') {
            problemsPrompt = `
              You are the Capability Analyzer, a CustomerCamp AI specialist in matching solution capabilities to customer problems.
              
              For the market described in the context below, identify 10-15 specific problems or pains they might face. Then, for each problem, analyze how specific techniques, systems, frameworks, or approaches could solve it effectively.
              
              Focus on connecting actual solution capabilities (methods, frameworks, systems, processes) to specific pain points.
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "capabilityMatrix": [
                  {
                    "problem": {
                      "id": "unique_id_1",
                      "description": "Description of the problem",
                      "type": "functional/emotional/social",
                      "severity": "high/medium/low"
                    },
                    "potentialCapabilities": [
                      {
                        "name": "Name of the capability",
                        "description": "Description of how this capability solves the problem",
                        "effectivenessScore": 8,
                        "uniquenessScore": 7,
                        "implementationDifficulty": "low/medium/high"
                      },
                      ... additional capabilities ...
                    ]
                  },
                  ... additional problem-capability mappings ...
                ]
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const problemsResponse = await this.openai.generateStructuredJson(problemsPrompt);
          
          return {
            step,
            content: problemsResponse,
            rawResponse: problemsResponse
          };
          
        case 8: // Market Evaluation
          let marketEvalPrompt = `
            You are a CustomerCamp AI assistant calculating Problem-Up scores.
            
            Given the user ratings for each market segment against their top problems in the context below, calculate a score for each market by summing its ratings across the four criteria: Problem Size, Solution Fit, Economic Value, and Joy to Serve.
            
            Identify the market with the highest total score.
            
            Context:
            ${context}
            
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
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for research-designer
          if (assistantType === 'research-designer') {
            marketEvalPrompt = `
              You are the Research Designer, a CustomerCamp AI specialist in crafting validation research protocols.
              
              Based on the market segments and scores described in the context below, design a comprehensive research plan to validate assumptions about the highest-scoring segments. Include:
              
              1. Specific research questions to answer
              2. Methods for gathering data (interviews, surveys, tests)
              3. Questions or prompts to use when talking to prospects
              4. Success criteria for validation
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "marketAnalysis": {
                  "topMarket": "Description of highest-scoring market",
                  "keyAssumptions": [
                    "Assumption 1 that needs validation",
                    "Assumption 2 that needs validation",
                    ... additional assumptions ...
                  ]
                },
                "researchPlan": {
                  "objectives": [
                    "Specific research objective 1",
                    "Specific research objective 2",
                    ... additional objectives ...
                  ],
                  "methods": [
                    {
                      "name": "Method name (e.g., 'Customer Interviews')",
                      "description": "Detailed description of this research method",
                      "participants": "Target number and type of participants",
                      "questions": [
                        "Specific question 1 to ask",
                        "Specific question 2 to ask",
                        ... additional questions ...
                      ],
                      "successCriteria": "How to determine if this research confirms the assumption"
                    },
                    ... additional methods ...
                  ],
                  "timeline": "Suggested timeframe for conducting this research",
                  "nextSteps": [
                    "Specific action 1 to take immediately",
                    "Specific action 2 to take immediately",
                    ... additional next steps ...
                  ]
                }
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const marketEvalResponse = await this.openai.generateStructuredJson(marketEvalPrompt);
          
          return {
            step,
            content: marketEvalResponse,
            rawResponse: marketEvalResponse
          };
          
        case 9: // Offer Exploration
          let offerPrompt = `
            You are a CustomerCamp AI assistant applying the PAINKILLER offer concept.
            
            Generate 3-5 distinct offer ideas specifically designed for the target market to solve their key problems related to their jobs-to-be-done as described in the context below. Structure these offers using appropriate formats.

            Each offer idea should have a compelling, benefit-driven 'name' and a brief description focusing on the pain relief or transformation.
            
            Context:
            ${context}
            
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
            
            Only respond with the JSON object, nothing else.
          `;
          
          // Enhance prompt for research-designer
          if (assistantType === 'research-designer') {
            offerPrompt = `
              You are the Research Designer, a CustomerCamp AI specialist in crafting validation research protocols.
              
              Based on the offer concepts described in the context below, design a comprehensive research plan to test and validate these offers with the target market. Include:
              
              1. Specific validation experiments for each offer
              2. Mockup or prototype recommendations
              3. Testing scripts and interview questions
              4. Success metrics and criteria
              
              Context:
              ${context}
              
              Return a valid JSON object with this structure:
              {
                "offerValidationPlan": {
                  "keyOffersToTest": [
                    {
                      "name": "Name of the offer",
                      "primaryValueProposition": "Core benefit statement",
                      "validationExperiments": [
                        {
                          "experimentType": "Type of validation experiment",
                          "description": "Detailed description of how to run this experiment",
                          "mockupRequirements": "What materials to prepare",
                          "script": [
                            "Question/statement 1 to use when testing",
                            "Question/statement 2 to use when testing",
                            ... additional script elements ...
                          ],
                          "successMetrics": [
                            "Specific success metric 1",
                            "Specific success metric 2",
                            ... additional metrics ...
                          ]
                        },
                        ... additional experiments ...
                      ]
                    },
                    ... additional offers ...
                  ],
                  "timeframeEstimate": "Estimated time to complete these validation activities",
                  "prioritization": "Which offers to test first and why"
                }
              }
              
              Only respond with the JSON object, nothing else.
            `;
          }
          
          const offerResponse = await this.openai.generateStructuredJson(offerPrompt);
          
          return {
            step,
            content: offerResponse,
            rawResponse: offerResponse
          };
        
        case 10: // Pricing & Positioning
          let pricingPrompt = `
            You are a CustomerCamp AI assistant specializing in value-based pricing.

            Based on the selected offer, the target market, the core problems solved, and the user's input on value metric, willingness to pay, and market comparables from the context below, suggest 2-3 potential pricing strategies.
            
            For each strategy, provide the model (e.g., Tiered Subscription, Usage-Based, Project Fee), example tiers if applicable, an example price point or range, and a brief justification.
            
            Context:
            ${context}
            
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
            
            Only respond with the JSON object, nothing else.
          `;
          
          const pricingResponse = await this.openai.generateStructuredJson(pricingPrompt);
          
          return {
            step,
            content: pricingResponse,
            rawResponse: pricingResponse
          };

        case 11: // Summary & Analysis
          let summaryPrompt = `
            You are a CustomerCamp AI assistant providing a final reflection.
            
            Based on the complete workshop data about creating a business offer in the context below, provide:
            
            1. Summary: Briefly summarize the key components the user defined: Target Market, Job-to-be-Done, Top Problem(s) Solved, Core Offer Concept, Pricing Approach.
            
            2. Coherence Check: Briefly analyze the overall coherence. Does the offer logically address the specific problems for the target market trying to achieve the identified job? Are there any obvious gaps or misalignments based on 'Why We Buy' principles?
            
            3. Suggested Next Steps: Generate a list of 3-5 concrete, actionable next steps focused on VALIDATING this offer idea with the target market.
            
            Context:
            ${context}
            
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
            
            Only respond with the JSON object, nothing else.
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
  async answerFollowUpQuestion(
    step: number, 
    question: string, 
    context: string, 
    assistantType: AssistantType = 'default'
  ): Promise<AIMessage> {
    try {
      let prompt = '';
      
      // Create base prompt based on step
      switch(step) {
        case 3: // Anti-Goals
          prompt = `
            You are a CustomerCamp AI assistant discussing Anti-Goals.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and general best practices for setting business boundaries. Keep responses concise, helpful, and maintain a helpful, insightful, and slightly 'geeky fun' tone, consistent with the CustomerCamp brand.
            
            User Question: "${question}"
          `;
          break;
        
        case 4: // Trigger Events
          prompt = `
            You are a CustomerCamp AI assistant discussing Trigger Events.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and principles of buyer journey initiation. Maintain a helpful, insightful, and slightly 'geeky fun' tone, consistent with the CustomerCamp brand.
            
            User Question: "${question}"
          `;
          break;
        
        case 5: // Jobs-to-be-Done
          prompt = `
            You are a CustomerCamp AI assistant discussing Jobs-to-be-Done.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and JTBD concepts. Explain how jobs connect to customer motivations and needs. Be concise, helpful, and maintain a slightly 'geeky fun' tone.
            
            User Question: "${question}"
          `;
          break;
          
        case 6: // Markets
          prompt = `
            You are a CustomerCamp AI assistant discussing Target Markets.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and concepts of market segmentation and niche selection. Provide practical insights on choosing and prioritizing markets based on the jobs they need done. Be concise and helpful.
            
            User Question: "${question}"
          `;
          break;
          
        case 7: // Problems
          prompt = `
            You are a CustomerCamp AI assistant discussing customer Problems (Pains).
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and the importance of identifying 'ouchy' problems. Help the user understand how pain intensity, frequency, and financial impact affect problem selection.
            
            User Question: "${question}"
          `;
          break;
          
        case 8: // Market Evaluation
          prompt = `
            You are a CustomerCamp AI assistant discussing Market Evaluation (Problem-Upping).
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and the goal of finding Problem-Market fit. Provide insights on evaluating different markets and their suitability for the user's solution.
            
            User Question: "${question}"
          `;
          break;
          
        case 9: // Value Proposition
          prompt = `
            You are a CustomerCamp AI assistant discussing Offer Exploration.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and principles of crafting compelling value propositions. Help the user understand how to connect their offer to the customer's problems and desired outcomes.
            
            User Question: "${question}"
          `;
          break;
          
        case 10: // Pricing
          prompt = `
            You are a CustomerCamp AI assistant discussing Pricing Strategy.
            
            Current workshop context:
            ${context}
            
            Answer the user's follow-up question based on the context above and principles of value-based pricing and buyer psychology related to price perception. Provide practical insights on pricing models, tiers, and positioning.
            
            User Question: "${question}"
          `;
          break;
          
        case 11: // Summary & Action Plan
          prompt = `
            You are an action-oriented CustomerCamp coach AI.
            
            Current workshop context:
            ${context}
            
            The user has completed the Offer Breakthrough workshop. Your goal is to help them solidify a concrete action plan for the next 1-2 weeks. Answer their question in a way that guides them to prioritize, refine, and commit to specific validation activities.
            
            User Question: "${question}"
          `;
          break;
          
        default:
          prompt = `
            You are an AI assistant helping someone complete a business offer workshop.
            
            Current workshop context:
            ${context}
            
            The user is currently on Step ${step} and has asked the following question:
            "${question}"
            
            Provide a helpful, actionable response that guides them through this step of the workshop.
            Focus on being practical, specific, and encouraging.
            If appropriate, give examples and suggestions to help them move forward.
            Maintain a helpful, insightful, and slightly 'geeky fun' tone, consistent with CustomerCamp's brand.
          `;
      }
      
      // Customize the prompt based on selected assistant type
      switch (assistantType) {
        case 'business-analyzer':
          prompt = `${prompt}\n\nAs the Business Analyzer specialist, focus on identifying patterns, analyzing market trends, and providing data-driven insights. Highlight opportunities for efficiency, scalability, and competitive advantage.`;
          break;
        
        case 'anti-goal-generator':
          prompt = `${prompt}\n\nAs the Anti-Goal Generator specialist, focus on helping the user define clear boundaries. Identify potential pitfalls, red flags, and misalignment risks based on the context. Be specific about what to avoid and why.`;
          break;
        
        case 'job-statement-refiner':
          prompt = `${prompt}\n\nAs the Job Statement Refiner specialist, use the "so that" technique to help the user dig deeper into customer motivations. Guide them to craft precise, outcome-focused job statements that reveal true customer needs.`;
          break;
        
        case 'problem-expander':
          prompt = `${prompt}\n\nAs the Problem Expander specialist, help the user think more broadly about potential customer pains. Suggest additional problems they might not have considered, and explore the depth and nuance of each problem area.`;
          break;
        
        case 'capability-analyzer':
          prompt = `${prompt}\n\nAs the Capability Analyzer specialist, focus on helping the user map their unique skills, systems, or methodologies to specific customer problems. Highlight particularly strong matches between their capabilities and market needs.`;
          break;
        
        case 'market-evaluator':
          prompt = `${prompt}\n\nAs the Market Evaluator specialist, provide substantive market intelligence to help with segment scoring. Offer data-driven insights about different markets' problem size, solution gap, willingness to pay, and accessibility.`;
          break;
        
        case 'research-designer':
          prompt = `${prompt}\n\nAs the Research Designer specialist, recommend specific validation methods and questions tailored to the user's offer and target market. Provide clear, actionable research protocols they can implement immediately.`;
          break;
      }
      
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