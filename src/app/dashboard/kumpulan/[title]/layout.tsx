"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DashboardItemLayout from "@components/components/dashboardItem-component/dashboardItem-layout";
import MaklumatKumpulanDetails from "@components/components/kumpulan-component/maklumatKumpulanItem"



export default function KumpulanLayout({ children }: { children: React.ReactNode }) {

  const searchParams = useSearchParams();
  const team_id = searchParams.get("id"); 

  console.log("teamId in layotu: ",team_id);
  

  const sidebarItems = [
    { title: "Profil", url: `profil/?id=${team_id}` },
    { title: "Keahlian", url: `keahlian/?id=${team_id}` },
    { title: "Keselamatan", url: `keselamatan/?id=${team_id}` }
  ];

  const sidebarItems2 = [
    { title: "Profil", url: `profil` },
    { title: "Keahlian", url: `keahlian` },
    { title: "Keselamatan", url: `keselamatan` }
  ];

  return (
    <DashboardItemLayout 
      itemTitle="Maklumat Kumpulan"
      DetailsComponent={MaklumatKumpulanDetails} 
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardItemLayout>
  );
}
