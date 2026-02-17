import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OFT Bridge — LayerZero Omnichain',
  description: '支持所有 LayerZero OFT 代币的多链跨链桥',
  keywords: ['LayerZero', 'OFT', 'bridge', 'cross-chain', 'omnichain', 'DeFi'],
  openGraph: {
    title: 'OFT Bridge',
    description: '支持所有 LayerZero OFT 代币的多链跨链桥',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={inter.variable}>
      <body className="bg-bg text-white antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#181c25',
                color: '#e8eaf0',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#34d399', secondary: '#181c25' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#181c25' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
