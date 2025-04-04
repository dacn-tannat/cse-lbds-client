import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  // Pagination
  getPaginationRowModel
  // // Sorting
  // SortingState,
  // getSortedRowModel,
  // // Filtering
  // ColumnFiltersState,
  // getFilteredRowModel,
  // // Visibility
  // VisibilityState
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
// import { useState } from 'react'
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu'

interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  pagination?: boolean
}

const PAGINATION_OPTIONS = [3, 5, 10, 15, 20, 30, 40, 50]

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  pagination = false
}: IDataTableProps<TData, TValue>) {
  // // For sorting
  // const [sorting, setSorting] = useState<SortingState>([])
  // // For filtering
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // // For visibility
  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  /* Custom tableState */
  const tableState = useMemo(() => {
    return pagination ? {} : { pagination: { pageIndex: 0, pageSize: data.length } }
  }, [pagination, data.length])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Pagination: only paginate when pagination == true
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    state: tableState
    // // Sorting
    // onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
    // // Filtering
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(),
    // // Visibility
    // onColumnVisibilityChange: setColumnVisibility,
    // state: {
    //   sorting,
    //   columnFilters,
    //   columnVisibility
    // }
  })

  return (
    <div>
      {/* Filtering && Visibility */}
      <div className='flex items-center'>
        {/* Filtering */}
        {/* Visibility */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='font-normal ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <Table className='rounded-xl bg-gray-10'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={`text-lg font-semibold text-center`}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => onRowClick?.(row.original)} // Gọi hàm onRowClick với dữ liệu row
                className={`text-lg text-center ${onRowClick && 'hover:bg-gray-100 cursor-pointer'}`} // Thêm hiệu ứng hover
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      {pagination && (
        <div className='flex items-center justify-between space-x-6 lg:space-x-8 py-4'>
          {/* Rows per page */}
          <div className='flex items-center space-x-2'>
            <p className='text-base font-light'>Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className='h-8 w-[70px] border-[1px] border-gray-300 rounded-xl'>
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side='bottom' className='bg-gray-50 rounded-xl'>
                {PAGINATION_OPTIONS.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex space-x-2 justify-end'>
            <div className='flex w-[100px] items-center justify-center text-sm font-light'>
              Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </div>
            <div className='flex flex-row items-center space-x-1'>
              <Button
                className='border-[1px] border-gray-400'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                className='border-[1px] border-gray-400'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
