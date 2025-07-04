'use client'

import { useEffect, useState } from 'react'
import { supabase } from "@components/lib/supabaseClient";
import PermohananTauliahForm from '@components/components/permohonan-component/permohonanTauliahForm'
import { Session } from '@supabase/supabase-js'
import { CheckCircleIcon } from 'lucide-react';
import ApplicationSubmittedCard from '@components/components/permohonan-component/hasSubmittedForm';

export default function Permohonan() {
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null >(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserStatus = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('User not logged in:', userError)
        setHasSubmitted(false)
        return
      }

      const userId = user.id
      console.log("user id:", user.id)
      setUserId(userId)

      const { data, error } = await supabase
        .from('credential_application')
        .select('isCurrent_application')
        .eq('applicant_id', userId)
        .eq('isCurrent_application', true)

      console.log("data isCurrent: ",data)

      if (error) {
        console.error('Error checking form status:', error)
        setHasSubmitted(false)
        return
      }

      if(data.length != 0) {
        setHasSubmitted(true)
        console.log("has submit")
      }
      else{
        setHasSubmitted(false)
        console.log("not submit")
      }
      // setHasSubmitted(!!data) // true if an active form exists
    }

    fetchUserStatus()
  }, [])

  if (hasSubmitted === null) {
    return <p>Loading...</p>
  }

  return (
    <div className="">
      {hasSubmitted ? (
        <ApplicationSubmittedCard/>
      ) : (
        <PermohananTauliahForm />
      )}
    </div>
  )

}
