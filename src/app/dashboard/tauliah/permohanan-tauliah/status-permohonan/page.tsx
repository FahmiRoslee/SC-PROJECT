"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/components/ui/card"
import { Badge } from "@components/components/ui/badge"
import { ArrowRight, FileText, TrendingUp, CheckCircle, Clock, XCircle, Circle } from "lucide-react"
import { supabase } from "@components/lib/supabaseClient"
import { usePathname, useRouter } from "next/navigation"

interface ApplicationListProps {
  setCurrentView: React.Dispatch<React.SetStateAction<"landing" | "application" | "status" | "applicationList">>
  setSelectedApplicationType: React.Dispatch<React.SetStateAction<string | null>>
}

const levelOrder = ["pemimpin kumpulan", "daerah", "negeri", "kebangsaan"]

const initialTitles = {
  Kumpulan: ["Penolong Kumpulan", "Pemimpin Kumpulan"],
  Daerah: ["Penolong Pesuruhjaya Daerah", "Pesuruhjaya Daerah"],
  Negeri: ["Penolong Pesuruhjaya Negeri", "Pesuruhjaya Negeri"]
}

export default function ApplicationList({ setCurrentView, setSelectedApplicationType }: ApplicationListProps) {
  
  const router = useRouter(); // Initialize the router
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>("Kumpulan")
  const [applicationCategories, setApplicationCategories] = useState<Record<string, any[]>>({ Kumpulan: [], Daerah: [], Negeri: [] })

  useEffect(() => {
    async function fetchApplications() {
      try {
        const { data, error } = await supabase
          .from("credential_application")
          .select("*")
          .eq("applicant_id", "264eb21d-4338-408d-a8a2-c86affebe0b4")

        if (error) {
          console.error("Fetch error:", error)
          return
        }

        const grouped: Record<string, any[]> = {}
        data.forEach((app) => {
          if (!grouped[app.credential_name]) grouped[app.credential_name] = []
          grouped[app.credential_name].push(app)
        })

        const formatted: Record<string, any[]> = { Kumpulan: [], Daerah: [], Negeri: [] }

        Object.entries(initialTitles).forEach(([category, titles]) => {
          titles.forEach((title) => {
            const list = grouped[title] || []
            const sorted = list.sort(
              (a, b) => levelOrder.indexOf(a.application_level.toLowerCase()) - levelOrder.indexOf(b.application_level.toLowerCase())
            )

            const item = {
              id: title.toLowerCase().replace(/\s+/g, "-"),
              title,
              description: `Permohonan tauliah untuk jawatan ${title}`,
              applications: sorted.map((x: any) => ({
                level: `Peringkat ${x.application_level.charAt(0).toUpperCase() + x.application_level.slice(1)}`,
                status: x.application_status,
              })),
              totalApplications: sorted.length,
              completedApplications: sorted.filter((x) => x.application_status === "lulus").length,
              pendingApplications: sorted.filter((x) => x.application_status === "menunggu").length,
              rejectedApplications: sorted.filter((x) => x.application_status === "ditolak").length,
              currentLevel: sorted.find((x) => x.isCurrent_application)?.application_level || null,
            }

            formatted[category].push(item)
          })
        })

        setApplicationCategories(formatted)
      } catch (err) {
        console.error("Unexpected error:", err)
      }
    }

    fetchApplications()
  }, [])

  const handleCardClick = (applicationType: string, hasApplications: boolean) => {
    if (!hasApplications) {
      console.log(`No applications for ${applicationType}, not redirecting.`);
      return;
    }

    // Construct the dynamic URL path
    // Assuming your dynamic route is structured as `app/status/[applicationName]/page.tsx`
    const targetUrl = `${pathname}/${applicationType}`;

    console.log(`Redirecting to: ${targetUrl}`);
    router.push(targetUrl); // Redirect to the dynamic page
  };

  const getStatusBadge = (completed: number, pending: number, rejected: number) => {
    if (rejected > 0) return <Badge variant="destructive" className="text-xs">Ditolak</Badge>
    if (pending > 0) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Sedang Diproses</Badge>
    if (completed > 0) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Selesai</Badge>
    return <Badge variant="outline" className="text-xs">Tiada Permohonan</Badge>
  }

  const getProgressPercentage = (completed: number, total: number) => total === 0 ? 0 : Math.round((completed / total) * 100)

  const getStatusIcon = (completed: number, pending: number, rejected: number, isSelected: boolean) => {
    const base = "w-3 h-3"
    const selected = isSelected ? "text-white" : ""
    if (rejected > 0) return <XCircle className={`${base} ${isSelected ? selected : "text-red-500"}`} />
    if (pending > 0) return <Clock className={`${base} ${isSelected ? selected : "text-yellow-500"}`} />
    if (completed > 0) return <CheckCircle className={`${base} ${isSelected ? selected : "text-green-500"}`} />
    return <Circle className={`${base} ${isSelected ? selected : "text-gray-400"}`} />
  }

  const getStatusCircleBackground = (completed: number, pending: number, rejected: number, isSelected: boolean) => {
    if (isSelected) return "bg-white/20"
    if (rejected > 0) return "bg-red-50"
    if (pending > 0) return "bg-yellow-50"
    if (completed > 0) return "bg-green-50"
    return "bg-gray-50"
  }

  const currentApplications = applicationCategories[selectedCategory as keyof typeof applicationCategories] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="text-center py-6 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Permohonan {selectedCategory}</h1>
        <p className="text-gray-600">Pilih jenis permohonan untuk melihat status terperinci</p>
      </div>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Kategori</h2>
          <nav className="space-y-3">
            {Object.keys(applicationCategories).map((category) => {
              const apps = applicationCategories[category as keyof typeof applicationCategories]
              const isSelected = selectedCategory === category

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 ${
                    isSelected ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="font-medium text-sm mb-2">{category}</div>
                  <div className={`text-xs font-light ${isSelected ? "opacity-90" : "opacity-75"}`}>
                    {apps.map((app) => (
                      <div key={app.title} className="flex items-center gap-2 mt-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getStatusCircleBackground(
                          app.completedApplications,
                          app.pendingApplications,
                          app.rejectedApplications,
                          isSelected
                        )}`}>
                          {getStatusIcon(
                            app.completedApplications,
                            app.pendingApplications,
                            app.rejectedApplications,
                            isSelected
                          )}
                        </div>
                        <span className="flex-1">{app.title}</span>
                      </div>
                    ))}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="w-full space-y-6">
            {currentApplications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Permohonan Tersedia</h3>
                <p className="text-gray-600">Kategori {selectedCategory} tidak mempunyai jenis permohonan pada masa ini.</p>
              </div>
            ) : (
              currentApplications.map((appType) => {
                const hasApplications = appType.totalApplications > 0

                return (
                  <Card
                    key={appType.id}
                    className={`group transition-all duration-300 border border-gray-200 w-full bg-white ${
                      hasApplications ? "hover:shadow-lg cursor-pointer" : "cursor-default opacity-75"
                    }`}
                    onClick={() => handleCardClick(appType.title, hasApplications)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <CardTitle className={`text-xl font-semibold ${
                              hasApplications ? "text-gray-900 group-hover:text-blue-700 transition-colors" : "text-gray-600"
                            }`}>
                              {appType.title}
                            </CardTitle>
                            <div className="ml-4">
                              {getStatusBadge(
                                appType.completedApplications,
                                appType.pendingApplications,
                                appType.rejectedApplications
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-gray-600">{appType.description}</CardDescription>
                        </div>
                        {hasApplications && (
                          <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 ml-6" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {hasApplications ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Progres Keseluruhan</span>
                            </div>
                            <span className="text-lg font-bold text-blue-700">
                              {getProgressPercentage(appType.completedApplications, appType.totalApplications)}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${getProgressPercentage(appType.completedApplications, appType.totalApplications)}%` }}
                            />
                          </div>
                          {appType.currentLevel && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-blue-700">Peringkat Semasa:</span>
                              <span className="font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded-md">
                                {appType.currentLevel}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Belum ada permohonan</p>
                          <p className="text-xs text-gray-500">Tiada permohonan untuk jawatan ini</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}