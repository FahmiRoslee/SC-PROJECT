"use client"

import { useCallback, useEffect, useState } from "react";

import { Manikayu, columns, getColumns } from "./columns";
import { getDataAPI, getDataMock } from "./DataFetching";
import { DataTable } from "./data-table";
import { getCachedUser } from "@components/lib/utils";


type ManikayuDTProps = {
  editable: boolean;
};

export default function ManikayuDT ({ editable }: ManikayuDTProps){

    const [data, setData] = useState<Manikayu[]>([]);

    // MOCK API
    // useEffect(() => {
    //     const fetchData = async () => {
    //     const result = await getDataMock();
    //     setData(result);
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