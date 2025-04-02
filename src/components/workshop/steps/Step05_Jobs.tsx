import { useState } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { TextArea } from '../../shared/TextArea';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import type { Job } from '../../../types/workshop';

export const Step05_Jobs = () => {
  const { workshopData, updateWorkshopData } = useWorkshopStore();
  const [newJob, setNewJob] = useState('');
  const jobs = workshopData?.jobs || [];

  const handleAddJob = () => {
    if (!newJob.trim()) return;
    
    const job: Job = {
      id: Date.now().toString(),
      description: newJob.trim(),
      source: 'user'
    };

    updateWorkshopData({
      jobs: [...jobs, job]
    });
    setNewJob('');
  };

  const handleRemoveJob = (id: string) => {
    updateWorkshopData({
      jobs: jobs.filter(job => job.id !== id)
    });
  };

  const handleSuggestionAccept = (suggestion: any) => {
    if (Array.isArray(suggestion.jobs)) {
      updateWorkshopData({
        jobs: [
          ...jobs,
          ...suggestion.jobs
        ]
      });
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Define Jobs to be Done"
        description="What are your customers trying to accomplish?"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="prose prose-slate max-w-none space-y-8">
          <p className="text-lg">
            Jobs to be Done (JTBD) are the fundamental tasks or goals your customers are trying to
            achieve. Understanding these jobs helps you create solutions that directly address their
            needs.
          </p>

          <Card>
            <div className="space-y-6">
              <TextArea
                label="Add a Job to be Done"
                description="Describe a specific task, goal, or outcome that your customers want to achieve."
                value={newJob}
                onChange={(e) => setNewJob(e.target.value)}
                placeholder="Example: Build a reliable stream of recurring revenue..."
              />
              <button
                onClick={handleAddJob}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Job
              </button>
            </div>
          </Card>

          {jobs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Jobs to be Done</h3>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg">{job.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: {job.source === 'user' ? 'You' : 'AI Assistant'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveJob(job.id)}
                      className="ml-4 p-2 text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-secondary/50">
            <h4 className="text-lg font-semibold mb-3">Tips for Defining Jobs</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Focus on outcomes, not features or solutions</li>
              <li>Include both functional and emotional jobs</li>
              <li>Consider the context and circumstances</li>
              <li>Think about related jobs and dependencies</li>
              <li>Use specific, actionable language</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-8">
          <ChatInterface
            step={5}
            stepContext="defining jobs to be done that customers want to accomplish"
            questions={STEP_QUESTIONS[5]}
            onSuggestionAccept={handleSuggestionAccept}
          />
          
          <Card className="bg-primary/10 p-4">
            <h4 className="font-semibold mb-2">How the AI Assistant Can Help</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Identify hidden or implicit jobs</li>
              <li>Suggest related jobs based on your input</li>
              <li>Help distinguish between different job types</li>
              <li>Provide examples from similar markets</li>
              <li>Refine job statements for clarity</li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Understanding Jobs to be Done helps you create solutions that directly address what your
          customers are trying to achieve, making your offer more compelling and valuable.
        </p>
      </div>
    </div>
  );
}; 