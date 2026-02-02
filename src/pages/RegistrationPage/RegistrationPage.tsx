'use client';

import { LockKeyholeIcon, MailIcon, UserRoundIcon } from 'lucide-react';
import { AuthFormCard } from '@/components/common/AuthFormCard';
import { Background } from '@/components/common/Background';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useRegistrationForm } from './hooks';

export function RegistrationPage() {
  const { form, onSubmit, isPending } = useRegistrationForm();

  return (
    <Background>
      <AuthFormCard
        description="Join Enterprise Application Platform"
        footerText="Already have an account?"
        footerLinkText="Sign In"
        footerLinkTo="/login"
      >
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                form={form}
                name="first_name"
                label="First Name"
                id="register-first-name"
                icon={UserRoundIcon}
              />
              <FormField
                form={form}
                name="last_name"
                label="Last Name"
                id="register-last-name"
                icon={UserRoundIcon}
              />
            </div>
            <FormField
              form={form}
              name="email"
              label="Email address"
              id="register-email"
              icon={MailIcon}
              placeholder="name@company.com"
            />
            <FormField
              form={form}
              name="password"
              label="Password"
              id="register-password"
              type="password"
              icon={LockKeyholeIcon}
              placeholder="••••••••"
            />
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="register-form"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Creating account...' : 'Sign Up'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </Background>
  );
}
