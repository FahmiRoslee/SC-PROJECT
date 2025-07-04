"use client"

import { useState } from "react"
import { FileText, Download, Eye, X } from "lucide-react"
import { cn } from "@components/lib/utils"

interface DocumentCardProps {
  type: string
  title: string
  fileName: string
  fileUrl: string
  className?: string
}3

export function DocumentCard({ type, title, fileName, fileUrl, className }: DocumentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center",
          className,
        )}
      >
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>

        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 truncate max-w-full">{fileName}</p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Lihat</span>
          </button>

          <a
            href={fileUrl}
            download={fileName}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Muat Turun</span>
          </a>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">{title}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {/* Mock PDF Viewer (for demo purposes) */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-[70vh] flex flex-col items-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">{fileName}</h3>
                <p className="text-gray-500 text-center mb-6">PDF preview for demonstration purposes</p>

                {/* Mock PDF Content */}
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 italic">
                  In a real application, this would display the actual PDF document.
                </p>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <a
                href={fileUrl}
                download={fileName}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
