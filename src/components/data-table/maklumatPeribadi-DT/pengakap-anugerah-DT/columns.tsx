"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@components/components/ui/checkbox"
import { Button } from "@components/components/ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal,Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { toast } from "sonner"
import { deleteAnugerahRecord } from "./DataFetching"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Anugerah = {
  id: string
  namaAnugerah: string | undefined
  peringkat: string
  tahun: string
}

export const getColumns = (refreshData: () => void): ColumnDef<Anugerah>[] => [

  // NAMA PENGAKAP
  {
    accessorKey: "namaAnugerah",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Anugerah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("namaAnugerah")}</div>,
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

  // TAHUN
  {
    accessorKey: "tahun",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahun")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      const handleDelete = async () => {
        const confirm = window.confirm("Anda pasti mahu memadam rekod ini?");
        if (!confirm) return;

        const result = await deleteAnugerahRecord(record.id);

        if (result.success) {
          toast.success("Rekod anugerah berjaya dipadam.");
          refreshData(); // ⬅️ Refresh after deletion
        } else {
          toast.error("Gagal memadam rekod Anugerah.");
        }
      };

      return (
        <div className="flex">
          <button
            onClick={handleDelete}
            className="h-[32px] w-[32px] flex items-center justify-center border border-[#DC3545] rounded-sm 
                      text-[#DC3545] hover:bg-[#DC3545] hover:text-white active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Trash2 color="currentColor" size={18} strokeWidth={1.5} />
          </button>
        </div>
      );
    },  
  },
]
