"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Clock, CheckCircle, RotateCcw, Award, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getOrdersByUserEmail, createSampleOrders, type Order } from "@/lib/orders-data"
import { message } from "antd"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để xem thông tin cá nhân!")
      router.push("/login")
      return
    }

    // Create sample orders and load user orders
    createSampleOrders()
    if (user?.email) {
      const userOrders = getOrdersByUserEmail(user.email)
      setOrders(userOrders)
    }
    setIsLoading(false)
  }, [isAuthenticated, user, router])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "Chờ xác nhận", color: "bg-yellow-500", icon: Clock },
      pending_payment: { text: "Chờ thanh toán", color: "bg-yellow-600", icon: Clock },
      confirmed: { text: "Đã xác nhận", color: "bg-blue-500", icon: CheckCircle },
      processing: { text: "Đang xử lý", color: "bg-purple-500", icon: Package },
      shipping: { text: "Đang giao hàng", color: "bg-orange-500", icon: Package },
      delivered: { text: "Đã giao hàng", color: "bg-green-500", icon: CheckCircle },
      completed: { text: "Hoàn thành", color: "bg-green-600", icon: Award },
      refunded: { text: "Đã hoàn trả", color: "bg-blue-600", icon: RotateCcw },
      cancelled: { text: "Đã hủy", color: "bg-red-500", icon: Clock },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon
    return (
      <Badge className={`${config.color} hover:${config.color} flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </Badge>
    )
  }

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      completed: orders.filter((o) => o.status === "completed").length,
      pending: orders.filter((o) => ["pending", "confirmed", "processing", "shipping"].includes(o.status)).length,
      refunded: orders.filter((o) => o.status === "refunded").length,
    }
    return stats
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const stats = getOrderStats()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
        <p className="text-gray-600">Quản lý thông tin và đơn hàng của bạn</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                    <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                    <p className="text-lg font-medium text-gray-900">{new Date().toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                    <Badge className="bg-green-500 hover:bg-green-600">Đã xác thực</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-600">Tổng đơn hàng</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-green-600">Hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                  <div className="text-sm text-orange-600">Đang xử lý</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.refunded}</div>
                  <div className="text-sm text-purple-600">Đã hoàn trả</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Lịch sử đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
                  <Button onClick={() => router.push("/products")} className="mt-4">
                    Mua sắm ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm text-blue-600">{order.orderNumber}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</div>
                          <div className="text-sm text-gray-500">{order.createdAt.toLocaleDateString("vi-VN")}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img
                              key={index}
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded border-2 border-white"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-10 h-10 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-xs font-medium">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {order.items.length} sản phẩm • {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                          </p>
                          {order.status === "completed" && order.completedDate && (
                            <p className="text-xs text-green-600">
                              Hoàn thành: {order.completedDate.toLocaleDateString("vi-VN")}
                            </p>
                          )}
                          {order.status === "refunded" && order.refundDate && (
                            <p className="text-xs text-blue-600">
                              Hoàn trả: {order.refundDate.toLocaleDateString("vi-VN")}
                              {order.refundReason && ` • ${order.refundReason}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/order-tracking?orderNumber=${order.orderNumber}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </Button>
                        {order.status === "delivered" && (
                          <Button size="sm" variant="outline">
                            Đánh giá
                          </Button>
                        )}
                        {order.status === "completed" && <Button size="sm">Mua lại</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
