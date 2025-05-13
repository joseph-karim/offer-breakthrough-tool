/**
 * Mock OpenAI service for development when Netlify functions are not available
 * This provides a fallback for the OpenAI proxy when running in development mode
 */

import type { ChatCompletionMessageParam } from 'openai/resources';

/**
 * Generate a mock response for the OpenAI API
 * This is used when the Netlify function is not available and no API key is provided
 */
export function generateMockResponse(
  messages: ChatCompletionMessageParam[],
  options: { model: string; temperature?: number; max_tokens?: number }
) {
  // Extract the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  const systemMessage = messages.filter(m => m.role === 'system').pop()?.content || '';

  // Convert content to string if it's an array
  const lastUserMessageStr = typeof lastUserMessage === 'string'
    ? lastUserMessage
    : JSON.stringify(lastUserMessage);

  const systemMessageStr = typeof systemMessage === 'string'
    ? systemMessage
    : JSON.stringify(systemMessage);

  console.log('Generating mock response for:', {
    systemMessage: systemMessageStr.substring(0, 100) + '...',
    userMessage: lastUserMessageStr.substring(0, 100) + '...',
    model: options.model
  });

  // For pain parsing, return a structured mock response
  if (
    systemMessageStr.includes('painstorming analysis') &&
    lastUserMessageStr.includes('parse the following painstorming analysis')
  ) {
    return {
      id: 'mock-completion-id',
      object: 'chat.completion',
      created: Date.now(),
      model: options.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify({
              buyerSegmentPains: {
                "Solopreneurs": [
                  {
                    "description": "Struggling to manage all aspects of business alone",
                    "type": "functional",
                    "isFire": true
                  },
                  {
                    "description": "Feeling overwhelmed by too many responsibilities",
                    "type": "emotional",
                    "isFire": true
                  },
                  {
                    "description": "Limited resources for marketing and growth",
                    "type": "functional",
                    "isFire": false
                  }
                ],
                "Small Business Owners": [
                  {
                    "description": "Difficulty finding reliable team members",
                    "type": "functional",
                    "isFire": true
                  },
                  {
                    "description": "Stress from financial uncertainty",
                    "type": "emotional",
                    "isFire": true
                  },
                  {
                    "description": "Lack of systems for consistent delivery",
                    "type": "functional",
                    "isFire": false
                  }
                ]
              },
              overlappingPains: [
                {
                  "description": "Not enough time for strategic planning",
                  "type": "functional",
                  "isFire": true
                },
                {
                  "description": "Inconsistent revenue streams",
                  "type": "functional",
                  "isFire": true
                },
                {
                  "description": "Difficulty standing out in a crowded market",
                  "type": "social",
                  "isFire": false
                }
              ]
            })
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 200,
        total_tokens: 300
      }
    };
  }

  // Default mock response
  return {
    id: 'mock-completion-id',
    object: 'chat.completion',
    created: Date.now(),
    model: options.model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: `This is a mock response for development. The OpenAI API proxy is not available.

You asked about: "${lastUserMessageStr.substring(0, 50)}..."

In a real environment, this would connect to the OpenAI API through the Netlify function.
Please make sure you have:
1. Set up the Netlify function correctly
2. Provided an OpenAI API key in your environment variables
3. Or are running with 'netlify dev' to access the functions locally`
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300
    }
  };
}
