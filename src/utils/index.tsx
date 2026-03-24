export function getAvatarUrl(
  avatarPath: string | null | undefined,
): string | undefined {
  if (!avatarPath) return undefined;
  return `${import.meta.env.VITE_API_URL}${avatarPath}`;
}

export function formatUserName(user: {
  first_name: string;
  last_name: string;
}): string {
  return `${user.first_name} ${user.last_name}`;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
