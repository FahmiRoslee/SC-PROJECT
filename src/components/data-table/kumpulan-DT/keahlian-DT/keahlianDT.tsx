"use client"

import { useEffect, useState } from "react";

import { AhliPengakap, columns } from "./columns";
import { getDataMock, getDataAPI } from "./DataFetching";
import { DataTable } from "./data-table";

import { getCachedUser } from "@components/lib/utils";


interface KeahlianDTProps {
    team_id: number;
  }

export default function KeahlianDT({ team_id }: KeahlianDTProps) {

    const [data, setData] = useState<AhliPengakap[]>([]);



    // MOCK API
    // useEffect(() => {
    //     const fetchData = async () => {
    //      const result = await getDataMock();
    //      setData(result);
    //     };
    //     fetchData();
    // }, []);

    // SUPABASE API
    useEffect(() => {
        const fetchData = async () => {

            const result = await getDataAPI(team_id)

            setData(result);
        };
        fetchData();
    }, []);

    return (
        <DataTable columns={columns} data={data}/>
    )
    
}