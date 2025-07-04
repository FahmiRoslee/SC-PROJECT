"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@components/components/ui/checkbox"
import { Button } from "@components/components/ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MainKumpulan = {
  id: string
  kumpImage: string | undefined
  kumpName: string
  kumpNo: number
  daerah: string
  noM: string
}

export const columns: ColumnDef<MainKumpulan>[] = [

  // CHECKBOX
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  // GAMBAR KUMPULAN
  {
    accessorKey: "kumpImage",
    header: "",
    cell: ({ row }) => (
      row.original.kumpImage ? (
        <img
          src={row.original.kumpImage}
          
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-300 text-xs font-bold uppercase">
          {row.original.kumpName ? row.original.kumpName.charAt(0) : "?"}
        </div>
      )
    )
    
  },

  // NAMA KUMPULAN
  {
    accessorKey: "kumpName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Kumpulan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("kumpName")}</div>,
  },

  // NO KUMPULAN
  {
    accessorKey: "kumpNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Kumpulan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("kumpNo")}</div>,
  },

  // DAERAH
  {
    accessorKey: "daerah",
    header: "Daerah",
    cell: ({ row }) => <div className="uppercase">{row.getValue("daerah")}</div>,
  },

  // NO. M
  {
    accessorKey: "noM",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. M
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("noM")}</div>,
  },
]
