"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, Truck, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import CartItemComponent from "@/components/cart-item"
import { message } from "antd"

export default function CartPage() {
  const { items, clearCart, getTotalItems, getTotalPrice, getShippingFee, getTax, getFinalTotal } = useCart()

  const handleClearCart = () => {
    clearCart()
    message.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng!")
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      message.error("Giỏ hàng của bạn đang trống!")
      return
    }
    // Navigate to checkout page
    window.location.href = "/checkout"
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-600 mt-2">Bạn có {getTotalItems()} sản phẩm trong giỏ hàng</p>
        </div>
        <Button variant="outline" onClick={handleClearCart} className="text-red-600 hover:text-red-700 bg-transparent">
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.product.id} item={item} />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Tóm tắt đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                  <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-4 h-4" />
                    <span>Phí vận chuyển</span>
                  </span>
                  <span>{getShippingFee() === 0 ? "Miễn phí" : `${getShippingFee().toLocaleString("vi-VN")}đ`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế VAT (10%)</span>
                  <span>{getTax().toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{getFinalTotal().toLocaleString("vi-VN")}đ</span>
              </div>

              {/* Shipping Info */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Truck className="w-4 h-4" />
                  <span>
                    {getShippingFee() === 0
                      ? "Miễn phí vận chuyển"
                      : getTotalPrice() >= 200000
                        ? "Gần được miễn phí vận chuyển"
                        : `Mua thêm ${(200000 - getTotalPrice()).toLocaleString("vi-VN")}đ để giảm phí ship`}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Tiến hành thanh toán
              </Button>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Chúng tôi chấp nhận</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center">
                    ATM
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
