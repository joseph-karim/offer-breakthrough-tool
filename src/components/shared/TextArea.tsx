interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
}

export const TextArea = ({ label, description, className = '', ...props }: TextAreaProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold">{label}</label>
      {description && (
        <p className="text-muted-foreground mb-2">{description}</p>
      )}
      <textarea
        className={`w-full min-h-[100px] p-3 rounded-md border bg-background ${className}`}
        {...props}
      />
    </div>
  );
}; 