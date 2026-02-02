interface StateMessageProps {
  message: string;
}

export function StateMessage({ message }: StateMessageProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">{message}</p>
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
