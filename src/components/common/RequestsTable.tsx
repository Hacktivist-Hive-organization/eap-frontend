import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  MinusIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/common/StateMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
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
  title: 'Title',
  type: 'Category',
  subtype: 'Type',
  status: 'Status',
  lastUpdate: 'Last Update',
  assignee: 'Assignee',
  priority: 'P',
};

const multiSelectFilter: FilterFn<Request> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  return filterValue.includes(String(row.getValue(columnId)));
};
multiSelectFilter.autoRemove = (val: string[]) => !val?.length;

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

interface FacetFilterProps {
  label: string;
  options: { label: string; value: string }[];
  selected: Set<string>;
  onChange: (values: string[]) => void;
}

function FacetFilter({ label, options, selected, onChange }: FacetFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          {label}
          {selected.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              {selected.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selected.size} selected
                </Badge>
              ) : (
                <div className="flex gap-1">
                  {[...selected].map((val) => (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {options.find((o) => o.value === val)?.label ?? val}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.has(option.value)}
            onCheckedChange={(checked) => {
              const next = new Set(selected);
              if (checked) next.add(option.value);
              else next.delete(option.value);
              onChange([...next]);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        {selected.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-center"
              onSelect={() => onChange([])}
            >
              Clear filter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const priorityOptions = Object.entries(priorityMap).map(([value, config]) => ({
  value,
  label: config.label,
}));

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: 'priority',
    filterFn: multiSelectFilter,
    header: ({ column }) => (
      <SortableHeader
        label="P"
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
    accessorKey: 'title',
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader
        label="Title"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const title = row.getValue<string>('title');
      const truncated = title.length > 70 ? `${title.slice(0, 70)}…` : title;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="shrink-0 font-mono text-xs text-muted-foreground"
          >
            #{row.original.id}
          </Badge>
          <span title={title}>{truncated}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    filterFn: multiSelectFilter,
    header: ({ column }) => (
      <SortableHeader
        label="Category"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
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
    filterFn: multiSelectFilter,
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

function getFilterSet(
  columnFilters: ColumnFiltersState,
  columnId: string,
): Set<string> {
  const filter = columnFilters.find((f) => f.id === columnId);
  return new Set((filter?.value as string[]) ?? []);
}

function setFilterValues(
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
  columnId: string,
  values: string[],
) {
  setColumnFilters((prev) => {
    const rest = prev.filter((f) => f.id !== columnId);
    if (!values.length) return rest;
    return [...rest, { id: columnId, value: values }];
  });
}

export function RequestsTable({ requests, onRowClick }: RequestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    type: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') ?? '';
  const searchQuery = rawQuery.toLowerCase().trim();

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests;
    return requests.filter(
      (r) =>
        String(r.id).includes(searchQuery) ||
        r.title.toLowerCase().includes(searchQuery),
    );
  }, [requests, searchQuery]);

  const statusOptions = useMemo(
    () =>
      [...new Set(requests.map((r) => r.status))].map((s) => ({
        value: s,
        label: statusMap[s].label,
      })),
    [requests],
  );

  const typeOptions = useMemo(
    () =>
      [...new Set(requests.map((r) => r.type))]
        .sort()
        .map((t) => ({ label: t, value: t })),
    [requests],
  );

  const table = useReactTable({
    data: filteredRequests,
    columns,
    state: { sorting, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const hasActiveFilters = columnFilters.length > 0;

  if (requests.length === 0) {
    return <EmptyState message="No created requests yet" />;
  }

  if (filteredRequests.length === 0) {
    return <EmptyState message={`No requests match "${rawQuery}"`} />;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FacetFilter
            label="Status"
            options={statusOptions}
            selected={getFilterSet(columnFilters, 'status')}
            onChange={(v) => setFilterValues(setColumnFilters, 'status', v)}
          />
          <FacetFilter
            label="Priority"
            options={priorityOptions}
            selected={getFilterSet(columnFilters, 'priority')}
            onChange={(v) => setFilterValues(setColumnFilters, 'priority', v)}
          />
          <FacetFilter
            label="Category"
            options={typeOptions}
            selected={getFilterSet(columnFilters, 'type')}
            onChange={(v) => setFilterValues(setColumnFilters, 'type', v)}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => setColumnFilters([])}
            >
              Reset
              <X className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
