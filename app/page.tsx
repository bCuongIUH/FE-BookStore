"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, BookOpen, Users } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

export default function HomePage() {
  const { addToCart } = useCart()

  const featuredBooks = [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: 89000,
      originalPrice: 120000,
      rating: 4.8,
      reviews: 1250,
      image: "/dac-nhan-tam-book-cover.png",
      badge: "Bestseller",
      inStock: 25, // Added stock quantity
    },
    {
      id: 2,
      title: "Sapiens: Lược sử loài người",
      author: "Yuval Noah Harari",
      price: 156000,
      originalPrice: 195000,
      rating: 4.9,
      reviews: 890,
      image: "/sapiens-book-cover.png",
      badge: "Mới",
      inStock: 18, // Added stock quantity
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      price: 135000,
      originalPrice: 180000,
      rating: 4.7,
      reviews: 2100,
      image: "/atomic-habits-inspired-cover.png",
      badge: "Hot",
      inStock: 32, // Added stock quantity
    },
    {
      id: 4,
      title: "Tôi Tài Giỏi, Bạn Cũng Thế",
      author: "Adam Khoo",
      price: 67000,
      originalPrice: 89000,
      rating: 4.6,
      reviews: 756,
      image: "/toi-tai-gioi-ban-cung-the-cover.png",
      badge: "Sale",
      inStock: 0, // Out of stock example
    },
  ]

  const categories = [
    { name: "Kinh tế - Kinh doanh", count: 1250, icon: TrendingUp },
    { name: "Văn học", count: 890, icon: BookOpen },
    { name: "Kỹ năng sống", count: 650, icon: Users },
    { name: "Thiếu nhi", count: 420, icon: Star },
  ]

  const handleAddToCart = (book: any) => {
    if (book.inStock === 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }

    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      quantity: 1,
      inStock: book.inStock,
    }

    addToCart(cartItem)
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Danh mục sách</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Tìm kiếm sách theo danh mục yêu thích của bạn</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.count} sách</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sách nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Những cuốn sách được yêu thích nhất tại BookStore</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{book.badge}</Badge>
                  {book.inStock === 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Hết hàng</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{book.rating}</span>
                  <span className="text-sm text-gray-500">({book.reviews})</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 line-through">
                      {book.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-lg font-bold text-red-600">{book.price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {book.inStock > 0 ? `Còn lại: ${book.inStock} cuốn` : "Hết hàng"}
                  </div>
                  <Button
                    size="sm"
                    className="w-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleAddToCart(book)}
                    disabled={book.inStock === 0}
                  >
                    {book.inStock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all duration-200 bg-transparent"
            asChild
          >
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
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
