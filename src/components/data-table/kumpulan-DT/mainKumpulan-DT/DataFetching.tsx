import { supabase } from "@components/lib/supabaseClient";

import { MainKumpulan } from "./columns";
import { getCachedUser } from "@components/lib/utils";

export async function getDataMock(): Promise<MainKumpulan[]> {
  return [
    {
      id: "1",
      kumpImage: "../../../public/sk-peserai.png",
      kumpName: "SK Peserai",
      kumpNo: 29,
      daerah: "batu pahat",
      noM: "M 123",
    },
    {
      id: "2",
      kumpImage: "../../../public/sk-peserai.png",
      kumpName: "SMK Tinggi Batu Pahat",
      kumpNo: 1,
      daerah: "batu pahat",
      noM: "M 124",
    },
    {
      id: "3",
      kumpImage: "../../../public/sk-peserai.png",
      kumpName: "SK Temenggong Ibrahim Penggaram",
      kumpNo: 2,
      daerah: "batu pahat",
      noM: "M 125",
    },
  ]
}

export async function getDataAPI(): Promise<MainKumpulan[]> {
  const user_id = await getCachedUser(); // ✅ await here

  console.log("userid: ", user_id);

  const { data, error } = await supabase
    .from("teams")
    .select(`
      team_id,
      profile_picture,
      name,
      team_no,
      register_no,
      team_addresses (
        district,
        state
      )
    `)
    .eq("leader_id", user_id.id);

  if (error) {
    console.log("Error fetching user team:", error.message);
    return [];
  }

  console.log("Raw Supabase data:", data);

  return data.map((item) => ({
    id: item.team_id,
    kumpImage: item.profile_picture ?? undefined,
    kumpName: item.name,
    kumpNo: item.team_no,
    daerah: item.team_addresses?.[0]?.district ?? "N/A",
    noM: item.register_no,
  }));
}


