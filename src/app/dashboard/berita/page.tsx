"use client"

import Link from 'next/link';


import TerbitBeritaDT from "@components/components/data-table/berita-DT/terbitBerita-DT/terbitBeritaDT"
import { Button } from '@components/components/ui/button';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@components/lib/store';


export default function Berita() {

  const pathname = usePathname();
  const count = useSelector((state: RootState) => state.counter.value);


    return (
      <div className="container-page">
        <h1 className="font-sans font-bold text-2xl">Berita Pengakap</h1>
        
        <TerbitBeritaDT/>

        <Link href={`${pathname}/baca-berita`}>
          <Button>
            Baca Berita
          </Button>
        </Link>
      </div>

      

    )
  }