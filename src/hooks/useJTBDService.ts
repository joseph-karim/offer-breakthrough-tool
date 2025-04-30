/**
 * Hook for using the JTBD service in components
 */

import { useState } from 'react';
import { OpenAIService } from '../services/openai';
import { JTBDService, JTBDInput, JTBDOutput } from '../services/jtbdService';
import { fineTunedModels } from '../config/fineTunedModels';

export const useJTBDService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateJobStatements = async (
    input: JTBDInput,
    apiKey: string
  ): Promise<JTBDOutput | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create OpenAI service
      const openaiService = new OpenAIService({
        apiKey,
        model: 'gpt-4.1-2025-04-14' // Fallback model if fine-tuned model is not available
      });

      // Create JTBD service with the fine-tuned model ID
      const jtbdService = new JTBDService(
        openaiService,
        fineTunedModels.jtbdJobStatements
      );

      // Generate job statements
      const result = await jtbdService.generateJobStatements(input);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateJobStatements,
    isLoading,
    error
  };
};
