'use client';

import { LockKeyholeIcon, MailIcon } from 'lucide-react';
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
import { useLoginForm } from './hooks';

export function LoginPage() {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <Background>
      <Card className="relative z-10 w-full max-w-md shadow-xl border-white/50 bg-white/70 backdrop-blur-md">
        <CardHeader>
          <img
            src="../src/assets/Desk-X_tr.svg"
            alt="desk-x logo"
            className="w-1/2 mx-auto object-contain mb-4"
          />
          <CardDescription className="flex items-center justify-center">
            Welcome back to your desk
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <Separator />
        <CardFooter className="justify-center text-sm">
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>
          <Link to="/register" className="ml-1 text-primary hover:underline">
            Create new account
          </Link>
        </CardFooter>
      </Card>
    </Background>
  );
}
