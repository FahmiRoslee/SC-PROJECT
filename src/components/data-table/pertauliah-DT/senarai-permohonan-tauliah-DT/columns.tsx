"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@components/components/ui/checkbox"
import { Button } from "@components/components/ui/button"

import { ArrowUpDown, ChevronDown, MoreHorizontal,Trash2, Check, X, RefreshCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { toast } from "sonner"
import { deleteManikayuRecord } from "./DataFetching"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type senaraiPemohon = {
  applicant_id: string
  id: string

  team_id: string
  leader_id: string
  namaKumpulan: string
  daerahKumpulan: string

  gambarPemohon: string
  namaPemohon: string | undefined
  
  tauliah: string
  noTauliah: string
  status: string
  peringkatPenilaian: string
}

export const getColumns = (refreshData: () => void): ColumnDef<senaraiPemohon>[] => [

  // GAMBAR KUMPULAN
  {
    accessorKey: "gambarPemohon",
    header: "",
    cell: ({ row }) => (
      row.original.gambarPemohon ? (
        <img
          src={row.original.gambarPemohon}
          
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-300 text-xs font-bold uppercase">
          {row.original.namaPemohon ? row.original.namaPemohon.charAt(0) : "?"}
        </div>
      )
    )
    
  },
  
  // NAMA PEMOHON
  {
    accessorKey: "namaPemohon",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Pemohon
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("namaPemohon")}</div>,
  },

  // NAMA KUMPULAN
  {
    accessorKey: "namaKumpulan",
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
    cell: ({ row }) => <div className="uppercase">{row.getValue("namaKumpulan")}</div>,
  },

  // TAULIAH
  {
    accessorKey: "tauliah",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tauliah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("tauliah")}</div>,
  },

  // NO TAULIAH
  {
    accessorKey: "noTauliah",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Tauliah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="uppercase">{row.getValue("noTauliah")}</div>
          <div className="uppercase">-</div>
        </div>
        
      )
    },
  },

  // STATUS
{
  accessorKey: "status",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  },
  cell: ({ row }) => {
    const status = row.getValue("status") as string;

    let icon = null;
    let bgColor = "";
    let iconColor = "";
    let label = status;

    switch (status) {
      case "Lulus":
        icon = <Check className="w-4 h-4" />;
        bgColor = "bg-green-100";
        iconColor = "text-green-700";
        break;
      case "Ditolak":
        icon = <X className="w-4 h-4" />;
        bgColor = "bg-red-100";
        iconColor = "text-red-700";
        break;
      case "Diproses":
        icon = <RefreshCcw className="w-4 h-4 animate-spin-slow" />;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-700";
        break;
      default:
        icon = <div className="w-4 h-4 rounded-full bg-gray-300" />;
        bgColor = "bg-gray-100";
        iconColor = "text-gray-700";
        break;
    }

    return (
      <div className="group flex items-center transition-all duration-300">
        <div
          className={`flex items-center h-8 pl-2 pr-3 rounded-full ${bgColor} ${iconColor} transition-all duration-300 max-w-8 group-hover:max-w-[140px] overflow-hidden`}
        >
          <div className="min-w-[1.5rem] flex justify-center">{icon}</div>
          <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    );
  },
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
          toast.success("Rekod berjaya dipadam.");
          refreshData(); // ⬅️ Refresh after deletion
        } else {
          toast.error("Gagal memadam rekod.");
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
