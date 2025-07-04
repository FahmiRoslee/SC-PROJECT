// page.tsx
"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";

import { supabase } from "@components/lib/supabaseClient";

import { Button } from "@components/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from "@radix-ui/react-dialog"; // Re-added imports for Dialog components
import { TextInputField } from "@components/components/ui/customInputFeild";
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@components/components/ui/dialog';

export default function BeritaForm() {

    const router = useRouter();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState({
      tajuk: "",
      penerbit: "",
      tarikh: "",
      jenisBerita: "",
      isiKandungan: "",
      gambar: null as File | null, // Stores the actual File object for upload
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For displaying image preview (local blob or scraped URL)
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // For displaying local file name

    const [isLoading, setIsLoading] = useState(false); // For form submission loading

    // States for scraping feature
    const [isScrapeDialogOpen, setIsScrapeDialogOpen] = useState(false);
    const [scrapeUrl, setScrapeUrl] = useState("");
    const [scrapeLoading, setScrapeLoading] = useState(false);


    useEffect(() => {
      // This should ideally come from Supabase session
      const currentUser = "Haziq Farhan";
      // Ensure date is in YYYY-MM-DD format for input type="date"
      const currentDate = new Date().toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        penerbit: currentUser,
        tarikh: currentDate,
      }));
    }, []);

    const handleJenisBeritaSelect = (jenis: string) => {
      setFormData((prevData) => ({
          ...prevData,
          jenisBerita: jenis,
      }));
    };

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
           gambar: file // Set the actual File object
        }));

        setPreviewUrl(URL.createObjectURL(file)); // Create blob URL for preview
        setSelectedFileName(file.name);
      }
      else {
        alert("Format gambar mesti .jpg, .jpeg, atau .png");
        setFormData((prev) => ({ ...prev, gambar: null })); // Reset if invalid file
        setPreviewUrl(null);
        setSelectedFileName(null);
      }
    };

    const generateNewsImageName = (title: string, originalName: string): string => {
      const now = new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Kuala_Lumpur" // Current location is Johor Bahru, Johor, Malaysia, so this timezone is appropriate
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

    const handleScrape = async () => {
        if (!scrapeUrl) {
            toast.error("Sila masukkan URL Blogspot.");
            return;
        }

        setScrapeLoading(true);
        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: scrapeUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengikis kandungan.');
            }

            const data = await response.json();
            console.log("Scraped data:", data);

            setFormData((prev) => ({
                ...prev,
                tajuk: data.title || prev.tajuk,
                isiKandungan: data.content || prev.isiKandungan,
                jenisBerita: data.type || prev.jenisBerita || "", // Scraped type might be empty, let user select
            }));

            // Handle scraped image: fetch, convert to File, set formData.gambar
            if (data.imageUrl) {
                try {
                    const imgResponse = await fetch(data.imageUrl);
                    if (!imgResponse.ok) {
                        throw new Error(`Failed to fetch image: ${imgResponse.statusText}`);
                    }
                    const imgBlob = await imgResponse.blob();

                    // Try to get a valid file extension and name from URL
                    const urlParts = data.imageUrl.split('/');
                    const originalNameWithQuery = urlParts[urlParts.length - 1];
                    const originalName = originalNameWithQuery.split('?')[0]; // Remove query params
                    const extension = originalName.split('.').pop() || 'jpg'; // Default to jpg if no extension

                    // Generate a generic file name for the File object
                    const fileNameForFileObject = `scraped_image_${Date.now()}.${extension}`;
                    const scrapedFile = new File([imgBlob], fileNameForFileObject, { type: imgBlob.type });

                    setFormData((prev) => ({
                        ...prev,
                        gambar: scrapedFile,
                    }));
                    setPreviewUrl(URL.createObjectURL(scrapedFile));
                    setSelectedFileName("Gambar dikikis"); // Indicate it's a scraped image
                    toast.success("Gambar berita berjaya dikikis.");
                } catch (imgError) {
                    console.error("Failed to fetch or process scraped image:", imgError);
                    toast.error("Gagal memuat turun atau memproses gambar dikikis. Sila muat naik secara manual.");
                    setFormData((prev) => ({ ...prev, gambar: null }));
                    setPreviewUrl(null);
                    setSelectedFileName(null);
                }
            } else {
                setFormData((prev) => ({ ...prev, gambar: null }));
                setPreviewUrl(null);
                setSelectedFileName(null);
                toast.info("Tiada gambar ditemui dalam artikel dikikis.");
            }

            toast.success("Kandungan berita berjaya dikikis!");
            setIsScrapeDialogOpen(false); // Close dialog
            setScrapeUrl(""); // Clear the URL input
        } catch (error: any) {
            console.error("Scrape error:", error.message);
            toast.error("Gagal mengikis berita.", {
                description: error.message,
            });
        } finally {
            setScrapeLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted", formData);

      setIsLoading(true);

      // check user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Anda mesti log masuk terlebih dahulu.");
        setIsLoading(false);
        return;
      }

      // upload new image to supabase news-images bucket
      let imageUrl = "";

      // Only attempt to upload if formData.gambar is a File object
      if(formData.gambar instanceof File) {
        const fileName = generateNewsImageName(formData.tajuk, formData.gambar.name);

        const { data: storageData, error: storageError } = await supabase
          .storage
          .from("news-images")
          .upload(fileName, formData.gambar, {
            cacheControl: '3600',
            upsert: false // Set to true if you want to overwrite existing files with the same name
          });

        if(storageError) {
          console.error("Image upload failed:", storageError.message);
          toast.error("Gagal memuat naik gambar.", {
            description: storageError.message,
          });
          setIsLoading(false);
          return;
        }

        imageUrl = supabase.storage.from("news-images").getPublicUrl(fileName).data.publicUrl;
      }


      // insert to news table
      const userId = session?.user?.id;
      const { error: insertError } = await supabase.from("news").insert ([
        {
          user_id: userId,
          title: formData.tajuk,
          publisher: formData.penerbit,
          type: formData.jenisBerita,
          imageUrl: imageUrl, // Will be empty if no image was uploaded/scraped
          content: formData.isiKandungan,
          status: "active" // Default status
        }
      ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        toast.error("Gagal menyimpan berita.", {
          description: insertError.message,
        });
        setIsLoading(false);
      }
      else {
        toast.success("Berjaya!", {
          description: "Berita berjaya disimpan!",
        });
        // Reset form after successful submission
        setFormData({
          tajuk: "",
          penerbit: "Haziq Farhan", // Reset to default user
          tarikh: new Date().toISOString().split("T")[0], // Reset to current date
          jenisBerita: "",
          isiKandungan: "",
          gambar: null,
        });
        setPreviewUrl(null);
        setSelectedFileName(null);
        setIsLoading(false);
        router.back();
      }
    };

    return (
      <div className="container-page">
        <div className='flex justify-between'>
          <h1 className="mb-5 font-sans font-bold text-2xl">Terbit Berita Pengakap</h1>
          {/* Scrape Dialog Trigger */}
          <Dialog open={isScrapeDialogOpen} onOpenChange={setIsScrapeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsScrapeDialogOpen(true)}>
                Kikis Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Kikis Berita dari Blogspot</DialogTitle>
                <DialogDescription>
                  Masukkan URL Blogspot yang ingin dikikis kandungannya.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <TextInputField
                  id="scrapeUrl"
                  label="URL Blogspot"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="e.g., https://example.blogspot.com/2023/01/my-news-post.html"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleScrape}
                  disabled={scrapeLoading}
                >
                  {scrapeLoading ? "Mengikis..." : "Kikis"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={scrapeLoading}>
                    Batal
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit} className="max-w- space-y-4">

          {/* TAJUK BERITA */}
          <div className="flex w-full gap-5">
            <TextInputField
              id="tajuk"
              name="tajuk"
              label="Tajuk Berita"
              value={formData.tajuk}
              onChange={handleChange}
              required
            />
          </div>

          {/* PENERBIT, TARIKH, JENIS BERITA */}
          <div className="flex w-full gap-5">

            {/* PENERBIT */}
            <TextInputField
              id="penerbit"
              label="Penerbit"
              name="penerbit"
              value={formData.penerbit}
              onChange={handleChange}
            />

              {/* TARIKH */}
            <TextInputField
              id="tarikh"
              label="Tarikh"
              name="tarikh"
              value={formData.tarikh}
              onChange={handleChange}
              type="date"
            />

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

          {/*ISI KANDUNGAN  */}
          <div>
            <label className="mb-1 block font-sans font-medium">Isi Kandungan:</label>
            <textarea
                name="isiKandungan"
                value={formData.isiKandungan}
                onChange={(e) => {
                  handleChange(e);

                  if(textAreaRef.current) {
                    textAreaRef.current.style.height = "auto";
                    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
                  }

                }}
                ref={textAreaRef}
                required
                rows={5}
                className="w-full border p-2 rounded resize-none overflow-hidden"
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
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isLoading ? "Memuat..." : "Hantar"}
            </button>


        </form>
      </div>
    );
}