"use client"


import { useEffect, useState } from "react";
// import { fetchAlamatData, fetchKumpulanData } from "@/api/dataService";


const fetchKumpulanData = async () => {
    return {
      namaKumpulan: "SK Peserai",
      noKumpulan: "123456-78-9012",
      kodKumpulan: "JEA0009",
      noM: "60123456789",
      daerah: "Batu Pahat",
      tarikhBerdaftar: "29/01/1997",
      negeri: "Johor",
    };
};
  
const fetchAlamatData = async () => {
  return {
    alamatKumpulan: "SK Peserai",
    poskod: "40105",
    daerah: "Batu Pahat",
    negeri: "Johor",
  };
};

export function useProfilData() {
  const [kumpulanData, setKumpulanData] = useState<any>(null);
  const [alamatData, setAlamatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const kumpulan = await fetchKumpulanData();
        const alamat = await fetchAlamatData();

        setKumpulanData(kumpulan);
        setAlamatData(alamat);
      } catch (err) {
        console.error("Error loading profil data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { kumpulanData, alamatData, loading };
}
