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

export default function LihatPermohonan() {

  const pathname = usePathname();
  const dispatch = useDispatch();
  const validatedBorangId = useSelector((state: RootState) => state.penilaianTauliah.validatedBorangId);

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
      href: `${pathname}/ppm`,
      color: "blue",
      status: "lihat"
    },
    {
      id: "cv",
      title: "Borang CV",
      description: "Maklumat peribadi dan butir-butir lengkap",
      icon: <User className="h-8 w-8" />,
      href: `${pathname}/cv`,
      color: "green",
      status: "lihat",
    },
    {
      id: "dokumen",
      title: "Borang Dokumen",
      description: "Sijil, kad pengenalan dan dokumen penting",
      icon: <FileText className="h-8 w-8" />,
      href: `${pathname}/dokumen`,
      color: "red",
      status: "lihat",
    },
  ]) 

  const handleClearState = () => {
    // You might want to add a confirmation here
    const confirmClear = window.confirm("Are you sure you want to clear all Penilaian Tauliah state data?");
    if (confirmClear) {
      dispatch(clearPenilaianTauliahState());
      alert("Penilaian Tauliah state has been cleared!");
      console.log("Penilaian Tauliah state cleared to initial state.");
    }
  };
  
  const PPM = localStorage.getItem("borangTauliah")
  console.log("borangTauliah in main:", PPM)

  return (
    <div className="">
          

      <div className="mb-10">
        <FormCardsGrid forms={formData} />
      </div>   

    </div>
  )
}
