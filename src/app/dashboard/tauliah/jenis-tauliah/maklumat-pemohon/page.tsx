'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@components/lib/store"
import { clearPenilaianTauliahState, setHasAllBorangId } from "@components/lib/redux/penilaianTauliah/penilaianTauliahSlice"

import { FileText, User, ClipboardList } from "lucide-react"

import SemakanTauliahGuide from "@components/components/tauliah-component/semakanTauliahGuide"
import TandatanganBorangSection from "@components/components/tauliah-component/signatureSection"
import { FormCardsGrid } from "@components/components/tauliah-component/borangCardGrid"
import { FormCardData } from "@components/components/tauliah-component/borangCard"

export default function MaklumatPemohonTauliah() {

  const pathname = usePathname();
  const dispatch = useDispatch();
  const validatedBorangId = useSelector((state: RootState) => state.penilaianTauliah.validatedBorangId);
  
  // useEffect(() => {
  //   const localStorageKey = `borangTauliah`;
  //   const saved = localStorage.getItem(localStorageKey);

  //   if (saved) {
  //     try {
  //       const savedObject = JSON.parse(saved);

  //       // Access the array of IDs from the 'id' property of the parsed object
  //       const checkedIds: string[] = savedObject.id || [];

  //       setFormData(prevFormData => {
  //         return prevFormData.map(item => {
  //           // Check if the item's id exists in the checkedIds array
  //           if (checkedIds.includes(item.id)) {
  //             return { ...item, status: "telah-disemak" };
  //           }
  //           return item;
  //         });
  //       });
  //     } catch (error) {
  //       console.error("Failed to parse localStorage data:", error);
  //     }
  //   }
  // }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("borangTauliah");
      if (!savedData){
        dispatch(setHasAllBorangId(false));
        return;
      }

      const parsedsavedData = JSON.parse(savedData);
      console.log("in parsed: ",parsedsavedData);

      //check the borang card semak status
      setFormData(prevFormData => {
        return prevFormData.map(item => {
          if (validatedBorangId.includes(item.id)) {
            return { ...item, status: "telah-disemak" };
          }
          return item;
        });
      });      

      // check if all the borang is already validated
      const requiredBorangId = ["ppm", "cv", "dokumen"];
      const hasRequiredIds = requiredBorangId.every(id => validatedBorangId.includes(id));
      dispatch(setHasAllBorangId(hasRequiredIds));

    } catch (err) {
      console.error("❌ Failed to parse localStorage data", err);
      dispatch(setHasAllBorangId(false));
    }
  }, [dispatch]);

  const [formData, setFormData] = useState<FormCardData[]>([
    {
      id: "ppm",
      title: "Borang PPM",
      description: "Borang Persatuan Pengakap Malaysia dan maklumat berkaitan",
      icon: <ClipboardList className="h-8 w-8" />,
      href: `${pathname}/borang-ppm`,
      color: "blue",
      status: "belum-disemak",
    },
    {
      id: "cv",
      title: "Borang CV",
      description: "Maklumat peribadi dan butir-butir lengkap",
      icon: <User className="h-8 w-8" />,
      href: `${pathname}/borang-cv`,
      color: "green",
      status: "belum-disemak",
    },
    {
      id: "dokumen",
      title: "Borang Dokumen",
      description: "Sijil, kad pengenalan dan dokumen penting",
      icon: <FileText className="h-8 w-8" />,
      href: `${pathname}/borang-dokumen`,
      color: "red",
      status: "belum-disemak",
    },
  ]) 

  
  const PPM = localStorage.getItem("borangTauliah")
  console.log("borangTauliah in main:", PPM)

  return (
    <div className="container-page">
      <h1 className="font-sans font-bold text-xl ">Permohonan Tauliah</h1>
          
      <SemakanTauliahGuide/>  

      <div className="mb-10">
        <FormCardsGrid forms={formData} />
      </div>   
            
      <TandatanganBorangSection/>
    
    </div>
  )
}
