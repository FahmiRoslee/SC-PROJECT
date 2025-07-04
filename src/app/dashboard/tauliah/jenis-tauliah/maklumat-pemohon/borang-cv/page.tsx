'use client'

import { Akademik } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-akademik-DT/columns"
import { getDataAPI as getAcademicDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-akademik-DT/DataFetching"
import { Anugerah } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-anugerah-DT/columns"
import { getDataAPI as  getAwardDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-anugerah-DT/DataFetching"
import { Perkhidmatan } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-perkhidmatan-DT/columns"
import { getDataAPI as getServiceDataAPI } from "@components/components/data-table/maklumatPeribadi-DT/pengakap-perkhidmatan-DT/DataFetching"
import { calculateAgeFromIC, formatIcNO, getCachedUser } from "@components/lib/utils"
import { useCallback, useEffect, useState } from "react"  

import { PersonalInfoCard, type ValidationStatus, InfoField } from "@components/components/maklumatPeribadi-component/personalInfoCard"
import { FormLayout, type FormSection } from "@components/components/tauliah-component/borangLayout"
import { FileText, School, BriefcaseBusiness, UsersRound, UserRound, Handshake, Crown } from "lucide-react"
import { supabase } from "@components/lib/supabaseClient"
import { Button } from "@components/components/ui/button"
import { setCorrectFields, setIncorrectFields, setMissingFields, setValidatedBorangId } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@components/lib/store"


  // Sample documents data
  const documentFields = [
    { label: "Kad Keahlian", value: "Dimuat naik pada 12/03/2023", rowId: "doc1", required: true },
    { label: "Salinan Kad Pengenalan", value: "Dimuat naik pada 12/03/2023", rowId: "doc1", required: true },
    { label: "Sijil Lencana", value: "Dimuat naik pada 15/03/2023", rowId: "doc2", required: true },
    { label: "Gambar Berpakaian Seragam", value: "Dimuat naik pada 12/03/2023", rowId: "doc2", required: true },
  ]



export default function BorangPPM() {

  const dispatch = useDispatch();
  const applicant_id = useSelector((state: RootState) => state.penilaianTauliah.applicantId);
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

  const [personalInfo, setPersonalInfo] = useState<InfoField[]>([]);
  const [familyInfo, setFamilyInfo] = useState<InfoField[]>([]);
  const [academicData, setAcademicData] = useState<Akademik[]>([]);
  const [occupationInfo, setOccupationInfo] = useState<InfoField[]>([]);
  const [serviceData, setServiceData] = useState<Perkhidmatan[]>([]);
  const [awardPPData, setAwardPPMData] = useState<Anugerah[]>([]);
  const [awardNonPPData, setAwardNonPPMData] = useState<Anugerah[]>([]);  
  const [declarationInfo, setDeclarationInfo] = useState<InfoField[]>([]);

    
  const butirAkademik = [
    {
      id: "butirAkademik",
      title: "",
      columns: [
          { header: "Nama Institusi", accessor: "namaInstitusi" },
          { header: "Tahun Masuk", accessor: "tahunMasuk" },
          { header: "Tahun Keluar", accessor: "tahunKeluar" },
          { header: "Pencapaian Akademik", accessor: "pencapaian" },
      ],
      data: academicData, 
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
    

  const butirAnugerah = [
    {
      id: "butirAnugerahPPM", 
      title: "ANUGERAH DARIPADA PERSEKUTUAN PENGAKAP MALAYSIA",
      columns: [
          { header: "Nama Anugerah", accessor: "namaAnugerah" },
          { header: "Peringkat", accessor: "peringkat" },
          { header: "Tahun", accessor: "tahun" },
      ],
      data: awardPPData, 
      },    
      {
        id: "butirPerkhidmatanNonPPM", 
        title: "ANUGERAH KEPENGAKAPAN DARIPADA NEGARA LUAR",
        columns: [
            { header: "Nama Anugerah", accessor: "namaAnugerah" },
            { header: "Peringkat", accessor: "peringkat" },
            { header: "Tahun", accessor: "tahun" },
        ],
        data: awardNonPPData, 
    },    
  ]
    
  useEffect(() => {
    const fetchData = async () => {
      const user = await getCachedUser();
      if (!user) return;

      const data = await getPersonalInfoFromCredentialApplication(applicant_id);          
        
      const mappedPersonalInfo = mapButirPeribadi(data);
      const mappedFamilyInfo = mapButirKelaurga(data);   
      const academic = await getAcademicDataAPI(applicant_id);
      const mappedOccupationInfo = mapButirPekerjaan(data);
      const serviceData = await getServiceDataAPI(applicant_id);
      const awardsPPM = await getAwardDataAPI(applicant_id, "PPM");
      const awardsNonPPM = await getAwardDataAPI(applicant_id, "nonPPM");
      const mappedButirPengakuan = mapButirPengakuan(data);

      setPersonalInfo(mappedPersonalInfo);
      setFamilyInfo(mappedFamilyInfo);
      setAcademicData(academic);
      setOccupationInfo(mappedOccupationInfo);
      setServiceData(serviceData);
      setAwardPPMData(awardsPPM);
      setAwardNonPPMData(awardsNonPPM);      
      setDeclarationInfo(mappedButirPengakuan);
    };

    fetchData();
  }, []); 
     
  // Get all field labels for validation tracking
  const getAllFieldLabels = () => {
    const fieldLabels = [
      ...personalInfo.map((field) => field.id),
      ...familyInfo.map((field) => field.id),
      ...occupationInfo.map((field) => field.id),
      ...declarationInfo.map((field) => field.id),
    ]
    const tableLabels = [
      ...butirAkademik.map((table) => table.id), 
      ...butirPerkidmatanPPM.map((table) => table.id),
      ...butirAnugerah.map((table) => table.id),
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

    // --- Start of Merging Logic ---

    const combinedCorrectFields = [...new Set([...currCorrectFields, ...newIssues.correct])];
    dispatch(setCorrectFields(combinedCorrectFields));   
    const combinedIncorrectFields = [...new Set([...currIncorrectFields, ...newIssues.incorrect])];
    dispatch(setIncorrectFields(combinedIncorrectFields));   
    const combinedMissingFields = [...new Set([...currMissingFields, ...newIssues.missing])];
    dispatch(setMissingFields(combinedMissingFields));  
        
    let existingFormStatus = null;
    const localStorageKey = "borangTauliah";

    // 1. Retrieve existing data from localStorage safely
    const existingFormStatusString = localStorage.getItem(localStorageKey);

    if (existingFormStatusString) {
      try {
        existingFormStatus = JSON.parse(existingFormStatusString);
      } catch (e) {
        console.error("Error parsing existing localStorage data. Starting fresh.", e);
        existingFormStatus = null; 
      }
    }

    const newIdsForThisSubmission = [];
    const currentFormType = "cv"; 
    if (currentFormType === "cv") {
      newIdsForThisSubmission.push("cv");
    }

    const uniqueNewIdsForThisSubmission = [...new Set(newIdsForThisSubmission)];
    const combinedValidatedBorangId = [...new Set([...currValidatedBorangId, ...[currentFormType]])];
    dispatch(setValidatedBorangId(combinedValidatedBorangId));
    // --- End of dynamic ID determination ---


    // 2. Prepare the final formStatus object
    const finalFormStatus = {
      id: [] as string[], // Always initialize 'id' as an empty array
      status: "telah-disemak", // Status is the latest for the current action
      completedAt: new Date().toISOString(), // Timestamp is always the latest
      validationIssues: {
        incorrect: [],
        missing: [],
      },
      correctFields: [],
    };

    // 3. Merge data (including 'id' array)
    if (existingFormStatus) {
      // Merge 'id': Ensure existing 'id' is an array, combine with new, and deduplicate
      const existingIdsAsArray = Array.isArray(existingFormStatus.id)
                                  ? existingFormStatus.id
                                  : (existingFormStatus.id ? [existingFormStatus.id] : []); // Handle if old 'id' was a single string

      finalFormStatus.id = [...new Set([...existingIdsAsArray, ...uniqueNewIdsForThisSubmission])];

      // Merge 'incorrect' issues (deduplicate)
      finalFormStatus.validationIssues.incorrect = [
        ...new Set([
          ...(Array.isArray(existingFormStatus.validationIssues?.incorrect) ? existingFormStatus.validationIssues.incorrect : []),
          ...newIssues.incorrect
        ])
      ];

      // Merge 'missing' issues (deduplicate)
      finalFormStatus.validationIssues.missing = [
        ...new Set([
          ...(Array.isArray(existingFormStatus.validationIssues?.missing) ? existingFormStatus.validationIssues.missing : []),
          ...newIssues.missing
        ])
      ];

      // Merge 'correctFields' (deduplicate)
      finalFormStatus.correctFields = [
        ...new Set([
          ...(Array.isArray(existingFormStatus.correctFields) ? existingFormStatus.correctFields : []),
          ...newIssues.correct
        ])
      ];

    } else {
      // If no existing data, initialize with current submission data
      finalFormStatus.id = [...new Set(uniqueNewIdsForThisSubmission)];
      finalFormStatus.validationIssues.incorrect = newIssues.incorrect;
      finalFormStatus.validationIssues.missing = newIssues.missing;
      finalFormStatus.correctFields = newIssues.correct;
    }

    // --- End of Merging Logic ---

    localStorage.setItem(localStorageKey, JSON.stringify(finalFormStatus));
    console.log("Saved to localStorage:", finalFormStatus);

    alert("Borang telah disemak dan sedia untuk ditandatangani!")
    window.history.back()
  }


  const handleClearLocalStorage = useCallback(() => {
    const confirmClear = confirm("Are you sure you want to clear all form validation data? This cannot be undone.");
    if (confirmClear) {
      localStorage.removeItem("borangTauliah");
      // Optionally, reset component states to reflect the cleared storage
      setValidationResults({});
      setTableValidationResults({});
      setValidationIssues({ incorrect: [], missing: [] });
      alert("Form validation data cleared from localStorage.");
      window.location.reload(); // Reload to reflect fresh state
    }
  }, []);

  // Define sections for the form
  const formSections: FormSection[] = [
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
      id: "maritalStatus",
      label: "BUTIR-BUTIR KELUARGA",
      icon: <UsersRound className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR KELUARGA"
          fields={familyInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },
    {
      id: "academic",
      label: "BUTIR-BUTIR AKADEMIK",
      icon: <School className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR AKADEMIK"
          tables={butirAkademik}
          onTableValidationChange={handleTableValidationChange}
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
    {
      id: "award",
      label: "BUTIR-BUTIR ANUGERAH",
      icon: <Crown className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="BUTIR-BUTIR ANUGERAH"
          tables={butirAnugerah}
          onTableValidationChange={handleTableValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },    
    {
      id: "documents",
      label: "DOKUMEN SOKONGAN",
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
      content: (
        <PersonalInfoCard
          title="DOKUMEN YANG TELAH DIMUAT NAIK"
          fields={declarationInfo}
          onValidationChange={handleValidationChange}
          editable={true}
          className="border-0 shadow-none"
        />
      ),
    },
  ]

  return (
    <>
              <Button
            variant="destructive" // Example variant, adjust as needed
            onClick={handleClearLocalStorage}
          >
            Clear All Validation Data
          </Button>

    <FormLayout
      title="Borang CV"
      backLink="/"
      sections={formSections}
      hasValidationIssues={hasValidationIssues()}
      isValidated={isValidated()}
      onSubmit={handleSubmit}
      isOfficer={true}
    />          
    </>

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


export const mapButirPeribadi = (data: any): InfoField[] => {
  
  console.log("data in mapApplicationToPersonalFields: ", data);
  
  const user = data?.users || {};
  const scout = Array.isArray(user.scouts) && user.scouts.length > 0 ? user.scouts[0] : {};
  const address = Array.isArray(user.user_addresses) && user.user_addresses.length > 0 ? user.user_addresses[0] : {};

  const ageAndDob = calculateAgeFromIC(user.id_no); 

  return [
    {  id: "namaPenuh", label: "Nama Penuh", value: user.fullname || "-", rowId: "row1", required: true },
    {   id: "pangkat", label: "Pangkat", value: scout.rank || "-", rowId: "row1" },

    {   id: "noKadAhli", label: "No. Kad Keahlian", value: scout.no_ahli || "-", rowId: "row2", required: true },
    {   id: "noIC", label: "No. Kad Pengenalan", value: formatIcNO(user.id_no) || "-", rowId: "row2", required: true },
    {   id: "email", label: "Email", value: user.email || "-", rowId: "row2", required: true },

    {   id: "noTel", label: "No. Telefon", value: user.phone_no || "-", rowId: "row3", required: true },
    {   id: "jantina", label: "Jantina", value: scout.gender || "-", rowId: "row3", required: true },
    {   id: "kaum", label: "Kaum", value: scout.race || "-", rowId: "row3" },

    {   id: "agama", label: "Agama", value: scout.religion || "-", rowId: "row4" },
    {   id: "tarikhLahir", label: "Tarikh Lahir", value: ageAndDob.dob || "-", rowId: "row4", required: true },
    {   id: "umur", label: "Umur", value: ageAndDob.age, rowId: "row4" },

    {   id: "tempatLahir", label: "Tempat Lahir", value: scout.birth_place || "-", rowId: "row5", width: "full" },

    {   id: "alamatPemohon", label: "Alamat Kediaman", value: address.address || "-", rowId: "row6", width: "full", required: true },

    {   id: "poskodPemohon", label: "Poskod", value: address.postcode || "-", rowId: "row7", required: true },
    {   id: "daerahPemohon", label: "Daerah", value: address.district || "-", rowId: "row7", required: true },
    {   id: "negeriPemohon", label: "Negeri", value: address.state || "-", rowId: "row7", required: true },
  ];
};

export const mapButirPekerjaan = (data: any): InfoField[] => {

  const occupation = Array.isArray(data?.users.user_occupation) && data?.users.user_occupation.length > 0 ? data?.users.user_occupation[0] : {};

  return [
    // Row 1: 1 field (full width)
    {   id: "jawatanHakiki", label: "Jawatan Hakiki", value: occupation.occupation, rowId: "row1", width: "full" },

    // Row 2: 1 field (full width)
    {   id: "namaMajikan", label: "Nama Majikan", value: occupation.employer_name, rowId: "row2", width: "full" },

    // Row 3: 1 field (full width)
    {   id: "alamatMajikan", label: "Alamat Majikan", value: occupation.employer_address, rowId: "row3", width: "full" },

    // Row 4: 3 fields
    {   id: "poskodMajikan", label: "Poskod", value: occupation.employer_postcode, rowId: "row4" },
    {   id: "daerahMajikan", label: "Daerah", value: occupation.employer_district, rowId: "row4" },
    {   id: "negeriMajikan", label: "Negeri", value: occupation.employer_state, rowId: "row4" },    
  ]
}

export const mapButirKelaurga = (data: any): InfoField[] => {

  const family = Array.isArray(data?.users.scouts) && data?.users.scouts.length > 0 ? data?.users.scouts[0] : {};

  return [
    // Row 1: 1 field (full width)
    {   id: "statusKahwin", label: "Status Perkahwinan", value: family.marital_status || "-", rowId: "row1", width:"full" },
  ]
}

export const mapButirPengakuan = (data: any): InfoField[] => {

  const declarationText = `SAYA SESUNGGUHNYA MENGAKU BAHAWA SEMUA KETERANGAN YANG TELAH SAYA BERIKAN DI DALAM BORANG INI ADALAH BENAR DAN BETUL. SAYA MEMAHAMI BAHAWA SEKIRANYA ADA DIANTARA MAKLUMAT-MAKLUMAT ITU DIDAPATI PALSU, MAKA PIHAK PERSEKUTUAN PENGAKAP MALAYSIA BERHAK MENARIK BALIK TAULIAH YANG DIBERIKAN DAN PERKHIDMATAN SAYA AKAN DITAMATKAN DENGAN SERTA MERTA.`

  return [
    // Row 1: 1 field (full width)
    {   id: "pengakuan", label: "Pengakuan", value: declarationText, rowId: "row1", width:"full", hideValidationButtons: true, },
    {   id: "tandatangan", label: "Tandatangan", value: "Dimuat naik pada 12/03/2023", rowId: "row2", width:'half' },
    {   id: "tarikhPengakuan", label: "Tarikh", value: "Dimuat naik pada 15/03/2023", rowId: "row2", width:'half' },
  ]
}