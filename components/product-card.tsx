"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.inStock === 0) {
      message.error("Sản phẩm đã hết hàng!")
      return
    }

    addToCart(product, 1)
    // message.success(`Đã thêm "${product.title}" vào giỏ hàng!`)

    // Keep the old callback for backward compatibility
    onAddToCart?.(product)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.badge && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{product.badge}</Badge>
            )}
            {product.inStock <= 5 && product.inStock > 0 && (
              <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                Chỉ còn {product.inStock}
              </Badge>
            )}
            {product.inStock === 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Hết hàng</Badge>}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`} className="flex-1">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600">{product.author}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
        </Link>

        <div className="mt-4 space-y-2">
          <div className="flex flex-col">
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
            <span className="text-lg font-bold text-red-600">{product.price.toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="text-xs text-gray-500">
            {product.inStock > 0 ? `Còn ${product.inStock} sản phẩm` : "Hết hàng"}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            className="w-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {product.inStock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
