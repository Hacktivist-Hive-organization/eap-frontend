import { formatDistanceToNow, parseISO } from 'date-fns';
import { MinusIcon } from 'lucide-react';
import Avatar from 'react-avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type ApiPriority,
  apiPriorityToUiPriority,
  priorityMap,
} from './PriorityIcons';
import { type ApiStatus, apiStatusToUiStatus, statusMap } from './StatusBadges';

export interface Request {
  id: string;
  title: string;
  type: string;
  subtype: string;
  status: ApiStatus;
  lastUpdate: string;
  priority: ApiPriority;
  assignee?: string;
}

interface RequestsTableProps {
  requests: Request[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No created requests yet</p>
      </div>
    );
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
              <TableRow key={request.id}>
                <TableCell>
                  <span
                    className={
                      priorityMap[apiPriorityToUiPriority[request.priority]]
                        .className
                    }
                    title={
                      priorityMap[apiPriorityToUiPriority[request.priority]]
                        .label
                    }
                  >
                    {
                      priorityMap[apiPriorityToUiPriority[request.priority]]
                        .icon
                    }
                  </span>
                </TableCell>
                <TableCell>#{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  {request.type} / {request.subtype}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusMap[apiStatusToUiStatus[request.status]].className
                    }
                  >
                    {statusMap[apiStatusToUiStatus[request.status]].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(parseISO(request.lastUpdate), {
                    addSuffix: true,
                  })}
                </TableCell>
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
