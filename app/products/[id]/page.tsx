"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, Plus, Minus } from "lucide-react"
import { getProductById, products } from "@/lib/products-data"
import ProductCard from "@/components/product-card"
import { message } from "antd"
import { useCart } from "@/contexts/cart-context"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  const product = getProductById(params.id as string)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <Button onClick={() => router.push("/products")} variant="outline">
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </div>
    )
  }

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  const handleAddToCart = () => {
    if (product.inStock === 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }
    if (quantity > product.inStock) {
      message.error(`Chỉ còn ${product.inStock} sản phẩm trong kho!`)
      return
    }
    addToCart(product, quantity)
    message.success(`Đã thêm ${quantity} cuốn "${product.title}" vào giỏ hàng!`)
  }

  const handleAddIndividualBookToCart = (book: any) => {
    if (book.inStock === 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }
    addToCart(book, 1)
    message.success(`Đã thêm "${book.title}" vào giỏ hàng!`)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.inStock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Quay lại
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badge && <Badge className="bg-red-500 hover:bg-red-600">{product.badge}</Badge>}
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-lg text-gray-600 mb-4">Tác giả: {product.author}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-red-600">{product.price.toLocaleString("vi-VN")}đ</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
              {product.originalPrice > product.price && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Tiết kiệm {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}%
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Còn hàng ({product.inStock} cuốn)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Hết hàng</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inStock}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.inStock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Giao hàng nhanh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">Bảo hành chất lượng</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <span className="text-sm">Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Books Section for Book Sets */}
      {product.isSet && product.setItems && (
        <Card className="mb-12">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Các cuốn sách trong bộ</h3>
            <p className="text-gray-600 mb-6">Bạn có thể mua từng cuốn riêng lẻ hoặc mua cả bộ để tiết kiệm hơn.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.setItems.map((book, index) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Tập {index + 1}</Badge>
                      {book.inStock === 0 && <Badge variant="destructive">Hết hàng</Badge>}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-red-600">{book.price.toLocaleString("vi-VN")}đ</span>
                      {book.originalPrice > book.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {book.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({book.reviews})</span>
                      </div>
                      <span className="text-sm text-gray-600">{book.pages} trang</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Còn lại: {book.inStock} cuốn</span>
                    </div>
                    <Button
                      onClick={() => handleAddIndividualBookToCart(book)}
                      disabled={book.inStock === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {book.inStock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo tiết kiệm</h4>
              <p className="text-blue-800 text-sm">
                Mua cả bộ {product.setItems.length} tập chỉ với{" "}
                <span className="font-bold">{product.price.toLocaleString("vi-VN")}đ</span> thay vì mua lẻ{" "}
                <span className="line-through">
                  {product.setItems.reduce((total, book) => total + book.price, 0).toLocaleString("vi-VN")}đ
                </span>
                . Tiết kiệm{" "}
                <span className="font-bold text-green-600">
                  {(product.setItems.reduce((total, book) => total + book.price, 0) - product.price).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
                !
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Details Tabs */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin chi tiết</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tác giả:</span>
                    <span>{product.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nhà xuất bản:</span>
                    <span>{product.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Năm xuất bản:</span>
                    <span>{product.publishYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số trang:</span>
                    <span>{product.pages}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Ngôn ngữ:</span>
                    <span>{product.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ISBN:</span>
                    <span>{product.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Danh mục:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tình trạng:</span>
                    <span>{product.inStock > 0 ? "Còn hàng" : "Hết hàng"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
