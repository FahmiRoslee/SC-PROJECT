"use client";

import React, { useState } from "react";
import { Button } from "@components/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";
import {
  FileText,
  Eye,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function ApplicationPortal() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState<
    "landing" | "application" | "status"
  >("landing");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Portal Permohonan Tauliah
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selamat datang ke portal permohonan tauliah. Pilih salah satu
            pilihan di bawah untuk meneruskan.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Apply for Authorization Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                Mohon Pertauliahan
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Mulakan permohonan tauliah baharu dengan mengisi borang
                permohonan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Borang permohonan digital
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Muat naik dokumen sokongan
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Proses yang mudah dan pantas
                </div>
              </div>
              <Button
                onClick={() => router.push(`${pathname}/borang`)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium group-hover:shadow-lg transition-all duration-300"
              >
                Mula Permohonan
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>

          {/* View Application Status Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                Lihat Status Permohonan
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Semak status permohonan tauliah yang telah dihantar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Jejak status permohonan
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Lihat dokumen yang dihantar
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Kemaskini maklumat jika perlu
                </div>
              </div>
              <Button
                onClick={() => router.push(`${pathname}/status-permohonan`)}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 text-base font-medium group-hover:shadow-lg transition-all duration-300"
              >
                Semak Status
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Maklumat Penting
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  • Pastikan semua dokumen sokongan telah disediakan sebelum
                  memulakan permohonan
                </p>
                <p>
                  • Proses permohonan mengambil masa 5-10 minit untuk
                  diselesaikan
                </p>
                <p>
                  • Status permohonan akan dikemaskini dalam tempoh 3-5 hari
                  bekerja
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
