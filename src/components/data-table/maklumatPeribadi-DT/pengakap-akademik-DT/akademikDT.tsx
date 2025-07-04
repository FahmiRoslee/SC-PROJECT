"use client"

import { useCallback, useEffect, useState } from "react";

import { Akademik, getColumns } from "./columns";
import { getDataMock, getDataAPI } from "./DataFetching";
import { DataTable } from "./data-table";

import { getCachedUser } from "@components/lib/utils";

type AkademikDTProps = {
  editable: boolean;
};

export default function AkademikDT({ editable }: AkademikDTProps) {

    const [data, setData] = useState<Akademik[]>([]);

    // MOCK API
    // useEffect(() => {
    //     const fetchData = async () => {
    //     const result = await getDataMock();
    //     setData(result);
    //     };
    //     fetchData();
    // }, []);

    // SUPABASE API 
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const user = await getCachedUser();
    //         if (!user) return;

    //         console.log(user.id);
    //         const result = await getDataAPI(user.id)

    //         setData(result);
    //     };
    //     fetchData();
    // }, []);

    // SUPABASE API WITH AUTO REFRESH
    const refreshData = useCallback(async () => {
        const user = await getCachedUser();
        if (!user) return;

        const result = await getDataAPI(user.id);
        setData(result);
    }, []);

    useEffect(() => {
        refreshData(); // initial fetch
    }, [refreshData]);   
    
    const columns = getColumns(refreshData);
    
    return (
        <DataTable columns={columns} data={data} editable={editable}/>
    )
    
}