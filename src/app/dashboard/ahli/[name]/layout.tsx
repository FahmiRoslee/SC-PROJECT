"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DashboardItemLayout from "@components/components/dashboardItem-component/dashboardItem-layout";
import MaklumatPeribadi from "@components/components/maklumatPeribadi-component/maklumatPeribadi";



export default function AhliLayout({ children }: { children: React.ReactNode }) {

  const searchParams = useSearchParams();
  const user_id = searchParams.get("id"); 

  console.log("user_id in layotu ahli[name]: ",user_id);
  
  const sidebarItems = [
    { title: "Profil", url: `profil/?id=${user_id}` },
    { title: "Kumpulan", url: `kumpulan/?id=${user_id}` },
    { title: "Kad Keahlian", url: `keahlian/?id=${user_id}` }
  ];

  const sidebarItems2 = [
    { title: "Profil", url: `profil` },
    { title: "Keahlian", url: `keahlian` },
    { title: "Keselamatan", url: `keselamatan` }
  ];

  return (
    <DashboardItemLayout 
      itemTitle="Maklumat Ahli"
      DetailsComponent={() => <MaklumatPeribadi user_id={user_id} />}
      sidebarItems={sidebarItems}
    >

      {children}
    </DashboardItemLayout>
  );
}
