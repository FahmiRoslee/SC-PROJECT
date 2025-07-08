import { supabase } from "@components/lib/supabaseClient";
import { Manikayu } from "./columns";
import { formatDate } from "@components/lib/utils";


export async function getDataMock(): Promise<Manikayu[]> {
  return [
    {
      id: "1",
      unitPengakap: "PENGAKAP KANAK-KANAK",
      noSijil: "PKK 1424",
      tahunLulus: "08/06/2023",
    },
    {
      id: "2",
      unitPengakap: "PENGAKAP KANAK-KANAK",
      noSijil: "PKK 1541",
      tahunLulus: "01/03/2023",
    },
    {
      id: "3",
      unitPengakap: "PENGAKAP REMAJA",
      noSijil: "PR 1634",
      tahunLulus: "09/10/2025",
    },

  ]
}

export async function getDataAPI(user_id: string): Promise<Manikayu[]> {

  const { data, error } = await supabase
    .from("manikayu")
    .select(
      `
        manikayu_id,
        unit,
        certificate_no,
        date_endorsed
      `
    )
    .eq("user_id", user_id)
    .order("date_endorsed", { ascending: true })

  if (error) {
    console.error("Error fetching manikayu list:", error.message)
    return []      
  }

  console.log("Raw Supabase data:", data);
  console.log("Supabase error:", error); 
    
  return data.map((item) => ({
    id: item.manikayu_id.toString(),
    unitPengakap: item.unit,
    noSijil: item.certificate_no,
    tahunLulus: formatDate(item.date_endorsed),
  }))

}

// Insert data into Supabase
export async function insertManikayuRecord({
  user_id,
  unit,
  noSijil,
  tahunLulus,
  salinanSijil,
}: {
  user_id: string;
  unit: string;
  noSijil: string;
  tahunLulus: string;
  salinanSijil: string;
}) {
  const { data, error } = await supabase
    .from("manikayu")
    .insert([
      {
        user_id,
        unit: unit,
        certificate_no: noSijil,
        date_endorsed: tahunLulus,
        certificate_copy_url: salinanSijil,
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

export const deleteManikayuRecord = async (id: string) => {
  const { error } = await supabase
    .from("manikayu")
    .delete()
    .eq("manikayu_id", id)

  if (error) {
    console.error("Delete error:", error)
    return { success: false, error }
  }

  return { success: true }
}