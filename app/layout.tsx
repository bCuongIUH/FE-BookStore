import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
// Import CartProvider to wrap the app with cart context
import { CartProvider } from "@/contexts/cart-context"
import ChatSupport from "@/components/chat-support"

export const metadata: Metadata = {
  title: "BookStore - Cửa hàng sách trực tuyến",
  description: "Cửa hàng sách trực tuyến hàng đầu Việt Nam với hàng ngàn đầu sách chất lượng",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {/* Wrap with CartProvider to provide cart context to all components */}
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatSupport />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
