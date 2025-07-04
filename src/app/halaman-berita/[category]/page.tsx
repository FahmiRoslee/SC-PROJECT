"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, Calendar, Clock, TrendingUp, Tag, ArrowLeft } from "lucide-react"
import { Input } from "@components/components/ui/input"
import { Button } from "@components/components/ui/button"
import { Badge } from "@components/components/ui/badge"
import { Card, CardContent } from "@components/components/ui/card"

type News = {
  id: number
  title: string
  content: string
  imageUrl: string
  created_at: string
  category: string
  featured?: boolean
  readTime?: string
}

// --- Mock Data ---
const mockNewsData: News[] = [
  {
    id: 1,
    title: "Mesyuarat Agung Tahunan Pengakap Johor 2025",
    content:
      "Mesyuarat Agung Tahunan (AGM) Pengakap Johor akan diadakan pada 15 Julai 2025. Utama ahli dijemput hadir untuk membincangkan perkembangan terkini dan merancang aktiviti masa hadapan.",
    imageUrl: "https://via.placeholder.com/800x450/FF5733/FFFFFF?text=AGM+2025",
    created_at: "2025-06-20T10:00:00Z",
    category: "Pentadbiran",
    featured: true,
    readTime: "3 min",
  },
  {
    id: 2,
    title: "Kem Pengakap Antarabangsa Johor Bahru",
    content:
      "Kem pengakap antarabangsa akan berlangsung di Johor Bahru dari 1 Ogos hingga 7 Ogos 2025. Penyertaan dibuka sekarang!",
    imageUrl: "https://via.placeholder.com/600x360/33FF57/FFFFFF?text=Kem+Antarabangsa",
    created_at: "2025-06-18T14:30:00Z",
    category: "Aktiviti",
    readTime: "5 min",
  },
  {
    id: 3,
    title: "Program Khidmat Komuniti Bersama Pengakap",
    content:
      "Pengakap Johor mengadakan program khidmat komuniti membersihkan pantai di Desaru. Sukarelawan dialu-alukan.",
    imageUrl: "https://via.placeholder.com/600x360/3357FF/FFFFFF?text=Khidmat+Komuniti",
    created_at: "2025-06-15T09:15:00Z",
    category: "Komuniti",
    readTime: "4 min",
  },
  {
    id: 4,
    title: "Bengkel Kemahiran Ikatan Tali Pengakap",
    content:
      "Bengkel khas untuk meningkatkan kemahiran ikatan tali akan diadakan pada 25 Julai 2025 di Pusat Latihan Pengakap.",
    imageUrl: "https://via.placeholder.com/600x360/FF33CC/FFFFFF?text=Bengkel+Ikatan",
    created_at: "2025-06-10T11:00:00Z",
    category: "Latihan",
    readTime: "2 min",
  },
  {
    id: 5,
    title: "Sambutan Hari Pengakap Sedunia Peringkat Negeri",
    content:
      "Sertai kami dalam sambutan Hari Pengakap Sedunia yang meriah pada 1 Ogos 2025 dengan pelbagai aktiviti menarik.",
    imageUrl: "https://via.placeholder.com/600x360/CCFF33/FFFFFF?text=Hari+Pengakap",
    created_at: "2025-06-05T16:45:00Z",
    category: "Perayaan",
    readTime: "6 min",
  },
  {
    id: 6,
    title: "Kursus Kepimpinan Pengakap Muda",
    content: "Program pembangunan kepimpinan untuk pengakap muda akan bermula pada September 2025.",
    imageUrl: "https://via.placeholder.com/600x360/FF8C33/FFFFFF?text=Kepimpinan",
    created_at: "2025-06-01T08:00:00Z",
    category: "Latihan",
    readTime: "4 min",
  },
]

const categories = ["Utama", "Pentadbiran", "Aktiviti", "Komuniti", "Latihan", "Perayaan"]

export default function CategoryPage() {
  const params = useParams()
  const category = decodeURIComponent(params.category as string)

  const [newsList, setNewsList] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchNews = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Filter news by category
      const filteredNews = mockNewsData.filter((news) => news.category === category)
      setNewsList(filteredNews)
      setIsLoading(false)
    }

    fetchNews()
  }, [category])

  const filteredNews = newsList.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const featuredNews = filteredNews.find((news) => news.featured)
  const regularNews = filteredNews.filter((news) => !news.featured)
  const trendingNews = mockNewsData.slice(0, 4) // Using all news for trending section

  // PAGE SKELETON
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* PAGE TITLE */}
            <div>
              <Link href="/berita" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Berita Utama
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Berita Kategori: {category}</h1>
              <p className="text-gray-600">Berita dan aktiviti berkaitan {category} Pengakap Johor</p>
            </div>

            {/* BERITA SEARCH BAR */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat} href={cat === "Utama" ? "/berita" : `/berita/kategori/${encodeURIComponent(cat)}`}>
                <Button variant={cat === category ? "default" : "outline"} size="sm" className="rounded-full">
                  {cat}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FEATURED NEWS */}
            {featuredNews && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Berita Utama {category}
                </h2>
                <FeaturedNewsCard news={featuredNews} />
              </div>
            )}

            {/* BERITA TERKINI CONTAINER */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita {category}</h2>
              {regularNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Tiada berita dalam kategori ini buat masa ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDERBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* TRENDING NEWS */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  {/* HEADER */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Trending
                  </h3>

                  {/* TRENDING NEWS LIST */}
                  <div className="space-y-4">
                    {trendingNews.map((news, index) => (
                      <TrendingNewsItem key={news.id} news={news} rank={index + 1} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CATEGORIES WIDGET */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-500" />
                    Kategori
                  </h3>
                  <div className="space-y-2">
                    {categories.slice(1).map((cat) => (
                      <Link
                        key={cat}
                        href={`/berita/kategori/${encodeURIComponent(cat)}`}
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <span className={`text-gray-600 ${cat === category ? "font-bold" : ""}`}>{cat}</span>
                        <Badge variant="secondary">{mockNewsData.filter((news) => news.category === cat).length}</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedNewsCard({ news }: { news: News }) {
  return (
    <Link href={`/berita/${encodeURIComponent(news.title)}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          {/* NEWS IMAGE */}
          <img className="w-full h-96 object-cover" src={news.imageUrl || "/placeholder.svg"} alt={news.title} />

          {/* GRADIENT EEFECT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* NEWS DETAIL */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Link href={`/berita/kategori/${encodeURIComponent(news.category)}`}>
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">{news.category}</Badge>
            </Link>
            <h2 className="text-3xl font-bold mb-3 leading-tight">{news.title}</h2>
            <p className="text-lg text-gray-200 mb-4 line-clamp-2">{news.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(news.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {news.readTime}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/berita/${encodeURIComponent(news.title)}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={news.imageUrl || "/placeholder.svg"} alt={news.title} />
          <Link href={`/berita/kategori/${encodeURIComponent(news.category)}`}>
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white">{news.category}</Badge>
          </Link>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">{news.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(news.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {news.readTime}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TrendingNewsItem({ news, rank }: { news: News; rank: number }) {
  return (
    <Link href={`/berita/${encodeURIComponent(news.title)}`}>
      <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{news.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href={`/berita/kategori/${encodeURIComponent(news.category)}`}>
              <Badge variant="outline" className="text-xs">
                {news.category}
              </Badge>
            </Link>
            <span>{formatDate(news.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
