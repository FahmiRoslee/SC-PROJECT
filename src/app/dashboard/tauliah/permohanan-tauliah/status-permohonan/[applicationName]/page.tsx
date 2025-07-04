// page.tsx
"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'

import { Button } from "@components/components/ui/button"
import { Card, CardContent } from "@components/components/ui/card"
import { FileText, CheckCircle, XCircle, FileCheck, FileX, User, Clock, AlertTriangle, Info } from "lucide-react"

import { formatApplicationLevel } from "@components/lib/utils"
import { supabase } from "@components/lib/supabaseClient"

// Define the fields for each borang type
const BORANG_PPM_FIELDS = [
  "jenisTauliah", "daerahTauliah", "negeriTauliah", "namaPenuh", "nokadAhli", "noIC", "kaum", "agama", "tarikhLahir",
  "alamatPemohon", "poskodPemohon", "daerahPemohon", "negeriPemohon", "noKumpulan", "noDaftarKump", "alamatKump",
  "poskodKump", "daerahKump", "negeriKump", "jawatanHakiki", "namaMajikan", "alamatMajikan", "poskodMajikan",
  "daerahMajikan", "negeriMajikan", "pengakuan", "tandatangan", "butirManikayu", "butirPerkhidmatan"
];

const BORANG_CV_FIELDS = [
  "namaPenuh", "pangkat", "nokadAhli", "noIC", "email", "noTel", "jantina", "kaum", "agama", "tarikhLahir", "umur",
  "tempatLahir", "alamatPemohon", "poskodPemohon", "daerahPemohon", "negeriPemohon", "jawatanHakiki", "namaMajikan",
  "alamatMajikan", "poskodMajikan", "daerahMajikan", "negeriMajikan", "statusKahwin", "butirPerkhidmatanNonPPM",
  "butirAnugerahPPM", "butirPerkhidmatan", "butirAkademik"
];

const BORANG_DOCUMENT_FIELDS = [
  "doc_sijilManikayu", "doc_salinanIC", "doc_kadAhli"
];

// Define the structure for your application data based on your Supabase table
interface Application {
  credential_application_id: string;
  credential_name: string;
  created_at: string;
  credential_date_issued: string | null;
  application_level: string;
  application_status: "lulus" | "ditolak" | "menunggu" | "muted";

  officer_id: {
    fullname: string;
    rank: string; 
    profile_pic: string;

  };

  // Add new fields for remarks from Supabase
  incorrect_remarks: string[] | null; // Assuming this is an array of strings
  missing_remarks: string[] | null;   // Assuming this is an array of strings
  correct_remarks: string[] | null;   // Assuming this is an array of strings (for reference)
  // The 'documents' property is no longer part of the fetched Application interface,
  // as it will be derived dynamically for display.
}

// Define interface for derived Borang data
interface DerivedBorang {
  name: string;
  status: "lulus" | "ditolak" | "menunggu" | "muted";
  updatedDate: string | null;
  issues: {
    incorrect: string[];
    missing: string[];
  };
}


interface ApplicationStatusPageProps {
  params: {
    applicationName: string;
  };
}

