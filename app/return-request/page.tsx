// "use client"

// import React from "react"

// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Upload, ArrowLeft, CheckCircle } from "lucide-react"
// import axios from "axios"
// import { message } from "antd"

// interface OrderItem {
//   productId: string
//   title: string
//   price: number
//   quantity: number
//   image?: string
// }

// interface Order {
//   _id: string
//   orderCode: string
//   status: string
//   total: number
//   createdAt: string
//   paymentMethod: string
//   items: OrderItem[]
// }

// const RETURN_REASONS = [
//   { value: "defective", label: "Sản phẩm bị lỗi/hư hỏng" },
//   { value: "not_as_described", label: "Sản phẩm không như mô tả" },
//   { value: "wrong_item", label: "Gửi nhầm sản phẩm" },
//   { value: "damaged_shipping", label: "Hư hỏng trong quá trình vận chuyển" },
//   { value: "changed_mind", label: "Thay đổi ý định" },
//   { value: "better_price", label: "Tìm được giá rẻ hơn" },
//   { value: "other", label: "Lý do khác" },
// ]

// export default function ReturnRequestPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const orderCode = searchParams.get("orderNumber")

//   const [order, setOrder] = useState<Order | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitted, setSubmitted] = useState(false)

//   const [formData, setFormData] = useState({
//     reason: "",
//     description: "",
//     image: null as File | null,
//   })

//   // Fetch order details
//   React.useEffect(() => {
//     const fetchOrder = async () => {
//       if (!orderCode) {
//         message.error("Không tìm thấy mã đơn hàng")
//         router.push("/profile")
//         return
//       }
//       try {
//         const res = await axios.get(`http://localhost:5000/api/orders/orderCode/${orderCode}`)
//         if (res.data.success) {
//           setOrder(res.data.order)
//         }
//       } catch (error: any) {
//         console.error("Lỗi khi lấy thông tin đơn hàng:", error)
//         message.error("Không thể tải thông tin đơn hàng!")
//         router.push("/profile")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchOrder()
//   }, [orderCode, router])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         message.error("Kích thước file không được vượt quá 5MB")
//         return
//       }
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         message.error("Vui lòng chọn một file hình ảnh")
//         return
//       }
//       setFormData({ ...formData, image: file })
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.reason) {
//       message.error("Vui lòng chọn lý do trả hàng")
//       return
//     }

//     if (!formData.image) {
//       message.error("Vui lòng tải lên hình ảnh chứng minh")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const uploadFormData = new FormData()
//       uploadFormData.append("image", formData.image)
//       uploadFormData.append("orderCode", orderCode || "")
//       uploadFormData.append("reason", formData.reason)
//       uploadFormData.append("description", formData.description)

//       const res = await axios.post("http://localhost:5000/api/returns/return", uploadFormData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
// console.log("len",uploadFormData);

//       if (res.data.success) {
//         setSubmitted(true)
//         message.success("Yêu cầu hoàn trả đã được gửi thành công!")
//         setTimeout(() => {
//           router.push("/profile")
//         }, 2000)
//       }
//     } catch (error: any) {
//       console.error("Lỗi khi gửi yêu cầu hoàn trả:", error)
//       message.error(error.response?.data?.message || "Không thể gửi yêu cầu hoàn trả")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-32 bg-gray-200 rounded"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     )
//   }

//   if (!order) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <p className="text-center text-gray-600">Không tìm thấy đơn hàng</p>
//       </div>
//     )
//   }

//   if (submitted) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu hoàn trả đã được gửi</h1>
//           <p className="text-gray-600 mb-6">Chúng tôi sẽ xem xét yêu cầu của bạn trong 1-2 ngày làm việc</p>
//           <Button onClick={() => router.push("/profile")}>Quay lại trang cá nhân</Button>
//         </div>
//       </div>
//     )
//   }

//   const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8 flex items-center space-x-2">
//         <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Quay lại
//         </Button>
//       </div>

//       <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu hoàn trả</h1>
//       <p className="text-gray-600 mb-8">Gửi yêu cầu hoàn trả cho đơn hàng của bạn</p>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Mã đơn hàng</label>
//                 <p className="font-mono text-sm text-blue-600">{order.orderCode}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Trạng thái</label>
//                 <Badge className="bg-green-500 hover:bg-green-600 mt-1">Đã giao hàng</Badge>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Tổng tiền</label>
//                 <p className="text-xl font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Ngày đặt hàng</label>
//                 <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Số sản phẩm</label>
//                 <p className="text-sm">{totalItems} sản phẩm</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Order Items Preview */}
//           <Card className="mt-4">
//             <CardHeader>
//               <CardTitle className="text-lg">Sản phẩm</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {order.items?.map((item) => (
//                   <div key={item.productId} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                     <img
//                       src={item.image || "/placeholder.svg"}
//                       alt={item.title}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
//                       <p className="text-xs text-gray-500">x{item.quantity}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Return Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Chi tiết yêu cầu hoàn trả</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Reason Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-3">
//                     Lý do hoàn trả <span className="text-red-500">*</span>
//                   </label>
//                   <div className="space-y-2">
//                     {RETURN_REASONS.map((reason) => (
//                       <label
//                         key={reason.value}
//                         className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
//                       >
//                         <input
//                           type="radio"
//                           name="reason"
//                           value={reason.value}
//                           checked={formData.reason === reason.value}
//                           onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                           className="w-4 h-4"
//                         />
//                         <span className="ml-3 text-sm text-gray-900">{reason.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-2">Mô tả chi tiết (tùy chọn)</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="Vui lòng mô tả chi tiết về vấn đề..."
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                     rows={4}
//                   />
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-3">
//                     Tải lên hình ảnh chứng minh <span className="text-red-500">*</span>
//                   </label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <label htmlFor="image-upload" className="cursor-pointer block">
//                       <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                       <p className="text-sm text-gray-600">
//                         {formData.image ? (
//                           <span className="text-green-600 font-medium">{formData.image.name}</span>
//                         ) : (
//                           <>
//                             Kéo thả hình ảnh hoặc <span className="text-blue-600">bấm để chọn</span>
//                           </>
//                         )}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF. Tối đa 5MB</p>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex space-x-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => router.push("/profile")}
//                     disabled={isSubmitting}
//                   >
//                     Hủy
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting} className="flex-1">
//                     {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu hoàn trả"}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, ArrowLeft, CheckCircle } from "lucide-react"
import axios from "axios"
import { message } from "antd"
import { useAuth } from "@/contexts/auth-context"

interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  _id: string
  orderCode: string
  status: string
  total: number
  createdAt: string
  paymentMethod: string
  items: OrderItem[]
}

const RETURN_REASONS = [
  { value: "defective", label: "Sản phẩm bị lỗi/hư hỏng" },
  { value: "not_as_described", label: "Sản phẩm không như mô tả" },
  { value: "wrong_item", label: "Gửi nhầm sản phẩm" },
  { value: "damaged_shipping", label: "Hư hỏng trong quá trình vận chuyển" },
  { value: "changed_mind", label: "Thay đổi ý định" },
  { value: "better_price", label: "Tìm được giá rẻ hơn" },
  { value: "other", label: "Lý do khác" },
]

export default function ReturnRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderCode = searchParams.get("orderNumber")
  const { user } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    image: null as File | null,
  })

  React.useEffect(() => {
    const fetchOrder = async () => {
      if (!orderCode) {
        message.error("Không tìm thấy mã đơn hàng")
        router.push("/profile")
        return
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/orderCode/${orderCode}`)
        if (res.data.success) {
          setOrder(res.data.order)
        }
      } catch (error: any) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error)
        message.error("Không thể tải thông tin đơn hàng!")
        router.push("/profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderCode, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Kích thước file không được vượt quá 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        message.error("Vui lòng chọn một file hình ảnh")
        return
      }
      setFormData({ ...formData, image: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reason) {
      message.error("Vui lòng chọn lý do trả hàng")
      return
    }

    if (!formData.image) {
      message.error("Vui lòng tải lên hình ảnh chứng minh")
      return
    }

    setIsSubmitting(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("image", formData.image)
      uploadFormData.append("orderId", order?._id || "")
      uploadFormData.append("requestedBy", user?.id || "")
      uploadFormData.append("reason", formData.reason)
      uploadFormData.append("description", formData.description)

      const res = await axios.post("http://localhost:5000/api/returns/return", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data.success) {
        setSubmitted(true)
        message.success("Yêu cầu hoàn trả đã được gửi thành công!")
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi yêu cầu hoàn trả:", error)
      message.error(error.response?.data?.message || "Không thể gửi yêu cầu hoàn trả")
    } finally {
      setIsSubmitting(false)
    }
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

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu hoàn trả đã được gửi</h1>
          <p className="text-gray-600 mb-6">Chúng tôi sẽ xem xét yêu cầu của bạn trong 1-2 ngày làm việc</p>
          <Button onClick={() => router.push("/profile")}>Quay lại trang cá nhân</Button>
        </div>
      </div>
    )
  }

  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu hoàn trả</h1>
      <p className="text-gray-600 mb-8">Gửi yêu cầu hoàn trả cho đơn hàng của bạn</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Mã đơn hàng</label>
                <p className="font-mono text-sm text-blue-600">{order.orderCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <Badge className="bg-green-500 hover:bg-green-600 mt-1">Đã giao hàng</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tổng tiền</label>
                <p className="text-xl font-bold text-red-600">{order.total.toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày đặt hàng</label>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Số sản phẩm</label>
                <p className="text-sm">{totalItems} sản phẩm</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3 pb-3 border-b last:border-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết yêu cầu hoàn trả</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Lý do hoàn trả <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {RETURN_REASONS.map((reason) => (
                      <label
                        key={reason.value}
                        className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.value}
                          checked={formData.reason === reason.value}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 text-sm text-gray-900">{reason.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Mô tả chi tiết (tùy chọn)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Vui lòng mô tả chi tiết về vấn đề..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Tải lên hình ảnh chứng minh <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.image ? (
                          <span className="text-green-600 font-medium">{formData.image.name}</span>
                        ) : (
                          <>
                            Kéo thả hình ảnh hoặc <span className="text-blue-600">bấm để chọn</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF. Tối đa 5MB</p>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu hoàn trả"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
