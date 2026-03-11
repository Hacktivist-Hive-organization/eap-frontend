export { formatUserName } from '@/utils';

import { formatDistanceToNow } from 'date-fns';

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
