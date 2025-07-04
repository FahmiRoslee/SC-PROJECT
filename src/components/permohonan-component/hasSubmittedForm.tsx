'use client'

import { useRouter } from 'next/navigation'
import { CheckCircleIcon } from 'lucide-react'

export default function ApplicationSubmittedCard() {
  const router = useRouter()

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <CheckCircleIcon className="h-6 w-6 text-green-600" />
        <h2 className="text-lg font-semibold text-green-700">
          Permohonan Telah Dihantar
        </h2>
      </div>
      <p className="text-sm text-green-800">
        Anda telah menghantar permohonan terkini. Jika anda ingin membuat permohonan baharu, sila hubungi pentadbir atau batalkan permohonan sedia ada terlebih dahulu.
      </p>

    <button
    onClick={() => router.push('/dashboard/tauliah/permohanan-tauliah/status-permohonan')}
    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
    >
    Lihat Status Permohonan
    </button>
    </div>
  )
}
