import { supabase } from "@components/lib/supabaseClient";
import { Akademik } from "./columns";

export async function getDataMock(): Promise<Akademik[]> {
  return [
    {
      id: "1",
      namaInstitusi: "SMKA JOHOR",
      tahunMasuk: "2010",
      tahunKeluar: "2012",
      pencapaian: "SIJIL PELAJARAN MALAYSIA"
    },
    {
      id: "2",
      namaInstitusi: " PERGURUAN ISLAM BANGI",
      tahunMasuk: "2002",
      tahunKeluar: "2006",
      pencapaian: "DIPLOMA PENGURUAN MALAYSIA"
    },

  ]
}


export async function getDataAPI(user_id: string): Promise<Akademik[]> {

  const { data, error } = await supabase
    .from("user_academic")
    .select(
      `
        id,
        created_at,
        institute_name,
        academic_award,
        enroll_year,
        end_year
      `
    )
    .eq("user_id", user_id)
    .order("enroll_year", { ascending: true })

  if (error) {
    console.error("Error fetching academic list:", error.message)
    return []      
  }

  console.log("Raw Supabase data:", data);
  console.log("Supabase error:", error); 
    
  return data.map((item) => ({
    id: item.id.toString(),
    namaInstitusi: item.institute_name,
    pencapaian: item.academic_award,
    tahunMasuk: item.enroll_year,
    tahunKeluar: item.end_year,
  }))

}

// Insert data into Supabase
export async function insertAcademicRecord({
  user_id,
  namaInstitusi,
  pencapaian,
  tahunMasuk,
  tahunKeluar,
}: {
  user_id: string;
  namaInstitusi: string;
  pencapaian: string;
  tahunMasuk: string;
  tahunKeluar: string;
}) {
  const { data, error } = await supabase
    .from("user_academic")
    .insert([
      {
        user_id,
        institute_name: namaInstitusi,
        academic_award: pencapaian,
        enroll_year: tahunMasuk,
        end_year: tahunKeluar,
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

export const deletecademicRecord = async (id: string) => {
  const { error } = await supabase
    .from("user_academic")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Delete error:", error)
    return { success: false, error }
  }

  return { success: true }
}