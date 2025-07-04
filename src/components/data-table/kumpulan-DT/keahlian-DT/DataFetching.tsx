import { supabase } from "@components/lib/supabaseClient";
import { AhliPengakap } from "./columns";

export async function getData(): Promise<AhliPengakap[]> {
  return [
    {
      id: "1",
      profilePic: "../../../public/sk-peserai.png",
      name: "Muhammad Falihin Bin Kamari",
      noId: "890421-01-5081",
      unit: "PEMIMPIN",
    },
    {
      id: "2",
      profilePic: "../../../public/sk-peserai.png",
      name: "Md. Osman Bin Abdullah",
      noId: "850312-12-5083",
      unit: "PEMIMPIN",
    },
    {
      id: "3",
      profilePic: "../../../public/sk-peserai.png",
      name: "Nur Syafiyah Binti Sazali",
      noId: "960611-005-7094",
      unit: "PKK",
    },

  ]
}

export async function getDataAPI(team_id: number): Promise<AhliPengakap[]> {
  
  console.log("team_id: ", team_id) 
  const { data, error } = await supabase
  .from("team_members")
  .select(
    `
    team_members_id, 
    user_id,
    status,
    users (
      fullname,
      id_no,
      status
    )
    `
  )
  .eq("team_id", team_id);

  if (error) {
    console.error("Error fetching keahlian table:", error.message)
    return []
  }

  console.log("Raw Supabase data:", data);
  console.log("Supabase error:", error);



  return data.map((item: any) => ({
    id: item.user_id.toString(),
    profilePic: undefined,
    name: item.users?.fullname ?? '',
    noId: item.users?.id_no ?? '',
    unit: '',
  }));


}