"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react"

import { Button } from "@components/components/ui/button"

import MainKumplanPageDT from '@components/components/data-table/kumpulan-DT/mainKumpulan-DT/mainKumpulanDT';


export default function KumpulanMainPage() {
  
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = () => {
    const id = '123';
    router.push(`${pathname}/${id}/profil`);
  };

  return (
    
    <div className="container mx-auto py-10">
      
      <MainKumplanPageDT/>

      <Button onClick={handleNavigate}>
        Next
      </Button>
    </div>
  )
}
