"use client"

import { supabase } from "@components/lib/supabaseClient";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/components/ui/tabs";
import { useProfilData } from "../../../hooks/useProfilData";

import { DataTable } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/data-table";
// The import for getDataAPI is correct here
import { getDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/DataFetching";
import { Manikayu, columns } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/columns";

import JawatanDT from "@components/components/data-table/maklumatPeribadi-DT/pengakap-jawatan-DT/jawatanDT"
import ManikayuDT from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/manikayuDT";
import AkademikDT from "@components/components/data-table/maklumatPeribadi-DT/pengakap-akademik-DT/akademikDT";

import { formatIcNO,calculateAgeFromIC } from "@components/lib/utils";

export default function MaklumatPeribadiPage() {
    // const { kumpulanData, alamatData, loading } = useProfilData();

    const searchParams = useSearchParams();
    const user_id = searchParams.get("id");

    const [data, setData] = useState<Manikayu[]>([]);
    // You have data2 but it's not used. Consider removing if not needed.
    const [data2, setData2] = useState<Manikayu[]>([]); 

    // FIX: Correctly fetch data using getDataAPI and set the state
    useEffect(() => {
        const fetchData = async () => {
            if (!user_id) {
                // Handle case where user_id is not available yet
                console.warn("User ID not found in search params.");
                return;
            }
            const result = await getDataAPI(user_id); // Call your data fetching function
            setData(result); // Set the state with the result
        };
        fetchData();
    }, [user_id]); // Add user_id to the dependency array

    const [peribadiData, setPeribadiData] = useState(null);
    const [ageAndDob, setAgeAndDob] = useState<{ 
      age: any | null; 
      dob: any | null }
    >({ age: null, dob: null });

    // const [kumpulanData, setKumpulanData] = useState(null);
    const [alamatData, setAlamatData] = useState(null);
    const [pekerjaanData, setPekerjaanData] = useState(null);
    const [akademikData, setAkademikData] = useState(null);
    const [loading, setLoading] = useState(false); // Set to true initially if you want to show loading state for all fetches
 
    const [activeTab, setActiveTab] = useState("peribadi");
 
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
 
        if (activeTab === "peribadi" && !peribadiData) {
            const { data, error } = await supabase
              .from("users") 
              .select(
                `
                fullname,
                phone_no,
                email,
                status,
                id_no,
                title,
                scouts(
                  profile_pic,
                  gender,
                  race,
                  religion,
                  marital_status,
                  no_ahli
                ),
                user_addresses(
                  address,
                  district,
                  state,
                  postcode
                )
                `
              )
              .eq("user_id", user_id) 
              .single();
          
            if (error) {
              console.error("Error fetching peribadi data:", error.message);
              setPeribadiData(null);
            } else {
              setPeribadiData(data);
              setAgeAndDob(calculateAgeFromIC(data.id_no));
            }
          
            console.log("raw data for peribadi: ", data);
          }
          
 
        if (activeTab === "pengakap" && !alamatData) {
          // Fetch alamat data
        //   const response = await fetch("/api/alamatData");
        //   const data = await response.json();
          setAlamatData(null); // This will always set to null, likely not intended
        }
 
        if (activeTab === "pekerjaan" && !pekerjaanData) {
          // Fetch pekerjaan data
        //   const response = await fetch("/api/pekerjaanData");
        //   const data = await response.json();
          setPekerjaanData(null); // This will always set to null, likely not intended
        }
 
        if (activeTab === "akademik" && !akademikData) {
          // Fetch akademik data
        //   const response = await fetch("/api/akademikData");
        //   const data = await response.json();
          setAkademikData(null); // This will always set to null, likely not intended
        }
 
        setLoading(false);
      };
 
      // Add user_id to dependencies for this useEffect as well, since it's used in supabase.eq("user_id", user_id)
      fetchData();
    }, [activeTab, user_id, peribadiData, alamatData, pekerjaanData, akademikData]); // Added missing dependencies

    if (loading) return <div>Loading data... {user_id}</div>;

    return (
        <div>
            <Tabs defaultValue="kumpulan" className="w-full">
            <TabsList>
                <TabsTrigger value="peribadi">Peribadi</TabsTrigger>
                <TabsTrigger value="pengakap">Pengakap</TabsTrigger>
                <TabsTrigger value="anugerah">Anugerah</TabsTrigger>
                <TabsTrigger value="pekerjaan">Pekerjaan</TabsTrigger>
                <TabsTrigger value="akademik">Akademik</TabsTrigger>
            </TabsList>

            <TabsContent value="peribadi">
                {peribadiData ? (
                <ProfileSection
                    value={"peribadi"}
                    data={[]} // This data prop is empty, check if it's meant to be peribadiData
                    profileMenuTabHeader="Maklumat Kumpulan"
                    items={[
                    { title: "Nama Penuh", value: peribadiData.fullname },
                    { title: "Pangkat", value: peribadiData.title ?? '-' },
                    { title: "Status Perkahwinan", value: peribadiData.marital_status },
                    { title: "", value: "" },
                    { title: "ID No", value: formatIcNO(peribadiData.id_no )},
                    { title: "Email", value: peribadiData.email  },
                    { title: "No. Tel", value: peribadiData.phone_no },
                    { title: "Jantina", value: peribadiData.scouts.gender  },
                    { title: "Kaum", value: peribadiData.fullname }, // This should probably be peribadiData.scouts.race
                    { title: "Agama", value: peribadiData.fullname }, // This should probably be peribadiData.scouts.religion
                    { title: "Tarikh Lahir", value: ageAndDob.dob },
                    { title: "Umur", value: `${ageAndDob.age} tahun` },
                    { title: "Tempat Lahir", value: peribadiData.fullname  }, // This should probably be peribadiData.scouts.birth_place or similar
                    { title: "Alamat Kediaman", value: peribadiData.user_addresses[0].address  },
                    { title: "", value: "" },
                    { title: "", value: "" },
                    { title: "Poskod", value: peribadiData.user_addresses[0].postcode },
                    { title: "Daerah", value: peribadiData.user_addresses[0].district   },
                    { title: "Negeri", value: peribadiData.user_addresses[0].state   },
                    ]}
                />
                ) : (
                <div>Tiada data kumpulan</div>
                )}
            </TabsContent>

            <TabsContent value="pengakap">
                {/* FIX: Use the 'data' state (fetched from getDataAPI) here */}
                {data.length > 0 ? ( // Check if data is available
                <ProfileSection
                    value={"pengakap"}
                    data={data} // Pass the fetched data
                    profileMenuTabHeader="Maklumat Pengakap"
                    items={[
                    // These items are currently hardcoded to alamatData, which is null in this tab.
                    // You might want to map data from the 'data' state (Manikayu[]) here
                    { title: "No. Keahlian", value: peribadiData?.scouts?.no_ahli || '-' }, // Example from peribadiData
                    { title: "No. Tauliah", value: "N/A" }, // Placeholder
                    { title: "Jawatan Pengakap", value: "N/A" }, // Placeholder
                    { title: "Unit Keahlian", value: "N/A" }, // Placeholder
                    { title: "Daerah", value: "N/A" }, // Placeholder
                    { title: "Negeri", value: "N/A" }, // Placeholder
                    ]}
                />
                ) : (
                <div>Tiada data pengakap</div> // Changed from alamat
                )}
            </TabsContent>

            <TabsContent value="anugerah"></TabsContent>

            <TabsContent value="pekerjaan">
                {alamatData ? ( // This still checks alamatData, which is null. Should be pekerjaanData.
                    <ProfileSection
                        value={"pekerjaan"}
                        data={data} // Pass the fetched data if relevant
                        profileMenuTabHeader="Maklumat Pekerjaan"
                        items={[
                        { title: "Jawatan Hakiki", value: alamatData?.alamatKumpulan || '' }, // Check for null
                        { title: "Nama Majikan", value: alamatData?.alamatKumpulan || '' }, // Check for null
                        { title: "", value: "" },
                        { title: "", value: "" },
                        { title: "Alamat Majikan", value: alamatData?.negeri || '' }, // Check for null
                        { title: "", value: "" },
                        { title: "", value: "" },
                        { title: "Poskod", value: alamatData?.negeri || '' }, // Check for null
                        { title: "Daerah", value: alamatData?.negeri || '' }, // Check for null
                        { title: "Negeri", value: alamatData?.negeri || '' }, // Check for null
                        ]}
                    />
                    ) : (
                    <div>Tiada data pekerjaan</div> // Changed from alamat
                    )} 
            </TabsContent>
            <TabsContent value="akademik">
                <ProfileSection
                    value={"akademik"}
                    data={[]}
                    profileMenuTabHeader="Maklumat Akademik"
                    items={[]}
                    />
            </TabsContent>
            </Tabs>        
        </div>

    );
}


