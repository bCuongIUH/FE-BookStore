"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Trash2 } from "lucide-react"
import type { CartItem } from "@/contexts/cart-context"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

interface CartItemProps {
  item: CartItem
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    if (newQuantity > item.product.inStock) {
      message.error(`Chỉ còn ${item.product.inStock} sản phẩm trong kho!`)
      return
    }

    setIsUpdating(true)
    updateQuantity(item.product.id, newQuantity)
    setTimeout(() => setIsUpdating(false), 300)
  }

  const handleRemove = () => {
    removeFromCart(item.product.id)
    message.success(`Đã xóa "${item.product.title}" khỏi giỏ hàng!`)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
            <img
              src={item.product.image || "/placeholder.svg"}
              alt={item.product.title}
              className="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${item.product.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
            >
              {item.product.title}
            </Link>
            <p className="text-sm text-gray-600 mt-1">{item.product.author}</p>
            <p className="text-sm text-gray-500">{item.product.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-bold text-red-600">{item.product.price.toLocaleString("vi-VN")}đ</span>
              {item.product.originalPrice > item.product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {item.product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-8 h-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.inStock || isUpdating}
              className="w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Subtotal */}
          <div className="text-right min-w-0">
            <p className="text-lg font-bold text-gray-900">
              {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
            </p>
            <p className="text-sm text-gray-500">
              {item.quantity} × {item.product.price.toLocaleString("vi-VN")}đ
            </p>
          </div>

          {/* Remove Button */}
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-600 hover:text-red-700 p-2">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.product.inStock && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">Bạn đã chọn tối đa số lượng có sẵn ({item.product.inStock} cuốn)</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
