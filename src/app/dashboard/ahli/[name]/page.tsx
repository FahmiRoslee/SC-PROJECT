"use client";


import MaklumatPeribadiPage from "@components/app/dashboard/maklumat-peribadi/page";
import { useSearchParams } from "next/navigation";

export default function MaklumatPeribadiKeahlian () {   


  const searchParams = useSearchParams();
  const user_id = searchParams.get("id"); 

  console.log("user_id in page ahli[name]: ",user_id);

    
    return (
        <div>
            dddd
            <MaklumatPeribadiPage></MaklumatPeribadiPage>
        </div>
        


    )

}