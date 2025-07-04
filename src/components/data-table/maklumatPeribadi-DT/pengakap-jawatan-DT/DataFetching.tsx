import { Jawatan } from "./columns";

export async function getData(): Promise<Jawatan[]> {
  return [
    {
      id: "1",
      jawatan: "PESURUHJAYA",
      peringkat: "KUMPULAN",
      tahunMula: "2010",
      tahunTamat: "KINI",
    },
    {
      id: "2",
      jawatan: "PEMIMPIN",
      peringkat: "KUMPULAN",
      tahunMula: "2006",
      tahunTamat: "2006",
    },
    


  ]
}