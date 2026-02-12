import { formatDistanceToNow } from 'date-fns';

export function formatUserName(user: {
  first_name: string;
  last_name: string;
}): string {
  return `${user.first_name} ${user.last_name}`;
}

export function formatLastUpdate(
  dateString: string | null | undefined,
): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '-';
  }
}
