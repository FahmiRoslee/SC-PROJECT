"use client"

import { useEffect, useState } from "react";

import { TerbitBerita, columns } from "./columns";
import { getDataMock, getDataAPI } from "./DataFetching";
import { DataTable } from "./data-table";

import { getCachedUser } from "@components/lib/utils";


export default function TerbitBeritaDT (){

    const [data, setData] = useState<TerbitBerita[]>([]);

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
            const user = await getCachedUser();
            if (!user) return;

            console.log(user.id);
            const result = await getDataAPI(user.id)

            setData(result);
        };
        fetchData();
    }, []);

    return (
        <DataTable columns={columns} data={data}/>
    )
    
}