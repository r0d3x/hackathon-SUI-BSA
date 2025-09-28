import { ConfigValidator } from '@/components/ConfigValidator'
import { Footer } from '@/components/Footer'
import Navigation from '@/components/Navigation'
import { Providers } from '@/components/providers/Providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeltyFi - Making the Illiquid Liquid',
  description: 'The sweetest way to unlock liquidity from your NFTs on Sui blockchain. Create lotteries, fund loans, and everyone wins with our innovative chocolate factory-inspired DeFi protocol.',
  keywords: ['NFT', 'DeFi', 'Sui', 'Lottery', 'Liquidity', 'Blockchain', 'Testnet'],
  authors: [{ name: 'MeltyFi Team' }],
  creator: 'MeltyFi',
  publisher: 'MeltyFi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen`}>
        <Providers>
          <ConfigValidator>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <div className="h-24" /> {/* Spacer for floating navigation */}
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ConfigValidator>
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}