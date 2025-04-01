import './globals.css'
import type { Metadata } from 'next'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'MISPRI - Flowers, Cakes & Gifts Delivery',
  description: 'Order fresh flowers, delicious cakes, and thoughtful gifts for delivery. Same day delivery available.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {/* Header and Footer are only rendered in the main layout, not in admin */}
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}





