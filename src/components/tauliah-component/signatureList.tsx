// ... (existing imports and component structure)

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "@components/lib/supabaseClient"
import {
  ChevronDown, ChevronUp, Check, Clock, AlertCircle, User, UserCheck,
} from "lucide-react"
import { cn, formatDate } from "@components/lib/utils"
import { SignatureCard } from "./signatureCard"
import { RootState } from "@components/lib/store"
import { getCachedUser } from "@components/lib/utils"
import { setOfficerList } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice"

export type SignerStatus = "pending" | "signed" | "rejected"

export interface Signer {
  id: string
  name: string
  role: string
  email?: string
  status: SignerStatus
  signatureUrl?: string | null
  signatureDate?: string
  order?: number
  isCurrentUser?: boolean
}

export interface SignatureListProps {
  title: string
  defaultOpen?: boolean
  className?: string
  onSignatureChange?: (signerId: string, signatureData: string | null) => void
  onSignerStatusChange?: (signerId: string, status: SignerStatus) => void
  readOnly?: boolean
  validationIssuesExist?: boolean
}

export function SignatureList({
  title,
  defaultOpen = true,
  className,
  onSignatureChange,
  onSignerStatusChange,
  readOnly = false,
}: SignatureListProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [expandedSignerId, setExpandedSignerId] = useState<string | null>(null)
  const [signers, setSigners] = useState<Signer[]>([])

  const dispatch = useDispatch();
  const {
    leaderId,
    teamDistrict,
    credentialApplicationId 
  } = useSelector((state: RootState) => state.penilaianTauliah);
  
  const negeri = "Johor" 

  useEffect(() => {
    const fetchSigners = async () => {
      const signerList: Signer[] = []

      const user = await getCachedUser()
      if (!user) return;

      const fetchValidationStatus = async (officerId: string) => {
        if (!credentialApplicationId) return null; 

        const { data, error } = await supabase
          .from("credential_officer_validation")
          .select(`
            officer_sign_url,
            created_at
          `)
          .eq("credential_application_id", credentialApplicationId)
          .eq("officer_id", officerId)
          .single();

        console.log(`id ${credentialApplicationId} sign table data for ${officerId} `,data)

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
          console.error(`Error fetching validation for ${officerId}:`, error);
        }
        return data;
      };

      // Fetch Pemimpin Kumpulan
      const { data: leader } = await supabase
        .from("users")
        .select('user_id, fullname, email')
        .eq("user_id", leaderId)
        .single()

      if (leader) {
        const validation = await fetchValidationStatus(leader.user_id);
        signerList.push({
          id: leader.user_id,
          name: leader.fullname || 'Pemimpin Kumpulan', // Fallback for name
          role: "Pemimpin Kumpulan",
          email: leader.email,
          status: validation && validation.officer_sign_url ? "signed" : "pending",
          signatureUrl: validation?.officer_sign_url || null,
          signatureDate: validation?.created_at || "-",
          order: 1,
          isCurrentUser: leader.user_id === user.id,
        })
      }

      // Fetch Setiausaha PPM Daerah
      const { data: setiausaha, error: setiausahaError } = await supabase
        .from("scouts")
        .select(`
          user_id,
          position,
          district,
          users (user_id, fullname, email)
        `)
        .eq("position", "Setiausaha PPM Daerah")
        .eq("district", teamDistrict)
        .single();

      console.log("error setiausaha: ", setiausahaError)

      if (setiausaha && setiausaha.users) {
        const validation = await fetchValidationStatus(setiausaha.user_id);
        signerList.push({
          id: setiausaha.user_id,
          name: setiausaha.users.fullname || 'Setiausaha PPM Daerah', // Fallback for name
          role: "Setiausaha PPM Daerah",
          email: setiausaha.users.email,
          status: validation && validation.officer_sign_url ? "signed" : "pending",
          signatureUrl: validation?.officer_sign_url || null,
          signatureDate: validation?.created_at || undefined,
          order: 2,
          isCurrentUser: setiausaha.user_id === user.id,
        })
      }

      // Fetch Pesuruhjaya Pengakap Negeri
      const { data: pesuruhjaya, error: pesuruhjayaError } = await supabase
        .from("scouts")
        .select(`
          user_id,
          position,
          state,
          users (user_id, fullname, email)
        `)
        .eq("position", "Pesuruhjaya Pengakap PPM Negeri")
        .eq("state", negeri)
        .single();

      console.log("error pesuruhjaya: ", pesuruhjayaError)

      if (pesuruhjaya && pesuruhjaya.users) {
        const validation = await fetchValidationStatus(pesuruhjaya.user_id);
        signerList.push({
          id: pesuruhjaya.user_id,
          name: pesuruhjaya.users.fullname || 'Pesuruhjaya Pengakap Negeri', // Fallback for name
          role: "Pesuruhjaya Pengakap Negeri",
          email: pesuruhjaya.users.email,
          status: validation && validation.officer_sign_url ? "signed" : "pending",
          signatureUrl: validation?.officer_sign_url || null,
          signatureDate: formatDate(validation?.created_at) || undefined,
          order: 3,
          isCurrentUser: pesuruhjaya.user_id === user.id,
        })
      }

      console.log("final signer list: ", signerList)
      setSigners(signerList)

      const fetchedOfficerList = [
        { level: "pemimpin kumpulan", id: leader?.user_id || null },
        { level: "daerah", id: setiausaha?.user_id || null },
        { level: "negeri", id: pesuruhjaya?.user_id || null },
      ];
      dispatch(setOfficerList(fetchedOfficerList));
    }

    fetchSigners()
  }, [leaderId, teamDistrict, credentialApplicationId])


  const sortedSigners = [...signers].sort((a, b) => (a.order! - b.order!))

  const getStatusIcon = (status: SignerStatus) => {
    switch (status) {
      case "signed": return <Check className="h-4 w-4 text-emerald-500" />
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getStatusText = (status: SignerStatus) => {
    switch (status) {
      case "signed": return "Telah ditandatangani"
      case "pending": return "Menunggu tandatangan"
      case "rejected": return "Ditolak"
      default: return ""
    }
  }

  const getStatusClasses = (status: SignerStatus) => {
    switch (status) {
      case "signed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      case "rejected": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleSignatureChange = (signerId: string, signatureData: string | null) => {
    if (onSignatureChange) onSignatureChange(signerId, signatureData)
    // When a signature is changed (uploaded), update its status to 'signed'
    if (signatureData && onSignerStatusChange) onSignerStatusChange(signerId, "signed")

    // OPTIONAL: Immediately update the local state for this signer
    setSigners(prevSigners =>
      prevSigners.map(signer =>
        signer.id === signerId
          ? { ...signer, status: "signed", signatureUrl: signatureData, signatureDate: new Date().toISOString() }
          : signer
      )
    );
  }

  const toggleExpandSigner = (signerId: string) => {
    setExpandedSignerId((prev) => (prev === signerId ? null : signerId))
  }

  return (
    <div className={cn("w-full rounded-md border bg-white", className)}>
      
      {/* MAIN CONTAINER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium border-b"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <div className="flex -space-x-2">

            {/* OFFICER LIST IN CIRCLE */}
            {sortedSigners.slice(0, 3).map((signer) => (
              <div key={signer.id} className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 border-white text-xs font-medium",
                getStatusClasses(signer.status)
              )}>
                {signer.name?.charAt(0) || ''}
              </div>
            ))}
            {signers.length > 3 && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-600">
                +{signers.length - 3}
              </div>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4">

          {/* NUMBER AND PROGRESS BAR SIGNED OFFICER */}
          <div className="flex items-center justify-between mb-2">
            
            {/* NUMBER OF SIGNED OFFICER */}
            <div className="text-sm text-gray-500">
              {signers.filter((s) => s.status === "signed").length} dari {signers.length} telah menandatangani
            </div>

            {/* PROGRESS BAR SIGNED OFFICER */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${(signers.filter((s) => s.status === "signed").length / (signers.length || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* OFFICER CARD */}
          <div className="space-y-3">
            {sortedSigners.map((signer) => (
              <div key={signer.id} className={cn(
                "border rounded-md overflow-hidden",
                signer.isCurrentUser ? "border-emerald-200" : "border-gray-200"
              )}>
                <div
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer",
                    signer.isCurrentUser ? "bg-emerald-50" : "bg-gray-50"
                  )}
                  onClick={() => toggleExpandSigner(signer.id)}
                >
                  <div className="flex items-center gap-3">
                    
                    {/* OFFICER AVATAR, CARD COLOR */}
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-white",
                      signer.status === "signed" ? "bg-emerald-500" : "bg-gray-400"
                    )}>
                      {signer.status === "signed" ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    {/* OFFICER NAME, CURRENT USER */}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {signer.name}
                        {signer.isCurrentUser && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Anda</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{signer.role}</div>
                    </div>
                  </div>

                  {/* OFFICER SIGNATURE STATUS */}
                  <div className="flex items-center gap-2">
                    
                    {/* STATUS COLOR */}
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                      getStatusClasses(signer.status)
                    )}>
                      
                      {/* STATUS ICON, TEXT */}
                      {getStatusIcon(signer.status)}
                      <span>{getStatusText(signer.status)}</span>
                    </div>
                    {expandedSignerId === signer.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedSignerId === signer.id && (
                  <div className="p-3 border-t border-gray-200">
                    <SignatureCard
                      title={`Tandatangan ${signer.role}`}
                      mode={signer.isCurrentUser && !readOnly ? "upload" : "display"}
                      signatureUrl={signer.signatureUrl}
                      signatureDate={signer.signatureDate}
                      isCurrentUser={signer.isCurrentUser}
                      onSignatureChange={
                        signer.isCurrentUser && !readOnly
                          ? (signatureData) => handleSignatureChange(signer.id, signatureData)
                          : undefined
                      }
                      note={
                        signer.isCurrentUser && !readOnly
                          ? "Sila tandatangan di bawah untuk mengesahkan maklumat yang diberikan adalah benar."
                          : signer.status === "signed"
                            ? `Telah ditandatangani pada ${signer.signatureDate ? new Date(signer.signatureDate).toLocaleDateString() : ""}`
                            : "Menunggu tandatangan"
                      }
                      className="border-0 shadow-none"
                      additionalFields={
                        <div className="space-y-2">
                          {signer.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Email:</span>
                              <span className="font-medium text-gray-700">{signer.email}</span>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}