"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/components/ui/tabs";
import { useProfilData } from "../../../../../hooks/useProfilData";
import { supabase } from "@components/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileSection } from "@components/components/ProfileUI"; // <-- Import the extracted component

export default function ProfilTabs() {
  const { alamatData, loading } = useProfilData();

  const searchParams = useSearchParams();
  const team_id = searchParams.get("id");

  const [kumpulanData, setKumpulanData] = useState<any>(null);
  const [loading2, setLoading2] = useState<boolean>(true);

  useEffect(() => {
    const fetchKumpulanProfil = async () => {
      setLoading2(true);
      const { data, error } = await supabase
        .from("teams")
        .select(`
          name,
          team_no,
          register_no,
          register_date,
          team_code,
          team_addresses (
            address,
            postcode,
            district,
            state
          )
        `)
        .eq("team_id", team_id)
        .single();

      if (error) {
        console.log("Error fetching team:", error.message);
        setKumpulanData(null);
      } else {
        setKumpulanData(data);
      }

      setLoading2(false);
    };

    if (team_id) {
      fetchKumpulanProfil();
    }
  }, [team_id]);

  if (loading2) return <div>Loading...</div>;
  if (!kumpulanData) return <div>No team data found</div>;

  return (
    <div>
      <Tabs defaultValue="kumpulan" className="w-full">
        <TabsList>
          <TabsTrigger value="kumpulan">Kumpulan</TabsTrigger>
          <TabsTrigger value="alamat">Alamat</TabsTrigger>
        </TabsList>

        <TabsContent value="kumpulan">
          <ProfileSection
            profileMenuTabHeader="Maklumat Kumpulan"
            items={[
              { title: "Nama Kumpulan", value: kumpulanData.name },
              { title: "No. Kumpulan", value: kumpulanData.team_no },
              { title: "No. M", value: kumpulanData.register_no },
              { title: "Tarikh Berdaftar", value: kumpulanData.register_date },
              { title: "Kod Kumpulan", value: kumpulanData.team_code },
              { title: "Daerah", value: kumpulanData.team_addresses[0]?.district },
              { title: "Negeri", value: kumpulanData.team_addresses[0]?.state },
            ]}
          />
        </TabsContent>

        <TabsContent value="alamat">
          <ProfileSection
            profileMenuTabHeader="Maklumat Alamat"
            items={[
              { title: "Alamat Kumpulan", value: kumpulanData.team_addresses[0]?.address },
              { title: "Poskod", value: kumpulanData.team_addresses[0]?.postcode },
              { title: "Daerah", value: kumpulanData.team_addresses[0]?.district },
              { title: "Negeri", value: kumpulanData.team_addresses[0]?.state },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
