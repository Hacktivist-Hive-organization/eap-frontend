import {
  BriefcaseIcon,
  CircleCheckIcon,
  CircleXIcon,
  PlaneIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/common/StateMessage';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UserResponse } from '@/services/api/requests/user';

interface UsersTableProps {
  users: UserResponse[];
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  approver: 'Approver',
  requester: 'Requester',
};

interface BadgeConfig {
  label: string;
  icon: ReactNode;
  className: string;
}

const activeConfig: Record<'true' | 'false', BadgeConfig> = {
  true: {
    label: 'Active',
    icon: <CircleCheckIcon className="h-3.5 w-3.5" />,
    className: 'border-green-200 bg-green-50 text-green-700',
  },
  false: {
    label: 'Inactive',
    icon: <CircleXIcon className="h-3.5 w-3.5" />,
    className: 'border-gray-200 bg-gray-50 text-gray-500',
  },
};

const availabilityConfig: Record<'true' | 'false', BadgeConfig> = {
  true: {
    label: 'Out of Office',
    icon: <PlaneIcon className="h-3.5 w-3.5" />,
    className: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  false: {
    label: 'Available',
    icon: <BriefcaseIcon className="h-3.5 w-3.5" />,
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
};

function StatusBadge({ config }: { config: BadgeConfig }) {
  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return <EmptyState message="No users found" />;
  }

  return (
    <div className="p-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>#{user.id}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {roleLabels[user.role] ?? user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    config={
                      activeConfig[String(user.is_active) as 'true' | 'false']
                    }
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge
                    config={
                      availabilityConfig[
                        String(user.is_out_of_office) as 'true' | 'false'
                      ]
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
