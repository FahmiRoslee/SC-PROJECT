"use client";

// IMPORT ICON FROM LUCIDE
import { UsersRound, Home, School, ClipboardCheck, FlameKindling, Newspaper, ChevronDown, ChevronRight } from "lucide-react"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,

  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible"
import React from "react";



interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ size?: number }>;
  subitem?: MenuItem[];
}

// Menu items.
const items = [
  {
    title: "Ahli",
    url: "/dashboard/ahli",
    icon: UsersRound,
  },
  {
    title: "Kumpulan",
    url: "/dashboard/kumpulan",
    icon: School,
  },
  {
    title: "Aktiviti",
    url: "/aktiviti",
    icon: FlameKindling,
    subitem: [
      {
        title: "Aktiviti",
        url: "/aktiviti",
        icon: null,
      },
      {
        title: "Penganjur",
        url: "/aktiviti/penganjur",
        icon: null,
      },
    ],
  },
  {
    title: "Tauliah",
    url: "/tauliah",
    icon: ClipboardCheck,
    subitem: [
      {
        title: "Permohanan Tauliah",
        url: "/dashboard/tauliah/permohanan-tauliah",
        icon: null,
      },
      {
        title: "Jenis Tauliah",
        url: "/dashboard/tauliah/jenis-tauliah ",
        icon: null,
      },
    ],    
  },
  {
    title: "Berita",
    url: "/dashboard/berita",
    icon: Newspaper,
  },
]

export function AppSidebar() {
  const pathname = usePathname();
  const isPaparanUtamaActive = pathname === "/dashboard"; // Check if active

  const RenderSingleMenuItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({ item, isActive }) => {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  
  const RenderMultipleMenuItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({ item, isActive }) => {
    const pathname = usePathname(); // Get the current URL
    const hasActiveSubItem = item.subitem?.some(subItem => pathname === subItem.url); // Check if any sub-item is active
    const [isOpen, setIsOpen] = useState(hasActiveSubItem); // Set open state based on active submenu
  
    useEffect(() => {
      if (hasActiveSubItem) {
        setIsOpen(true); // Keep open if a sub-item is active
      }
    }, [hasActiveSubItem]); // Update when the pathname changes
  
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <SidebarMenuItem key={item.title}>
          
          {/* MENU ITEM (Collapsible Header) */}
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                {item.icon && React.createElement(item.icon, { size: 20 })}
                <span>{item.title}</span>
              </div>
              {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={16} />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
  
          {/* SUBMENU ITEMS */}
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subitem?.map((subItem) => {
                const isSubActive = pathname === subItem.url; // Check if submenu item is active
  
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton 
                      asChild 
                      isActive={isSubActive} 
                      className={`w-full text-left ${isSubActive ? "bg-blue-500 text-white" : "bg-transparent text-gray-700"} hover:bg-blue-300`}
                    >
                      <Link href={subItem.url}>
                        {subItem.icon && React.createElement(subItem.icon, { size: 20 })}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>  {/* scrollable */}
        <SidebarGroup>
          {/* ESCOUT LOGO */}
          <div className="w-full flex justify-center items-center  border-dashed border-gray-400">
            <Image src="/logo/logo-eScout-White.png" alt="Logo" width={130} height={130} />
          </div>

          {/* PAPARAN UTAMA ITEM*/}
          <SidebarMenu className="mt-5 mb-2">
            <SidebarMenuItem key="Paparan Pemuka">
              <SidebarMenuButton asChild isActive={isPaparanUtamaActive}>
                <Link href="/dashboard">
                  <Home size={20} />
                  <span>Paparan Pemuka</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          {/* HALAMAN UTAMA LABEL */}
          <SidebarGroupLabel>Utama</SidebarGroupLabel>

          {/* GROUP ITEM */}
          <SidebarGroupContent>
            <SidebarMenu>
            <SidebarMenu>
              {items.map((item) => {
                // const isActive = pathname === item.url; 
                const isActive = pathname.includes(`${item.url}`);


                if (item.subitem == null) {
                  return <RenderSingleMenuItem key={item.title} item={item} isActive={isActive} />;
                } else {
                  return <RenderMultipleMenuItem key={item.title} item={item} isActive={isActive} />;
                }
              })}
            </SidebarMenu>

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
