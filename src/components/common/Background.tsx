import type { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8f7f2] overflow-hidden p-4">
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-orange-500/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[5%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-slate-200 blur-[90px] pointer-events-none" />
      {children}
    </div>
  );
}
