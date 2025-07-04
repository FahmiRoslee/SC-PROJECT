"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  title: string;
  url: string;
};

export default function KumpulanSidebar() {

  const pathname = usePathname();
  // const segments = pathname.split('/');
  // const basePath = segments.slice(0, 4).join('/');


  return (
    <div className="w-[14%] bg-red-0 mr-4 min-h-screen">
      <div className="mb-10"></div>

      <SidebarButton title="Profil" url={`${pathname}/profil`}/>
      <SidebarButton title="Keahlian" url={`${pathname}/keahlian`}/>
      <SidebarButton title="Keselamatan" url={`${pathname}/keselamatan`}/>
    </div>
  );
}

function SidebarButton({ title, url }: SidebarItem) {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <Link href={url}>
      <button
        className={`
          font-sans font-normal text-sm
          w-full mb-2 px-4 py-2 text-left rounded-md transition-colors justify-start
          ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200'}
        `}
      >
        {title}
      </button>
    </Link>
  );
}
