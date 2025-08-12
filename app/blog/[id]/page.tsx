"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, BookOpen } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  readTime: number
  image: string
}

// Mock blog post data - in real app this would come from API/database
const getBlogPost = (id: string): BlogPost | null => {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "10 Cuốn Sách Kinh Doanh Hay Nhất Năm 2024",
      excerpt: "Khám phá những cuốn sách kinh doanh được đánh giá cao nhất trong năm, từ chiến lược đến lãnh đạo.",
      content: `
        <p>Trong thế giới kinh doanh đầy biến động của năm 2024, việc cập nhật kiến thức và kỹ năng thông qua việc đọc sách là điều vô cùng quan trọng. Dưới đây là 10 cuốn sách kinh doanh được đánh giá cao nhất trong năm này.</p>
        
        <h2>1. "Atomic Habits" - James Clear</h2>
        <p>Cuốn sách này không chỉ dạy bạn cách xây dựng thói quen tốt mà còn giúp bạn hiểu được tầm quan trọng của những thay đổi nhỏ trong việc đạt được thành công lớn.</p>
        
        <h2>2. "Thinking, Fast and Slow" - Daniel Kahneman</h2>
        <p>Tác phẩm kinh điển về tâm lý học hành vi và cách con người đưa ra quyết định. Đây là cuốn sách không thể thiếu cho bất kỳ nhà lãnh đạo nào.</p>
        
        <h2>3. "Good to Great" - Jim Collins</h2>
        <p>Nghiên cứu sâu sắc về những yếu tố giúp các công ty chuyển từ tốt thành vĩ đại. Cuốn sách cung cấp những insight quý giá về lãnh đạo và quản lý.</p>
        
        <p>Những cuốn sách này không chỉ cung cấp kiến thức lý thuyết mà còn đưa ra những ví dụ thực tế và bài học có thể áp dụng ngay vào công việc hàng ngày.</p>
      `,
      author: "Nguyễn Văn A",
      publishDate: "2024-01-15",
      category: "Kinh doanh",
      tags: ["kinh doanh", "sách hay", "2024"],
      readTime: 8,
      image: "/business-books.png",
    },
    // Add more blog posts here...
  ]

  return posts.find((post) => post.id === id) || null
}

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundPost = getBlogPost(params.id)
    setPost(foundPost)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => router.push("/blog")}>Quay lại blog</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Article Header */}
      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <Badge className="bg-blue-500 hover:bg-blue-600">{post.category}</Badge>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.publishDate).toLocaleDateString("vi-VN")}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} phút đọc
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Yêu thích
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-6 border-t">
          <span className="text-sm font-medium text-gray-700">Tags:</span>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Author Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{post.author}</h3>
                <p className="text-gray-600">
                  Chuyên gia trong lĩnh vực {post.category.toLowerCase()}, có nhiều năm kinh nghiệm và đam mê chia sẻ
                  kiến thức.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Bài viết liên quan
            </h3>
            <div className="space-y-4">
              <Link href="/blog/2" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <h4 className="font-medium text-gray-900 hover:text-blue-600">
                  Cách Xây Dựng Thói Quen Đọc Sách Hiệu Quả
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Hướng dẫn chi tiết để phát triển thói quen đọc sách bền vững...
                </p>
              </Link>
              <Link href="/blog/3" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <h4 className="font-medium text-gray-900 hover:text-blue-600">
                  Review: Sapiens - Cuốn Sách Thay Đổi Cách Nhìn Về Lịch Sử
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Đánh giá chi tiết về cuốn sách Sapiens của Yuval Noah Harari...
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
