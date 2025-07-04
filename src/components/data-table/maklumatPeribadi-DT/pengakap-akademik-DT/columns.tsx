"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/components/ui/button";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { deletecademicRecord } from "./DataFetching";
import { toast } from "sonner";

export type Akademik = {
  id: string;
  namaInstitusi: string | undefined;
  tahunMasuk: string;
  tahunKeluar: string;
  pencapaian: string;
};

export const getColumns = (refreshData: () => void): ColumnDef<Akademik>[] => [
  {
    accessorKey: "namaInstitusi",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama Institusi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("namaInstitusi")}</div>,
  },
  {
    accessorKey: "tahunMasuk",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tahun Masuk
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunMasuk")}</div>,
  },
  {
    accessorKey: "tahunKeluar",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tahun Keluar
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("tahunKeluar")}</div>,
  },
  {
    accessorKey: "pencapaian",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pencapaian
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("pencapaian")}</div>,
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
