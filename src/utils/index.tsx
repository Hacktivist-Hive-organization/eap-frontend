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
