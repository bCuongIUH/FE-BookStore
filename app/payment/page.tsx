"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, CheckCircle, Clock } from "lucide-react"
import { generateOrderNumber, saveOrder, type Order, type OrderItem } from "@/lib/orders-data"
import { useCart } from "@/contexts/cart-context"
import { message } from "antd"

interface CheckoutData {
  items: any[]
  shippingAddress: any
  subtotal: number
  shippingFee: number
  tax: number
  total: number
}

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod")
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem("checkoutData")
    if (!savedData) {
      message.error("Không tìm thấy thông tin đơn hàng!")
      router.push("/cart")
      return
    }

    try {
      const data = JSON.parse(savedData)
      setCheckoutData(data)
    } catch (error) {
      message.error("Dữ liệu không hợp lệ!")
      router.push("/cart")
    }
  }, [router])

  const handlePlaceOrder = async () => {
    if (!checkoutData) return

    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderItems: OrderItem[] = checkoutData.items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        author: item.product.author,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }))

      const order: Order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        items: orderItems,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod,
        subtotal: checkoutData.subtotal,
        shippingFee: checkoutData.shippingFee,
        tax: checkoutData.tax,
        total: checkoutData.total,
        status: paymentMethod === "cod" ? "confirmed" : "pending_payment",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: checkoutData.shippingAddress.notes,
      }

      saveOrder(order)
      clearCart()
      localStorage.removeItem("checkoutData")

      if (paymentMethod === "cod") {
        message.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.")
      } else {
        message.success("Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin đã cung cấp.")
      }

      router.push(`/order-success?orderNumber=${order.orderNumber}`)
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!")
    } finally {
      setIsLoading(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chọn phương thức thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất bước cuối cùng để đặt hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Phương thức thanh toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "cod" | "bank_transfer")}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="flex items-center space-x-4 cursor-pointer">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Thanh toán bằng tiền mặt khi shipper giao hàng đến địa chỉ của bạn
                          </div>
                          <div className="text-xs text-green-600 mt-2 font-medium">✓ Được khuyên dùng</div>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="flex items-center space-x-4 cursor-pointer">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Chuyển khoản trước, giao hàng sau khi xác nhận thanh toán
                          </div>
                          <div className="text-xs text-blue-600 mt-2 font-medium">⚡ Xử lý nhanh hơn</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {paymentMethod === "bank_transfer" && (
                <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Thông tin chuyển khoản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-blue-800">Ngân hàng:</span>
                        <p className="text-blue-700">Vietcombank - Chi nhánh TP.HCM</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Số tài khoản:</span>
                        <p className="text-blue-700 font-mono">1234 5678 9012 3456</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-blue-800">Chủ tài khoản:</span>
                        <p className="text-blue-700">CÔNG TY BOOKSTORE VIETNAM</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Nội dung chuyển khoản:</span>
                        <p className="text-blue-700 font-mono">[Mã đơn hàng] [Họ tên]</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      <strong>Lưu ý:</strong> Đơn hàng sẽ được xử lý trong vòng 2-4 giờ sau khi chúng tôi xác nhận thanh
                      toán. Vui lòng chuyển khoản đúng nội dung để được xử lý nhanh chóng.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 text-lg py-6"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {paymentMethod === "cod" ? "Xác nhận đặt hàng" : "Xác nhận và chuyển khoản"}
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {checkoutData.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.title}</p>
                      <p className="text-xs text-gray-500">{item.product.author}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.product.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{checkoutData.subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>
                    {checkoutData.shippingFee === 0
                      ? "Miễn phí"
                      : `${checkoutData.shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế VAT (10%)</span>
                  <span>{checkoutData.tax.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{checkoutData.total.toLocaleString("vi-VN")}đ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
