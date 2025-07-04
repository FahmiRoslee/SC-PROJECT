"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Eye,
  ThumbsUp,
  Bookmark,
  ChevronRight,
} from "lucide-react"
import { Button } from "@components/components/ui/button"
import { Badge } from "@components/components/ui/badge"
import { Card, CardContent } from "@components/components/ui/card"
import { Separator } from "@components/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@components/components/ui/avatar"

type News = {
  id: number
  title: string
  content: string
  fullContent?: string
  imageUrl: string
  created_at: string
  category: string
  featured?: boolean
  readTime?: string
  author?: string
  authorImage?: string
  views?: number
  likes?: number
}

// Extended mock data with full content
const mockNewsData: News[] = [
  {
    id: 1,
    title: "Mesyuarat Agung Tahunan Pengakap Johor 2025",
    content:
      "Mesyuarat Agung Tahunan (AGM) Pengakap Johor akan diadakan pada 15 Julai 2025. Semua ahli dijemput hadir untuk membincangkan perkembangan terkini dan merancang aktiviti masa hadapan.",
    fullContent: `
      <p>Mesyuarat Agung Tahunan (AGM) Pengakap Johor 2025 akan diadakan pada <strong>15 Julai 2025</strong> di Dewan Jubli Perak, Johor Bahru. Acara ini merupakan platform penting bagi semua ahli Pengakap Johor untuk berkumpul dan membincangkan perkembangan organisasi.</p>

      <h2>Agenda Utama Mesyuarat</h2>
      <p>AGM kali ini akan merangkumi beberapa perkara penting:</p>
      <ul>
        <li>Laporan Tahunan Ketua Pesuruhjaya</li>
        <li>Laporan Kewangan 2024</li>
        <li>Pemilihan Jawatankuasa Eksekutif baharu</li>
        <li>Perancangan aktiviti 2025-2026</li>
        <li>Perbincangan dasar dan peraturan baharu</li>
      </ul>

      <h2>Kepentingan Kehadiran</h2>
      <p>Kehadiran semua ahli amat diperlukan kerana beberapa keputusan penting akan dibuat yang akan mempengaruhi hala tuju Pengakap Johor untuk tahun-tahun mendatang. Antara perkara yang akan dibincangkan termasuk:</p>

      <blockquote>
        "Mesyuarat ini adalah peluang emas untuk semua ahli menyuarakan pendapat dan cadangan bagi memajukan lagi gerakan Pengakap di negeri Johor." - Dato' Ahmad bin Hassan, Ketua Pesuruhjaya Pengakap Johor
      </blockquote>

      <h2>Pendaftaran dan Maklumat Lanjut</h2>
      <p>Pendaftaran kehadiran perlu dibuat selewat-lewatnya pada <strong>10 Julai 2025</strong>. Ahli yang berminat untuk hadir boleh menghubungi pejabat Pengakap Johor di talian 07-2234567 atau melalui emel di <a href="mailto:info@pengakapjohor.org.my">info@pengakapjohor.org.my</a>.</p>

      <p>Maklumat terperinci mengenai agenda, dokumen mesyuarat, dan keperluan lain akan diedarkan kepada semua ahli melalui surat rasmi dalam masa terdekat.</p>
    `,
    imageUrl: "https://via.placeholder.com/800x450/FF5733/FFFFFF?text=AGM+2025",
    created_at: "2025-06-20T10:00:00Z",
    category: "Pentadbiran",
    featured: true,
    readTime: "3 min",
    author: "Ahmad Razak",
    authorImage: "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=AR",
    views: 1250,
    likes: 89,
  },
  {
    id: 2,
    title: "Kem Pengakap Antarabangsa Johor Bahru",
    content:
      "Kem pengakap antarabangsa akan berlangsung di Johor Bahru dari 1 Ogos hingga 7 Ogos 2025. Penyertaan dibuka sekarang!",
    fullContent: `
      <p>Pengakap Johor dengan bangganya mengumumkan penganjuran <strong>Kem Pengakap Antarabangsa Johor Bahru 2025</strong> yang akan berlangsung dari 1 Ogos hingga 7 Ogos 2025 di Kem Pengakap Kota Tinggi.</p>

      <h2>Objektif Kem</h2>
      <p>Kem ini bertujuan untuk:</p>
      <ul>
        <li>Memupuk semangat persahabatan antarabangsa</li>
        <li>Berkongsi pengalaman dan budaya</li>
        <li>Meningkatkan kemahiran kepimpinan</li>
        <li>Mempromosikan Malaysia sebagai destinasi Pengakap</li>
      </ul>

      <h2>Peserta Jemputan</h2>
      <p>Kem ini dijangka akan menyaksikan penyertaan lebih 500 peserta dari 15 negara termasuk:</p>
      <ul>
        <li>Singapura</li>
        <li>Thailand</li>
        <li>Indonesia</li>
        <li>Brunei</li>
        <li>Filipina</li>
        <li>Dan negara-negara ASEAN yang lain</li>
      </ul>

      <p>Pendaftaran untuk peserta tempatan masih dibuka dan boleh dibuat melalui portal rasmi Pengakap Johor.</p>
    `,
    imageUrl: "https://via.placeholder.com/800x450/33FF57/FFFFFF?text=Kem+Antarabangsa",
    created_at: "2025-06-18T14:30:00Z",
    category: "Aktiviti",
    readTime: "5 min",
    author: "Siti Aminah",
    authorImage: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=SA",
    views: 890,
    likes: 67,
  },
  // Add more articles as needed...
]

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<News | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const decodedTitle = decodeURIComponent(params.title as string)
      const foundArticle = mockNewsData.find((news) => news.title === decodedTitle)

      if (foundArticle) {
        setArticle(foundArticle)
        // Get related articles from same category
        const related = mockNewsData
          .filter((news) => news.category === foundArticle.category && news.id !== foundArticle.id)
          .slice(0, 3)
        setRelatedArticles(related)
      }

      setIsLoading(false)
    }

    fetchArticle()
  }, [params.title])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = article?.title || ""

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak dijumpai</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/berita" className="hover:text-blue-600">
              Berita
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-8 pb-0">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Berita
                </Button>

                <Badge className="mb-4">{article.category}</Badge>

                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>

                {/* Article Meta */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={article.authorImage || "/placeholder.svg"} />
                      <AvatarFallback>{article.author?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{article.author}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views?.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "text-red-600 border-red-600" : ""}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {article.likes}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? "text-blue-600 border-blue-600" : ""}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare("copy")}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="px-8 mb-8">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Article Content */}
              <div className="px-8 pb-8">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.fullContent || article.content }}
                />

                {/* Share Buttons */}
                <Separator className="my-8" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 font-medium">Kongsi artikel ini:</span>
                    <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{article.views?.toLocaleString()} pembaca</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Komen (12)
                </h3>
                <div className="space-y-6">
                  {/* Sample Comments */}
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarFallback>MH</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Muhammad Hafiz</span>
                          <span className="text-sm text-gray-500">2 jam lalu</span>
                        </div>
                        <p className="text-gray-700">
                          Terima kasih atas maklumat yang berguna ini. Saya berharap dapat menghadiri AGM tahun ini.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarFallback>NR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Nurul Rahman</span>
                          <span className="text-sm text-gray-500">5 jam lalu</span>
                        </div>
                        <p className="text-gray-700">
                          Bagus sekali! Semoga AGM kali ini akan membawa perubahan positif untuk Pengakap Johor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Artikel Berkaitan</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((relatedArticle) => (
                        <Link key={relatedArticle.id} href={`/berita/${encodeURIComponent(relatedArticle.title)}`}>
                          <div className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                            <img
                              src={relatedArticle.imageUrl || "/placeholder.svg"}
                              alt={relatedArticle.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                {relatedArticle.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(relatedArticle.created_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Langgan Berita</h3>
                  <p className="text-gray-600 mb-4">Dapatkan berita terkini Pengakap Johor terus ke emel anda.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Alamat emel anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full">Langgan Sekarang</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
