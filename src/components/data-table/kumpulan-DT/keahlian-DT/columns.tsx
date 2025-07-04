"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../../ui/checkbox"
import { Button } from "../../../ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal,Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AhliPengakap = {
  id: string
  profilePic: string | undefined
  name: string
  noId: string
  unit: string
}

export const columns: ColumnDef<AhliPengakap>[] = [

  // GAMBAR KUMPULAN
  {
    accessorKey: "profilePic",
    header: "",
    cell: ({ row }) => (
      row.original.profilePic ? (
        <img
          src={row.original.profilePic}
          
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-300 text-xs font-bold uppercase">
          {row.original.name ? row.original.name.charAt(0) : "?"}
        </div>
      )
    )
    
  },

  // NAMA KUMPULAN
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Penuh
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("name")}</div>,
  },

  // NO ID
  {
    accessorKey: "noId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("noId")}</div>,
  },

  // UNIT
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("unit")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
 
      return (
<button 
  onClick={() => console.log()}
  className="h-[32px] w-[32px] flex items-center justify-center border border-[#DC3545] rounded-sm 
             text-[#DC3545] hover:bg-[#DC3545] hover:text-white active:scale-95 transition-all duration-200">
  <Trash2 color="currentColor" size={18} strokeWidth={1.5} />
</button>



      )
    },  
  },
]
