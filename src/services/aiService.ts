import type { AIMessage, ChatSuggestion, StepQuestion, AssistantType } from '../types/chat';
import { OpenAIService } from './openaiService';

// Define questions for each step
export const STEP_QUESTIONS: Record<number, StepQuestion[]> = {
  2: [
    {
      id: 'big_idea_brainstorm',
      text: 'Can you help me brainstorm some product or service ideas?',
      context: 'Brainstorming helps generate initial ideas that can be refined later.',
      requirements: 'Consider your skills, interests, and market opportunities.'
    },
    {
      id: 'big_idea_refine',
      text: 'How can I refine my product idea to make it more compelling?',
      context: 'A compelling product idea clearly communicates what it is and who it helps.',
      requirements: 'Use the format: [What it is] + [what will it help customers do].'
    },
    {
      id: 'big_idea_target',
      text: 'Who might be interested in this product or service?',
      context: 'Identifying potential target customers helps focus your idea.',
      requirements: 'Consider demographics, psychographics, behaviors, and needs.'
    }
  ],
  3: [
    {
      id: 'underlying_goal_business',
      text: 'What is my underlying business goal for creating this new offer?',
      context: 'Your underlying goal helps guide product decisions.',
      requirements: 'Consider revenue goals, business growth, market positioning, etc.'
    },
    {
      id: 'underlying_goal_constraints',
      text: 'What constraints do I have in terms of time, resources, or skills?',
      context: 'Constraints help define what is realistic for your business.',
      requirements: 'Consider time availability, budget, team size, technical capabilities, etc.'
    },
    {
      id: 'underlying_goal_anti_goals',
      text: 'What do I want to avoid with this new offer?',
      context: 'Anti-goals help you define boundaries for your business.',
      requirements: 'Consider business models, delivery methods, customer types, or values you want to avoid.'
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

  // Get detailed painstorming analysis
  async getPainstormingAnalysis(
    jobStatement: string,
    topBuyerSegments: string[],
    bigIdea: string
  ): Promise<string | null> {
    const painstormingPrompt = `
You are an expert consumer behavior and market research assistant specializing in rapid "Painstorming" sessions based on Jobs-to-be-Done (JTBD) principles. Your task is to analyze the user's defined Job Statement and their top 3 potential target buyer segments to brainstorm the specific problems and pain points these buyers face when trying to get the job done.

# Objective
Generate a detailed painstorming analysis for the user's specified Job Statement and target buyer segments. This analysis will help the user identify problems worth solving for their new product/service idea.

# Input Context
You will receive the following information from the user:
1.  **Chosen Job Statement:** The core progress the customer is trying to make (e.g., "Help me [VERB] my [OBJECT] [CONTEXT]").
2.  **Top 3 Target Buyer Segments:** Specific descriptions of the potential customer groups identified in the previous step.
3.  **Big Idea (for context):** The user's initial product/service concept.

# Methodology (5-Step Process)
1.  **Analyze Inputs:** Deeply understand the nuances of the Job Statement and the specific context, motivations, and likely circumstances of each of the 3 target buyer segments.
2.  **Dig into Buyer Psyche:** For each segment, thoroughly brainstorm problems they encounter when trying to achieve the Job Statement. Consider their specific context. *Simulate* detailed online research (reading plausible online reviews, forum discussions, social media complaints related to the job/segment) to generate realistic and insightful problems.
3.  **Identify & Categorize Problems:** Generate a comprehensive list of 8-25 specific problems *for each segment*. Categorize *every* problem using *only* one of these four types:
    * **(Functional):** Issues with current solutions/processes, inefficiencies, things not working as intended, specific task challenges, usability problems with alternatives.
    * **(Emotional):** Psychological challenges like frustration, fear, anxiety, overwhelm, lack of confidence, imposter syndrome, decision paralysis related to achieving the job.
    * **(Social):** Issues related to perception by others (peers, clients, superiors), status concerns, relationship dynamics, team collaboration issues, communication challenges related to the job.
    * **(Perceived Risk):** Potential negative outcomes, fears of failure (financial, reputational), wasting resources, making the wrong choice, legal exposure, security concerns related to the job or potential solutions.
4.  **Identify FIRE Problems:** Within each segment's list, carefully evaluate and identify problems that seem likely to be **FIRE** (Frequent, Intense, Requires Fast Action, Expensive). Mark these clearly with **(FIRE?)**.
5.  **Find Overlapping Problems:** Analyze the problems generated across all 3 segments. Identify the top 4-8 problems that appear to impact multiple segments significantly. Prioritize any overlapping FIRE problems identified in Step 4. Present these overlapping problems in the detailed format specified below.

# Output Format
Structure your response precisely as follows. **Do not include any introductory text, greetings, offers for further assistance, or any commentary outside of the specified structure.**

**Painstorming Analysis for Job: "[User's Chosen Job Statement]"**

**Pain Points for [Target Buyer Segment 1 Name/Description]:**
* [Problem 1 Description - specific and detailed] (Type: Functional/Emotional/Social/Perceived Risk) [Optional: **(FIRE?)**]
* [Problem 2 Description - specific and detailed] (Type: ...) [Optional: **(FIRE?)**]
* ... (List 8-25 specific problems for this segment)
* **Potential FIRE Problems Summary for this Segment:** [List the problems marked as FIRE above, e.g., "Problem 2, Problem 7, Problem 15"]

**Pain Points for [Target Buyer Segment 2 Name/Description]:**
* [Problem 1 Description - specific and detailed] (Type: Functional/Emotional/Social/Perceived Risk) [Optional: **(FIRE?)**]
* [Problem 2 Description - specific and detailed] (Type: ...) [Optional: **(FIRE?)**]
* ... (List 8-25 specific problems for this segment)
* **Potential FIRE Problems Summary for this Segment:** [List the problems marked as FIRE above]

**Pain Points for [Target Buyer Segment 3 Name/Description]:**
* [Problem 1 Description - specific and detailed] (Type: Functional/Emotional/Social/Perceived Risk) [Optional: **(FIRE?)**]
* [Problem 2 Description - specific and detailed] (Type: ...) [Optional: **(FIRE?)**]
* ... (List 8-25 specific problems for this segment)
* **Potential FIRE Problems Summary for this Segment:** [List the problems marked as FIRE above]

---

**Top 4-8 Overlapping Problems Across Segments:**

1.  **[Mark as FIRE Problem if applicable, otherwise just Problem]:** "[Phrase the problem concisely as if said by the customer, e.g., 'I don't know what to build that people will actually pay for.']"
    * **Pain Type(s):** [List relevant types, e.g., Emotional + Perceived Risk]
    * **Why it's painful:** [Explain the specific struggle/negative feeling/consequence related to this problem, e.g., Wasting time and energy building something that flops is demoralizing and expensive. They fear building the wrong thing and damaging their reputation.]
    * **Why it's expensive:** [Explain the cost (time, money, opportunity, resources), e.g., Months spent creating a course, program, or tool that doesn't sell = lost revenue, opportunity cost, and brand confusion.]

2.  **[Mark as FIRE Problem if applicable, otherwise just Problem]:** "[Customer phrase]"
    * **Pain Type(s):** [...]
    * **Why it's painful:** [...]
    * **Why it's expensive:** [...]

... (List 4-8 overlapping problems, prioritizing FIRE ones, following the exact detailed format above)

# Final Instruction
Provide *only* the formatted Painstorming Analysis as described above. Your response should begin directly with "**Painstorming Analysis for Job:...**". Do not include any other text before or after this structured output.

Here's the context for painstorming:

* **Chosen Job Statement:** ${jobStatement}
* **Top 3 Target Buyer Segments:**
    1. ${topBuyerSegments[0] || 'N/A'}
    2. ${topBuyerSegments[1] || 'N/A'}
    3. ${topBuyerSegments[2] || 'N/A'}
* **Big Idea (for context):** ${bigIdea}
    `;

    try {
      // Use the OpenAI API to generate the painstorming analysis
      const rawMarkdownResponse = await this.openai.generateCompletion(painstormingPrompt);
      return rawMarkdownResponse || null;
    } catch (error) {
      console.error("Error getting Painstorming analysis:", error);
      return null;
    }
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
        case 3: {
          let underlyingGoalPrompt = `
            You are a CustomerCamp AI assistant specializing in buyer psychology and the 'Why We Buy' framework.

            Based on the user's answers regarding their business goals and constraints provided in the chat history below, synthesize these into a clear, actionable Underlying Goal.

            Context:
            ${context}

            Structure the output as a valid JSON object with this structure:
            {
              "underlyingGoal": {
                "businessGoal": "string with business goal",
                "constraints": "string with constraints"
              }
            }

            Only respond with the JSON object, nothing else.
          `;

          // Enhance prompt for underlying-goal-advisor
          if (assistantType === 'underlying-goal-advisor') {
            underlyingGoalPrompt = `
              You are the Underlying Goal Advisor, a CustomerCamp AI specialist in identifying business goals and constraints.

              Based on the user's answers regarding their business goals and constraints provided in the chat history below, synthesize these into a comprehensive and strategic Underlying Goal.

              Go beyond the obvious goals to identify deeper patterns and motivations. Consider both explicit statements and implicit signals.

              Context:
              ${context}

              Structure the output as a valid JSON object with this structure:
              {
                "underlyingGoal": {
                  "businessGoal": "string with detailed business goal, including motivations, aspirations, and desired outcomes",
                  "constraints": "string with comprehensive constraints, focusing on time, resources, skills, and other limitations"
                }
              }

              Only respond with the JSON object, nothing else.
            `;
          }

          const underlyingGoalResponse = await this.openai.generateStructuredJson(underlyingGoalPrompt);

          return {
            step,
            content: underlyingGoalResponse,
            rawResponse: underlyingGoalResponse
          };
        }

        case 4: {
          const triggerEventsPrompt = `
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
        }

        case 5: {
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
        }

        case 6: {
          let targetBuyersPrompt = `
            You are a CustomerCamp AI assistant.

            Based on the Related Jobs the user selected in the context below, suggest 5 additional, diverse potential target buyers (specific types of businesses or individuals) who frequently need to accomplish these jobs.

            Context:
            ${context}

            Return a valid JSON object with this structure:
            {
              "targetBuyers": [
                {
                  "id": "unique_id_1",
                  "description": "Detailed description of this buyer persona",
                  "jobsToBeDone": ["job 1", "job 2", "job 3"],
                  "painPoints": ["pain 1", "pain 2", "pain 3"],
                  "source": "assistant"
                },
                ... additional buyers ...
              ]
            }

            Only respond with the JSON object, nothing else.
          `;

          // Enhance prompt for target-buyer-analyzer
          if (assistantType === 'target-buyer-analyzer') {
            targetBuyersPrompt = `
              You are the Target Buyer Analyzer, a CustomerCamp AI specialist in buyer persona development and analysis.

              Based on the Related Jobs the user selected in the context below, analyze potential target buyers who need to accomplish these jobs. For each suggested buyer, provide in-depth evaluation of:

              1. Pain Intensity - How painful the problem is for this buyer
              2. Buying Power - Their ability to make purchasing decisions
              3. Willingness to Pay - Their budget constraints and value perception
              4. Accessibility - How reachable they are through marketing channels

              Context:
              ${context}

              Return a valid JSON object with this structure:
              {
                "targetBuyers": [
                  {
                    "id": "unique_id_1",
                    "description": "Detailed description of this buyer persona",
                    "jobsToBeDone": ["job 1", "job 2", "job 3"],
                    "painPoints": ["pain 1", "pain 2", "pain 3"],
                    "evaluation": {
                      "painIntensity": {
                        "score": 8,
                        "rationale": "Detailed explanation of the pain intensity score"
                      },
                      "buyingPower": {
                        "score": 6,
                        "rationale": "Detailed explanation of the buying power score"
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
                      "recommendation": "Overall recommendation for this buyer"
                    },
                    "source": "assistant"
                  },
                  ... additional buyers ...
                ]
              }

              Only respond with the JSON object, nothing else.
            `;
          }

          const targetBuyersResponse = await this.openai.generateStructuredJson(targetBuyersPrompt);

          return {
            step,
            content: targetBuyersResponse,
            rawResponse: targetBuyersResponse
          };
        }

        case 7: {
          let painsPrompt = `
            You are a CustomerCamp AI assistant performing Painstorming.

            For the target buyers and related jobs described in the context below, brainstorm a list of 10-15 specific potential pains they might face. Consider functional, emotional, social, and situational aspects based on buyer psychology principles.

            Context:
            ${context}

            Return a valid JSON object with this structure:
            {
              "pains": [
                {
                  "id": "unique_id_1",
                  "description": "Description of the pain",
                  "type": "functional/emotional/social",
                  "severity": "high/medium/low",
                  "isFire": true/false
                },
                ... additional pains ...
              ]
            }

            Only respond with the JSON object, nothing else.
          `;

          // Enhance prompt for painstorming-helper
          if (assistantType === 'painstorming-helper') {
            painsPrompt = `
              You are the Painstorming Helper, a CustomerCamp AI specialist in identifying and exploring customer pain points.

              For the target buyers and related jobs described in the context below, conduct an exhaustive exploration of potential pains. Go beyond obvious issues to identify hidden, underlying, and emerging pains. Consider:

              1. Direct functional problems with current solutions
              2. Emotional frustrations and anxieties
              3. Social perception and status concerns
              4. Time and opportunity costs
              5. Risk factors (financial, operational, personal)
              6. Knowledge and skill gaps

              Generate 15-20 specific, concrete pains across these categories.

              Context:
              ${context}

              Return a valid JSON object with this structure:
              {
                "pains": [
                  {
                    "id": "unique_id_1",
                    "description": "Detailed description of the pain",
                    "type": "functional/emotional/social/time/risk/knowledge",
                    "severity": "high/medium/low",
                    "isFire": true/false,
                    "frequency": "how often this pain occurs",
                    "impact": "explanation of the consequences of this pain",
                    "hiddenInsight": "non-obvious aspect of this pain others might miss"
                  },
                  ... additional pains ...
                ]
              }

              Only respond with the JSON object, nothing else.
            `;
          }

          // Enhance prompt for capability-analyzer
          if (assistantType === 'capability-analyzer') {
            painsPrompt = `
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

          const painsResponse = await this.openai.generateStructuredJson(painsPrompt);

          return {
            step,
            content: painsResponse,
            rawResponse: painsResponse
          };
        }

        case 8: {
          let problemUpPrompt = `
            You are a CustomerCamp AI assistant helping with the Problem Up process.

            Based on the pains and target buyers identified in the context below, recommend which specific pains and buyers to focus on. Also suggest a target moment (when the pain is most acute) and provide additional notes on how to approach this problem-buyer combination.

            Context:
            ${context}

            Return a valid JSON object with this structure:
            {
              "problemUp": {
                "selectedPains": ["pain_id_1", "pain_id_2"],
                "selectedBuyers": ["buyer_id_1", "buyer_id_2"],
                "targetMoment": "Description of the specific moment when the pain is most acute",
                "notes": "Additional notes and insights about this problem-buyer combination"
              }
            }

            Only respond with the JSON object, nothing else.
          `;

          // Enhance prompt for problem-up-advisor
          if (assistantType === 'problem-up-advisor') {
            problemUpPrompt = `
              You are the Problem Up Advisor, a CustomerCamp AI specialist in identifying the most promising problem-buyer combinations.

              Based on the pains and target buyers identified in the context below, conduct a detailed analysis to identify the most promising problem-buyer combinations. Consider:

              1. Pain intensity and frequency for each buyer
              2. Your unique ability to solve these specific pains
              3. The commercial opportunity of each combination
              4. The specific moment when the pain is most acute

              Context:
              ${context}

              Return a valid JSON object with this structure:
              {
                "problemUp": {
                  "selectedPains": ["pain_id_1", "pain_id_2"],
                  "selectedBuyers": ["buyer_id_1", "buyer_id_2"],
                  "targetMoment": "Description of the specific moment when the pain is most acute",
                  "notes": "Additional notes and insights about this problem-buyer combination"
                },
                "analysis": {
                  "painAnalysis": [
                    {
                      "painId": "pain_id_1",
                      "intensity": "High/Medium/Low",
                      "frequency": "Daily/Weekly/Monthly",
                      "solutionFit": "How well your capabilities match this pain",
                      "commercialOpportunity": "Size of the market opportunity"
                    },
                    ... additional pains ...
                  ],
                  "buyerAnalysis": [
                    {
                      "buyerId": "buyer_id_1",
                      "accessibilityScore": "How easy it is to reach this buyer",
                      "willingnessToPay": "How likely they are to pay for a solution",
                      "decisionMakingPower": "Their ability to make purchasing decisions"
                    },
                    ... additional buyers ...
                  ],
                  "combinationRationale": "Detailed explanation of why this problem-buyer combination is recommended"
                }
              }

              Only respond with the JSON object, nothing else.
            `;
          }

          const problemUpResponse = await this.openai.generateStructuredJson(problemUpPrompt);

          return {
            step,
            content: problemUpResponse,
            rawResponse: problemUpResponse
          };
        }

        case 9: {
          let refineIdeaPrompt = `
            You are a CustomerCamp AI assistant helping refine a business idea.

            Based on the initial big idea, selected pains, and target buyers described in the context below, generate a refined version of the idea that specifically addresses these pains for these buyers. Also create an offer based on this refined idea.

            Context:
            ${context}

            Return a valid JSON object with this structure:
            {
              "refinedIdea": {
                "description": "Detailed description of the refined idea",
                "targetCustomers": "Description of the target customers",
                "version": "refined"
              },
              "offer": {
                "name": "Name of the offer",
                "description": "Detailed description of the offer",
                "format": "The format of the offer (e.g., course, coaching, service, product, software)"
              }
            }

            Only respond with the JSON object, nothing else.
          `;

          // Enhance prompt for idea-refiner
          if (assistantType === 'idea-refiner') {
            refineIdeaPrompt = `
              You are the Idea Refiner, a CustomerCamp AI specialist in crafting compelling business ideas and offers.

              Based on the initial big idea, selected pains, and target buyers described in the context below, create a highly refined version of the idea that specifically addresses these pains for these buyers. Also create a detailed offer based on this refined idea.

              Consider:
              1. How to position the offer for maximum appeal
              2. The most appropriate format and delivery method
              3. Key features and benefits that directly address the selected pains
              4. A compelling name that communicates the core value

              Context:
              ${context}

              Return a valid JSON object with this structure:
              {
                "refinedIdea": {
                  "description": "Detailed description of the refined idea",
                  "targetCustomers": "Description of the target customers",
                  "version": "refined",
                  "keyDifferentiators": ["differentiator 1", "differentiator 2", "differentiator 3"],
                  "positioningStatement": "For [target customers] who [need/want], [product name] is a [category] that [key benefit]. Unlike [competitors], our product [key differentiator]."
                },
                "offer": {
                  "name": "Name of the offer",
                  "description": "Detailed description of the offer",
                  "format": "The format of the offer (e.g., course, coaching, service, product, software)",
                  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
                  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
                  "deliveryMethod": "How the offer will be delivered",
                  "pricingStrategy": "Recommended pricing approach"
                }
              }

              Only respond with the JSON object, nothing else.
            `;
          }

          const refineIdeaResponse = await this.openai.generateStructuredJson(refineIdeaPrompt);

          return {
            step,
            content: refineIdeaResponse,
            rawResponse: refineIdeaResponse
          };
        }

        case 10: {
          const summaryPrompt = `
            You are a CustomerCamp AI assistant providing a final workshop summary.

            Based on the complete workshop data in the context below, provide a summary of key insights and next steps.

            Context:
            ${context}

            Return a valid JSON object with this structure:
            {
              "reflections": {
                "keyInsights": "Key insights from the workshop process",
                "nextSteps": "Recommended next steps to take"
              }
            }

            Only respond with the JSON object, nothing else.
          `;

          const summaryResponse = await this.openai.generateStructuredJson(summaryPrompt);

          return {
            step,
            content: summaryResponse,
            rawResponse: summaryResponse
          };
        }

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
        case 3: // Underlying Goal
          prompt = `
            You are a CustomerCamp AI assistant discussing Underlying Goals.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and general best practices for setting business goals and constraints. Keep responses concise, helpful, and maintain a helpful, insightful, and slightly 'geeky fun' tone, consistent with the CustomerCamp brand.

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

        case 6: // Target Buyers
          prompt = `
            You are a CustomerCamp AI assistant discussing Target Buyers.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and concepts of buyer persona development and selection. Provide practical insights on identifying and prioritizing target buyers based on the jobs they need done. Be concise and helpful.

            User Question: "${question}"
          `;
          break;

        case 7: // Painstorming
          prompt = `
            You are a CustomerCamp AI assistant discussing Painstorming.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and the importance of identifying 'ouchy' pains. Help the user understand how pain intensity, frequency, and financial impact affect pain selection.

            User Question: "${question}"
          `;
          break;

        case 8: // Problem Up
          prompt = `
            You are a CustomerCamp AI assistant discussing Problem Up.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and the goal of finding Problem-Buyer fit. Provide insights on selecting the most promising pain-buyer combinations and identifying the target moment when the pain is most acute.

            User Question: "${question}"
          `;
          break;

        case 9: // Refine Idea
          prompt = `
            You are a CustomerCamp AI assistant discussing Idea Refinement.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and principles of refining business ideas and crafting compelling offers. Help the user understand how to connect their refined idea to the selected pains and target buyers.

            User Question: "${question}"
          `;
          break;

        case 10: // Summary
          prompt = `
            You are a CustomerCamp AI assistant discussing the Workshop Summary.

            Current workshop context:
            ${context}

            Answer the user's follow-up question based on the context above and help them reflect on the workshop process and outcomes. Provide practical insights on next steps and how to validate their refined idea.

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

        case 'underlying-goal-advisor':
          prompt = `${prompt}\n\nAs the Underlying Goal Advisor specialist, focus on helping the user define clear boundaries and goals. Identify potential pitfalls, red flags, and misalignment risks based on the context. Be specific about what to avoid and why.`;
          break;

        case 'job-statement-refiner':
          prompt = `${prompt}\n\nAs the Job Statement Refiner specialist, use the "so that" technique to help the user dig deeper into customer motivations. Guide them to craft precise, outcome-focused job statements that reveal true customer needs.`;
          break;

        case 'painstorming-helper':
          prompt = `${prompt}\n\nAs the Painstorming Helper specialist, help the user think more broadly about potential customer pains. Suggest additional problems they might not have considered, and explore the depth and nuance of each problem area.`;
          break;

        case 'problem-up-advisor':
          prompt = `${prompt}\n\nAs the Problem Up Advisor specialist, focus on helping the user map their unique skills, systems, or methodologies to specific customer problems. Highlight particularly strong matches between their capabilities and market needs.`;
          break;

        case 'target-buyer-analyzer':
          prompt = `${prompt}\n\nAs the Target Buyer Analyzer specialist, provide substantive market intelligence to help with segment scoring. Offer data-driven insights about different markets' problem size, solution gap, willingness to pay, and accessibility.`;
          break;

        case 'idea-refiner':
          prompt = `${prompt}\n\nAs the Idea Refiner specialist, recommend specific validation methods and questions tailored to the user's offer and target market. Provide clear, actionable research protocols they can implement immediately.`;
          break;

        case 'workshop-summarizer':
          prompt = `${prompt}\n\nAs the Workshop Summarizer specialist, provide a comprehensive overview of the workshop progress and results. Highlight key insights, decisions, and next steps.`;
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
      case 3: // Underlying Goal
        return {
          step,
          content: {
            underlyingGoal: {
              businessGoal: "Create a sustainable business that generates $10,000/month in recurring revenue while working 30 hours per week",
              constraints: "Limited startup capital, need to maintain current client work while building the new offer"
            }
          },
          rawResponse: '{"underlyingGoal": {...}}'
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

      case 6: // Target Buyers
        return {
          step,
          content: {
            targetBuyers: [
              {
                id: "buyer_1",
                description: "Early-Stage SaaS Founders who have launched a product but are struggling with customer acquisition",
                jobsToBeDone: ["Acquire customers consistently", "Reduce churn", "Optimize pricing"],
                painPoints: ["Inconsistent lead generation", "High CAC", "Low conversion rates"],
                source: "assistant"
              },
              {
                id: "buyer_2",
                description: "Independent Consultants looking to scale beyond trading time for money",
                jobsToBeDone: ["Create leveraged income", "Build systems", "Maintain quality"],
                painPoints: ["Feast-or-famine cycles", "Time constraints", "Difficulty delegating"],
                source: "assistant"
              }
            ]
          },
          rawResponse: '{"targetBuyers": [...]}'
        };

      case 7: // Painstorming
        return {
          step,
          content: {
            pains: [
              {
                id: "pain_1",
                description: "Inconsistent lead generation leading to feast-or-famine cycles",
                type: "functional",
                severity: "high",
                isFire: true
              },
              {
                id: "pain_2",
                description: "Anxiety about long-term business sustainability",
                type: "emotional",
                severity: "medium",
                isFire: false
              }
            ]
          },
          rawResponse: '{"pains": [...]}'
        };

      case 8: // Problem Up
        return {
          step,
          content: {
            problemUp: {
              selectedPains: ["pain_1", "pain_2"],
              selectedBuyers: ["buyer_1"],
              targetMoment: "When a SaaS founder has just experienced their third consecutive month of flat or declining growth",
              notes: "This is a critical moment when founders are most receptive to seeking help and implementing new strategies."
            }
          },
          rawResponse: '{"problemUp": {...}}'
        };

      case 9: // Refine Idea
        return {
          step,
          content: {
            refinedIdea: {
              description: "A 90-day program combining strategic consulting and implementation support to establish sustainable customer acquisition channels for SaaS founders",
              targetCustomers: "Early-stage SaaS founders who have launched a product but are experiencing flat or declining growth",
              version: "refined"
            },
            offer: {
              name: "SaaS Growth Blueprint",
              description: "A structured program that helps SaaS founders implement proven customer acquisition strategies to break through growth plateaus",
              format: "Hybrid coaching and implementation program"
            }
          },
          rawResponse: '{"refinedIdea": {...}, "offer": {...}}'
        };

      case 10: // Summary
        return {
          step,
          content: {
            reflections: {
              keyInsights: "The most compelling opportunity is helping early-stage SaaS founders overcome growth plateaus through a structured program that combines strategic guidance with implementation support. The target moment of 'three consecutive months of flat/declining growth' represents a critical pain point when founders are most receptive to seeking help.",
              nextSteps: "1. Conduct 5 validation interviews with SaaS founders who match the target buyer profile\n2. Create a simple landing page to test messaging and gauge interest\n3. Develop a detailed outline of the 90-day program curriculum\n4. Identify potential strategic partners who serve the same audience\n5. Test pricing models with a small group of potential customers"
            }
          },
          rawResponse: '{"reflections": {...}}'
        };

      default:
        return null;
    }
  }
}