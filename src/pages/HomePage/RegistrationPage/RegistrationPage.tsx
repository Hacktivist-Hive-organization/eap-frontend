'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyholeIcon, MailIcon, UserRoundIcon } from 'lucide-react';
import type * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { Background } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

export function RegistrationPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast('You submitted the following values:', {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    });
  }

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
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        First Name
                      </FieldLabel>
                      <div className="relative">
                        <UserRoundIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Last Name
                      </FieldLabel>
                      <div className="relative">
                        <UserRoundIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Email address
                    </FieldLabel>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="name@company.com"
                        className="pl-10"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex justify-between">
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Password
                      </FieldLabel>
                    </div>
                    <div className="relative">
                      <LockKeyholeIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field orientation="horizontal">
                <Button type="submit" form="form-rhf-demo" className="w-full">
                  Sign Up
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
