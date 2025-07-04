"use client"

import { supabase } from "@components/lib/supabaseClient";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";

import { formatDate } from "@components/lib/utils";

import {Calendar1,Edit,Pencil} from "lucide-react";


type News = {
  id: string;
  created_at: string;
  title: string;
  imageUrl: string;
  publisher: string;
  type: string;
  content: string;
  status: string;
}

export default function ViewNews({ params }: { params: { title: string } }) {
  
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const news_id = searchParams.get("id");

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const handleEditClick = () => {
      router.push(`${pathname}/sunting-berita/`);
  } 

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("news")
        .select(`
          id, 
          created_at, 
          title, 
          imageUrl, 
          publisher,
          type,
          content,
          status
        `)
        .eq("id", news_id)
        .single();

      if (error) {
        console.error("Failed to fetch news:", error.message);
      } else {
        setNews(data);
      }

      setLoading(false);
    };

    if (news_id) fetchNews();
  }, [news_id]);

  if (loading) return <div>Loading...</div>;
  if (!news) return <div>News not found.</div>;

    return (
        <div className="container-page">

            {/* BERITA HEADER FUNCTION */}
            <div className="mb-8 flex justify-between">
              
              <div className="flex">
                {/* JENIS BERITA */}
                <div className="mr-3 bg-[#1931E3] px-4 py-1.5 rounded-xl text-white font-sans font-medium uppercase flex items-center justify-center text-sm">
                  {news?.type || "Berita Pengakap"}
                </div>
                {/* STATUS BERITA */}
                <div
                  className={`px-4 py-1.5 rounded-xl font-sans font-medium uppercase flex items-center justify-center text-sm 
                    ${news.status === 'active' ? 'bg-green-200' : 'bg-red-200'}
                    ${news.status === 'active' ? 'text-green-800' : 'text-red-800'}
                  `}
                >
                  {news.status}
                </div>                
              </div>

              {/* SUNTING BERITA BUTTON */}
              <div 
                onClick={handleEditClick}
                className="cursor-pointer flex items-center border border-[#1931E3] px-3 py-1.5 rounded-md"
              >
                    <Edit
                      size={20}
                      className="text-[#1931E3]"
                    />
                    <div className="ml-3 font-sans font-medium text-sm text-[#1931E3]">Sunting Berita</div>
              </div>

            </div>

            {/* <div className="flex justify-items-start">
                <div className="mb-8 bg-[#1931E3] px-4 py-1.5 rounded-xl text-white font-sans font-medium uppercase flex items-center justify-center text-sm">
                    {news.type}
                </div>
            </div> */}


            {/* TAJUK BERITA */}
            <h1 className="overflow-text-container font-sans font-bold text-3xl text-black">
              {news.title}
            </h1>

            <div className="separator mt-15 mb-5"></div>

            {/* PENERBIT & TARIKH */}
            <div className="flex">
                <div className="flex items-center mr-5">
                    {/* PENERBIT IMAGE */}
                    <div className="mr-3 rounded-full w-8 h-8 bg-gray-100">

                    </div>
                    <div className="font-sans font-normal uppercase text-sm">{news.publisher}</div>
                </div>

                 
                <div className="flex items-center">
                    {/* PENERBIT IMAGE */}
                    <Calendar1
                        size={20}
                        className="mr-4"
                    />
                    <div className="font-sans font-normal uppercase text-sm">{formatDate(news.created_at)}</div>
                </div>
            </div>


            {/* GAMBAR BERITA */}
            <div className="mt-20 flex justify-center items-center  ">
                <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="min-w-[650px] min-h-[450px] max-w-[1600px] max-h-[1200px] object-cover"
                    />
            </div>

            
            {/* ISI KANDUNGAN BERITA */}
            <div className="mt-15 overflow-text-container font-sans font-normal text-base/7.5">
              {news.content}        
            </div>


        </div>
    )
}