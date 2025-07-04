"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { cn } from "@components/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@components/lib/store"

export type ValidationStatus = "correct" | "incorrect" | "missing" | "unvalidated"

export type InfoField = {
  id: string
  label: string
  value: string
  rowId: string | number
  width?: "full" | "half" | "third"
  required?: boolean
  errorMessage?: string
  validationStatus?: ValidationStatus
  isSignature?: boolean
  hideValidationButtons?: boolean
}

export type TableColumn = {
  header: string
  accessor: string
  width?: string
}

export type TableRow = {
  [key: string]: string | number
}

export type InfoTable = {
  id: string
  title: string
  columns: TableColumn[]
  data: TableRow[]
  required?: boolean
  errorMessage?: string
  validationStatus?: ValidationStatus
}

export interface PersonalInfoCardProps {
  title: string
  fields?: InfoField[]
  tables?: InfoTable[]
  defaultOpen?: boolean
  className?: string
  onValidationChange?: (fieldLabel: string, status: ValidationStatus) => void
  onTableValidationChange?: (tableTitle: string, status: ValidationStatus) => void
  editable?: boolean
  extra?: React.ReactNode;
}

export function PersonalInfoCard({
  title,
  fields = [],
  tables = [],
  defaultOpen = false,
  className,
  onValidationChange,
  onTableValidationChange,
  editable = true,
  extra
}: PersonalInfoCardProps) {

  const dispatch = useDispatch();
  const applicant_id = useSelector((state: RootState) => state.penilaianTauliah.applicantId);
  const credentialApplicantion_id = useSelector((state: RootState) => state.penilaianTauliah.credentialApplicationId);
  const currStatus = useSelector((state: RootState) => state.penilaianTauliah.status);
  const currLevel = useSelector((state: RootState) => state.penilaianTauliah.credential_level);
  const validatedBorangId = useSelector((state: RootState) => state.penilaianTauliah.validatedBorangId);
  const hasAllBorangIdRed = useSelector((state: RootState) => state.penilaianTauliah.hasAllBorangId);
  const currCorrectFields = useSelector((state: RootState) => state.penilaianTauliah.correctFields);
  const currIncorrectFields = useSelector((state: RootState) => state.penilaianTauliah.incorrectFields);
  const currMissingFields = useSelector((state: RootState) => state.penilaianTauliah.missingFields);
  const hasUploadedSignPDF = useSelector((state: RootState) => state.penilaianTauliah.hasUploadedSignPDF);  
  
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [validationStatuses, setValidationStatuses] = useState<Record<string, ValidationStatus>>({})
  const [tableValidationStatuses, setTableValidationStatuses] = useState<Record<string, ValidationStatus>>({})

  useEffect(() => {
    try {
      // Initialize an empty object to store field validation results
      const results: Record<string, ValidationStatus> = {};
      console.log("Initializing field validation results map.");

      // Populate the results object with statuses based on validationIssues
      // Each fieldId from 'correct', 'incorrect', and 'missing' arrays is assigned its respective status
      currCorrectFields.forEach((fieldId: string) => {
        results[fieldId] = "correct";
        console.log(`Field '${fieldId}' marked as 'correct' from validationIssues.`);
      });
      currIncorrectFields.forEach((fieldId: string) => {
        results[fieldId] = "incorrect";
        console.log(`Field '${fieldId}' marked as 'incorrect' from validationIssues.`);
      });
      currMissingFields.forEach((fieldId: string) => {
        results[fieldId] = "missing";
        console.log(`Field '${fieldId}' marked as 'missing' from validationIssues.`);
      });

      // Handle older saves that might have 'correctFields' at the root level
      currCorrectFields.forEach((fieldId: string) => {
        // Only add if the field hasn't already been assigned a status by validationIssues
        if (!results[fieldId]) {
          results[fieldId] = "correct";
          console.log(`Field '${fieldId}' marked as 'correct' from root 'correctFields' (older save format).`);
        }
      });

      // Initialize an empty object to store table validation results
      const tableResults: Record<string, ValidationStatus> = {};
      console.log("Initializing table validation results map.");

      console.log("Available tables:", tables);
      tables.forEach(table => console.log(`  Table ID: ${table.id}`));

      // Populate tableResults, ensuring the ID corresponds to an actual table
      currCorrectFields.forEach((id: string) => {
          tableResults[id] = "correct";
          console.log(`Table '${id}' marked as 'correct'.`);
      });
      currIncorrectFields.forEach((id: string) => {
          tableResults[id] = "incorrect";
          console.log(`Table '${id}' marked as 'incorrect'.`);
      });
      currMissingFields.forEach((id: string) => {
          tableResults[id] = "missing";
          console.log(`Table '${id}' marked as 'missing'.`); 
      });
      currCorrectFields.forEach((id: string) => { // 'id' is appropriate here as it refers to an item from correctFields
        // Check if this 'id' exists in your 'tables' array and if it hasn't been set by validationIssues
        if (!tableResults[id]) {
          tableResults[id] = "correct";
          console.log(`Table '${id}' marked as 'correct' from root 'correctFields' (if applicable and not already set).`);
        }
      })

      console.log("Final consolidated field validation results:", results);
      console.log("Final consolidated table validation results:", tableResults);

      // Update the React state with the restored validation statuses
      setValidationStatuses(results);
      setTableValidationStatuses(tableResults);

      // Trigger onValidationChange for each restored field to ensure UI updates
      if (onValidationChange) {
        console.log("Calling onValidationChange for each restored field.");
        Object.entries(results).forEach(([fieldKey, status]) => {
          onValidationChange(fieldKey, status);
          console.log(`Triggered onValidationChange for field: '${fieldKey}' with status: '${status}'.`);
        });
      }

      // Trigger onTableValidationChange for each restored table
      if (onTableValidationChange) {
        console.log("Calling onTableValidationChange for each restored table.");
        Object.entries(tableResults).forEach(([tableId, status]) => {
          onTableValidationChange(tableId, status);
          console.log(`Triggered onTableValidationChange for table: '${tableId}' with status: '${status}'.`);
        });
      }

    } catch (e) {
      // Log any errors encountered during parsing or processing
      console.error("Failed to parse or process 'borang-ppm-status' from localStorage:", e);
    }
  }, []);

  // Group fields by rowId
  const groupedFields = fields.reduce(
    (acc, field) => {
      if (!acc[field.rowId]) {
        acc[field.rowId] = []
      }
      acc[field.rowId].push(field)
      return acc
    },
    {} as Record<string | number, InfoField[]>,
  )

  // Get row IDs in order
  const rowIds = Object.keys(groupedFields)

  // Check if a field is incomplete (for required fields with no value)
  const isFieldIncomplete = (field: InfoField) => {
    return field.required && (!field.value || field.value.trim() === "")
  }

  // Check if a table is incomplete
  const isTableIncomplete = (table: InfoTable) => {
    return table.required && (!table.data || table.data.length === 0)
  }

  // Get field validation status
  const getFieldValidationStatus = (field: InfoField): ValidationStatus => {
    // Directly use field.id as the key for consistency
    const fieldId = field.id;

    // console.log("getFieldValidationStatus - fieldId:", fieldId); // Keep this for your own debugging if needed
    // console.log("getFieldValidationStatus - validationStatuses:", validationStatuses); // Keep this for your own debugging if needed

    if (validationStatuses[fieldId]) {
      // console.log("✅ Found validation by fieldId:", validationStatuses[fieldId]); // Keep this for your own debugging if needed
      return validationStatuses[fieldId];
    }

    // Otherwise, if it's a required field with no value, mark as missing
    if (isFieldIncomplete(field)) {
      // console.log("⚠️ Field is incomplete:", field); // Keep this for your own debugging if needed
      return "missing";
    }

    // Default
    return field.validationStatus || "unvalidated";
  };


  // Get table validation status
  const getTableValidationStatus = (table: InfoTable): ValidationStatus => {
    const tableId = table.id;

    console.log("getTableValidationStatus - tableId:", tableId); // Keep this for your own debugging if needed
    console.log("getTableValidationStatus - tableValidationStatuses:", tableValidationStatuses); // Keep this for your own debugging if needed


    if (tableValidationStatuses[tableId]) {
      console.log("✅ Found validation by tableId:", tableValidationStatuses[tableId]); // Keep this for your own debugging if needed
      return tableValidationStatuses[tableId];
    }

    // Otherwise, if it's a required table with no data, mark as missing
    if (isTableIncomplete(table)) {
      return "missing";
    }

    // Default to unvalidated
    return table.validationStatus || "unvalidated";
  };


  // Update field validation status
  const updateFieldValidation = (field: InfoField, status: ValidationStatus) => {
    console.log("updateFieldValidation - field: ", field, "status: ", status); // Keep this for your own debugging if needed
    const fieldId = field.id; // Use field.id directly
    setValidationStatuses((prev) => ({
      ...prev,
      [fieldId]: status, // Store using field.id
    }))

    // Call the callback if provided
    if (onValidationChange) {
      onValidationChange(field.id, status)
    }
  }

  // Update table validation status
  const updateTableValidation = (table: InfoTable, status: ValidationStatus) => {
    setTableValidationStatuses((prev) => ({
      ...prev,
      [table.id]: status,
    }))

    // Call the callback if provided
    if (onTableValidationChange) {
      onTableValidationChange(table.id, status)
    }
  }

  const validateAll = (status: ValidationStatus) => {
    // console.log("🔄 Starting validation for all fields and tables with status:", status); // Keep this for your own debugging if needed

    // Validate all fields
    const newFieldStatuses: Record<string, ValidationStatus> = {};
    fields.forEach((field) => {
      newFieldStatuses[field.id] = status; // Use field.id as the key

      // console.log(`✅ Validating field [${field.id}] with status: ${status}`); // Keep this for your own debugging if needed

      if (onValidationChange) {
        // console.log(`🔔 Calling onValidationChange for field [${field.id}]`); // Keep this for your own debugging if needed
        onValidationChange(field.id, status);
      }
    });

    setValidationStatuses((prev) => {
      const updated = { ...prev, ...newFieldStatuses };
      // console.log("🧾 Updated field validation statuses:", updated); // Keep this for your own debugging if needed
      return updated;
    });

    // Validate all tables
    const newTableStatuses: Record<string, ValidationStatus> = {};
    tables.forEach((table) => {
      const tableStatus = status === "missing" && isTableIncomplete(table) ? "missing" : status; // Only mark as missing if truly incomplete
      newTableStatuses[table.id] = tableStatus;

      // console.log(`📊 Validating table [${table.id}] with status: ${tableStatus}`); // Keep this for your own debugging if needed

      if (onTableValidationChange) {
        // console.log(`🔔 Calling onTableValidationChange for table [${table.id}]`); // Keep this for your own debugging if needed
        onTableValidationChange(table.id, tableStatus);
      }
    });

    setTableValidationStatuses((prev) => {
      const updated = { ...prev, ...newTableStatuses };
      // console.log("🧾 Updated table validation statuses:", updated); // Keep this for your own debugging if needed
      return updated;
    });
  };


  // Clear all validation statuses
  const clearAllValidations = () => {
    // Clear field validations
    const newFieldStatuses: Record<string, ValidationStatus> = {}
    fields.forEach((field) => {
      newFieldStatuses[field.id] = "unvalidated" // Use field.id

      // Call the callback for each field if provided
      if (onValidationChange) {
        onValidationChange(field.id, "unvalidated")
      }
    })
    setValidationStatuses(newFieldStatuses)

    // Clear table validations
    const newTableStatuses: Record<string, ValidationStatus> = {}
    tables.forEach((table) => {
      newTableStatuses[table.id] = "unvalidated"

      // Call the callback for each table if provided
      if (onTableValidationChange) {
        onTableValidationChange(table.id, "unvalidated")
      }
    })
    setTableValidationStatuses(newTableStatuses)
  }

  // Get all fields with validation issues
  const getValidationIssues = () => {
    const issues = {
      incorrect: [] as { label: string; type: "field" | "table"; status: ValidationStatus },
      missing: [] as { label: string; type: "field" | "table"; status: ValidationStatus },
    }

    // Check fields
    fields.forEach((field) => {
      const status = getFieldValidationStatus(field)
      if (status === "incorrect") {
        issues.incorrect.push({ label: field.label, type: "field", status })
      } else if (status === "missing") {
        issues.missing.push({ label: field.label, type: "field", status })
      }
    })

    // Check tables
    tables.forEach((table) => {
      const status = getTableValidationStatus(table)
      if (status === "incorrect") {
        issues.incorrect.push({ label: table.id, type: "table", status })
      } else if (status === "missing") {
        issues.missing.push({ label: table.id, type: "table", status })
      }
    })

    return issues
  }

  const validationIssues = getValidationIssues()
  const hasValidationIssues = validationIssues.incorrect.length > 0 || validationIssues.missing.length > 0

  // Get status icon
  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "missing":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  // Get status color classes
  const getStatusClasses = (status: ValidationStatus) => {
    switch (status) {
      case "correct":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        }
      case "incorrect":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        }
      case "missing":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        }
      default:
        return {
          bg: "",
          text: "text-gray-500",
          border: "",
        }
    }
  }

  return (
    <div className={cn("w-full rounded-md border bg-white", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium border-b"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-6">
          {/* Check All section */}
          {editable && (fields.length > 0 || tables.length > 0) && (
            <div className="pt-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Pengesahan Semua Maklumat</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => validateAll("correct")}
                    className="py-1 px-3 text-xs rounded-md flex items-center justify-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span>Semua Betul</span>
                  </button>
                  <button
                    onClick={() => validateAll("incorrect")}
                    className="py-1 px-3 text-xs rounded-md flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="h-3 w-3" />
                    <span>Semua Salah</span>
                  </button>
                  <button
                    onClick={() => validateAll("missing")}
                    className="py-1 px-3 text-xs rounded-md flex items-center justify-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>Semua Kurang</span>
                  </button>
                  <button
                    onClick={clearAllValidations}
                    className="py-1 px-3 text-xs rounded-md flex items-center justify-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Kosongkan</span>
                  </button>
                </div>
              </div>
              <div className="mt-2 h-px bg-gray-100"></div>
            </div>
          )}

          {/* Regular fields section */}
          {fields.length > 0 && (
            <div className="space-y-4">
              {rowIds.map((rowId) => {
                const rowFields = groupedFields[rowId]
                const fieldCount = rowFields.length

                return (
                  <div key={rowId} className="flex flex-wrap -mx-2">
                    {rowFields.map((field, index) => {
                      // Determine width based on field.width or default based on fieldCount
                      let widthClass = "w-full md:w-1/3 px-2"

                      if (field.width === "full" || fieldCount === 1) {
                        widthClass = "w-full px-2"
                      } else if (field.width === "half" || fieldCount === 2) {
                        widthClass = "w-full md:w-1/2 px-2"
                      } else if (field.width === "third" || fieldCount === 3) {
                        widthClass = "w-full md:w-1/3 px-2"
                      }

                      const validationStatus = getFieldValidationStatus(field)
                      const statusClasses = getStatusClasses(validationStatus)

                      return (
                        <div key={`${rowId}-${index}`} className={widthClass}>
                          <div
                            className={cn(
                              "space-y-1 p-3 rounded-md border",
                              validationStatus !== "unvalidated" && statusClasses.bg,
                              validationStatus !== "unvalidated" && statusClasses.border,
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <p
                                className={cn(
                                  "text-sm",
                                  validationStatus !== "unvalidated" ? statusClasses.text : "text-gray-500",
                                )}
                              >
                                {field.label} /{validationStatus} {/* Added /validationStatus for debugging */}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </p>

                              {getStatusIcon(validationStatus)}
                            </div>

                            <p className={cn("font-medium", validationStatus !== "unvalidated" && statusClasses.text)}>
                              {field.value || "-"}
                            </p>

                            {validationStatus === "incorrect" && (
                              <p className="text-xs text-red-600 mt-1">
                                {field.errorMessage || "Maklumat tidak tepat"}
                              </p>
                            )}
                            {validationStatus === "missing" && (
                              <p className="text-xs text-amber-600 mt-1">
                                {field.errorMessage || "Maklumat tidak lengkap"}
                              </p>
                            )}

                            {editable && !field.hideValidationButtons && (
                              <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                                <button
                                  onClick={() => updateFieldValidation(field, "correct")}
                                  className={cn(
                                    "flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center gap-1",
                                    validationStatus === "correct"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600",
                                  )}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Betul</span>
                                </button>
                                <button
                                  onClick={() => updateFieldValidation(field, "incorrect")}
                                  className={cn(
                                    "flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center gap-1",
                                    validationStatus === "incorrect"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600",
                                  )}
                                >
                                  <XCircle className="h-3 w-3" />
                                  <span>Salah</span>
                                </button>
                                <button
                                  onClick={() => updateFieldValidation(field, "missing")}
                                  className={cn(
                                    "flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center gap-1",
                                    validationStatus === "missing"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-600",
                                  )}
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Kurang</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {extra && <div>{extra}</div>}

          {/* Tables section */}
          {tables.length > 0 && (
            <div className="space-y-6 pt-2">
              {tables.map((table, tableIndex) => {
                const validationStatus = getTableValidationStatus(table)
                const statusClasses = getStatusClasses(validationStatus)
                const incomplete = isTableIncomplete(table)

                return (
                  <div
                    key={tableIndex}
                    className={cn(
                      "space-y-2 p-4 rounded-md border",
                      validationStatus !== "unvalidated" && statusClasses.bg,
                      validationStatus !== "unvalidated" && statusClasses.border,
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-medium text-base",
                            validationStatus !== "unvalidated" ? statusClasses.text : "text-gray-700",
                          )}
                        >
                          {table.title}
                          {table.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        {getStatusIcon(validationStatus)}
                      </div>

                      {incomplete && validationStatus === "unvalidated" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Data Diperlukan
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            {table.columns.map((column, colIndex) => (
                              <th
                                key={colIndex}
                                className={cn("py-2 px-3 text-left text-sm font-medium text-gray-500", column.width)}
                              >
                                {column.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.data.length > 0 ? (
                            table.data.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b">
                                {table.columns.map((column, colIndex) => (
                                  <td key={colIndex} className="py-3 px-3">
                                    {row[column.accessor] || ""}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={table.columns.length} className="py-3 px-3 text-center">
                                Tiada rekod
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {validationStatus === "incorrect" && (
                      <p className="text-xs text-red-600 mt-1">{table.errorMessage || "Data tidak tepat"}</p>
                    )}
                    {validationStatus === "missing" && (
                      <p className="text-xs text-amber-600 mt-1">{table.errorMessage || "Data tidak lengkap"}</p>
                    )}

                    {editable && (
                      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => updateTableValidation(table, "correct")}
                          className={cn(
                            "flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center gap-1",
                            validationStatus === "correct"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600",
                          )}
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Betul</span>
                        </button>
                        <button
                          onClick={() => updateTableValidation(table, "incorrect")}
                          className={cn(
                            "flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center gap-1",
                            validationStatus === "incorrect"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600",
                          )}
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Salah</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Validation issues header and separator */}
          {hasValidationIssues && (
            <div className="pt-4">
              <div className="flex items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Ringkasan Isu Pengesahan</h3>
                <div className="ml-3 flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Validation issues summary - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Incorrect fields and tables */}
                {validationIssues.incorrect.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-md border border-red-100">
                    <h4 className="text-sm font-medium text-red-800 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Maklumat Tidak Tepat
                    </h4>
                    <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                      {validationIssues.incorrect.map((issue, index) => (
                        <li key={index}>
                          {issue.label}
                          {issue.type === "table" && <span className="text-xs ml-1">(Jadual)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing fields and tables */}
                {validationIssues.missing.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                    <h4 className="text-sm font-medium text-amber-800 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Maklumat Tidak Lengkap
                    </h4>
                    <ul className="mt-2 text-sm text-amber-700 list-disc pl-5 space-y-1">
                      {validationIssues.missing.map((issue, index) => (
                        <li key={index}>
                          {issue.label}
                          {issue.type === "table" && <span className="text-xs ml-1">(Jadual)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}