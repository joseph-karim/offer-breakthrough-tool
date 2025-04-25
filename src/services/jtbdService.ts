/**
 * JTBDService - Service for generating JTBD job statements using fine-tuned model
 *
 * This service uses a fine-tuned OpenAI model to generate Job-to-be-Done (JTBD)
 * job statements based on product/service information, desired outcomes, and trigger events.
 */

import { OpenAIService } from './openai';

// Types for JTBD input and output
export interface JTBDInput {
  productService: string;
  desiredOutcomes: string;
  triggerEvents: string;
}

export interface JTBDOutput {
  overarchingJobStatement: string;
  supportingJobStatements: string[];
}

export class JTBDService {
  private openai: OpenAIService;
  private fineTunedModelId: string;

  constructor(openaiService: OpenAIService, modelId: string = 'gpt-4.1-2025-04-14') {
    this.openai = openaiService;
    this.fineTunedModelId = modelId;
  }

  /**
   * Generate JTBD job statements using the GPT-4.1 model
   */
  async generateJobStatements(input: JTBDInput): Promise<JTBDOutput> {
    try {
      // Format the input in the same way as the training data
      const userPrompt = `Here's the information about my offer:

* Product/Service: ${input.productService}
* Desired Outcomes: ${input.desiredOutcomes}
* Trigger Events: ${input.triggerEvents}`;

      // System prompt for base GPT-4.1 model
      const systemPrompt = `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology by Clayton Christensen and Bob Moesta. Your task is to analyze the user's input about their business/product idea, desired outcomes, and key trigger events to generate accurate, progress-focused Job Statements.

# Task Description
Generate one potential "Overarching Job Statement" and 3-5 distinct "Supporting Job Statements" that represent the progress the user's target customers are trying to make when they might "hire" the user's product or service.

# Input Context
You will be provided with the following information from the user:
1.  **Product/Service Idea:** A brief description of what the user offers or plans to offer.
2.  **Desired Outcomes:** The results or improvements (functional and emotional) customers achieve using the solution.
3.  **Trigger Events:** Specific situations, problems, or 'final straw' moments that prompt customers to seek a solution like the user's

# Methodology & Constraints
- **Focus on Progress:** Job statements MUST describe the customer's desired progress, *not* the product's features or the solution itself.
- **Solution-Agnostic:** The statement should be broad enough that multiple different solutions could potentially fulfill the job.
- **Format:** Strictly adhere to the format: "Help me [VERB] my [OBJECT] [CONTEXT]". Use clear, active verbs.
- **Context is Key:** Incorporate relevant context (time constraints, resource limitations, emotional states, etc.) derived from the trigger events and desired outcomes.
- **Distinguish Job Types:** Clearly label the "Overarching Job Statement" (the main goal) and the "Supporting Job Statements" (more specific jobs related to achieving the main one).
- **Avoid Common Mistakes:** Do not generate statements that are product-focused, too vague, feature-oriented, or treat the solution category as the job itself.

# Output Format
Provide the output as follows:

**Overarching Job Statement:**
* Help me [VERB] my [OBJECT] [CONTEXT]

**Supporting Job Statements:**
1.  Help me [VERB] my [OBJECT] [CONTEXT]
2.  Help me [VERB] my [OBJECT] [CONTEXT]
3.  Help me [VERB] my [OBJECT] [CONTEXT]
4.  (Optional) Help me [VERB] my [OBJECT] [CONTEXT]
5.  (Optional) Help me [VERB] my [OBJECT] [CONTEXT]

Do not include any additional commentary or explanation unless specifically requested.

# Examples

**Example 1: Freelance Email Strategist**
* **User Input:**
    * Product/Service: Productized service for planning and writing product launch email sequences.
    * Outcomes: Successful product launches, increased launch revenue, less stress during launches, ability to focus on product instead of marketing copy.
    * Triggers: Upcoming product launch with no marketing plan, previous launch emails underperformed, feeling overwhelmed by launch tasks, wants to delegate email writing to an expert.
* **Generated Output:**
    **Overarching Job Statement:**
    * Help me execute successful product launches that maximize revenue without diverting focus from my core product development.
    **Supporting Job Statements:**
    1.  Help me craft compelling email sequences that convert subscribers during a high-stakes product launch.
    2.  Help me confidently delegate launch email strategy and writing when facing tight deadlines and limited marketing expertise.
    3.  Help me reduce the stress and overwhelm associated with planning and executing launch marketing campaigns.
    4.  Help me ensure my launch messaging resonates with my target audience to drive immediate sales.

**Example 2: Fitness Trainer (Group Program)**
* **User Input:**
    * Product/Service: Group weight loss program for busy professionals.
    * Outcomes: Sustainable weight loss, improved energy levels, better eating habits, feeling more confident, fitting into old clothes.
    * Triggers: Doctor recommended weight loss for health reasons, feeling constantly tired, clothes no longer fit, upcoming reunion or event, tried solo diets and failed.
* **Generated Output:**
    **Overarching Job Statement:**
    * Help me achieve sustainable weight loss and increased energy levels despite a demanding professional schedule.
    **Supporting Job Statements:**
    1.  Help me integrate healthier eating and exercise habits into my busy lifestyle without requiring significant time commitments.
    2.  Help me regain confidence in my appearance for an important upcoming personal event.
    3.  Help me overcome previous weight loss failures by providing structure and accountability within a supportive community.
    4.  Help me manage health concerns related to weight through a practical, long-term approach.

# Notes
- Base the job statements directly on the struggles, circumstances, and desired progress implied by the user's inputs, especially the trigger events.
- Ensure verbs are action-oriented and the context adds specificity.`;

      // Generate completion using the GPT-4.1 model
      const response = await this.openai.generateCompletion(
        systemPrompt,
        userPrompt,
        0.7,
        this.fineTunedModelId
      );

      // Parse the response
      return this.parseJobStatements(response);
    } catch (error) {
      console.error('Error generating JTBD job statements:', error);
      throw new Error('Failed to generate job statements');
    }
  }

