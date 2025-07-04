import { DocumentCard } from "./document-card"

interface DocumentCardsSectionProps {
  title?: string
  className?: string
}

export function DocumentCardsSection({ title = "Dokumen Peribadi", className }: DocumentCardsSectionProps) {
  const documents = [
    {
      title: "Sijil Manikayu",
      fileName: "sijil_manikayu.pdf",
      fileUrl: "#", // This would be a real PDF URL in production
    },
    {
      title: "Salinan IC",
      fileName: "salinan_ic.pdf",
      fileUrl: "#", // This would be a real PDF URL in production
    },
    {
      title: "Kad Keahlian Pengakap",
      fileName: "kad_keahlian_pengakap.pdf",
      fileUrl: "#", // This would be a real PDF URL in production
    },
  ]

  return (
    <section className={className}>
      {title && <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {documents.map((doc, index) => (
          <DocumentCard key={index} title={doc.title} fileName={doc.fileName} fileUrl={doc.fileUrl} />
        ))}
      </div>
    </section>
  )
}
