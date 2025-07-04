import { supabase } from "@components/lib/supabaseClient";

import { TerbitBerita } from "./columns";

export async function getDataMock(): Promise<TerbitBerita[]> {
  return [
    {
      id: "1",
      newsImg: "/sk-peserai.png",
      title: "PERJUMPAAN MINGGUAN SK PESERAI",
      createdAt: "01/03/2025",
      status: "active",
    },
    {
      id: "2",
      newsImg: "/image/img-homeDasboard-banner.png",
      title: "MESYUARAT DAERAH BATU PAHAT",
      createdAt: "02/02/2025",
      status: "active",
    },
    {
      id: "3",
      newsImg: "/image/img-beritaJambori.png",
      title: "KOROBORI PENGAKAP KANAK-KANAK NEGERI JOHOR",
      createdAt: "03/01/2025",
      status: "inactive",
    },


  ]
}

export async function getDataAPI(user_id: string): Promise<TerbitBerita[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      `
      id, 
      created_at, 
      title, 
      imageUrl, 
      publisher,
      type,
      content,
      status
      `
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error.message)
    return []
  }

  console.log("Raw Supabase data:", data);
  console.log("Supabase error:", error);

  return data.map((item) => ({
    id: item.id.toString(),
    newsImg: item.imageUrl,
    title: item.title,
    createdAt: new Date(item.created_at).toLocaleDateString("en-GB"),
    status: item.status ?? "active", 
    // publisher: item.publisher,
    // type: item.type,
    // content: item.content,
  }))

}
