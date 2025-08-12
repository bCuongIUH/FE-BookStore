"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, Award } from "lucide-react"
import { getOrderByNumber, createSampleOrders, type Order } from "@/lib/orders-data"
import { message } from "antd"

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    createSampleOrders()
  }, [])

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      message.error("Vui lòng nhập mã đơn hàng!")
      return
    }

    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundOrder = getOrderByNumber(orderNumber.trim())
    if (foundOrder) {
      setOrder(foundOrder)
      message.success("Tìm thấy đơn hàng!")
    } else {
      setOrder(null)
      message.error("Không tìm thấy đơn hàng với mã này!")
    }

    setIsSearching(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_payment":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "processing":
        return <Package className="w-5 h-5 text-purple-500" />
      case "shipping":
        return <Truck className="w-5 h-5 text-orange-500" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "completed":
        return <Award className="w-5 h-5 text-green-600" />
      case "refunded":
        return <RotateCcw className="w-5 h-5 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "Chờ xác nhận",
      pending_payment: "Chờ thanh toán",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      completed: "Hoàn thành",
      refunded: "Đã hoàn trả",
      cancelled: "Đã hủy",
    }
    return statusMap[status as keyof typeof statusMap] || "Không xác định"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "Chờ xác nhận", color: "bg-yellow-500" },
      pending_payment: { text: "Chờ thanh toán", color: "bg-yellow-600" },
      confirmed: { text: "Đã xác nhận", color: "bg-blue-500" },
      processing: { text: "Đang xử lý", color: "bg-purple-500" },
      shipping: { text: "Đang giao hàng", color: "bg-orange-500" },
      delivered: { text: "Đã giao hàng", color: "bg-green-500" },
      completed: { text: "Hoàn thành", color: "bg-green-600" },
      refunded: { text: "Đã hoàn trả", color: "bg-blue-600" },
      cancelled: { text: "Đã hủy", color: "bg-red-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  const getTrackingSteps = (currentStatus: string) => {
    const steps = [
      { key: "pending", label: "Chờ xác nhận", description: "Đơn hàng đã được tiếp nhận" },
      { key: "confirmed", label: "Đã xác nhận", description: "Đơn hàng đã được xác nhận" },
      { key: "processing", label: "Đang xử lý", description: "Đang chuẩn bị hàng hóa" },
      { key: "shipping", label: "Đang giao hàng", description: "Đơn hàng đang được vận chuyển" },
      { key: "delivered", label: "Đã giao hàng", description: "Đơn hàng đã được giao thành công" },
      { key: "completed", label: "Hoàn thành", description: "Giao dịch đã hoàn tất" },
    ]

    const statusOrder = ["pending", "confirmed", "processing", "shipping", "delivered", "completed"]
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Theo dõi đơn hàng</h1>
        <p className="text-gray-600">Nhập mã đơn hàng để kiểm tra trạng thái</p>
        <p className="text-sm text-blue-600 mt-2">Thử với mã: BK123456ABC hoặc BK789012DEF</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Tra cứu đơn hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="orderNumber" className="sr-only">
                Mã đơn hàng
              </Label>
              <Input
                id="orderNumber"
                placeholder="Nhập mã đơn hàng (ví dụ: BK123456ABC)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="px-8">
              {isSearching ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin đơn hàng</span>
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Mã đơn hàng:</span>
                    <span className="font-mono text-blue-600">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày đặt:</span>
                    <span>{order.createdAt.toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phương thức thanh toán:</span>
                    <span>{order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}</span>
                  </div>
                  {order.completedDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày hoàn thành:</span>
                      <span className="text-green-600">{order.completedDate.toLocaleDateString("vi-VN")}</span>
                    </div>
                  )}
                  {order.refundDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày hoàn trả:</span>
                      <span className="text-blue-600">{order.refundDate.toLocaleDateString("vi-VN")}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-lg font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Người nhận:</span>
                    <span>{order.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>

              {order.status === "refunded" && order.refundReason && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Lý do hoàn trả
                  </h4>
                  <p className="text-blue-800">{order.refundReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          {order.status !== "cancelled" && order.status !== "refunded" && (
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTrackingSteps(order.status).map((step, index) => (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-100 text-green-600"
                            : step.active
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.active ? (
                          getStatusIcon(step.key)
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${step.completed || step.active ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {step.label}
                        </h4>
                        <p className={`text-sm ${step.completed || step.active ? "text-gray-600" : "text-gray-400"}`}>
                          {step.description}
                        </p>
                      </div>
                      {step.completed && (
                        <div className="text-sm text-green-600">
                          {step.key === order.status ? "Hiện tại" : "Hoàn thành"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {order.status === "completed" && (
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-green-600">
                  <Award className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đơn hàng đã hoàn thành</h3>
                    <p className="text-sm text-green-500">
                      Cảm ơn bạn đã mua hàng! Đơn hàng đã được giao thành công và hoàn tất.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {order.status === "refunded" && (
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-blue-600">
                  <RotateCcw className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đơn hàng đã được hoàn trả</h3>
                    <p className="text-sm text-blue-500">
                      Đơn hàng của bạn đã được hoàn trả thành công. Tiền sẽ được chuyển về tài khoản trong 3-5 ngày làm
                      việc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancelled Order */}
          {order.status === "cancelled" && (
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-red-600">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">Đơn hàng đã bị hủy</h3>
                    <p className="text-sm text-red-500">
                      Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.author}</p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity} × {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Địa chỉ giao hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
                  {order.shippingAddress.city}
                </p>
                {order.shippingAddress.notes && (
                  <p className="text-sm text-gray-500 italic">Ghi chú: {order.shippingAddress.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-2">Cần hỗ trợ?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>📞 Hotline: (028) 1234 5678</p>
            <p>📧 Email: support@bookstore.vn</p>
            <p>🕒 Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
