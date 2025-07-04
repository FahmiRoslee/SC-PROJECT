"use client"

import { useCallback, useEffect, useState } from "react";

import { Anugerah, getColumns } from "./columns";
import { getDataAPI, getDataMock } from "./DataFetching";
import { DataTable } from "./data-table";
import { getCachedUser } from "@components/lib/utils";


type AnugerahDTProps = {
  editable: boolean;
  award_type: string
};

export default function AnugerahDT ({ editable, award_type }: AnugerahDTProps){

    const [data, setData] = useState<Anugerah[]>([]);

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

        const result = await getDataAPI(user.id, award_type);
        setData(result);
    }, []);

    useEffect(() => {
        refreshData(); // initial fetch
    }, [refreshData]);   
    
    const columns = getColumns(refreshData);    

    return (
        <DataTable columns={columns} data={data} editable={editable} award_type={award_type}/>
    )
    
}