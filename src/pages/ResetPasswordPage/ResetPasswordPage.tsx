'use client';

import { LockKeyholeIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AuthFormCard } from '@/components/common/AuthFormCard';
import { Background } from '@/components/common/Background';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useResetPasswordForm } from './hooks';

export function ResetPasswordPage() {
  const { hash } = useLocation();
  const token = hash.slice(1);

  const { form, onSubmit, isPending } = useResetPasswordForm(token);

  if (!token) {
    return (
      <Background>
        <AuthFormCard
          description="Reset your password"
          footerText="Back to"
          footerLinkText="Sign in"
          footerLinkTo="/login"
        >
          <p className="text-center text-sm text-destructive py-2">
            Invalid or missing reset token. Please request a new password reset
            link.
          </p>
        </AuthFormCard>
      </Background>
    );
  }

  return (
    <Background>
      <AuthFormCard
        description="Set a new password"
        footerText="Back to"
        footerLinkText="Sign in"
        footerLinkTo="/login"
      >
        <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormField
              form={form}
              name="new_password"
              label="New password"
              id="reset-new-password"
              type="password"
              icon={LockKeyholeIcon}
              placeholder="••••••••"
            />
            <FormField
              form={form}
              name="confirm_password"
              label="Confirm password"
              id="reset-confirm-password"
              type="password"
              icon={LockKeyholeIcon}
              placeholder="••••••••"
            />
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="reset-password-form"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Resetting...' : 'Reset password'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </Background>
  );
}
