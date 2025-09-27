import { Footer } from '@/components/Footer'
import { Navigation } from '@/components/Navigation'
import { Providers } from '@/components/providers/Providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeltyFi - Making the Illiquid Liquid',
  description: 'The sweetest way to unlock liquidity from your NFTs on Sui blockchain. Create lotteries, fund loans, and everyone wins with our innovative chocolate factory-inspired DeFi protocol.',
  keywords: ['NFT', 'DeFi', 'Sui', 'Lottery', 'Liquidity', 'Blockchain'],
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
      <body className={`${inter.className} bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen bg-gray-900`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}