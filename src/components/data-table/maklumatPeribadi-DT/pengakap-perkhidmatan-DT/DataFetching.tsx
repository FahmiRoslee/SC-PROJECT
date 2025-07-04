import { supabase } from "@components/lib/supabaseClient";
import { Perkhidmatan } from "./columns";

export async function getDataMock(): Promise<Perkhidmatan[]> {
  return [
    {
      id: "1",
      jawatan: "Pesuruhjaya",
      peringkat: "Daerah",
      tahunMula: "2012",
      tahunTamat: "Kini"
    },
  ]
}


export async function getDataAPI(user_id: string): Promise<Perkhidmatan[]> {
  const { data, error } = await supabase
    .from("user_service")
    .select(`
      service_id,
      position,
      level,
      year_start,
      year_end
    `)
    .eq("user_id", user_id)
    .order("year_start", { ascending: true });

  if (error) {
    console.error("Error fetching service list:", error.message);
    return [];
  }

  console.log("✅ Raw Supabase data:", data);

  return data.map((item) => {
    const jawatanKini =
      item.year_end?.toString().toLowerCase() === "kini"
        ? `${item.position} ${item.level}`
        : undefined;

    return {
      id: item.service_id.toString(),
      jawatan: item.position,
      peringkat: item.level,
      tahunMula: item.year_start,
      tahunTamat: item.year_end,
      jawatanKini, 
    };
  });
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