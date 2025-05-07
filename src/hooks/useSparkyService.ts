import { SparkyService } from '../services/sparkyService';
import { OpenAIService } from '../services/openai';

// Create singleton instances of the services
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
const openaiService = new OpenAIService({
  apiKey: apiKey
});
const sparkyService = new SparkyService(openaiService);

/**
 * Hook to access the SparkyService
 */
export const useSparkyService = () => {
  // Return the singleton instance
  return sparkyService;
};
