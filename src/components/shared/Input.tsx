import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
    const errorClasses = error ? "border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "";
    const disabledClasses = props.disabled ? "bg-gray-100 cursor-not-allowed" : "";
    
    const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
    
    return (
      <div>
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
); 