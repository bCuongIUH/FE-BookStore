// export interface OrderItem {
//   productId: string
//   title: string
//   price: number
//   quantity: number
// }

// export interface OrderData {
//   items: OrderItem[]
//   deliveryAddress: {
//     street: string
//     ward: string
//     district: string
//     city: string
//   }
//   subtotal: number
//   shippingFee: number
//   tax: number
//   total: number
//   userId?: string
//   customerName?: string
//   customerPhone?: string
//   customerEmail?: string
// }

// export interface OrderResponse {
//   success: boolean
//   orderId?: string
//   message: string
//   data?: any
// }

// /**
//  * Create a new order and send to checkout API
//  * @param orderData - Order information including items, address, and pricing
//  * @returns Promise with order response
//  */
// export async function createOrder(orderData: OrderData): Promise<OrderResponse> {
//   try {
//     const response = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderData),
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.message || `Order creation failed with status ${response.status}`)
//     }

//     const data = await response.json()
//     return {
//       success: true,
//       orderId: data.orderId || data.id,
//       message: data.message || "Order created successfully",
//       data,
//     }
//   } catch (error) {
//     console.error("[v0] Order creation error:", error)
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to create order",
//     }
//   }
// }

// /**
//  * Checkout function to be called from cart page
//  * Prepares cart data and creates order
//  */
// export async function checkoutOrder(
//   cartItems: any[],
//   deliveryAddress: any,
//   subtotal: number,
//   shippingFee: number,
//   tax: number,
//   total: number,
//   userId?: string,
//   customerInfo?: { name?: string; phone?: string; email?: string },
// ): Promise<OrderResponse> {
//   // Format cart items for order
//   const orderItems: OrderItem[] = cartItems.map((item) => ({
//     productId: item.product.id,
//     title: item.product.title,
//     price: item.product.price,
//     quantity: item.quantity,
//   }))

//   // Prepare order data
//   const orderData: OrderData = {
//     items: orderItems,
//     deliveryAddress: {
//       street: deliveryAddress.street,
//       ward: deliveryAddress.ward,
//       district: deliveryAddress.district,
//       city: deliveryAddress.city,
//     },
//     subtotal,
//     shippingFee,
//     tax,
//     total,
//     userId,
//     customerName: customerInfo?.name,
//     customerPhone: customerInfo?.phone,
//     customerEmail: customerInfo?.email,
//   }

//   return createOrder(orderData)
// }
