"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  title: string
  author: string
  category: Category
  price: number
  stock: number
  coverImage: string
  volume?: string
 
}

export default function HomePage() {
  const { addToCart } = useCart()

  const [featuredBooks, setFeaturedBooks] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])

  const fetchBooks = async () => {
    try {
      setLoading(true)

      const res = await axios.get("http://localhost:5000/api/books")
      if (res.data?.success) {
        const books: Product[] = res.data.data || []
        setProducts(books)
        setFeaturedBooks(books.slice(0, 4)) // ✅ lấy 4 sách làm featured

        const uniqueCategories = Array.from(
          new Set(books.map((b) => b?.category?.name ?? "Khác"))
        )
        setCategories(["Tất cả", ...uniqueCategories])
      }
    } catch (error) {
      console.error("Lỗi khi tải sách:", error)
      message.error("Không thể tải danh sách sách.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleAddToCart = (book: Product) => {
    if (book.stock <= 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }

    addToCart(
      {
        id: book._id,
        title: book.title,
        price: book.price,
        coverImage: book.coverImage,
        volume: book.volume || ""
        
      },
      1
    )

    message.success(`Đã thêm "${book.title}" vào giỏ hàng!`)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Khám phá thế giới
                <span className="block text-yellow-300">tri thức</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Hàng ngàn đầu sách chất lượng, giao hàng nhanh chóng, giá cả hợp lý. Bắt đầu hành trình đọc sách của bạn
                ngay hôm nay!

              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                  asChild
                >
                  <Link href="/products">Khám phá ngay</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200 bg-transparent"
                  asChild
                >
                  <Link href="/about">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="/colorful-book-stack.png" alt="Sách" className="w-full h-auto rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* ✅ Featured Books từ API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold mb-4">Sách nổi bật</h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book._id} className="group hover:shadow-xl transition cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-64 object-cover rounded-t"
                    />

                    {book.stock <= 0 && (
                      <Badge className="absolute top-2 right-2 bg-gray-500">Hết hàng</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4">
                  <h3 className="font-semibold group-hover:text-blue-600">{book.title}</h3>
                  <p className="text-sm text-gray-600">Tập: {book.volume || "Không có"}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.5</span> {/* ✅ tạm fix rating giả */}
                  </div>

                  <p className="font-bold text-red-600">
                    {book.price.toLocaleString("vi-VN")}đ
                  </p>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stock <= 0}
                  >
                    {book.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" asChild size="lg">
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </section>
<section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">10,000+</div>
               <div className="text-gray-600">Đầu sách</div>
             </div>
             <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
             </div>
             <div className="space-y-2">
               <div className="text-4xl font-bold text-blue-600">99%</div>
               <div className="text-gray-600">Đánh giá tích cực</div>
             </div>
           </div>
         </div>
       </section>
    </div>
  )
}
