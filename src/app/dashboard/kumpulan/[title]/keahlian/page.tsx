"use client"

import { Button } from "@components/components/ui/button"
import { Input } from "@components/components/ui/input"

import KeahlianDT from "@components/components/data-table/kumpulan-DT/keahlian-DT/keahlianDT"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function KeahlianTab() {
    
  const router = useRouter();
  const pathname = usePathname();
  const name = "Alexander";

  const searchParams = useSearchParams();
  const team_id = searchParams.get("id"); 
  
  
  const handleNavigate = () => {
    const id = 'e90a9462-388e-4a08-bb7a-cd5a5a36ecb1';
    router.push(`/dashboard/ahli/${name}?id=${id}`);
  };
  

    return (
        <div>
            <div className="px-5 py-4 border border-gray-400 rounded-md">
                <div className="my-2 font-sans font-medium">Keahlian Kumpulan</div>

                    {/* TABLE AHLI */}
                    <KeahlianDT team_id={team_id}/>
                    


            </div>

            <button 
              className="cursor-pointer "
              onClick={handleNavigate}
            >
                        profi ahli for team id: {team_id}
            </button>
        </div>
    )
}