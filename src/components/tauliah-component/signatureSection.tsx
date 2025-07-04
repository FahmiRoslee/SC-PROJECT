"use client";

import { useState, useEffect } from "react";
import { FileSignature, Check, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@components/components/ui/alert";
import { Button } from "@components/components/ui/button";
import { SignatureList, Signer } from "./signatureList";
import { toast } from "sonner"; // for alert on submit
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@components/lib/store";
import { supabase } from "@components/lib/supabaseClient";
import { uploadSignFileToSupabase } from "./storeSignPDF";
import { getCachedUser } from "@components/lib/utils";

// import { createClient } from '@supabase/supabase-js' // Uncomment if you use real Supabase

// Mock supabase operation
const mockSupabaseInsert = async (data: any) => {
  console.log("📦 Mock submitting to Supabase:", data);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1500));
};


interface TandatanganBorangSectionProps {
}

export default function TandatanganBorangSection({}: TandatanganBorangSectionProps) {
  
  const dispatch = useDispatch();
  const {
    teamId,
    applicantId,
    credentialApplicationId,
    credentialApplicationName,
    status,
    credential_level,
    validatedBorangId,
    hasAllBorangId,
    correctFields,
    incorrectFields,
    missingFields,
    SignFile,
    hasUploadedSignPDF,
    officerList
  } = useSelector((state: RootState) => state.penilaianTauliah);
  
  const hasValidationIssues = (incorrectFields.length ?? 0) > 0 || (missingFields.length ?? 0) > 0;

  const [canSubmit, setCanSubmit] = useState(false);
  const [skipSignatureNote, setSkipSignatureNote] = useState(false);

  useEffect(() => {
    try {
      console.log("in sign section hasAllBorangIdRed: ",hasAllBorangId)
      const savedData = localStorage.getItem("borangTauliah");
      if (!savedData) return;

      const parsed = JSON.parse(savedData);
      console.log("in parsed: ",parsed);

      // redux
      console.log("validationIssues2: ", hasValidationIssues);
      console.log("!!!!!!!!!!! hasUploadedSignPDF: ", hasUploadedSignPDF);

      if(hasAllBorangId) {
        if(hasValidationIssues) {
          setCanSubmit(true);
          setSkipSignatureNote(true);
          console.log("in 1")
        }
        else {
          if (hasUploadedSignPDF) {
            setCanSubmit(true);
            console.log("in 2")
          }
          else {
            setCanSubmit(false);
            setSkipSignatureNote(false);
            console.log("in 3")
          }
        }
      }
      else {
        setCanSubmit(false);
        setSkipSignatureNote(false);      
        console.log("in 4")
      }
    } catch (err) {
      console.error("❌ Failed to parse localStorage data", err);
      setCanSubmit(false);
    }
  }, [hasAllBorangId,hasUploadedSignPDF]);


const handleSubmitForm = async () => {
  toast.info("Memproses penghantaran borang...");

  const statusLevels = ["pemimpin kumpulan", "daerah", "negeri"];
  const currentLevelIndex = statusLevels.indexOf(credential_level || "");
  const isFinalLevel = statusLevels[currentLevelIndex] === "negeri";
  const dateIssued = new Date(); 
  let uploadedSignFileUrl: string | null = null;

  const user = await getCachedUser();
  const currentOfficerId = user.id
  
  try {
    // Upload signature file first, as it's needed for both success and rejection paths
    if (SignFile) {
      uploadedSignFileUrl = await uploadSignFileToSupabase(SignFile, credential_level, credentialApplicationId, applicantId);
    } else if (!hasValidationIssues) { // Only require signature file if no validation issues
      toast.error("Fail tandatangan tidak ditemui.");
      return;
    }

    const insertOfficerValidation = {
      credential_application_id: credentialApplicationId,
      applicant_id: applicantId,
      officer_id: currentOfficerId,
      officer_sign_url: uploadedSignFileUrl
    }
    const { error: insertOfficerValidationError} = await supabase 
      .from("credential_officer_validation")
      .insert(insertOfficerValidation)

    if (insertOfficerValidationError) {
      toast.error("Gagal merekodkan tandatangan pegawai.");
      console.error("Error inserting officer validation:", insertOfficerValidationError);
      return;
    }

    // Step 1: Handle validation issue — set current row to ditolak
    if (hasValidationIssues) {
      const { error: updateError1 } = await supabase
        .from("credential_application")
        .update({ application_status: "ditolak", credential_date_issued: dateIssued })
        .eq("credential_application_id", credentialApplicationId);

      const { error: updateError2 } = await supabase
        .from("credential_application")
        .update({ isCurrent_application: false })
        .eq("applicant_id", applicantId)
        .eq("credential_name", credentialApplicationName);

      if (updateError1 || updateError2) {
        toast.error("Gagal mengemas kini status permohonan.");
        return;
      }

      toast.success("Permohonan telah ditolak.");
      return;
    }

    // Step 2: No validation issues
    if (isFinalLevel) {
      const { error: updateError1 } = await supabase
        .from("credential_application")
        .update({
          application_status: "lulus",
          isCurrent_application: false,
          credential_date_issued: dateIssued
        })
        .eq("credential_application_id", credentialApplicationId);

      const { error: updateError2 } = await supabase
        .from("credential_application")
        .update({ isCurrent_application: false })
        .eq("applicant_id", applicantId)
        .eq("credential_name", credentialApplicationName);

      if (updateError1 || updateError2) {
        toast.error("Gagal mengemas kini status permohonan.");
        return;
      }

      toast.success("Permohonan diluluskan.");
    } 
    else {
      const newLevel = statusLevels[currentLevelIndex + 1] || credential_level;
      
      const assignedOfficer = officerList.find(officer => officer.level === newLevel);
      const assignedOfficerId = assignedOfficer ? assignedOfficer.id : null;
      console.log("assignedOfficerId:", assignedOfficerId)

      const insertData = {
        team_id: teamId,
        applicant_id: applicantId,
        officer_id: assignedOfficerId,
        credential_name: credentialApplicationName,
        application_status: "menunggu",
        application_level: newLevel,
        isCurrent_application: true,
      };

      const { error: updateError3 } = await supabase
        .from("credential_application")
        .update({
          application_status: "lulus",
          credential_date_issued: dateIssued
        })
        .eq("credential_application_id", credentialApplicationId);    

      const { error: insertError } = await supabase
        .from("credential_application")
        .insert([insertData]);

      console.log("insertError: ",insertError)
      if (insertError || updateError3) {
        toast.error("Gagal menghantar borang ke peringkat seterusnya.");
        if (insertError) console.error("Insert error:", insertError);
        if (updateError3) console.error("Update error for current application:", updateError3);
        return;
      }
      
      toast.success("Borang berjaya dihantar ke peringkat seterusnya.");
    }
  } catch (error) {
    console.error("Submission failed:", error);
    toast.error("Gagal memproses penghantaran borang.");
  }
};


  const validationIssuesExist = (() => {
    try {
      const saved = localStorage.getItem("borangTauliah");
      if (!saved) return false;
      const parsed = JSON.parse(saved);
      return (
        (parsed.validationIssues?.incorrect?.length ?? 0) > 0 ||
        (parsed.validationIssues?.missing?.length ?? 0) > 0
      );
    } catch {
      return false;
    }
  })();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
      <div className="border-b px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center">
          <FileSignature className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="font-semibold text-lg text-blue-800">
            Tandatangan Borang
          </h2>
        </div>
      </div>
      <div className="p-6">

        {validationIssuesExist ? (
          <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Anda perlu menyemak dan betulkan borang sebelum tandatangan
              dibenarkan.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-emerald-50 text-emerald-800 border-emerald-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Borang Telah Disemak</AlertTitle>
            <AlertDescription>
              Anda boleh menandatangani dokumen sekarang.
            </AlertDescription>
          </Alert>
        )}

        {skipSignatureNote && (
          <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Tandatangan Tidak Diperlukan</AlertTitle>
            <AlertDescription>
              Anda tidak perlu menandatangani borang buat masa ini. Teruskan ke
              penghantaran borang.
            </AlertDescription>
          </Alert>
        )}

        <SignatureList
          title="TANDATANGAN BORANG PERMOHONAN"
          readOnly={validationIssuesExist}
          validationIssuesExist={validationIssuesExist}
          colorTheme="blue"
        />

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmitForm}
            disabled={!canSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            <span>Hantar Borang</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
