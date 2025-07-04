"use client";

import Link from "next/link";
import { cn } from "@components/lib/utils";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: "blue" | "green" | "red";
}

export default function BorangNavigationCard({
  title,
  description,
  icon,
  href,
  color = "blue",
}: NavigationCardProps) {
  const bgColorMap = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-emerald-50 text-emerald-500",
    red: "bg-red-50 text-red-500",
  };

  const hoverBgMap = {
    blue: "before:bg-blue-400/5",
    green: "before:bg-emerald-400/5",
    red: "before:bg-red-400/5",
  };

  const textColorMap = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    red: "text-red-600",
  };

  const barColorMap = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
  };

  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden group bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]",
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
        hoverBgMap[color]
      )}
    >
      <div className="p-8">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
            bgColorMap[color]
          )}
        >
          {icon}
        </div>

        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        <div
          className={cn(
            "inline-flex items-center text-sm font-medium",
            textColorMap[color]
          )}
        >
          Lihat Maklumat
          <svg
            className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <div className={cn("absolute bottom-0 left-0 right-0 h-1", barColorMap[color])}></div>
    </Link>
  );
}
