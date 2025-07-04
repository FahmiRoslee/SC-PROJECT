'use client'

import { useCallback, useEffect, useState } from "react"  

import { supabase } from "@components/lib/supabaseClient"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@components/lib/store"
import { setCorrectFields, setIncorrectFields, setMissingFields, setValidatedBorangId } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice"

import { FileText, School, BriefcaseBusiness, UsersRound, UserRound, Handshake, Crown, FileSignature } from "lucide-react"
import { calculateAgeFromIC, formatIcNO } from "@components/lib/utils"

import { Manikayu } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/columns"
import { getDataAPI as getManikayuDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/DataFetching"
import { Perkhidmatan } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-perkhidmatan-DT/columns"
import { getDataAPI as getServiceDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-perkhidmatan-DT/DataFetching"
import { PersonalInfoCard, type ValidationStatus, InfoField } from "@components/components/maklumatPeribadi-component/personalInfoCard"
import { FormLayout, type FormSection } from "@components/components/tauliah-component/borangLayout"


// type ValidationStatus = "correct" | "missing" | "incorrect" | "unvalidated";

export default function BorangPPM() {

  const dispatch = useDispatch();
  const applicant_id = useSelector((state: RootState) => state.penilaianTauliah.applicantId);
  console.log("--------------applicant_id above:" ,applicant_id);
  const currValidatedBorangId = useSelector((state: RootState) => state.penilaianTauliah.validatedBorangId);
  const currCorrectFields = useSelector((state: RootState) => state.penilaianTauliah.correctFields);
  const currIncorrectFields = useSelector((state: RootState) => state.penilaianTauliah.incorrectFields);
  const currMissingFields = useSelector((state: RootState) => state.penilaianTauliah.missingFields);


  const [validationResults, setValidationResults] = useState<Record<string, ValidationStatus>>({})
  const [tableValidationResults, setTableValidationResults] = useState<Record<string, ValidationStatus>>({})
  const [validationIssues, setValidationIssues] = useState<{
    incorrect: string[]
    missing: string[]
  }>({ incorrect: [], missing: [] })

  const [serviceData, setServiceData] = useState<Perkhidmatan[]>([]);
 
  const [personalInfo, setPersonalInfo] = useState<InfoField[]>([]);
  const [teamInfo, setTeamInfo] = useState<InfoField[]>([]);
  const [occupationInfo, setOccupationInfo] = useState<InfoField[]>([]);
  const [credentialInfo, setCredentialInfo] = useState<InfoField[]>([]);
  const [manikayuInfo, setManikayuInfo] = useState<Manikayu[]>([]);
  const [declarationInfo, setDeclarationInfo] = useState<InfoField[]>([]);

  const butirManikayu = [
    {
      id: "butirManikayu",
      title: "",
      columns: [
          { header: "Unit Pengakap", accessor: "unitPengakap" },
          { header: "No. Sijil", accessor: "noSijil" },
          { header: "Tahun Lulus", accessor: "tahunLulus" },
      ],
      data: manikayuInfo, 
    },    
  ]

  const butirPerkidmatanPPM = [
    {
      id: "butirPerkhidmatan",
    title: "",
    columns: [
        { header: "Jawatan", accessor: "jawatan" },
        { header: "Peringkat", accessor: "peringkat" },
        { header: "Tahun Mula", accessor: "tahunMula" },
        { header: "Tahun Tamat", accessor: "tahunTamat" },
    ],
    data: serviceData, 
    },    
  ]
    
  // Get applicant data from supabase
  useEffect(() => {
    const fetchData = async () => {

      // const applicantId = "92f1114b-99a4-4d53-bf0c-ed70c1177656";
        console.log("--------------applicant_id useEffect:" ,applicant_id);
      const data = await getPersonalInfoFromCredentialApplication(applicant_id);          
      
      const mappedCredentialInfo = mapButirTauliah(data);
      const mappedPersonalInfo = mapButirPeribadi(data);
      const mappedOccupationInfo = mapButirPekerjaan(data);
      const mappedGroupInfo = mapButirKumpulan(data);
      const manikayuData = await getManikayuDataAPI(applicant_id);
      const serviceData = await getServiceDataAPI(applicant_id);
      const mappedButirPengakuan = mapButirPengakuan(data);

      setCredentialInfo(mappedCredentialInfo);
      setPersonalInfo(mappedPersonalInfo);
      setOccupationInfo(mappedOccupationInfo);
      setTeamInfo(mappedGroupInfo);
      setServiceData(serviceData);
      setManikayuInfo(manikayuData);

      setDeclarationInfo(mappedButirPengakuan);
    };

    fetchData();
  }, []); 
     
  // Get all field labels for validation tracking
  const getAllFieldLabels = () => {
    const fieldLabels = [
      ...credentialInfo.map((field) => field.id),
      ...personalInfo.map((field) => field.id),
      ...occupationInfo.map((field) => field.id),
      ...teamInfo.map((field) => field.id),
    ]
    const tableLabels = [
      ...butirManikayu.map((table) => table.id), 
      ...butirPerkidmatanPPM.map((table) => table.id)
    ]

    console.log("fieldLabels 123: " ,fieldLabels);
    console.log("tableLabels: " ,tableLabels);

    return { fieldLabels, tableLabels }
  }

  const { fieldLabels, tableLabels } = getAllFieldLabels()

  const handleValidationChange = (fieldLabel: string, status: ValidationStatus) => {
    if (status === "unvalidated") {
      // Remove the field from validation results when it's cleared
      setValidationResults((prev) => {
        const newResults = { ...prev }
        delete newResults[fieldLabel]
        return newResults
      })
    } else {
      // Add or update the field validation status
      setValidationResults((prev) => ({
        ...prev,
        [fieldLabel]: status,
      }))
    }
  }

  const handleTableValidationChange = (tableTitle: string, status: ValidationStatus) => {
    if (status === "unvalidated") {
      // Remove the table from validation results when it's cleared
      setTableValidationResults((prev) => {
        const newResults = { ...prev }
        delete newResults[tableTitle]
        return newResults
      })
    } else {
      // Add or update the table validation status
      setTableValidationResults((prev) => ({
        ...prev,
        [tableTitle]: status,
      }))
    }
  }

  // Function to handle clearing all validations (global clear)
  const handleClearValidations = () => {
    setValidationResults({})
    setTableValidationResults({})
  }

  // Check if all fields have been validated (have any status)
  const hasValidationIssues = () => {
    // Count total fields that need validation
    const totalFields = fieldLabels.length + tableLabels.length

    // Count validated fields (fields that have any status)
    const validatedFields = Object.keys(validationResults).length + Object.keys(tableValidationResults).length

    // Return true if not all fields have been validated
    return validatedFields < totalFields
  }

  // Check if the form has been validated (all fields have status)
  const isValidated = () => {
    // Count total fields that need validation
    const totalFields = fieldLabels.length + tableLabels.length

    // Count validated fields
    const validatedFields = Object.keys(validationResults).length + Object.keys(tableValidationResults).length

    // All fields must have been validated (have any status)
    return validatedFields >= totalFields
  }

  // Debug logging to help track the validation state
  useEffect(() => {
    const totalFields = fieldLabels.length + tableLabels.length
    const validatedFields = Object.keys(validationResults).length + Object.keys(tableValidationResults).length

    console.log("Validation Debug:", {
      totalFields,
      validatedFields,
      fieldResults: Object.keys(validationResults),
      tableResults: Object.keys(tableValidationResults),
      isValidated: isValidated(),
      hasValidationIssues: hasValidationIssues(),
    })
  }, [validationResults, tableValidationResults])

  // Handle form submission
  const handleSubmit = () => {
    
    if (!isValidated()) {
      alert("Sila semak semua bahagian borang sebelum menghantar!")
      return
    }

    const newIssues = {
      incorrect: [] as string[],
      missing: [] as string[],
      correct: [] as string[],
    }

    Object.entries(validationResults).forEach(([field, status]) => {
      if (status === "incorrect") newIssues.incorrect.push(field)
      else if (status === "missing") newIssues.missing.push(field)
      else if (status === "correct") newIssues.correct.push(field)
    })

    Object.entries(tableValidationResults).forEach(([table, status]) => {
      if (status === "incorrect") newIssues.incorrect.push(table)
      else if (status === "missing") newIssues.missing.push(table)
      else if (status === "correct") newIssues.correct.push(table)
    })

    setValidationIssues({ incorrect: newIssues.incorrect, missing: newIssues.missing })


    const combinedCorrectFields = [...new Set([...currCorrectFields, ...newIssues.correct])];
    dispatch(setCorrectFields(combinedCorrectFields));   
    const combinedIncorrectFields = [...new Set([...currIncorrectFields, ...newIssues.incorrect])];
    dispatch(setIncorrectFields(combinedIncorrectFields));   
    const combinedMissingFields = [...new Set([...currMissingFields, ...newIssues.missing])];
    dispatch(setMissingFields(combinedMissingFields));   

    const currentFormType = "ppm"; 
    const combinedValidatedBorangId = [...new Set([...currValidatedBorangId, ...[currentFormType]])];
    dispatch(setValidatedBorangId(combinedValidatedBorangId));

    alert("Borang telah disemak dan sedia untuk ditandatangani!")
    window.history.back()
  }

  // Define sections for the form
  const formSections: FormSection[] = [
    {
      id: "credential",
      label: "BUTIR-BUTIR TAULIAH",
      icon: <School className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR TAULIAH"
          fields={credentialInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },
    {
      id: "personal",
      label: "BUTIR-BUTIR PERIBADI",
      icon: <UserRound className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR PERIBADI"
          fields={personalInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },
    {
      id: "occupation",
      label: "BUTIR-BUTIR PEKERJAAN",
      icon: <BriefcaseBusiness className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR PEKERJAAN"
          fields={occupationInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },    
    {
      id: "team",
      label: "BUTIR-BUTIR KUMPULAN",
      icon: <UsersRound className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR KUMPULAN"
          fields={teamInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },
    {
      id: "manikayu",
      label: "BUTIR-BUTIR MANIKAYU",
      icon: <BriefcaseBusiness className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR MANIKAYU"         
          tables={butirManikayu}
          onTableValidationChange={handleTableValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },       
    {
      id: "servicePPM",
      label: "BUTIR-BUTIR PERKHIDMATAN DALAM PERSEKUTUAN PENGAKAP MALAYSIA",
      icon: <Handshake className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR PERKHIDMATAN DALAM PERSEKUTUAN PENGAKAP MALAYSIA"
          extra={
            serviceData.some((item) => item.jawatanKini) && (
              <div className="px-4 py-2 rounded bg-blue-50 text-blue-800 text-sm font-medium border border-blue-200">
                Jawatan Kini Pemohon: <b>{serviceData.find((item) => item.jawatanKini)?.jawatanKini}</b>
              </div>
            )
          }          
          tables={butirPerkidmatanPPM}
          onTableValidationChange={handleTableValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },       
  ]

  return (
    <FormLayout
      title="Borang PPM"
      backLink="/"
      sections={formSections}
      hasValidationIssues={hasValidationIssues()}
      isValidated={isValidated()}
      onSubmit={handleSubmit}
      numberingStyle="alphabetical" // Using Roman numerals for this form
      isOfficer={true}
    />
  )
}

export const getPersonalInfoFromCredentialApplication = async (applicantId: any) => {
  console.log("applicantId in getFUcnion: ",applicantId)
  const { data, error } = await supabase
      .from("credential_application")
      .select(`
        credential_application_id,
        credential_name,
        credential_no_hq,
        credential_date_issued,
        team_id,
        application_status,

        teams:team_id (
          leader_id,
          name,
          team_no,
          register_no,
          register_date,
          team_code,
          unit,

          team_addresses (
            address,
            postcode,
            district,
            state
          )

        ),

        users:applicant_id (
          fullname,
          phone_no,
          email,
          id_no,
          dob,
          title,

          scouts (
            gender,
            race,
            religion,
            marital_status,
            no_ahli,
            no_tauliah,
            birth_place,
            unit
          ),

          user_addresses (
            address,
            postcode,
            district,
            state
          ),

          user_occupation (
            occupation,
            employer_name,
            employer_address,
            employer_postcode,
            employer_district,
            employer_state
          )
        )
      `)
      .eq("applicant_id", applicantId);


  if (error) {
    console.error("Butir peribadi fetch error:", error);
    return null;
  }

  console.log("Butir peribadi data: ", data)

  return data[0];
};

export const mapButirTauliah = (data: any): InfoField[] => {

  const team_addresses = Array.isArray(data?.teams.team_addresses) && data?.teams.team_addresses.length > 0 ? data?.teams.team_addresses[0] : {};

  return [
    { id: "jenisTauliah", label: "Jenis Tauliah", value: data.credential_name, rowId: "row1", width: "full" },

    { id: "daerahTauliah", label: "Daerah", value: team_addresses.district, rowId: "row2", width: "half" },
    { id: "negeriTauliah", label: "Negeri", value: team_addresses.state, rowId: "row2", width: "half" },    
  ]
}

export const mapButirPeribadi = (data: any): InfoField[] => {
  
  console.log("data in mapApplicationToPersonalFields: ", data);
  
  const user = data?.users || {};
  const scout = Array.isArray(user.scouts) && user.scouts.length > 0 ? user.scouts[0] : {};
  const address = Array.isArray(user.user_addresses) && user.user_addresses.length > 0 ? user.user_addresses[0] : {};

  const ageAndDob = calculateAgeFromIC(user.id_no); 

  return [
    { id: "namaPenuh", label: "Nama Penuhhh", value: user.fullname || "-", rowId: "row1", required: true },

    { id: "nokadAhli", label: "No. Kad Keahlian", value: scout.no_ahli || "-", rowId: "row2", required: true },
    { id: "noIC", label: "No. Kad Pengenalan", value: formatIcNO(user.id_no) || "-", rowId: "row2", required: true },

    { id: "kaum", label: "Kaum", value: scout.race || "-", rowId: "row3", width:"third"},
    { id: "agama", label: "Agama", value: scout.religion || "-", rowId: "row3", width:"third" },
    { id: "tarikhLahir", label: "Tarikh Lahir", value: ageAndDob.dob || "-", rowId: "row3", width:"third"},


    { id: "alamatPemohon", label: "Alamat Kediaman", value: address.address || "-", rowId: "row6", width: "full", required: true },

    { id: "poskodPemohon", label: "Poskod", value: address.postcode || "-", rowId: "row7", required: true },
    { id: "daerahPemohon", label: "Daerah", value: address.district || "-", rowId: "row7", required: true },
    { id: "negeriPemohon", label: "Negeri", value: address.state || "-", rowId: "row7", required: true },
  ];
};

export const mapButirKumpulan = (data: any): InfoField[] => {

  const teams = data?.teams || {};
  const team_addresses = Array.isArray(data?.teams.team_addresses) && data?.teams.team_addresses.length > 0 ? data?.teams.team_addresses[0] : {};

  console.log("teams: ",teams);
  console.log("team address: ",team_addresses.address);

  return [
    { id: "noKumpulan", label: "No. Kumpulan", value: teams.team_no, rowId: "row1", width: "half" },
    { id: "noDaftarKump", label: "No. Pendaftaran", value: teams.register_no, rowId: "row1", width: "half" },

    { id: "alamatKump", label: "Alamat", value: team_addresses.address, rowId: "row2", width: "full" },

    { id: "poskodKump", label: "Poskod", value: team_addresses.postcode, rowId: "row3", width: "third" },
    { id: "daerahKump", label: "Daerah", value: team_addresses.district, rowId: "row3", width: "third" },
    { id: "negeriKump", label: "Negeri", value: team_addresses.state, rowId: "row3", width: "third" },    
  ]
}

export const mapButirPekerjaan = (data: any): InfoField[] => {

  const occupation = Array.isArray(data?.users.user_occupation) && data?.users.user_occupation.length > 0 ? data?.users.user_occupation[0] : {};

  return [
    { id: "jawatanHakiki", label: "Jawatan Hakiki", value: occupation.occupation, rowId: "row1", width: "full" },

    { id: "namaMajikan", label: "Nama Majikan", value: occupation.employer_name, rowId: "row2", width: "full" },

    { id: "alamatMajikan", label: "Alamat Majikan", value: occupation.employer_address, rowId: "row3", width: "full" },
    
    { id: "poskodMajikan", label: "Poskod", value: occupation.employer_postcode || "-", rowId: "row4", width:"third"},
    { id: "daerahMajikan", label: "Daerah", value: occupation.employer_district || "-", rowId: "row4", width:"third" },
    { id: "negeriMajikan", label: "Negeri", value: occupation.employer_state || "-", rowId: "row4", width:"third"},
  ]
}

export const mapButirPengakuan = (data: any): InfoField[] => {

  const declarationText = `SAYA SESUNGGUHNYA MENGAKU BAHAWA SEMUA KETERANGAN YANG TELAH SAYA BERIKAN DI DALAM BORANG INI ADALAH BENAR DAN BETUL. SAYA MEMAHAMI BAHAWA SEKIRANYA ADA DIANTARA MAKLUMAT-MAKLUMAT ITU DIDAPATI PALSU, MAKA PIHAK PERSEKUTUAN PENGAKAP MALAYSIA BERHAK MENARIK BALIK TAULIAH YANG DIBERIKAN DAN PERKHIDMATAN SAYA AKAN DITAMATKAN DENGAN SERTA MERTA.`

  return [
    { id: "pengakuan", label: "Pengakuan", value: declarationText, rowId: "row1", width:"full", hideValidationButtons: true, },
    { id: "tandatangan", label: "Tandatangan", value: "Dimuat naik pada 12/03/2023", rowId: "row2", width:'half' },
    { id: "tarikh", label: "Tarikh", value: "Dimuat naik pada 15/03/2023", rowId: "row2", width:'half' },
  ]
}