type ProfileContainerProps = {
    profileMenuTabHeader: string
    children: React.ReactNode
  }
  function ProfileContainer({ profileMenuTabHeader, children }: ProfileContainerProps) {
    return (
        <div className="mt-5 px-8 py-4 border border-gray-400 rounded-md">
            <div className="mb-6 font-sans font-semibold">{profileMenuTabHeader}</div>
            {children}
        </div>
    )
  }
  
  
type ProfileSectionProps = {
    value: string;
    data: any[];
    profileMenuTabHeader: string;
    items: { title: string; value: string | number }[]; // Dynamic list of items (title, value pairs)
}
    
function ProfileSection({ profileMenuTabHeader, items, data, value }: ProfileSectionProps) {
    // FIX: Add a check for items.length before accessing firstItem to prevent errors on empty arrays
    const firstItem = items.length > 0 ? items[0] : { title: "", value: "" };

    const groupItems = (items: typeof firstItem[], groupSize: number) => {
        let groups = [];

        for (let i = 0; i < items.length; i += groupSize) {
            groups.push(items.slice(i, i + groupSize));
        }

        return groups;
    };

    // FIX: Slice from 0 if items.length is 0 to avoid negative index
    const remainingGroups = groupItems(items.slice(1), 3); // Skip first item

    return (
        <ProfileContainer profileMenuTabHeader={profileMenuTabHeader}>
            {items.length === 0 ? (
                <div className="text-gray-500 italic">No profile items available.</div>
            ) : (
                <>
                    {/* ROW 1: NAMA KUMPULAN */}
                    <div className="flex justify-between pr-15">
                        <ProfileItemContainer>
                            <ProfilItem title={firstItem.title} value={firstItem.value} />
                        </ProfileItemContainer>
                    </div>

                    {/* REMAINING ROWS */}
                    {remainingGroups.map((group, index) => (
                        <div key={index} className="flex justify-between pr-80 mt-4">
                            {group.map((item, itemIndex) => (
                                <ProfileItemContainer key={itemIndex}>
                                    <ProfilItem title={item.title} value={item.value} />
                                </ProfileItemContainer>
                            ))}
                        </div>
                    ))}
                </>
            )}

            {/* Show table or whatever comes below regardless sss*/}
            {renderDatatable(value)}
        </ProfileContainer>
    );
}


function renderDatatable(caseValue: string) {
    switch (caseValue) {
        case "pengakap":
            return <div>
                        <div className="mt-6 mb-0 font-sans font-semibold">
                            Senarai Manikayu
                        </div>
                        <ManikayuDT editable={false}/>
                        <div className="mt-6 mb-0 font-sans font-semibold">
                            Senarai Jawatan
                        </div>                        
                        <JawatanDT/>
                </div>;
        case "anugerah":
            return <div>This is Tab C content</div>;
        case "akademik":
            return <div><AkademikDT/></div>;
        default:
            return <div></div>;
    }
}

    
  type ProfileItemContainerProps = {
      children: React.ReactNode;
  };
  function ProfileItemContainer({ children }: ProfileItemContainerProps) {
      return (
        <div className="w-[20%]">
          {children}
        </div>
      );
  }
  
  
  type ProfileItemProps = {
      title: string
      value: any
  }
  function ProfilItem({ title, value }: ProfileItemProps) {
      return (
        <div className="mb-1">
          <div className="mb-1 font-sans font-normal text-sm text-gray-600">{title}</div>
          <div className="font-sans font-normal text-sm text-black">{value}</div>
        </div>
      )
  };