  /**
   * Parse the response from the model into structured job statements
   */
  private parseJobStatements(response: string): JTBDOutput {
    try {
      // Extract the overarching job statement
      const ojsMatch = response.match(/\*\*Overarching Job Statement:\*\*\s*\n\*\s*(.*?)(?=\s*\n\s*\*\*Supporting)/s);
      const overarchingJobStatement = ojsMatch ? ojsMatch[1].trim() : '';

      // Extract the supporting job statements
      const sjsMatches = response.match(/\*\*Supporting Job Statements:\*\*\s*\n([\s\S]*?)(?=$)/);
      const supportingJobStatementsText = sjsMatches ? sjsMatches[1] : '';

      // Split the supporting job statements by line and clean them up
      const supportingJobStatements = supportingJobStatementsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^\d+\.\s*Help me/))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      return {
        overarchingJobStatement,
        supportingJobStatements
      };
    } catch (error) {
      console.error('Error parsing job statements:', error);
      return {
        overarchingJobStatement: '',
        supportingJobStatements: []
      };
    }
  }

  /**
   * Generate alternative suggestions for job statements
   */
  async generateSuggestions(
    type: 'overarching' | 'supporting',
    currentStatement: string,
    input: JTBDInput,
    count: number = 3
  ): Promise<Array<{id: string; content: string; type: 'overarching' | 'supporting'}>> {
    try {
      // Format the input for our model
      const userPrompt = `Here's the information about my offer:

* Product/Service: ${input.productService}
* Desired Outcomes: ${input.desiredOutcomes}
* Trigger Events: ${input.triggerEvents}

Current ${type === 'overarching' ? 'Overarching Job Statement' : 'Supporting Job Statement'}: "${currentStatement}"

Please generate ${count} alternative ${type === 'overarching' ? 'Overarching Job Statements' : 'Supporting Job Statements'} that might be better.`;

      const systemPrompt = `You are an expert assistant trained in the Jobs-to-be-Done (JTBD) methodology by Clayton Christensen and Bob Moesta. Your task is to analyze the current job statement and generate improved alternatives that better capture the customer's desired progress.

# Task Description
Generate exactly ${count} alternative job statements that improve upon the current one. These should better capture the essence of the progress the customer is trying to make.

# Improvement Guidelines
- **Focus on Progress:** Job statements MUST describe the customer's desired progress, *not* the product's features or the solution itself.
- **Solution-Agnostic:** The statement should be broad enough that multiple different solutions could potentially fulfill the job.
- **Format:** Strictly adhere to the format: "Help me [VERB] my [OBJECT] [CONTEXT]". Use clear, active verbs.
- **Context is Key:** Incorporate relevant context (time constraints, resource limitations, emotional states, etc.)
- **Specificity:** Make statements more concrete and specific to the customer's situation
- **Emotional Resonance:** Capture the emotional aspects of the job to be done
- **Avoid Common Mistakes:** Do not generate statements that are product-focused, too vague, feature-oriented, or treat the solution category as the job itself.

# Output Format
Provide exactly ${count} numbered alternatives:

1. Help me [VERB] my [OBJECT] [CONTEXT]
2. Help me [VERB] my [OBJECT] [CONTEXT]
3. Help me [VERB] my [OBJECT] [CONTEXT]

Do not include any additional text, explanations, or commentary.`;

      // Generate completion using the GPT-4.1 model
      const response = await this.openai.generateCompletion(
        systemPrompt,
        userPrompt,
        0.8,
        this.fineTunedModelId
      );

      // Parse the response to extract the alternative statements
      const lines = response.split('\n').filter(line => line.trim());
      const suggestions: string[] = [];

      for (const line of lines) {
        // Look for numbered lines or lines starting with asterisks
        if (/^(\d+\.|-)/.test(line)) {
          const statement = line.replace(/^(\d+\.|-)\s*/, '').trim();
          if (statement && !statement.toLowerCase().includes('alternative') && !statement.toLowerCase().includes('suggestion')) {
            suggestions.push(statement);
          }
        } else if (line.includes('Help me')) {
          suggestions.push(line.trim());
        }
      }

      // If we couldn't parse any suggestions, return some defaults
      if (!suggestions.length) {
        if (type === 'overarching') {
          suggestions.push(
            "Help me solve my core problem efficiently and effectively",
            "Help me achieve my desired outcome with minimal friction",
            "Help me transform my current situation into my desired state"
          );
        } else {
          suggestions.push(
            "Help me understand the full value of this solution",
            "Help me implement this solution with confidence",
            "Help me measure the impact of this solution on my goals"
          );
        }
      }

      // Format the suggestions as objects with IDs
      return suggestions.slice(0, count).map((content, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        content,
        type
      }));
    } catch (error) {
      console.error('Error generating suggestions:', error);

      // Return default suggestions in case of error
      const defaults = type === 'overarching'
        ? [
            "Help me solve my core problem efficiently and effectively",
            "Help me achieve my desired outcome with minimal friction",
            "Help me transform my current situation into my desired state"
          ]
        : [
            "Help me understand the full value of this solution",
            "Help me implement this solution with confidence",
            "Help me measure the impact of this solution on my goals"
          ];

      return defaults.map((content, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        content,
        type
      }));
    }
  }
}
