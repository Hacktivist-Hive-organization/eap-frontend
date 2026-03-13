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
  BriefcaseIcon,
  CircleCheckIcon,
  CircleXIcon,
  Filter,
  PlaneIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
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
import type { UserResponse } from '@/services/api/requests/user';
import { getInitials } from '@/utils';

interface UsersTableProps {
  users: UserResponse[];
  onRowClick?: (user: UserResponse) => void;
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

const multiSelectFilter: FilterFn<UserResponse> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  return filterValue.includes(String(row.getValue(columnId)));
};
multiSelectFilter.autoRemove = (val: string[]) => !val?.length;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'approver', label: 'Approver' },
  { value: 'requester', label: 'Requester' },
];

const statusOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const availabilityOptions = [
  { value: 'false', label: 'Available' },
  { value: 'true', label: 'Out of Office' },
];

const COLUMN_LABELS: Record<string, string> = {
  fullName: 'Full Name',
  email: 'Email',
  role: 'Role',
  isActive: 'Status',
  isOutOfOffice: 'Availability',
};

const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: 'id',
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader
        label="#"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="font-mono text-xs text-muted-foreground"
      >
        #{row.original.id}
      </Badge>
    ),
  },
  {
    id: 'fullName',
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader
        label="Full Name"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => {
      const name = `${row.original.first_name} ${row.original.last_name}`;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader
        label="Email"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
  },
  {
    accessorKey: 'role',
    filterFn: multiSelectFilter,
    header: ({ column }) => (
      <SortableHeader
        label="Role"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {roleLabels[row.original.role] ?? row.original.role}
      </Badge>
    ),
  },
  {
    id: 'isActive',
    accessorFn: (row) => String(row.is_active),
    filterFn: multiSelectFilter,
    header: ({ column }) => (
      <SortableHeader
        label="Status"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => (
      <StatusBadge
        config={activeConfig[row.original.is_active ? 'true' : 'false']}
      />
    ),
  },
  {
    id: 'isOutOfOffice',
    accessorFn: (row) => String(row.is_out_of_office),
    filterFn: multiSelectFilter,
    header: ({ column }) => (
      <SortableHeader
        label="Availability"
        isSorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => (
      <StatusBadge
        config={
          availabilityConfig[row.original.is_out_of_office ? 'true' : 'false']
        }
      />
    ),
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

export function UsersTable({ users, onRowClick }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: users,
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

  const filteredCount = table.getRowModel().rows.length;

  if (users.length === 0) {
    return <EmptyState message="No users found" />;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FacetFilter
            label="Role"
            options={roleOptions}
            selected={getFilterSet(columnFilters, 'role')}
            onChange={(v) => setFilterValues(setColumnFilters, 'role', v)}
          />
          <FacetFilter
            label="Status"
            options={statusOptions}
            selected={getFilterSet(columnFilters, 'isActive')}
            onChange={(v) => setFilterValues(setColumnFilters, 'isActive', v)}
          />
          <FacetFilter
            label="Availability"
            options={availabilityOptions}
            selected={getFilterSet(columnFilters, 'isOutOfOffice')}
            onChange={(v) =>
              setFilterValues(setColumnFilters, 'isOutOfOffice', v)
            }
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
            {filteredCount > 0 ? (
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