// Helper function to format field names for display
const formatFieldName = (fieldName: string): string => {
  const displayNames: { [key: string]: string } = {
    nokadAhli: "No Kad Ahli",
    noIC: "No Kad Pengenalan",
    noTel: "No Telefon",
    tarikhLahir: "Tarikh Lahir",
    alamatPemohon: "Alamat Pemohon",
    poskodPemohon: "Poskod Pemohon",
    daerahPemohon: "Daerah Pemohon",
    negeriPemohon: "Negeri Pemohon",
    noKumpulan: "No Kumpulan",
    noDaftarKump: "No Daftar Kumpulan",
    alamatKump: "Alamat Kumpulan",
    poskodKump: "Poskod Kumpulan",
    daerahKump: "Daerah Kumpulan",
    negeriKump: "Negeri Kumpulan",
    jawatanHakiki: "Jawatan Hakiki",
    namaMajikan: "Nama Majikan",
    alamatMajikan: "Alamat Majikan",
    poskodMajikan: "Poskod Majikan",
    daerahMajikan: "Daerah Majikan",
    negeriMajikan: "Negeri Majikan",
    butirManikayu: "Butir Manikayu",
    butirPerkhidmatan: "Butir Perkhidmatan",
    butirAnugerahPPM: "Butir Anugerah PPM",
    butirPerkhidmatanNonPPM: "Butir Perkhidmatan Bukan PPM",
    butirAkademik: "Butir Akademik",
    doc_sijilManikayu: "Sijil Manikayu",
    doc_salinanIC: "Salinan Kad Pengenalan",
    doc_kadAhli: "Kad Ahli",
    jenisTauliah: "Jenis Tauliah",
    daerahTauliah: "Daerah Tauliah",
    negeriTauliah: "Negeri Tauliah",
    namaPenuh: "Nama Penuh",
    pangkat: "Pangkat",
    email: "Email",
    jantina: "Jantina",
    kaum: "Kaum",
    agama: "Agama",
    umur: "Umur",
    tempatLahir: "Tempat Lahir",
    pengakuan: "Pengakuan",
    tandatangan: "Tandatangan",
    statusKahwin: "Status Perkahwinan",
  };

  // Return mapped name or format if not found
  return displayNames[fieldName] || fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
};


