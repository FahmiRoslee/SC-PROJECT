"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronUp, Menu, X, Check, AlertCircle } from "lucide-react"
import { cn } from "@components/lib/utils"
import { Badge } from "../ui/badge"

export type FormSection = {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
}

export type NumberingStyle = "alphabetical" | "roman" | "numeric" | "none"

interface FormLayoutProps {
  title: string
  backLink: string
  backLabel?: string
  sections: FormSection[]
  hasValidationIssues: boolean
  isValidated: boolean
  onSubmit: () => void
  numberingStyle?: NumberingStyle
  isOfficer?: boolean
}

export function FormLayout({
  title,
  backLink,
  backLabel = "Kembali ke Halaman Utama",
  sections,
  hasValidationIssues,
  isValidated,
  onSubmit,
  numberingStyle = "alphabetical",
  isOfficer,
}: FormLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Function to generate section numbering based on style
  const getSectionNumbering = (index: number): string => {
    if (numberingStyle === "none") return ""

    if (numberingStyle === "alphabetical") {
      return String.fromCharCode(65 + index) + ". " // A, B, C, ...
    }

    if (numberingStyle === "roman") {
      const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
      return index < romanNumerals.length ? romanNumerals[index] + ". " : `${index + 1}. `
    }

    // Default to numeric
    return `${index + 1}. `
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Check scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)

      // Update active section based on scroll position
      const sectionIds = Object.keys(sectionRefs.current)
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i]
        const sectionRef = sectionRefs.current[sectionId]
        if (sectionRef) {
          const rect = sectionRef.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div></div>
            {/* <Link
              href={backLink}
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{backLabel}</span>
              <span className="sm:hidden">Kembali</span>
            </Link> */}

            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              {title}
            </h1>

            {isOfficer ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Status:</span>
              {isValidated ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Check className="mr-1 h-3 w-3" /> Telah Disemak
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertCircle className="mr-1 h-3 w-3" /> Belum Disemak
                </Badge>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            ) : <div></div>}

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-medium text-gray-700 mb-3 px-3">Navigasi</h2>
              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      activeSection === section.id
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2.5">
                        {section.icon}
                      </div>
                      <span className="truncate">
                        {getSectionNumbering(index)}
                        {section.label}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>

              { isOfficer ? (
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={onSubmit}
                    disabled={hasValidationIssues}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-1 ${
                      !hasValidationIssues ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Semak Borang</span>
                  </button>
                </div>
              ) : null}


            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-30 bg-black/50 md:hidden">
              <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-gray-700">Navigasi</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        activeSection === section.id
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2.5">
                          {section.icon}
                        </div>
                        <span className="truncate">
                          {getSectionNumbering(index)}
                          {section.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onSubmit()
                    }}
                    disabled={hasValidationIssues}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-1 ${
                      !hasValidationIssues ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Semak Borang</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-20"
                ref={(el) => (sectionRefs.current[section.id] = el)}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="border-b px-4 py-3 bg-emerald-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2.5">
                        {section.icon}
                      </div>
                      <h2 className="font-semibold text-emerald-800">
                        {getSectionNumbering(index)}
                        {section.label}
                      </h2>
                    </div>
                  </div>
                  <div className="p-4">{section.content}</div>
                </div>
              </section>
            ))}

            {/* Submit Button - Mobile */}
            { isOfficer ? (
              <div className="md:hidden">
                <button
                  onClick={onSubmit}
                  disabled={hasValidationIssues}
                  className={`w-full px-4 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-1 ${
                    !hasValidationIssues ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  <span>Semak Borang</span>
                </button>
              </div>
            ) : null }

          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors z-20"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </main>
  )
}

