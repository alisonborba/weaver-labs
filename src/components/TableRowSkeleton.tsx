import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function TableRowSkeleton({ columns = 3 }: { columns?: number }) {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns - 1 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-6 w-32" />
        </TableCell>
      ))}
      <TableCell className="text-right pr-4 flex justify-end">
        <Skeleton className="h-6  w-20" />
      </TableCell>
    </TableRow>
  ));
}
