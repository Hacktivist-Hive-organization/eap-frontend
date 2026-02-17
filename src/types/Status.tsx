export type ApiStatus =
  | 'Draft'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Under review'
  | 'In progress'
  | 'Completed';

export type Status =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'in_progress'
  | 'completed';

interface StatusConfig {
  label: string;
  className: string;
}

export const statusMap: Record<Status, StatusConfig> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-200/30 text-gray-800 border-gray-200/50',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-sky-200/30 text-sky-800 border-sky-200/50',
  },
  under_review: {
    label: 'Under review',
    className: 'bg-amber-200/30 text-amber-800 border-amber-200/50',
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-indigo-200/30 text-indigo-800 border-indigo-200/50',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-200/30 text-green-800 border-green-200/50',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-200/30 text-red-800 border-red-200/50',
  },
  completed: {
    label: 'Completed',
    className: 'bg-teal-200/30 text-teal-800 border-teal-200/50',
  },
};
