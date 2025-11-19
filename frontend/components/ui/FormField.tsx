import { forwardRef, ReactNode } from 'react';
import Input, { InputProps } from './Input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  icon?: ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="form-label">
          {label}
          {required && <span className="ml-1 text-danger-600">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            error={!!error}
            className={cn(icon && 'pl-10', className)}
            {...props}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        {!error && helperText && <p className="form-help">{helperText}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
