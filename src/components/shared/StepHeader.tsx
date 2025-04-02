interface StepHeaderProps {
  title: string;
  description?: string;
}

export const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}; 