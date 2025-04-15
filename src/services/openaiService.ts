/**
 * OpenAIService - Wrapper for OpenAI API
 * 
 * This is a simplified wrapper for the OpenAI API.
 * In a production app, you would want to:
 * 1. Move API calls to a backend server
 * 2. Implement proper error handling and rate limiting
 * 3. Add caching for response efficiency
 */

export class OpenAIService {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint?: string) {
    this.apiKey = apiKey;
    this.endpoint = endpoint || 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Generate a text completion from OpenAI
   */
  async generateCompletion(prompt: string, temperature = 0.7): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful, expert business coach assisting with a buyer breakthrough workshop.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Generate structured JSON output from OpenAI
   */
  async generateStructuredJson<T = Record<string, unknown>>(prompt: string, temperature = 0.7): Promise<T> {
    try {
      const systemPrompt = `
        You are an AI assistant with expertise in business strategy and marketing.
        Your task is to generate structured JSON output based on the user's prompt.
        Follow the requested output format EXACTLY.
        Ensure the JSON is valid and matches the schema specified in the user's prompt.
        Only respond with the JSON object, nothing else.
      `;

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const jsonString = data.choices[0]?.message?.content || '{}';
      
      try {
        // If it's already an object, return it
        if (typeof jsonString === 'object') return jsonString;
        
        // Otherwise parse the string
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON from OpenAI response:', error);
        console.debug('Received content:', jsonString);
        return {} as T; // Return empty object on parse error
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
} 