import * as React from 'react';
import { cn } from '@/lib/utils';

const Form = React.forwardRef<HTMLFormElement, React.ComponentProps<'form'>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn('space-y-4', className)} {...props} />
  ),
);

const FormField = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-1">{children}</div>
);

const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col">{children}</div>
);

// Updated FormLabel: supports htmlFor for accessibility
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}
const FormLabel = ({
  children,
  htmlFor,
  className,
  ...props
}: FormLabelProps) => (
  <label
    htmlFor={htmlFor}
    className={cn('text-sm font-medium', className)}
    {...props}
  >
    {children}
  </label>
);

const FormMessage = ({ children }: { children?: React.ReactNode }) =>
  children ? <p className="text-xs text-destructive mt-1">{children}</p> : null;

const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export { Form, FormField, FormItem, FormLabel, FormMessage, FormControl };
