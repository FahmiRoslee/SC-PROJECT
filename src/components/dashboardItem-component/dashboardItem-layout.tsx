"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@components/components/ui/breadcrumb";

import DashboardItemSidebar from "./dashboardItem-sidebar";

type DashboardItemLayoutProps = {
  children: React.ReactNode;
  itemTitle: string;
  DetailsComponent: React.ComponentType;
  sidebarItems: { title: string; url: string }[];
};

export default function DashboardItemLayout({
  children,
  itemTitle,
  DetailsComponent,
  sidebarItems,
}: DashboardItemLayoutProps) {

  const pathname = usePathname();
  const segments = pathname.split("/");
  const basePath = segments.slice(0, segments.length - 1).join("/");
  
  const pageName = segments.pop() || "";
  const formattedPageName = pageName
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

  return (
    <div className="container-page">
      {/* KUMPULAN PAGE TITLE */}
      <h1 className="font-sans font-bold text-xl mb-2">{itemTitle}</h1>

      {/* DYNAMIC BREADCRUMB */}
      <Breadcrumb className="mb-2 font-sans font-normal text-sm">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={basePath}>{segments.at(2)}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{formattedPageName}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex border-green-0">
        <DashboardItemSidebar sidebarItems={sidebarItems} />

        <div className="w-full border-gray-0 rounded">
          <DetailsComponent />
          <div className="font-sans font-semibold text-lg mb-4">{formattedPageName}</div>
          {children}
        </div>
      </div>
    </div>
  );
}