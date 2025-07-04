"use client"

import { useEffect, useState } from "react";

import { Jawatan, columns } from "./columns";
import { getData } from "./DataFetching";
import { DataTable } from "./data-table";


export default function JawatanDT (){

    const [data, setData] = useState<Jawatan[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        const result = await getData();
        setData(result);
        };
        fetchData();
    }, []);

    return (
        <DataTable columns={columns} data={data}/>
    )
    
}