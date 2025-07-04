"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Users,
  School,
  BadgeIcon as IdCard,
  type LucideIcon,
  Phone,
  Mail,
  Earth,
  Building,
  CircleUserRound,
} from "lucide-react"
import type React from "react"

const teams = [
  { name: "Muhammad Falihin Bin Kamari", type: "Personal Account" },
  { name: "SK Temenggong Ibrahim Penggaram", type: "Teams" },
  { name: "Sk Perserai", type: "Teams" },
]

export default function TeamSwitcher() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0])

  return (
    <div className="container-page transition-all duration-200 ease-linear">
      <h1 className="font-sans text-2xl font-bold">
        Salam Pengakap, <span className="uppercase">Muhammad Falihin Bin Kamari</span>
      </h1>

      <div className="w-full flex mt-7 border-gray-200 transition-all duration-200 ease-linear">
        {/* BANNER & INFO KUMPULAN */}
        <div className="w-full md:w-[60%] mr-10 bg-amber-0 transition-all duration-200 ease-linear">
          <div className="mb-10">
            <Image
              src="/image/img-homeDasboard-banner.png"
              alt="dashboard banner"
              width={1200}
              height={400}
              className="rounded-md"
              layout="responsive"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between w-full gap-4 transition-all duration-200 ease-linear">
            <Card
              title="Jumlah Ahli"
              value="5000"
              icon={<Users strokeWidth={1.5} className="w-5 h-5" />}
              iconColor=""
            />
            <Card
              title="Jumlah Kumpulan"
              value="5000"
              icon={<School strokeWidth={1.3} className="w-5 h-5" />}
              iconColor=""
            />
          </div>
        </div>

        {/* SHORT PERSONAL DETAILS  */}
        <div className="hidden md:block w-[40%] bg-red-0 border boder-gray-400 rounded-md px-2 py-2 transition-all duration-200 ease-linear">
          {/* NAME, PICTURE, STATUS */}
          <div className="flex flex-col justify-center items-center">
            {/* PROFILE PICTURE */}
            <div className="w-[160px] h-[160px] rounded-full border border-gray-300 mb-5"></div>

            {/* NAME */}
            <div className="mb-5 border border-gray-400font-sans font-medium text-xl text-center uppercase break-words overflow-auto">
              Muhammad Falihin Bin Kamari
            </div>

            {/* STATUS */}
            <div className="mb-6 bg-[#D1E7DD] px-4 py-1 rounded-xl flex justify-center items-center">Active</div>
          </div>

          {/* OTHER DETAILS */}
          <div className="px-10">
            <InfoItem icon={IdCard} value="890421-01-5081" iconSize={22} strokeWidth={2} iconColor="#4B5563" />
            <InfoItem icon={Phone} value="+60 137107661" iconSize={22} strokeWidth={2} iconColor="#4B5563" />
            <InfoItem icon={Mail} value="cikgufalihin@gmail.com" iconSize={22} strokeWidth={2} iconColor="#4B5563" />
            <InfoItem icon={Building} value="SK PESERAI" iconSize={22} strokeWidth={2} iconColor="#4B5563" />
            <InfoItem icon={Earth} value="BATU PAHAT" iconSize={22} strokeWidth={2} iconColor="#4B5563" />
          </div>

          {/* VIEW PROFILE BUTTON */}
          <Link href="/dashboard/maklumat-peribadi">
            <button className="mt-5 mb-7 mx-10 py-3 w-full border border-blue-600 rounded-md hover:bg-blue-600 ">
              <div className="flex items-center justify-center text-blue-600 hover:text-white ">
                <CircleUserRound size={22} className="transition-colors" />
                <div className="ml-3 font-sans font-normal">Lihat Profil</div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

type CardProps = {
  title: string
  value: string
  icon?: React.ReactElement
  iconColor?: string
}

const Card = ({ title, value, icon = <Users strokeWidth={1.5} className="w-5 h-5" />, iconColor }: CardProps) => {
  return (
    <div className="flex w-[49%] flex-col py-5 px-6 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="font-sans font-normal text-gray-600 text-md">{title}</div>
        <div
          className={`w-[30px] h-[30px] border border-gray-400 rounded-sm flex justify-center items-center ${iconColor ? iconColor : "text-gray-600"}`}
        >
          {icon}
        </div>
      </div>
      <div className="font-sans font-bold text-3xl text-blue-600">{value}</div>
    </div>
  )
}

type InfoItemProps = {
  icon: LucideIcon
  value: string
  iconSize?: number
  strokeWidth?: number
  iconColor?: string
}

const InfoItem = ({ icon: Icon, value, iconSize = 20, strokeWidth = 1.5, iconColor = "#4B5563" }: InfoItemProps) => {
  return (
    <div className="mb-3 flex items-center">
      <div className="mr-5">
        <Icon size={iconSize} strokeWidth={strokeWidth} color={iconColor} />
      </div>
      <div className="font-sans font-normal text-base text-gray-600">{value}</div>
    </div>
  )
}
