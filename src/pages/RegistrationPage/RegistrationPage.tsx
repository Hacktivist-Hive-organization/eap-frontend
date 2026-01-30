'use client';

import { LockKeyholeIcon, MailIcon, UserRoundIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Background, FormField } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { useRegistrationForm } from './hooks';

export function RegistrationPage() {
  const { form, onSubmit, isPending } = useRegistrationForm();

  return (
    <Background>
      <Card className="relative z-10 w-full max-w-md shadow-xl border-white/50 bg-white/70 backdrop-blur-md">
        <CardHeader>
          <img
            src="../src/assets/Desk-X_tr.svg"
            alt="desk-x logo"
            className="w-1/2 mx-auto object-contain mb-2"
          />
          <CardDescription className="flex items-center justify-center">
            Join Enterprise Application Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <Separator />
        <CardFooter className="justify-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link to="/login" className="ml-1 text-primary hover:underline">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </Background>
  );
}
