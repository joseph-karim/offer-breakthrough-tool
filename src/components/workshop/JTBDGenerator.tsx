import React, { useState } from 'react';
import { useJTBDService } from '../../hooks/useJTBDService';
import { JTBDInput, JTBDOutput } from '../../services/jtbdService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

interface JTBDGeneratorProps {
  apiKey: string;
  onJobStatementsGenerated?: (jobStatements: JTBDOutput) => void;
}

export const JTBDGenerator: React.FC<JTBDGeneratorProps> = ({
  apiKey,
  onJobStatementsGenerated
}) => {
  const [input, setInput] = useState<JTBDInput>({
    productService: '',
    desiredOutcomes: '',
    triggerEvents: ''
  });

  const [jobStatements, setJobStatements] = useState<JTBDOutput | null>(null);
  const { generateJobStatements, isLoading, error } = useJTBDService();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof JTBDInput
  ) => {
    setInput(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await generateJobStatements(input, apiKey);
    
    if (result) {
      setJobStatements(result);
      
      if (onJobStatementsGenerated) {
        onJobStatementsGenerated(result);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generate JTBD Job Statements</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product/Service
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[80px]"
              value={input.productService}
              onChange={e => handleInputChange(e, 'productService')}
              placeholder="Describe your product or service..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Desired Outcomes
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[80px]"
              value={input.desiredOutcomes}
              onChange={e => handleInputChange(e, 'desiredOutcomes')}
              placeholder="What outcomes do your customers want to achieve?"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Trigger Events
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[80px]"
              value={input.triggerEvents}
              onChange={e => handleInputChange(e, 'triggerEvents')}
              placeholder="What events trigger your customers to seek a solution?"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Job Statements'
            )}
          </Button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </Card>
      
      {jobStatements && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Job Statements</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Overarching Job Statement:</h3>
              <p className="p-3 bg-gray-50 rounded-md">
                {jobStatements.overarchingJobStatement}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Supporting Job Statements:</h3>
              <ul className="list-decimal pl-5 space-y-2">
                {jobStatements.supportingJobStatements.map((statement, index) => (
                  <li key={index} className="p-2">
                    <p className="p-2 bg-gray-50 rounded-md">{statement}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
