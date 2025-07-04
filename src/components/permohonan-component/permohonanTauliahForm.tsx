"use client"

import { useEffect, useState } from "react"

import { Copy , CheckIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, ShoppingCartIcon, CreditCardIcon, User, School, BriefcaseBusiness, Handshake, Crown, FileText, BadgeCheck } from "lucide-react"

import { Button } from "@components/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@components/components/ui/breadcrumb";
import { Label } from "@components/components/ui/label"


import {
  DropdownField,
  TextInputField,
  DateInputField,
  PhoneNumberField,
  FileInputField,
} from "@components/components/ui/customInputFeild";

import { calculateAgeFromIC, formatIcNO, getCachedUser, johorDaerahList } from "@components/lib/utils";
import { supabase } from "@components/lib/supabaseClient";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/components/ui/dialog";
import AnugerahDT from "@components/components/data-table/maklumatPeribadi-DT/pengakap-anugerah-DT/anugerahDT";
import Step1 from "@components/components/permohonan-component/step-JenisTauliah";
import Step2 from "@components/components/permohonan-component/step-MaklumatPeribadi";
import Step3 from "@components/components/permohonan-component/step-AkademikDanPekerjaan";
import Step4 from "@components/components/permohonan-component/step-Perkhidmatan";
import Step5 from "@components/components/permohonan-component/step-Anugerah";
import Step6 from "@components/components/permohonan-component/step-Dokumen";
import Step7 from "@components/components/permohonan-component/step-Pengakuan";
import { useSelector } from "react-redux";
import { RootState } from "@components/lib/store";
import LihatPermohonan from "@components/components/permohonan-component/lihatPermohan";
import { usePathname, useRouter } from "next/navigation";