export default function ApplicationStatus({ params }: ApplicationStatusPageProps) {
    const decodedApplicationName = decodeURIComponent(params.applicationName);
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const router = useRouter()


  // Define the fixed order of levels for the stepper
  const LEVEL_ORDER = [
    "Peringkat Pemimpin Kumpulan",
    "Peringkat Daerah",
    "Peringkat Negeri",
    // "Peringkat Kebangsaan"
  ];

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('credential_application')
          .select(`
            credential_application_id,
            credential_name,
            created_at,
            credential_date_issued,
            application_level,
            application_status,
            correct_remarks,
            incorrect_remarks,
            missing_remarks,

            users:officer_id ( 
              fullname,
              scouts (
                profile_pic
              ),

              user_service (
                position,
                level,
                year_end
              )
            )
          `)
          .eq("applicant_id", "264eb21d-4338-408d-a8a2-c86affebe0b4")
          .eq("credential_name", decodedApplicationName)
        //   .eq("credential_name", "Pesuruhjaya Daerah")
          .order('credential_application_id', { ascending: true })

        if (error) {
          throw error
        }

        console.log("pemohon form:", data);
        // console.log("pemohon error:", error); // Error will be null if no error, so this might not be useful

        // Transform the fetched data to match the Application interface, especially for officer_id
        const transformedData: Application[] = data.map((item: any) => {
          
          // Find the current service record where year_end === 'Kini'
          const currentService = item.users?.user_service?.find(
            (service: any) => service.year_end === 'Kini'
          );

          return {
            credential_application_id: item.credential_application_id,
            credential_name: item.credential_name,
            created_at: item.created_at,
            credential_date_issued: item.credential_date_issued,
            application_level: formatApplicationLevel(item.application_level), // Ensure application_level is formatted
            application_status: item.application_status,
            correct_remarks: item.correct_remarks || [],
            incorrect_remarks: item.incorrect_remarks || [],
            missing_remarks: item.missing_remarks || [],
            officer_id: {
              fullname: item.users?.fullname || "N/A",
              rank: currentService
                ? `${currentService.position} ${currentService.level}`
                : "-",
              profile_pic: item.users?.scouts?.profile_pic || "/placeholder.svg",
            },
            // 'documents' is intentionally removed from here as it's derived by getDerivedBorangData
          };
        });


        console.log("transformedData form:", transformedData);
        
        setApplications(transformedData)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Helper function to derive borang status and issues based on remarks
const getDerivedBorangData = (app: Application): DerivedBorang[] => {
  const borangTypes = [
    { name: "Borang PPM", fields: BORANG_PPM_FIELDS },
    { name: "Borang CV", fields: BORANG_CV_FIELDS },
    { name: "Borang Dokumen", fields: BORANG_DOCUMENT_FIELDS },
  ];

  return borangTypes.map(borangType => {
    // If status is 'menunggu', return status = "menunggu" and empty issues
    if (app.application_status === "menunggu") {
      return {
        name: borangType.name,
        status: "menunggu",
        updatedDate: app.credential_date_issued,
        issues: {
          incorrect: [],
          missing: [],
        },
      };
    }

    const incorrectIssues = (app.incorrect_remarks || []).filter(remark =>
      borangType.fields.includes(remark)
    );
    const missingIssues = (app.missing_remarks || []).filter(remark =>
      borangType.fields.includes(remark)
    );

    const hasIssues = incorrectIssues.length > 0 || missingIssues.length > 0;
    const status = hasIssues ? "ditolak" : "lulus";

    return {
      name: borangType.name,
      status: status,
      updatedDate: app.credential_date_issued,
      issues: {
        incorrect: incorrectIssues,
        missing: missingIssues,
      },
    };
  });
};


  // Group applications by type to show progression
  const groupedApplications = applications.reduce(
    (acc, app) => {
      const key = app.credential_name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(app)
      return acc
    },
    {} as Record<string, Application[]>,
  )

  // Function to scroll to a specific card
  const scrollToCard = (index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Function to get stepper data for each application type
  const getStepperData = (apps: Application[]) => {
    let encounteredNonLulus = false; // Flag to track if we've hit a 'ditolak' or 'menunggu' status

    return LEVEL_ORDER.map((levelName) => {
      const appForLevel = apps.find((app) => app.application_level === levelName);

      let status: "lulus" | "ditolak" | "menunggu" | "muted" = "muted";
      let applicationData: Application | undefined = undefined;

      if (appForLevel) {
        status = appForLevel.application_status;
        applicationData = appForLevel;
      }

      // Apply muting logic:
      // If we've already encountered a 'ditolak' or 'menunggu' status,
      // and the current step is not explicitly defined (i.e., appForLevel is null)
      // or its status is 'lulus' (which means it's a future step that hasn't been reached),
      // then it should be muted.
      if (encounteredNonLulus) {
        if (!appForLevel || status === "lulus") { // If no application for this level, or it's 'lulus' (meaning it should have been muted if an earlier step was ditolak/menunggu)
          status = "muted";
        }
      }

      // Update the flag for the next iteration
      if (status === "ditolak" || status === "menunggu") {
        encounteredNonLulus = true;
      }
      // If a step is explicitly 'lulus', it should not cause future steps to be muted unless
      // a subsequent 'ditolak' or 'menunggu' is encountered. This is implicitly handled by `encounteredNonLulus`.

      return {
        levelName: levelName,
        application_status: status,
        application_level: levelName,
        isActive: status === "menunggu",
        isCompleted: status === "lulus",
        isRejected: status === "ditolak",
        isMuted: status === "muted",
        credential_application_id: applicationData?.credential_application_id || '',
        credential_name: applicationData?.credential_name || '',
      };
    });
  };

  // Function to get issue styling and icon - (kept as is from your original code, though mostly replaced by new design)
  const getIssueStyle = (type: string) => {
    switch (type) {
      case "tidak_lengkap":
        return {
          className: "bg-red-100 text-red-800 border border-red-200",
          icon: <XCircle className="h-3 w-3" />,
        }
      case "maklumat_salah":
        return {
          className: "bg-orange-100 text-orange-800 border border-orange-200",
          icon: <AlertTriangle className="h-3 w-3" />,
        }
      case "maklumat_kurang":
        return {
          className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          icon: <Info className="h-3 w-3" />,
        }
      default:
        return {
          className: "bg-gray-100 text-gray-800 border border-gray-200",
          icon: <Info className="h-3 w-3" />,
        }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Status Permohonan</h1>
        <p className="text-gray-600">Lihat status semua permohonan tauliah anda</p>
      </div>

      {Object.keys(groupedApplications).length === 0 ? (
        // if no application
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Permohonan</h3>
            <p className="text-gray-600 mb-4">Anda belum membuat sebarang permohonan tauliah.</p>
            <Button onClick={() =>console.log()}>Mula Permohonan Baharu</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedApplications).map(([applicationType, apps], groupIndex) => {
            const stepperData = getStepperData(apps)
            console.log("stepperData: ", stepperData);
            const cardIndex = 0

            return (
              <div key={applicationType} className="space-y-6">
                {/* Application Type Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{applicationType}</h2>
                  <p className="text-gray-600">Progres kelulusan peringkat demi peringkat</p>
                </div>

                {/* Enhanced Stepper Navigation */}
<div className="bg-white rounded-lg shadow-sm border border-gray-300 px-6 py-6 mb-8">
  <div className="relative">
    {/* Background base line with gaps before/after nodes */}
    <div
      className="absolute top-6 h-0.5 bg-gray-200 z-0"
      style={{
        left: `calc(6% + 24px)`, // space from the first node center
        right: `calc(6% + 24px)` // space before the last node
      }}
    />

    {/* Green progress line with the same gaps at both ends */}
    <div
      className="absolute top-6 h-0.5 bg-green-500 transition-all duration-500 z-10"
      style={{
        left: `calc(6% + 24px)`,
        width: `calc(${(stepperData.filter((step) => step.isCompleted).length - 0.5) / (stepperData.length - 1) * 100}% - 48px)`
      }}
    />

    <div className="relative flex justify-between">
      {stepperData.map((step, index) => (
        <div key={step.levelName} className="flex flex-col items-center group z-20">
          <button
            onClick={() => scrollToCard(groupIndex * 10 + index)}
            disabled={step.isMuted}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 z-10 ${
              step.isMuted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : step.isActive
                ? "bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 animate-pulse"
                : step.isCompleted
                ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
                : step.isRejected
                ? "bg-red-500 text-white hover:bg-red-600 hover:scale-105"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {step.isMuted ? (
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
            ) : step.isActive ? (
              <Clock className="h-6 w-6" />
            ) : step.isCompleted ? (
              <CheckCircle className="h-6 w-6" />
            ) : step.isRejected ? (
              <XCircle className="h-6 w-6" />
            ) : (
              <div className="w-3 h-3 bg-gray-600 rounded-full" />
            )}
          </button>

          {/* Level name */}
          <div className="mt-3 text-center max-w-32">
            <span
              className={`block text-xs font-medium transition-all duration-300 ${
                step.isMuted
                  ? "text-gray-400"
                  : step.isActive
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700 group-hover:text-blue-600"
              }`}
            >
              {step.levelName}
            </span>
          </div>

          {/* Status tag */}
          <div className="mt-2">
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                step.isMuted
                  ? "bg-gray-100 text-gray-400"
                  : step.isActive
                  ? "bg-yellow-100 text-yellow-700"
                  : step.isCompleted
                  ? "bg-green-100 text-green-700"
                  : step.isRejected
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {step.isMuted
                ? "Belum Mula"
                : step.isActive
                ? "Sedang Diproses"
                : step.isCompleted
                ? "Lulus"
                : step.isRejected
                ? "Ditolak"
                : "Belum Mula"}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
              


                {/* Application Cards */}
                <div className="space-y-6">
                  {apps.map((app, index) => {
                    const currentCardIndex = groupIndex * 10 + index
                    const derivedBorangs = getDerivedBorangData(app); // Get derived borang data

                    return (
                      <div key={app.credential_application_id} ref={(el) => (cardRefs.current[currentCardIndex] = el)}>
                        
                        {/* CARD COLOR */}
                        <Card
                          className={`shadow-sm transition-all ${
                            app.application_status === "muted"
                              ? "opacity-50 bg-gray-50 border-gray-200"
                              : app.application_status === "menunggu"
                                ? "border-2 border-blue-400 shadow-md"
                                : app.application_status === "lulus"
                                  ? "border-green-200 hover:shadow-md"
                                  : app.application_status === "ditolak"
                                    ? "border-red-200 hover:shadow-md"
                                    : "border-gray-200 hover:shadow-md"
                          }`}
                        >
                          <CardContent className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                              
                              {/* CARD ICON STATUS */}
                              <div className="flex items-center space-x-4">
                                {app.application_status === "muted" ? (
                                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                                ) : app.application_status === "menunggu" ? (
                                  <Clock className="w-5 h-5 text-yellow-500" />
                                ) : app.application_status === "lulus" ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : app.application_status === "ditolak" ? (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                ) : (
                                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                                )}

                                {/* APPLICATION LEVEL, ID*/}
                                <div>
                                  <h3
                                    className={`font-semibold ${
                                      app.application_status === "muted" ? "text-gray-400" : "text-gray-900"
                                    }`}
                                  >
                                    {app.application_level}{" "}
                                  </h3>
                                  <p
                                    className={`text-sm ${app.application_status === "muted" ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    ID: {app.credential_application_id}
                                  </p>
                                </div>
                              </div>

                              {/* APPLICATION STATUS */}
                              <div className="text-right">
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                    app.application_status === "muted"
                                      ? "bg-gray-200 text-gray-500"
                                      : app.application_status === "menunggu"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : app.application_status === "lulus"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {app.application_status === "muted"
                                    ? "Belum Mula"
                                    : app.application_status === "menunggu"
                                      ? "Sedang Diproses"
                                      : app.application_status === "lulus"
                                        ? "Diluluskan"
                                        : app.application_status === "ditolak"
                                          ? "Ditolak"
                                          : "Belum Mula"}
                                </span>

                                {/* VERIFICATION DATE */}
                                <p
                                  className={`text-xs mt-1 ${
                                    app.application_status === "muted" ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  Diterima: {new Date(app.created_at).toLocaleDateString("ms-MY")}
                                </p>
                              </div>
                            </div>

                            {/* OFFICER DETAILS*/}
                            {app.application_status !== "muted" && app.officer_id && (
                              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-4">
                                  
                                  {/* OFFICER PROFILE PICTURE */}
                                  <div className="relative">
                                    <img
                                      src={app.officer_id.profile_pic || "/placeholder.svg"}
                                      alt=""
                                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <User className="h-2 w-2 text-white" />
                                    </div>
                                  </div>

                                  {/* OFFICER RANK, OFFICER NAME */}
                                  <div>
                                    <p className="text-sm font-medium text-blue-900">Pegawai Penyemak:</p>
                                    <p className="text-blue-800 font-medium">{app.officer_id.fullname}</p>
                                    <p className="text-xs text-blue-600">{app.officer_id.rank}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* BORANG SECTION (FIXED TYPES & REMARKS-BASED STATUS) */}
                            <div className="mb-6">
                              <h4
                                className={`text-sm font-medium mb-4 ${
                                  app.application_status === "muted" ? "text-gray-400" : "text-gray-900"
                                }`}
                              >
                                Status Dokumen:
                              </h4>

                              <div className="space-y-4">
                                {derivedBorangs.map((doc, docIndex) => (
                                <div
                                  key={doc.name}
                                  className={`p-4 rounded-lg border ${
                                    app.application_status === "muted"
                                      ? "bg-gray-100 border-gray-200"
                                      : doc.status === "lulus"
                                        ? "bg-green-50 border-green-200"
                                        : doc.status === "menunggu"
                                          ? "bg-yellow-50 border-yellow-200"
                                          : "bg-red-50 border-red-200"
                                  }`}
                                >

                                    {/* BORANG ICON & NAME */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {app.application_status === "muted" ? (
                                          <FileText className="h-5 w-5 text-gray-400" />
                                        ) : doc.status === "lulus" ? (
                                          <FileCheck className="h-5 w-5 text-green-600" />
                                        ) : doc.status === "menunggu" ? (
                                          <Clock className="h-5 w-5 text-yellow-600" />
                                        ) : (
                                          <FileX className="h-5 w-5 text-red-600" /> // ditolak
                                        )}

                                        <span
                                          className={`font-medium ${
                                            app.application_status === "muted" ? "text-gray-500" : "text-gray-900"
                                          }`}
                                        >
                                          {doc.name}
                                        </span>
                                      </div>

                                      {/* BORANG STATUS TEXT */}
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          app.application_status === "muted"
                                            ? "bg-gray-200 text-gray-500"
                                            : doc.status === "lulus"
                                              ? "bg-green-100 text-green-800"
                                              : doc.status === "menunggu"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {app.application_status === "muted"
                                          ? "Menunggu"
                                          : doc.status === "lulus"
                                            ? "Lulus"
                                            : doc.status === "menunggu"
                                              ? "Menunggu"
                                              : "Ditolak"}
                                      </span>

                                    </div>

                                    {/* BORANG ISSUES - REDESIGNED */}
                                    <div className="mt-3 flex justify-between items-start">
                                      <div className="flex-1">
                                        {doc.status === "ditolak" && ( // Only show issue section if borang status is ditolak
                                          <div className="space-y-3">
                                            <p className="text-sm font-medium text-gray-700">Isu Pengesahan:</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Two columns */}

                                              {/* 'Tidak Tepat' (Incorrect) Issues Container */}
                                              <div className="bg-red-50 border border-red-200 rounded-xl p-4"> {/* Rounded-xl */}
                                                <div className="flex items-center gap-2 mb-3">
                                                  <XCircle className="h-4 w-4 text-red-600" />
                                                  <h5 className="text-sm font-semibold text-red-800">Tidak Tepat</h5>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2"> {/* 2 items per row */}
                                                  {doc.issues.incorrect.length > 0 ? (
                                                    doc.issues.incorrect.map((issueDescription, issueIndex) => (
                                                      <div
                                                        key={issueIndex}
                                                        className="p-3 bg-white rounded-xl border border-red-100 text-xs text-gray-700"
                                                      >
                                                        {formatFieldName(issueDescription)}
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <p className="text-xs text-gray-500 italic col-span-2">
                                                      Tiada isu dalam kategori ini
                                                    </p>
                                                  )}
                                                </div>
                                              </div>

                                              {/* 'Kurang' (Missing) Issues Container */}
                                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"> {/* Rounded-xl */}
                                                <div className="flex items-center gap-2 mb-3">
                                                  <AlertTriangle className="h-4 w-4 text-yellow-600" /> {/* Changed icon */}
                                                  <h5 className="text-sm font-semibold text-yellow-800">Kurang</h5>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2"> {/* 2 items per row */}
                                                  {doc.issues.missing.length > 0 ? (
                                                    doc.issues.missing.map((issueDescription, issueIndex) => (
                                                      <div
                                                        key={issueIndex}
                                                        className="p-3 bg-white rounded-xl border border-yellow-100 text-xs text-gray-700"
                                                      >
                                                        {formatFieldName(issueDescription)}
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <p className="text-xs text-gray-500 italic col-span-2">
                                                      Tiada isu dalam kategori ini
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* BORANG VERIFIED DATE (still using app.credential_date_issued as fallback) */}
                                      <p
                                        className={`text-xs ml-4 ${
                                          app.application_status === "muted" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                      >
                                        {app.application_status === "muted" || !doc.updatedDate
                                          ? "Belum disemak"
                                          : `Disemak dan kemaskini: ${new Date(doc.updatedDate).toLocaleDateString("ms-MY")}`}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* FOOTER */}
                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-sm ${app.application_status === "muted" ? "text-gray-400" : "text-gray-600"}`}
                                >
                                  Kemaskini terakhir:{" "}
                                  {app.application_status === "muted" || !app.credential_date_issued
                                    ? "Belum dikemaskini"
                                    : new Date(app.credential_date_issued).toLocaleDateString("ms-MY")}
                                </span>

                                {/* HANTAR SEMULA, LIHAT BUTIRAN BUTTON */}
                                <div className="flex gap-2">

                                   {/* HANTAR SEMULA BUTTON */}
                                  {app.application_status === "ditolak" && (
                                    <Button
                                        variant="outline" size="sm" className="border-red-300 text-red-700"
                                    >
                                      Hantar Semula
                                    </Button>
                                  )}

                                  {/* LIHAT BUTIRAN BUTTON */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={app.application_status === "muted"}
                                    className={app.application_status === "muted" ? "opacity-50" : ""}
                                  >
                                    Lihat Butiran
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}