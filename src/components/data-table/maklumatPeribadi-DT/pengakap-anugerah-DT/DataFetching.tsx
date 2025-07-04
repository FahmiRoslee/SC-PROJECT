import { supabase } from "@components/lib/supabaseClient";
import { Anugerah } from "./columns";
import { formatDate } from "@components/lib/utils";

export async function getDataMock(): Promise<Anugerah[]> {
  return [
    {
      id: "1",
      namaAnugerah: "PENGAKAP KANAK-KANAK",
      peringkat: "PKK 1424",
      tahun: "08/06/2023",
    },
    {
      id: "2",
      namaAnugerah: "PENGAKAP KANAK-KANAK",
      peringkat: "PKK 1541",
      tahun: "01/03/2023",
    },
    {
      id: "3",
      namaAnugerah: "PENGAKAP REMAJA",
      peringkat: "PR 1634",
      tahun: "09/10/2025",
    },

  ]
}

export async function getDataAPI(user_id: string, award_type:string): Promise<Anugerah[]> {

  const { data, error } = await supabase
    .from("user_award")
    .select(
      `
        award_id,
        award_name,
        award_level,
        award_year
      `
    )
    .eq("user_id", user_id)
    .eq("award_type", award_type)
    .order("award_year", { ascending: true })

  if (error) {
    console.error(`Error fetching ${award_type} award list:`, error.message);
    return [];
  }

  console.log("Raw Supabase data:", data);
  console.log("Supabase error:", error); 
    
  return data.map((item) => ({
    id: item.award_id.toString(),
    namaAnugerah: item.award_name,
    peringkat: item.award_level,
    tahun: formatDate(item.award_year),
  }))

}

export async function insertAnugerahRecord({
  user_id,
  awardName,
  awardType,
  awardLevel,
  awardYear,
}: {
  user_id: string;
  awardName: string;
  awardType: string;
  awardLevel: string;
  awardYear: string;
}) {
  const { data, error } = await supabase
    .from("anugerah")
    .insert([
      {
        user_id,
        awardName,
        awardType,
        awardLevel,
        awardYear,
      },
    ]);

  if (error) {
    console.error("Insert error:", error.message);
    return { success: false, error };
  } else {
    console.log("Data inserted:", data);
    return { success: true, data };
  }
}

export const deleteAnugerahRecord = async (id: string) => {
  const { error } = await supabase
    .from("user_award")
    .delete()
    .eq("award_id", id)

  if (error) {
    console.error("Delete error:", error)
    return { success: false, error }
  }

  return { success: true }
}