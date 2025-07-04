"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@components/components/ui/checkbox"
import { Button } from "@components/components/ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal,Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { toast } from "sonner"
import { deleteManikayuRecord } from "./DataFetching"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Manikayu = {
  id: string
  unitPengakap: string | undefined
  noSijil: string
  tahunLulus: string
}

export const getColumns = (refreshData: () => void): ColumnDef<Manikayu>[] => [

  // UNIT PENGAKAP
  {
    accessorKey: "unitPengakap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Pengakap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("unitPengakap")}</div>,
  },

  // NO SIJIL
  {
    accessorKey: "noSijil",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Sijil
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("noSijil")}</div>,
  },

  // TAHUN LULUS
  {
    accessorKey: "tahunLulus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun Lulus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunLulus")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      const handleDelete = async () => {
        const confirm = window.confirm("Anda pasti mahu memadam rekod ini?");
        if (!confirm) return;

        const result = await deleteManikayuRecord(record.id);

        if (result.success) {
          toast.success("Rekod manikayu berjaya dipadam.");
          refreshData(); // ⬅️ Refresh after deletion
        } else {
          toast.error("Gagal memadam rekod manikayu.");
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
