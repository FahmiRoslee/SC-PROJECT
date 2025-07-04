import { Calendar, Check, ChevronUp, Trash, UploadCloud, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@components/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@components/lib/store";
import { setSignFile, setUploadedSignPDF } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice";

// Define the structure of your borangTauliah data for type safety
// Assuming SignatureMode is defined elsewhere, for example:
type SignatureMode = "display" | "edit";

// --- Interfaces ---
interface BorangTauliahData {
  id: string[];
  status: string;
  completedAt: string;
  validationIssues: {
    incorrect: string[];
    missing: string[];
  };
  correctFields: string[];
}

// Removed hasAllBorangId2 from props as it's now sourced from Redux
export interface SignatureCardProps {
  title: string;
  note?: string;
  defaultOpen?: boolean;
  className?: string;
  mode?: SignatureMode; // Made optional as it has a default value
  signatureUrl?: string;
  signatureDate?: string;
  onSignatureChange?: (signatureData: string | null) => void;
  onDateChange?: (date: string) => void;
  additionalFields?: React.ReactNode;
  isCurrentUser: boolean; // To control editability
}

// --- Component ---
export function SignatureCard({
  title,
  note = "Sila muat naik tandatangan dalam format PDF. Tandatangan mestilah jelas dan sah.",
  defaultOpen = true,
  className,
  mode = "display", // Default value for mode
  signatureUrl,
  signatureDate,
  onSignatureChange,
  onDateChange,
  additionalFields,
  isCurrentUser,
}: SignatureCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [date, setDate] = useState(signatureDate || getCurrentDate());
  const [canInteract, setCanInteract] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);
  const [isBorangBlocked, setIsBorangBlocked] = useState(false); // Initial state can be true or false based on your UX preference

  const dispatch = useDispatch();
  const {
    hasAllBorangId,
    correctFields,
    incorrectFields,
    missingFields,
  } = useSelector((state: RootState) => state.penilaianTauliah);

  function getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    console.log('---hasAllBorangId from redux (inside useEffect):', hasAllBorangId); // Now 'hasAllBorangId' is a dependency

    console.log("useEffect triggered in SignatureCard:");
    console.log("  signatureFile:", signatureFile ? signatureFile.name : "No file");
    console.log("  isCurrentUser prop:", isCurrentUser);

    if (typeof window !== "undefined") {
      try {

        const hasExternalBorangIssues = incorrectFields.length > 0 || missingFields.length > 0;

        
        console.log('---hasExternalBorangIssues:', hasExternalBorangIssues);
        console.log('---hasAllBorangId (for blocking logic):', hasAllBorangId);

        // --- Logic for isBorangBlocked ---
        // The borang should be BLOCKED if:
        // 1. Not all required borang IDs are validated (hasAllBorangId is false)
        // OR
        // 2. There are external borang issues (hasExternalBorangIssues is true)
        if (!hasAllBorangId || hasExternalBorangIssues) {
          setIsBorangBlocked(true); // Blocked
          console.log('---Borang BLOCKED (Reason: Redux ID incomplete OR External Issues)');
        } else {
          setIsBorangBlocked(false); // Not blocked
          console.log('---Borang NOT blocked (Reason: Redux ID complete AND No External Issues)');
        }
        
        // --- Logic for canInteract ---
        // Use the current fileErrorMessage state for calculations
        let currentFileErrorMessage: string | null = fileErrorMessage; 

        // The user can interact if:
        // 1. They are the current user
        // 2. There are no external borang issues (from localStorage)
        // 3. There is no file error message
        const newCanInteract = isCurrentUser && !hasExternalBorangIssues && (currentFileErrorMessage === null);
        setCanInteract(newCanInteract);

        console.log("  hasExternalBorangIssues (from borangTauliah):", hasExternalBorangIssues);
        console.log("  fileErrorMessage:", fileErrorMessage);
        console.log("  canInteract (calculated):", newCanInteract);

      } catch (error) {
        console.error("Error in SignatureCard useEffect:", error);
        setCanInteract(false);
        setFileErrorMessage("Ralat semasa memuatkan status muat naik.");
        setIsBorangBlocked(true); // Block interaction and set error on caught exception
      }
    }
  }, [
    signatureFile,
    isCurrentUser,
    fileErrorMessage, // Depend on fileErrorMessage if its value can change and affect this effect
    hasAllBorangId, // Crucial: include the Redux state as a dependency because its value is used here
    setIsBorangBlocked, // State setters are stable, but helpful for linter adherence
    setCanInteract,
    setFileErrorMessage
  ])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCurrentUser) {
        alert("Anda tidak dibenarkan memuat naik tandatangan.");
        return;
    }
    if (isBorangBlocked) {
        alert("Tidak boleh memuat naik tandatangan selagi terdapat isu pengesahan pada Borang Tauliah.");
        return;
    }

    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSignatureFile(file); // Keep your local state update if needed
      onSignatureChange?.(file.name); // Keep your callback if needed
      const currentDate = getCurrentDate(); // Keep your date logic
      setDate(currentDate);
      setFileErrorMessage(null);

      // *** THIS IS THE KEY CHANGE ***
      // Dispatch the actual File object to Redux
      dispatch(setSignFile(file));
      dispatch(setUploadedSignPDF(true));

    } else {
      alert("Sila muat naik fail PDF sahaja.");
      setFileErrorMessage("Hanya fail PDF dibenarkan.");
      // If an invalid file is selected, you might want to clear the Redux state
      dispatch(setSignFile(null));
      dispatch(setUploadedSignPDF(false));
    }
  };

  const clearFile = () => {
    if (!isCurrentUser) {
        alert("Anda tidak dibenarkan memadam tandatangan.");
        return;
    }
    if (isBorangBlocked) {
        alert("Tidak boleh memadam tandatangan selagi terdapat isu pengesahan pada Borang Tauliah.");
        return;
    }

    setSignatureFile(null);
    onSignatureChange?.(null);
    setFileErrorMessage(null);
    dispatch(setUploadedSignPDF(null));
  };

  let uploadBoxMessage: string;
  let uploadBoxSubText: string = "";

  // Signature file name n indicator handler
  if (signatureFile) {
    uploadBoxMessage = signatureFile.name;
  } else if (!isCurrentUser) {
      uploadBoxMessage = "Anda tidak dibenarkan mengedit.";
  } else if (isBorangBlocked) {
    uploadBoxMessage = "Borang Tauliah mempunyai isu.";
    uploadBoxSubText = "Tidak boleh memuat naik tandatangan.";
  } else if (fileErrorMessage) {
    uploadBoxMessage = fileErrorMessage;
    uploadBoxSubText = "Hanya PDF. Saiz maksimum 2MB.";
  } else {
    uploadBoxMessage = "Seret dan lepaskan fail di sini atau klik untuk muat naik";
    uploadBoxSubText = "Hanya PDF. Saiz maksimum 2MB.";
  }

  return (
    <div className={cn("w-full rounded-md border bg-white", className)}>
      
      {/* EXPAND CARD BUTTON, SIGNATURE LEVEL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold border-b border-gray-200"
      >
        {/* SIGNATURE LEVEL */}
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-5">

          {/* SIGN NOTE FOR OFFCIER GUIDE */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">{note}</div>

          {/* SIGNATURE UPLOAD */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Muat Naik Tandatangan (PDF)</h3>
              {!signatureFile && (
                <span className="text-xs text-amber-600">Fail PDF sahaja dibenarkan</span>
              )}
              {signatureFile && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFile}
                    className={cn(
                        "flex items-center gap-1 text-xs py-1 px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition",
                        (!isCurrentUser || isBorangBlocked) && "opacity-50 cursor-not-allowed"
                    )}
                    type="button"
                    disabled={!isCurrentUser || isBorangBlocked}
                  >
                    <Trash className="h-4 w-4" />
                    Padam
                  </button>
                  <button
                    className="flex items-center gap-1 text-xs py-1 px-3 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition"
                    type="button"
                  >
                    <Check className="h-4 w-4" />
                    Disahkan
                  </button>
                </div>
              )}
            </div>

            {/* SIGNATURE FILE UPLOAD CONTAINER */}
            <label
              htmlFor="signature-upload"
              className={cn(
                "relative flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50",
                "h-48", // THIS IS THE CHANGE: Fixed height
                // Conditional styling based on canInteract and the presence of an error message
                !canInteract || isBorangBlocked || fileErrorMessage
                  ? "cursor-not-allowed opacity-50 border-red-500 bg-red-50 text-red-700" // Red/disabled if cannot interact or error
                  : "cursor-pointer text-blue-600 hover:border-blue-400 hover:bg-blue-100" // Blue/active if can interact
              )}
            >
              <>
                <UploadCloud className="h-10 w-10 mb-2" />
                <span className="text-sm font-medium text-center px-2">{uploadBoxMessage}</span>
                {uploadBoxSubText && <p className="text-xs text-gray-500 mt-1 text-center px-2">{uploadBoxSubText}</p>}
              </>
              <input
                id="signature-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0"
                disabled={!canInteract}
              />
            </label>
          </div>

          {/* SIGNATURE UPLOAD DATE */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Tarikh</h3>
            </div>
            <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
              <span className="text-sm text-gray-700">{date}</span>
            </div>
          </div>

          {additionalFields && <div className="pt-3 border-t border-gray-100">{additionalFields}</div>}
        </div>
      )}
    </div>
  );
}