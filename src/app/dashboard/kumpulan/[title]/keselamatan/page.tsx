"use client"

import { Button } from "@components/components/ui/button"
import { Input } from "@components/components/ui/input"

import { useEffect, useState } from "react"

import { DataTable } from "../../../../../components/data-table/kumpulan-DT/keselamatan-DT/data-table"
import { AhliPengakap, columns } from "../../../../../components/data-table/kumpulan-DT/keselamatan-DT/columns"
import { getData } from '../../../../../components/data-table/kumpulan-DT/keselamatan-DT/DataFetching'

export default function KeselamatanTab() {

     const [data, setData] = useState<AhliPengakap[]>([]);
        // const router = useRouter();
      
        useEffect(() => {
          const fetchData = async () => {
            const result = await getData();
            setData(result);
          };
          fetchData();
        }, []);
    
    return (
        <div>
            <div className="px-5 py-4 border border-gray-400 rounded-md">
                <div className="my-2 font-sans font-medium">Keselamatan Kumpulan</div>

                    {/* TABLE AHLI */}
                    <DataTable columns={columns} data={data} />
            </div>
        </div>
    )

}