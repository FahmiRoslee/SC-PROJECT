"use client";

import { supabase } from "@components/lib/supabaseClient";

import { useEffect, useState } from "react";
import Image from "next/image";

import { formatIcNO } from "@components/lib/utils";

import { Earth, IdCard, Phone, Mail } from "lucide-react"; // adjust your icon imports

interface MaklumatPeribadiProps {
  user_id: any;
}

export default function MaklumatPeribadi({ user_id }: MaklumatPeribadiProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          *,
          user_addresses(*)
          `
        )
        .eq("user_id", user_id) // make sure your column name is "id" (not "user_id")
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        setUserData(null);
      } else {
        setUserData(data);
      }

      console.log("raw data keahlian: ",data);
      setLoading(false);
    };

    if (user_id) {
      fetchUserData();
    }
  }, [user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="flex flex-row mb-7 px-8 py-4 border-red-0 rounded-md">
      
      {/* PROFILE PICTURE */}
      <div className="w-[150px] h-[150px] mr-5 bg-gray-200 rounded-md">
        <Image
          src="/image/img-defaultProfilePicture.png" 
          alt="Gambar Profil"
          width={150}
          height={150}
          className="object-fill rounded-md"
        />
      </div>

      {/* USER DETAILS */}
      <div className="w-full pt-2 bg-gray-0">
        
        {/* NAME & STATUS */}
        <div className="mb-5 flex items-center">
          <div className="mr-5 font-sans text-lg font-medium">
            {userData.fullname}
          </div>
          <div className="bg-[#D1E7DD] font-sans font-medium text-sm px-3 py-1 rounded-xl flex items-center justify-center">
            {userData.status ?? "Active"}
          </div>
        </div>

        {/* OTHER DETAILS */}
        <div className="flex justify-between pr-100">
          <MaklumatKumpulanItem
            iconUpper={Earth}
            valUpper={userData.user_addresses[0].district}
            iconLower={IdCard}
            valLower={formatIcNO(userData.id_no) ?? "xxxxxx-xx-xxxx"}
          />
          <MaklumatKumpulanItem
            iconUpper={Phone}
            valUpper={userData.phone ?? "No Phone"}
            iconLower={Mail}
            valLower={userData.email ?? "No Email"}
          />
        </div>
      </div>
    </div>
  );
}


type MaklumatKumpulanItemProps = {
  iconUpper: React.ComponentType<{ color: string; size: number, strokeWidth: number }>;
  valUpper: any;
  backgroundUpper?: boolean; 
  iconLower: React.ComponentType<{ color: string; size: number, strokeWidth: number }>;
  valLower: any;
  backgroundLower?: boolean;
};

function MaklumatKumpulanItem({
  iconUpper: IconUpper,
  valUpper,
  backgroundUpper = false,
  iconLower: IconLower,
  valLower,
  backgroundLower = false, 
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
        <div
          className={`flex-1 break-words overflow-auto font-sans text-sm text-gray-600 ${
            backgroundUpper ? "bg-green-200 px-3 rounded-md" : ""
          }`}
        >
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
        <div
          className={`${
            backgroundLower ? "bg-green-200 px-3 rounded-md" : ""
          }`}
        >          {valLower}
          </div>
      </div>
    </div>
  );
}