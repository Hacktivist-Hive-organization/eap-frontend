import { MinusIcon } from 'lucide-react';
import Avatar from 'react-avatar';
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
import { formatLastUpdate } from '@/features/dashboard/RequesterDashboard/utils';
import { type Priority, priorityMap } from '@/types/Priority';
import { type Status, statusMap } from '@/types/Status';

export interface Request {
  id: number;
  title: string;
  type: string;
  subtype: string;
  status: Status;
  lastUpdate?: string;
  priority: Priority;
  assignee?: string;
}

interface RequestsTableProps {
  requests: Request[];
  onRowClick?: (request: Request) => void;
}

export function RequestsTable({ requests, onRowClick }: RequestsTableProps) {
  if (requests.length === 0) {
    return <EmptyState message="No created requests yet" />;
  }

  return (
    <div className="p-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={() => onRowClick?.(request)}
              >
                <TableCell>
                  <span
                    className={priorityMap[request.priority].className}
                    title={priorityMap[request.priority].label}
                  >
                    {priorityMap[request.priority].icon}
                  </span>
                </TableCell>
                <TableCell>#{request.id}</TableCell>
                <TableCell>
                  <span
                    className="block max-w-lg truncate"
                    title={request.title}
                  >
                    {request.title}
                  </span>
                </TableCell>
                <TableCell>{request.subtype}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusMap[request.status].className}
                  >
                    {statusMap[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{formatLastUpdate(request.lastUpdate)}</TableCell>
                <TableCell>
                  {request.assignee !== undefined && (
                    <Avatar name={request.assignee} size="30" round={true} />
                  )}
                  {request.assignee === undefined && (
                    <MinusIcon className="text-gray-500/50" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
