"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@components/components/ui/checkbox"
import { Button } from "@components/components/ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal,Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Jawatan = {
  id: string
  jawatan: string | undefined
  peringkat: string
  tahunMula: string
  tahunTamat: string
}

export const columns: ColumnDef<Jawatan>[] = [

  // JAWATAN
  {
    accessorKey: "jawatan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jawatan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("jawatan")}</div>,
  },

  // PERINGKAT
  {
    accessorKey: "peringkat",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Peringkat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("peringkat")}</div>,
  },

  // TAHUN MULA
  {
    accessorKey: "tahunMula",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun Mula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunMula")}</div>,
  },

  // TAHUN TAMAT
  {
    accessorKey: "tahunTamat",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun Tamat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunTamat")}</div>,
  },
]
