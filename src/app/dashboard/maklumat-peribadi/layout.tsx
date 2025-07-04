"use client";

import React from "react";

import DashboardItemLayout from "@components/components/dashboardItem-component/dashboardItem-layout";
import MaklumatPeribadi from "@components/components/maklumatPeribadi-component/maklumatPeribadi";

const sidebarItems = [
  { title: "Profil", url: "profil" },
  { title: "Kumpulan", url: "kumpulan" },
  { title: "Kad Keahlian", url: "kad-keahlian" }
];

export default function MaklumatPeribadiLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardItemLayout 
      itemTitle="Maklumat Peribadi"
      DetailsComponent={MaklumatPeribadi} 
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardItemLayout>
  );
}
