"use client"

import React from "react"
import { useState } from "react"

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"


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
} from "../../../ui/table"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown"

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

  const pathname = usePathname();

  const [searchType, setSearchType] = useState("title");

  const serachTypeLabelMap: Record<string, string> = {
    title: "Nama Penuh",
    noId: "No. Id",
  };
  
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
        
        {/* SEARCH N SORTING */}
        <div className="flex">

          {/* SEARCH BAR */}
          <Input
            placeholder="Cari"
            value={(table.getColumn(searchType)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchType)?.setFilterValue(event.target.value)
            }
            className="max-w-xs mr-3"
          />

          {/* FILTERING DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {serachTypeLabelMap[searchType] ?? searchType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={searchType} onValueChange={setSearchType}>
                <DropdownMenuRadioItem value="title">Tajuk Berita</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="noId">No. Id</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>    
        </div>

        {/* TERBIT BERITA BUTTON */}
        <Link href={`${pathname}/terbit-berita`}>
          <Button>
            Terbit Berita
          </Button>
        </Link>
        
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
                const destination = `${pathname}/${encodeURIComponent(rowData.title)}?id=${rowData.id}`;
                // const destination = `/dashboard/berita/${rowData.title}?id=${rowData.id}`;


                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    href={destination}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const columnId = cell.column.id;
                      const value = cell.getValue();

                      // set bg color for news status
                      let bgColor = "";
                      if (columnId === "status") {
                        if (value === "active" ) {
                          bgColor = "bg-green-200 text-black font-sans font-medium px-3 py-1 rounded-md";
                        } else if (value === "inactive") {
                          bgColor = "bg-red-200 text-black font-sans font-medium px-3 py-1 rounded-md";
                        }
                      }

                      return (
                        <TableCell key={cell.id} className="w-40 max-w-[200px] truncate">
                          {columnId === "status" ? (
                            <span className={bgColor}>{value}</span>
                          ) : columnId === "newsImg" ? (
                            <img
                              src={value}
                              alt="gambar"
                              className="h-30 w-auto object-cover rounded"
                            />
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
