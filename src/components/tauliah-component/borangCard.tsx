"use client"

import type React from "react"

import Link from "next/link"
import { Badge } from "@components/components/ui/badge"
import { Check, AlertCircle } from "lucide-react"
import { cn } from "@components/lib/utils"

// Define form status type
export type FormStatus = "belum-disemak" | "sedang-disemak" | "telah-disemak" | "submitted" | "lihat"

// Define validation issues type
export interface ValidationIssues {
  incorrect: string[]
  missing: string[]
}

// Define form data type
export interface FormCardData {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: "blue" | "green" | "red" | "purple" | "amber" | "cyan"
  status?: FormStatus
  validationIssues?: ValidationIssues
}

interface FormCardProps {
  form: FormCardData
  className?: string
}

export function FormCard({ form, className }: FormCardProps) {
  
  // Get status badge for a form
  const getStatusBadge = (status: FormStatus) => {
    switch (status) {
      case "telah-disemak":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Check className="mr-1 h-3 w-3" /> Telah Disemak
          </Badge>
        )
      case "sedang-disemak":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Sedang Disemak
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Check className="mr-1 h-3 w-3" /> Telah Dihantar
          </Badge>
        )
      case "lihat":
        return (
            <div></div>
        )
      default:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Belum Disemak
          </Badge>
        )
    }
  }

  // Get color classes based on form color
  const getColorClasses = (color: FormCardData["color"]) => {
    const colorMap = {
      blue: {
        glow: "before:bg-blue-400/5",
        iconBg: "bg-blue-50",
        iconText: "text-blue-500",
        linkText: "text-blue-600",
        bottomBar: "bg-blue-500",
      },
      green: {
        glow: "before:bg-emerald-400/5",
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-500",
        linkText: "text-emerald-600",
        bottomBar: "bg-emerald-500",
      },
      red: {
        glow: "before:bg-red-400/5",
        iconBg: "bg-red-50",
        iconText: "text-red-500",
        linkText: "text-red-600",
        bottomBar: "bg-red-500",
      },
      purple: {
        glow: "before:bg-purple-400/5",
        iconBg: "bg-purple-50",
        iconText: "text-purple-500",
        linkText: "text-purple-600",
        bottomBar: "bg-purple-500",
      },
      amber: {
        glow: "before:bg-amber-400/5",
        iconBg: "bg-amber-50",
        iconText: "text-amber-500",
        linkText: "text-amber-600",
        bottomBar: "bg-amber-500",
      },
      cyan: {
        glow: "before:bg-cyan-400/5",
        iconBg: "bg-cyan-50",
        iconText: "text-cyan-500",
        linkText: "text-cyan-600",
        bottomBar: "bg-cyan-500",
      },
    }
    return colorMap[color]
  }

  const colorClasses = getColorClasses(form.color)

  return (
    <Link
      href={form.href}
      className={cn(
        `relative overflow-hidden group bg-white rounded-xl border border-gray-100 shadow-md 
        hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]
        before:absolute before:inset-0 before:opacity-0 before:transition-opacity 
        before:duration-300 group-hover:before:opacity-100`,
        colorClasses.glow,
        className,
      )}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              colorClasses.iconBg,
              colorClasses.iconText,
            )}
          >
            {form.icon}
          </div>
          {getStatusBadge(form.status)} 
        </div>

        <h2 className="text-xl font-semibold mb-3">{form.title}</h2>
        <p className="text-gray-600 mb-6">{form.description}</p>

        {/* Show validation issues if any */}
        {form.validationIssues &&
          (form.validationIssues.incorrect.length > 0 || form.validationIssues.missing.length > 0) && (
            <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-xs font-medium text-amber-800 mb-1">Isu Pengesahan:</p>
              {form.validationIssues.incorrect.length > 0 && (
                <p className="text-xs text-amber-700">Tidak tepat: {form.validationIssues.incorrect.length} item</p>
              )}
              {form.validationIssues.missing.length > 0 && (
                <p className="text-xs text-amber-700">Tidak lengkap: {form.validationIssues.missing.length} item</p>
              )}
            </div>
          )}

        <div className={cn("inline-flex items-center text-sm font-medium", colorClasses.linkText)}>
          {form.status === "telah-disemak" ? "Lihat Borang" : "Semak Borang"}
          <svg
            className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className={cn("absolute bottom-0 left-0 right-0 h-1", colorClasses.bottomBar)}></div>
    </Link>
  )
}
