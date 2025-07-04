"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";

import { supabase } from "@components/lib/supabaseClient";

import { Button } from "@components/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuCheckboxItemProps, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

type News = {
  id: string;
  created_at: string;
  title: string;
  imageUrl: string;
  publisher: string;
  type: string;
  content: string;
  status: string;
};

export default function BeritaForm() {
  const news_id = 5;
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [news, setNews] = useState<News | null>(null);

  const [formData, setFormData] = useState({
    tajuk: "",
    penerbit: "",
    tarikh: "",
    jenisBerita: "",
    isiKandungan: "",
    gambar: null as File | null,
  });

  type Checked = DropdownMenuCheckboxItemProps["checked"];

  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Set default publisher and date on load
  useEffect(() => {
    const currentUser = "Haziq Farhan";
    const currentDate = new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      penerbit: currentUser,
      tarikh: currentDate,
    }));
  }, []);

  // Fetch news by ID
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

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
        setPreviewUrl(data.imageUrl);
      }

      setIsLoading(false);
    };

    if (news_id) fetchNews();
  }, [news_id]);

  // Populate formData once news is loaded
  useEffect(() => {
    if (news) {
      setFormData({
        tajuk: news.title || "",
        penerbit: news.publisher || "",
        tarikh: news.created_at?.split("T")[0] || "",
        jenisBerita: news.type || "",
        isiKandungan: news.content || "",
        gambar:  null, 
      });

    }
  }, [news]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [formData.isiKandungan]); // triggers on load & update  

    const handleJenisBeritaSelect = (jenis: string) => {
      setFormData((prevData) => ({
          ...prevData,
          jenisBerita: jenis,
      }))
    }
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      
      if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setFormData((prev) => ({
           ...prev, 
           gambar: file 
        }));

        setPreviewUrl(URL.createObjectURL(file));
        setSelectedFileName(file.name); 
      } 
      else {
        alert("Format gambar mesti .jpg, .jpeg, atau .png");
      }
    };

    const generateNewsImageName = (title: string, originalName: string): string => {
      const now = new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Kuala_Lumpur"
      });
    
      const [datePart, timePart] = now.split(", ");
      const formattedDate = datePart.split("/").reverse().join(""); // YYYYMMDD
      const formattedTime = timePart.replace(/:/g, "").replace(/\s/g, ""); // HHMMSS
    
      const extension = originalName.split(".").pop();
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    
      return `news_${formattedDate}_${formattedTime}_${slug}.${extension}`;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted", formData);
    
      setIsLoading(true);
    
      // Check user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
    
      if (!session) {
        alert("Anda mesti log masuk terlebih dahulu.");
        setIsLoading(false);
        return;
      }
    
      // upload new image to supabase news-images bucket if there's a new image
      let imageUrl = "";
    
      if (formData.gambar) {
        const fileName = generateNewsImageName(formData.tajuk, formData.gambar.name);
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from("news-images")
          .upload(fileName, formData.gambar);
    
        if (storageError) {
          console.error("Image upload failed:", storageError.message);
          setIsLoading(false);
          return;
        }
    
        imageUrl = supabase.storage.from("news-images").getPublicUrl(fileName).data.publicUrl;
      }
    
      // Update the existing news entry in the 'news' table
      const userId = session?.user?.id;
      const newsId = news_id; // Assuming formData includes an 'id' field for the news article being edited
    
      const { error: updateError } = await supabase.from("news").update({
        title: formData.tajuk,
        publisher: "Haziq Farhan",
        type: formData.jenisBerita,
        imageUrl: imageUrl || formData.gambar,  // Keep existing imageUrl if no new image is uploaded
        content: formData.isiKandungan,
        status: "active"
      }).eq("id", newsId); // Ensure you're updating the correct record
    
      if (updateError) {
        console.error("Update error:", updateError.message);
        setIsLoading(false);
        return;
      }
    
      alert("Berita berjaya dikemaskini!");
      setFormData({
        tajuk: "",
        penerbit: "",
        tarikh: "",
        jenisBerita: "",
        isiKandungan: "",
        gambar: null as File | null,
      });
      setPreviewUrl(null);
      setIsLoading(false);
      router.push("/berita"); // Redirect back to the main berita page
    };
    
    const handleDelete = async () => {
      // Display confirmation dialog before deleting
      const confirmed = window.confirm("Adakah anda pasti ingin menghapuskan berita ini?");
      
      if (confirmed) {
        try {
          setIsLoading(true);
    
          // Get the user session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            alert("Anda mesti log masuk terlebih dahulu.");
            setIsLoading(false);
            return;
          }
    
          // Fetch the news data to get the image URL or file name
          const { data: newsData, error: newsError } = await supabase
            .from("news")
            .select("imageUrl") // Assuming imageUrl field contains the file path in storage
            .eq("id", news_id)
            .single();
    
          if (newsError || !newsData) {
            alert("Tidak dapat menemukan berita.");
            setIsLoading(false);
            return;
          }
    
          // Remove the image from the storage bucket
          const imagePath = newsData.imageUrl; // Assuming imageUrl is the path to the image in the storage
          const { error: deleteImageError } = await supabase
            .storage
            .from("news-images")
            .remove([imagePath]); // Remove the image from storage bucket
    
          if (deleteImageError) {
            console.error("Image delete error:", deleteImageError.message);
            alert("Gagal menghapuskan gambar.");
            setIsLoading(false);
            return;
          }
    
          // Perform the delete operation for the news article
          const { error: deleteError } = await supabase
            .from("news")
            .delete()
            .eq("id", news_id) // Assuming news_id is available
            .eq("user_id", session.user.id); // Ensures that only the user who created the news can delete it
    
          if (deleteError) {
            console.error("Delete error:", deleteError.message);
            alert("Gagal menghapuskan berita.");
            setIsLoading(false);
          } else {
            alert("Berita dan gambar berjaya dihapuskan!");
            router.back(); // Navigate back after successful delete
          }
    
        } catch (error) {
          console.error("Unexpected error:", error);
          alert("Terdapat ralat. Sila cuba lagi.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    
    

    return (
      <div className="container-page">
        <h1 className="mb-5 font-sans font-bold text-2xl">Sunting Berita Pengakap</h1>

        <form onSubmit={handleSubmit} className="max-w- space-y-4 border">
          
          {/* TAJUK BERITA */}
          <div>
            <label className="mb-1 block font-sans font-medium">Tajuk Berita:</label>
            <input
                type="text"
                name="tajuk"
                value={formData.tajuk}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
            />
          </div>

          {/* PENERBIT, TARIKH, JENIS BERITA */}
          <div className="flex justify-between">

            {/* PENERBIT */}
            <div className="w-[25%]">
                <label className="mb-1 block font-sans font-medium">Penerbit:</label>
                <input
                    type="text"
                    name="penerbit"
                    value={formData.penerbit}
                    readOnly
                    className="w-full border p-2 bg-gray-100 rounded"
                />
            </div>

              {/* TARIKH */}
              <div className="w-[25%]">
                <label className="mb-1 block font-sans font-medium">Tarikh:</label>
                <input
                    type="date"
                    name="tarikh"
                    value={formData.tarikh}
                    readOnly
                    className="w-full border p-2 bg-gray-100 rounded"
                />
              </div>
              
              {/* JENIS BERITA */}
              <div className="w-[25%]">
                <label className="block font-medium mb-1">Pilihan Paparan</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {formData.jenisBerita || "Pilih Jenis Berita"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => handleJenisBeritaSelect("Berita Umum")}>
                      Berita Umum
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJenisBeritaSelect("Mesyuarat")}>
                      Mesyuarat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJenisBeritaSelect("Korobori")}>
                      Korobori
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>

{/* ISI KANDUNGAN */}
<div>
  <label className="mb-1 block font-sans font-medium">Isi Kandungan:</label>
  <textarea
    name="isiKandungan"
    value={formData.isiKandungan}
    onChange={(e) => {
      handleChange(e);

      // Auto-resize the textarea
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    }}
    ref={textAreaRef}
    required
    rows={1} // Starts small, grows dynamically
    className="w-full border p-2 rounded resize-none overflow-hidden min-h-[100px] sm:min-h-[120px] max-h-[600px]"
    style={{ lineHeight: "1.5" }}
  />
</div>

        
            {/* GAMBAR BERITA */}
            <div>
                <label className="mb-1 block font-sans font-medium">Gambar Berita:
                  { selectedFileName ? <span className="ml-3">{selectedFileName}</span> : null }
                </label>

                <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    
                    <div className="mt-2 border border-dashed border-gray-400 p-3 rounded-md flex items-center justify-center min-h-[250px] hover:bg-gray-100 transition">
                      {previewUrl ? (
                          <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full max-h-60 object-contain border rounded"
                          />
                      ) : (
                          <span className="text-white text-sm italic">Klik untuk muat naik gambar</span>
                      )}
                    </div>
                </label>
            </div>
        
            {/* SUBMIT BUTTON */}
            <div className='flex'>
              <button
                disabled={isLoading}
                type="submit"
                className="mr-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isLoading ? "Memuat..." : "Hantar"}
              </button>
              <button
                disabled={isLoading}
                onClick={handleDelete}
                className="bg-none border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
              >
                Hapus Berita
              </button>
            </div>



        </form>

      </div>

    );
  }