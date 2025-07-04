import { supabase } from "@components/lib/supabaseClient";
import { senaraiPemohon } from "./columns";
import { formatDate } from "@components/lib/utils";

export async function getDataMock(): Promise<senaraiPemohon[]> {
  return [
    {
      id: "1",
      applicant_id: 'abc123',
      gambarPemohon:"",
      namaPemohon: "",
      namaKumpulan: "",
      tauliah: "",
      noTauliah: "",
      status: "",
      peringkatPenilaian: "",
    },
    {
      id: "2",
      applicant_id: 'abc123',
      gambarPemohon:"",
      namaPemohon: "",
      namaKumpulan: "",
      tauliah: "",
      noTauliah: "",
      status: "",
      peringkatPenilaian: "",
    },
    {
      id: "3",
      applicant_id: 'abc123',
      gambarPemohon:"",
      namaPemohon: "",
      namaKumpulan: "",
      tauliah: "",
      noTauliah: "",
      status: "",
      peringkatPenilaian: "",
    },

  ]
}

export async function getDataAPI(): Promise<senaraiPemohon[]> {

  const appLevel = "pemimpin kumpulan"
  /*
    Penolong Pemimpin Kumpulan
    Pemimpin Kumpulan
    Penolong Pesuruhjaya Daerah
    Pesuruhjaya Daerah
    Penolong Pesuruhjaya Negeri
    Pesuruhjaya Negeri

  */
 /*

  pemimpin kumpulan
  daerah
  negeri
 */

  
  const { data, error } = await supabase
    .from("credential_application")
    .select(`
      credential_application_id,
      applicant_id,
      team_id,
      credential_name,
      application_status,
      application_level,
      isCurrent_application,
      teams:team_id (
        leader_id,
        name,
        daerah
      ),
      users:applicant_id (
        fullname
      )

    `)
    .order("created_at", { ascending: false })
    .eq("application_level", appLevel)
    .eq("isCurrent_application", true)
    .eq("application_status", "menunggu")

  if (error) {
    console.error("❌ Error fetching applicants:", error);
    return [];
  }

  console.log("✅ Raw Supabase data:", data);

  return data.map((item) => ({
    id: item.credential_application_id.toString(),
    applicant_id: item.applicant_id.toString(),

    team_id: item.team_id.toString(),
    leader_id: item.teams?.leader_id.toString(),
    namaKumpulan: item.teams?.name ?? "—",
    daerahKumpulan: item.teams?.daerah ?? "—",

    gambarPemohon:  "",
    namaPemohon: item.users?.fullname ?? "—",
    
    tauliah: item.credential_name,
    noTauliah: "-", 
    status: item.application_status,
    peringkatPenilaian: item.application_level,
  }));
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
    .eq("id", id)

  if (error) {
    console.error("Delete error:", error)
    return { success: false, error }
  }

  return { success: true }
}