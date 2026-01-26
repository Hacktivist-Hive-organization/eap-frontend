import { LogoutButton } from '@/components/common';

export const HomePage = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-end">
        <LogoutButton />
      </div>
      <div className="flex items-center justify-center mt-20">
        <h1 className="text-2xl font-semibold">Welcome to Desk-X</h1>
      </div>
    </div>
  );
};
