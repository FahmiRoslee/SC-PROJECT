"use client"

import { type ValidationStatus } from "@components/components/maklumatPeribadi-component/personalInfoCard"
import { FormLayout, type FormSection } from "@components/components/tauliah-component/borangLayout"
import { DocumentValidationCard } from "@components/components/tauliah-component/document-card-2"
import { useState, useMemo, useEffect } from "react"
import { User, FileText, FileSignature } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@components/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@components/lib/store"
import { setCorrectFields, setIncorrectFields, setMissingFields, setValidatedBorangId } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice"

export default function BorangDokumenPage() {

  const dispatch = useDispatch();
  const currValidatedBorangId = useSelector((state: RootState) => state.penilaianTauliah.validatedBorangId);
  const currCorrectFields = useSelector((state: RootState) => state.penilaianTauliah.correctFields);
  const currIncorrectFields = useSelector((state: RootState) => state.penilaianTauliah.incorrectFields);
  const currMissingFields = useSelector((state: RootState) => state.penilaianTauliah.missingFields);  

  const [documentValidationResults, setDocumentValidationResults] = useState<Record<string, ValidationStatus>>({})

  const [validationIssues, setValidationIssues] = useState<{
    incorrect: string[]
    missing: string[]
  }>({ incorrect: [], missing: [] })
  const [fieldsCleared, setFieldsCleared] = useState(false)

  // --- Data Definition ---
  const declarationText = `SAYA SESUNGGUHNYA MENGAKU BAHAWA SEMUA KETERANGAN YANG TELAH SAYA BERIKAN DI DALAM BORANG INI ADALAH BENAR DAN BETUL. SAYA MEMAHAMI BAHAWA SEKIRANYA ADA DIANTARA MAKLUMAT-MAKLAT ITU DIDAPATI PALSU, MAKA PIHAK PERSEKUTUAN PENGAKAP MALAYSIA BERHAK MENARIK BALIK TAULIAH YANG DIBERIKAN DAN PERKHIDMATAN SAYA AKAN DITAMATKAN DENGAN SERTA MERTA.`

  const declarationFields = [
    {
      id: 'pengakuanDokumen',
      label: "Pengakuan",
      value: declarationText,
      rowId: "declaration1",
      width: "full",
      hideValidationButtons: true,
    },
  ]

  // --- Handlers for child component validation changes ---
  const handleDocumentValidationChange = (documentTitle: string, status: ValidationStatus) => {
    setDocumentValidationResults((prev) => {
      const newResults = { ...prev }
      if (status === "unvalidated") {
        delete newResults[documentTitle]
      } else {
        newResults[documentTitle] = status
      }
      return newResults
    })
    setFieldsCleared(false)
  }

  const handleClearValidations = () => {
    setDocumentValidationResults({})
    setValidationIssues({ incorrect: [], missing: [] })
    setFieldsCleared(true)
  }

  // --- Validation Logic for the entire form ---
  const allFields = useMemo(() => {
    const fieldsToValidate = new Set<string>()
    fieldsToValidate.add("doc_sijilManikayu")
    fieldsToValidate.add("doc_salinanIC")
    fieldsToValidate.add("doc_kadAhli")
    return Array.from(fieldsToValidate);
  }, []);

  // hasValidationIssues: Now returns true ONLY if there are fields that are unreviewed,
  // or if the form has been cleared.
  const hasValidationIssues = useMemo(() => {
    if (fieldsCleared) {
      return true // If cleared, it means nothing is validated, so there are issues (unreviewed fields)
    }

    const combinedResults = {
      ...documentValidationResults,
    }

    // Check if any field is 'unvalidated' or 'undefined' (meaning not yet reviewed)
    for (const field of allFields) {
      if (combinedResults[field] === undefined || combinedResults[field] === "unvalidated") {
        return true // Found a field that still needs review
      }
    }

    return false // If we reach here, all fields have received *some* status (correct, incorrect, or missing)
                 // Therefore, there are no unreviewed validation issues according to this new logic.
  }, [documentValidationResults, fieldsCleared, allFields])


  // isValidated: True if ALL fields have received *any* status (not undefined and not 'unvalidated').
  // This logic remains the same as in the previous iteration.
  const isValidated = useMemo(() => {
    if (fieldsCleared) {
      return false
    }

    const combinedResults = {
      ...documentValidationResults,
    }

    for (const field of allFields) {
      if (combinedResults[field] === undefined || combinedResults[field] === "unvalidated") {
        return false
      }
    }

    return true
  }, [documentValidationResults, fieldsCleared, allFields])


  // Debug logging to help track the validation state
  useEffect(() => {
    const totalFields = allFields.length;
    const validatedFields = Object.keys(documentValidationResults).length;

    console.log("Validation Debug (BorangDokumen):", {
      totalFields,
      validatedFields,
      documentResults: Object.keys(documentValidationResults),
      isValidated: isValidated,
      hasValidationIssues: hasValidationIssues,
    });
  }, [documentValidationResults, isValidated, hasValidationIssues, allFields]);


  // --- Submission Logic ---
  const handleSubmit = () => {
    const newIssues = {
      incorrect: [] as string[],
      missing: [] as string[],
      correct: [] as string[],
    };

    const allCurrentValidationResults = {
      ...documentValidationResults,
    };

    allFields.forEach((fieldLabel) => {
      const status = allCurrentValidationResults[fieldLabel];
      if (status === "incorrect") {
        newIssues.incorrect.push(fieldLabel);
      } else if (status === "missing") {
        newIssues.missing.push(fieldLabel);
      } else if (status === "correct") {
        newIssues.correct.push(fieldLabel);
      }
      // If a field is still unvalidated/undefined, it's considered missing for *this* submission's issues
      if (status === undefined || status === "unvalidated") {
        newIssues.missing.push(fieldLabel);
      }
    });

    // Update the local state for displaying validation issues in the UI
    setValidationIssues({ incorrect: newIssues.incorrect, missing: newIssues.missing });

    // Prevent submission if there are actual incorrect or missing fields
    if (newIssues.incorrect.length > 0 || newIssues.missing.length > 0) {
      alert("Sila semak semua bahagian borang. Terdapat maklumat yang salah atau belum disemak.");
      return;
    }

    // --- Start of Merging Logic

    const combinedCorrectFields = [...new Set([...currCorrectFields, ...newIssues.correct])];
    dispatch(setCorrectFields(combinedCorrectFields));   
    const combinedIncorrectFields = [...new Set([...currIncorrectFields, ...newIssues.incorrect])];
    dispatch(setIncorrectFields(combinedIncorrectFields));   
    const combinedMissingFields = [...new Set([...currMissingFields, ...newIssues.missing])];
    dispatch(setMissingFields(combinedMissingFields)); 

    let existingFormStatus = null;
    const localStorageKey = "borangTauliah"; // Use the same key as borangPPM.tsx

    // 1. Retrieve existing data from localStorage safely
    const existingFormStatusString = localStorage.getItem(localStorageKey);

    if (existingFormStatusString) {
      try {
        existingFormStatus = JSON.parse(existingFormStatusString);
      } catch (e) {
        console.error("Error parsing existing localStorage data. Starting fresh.", e);
        existingFormStatus = null; // Treat as if no valid data exists
      }
    }

    // Determine the ID for this specific form submission
    const newIdsForThisSubmission = ["dokumen"]; // This form contributes the "dokumen" ID
    const uniqueNewIdsForThisSubmission = [...new Set(newIdsForThisSubmission)];
    
    const currentFormType = "dokumen"; 
    const combinedValidatedBorangId = [...new Set([...currValidatedBorangId, ...[currentFormType]])];
    dispatch(setValidatedBorangId(combinedValidatedBorangId));


    // 2. Prepare the final formStatus object
    const finalFormStatus = {
      id: [] as string[], // Always initialize 'id' as an empty array
      status: "telah-disemak", // Status is the latest for the current action
      completedAt: new Date().toISOString(), // Timestamp is always the latest
      validationIssues: {
        incorrect: [] as string[],
        missing: [] as string[],
      },
      correctFields: [] as string[],
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

  const formSections: FormSection[] = [
    {
      id: "sijilManikayu",
      label: "SIJIL MANIKAYU",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">DOKUMEN YANG TELAH DIMUAT NAIK</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 md:gap-12">
            <DocumentValidationCard
              id="doc_sijilManikayu"
              title="Sijil Manikayu"
              fileName="sijil_manikayu.pdf"
              fileUrl="#"
              uploadDate="12/03/2023"
              iconColor="blue"
              onValidationChange={handleDocumentValidationChange}
              isCleared={fieldsCleared}
            />
          </div>
        </div>
      ),
    },
    {
      id: "salinanIC",
      label: "SALINAN IC",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">DOKUMEN YANG TELAH DIMUAT NAIK</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>

          <div className="grid gap-8 md:gap-12">
            <DocumentValidationCard
            id="doc_salinanIC"
              title="Salinan IC"
              fileName="salinan_ic.pdf"
              fileUrl="#"
              uploadDate="12/03/2023"
              iconColor="red"
              onValidationChange={handleDocumentValidationChange}
              isCleared={fieldsCleared}
            />
          </div>
        </div>
      ),
    },
    {
      id: "salinanKadAhli",
      label: "KAD KEAHLIAN",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">DOKUMEN YANG TELAH DIMUAT NAIK</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 md:gap-12">
            <DocumentValidationCard
              id="doc_kadAhli"
              title="Kad Keahlian Pengakap"
              fileName="kad_keahlian_pengakap.pdf"
              fileUrl="#"
              uploadDate="15/03/2023"
              iconColor="green"
              onValidationChange={handleDocumentValidationChange}
              isCleared={fieldsCleared}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <FormLayout
      title="Borang Dokumen"
      backLink="/"
      sections={formSections}
      hasValidationIssues={hasValidationIssues} // This will now be false if all fields are reviewed
      isValidated={isValidated} // This remains true if all fields are reviewed (regardless of correctness)
      onSubmit={handleSubmit}
      onClearValidations={handleClearValidations}
      validationIssues={validationIssues}
      numberingStyle="numeric"
      isOfficer={true}
    />
  )
}