import { OpenAIService } from './openai';

interface BrainstormServiceConfig {
  openaiService: OpenAIService;
  model?: string;
}

export interface BrainstormContext {
  contextType: 'url' | 'text';
  contextValue: string;
}

export interface BrainstormIdea {
  conceptName: string;
  description: string;
}

/**
 * BrainstormService - Handles brainstorming of Big Ideas based on user context
 */
export class BrainstormService {
  private openai: OpenAIService;
  private model: string;

  constructor(config: BrainstormServiceConfig) {
    this.openai = config.openaiService;
    this.model = config.model || 'gpt-4.1-2025-04-14';
  }

  /**
   * Fetch and summarize content from a URL using Perplexity API via Netlify function
   */
  async fetchAndSummarizeUrl(url: string): Promise<string> {
    try {
      const response = await fetch('/.netlify/functions/fetchAndSummarizeUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('URL fetching error:', errorData);
        throw new Error(`Failed to fetch URL content: ${errorData.error}`);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error fetching URL content:', error);
      throw error;
    }
  }

  /**
   * Generate Big Idea suggestions based on user context
   */
  async generateBigIdeaSuggestions(context: BrainstormContext): Promise<BrainstormIdea[]> {
    try {
      let userInputBackgroundInfo = '';

      // Process the context based on its type
      if (context.contextType === 'url') {
        // Fetch and summarize the URL content
        userInputBackgroundInfo = await this.fetchAndSummarizeUrl(context.contextValue);
      } else {
        // Use the text directly
        userInputBackgroundInfo = context.contextValue;
      }

      // Generate suggestions using OpenAI
      const systemPrompt = `You are an AI assistant helping a user (likely a service provider like a consultant, freelancer, or agency owner) brainstorm initial scalable offer ideas for the Buyer Breakthrough Workshop. The user has provided summarized information about their current expertise or business (potentially extracted from a website or LinkedIn profile by another AI). Your task is to generate 3-5 distinct, scalable offer concepts.

# Task Description
Generate 3-5 distinct, scalable offer concepts (e.g., online course, productized service, template kit, group workshop, niche software idea). For each concept, provide a Concept Name and a brief Description of what it is and the primary benefit it offers.

# Input Context
User's Background/Expertise/Current Services (Summary from Website/LinkedIn or User Input): "${userInputBackgroundInfo}" 

# Methodology & Constraints
- Generate 3-5 distinct concepts.
- Each concept must include a **Concept Name** and a **Description**.
- The Description should briefly state what the offer is and the primary benefit or problem solved for potential customers, adhering to the format: '[What it is] + [what will it help customers do]'.
- Concepts MUST be scalable alternatives to traditional 1-on-1 services.
- Ensure concepts are plausibly related to the user's provided background summary.
- Focus on offer types that service-based entrepreneurs can realistically develop (e.g., courses, productized services, templates, workshops, simple software tools).

# Output Format
Provide exactly 3-5 distinct options. Format each option as follows, with no introductory or concluding text:

**Concept Name:** [Example: "Client Onboarding Automation Kit"]
**Description:** [Example: "A set of templates and video guides that helps freelance designers streamline and automate their new client intake process."]`;

      const userPrompt = `Please generate 3-5 scalable offer concepts based on the provided background information.`;

      // Get the structured output from OpenAI
      const response = await this.openai.generateStructuredOutput<{ ideas: BrainstormIdea[] }>(
        systemPrompt,
        userPrompt,
        0.7,
        this.model
      );

      // If the response doesn't have the expected structure, try to parse it manually
      if (!response.ideas) {
        // Try to parse the raw response
        const rawResponse = await this.openai.generateCompletion(
          systemPrompt,
          userPrompt,
          0.7,
          this.model
        );

        return this.parseRawIdeaResponse(rawResponse);
      }

      return response.ideas;
    } catch (error) {
      console.error('Error generating Big Idea suggestions:', error);
      // Return fallback suggestions
      return this.getFallbackSuggestions();
    }
  }

  /**
   * Refine an existing Big Idea based on user feedback
   */
  async refineBigIdea(initialIdea: string, userFeedback: string): Promise<BrainstormIdea[]> {
    try {
      const systemPrompt = `You are an AI assistant helping a user refine their initial product/service idea for the Buyer Breakthrough Workshop. The user is a service-based entrepreneur looking to create a more scalable offer. Your task is to generate 3-5 concise "Big Idea" statements adhering strictly to the format: "[What it is] + [what will it help customers do]".

# Task Description
Generate 3-5 concise "Big Idea" statements based on the user's input.

# Input Context
User's Initial Idea Draft: "${initialIdea}"
User's Refinement Request: "${userFeedback}" 

# Methodology & Constraints
- Statements MUST follow the format: "[What it is] + [what will it help customers do]".
- "[What it is]" should describe a scalable offer type (e.g., online course, productized service, template kit, group workshop, software tool).
- "[what will it help customers do]" must be a clear, concise benefit or outcome for the customer, ideally hinting at a problem solved.
- Ensure suggestions are relevant to a service provider aiming for scalability.
- Generate 3-5 distinct options.
- If the user's initial idea is vague, try to make the suggestions more concrete and actionable.
- If the user's initial idea already mentions a scalable format, build upon that. If not, suggest suitable scalable formats.

# Output Format
Provide exactly 3-5 distinct options, each on a new line, following the specified format. Do not include any introductory or concluding text, only the list of options.`;

      const userPrompt = `Please refine the following Big Idea based on my feedback: "${initialIdea}". My feedback: "${userFeedback}"`;

      // Get the structured output from OpenAI
      const response = await this.openai.generateStructuredOutput<{ ideas: BrainstormIdea[] }>(
        systemPrompt,
        userPrompt,
        0.7,
        this.model
      );

      // If the response doesn't have the expected structure, try to parse it manually
      if (!response.ideas) {
        // Try to parse the raw response
        const rawResponse = await this.openai.generateCompletion(
          systemPrompt,
          userPrompt,
          0.7,
          this.model
        );

        return this.parseRawIdeaResponse(rawResponse);
      }

      return response.ideas;
    } catch (error) {
      console.error('Error refining Big Idea:', error);
      // Return fallback suggestions
      return this.getFallbackSuggestions();
    }
  }

  /**
   * Parse raw idea response from OpenAI
   */
  private parseRawIdeaResponse(rawResponse: string): BrainstormIdea[] {
    try {
      const ideas: BrainstormIdea[] = [];
      
      // Try to parse the response as a list of ideas
      const lines = rawResponse.split('\n').filter(line => line.trim().length > 0);
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line contains a concept name
        if (line.includes('**Concept Name:**')) {
          const conceptName = line.replace('**Concept Name:**', '').trim();
          
          // Look for the description in the next line
          if (i + 1 < lines.length && lines[i + 1].includes('**Description:**')) {
            const description = lines[i + 1].replace('**Description:**', '').trim();
            
            ideas.push({
              conceptName,
              description
            });
            
            // Skip the description line
            i++;
          }
        }
      }
      
      // If we couldn't parse any ideas, try a different approach
      if (ideas.length === 0) {
        // Try to parse each line as a complete idea
        for (const line of lines) {
          if (line.trim().length > 0) {
            ideas.push({
              conceptName: 'Scalable Offer Concept',
              description: line.trim()
            });
          }
        }
      }
      
      return ideas.length > 0 ? ideas : this.getFallbackSuggestions();
    } catch (error) {
      console.error('Error parsing raw idea response:', error);
      return this.getFallbackSuggestions();
    }
  }

  /**
   * Get fallback suggestions if API calls fail
   */
  private getFallbackSuggestions(): BrainstormIdea[] {
    return [
      {
        conceptName: 'Group Coaching Program',
        description: 'A 6-week group coaching program that helps bootstrapped startups fix their user onboarding experience'
      },
      {
        conceptName: 'Content Repurposing Tool',
        description: 'A SaaS tool that helps content creators repurpose their content across multiple platforms'
      },
      {
        conceptName: 'Designer Community',
        description: 'A membership community that provides ongoing support and resources for freelance designers'
      },
      {
        conceptName: 'E-commerce SEO Service',
        description: 'A productized service that delivers monthly SEO audits and recommendations for e-commerce stores'
      },
      {
        conceptName: 'AI Operations Course',
        description: 'A course that teaches small business owners how to use AI tools to streamline their operations'
      }
    ];
  }
}
