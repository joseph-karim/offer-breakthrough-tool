import { ReactNode } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const { currentStep, setCurrentStep } = useWorkshopStore();

  const totalSteps = 10;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      await setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      await setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Offer Breakthrough Workshop</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}; 