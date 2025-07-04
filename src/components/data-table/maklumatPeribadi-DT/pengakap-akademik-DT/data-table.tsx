"use client"

import React from "react"
import { useState } from "react"

import { toast } from "sonner";


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

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/components/ui/dialog";

import {
  DropdownField,
  TextInputField,
  DateInputField,
  PhoneNumberField,
  FileInputField,
} from "@components/components/ui/customInputFeild";

import { Button } from "@components/components/ui/button"
import { Input } from "@components/components/ui/input"
import { DataTablePagination } from "@components/components/ui/pagination"
import { supabase } from "@components/lib/supabaseClient"
import { insertAcademicRecord } from "./DataFetching"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  editable: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  editable
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


                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    href={null}
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

      {/* TABLE INSERT DATA BUTTON */}
      {editable ? (
          <AddAcademicDialog/>  
      ) : 
      null
      }   
    </div>

    

  )
}

const AddAcademicDialog = () => {

  const [isLoading, setIsLoading] = useState(false);

  const [namaInstitusi, setNamaInstitusi] = useState("");
  const [pencapaian, setPencapaian] = useState("");
  const [tahunMasuk, setTahunMasuk] = useState("");
  const [tahunKeluar, setTahunKeluar] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);

    const result = await insertAcademicRecord({
      user_id: "264eb21d-4338-408d-a8a2-c86affebe0b4",
      namaInstitusi,
      pencapaian,
      tahunMasuk,
      tahunKeluar,
    });    

    if (result.success) {
      toast("Maklumat dihantar", {
        description: "Maklumat akademik berjaya dihantar.",
        action: {
          label: "OK",
          onClick: () => console.log("Confirmed"),
        },
      });

      setNamaInstitusi("");
      setPencapaian("");
      setTahunMasuk("");
      setTahunKeluar("");      

    } else {
      toast("Ralat semasa penghantaran", {
        description: result.error?.message ?? "Sila cuba sekali lagi.",
        action: {
          label: "Tutup",
          onClick: () => console.log("Tutup clicked"),
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tambah</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Maklumat Akademik Baharu</DialogTitle>
          <DialogDescription>
            Sila isikan maklumat akademik anda dibawah.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex w-full gap-5">
          <TextInputField
            id="namaInstitusi"
            label="Nama Institusi"
            value={namaInstitusi}
            onChange={(e) => setNamaInstitusi(e.target.value)}
            required
          />
        </div>
        <div className="mt-2 flex w-full gap-5">
          <TextInputField
            id="pencapaian"
            label="Pencapaian"
            value={pencapaian}
            onChange={(e) => setPencapaian(e.target.value)}
            required
          />
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex w-full gap-5">
            <TextInputField
              id="tahunMasuk"
              label="Tahun Masuk"
              value={tahunMasuk}
              onChange={(e) => setTahunMasuk(e.target.value)}
              required
            />
          </div>
          <div className="flex w-full gap-5">
            <TextInputField
              id="tahunKeluar"
              label="Tahun Keluar"
              value={tahunKeluar}
              onChange={(e) => setTahunKeluar(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Hantar"}
            </Button>

          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

