"use client"

import { useState, useEffect, useRef } from "react" // Import useRef for preventing infinite loops
import { FileText, Download, Eye, X, ChevronRight, Check, Minus } from "lucide-react"
import { cn } from "@components/lib/utils" // Assuming cn is a utility for combining class names

// Re-exporting these types for consistency and easy import elsewhere
export type DocumentColor = "blue" | "green" | "red" | "purple" | "amber" | "cyan"
export type ValidationStatus = "correct" | "incorrect" | "missing" | "unvalidated"

interface DocumentValidationCardProps {
  id: string
  title: string
  fileName: string
  fileUrl: string
  uploadDate?: string
  className?: string
  iconColor?: DocumentColor
  onValidationChange?: (id: string, status: ValidationStatus) => void // Changed title to id for consistency
  required?: boolean
  isCleared?: boolean // New prop to signal clear operation from parent
}

export function DocumentValidationCard({
  id,
  title,
  fileName,
  fileUrl,
  uploadDate,
  className,
  iconColor = "blue",
  onValidationChange,
  required = true,
  isCleared, // Destructure the new prop
}: DocumentValidationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Initialize validationStatus for THIS card only.
  // Default to 'missing' if required and no fileUrl, otherwise 'unvalidated'.
  const initialStatus = required && !fileUrl ? "missing" : "unvalidated"
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(initialStatus)

  // Ref to track if initial local storage load has happened to prevent re-initializing
  const isInitialLoadRef = useRef(true)

  // Effect to reset internal state when `isCleared` prop changes to true
  // This should only trigger a state update if `isCleared` actually becomes true
  useEffect(() => {
    if (isCleared) {
      const newStatus = required && !fileUrl ? "missing" : "unvalidated"
      if (validationStatus !== newStatus) { // Only update if status actually changes
        setValidationStatus(newStatus)
        onValidationChange?.(id, newStatus) // Notify parent of the change
      }
    }
    // No need to set isCleared to false here. The parent component is responsible for toggling it.
    // If the parent sets isCleared to true, this component will reset.
    // If the parent sets it back to false, this effect won't run again for that specific reset.
  }, [isCleared, required, fileUrl, id, validationStatus, onValidationChange])


  // Effect to restore validation status from local storage on component mount
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      return // Only run once after initial mount or when specific deps change intentionally
    }

    const stored = localStorage.getItem("borangTauliah")

    if (!stored) {
      console.log("No 'borangTauliah' found in localStorage. Skipping restoration for", id);
      isInitialLoadRef.current = false; // Mark as loaded even if no data
      return;
    }

    try {
      const parsed = JSON.parse(stored)
      const { validationIssues, correctFields } = parsed

      let restoredStatus: ValidationStatus | undefined

      // Check if the current 'id' exists in validationIssues (newer format)
      if (validationIssues) {
        if (validationIssues.correct?.includes(id)) {
          restoredStatus = "correct"
        } else if (validationIssues.incorrect?.includes(id)) {
          restoredStatus = "incorrect"
        } else if (validationIssues.missing?.includes(id)) {
          restoredStatus = "missing"
        }
      }

      // Fallback for older 'correctFields' format if not found in validationIssues
      if (!restoredStatus && correctFields?.includes(id)) {
        restoredStatus = "correct"
      }

      if (restoredStatus && validationStatus !== restoredStatus) { // Only update if different
        setValidationStatus(restoredStatus)
        onValidationChange?.(id, restoredStatus)
        console.log(`Restored status for '${id}': ${restoredStatus}`);
      } else if (!restoredStatus && validationStatus !== initialStatus) {
         // If no stored status for this ID, ensure it's set to its initial default
        setValidationStatus(initialStatus)
        onValidationChange?.(id, initialStatus)
        console.log(`No stored status for '${id}'. Setting to initial: ${initialStatus}`);
      }

    } catch (e) {
      console.error(`Failed to parse borangTauliah from localStorage for card ${id}:`, e)
      // On error, reset to default state for this card
      if (validationStatus !== initialStatus) {
        setValidationStatus(initialStatus)
        onValidationChange?.(id, initialStatus)
      }
    } finally {
      isInitialLoadRef.current = false; // Mark as loaded after attempt
    }
  }, [id, required, fileUrl, onValidationChange, initialStatus, validationStatus]) // Add validationStatus to deps to avoid stale closure issues

  // Define color variants (UNCHANGED)
  const colorVariants = {
    blue: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      cardGlow: "before:bg-blue-400/10",
      buttonBg: "bg-blue-500",
      buttonHover: "hover:bg-blue-600",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      border: "border-blue-200",
    },
    red: {
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      cardGlow: "before:bg-red-400/10",
      buttonBg: "bg-red-500",
      buttonHover: "hover:bg-red-600",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-600",
      border: "border-red-200",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      cardGlow: "before:bg-emerald-400/10",
      buttonBg: "bg-emerald-500",
      buttonHover: "hover:bg-emerald-600",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-emerald-600",
      border: "border-emerald-200",
    },
    purple: {
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      cardGlow: "before:bg-purple-400/10",
      buttonBg: "bg-purple-500",
      buttonHover: "hover:bg-purple-600",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
      border: "border-purple-200",
    },
    amber: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      cardGlow: "before:bg-amber-400/10",
      buttonBg: "bg-amber-500",
      buttonHover: "hover:bg-amber-600",
      gradientFrom: "from-amber-500",
      gradientTo: "to-amber-600",
      border: "border-amber-200",
    },
    cyan: {
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-500",
      cardGlow: "before:bg-cyan-400/10",
      buttonBg: "bg-cyan-500",
      buttonHover: "hover:bg-cyan-600",
      gradientFrom: "from-cyan-500",
      gradientTo: "to-cyan-600",
      border: "border-cyan-200",
    },
  }

  const colors = colorVariants[iconColor]

  // Validation status styling (UNCHANGED)
  const getValidationStyling = () => {
    switch (validationStatus) {
      case "correct":
        return {
          border: "border-green-200 bg-green-50/50",
          badge: "bg-green-100 text-green-700 border-green-200",
          icon: <Check className="h-3 w-3" />,
          text: "Betul",
        }
      case "incorrect":
        return {
          border: "border-red-200 bg-red-50/50",
          badge: "bg-red-100 text-red-700 border-red-200",
          icon: <X className="h-3 w-3" />,
          text: "Salah",
        }
      case "missing":
        return {
          border: "border-amber-200 bg-amber-50/50",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Minus className="h-3 w-3" />,
          text: "Kurang",
        }
      default:
        return {
          border: "border-gray-100",
          badge: "",
          icon: null,
          text: "",
        }
    }
  }

  const validationStyling = getValidationStyling()

  // Modified handleValidationChange to call parent prop
  const handleValidationChange = (status: ValidationStatus) => {
    // Only update state if the status is actually changing
    if (validationStatus !== status) {
      setValidationStatus(status)
      // Only call parent callback if it's provided
      onValidationChange?.(id, status)
    }
  }

  return (
    <>
      <div
        className={cn(
          "relative bg-white rounded-xl border hover:shadow-sm transition-all duration-300 overflow-hidden group",
          "before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
          colors.cardGlow,
          validationStyling.border,
          className,
        )}
      >
        {/* Validation Status Badge */}
        {validationStatus !== "unvalidated" && (
          <div className="absolute top-4 right-4 z-10">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                validationStyling.badge,
              )}
            >
              {validationStyling.icon}
              <span>{validationStyling.text}</span>
            </div>
          </div>
        )}

        {/* Document Icon and Info */}
        <div className="p-6 text-center">
          <div
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-transform duration-300 group-hover:scale-110",
              colors.iconBg,
            )}
          >
            <FileText className={cn("h-10 w-10", colors.iconColor)} />
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-1">{fileName}</p>
          {uploadDate && <p className="text-xs text-gray-400">Dimuat naik: {uploadDate}</p>}
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Lihat button clicked for:", title)
                setIsModalOpen(true)
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              style={{ pointerEvents: "auto", zIndex: 10 }}
            >
              <Eye className="h-4 w-4" />
              <span>Lihat</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Download button clicked for:", title)
                // Create a temporary link to trigger download
                const link = document.createElement("a")
                link.href = fileUrl
                link.download = fileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200 cursor-pointer",
                colors.buttonBg,
                colors.buttonHover,
              )}
              style={{ pointerEvents: "auto", zIndex: 10 }}
            >
              <Download className="h-4 w-4" />
              <span>Muat Turun</span>
            </button>
          </div>

          {/* Validation Buttons */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-3 text-center">Status Semakan Dokumen</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Betul button clicked for:", title)
                  handleValidationChange("correct")
                }}
                className={cn(
                  "flex items-center justify-center gap-1 h-8 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer",
                  validationStatus === "correct"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "text-green-600 border border-green-200 hover:bg-green-50 bg-white",
                )}
                style={{ pointerEvents: "auto", zIndex: 10 }}
              >
                <Check className="h-3 w-3" />
                Betul
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Salah button clicked for:", title)
                  handleValidationChange("incorrect")
                }}
                className={cn(
                  "flex items-center justify-center gap-1 h-8 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer",
                  validationStatus === "incorrect"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "text-red-600 border border-red-200 hover:bg-red-50 bg-white",
                )}
                style={{ pointerEvents: "auto", zIndex: 10 }}
              >
                <X className="h-3 w-3" />
                Salah
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Kurang button clicked for:", title)
                  handleValidationChange("missing")
                }}
                className={cn(
                  "flex items-center justify-center gap-1 h-8 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer",
                  validationStatus === "missing"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "text-amber-600 border border-amber-200 hover:bg-amber-50 bg-white",
                )}
                style={{ pointerEvents: "auto", zIndex: 10 }}
              >
                <Minus className="h-3 w-3" />
                Kurang
              </button>
            </div>

            {/* Clear validation button - always visible */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Clear button clicked for:", title)
                handleValidationChange("unvalidated")
              }}
              className={cn(
                "w-full mt-2 h-7 text-xs transition-colors cursor-pointer rounded-md",
                validationStatus !== "unvalidated"
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-gray-50"
                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-50",
              )}
              style={{ pointerEvents: "auto", zIndex: 10 }}
            >
              Kosongkan
            </button>
          </div>
        </div>

        {/* Color accent bar at bottom */}
      </div>

      {/* Enhanced PDF Viewer Modal (UNCHANGED) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.iconBg)}>
                  <FileText className={cn("h-5 w-5", colors.iconColor)} />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">{fileName}</p>
                  {uploadDate && <p className="text-xs text-gray-400">Dimuat naik: {uploadDate}</p>}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {/* Mock PDF Viewer */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 h-[70vh] flex flex-col items-center">
                <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center mb-6", colors.iconBg)}>
                  <FileText className={cn("h-12 w-12", colors.iconColor)} />
                </div>

                <div className={cn("px-3 py-1 rounded-full text-xs font-medium mb-4", colors.iconBg, colors.iconColor)}>
                  {fileName}
                </div>

                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-center mb-8">Paparan dokumen untuk tujuan demonstrasi</p>

                {/* Mock PDF Content */}
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg border-2 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("w-6 h-6 rounded-md", colors.iconBg)}>
                      <div className={cn("w-full h-full flex items-center justify-center", colors.iconColor)}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 italic">
                  Dalam aplikasi sebenar, ini akan memaparkan dokumen PDF yang sebenar.
                </p>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">Format: PDF</p>
              <a
                href={fileUrl}
                download={fileName}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-colors",
                  `bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} hover:opacity-90`,
                )}
              >
                <Download className="h-4 w-4" />
                <span>Muat Turun</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}