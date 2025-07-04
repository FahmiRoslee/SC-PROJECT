"use client";

import React, { useEffect } from "react";
import Image from 'next/image'

import { IdCard, Users, LandPlot, School } from "lucide-react";



export default function MaklumatKumpulanDetails() {

  return (
    <div className="flex flex-row mb-7 px-8 py-4  border-red-0 round-md">
      
      {/* KUMPULAN IMAGE */}
      <div className="w-[150px] h-[150px] mr-5 bg-gray-200 rounded-md">
        <Image
          src="/sk-peserai.png" 
          alt="Gambar Kumpulan"
          width={150} 
          height={150} 
          className="object-fill rounded-md"
        />
      </div>

      {/* KUMPULAN DETAILS */}
      <div className="w-full pt-2 bg-gray-0">
        {/* NAMA KUMPULAN */}
        <div className="mb-5 font-sans text-lg font-medium">SK Peserai</div>

        {/* DETAILS */}
        <div className="flex justify-between pr-100">
          <MaklumatKumpulanItem
            iconUpper={IdCard}  
            valUpper={29}
            iconLower={Users} 
            valLower={"PKK"}
          />
          <MaklumatKumpulanItem
            iconUpper={LandPlot}  
            valUpper={29}
            iconLower={IdCard} 
            valLower={"PKK"}
          />
          <MaklumatKumpulanItem
            iconUpper={School} 
            valUpper={29}
            iconLower={IdCard}  
            valLower={"PKK"}
          />
        </div>
      </div>
    </div>
  );
}

type MaklumatKumpulanItemProps = {
  iconUpper: React.ComponentType<{ color: string; size: number, strokeWidth: number }>;
  valUpper: any;
  iconLower: React.ComponentType<{ color: string; size: number, strokeWidth: number }>;
  valLower: any;
  background: boolean;
};

function MaklumatKumpulanItem({
  iconUpper: IconUpper,
  valUpper,
  iconLower: IconLower,
  valLower,
}: MaklumatKumpulanItemProps) {
  return (
    <div className="w-[15%] bg-cyan-0">

      {/* UPPER ROW */}
      <div className="flex mb-4.5">
        {/* ICON */}
        <div className="mr-4">
          <IconUpper color="currentColor" size={20} strokeWidth={1.5}/>
        </div>

        {/* VALUE */}
        <div className="flex-1 break-words overflow-auto font-sans text-sm text-gray-600">
          {valUpper}
        </div>
      </div>

      {/* LOWER ROW */}
      <div className="flex">
        {/* ICON */}
        <div className="mr-4">
          <IconLower color="currentColor" size={20} strokeWidth={1.5} />
        </div>

        {/* VALUE */}
        <div className="bg-green-200 px-3 rounded-md">{valLower}</div>
      </div>
    </div>
  );
}