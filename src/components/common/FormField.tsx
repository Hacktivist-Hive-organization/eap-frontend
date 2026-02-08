import { EyeIcon, EyeOffIcon, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface FormFieldProps<TFormData extends FieldValues> {
  form: UseFormReturn<TFormData>;
  name: Path<TFormData>;
  label: string;
  id: string;
  icon?: LucideIcon;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
}

export function FormField<TFormData extends FieldValues>({
  form,
  name,
  label,
  id,
  icon: Icon,
  placeholder,
  type = 'text',
}: FormFieldProps<TFormData>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              {...field}
              id={id}
              type={inputType}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              className={`${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''}`}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
