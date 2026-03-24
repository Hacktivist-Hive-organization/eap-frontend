import { Button } from '@/components/ui/button';

interface StateMessageProps {
  message: string;
  action?: React.ReactNode;
}

export function StateMessage({ message, action }: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-64">
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

export function LoadingState() {
  return <StateMessage message="Loading..." />;
}

export function EmptyState({
  message = 'No data available',
}: {
  message?: string;
}) {
  return <StateMessage message={message} />;
}

export function ComingSoonState() {
  return <StateMessage message="Coming soon" />;
}

export function ErrorState({
  message = 'Failed to load data',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <StateMessage
      message={message}
      action={
        onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  );
}
