'use client';

import { useRouter } from "next/navigation";

import {Check, X, RefreshCcw } from "lucide-react"

import SenaraiPemohonTauliahDT from "@components/components/data-table/pertauliah-DT/senarai-permohonan-tauliah-DT/senaraiPemohonTauliahDT";
import { Button } from "@components/components/ui/button";

export default function JenisTauliah() {
  const router = useRouter();

    return (
      <div className="container-page">
              <h1 className="font-sans font-bold text-xl ">Permohonan Tauliah</h1>
              
              <SenaraiPemohonTauliahDT editable={false}/>
              
              <StatusLegend/>
      </div>
    )
  }

function StatusLegend() {
  return (
    <div className="mb-6 space-y-2 mt-5 ">
      <h4 className="mb-5 text-sm font-semibold text-muted-foreground">Status Permohonan</h4>
      <div className="flex flex-wrap gap-4">
        {/* Lulus */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm text-muted-foreground">Lulus</span>
        </div>

        {/* Ditolak */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            <X className="w-4 h-4" />
          </div>
          <span className="text-sm text-muted-foreground">Ditolak</span>
        </div>

        {/* Diproses */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
            <RefreshCcw className="w-4 h-4" />
          </div>
          <span className="text-sm text-muted-foreground">Diproses</span>
        </div>
      </div>
    </div>
  );
}