export default function PermohananTauliahForm() {
  
  const [userData, setUserData] = useState(null);
  const [idList, setIdList] = useState({
  team_id: "",
  user_id: "",
  teamleader_id: "",
});

  const [uploadedFiles, setUploadedFiles] = useState<{
    sijil?: File;
    ic?: File;
    keahlian?: File;
    tandatangan?: File;
  }>({});  

  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "Tauliah", icon: <School  className="w-5 h-5" /> },
    { label: "Peribadi & Kumpulan", icon: <UserIcon className="w-5 h-5" /> },
    { label: "Akademik & Pekerjaan", icon: <BriefcaseBusiness className="w-5 h-5" /> },
    { label: "Khidmat PPM", icon: <Handshake className="w-5 h-5" /> },
    { label: "Anugerah", icon: <Crown className="w-5 h-5" /> },
    { label: "Dokumen", icon: <FileText className="w-5 h-5" /> },
    { label: "Pengakuan", icon: <BadgeCheck className="w-5 h-5" /> },
  ];
  const totalSteps = steps.length;

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCachedUser();
      if (!user) return;

    const { data: scoutData, error: scoutError } = await supabase
      .from("scouts")
      .select(
        `
          profile_pic,
          gender,
          race,
          religion,
          birth_place,
          marital_status,
          users (
            fullname,
            title,
            id_no,
            email,
            phone_no,
          
          team_members (
            team_id,
            teams (
              leader_id
            )
          )        
          )

        `
      )
      .eq("user_id", user.id)
      .single();


      if (scoutError) {
        console.error("Error fetching scouts data:", scoutError.message);
        return;
      }
      console.log("Scout Data:", scoutData);
      console.log("leader_id: ",scoutData?.users.team_members[0].teams.leader_id)

      setIdList({
        team_id: scoutData?.users.team_members[0].teams.team_id || null,
        user_id: user.id,
        teamleader_id: scoutData?.users.team_members[0].teams.leader_id || "",
      })
      // 2. Fetch user address
      const { data: addressData, error: addressError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (addressError) {
        console.error("Error fetching address data:", addressError.message);
      }

      console.log("Address Data:", addressData);

      // 3. Fetch occupation
      const { data: occupationData, error: occupationError } = await supabase
        .from("user_occupation")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (occupationError) {
        console.error("Error fetching occupation data:", occupationError.message);
      }

      console.log("Occupation Data:", occupationData);

      const { data: serviceData, error: serviceError } = await supabase
        .from("user_service")
        .select(
          `
            position,
            level,
            year_end
          `
        )
        .eq("user_id", user.id)
        .eq("year_end", "Kini")

        console.log("Service Data:", serviceData);


      // 4. Format all together
      const { dob, age } = calculateAgeFromIC(scoutData.users?.id_no);
      const formatted = {
        profileImage: scoutData.profile_pic  || "-",
        namaPenuh: scoutData.users?.fullname  || "-",
        pangkat: scoutData.users?.title  || "-",
        statusPerkahwinan: scoutData.marital_status  || "-",
        ic: formatIcNO(scoutData.users?.id_no)  || "-",
        dob,
        age,
        email: scoutData.users?.email  || "-",
        telefon: scoutData.users?.phone_no  || "-",
        jantina: scoutData.gender  || "-",
        kaum: scoutData.race  || "-",
        agama: scoutData.religion  || "-",
        tarikhLahir: scoutData.users?.tarikh_lahir  || "-",
        tempatLahir: scoutData.birth_place  || "-",
        alamatRumah: addressData?.address  || "-",
        poskodRumah: addressData?.postcode  || "-",
        daerahRumah: addressData?.district  || "-",
        negeriRumah: addressData?.state  || "-",
        jawatanHakiki: occupationData?.occupation  || "-",
        namaMajikan: occupationData?.employer_name  || "-",
        alamatMajikan: occupationData?.employer_address  || "-",
        poskodMajikan: occupationData?.employer_postcode  || "-",
        daerahMajikan: occupationData?.employer_district  || "-",
        negeriMajikan: occupationData?.employer_state  || "-",
        unitTauliahKini: `${serviceData?.[0]?.position ?? ""} ${serviceData?.[0]?.level ?? ""}`.trim() 
      };

      setUserData(formatted);
    };

    fetchData();
  }, []);


  return (
    <div className="container-page">
      {/* KUMPULAN PAGE TITLE */}
      <h1 className="font-sans font-bold text-xl ">Permohonan Tauliah</h1>
      <p>Sila lengkapkan semua maklumat anda sebelum menghantar borang pertauliahan </p>

      {/* DYNAMIC BREADCRUMB */}
      {/* <Breadcrumb className="mb-2 font-sans font-normal text-sm">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink ></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Permohonan Tauliah</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <ProgressStepper
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
        onStepClick={(step) => setCurrentStep(step)}
      />
      
      <div className="mt-8">
        {currentStep === 1 && <Step1 userData={userData}/>}
        {currentStep === 2 && <Step2 userData={userData} />}
        {currentStep === 3 && <Step3 userData={userData} />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Step6/>}
        {currentStep === 7 && <Step7/>}
      </div>

<div className="flex justify-center items-center mt-6">
  {currentStep > 1 && (
    <Button
      variant="outline"
      onClick={goToPreviousStep}
      className="mr-4"
    >
      <ChevronLeftIcon className="mr-2 h-4 w-4" />
      Sebelum
    </Button>
  )}

  {currentStep < totalSteps ? (
    <Button onClick={goToNextStep}>
      Seterusnya
      <ChevronRightIcon className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <SubmitApplicationButton
      team_id={idList.team_id}
      user_id={idList.user_id}
      team_leader_id={idList.teamleader_id}
    />
  )}
</div>

    </div>
  )
}


interface Step {
  label: string;
  icon: React.ReactNode;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (step: number) => void;
}


function ProgressStepper({ currentStep, steps, onStepClick }: ProgressStepperProps) {
  const totalSteps = steps.length;

  return (
    <div className="relative px-4 mt-10">
      {/* Background progress line */}
      <div className="absolute top-5 left-5 right-5 h-1 bg-muted-foreground/30 rounded z-0">
        <div
          className="h-full bg-primary rounded transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center relative group">
              <button
                onClick={() => onStepClick?.(stepNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground bg-background text-muted-foreground group-hover:border-primary/50"
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5 animate-fade-in" />
                ) : (
                  step.icon
                )}
              </button>
              <span
                className={`text-xs mt-2 transition-colors duration-300 text-center ${
                  isActive || isCompleted
                    ? "text-primary font-medium"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              >
                {`${stepNumber}. ${step.label}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}



interface SubmitApplicationButtonProps {
  team_id: string;
  user_id: string;
  team_leader_id: string;
}

const SubmitApplicationButton: React.FC<SubmitApplicationButtonProps> = ({
  team_id,
  user_id,
  team_leader_id,
}) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    credentialName,
    sijilManikayuFile,
    salinanICFile,
    kadKeahlianPengakapFile,
    signatureFile,
  } = useSelector((state: RootState) => state.permohonanTauliah);

  const allFilesUploaded = salinanICFile && sijilManikayuFile && kadKeahlianPengakapFile && signatureFile;

  const uploadFile = async (file: File, folder: string) => {
    const filePath = `${folder}/${Date.now()}_${file.name}`;
    console.log(`🔄 Uploading file to: ${filePath}`);

    const { error } = await supabase.storage
      .from("permohonan-tauliah-files")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error(`❌ Upload failed for folder "${folder}":`, error.message);
      throw new Error(`Gagal memuat naik fail ke folder "${folder}".`);
    }

    console.log(`✅ File uploaded successfully to: ${filePath}`);
    return filePath;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploadedIC = await uploadFile(salinanICFile!, "salinan-ic-files");
      const uploadedManikayu = await uploadFile(sijilManikayuFile!, "salinan-manikayu-files");
      const uploadedKadAhli = await uploadFile(kadKeahlianPengakapFile!, "kad-keahlian-files");
      const uploadedTandatangan = await uploadFile(signatureFile!, "tandatangan-files");

      const { error: insertError } = await supabase.from("credential_application").insert({
        team_id: team_id,
        applicant_id: user_id,
        officer_id: team_leader_id,
        credential_name: credentialName,
        credential_no_hq: null,
        credential_date_issued: null,
        application_status: "menunggu",
        application_level: "pemimpin kumpulan",
        correct_remarks: [],
        incorrect_remarks: [],
        missing_remarks: [],
        isCurrent_application: true,
      });

      if (insertError) throw insertError;

      alert("✅ Permohonan berjaya dihantar!");
      setDialogOpen(false);
      router.push(`http://localhost:3000/dashboard/tauliah/permohanan-tauliah/status-permohonan`);
    } catch (error: any) {
      console.error("❌ Submit Error:", error);
      alert("Gagal menghantar permohonan. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!allFilesUploaded}
          className=""
          variant="default"
        >
          Hantar Permohonan
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hantar Permohonan?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Adakah anda pasti ingin menghantar permohonan ini? Pastikan semua maklumat dan dokumen telah dimuat naik dengan betul.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menghantar..." : "Ya, Hantar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
