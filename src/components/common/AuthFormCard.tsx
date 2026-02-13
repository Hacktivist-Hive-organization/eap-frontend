import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Logo } from './Logo';

interface AuthFormCardProps {
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthFormCard({
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthFormCardProps) {
  return (
    <Card className="relative z-10 w-full max-w-md shadow-xl border-white/50 bg-white/70 backdrop-blur-md">
      <CardHeader>
        <Logo className="w-1/2 mx-auto mb-4" />
        <CardDescription className="flex items-center justify-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <Separator />
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">{footerText}</span>
        <Link to={footerLinkTo} className="ml-1 text-primary hover:underline">
          {footerLinkText}
        </Link>
      </CardFooter>
    </Card>
  );
}
