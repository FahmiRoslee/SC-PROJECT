"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type SidebarItem = {
  title: string;
  url: string; // last segment like 'profil', 'keahlian', etc.
};

type SidebarProps = {
  sidebarItems: SidebarItem[];
};

export default function DashboardItemSidebar({ sidebarItems }: SidebarProps) {
  
  const searchParams = useSearchParams();
  const team_id = searchParams.get("id"); // to get the query param, if needed

  const pathname = usePathname();

  // Remove query string from pathname for accurate matching
  const cleanPathname = pathname.split('?')[0];

  const segments = cleanPathname.split('/');

  // Grab basePath: /dashboard/kumpulan/SK Peserai
  const basePath = segments.slice(0, 4).join('/');

  return (
    <div className="w-[14%] mr-4 min-h-screen">
      <div className="mb-10">{pathname} | {sidebarItems.at(0)?.url}</div>

      {sidebarItems.map((item) => (
        <SidebarButton
          key={item.url}
          title={item.title}
          url={`${basePath}/${item.url}`} // full path
        />
      ))}
    </div>
  );
}

function SidebarButton({ title, url }: SidebarItem) {
  const pathname = usePathname();
  
  // Remove query string from pathname for accurate matching
  const cleanPathname = pathname.split('?')[0];

  const isActive = cleanPathname === url; // Match without query

  console.log("cleanPathname: ",cleanPathname);
  console.log("pathname: ",pathname);

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
