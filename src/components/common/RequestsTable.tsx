import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MinusIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/common/StateMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatLastUpdate } from '@/features/dashboard/utils';
import { type Priority, priorityMap } from '@/types/Priority';
import { type Status, statusMap } from '@/types/Status';
import { getInitials } from '@/utils';

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

const COLUMN_LABELS: Record<string, string> = {
  id: 'ID',
  title: 'Title',
  subtype: 'Type',
  status: 'Status',
  lastUpdate: 'Last Update',
  assignee: 'Assignee',
  priority: 'Priority',
};

function SortableHeader({
  label,
  isSorted,
  onToggle,
}: {
  label: string;
  isSorted: false | 'asc' | 'desc';
  onToggle: () => void;
}) {
  return (
    <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={onToggle}>
      {label}
      {isSorted === 'asc' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : isSorted === 'desc' ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: 'priority',
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader
        label="Priority"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const priority = row.getValue<Priority>('priority');
      return (
        <span
          className={priorityMap[priority].className}
          title={priorityMap[priority].label}
        >
          {priorityMap[priority].icon}
        </span>
      );
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <SortableHeader
        label="ID"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader
        label="Title"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const title = row.getValue<string>('title');
      return (
        <span className="block max-w-lg truncate" title={title}>
          {title}
        </span>
      );
    },
  },
  {
    accessorKey: 'subtype',
    header: ({ column }) => (
      <SortableHeader
        label="Type"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <SortableHeader
        label="Status"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue<Status>('status');
      return (
        <Badge variant="outline" className={statusMap[status].className}>
          {statusMap[status].label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'lastUpdate',
    header: ({ column }) => (
      <SortableHeader
        label="Last Update"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => formatLastUpdate(row.getValue('lastUpdate')),
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => (
      <SortableHeader
        label="Assignee"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const assignee = row.getValue<string | undefined>('assignee');
      return assignee !== undefined ? (
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">
            {getInitials(assignee)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <MinusIcon className="text-gray-500/50" />
      );
    },
  },
];

export function RequestsTable({ requests, onRowClick }: RequestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: requests,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (requests.length === 0) {
    return <EmptyState message="No created requests yet" />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-end pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {COLUMN_LABELS[col.id] ?? col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
