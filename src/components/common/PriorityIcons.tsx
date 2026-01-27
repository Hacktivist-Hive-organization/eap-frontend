import { cva } from 'class-variance-authority';
import {
  ChevronDownIcon,
  ChevronsUpIcon,
  ChevronUpIcon,
  MinusIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

/* ================= TYPES ================= */

// TODO: Move to types.ts
export type ApiPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

interface PriorityConfig {
  icon: ReactNode;
  className: string;
  label: string;
}

/* ================= MAPPERS ================= */

export const apiPriorityToUiPriority: Record<ApiPriority, Priority> = {
  Urgent: 'urgent',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

/* ================= UI CONFIG ================= */

export const priorityMap: Record<Priority, PriorityConfig> = {
  urgent: {
    icon: <ChevronsUpIcon className="h-5 w-5" />,
    className: 'text-red-600',
    label: 'Urgent',
  },
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
