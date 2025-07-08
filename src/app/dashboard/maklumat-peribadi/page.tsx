"use client"

import { supabase } from "@components/lib/supabaseClient";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/components/ui/tabs";
import { useProfilData } from "../../../hooks/useProfilData";

import { DataTable } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/data-table";
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
    const [data2, setData2] = useState<Manikayu[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        const result = await setData();
        setData(result);
        };
        fetchData();
    }, []);

    const [peribadiData, setPeribadiData] = useState(null);
    const [ageAndDob, setAgeAndDob] = useState<{ 
      age: any | null; 
      dob: any | null }
    >({ age: null, dob: null });

    // const [kumpulanData, setKumpulanData] = useState(null);
    const [alamatData, setAlamatData] = useState(null);
    const [pekerjaanData, setPekerjaanData] = useState(null);
    const [akademikData, setAkademikData] = useState(null);
    const [loading, setLoading] = useState(false);
  
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
          setAlamatData(null);
        }
  
        if (activeTab === "pekerjaan" && !pekerjaanData) {
          // Fetch pekerjaan data
        //   const response = await fetch("/api/pekerjaanData");
        //   const data = await response.json();
          setPekerjaanData(null);
        }
  
        if (activeTab === "akademik" && !akademikData) {
          // Fetch akademik data
        //   const response = await fetch("/api/akademikData");
        //   const data = await response.json();
          setAkademikData(null);
        }
  
        setLoading(false);
      };
  
      fetchData();
    }, [activeTab]);


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
                    data={[]}
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
                    { title: "Kaum", value: peribadiData.fullname },
                    { title: "Agama", value: peribadiData.fullname },
                    { title: "Tarikh Lahir", value: ageAndDob.dob },
                    { title: "Umur", value: `${ageAndDob.age} tahun` },
                    { title: "Tempat Lahir", value: peribadiData.fullname  },
                    { title: "Alamat Kediaman", value: peribadiData.user_addresses[0].address  },
                    { title: "", value: "" },
                    { title: "", value: "" },
                    { title: "Poskod", value: peribadiData.user_addresses[0].postcode },
                    { title: "Daerah", value: peribadiData.user_addresses[0].district   },
                    { title: "Negeri", value: peribadiData.user_addresses[0].state  },
                    ]}
                />
                ) : (
                <div>Tiada data kumpulan</div>
                )}
            </TabsContent>

            <TabsContent value="pengakap">
                {alamatData ? (
                <ProfileSection
                    value={"pengakap"}
                    data={data}
                    profileMenuTabHeader="Maklumat Pengakap"
                    items={[
                    { title: "", value: "" },
                    { title: "No. Keahlian", value: alamatData.alamatKumpulan },
                    { title: "No. Tauliah", value: alamatData.poskod },
                    { title: "Jawatan Pengakap", value: alamatData.daerah },
                    { title: "Unit Keahlian", value: alamatData.negeri },
                    { title: "Daerah", value: alamatData.negeri },
                    { title: "Negeri", value: alamatData.negeri },
                    ]}
                />
                ) : (
                <div>Tiada data alamat</div>
                )}
            </TabsContent>

            <TabsContent value="anugerah"></TabsContent>

            <TabsContent value="pekerjaan">
                {alamatData ? (
                    <ProfileSection
                        value={"pekerjaan"}
                        data={data}
                        profileMenuTabHeader="Maklumat Pekerjaan"
                        items={[
                        { title: "Jawatan Hakiki", value: alamatData.alamatKumpulan },
                        { title: "Nama Majikan", value: alamatData.alamatKumpulan },
                        { title: "", value: "" },
                        { title: "", value: "" },
                        { title: "Alamat Majikan", value: alamatData.negeri },
                        { title: "", value: "" },
                        { title: "", value: "" },
                        { title: "Poskod", value: alamatData.negeri },
                        { title: "Daerah", value: alamatData.negeri },
                        { title: "Negeri", value: alamatData.negeri },
                        ]}
                    />
                    ) : (
                    <div>Tiada data alamat</div>
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
    const firstItem = items[0];

    const groupItems = (items: typeof firstItem[], groupSize: number) => {
        let groups = [];

        for (let i = 0; i < items.length; i += groupSize) {
            groups.push(items.slice(i, i + groupSize));
        }

        return groups;
    };

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

            {/* Show table or whatever comes below regardless sssssss*/}
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