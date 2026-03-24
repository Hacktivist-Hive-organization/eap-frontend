'use client';

import { LockKeyholeIcon, MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthFormCard } from '@/components/common/AuthFormCard';
import { Background } from '@/components/common/Background';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useLoginForm } from './hooks';

export function LoginPage() {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <Background>
      <AuthFormCard
        description="Welcome back to your desk"
        footerText="Don't have an account?"
        footerLinkText="Create new account"
        footerLinkTo="/register"
      >
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormField
              form={form}
              name="email"
              label="Email address"
              id="login-email"
              icon={MailIcon}
              placeholder="name@company.com"
            />
            <FormField
              form={form}
              name="password"
              label="Password"
              id="login-password"
              type="password"
              icon={LockKeyholeIcon}
              placeholder="••••••••"
              labelRight={
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              }
            />
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="login-form"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </Background>
  );
}
