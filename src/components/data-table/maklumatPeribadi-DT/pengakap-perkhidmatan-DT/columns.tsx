"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/components/ui/button";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { deletecademicRecord } from "./DataFetching";
import { toast } from "sonner";

export type Perkhidmatan = {
  id: string;
  jawatan: string | undefined;
  peringkat: string;
  tahunMula: string;
  tahunTamat: string;
  jawatanKini?: string;
};

export const getColumns = (refreshData: () => void): ColumnDef<Perkhidmatan>[] => [
  
  // JAWATAN
  {
    accessorKey: "jawatan",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Jawatan
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("jawatan")}</div>,
  },

  // PERINGKAT
  {
    accessorKey: "peringkat",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Peringkat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("peringkat")}</div>,
  },

  // TAMAT MULA
  {
    accessorKey: "tahunMula",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tahun Mula
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunMula")}</div>,
  },

  // TAHUN TAMAT
  {
    accessorKey: "tahunTamat",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tahun Tamat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunTamat")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      const handleDelete = async () => {
        const confirm = window.confirm("Anda pasti mahu memadam rekod ini?");
        if (!confirm) return;

        const result = await deletecademicRecord(record.id);

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
];
