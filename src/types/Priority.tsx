import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ApiPriority = 'High' | 'Medium' | 'Low';

export type Priority = 'high' | 'medium' | 'low';

interface PriorityConfig {
  icon: ReactNode;
  className: string;
  label: string;
}

export const apiPriorityToUiPriority: Record<ApiPriority, Priority> = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

export const priorityMap: Record<Priority, PriorityConfig> = {
  high: {
    icon: <ChevronUpIcon className="h-5 w-5" />,
    className: 'text-orange-500',
    label: 'High',
  },
  medium: {
    icon: <MinusIcon className="h-5 w-5" />,
    className: 'text-yellow-500',
    label: 'Medium',
  },
  low: {
    icon: <ChevronDownIcon className="h-5 w-5" />,
    className: 'text-blue-400',
    label: 'Low',
  },
};
