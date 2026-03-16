'use client';

import { MailIcon } from 'lucide-react';
import { AuthFormCard } from '@/components/common/AuthFormCard';
import { Background } from '@/components/common/Background';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useForgotPasswordForm } from './hooks';

export function ForgotPasswordPage() {
  const { form, onSubmit, isPending, isSuccess } = useForgotPasswordForm();

  return (
    <Background>
      <AuthFormCard
        description="Reset your password"
        footerText="Remembered your password?"
        footerLinkText="Sign in"
        footerLinkTo="/login"
      >
        {isSuccess ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            If the email is registered, you will receive a password reset link
            shortly.
          </p>
        ) : (
          <form
            id="forgot-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <FormField
                form={form}
                name="email"
                label="Email address"
                id="forgot-password-email"
                icon={MailIcon}
                placeholder="name@company.com"
              />
              <Field orientation="horizontal">
                <Button
                  type="submit"
                  form="forgot-password-form"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Send reset link'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </AuthFormCard>
    </Background>
  );
}
