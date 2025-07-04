"use client"

import React from "react"
import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown"

import { Button } from "@components/components/ui/button"
import { Input } from "@components/components/ui/input"
import { DataTablePagination } from "@components/components/ui/pagination"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =useState<ColumnFiltersState>(
    []
  )

  const [searchType, setSearchType] = useState("name");
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full">

      {/* SEARCH , SORTING, ADD BUTTON*/}
      <div className="flex justify-between items-center py-4">
    
      </div>      

      {/* TABLE CONTAINER */}
      <div className="rounded-md border">
        <Table>

          {/* TABLE HEADER */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} href={""}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => {
      const rowData = row.original as any;
      const destination = `/detail/${rowData.id}`;

      return (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          href={destination}
        >
          {row.getVisibleCells().map((cell) => {
            const columnId = cell.column.id;
            const value = cell.getValue();

            let bgColor = "";
            if (columnId === "unit") {
              if (value === "pemimpin" || value === "PEMIMPIN" ) {
                bgColor = "bg-yellow-200 text-black font-semibold px-2 py-1 rounded";
              } else if (value === "pkk" || value === "PKK") {
                bgColor = "bg-green-200 text-black font-semibold px-2 py-1 rounded";
              }
            }

            return (
              <TableCell key={cell.id}>
                {columnId === "unit" ? (
                  <span className={bgColor}>{value}</span>
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    })
  ) : (
    <TableRow href={""}>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )}
</TableBody>


        </Table>


        {/* TABLE PAGINATION BUTTOM */}
        <div className="my-5">
          <DataTablePagination<TData> table={table} />
        </div>
        

        
        
        
      </div>
    </div>

  )
}
