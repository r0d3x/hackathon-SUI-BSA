'use client'

import { cn } from "@/lib/utils"
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Coins,
  Gift,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const features = [
  {
    icon: <Trophy className="w-8 h-8 text-amber-400" />,
    title: "NFT Lotteries",
    description: "Create exciting lotteries with your valuable NFTs as prizes, attracting multiple participants who fund your immediate liquidity needs."
  },
  {
    icon: <Coins className="w-8 h-8 text-purple-400" />,
    title: "Instant Liquidity",
    description: "Get 95% of funds immediately when your lottery fills up, no waiting required. Keep your NFT if you repay before expiration."
  },
  {
    icon: <Shield className="w-8 h-8 text-green-400" />,
    title: "Win-Win Mechanics",
    description: "Everyone benefits! Borrowers get liquidity, lenders get potential NFT prizes plus ChocoChip rewards, creating positive-sum outcomes."
  },
  {
    icon: <Users className="w-8 h-8 text-blue-400" />,
    title: "Community Driven",
    description: "Join a thriving ecosystem where lenders support borrowers while earning rewards, building a cooperative DeFi community."
  }
]

// Static stats to prevent hydration issues
const stats = [
  { label: "Total Volume", value: "2.4M SUI", change: "+12.5%", icon: <TrendingUp className="w-6 h-6 text-green-400" /> },
  { label: "Active Lotteries", value: "47", change: "+8", icon: <Trophy className="w-6 h-6 text-amber-400" /> },
  { label: "Successful Loans", value: "892", change: "+23%", icon: <CheckCircle className="w-6 h-6 text-emerald-400" /> },
  { label: "Happy Users", value: "3.2K", change: "+156", icon: <Users className="w-6 h-6 text-blue-400" /> }
]

const howItWorksSteps = [
  {
    step: 1,
    title: "Create Lottery",
    description: "Deposit your valuable NFT and set lottery parameters. Get 95% of funds immediately while keeping ownership rights.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    step: 2,
    title: "Buy WonkaBars",
    description: "Lenders purchase WonkaBars (lottery tickets), funding your loan while getting a chance to win your NFT.",
    icon: <Gift className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: 3,
    title: "Everyone Wins",
    description: "Repay to keep your NFT, or let lottery conclude. Winners get NFTs, others get ChocoChips. Everyone benefits!",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500",
  }
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    // Small delay to ensure proper mounting
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Don't render complex animations until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-amber-400 via-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
              Welcome to<br />MeltyFi
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              The sweetest way to unlock liquidity from your NFTs. Create lotteries, fund loans, and everyone wins with our
              innovative chocolate factory-inspired DeFi protocol on Sui.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
      </div>

      {/* Hero Section */}
      <section className={cn(
        "relative z-10 container mx-auto px-6 pt-20 pb-16 transition-all duration-1000",
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}>
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Now Live on Sui Network
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-amber-400 via-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
            Welcome to<br />MeltyFi
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            The sweetest way to unlock liquidity from your NFTs. Create lotteries, fund loans, and everyone wins with our
            innovative chocolate factory-inspired DeFi protocol on Sui.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link href="/lotteries">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group flex items-center">
                <Trophy className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Explore Lotteries
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="/profile">
              <button className="border border-amber-300/50 text-amber-300 hover:bg-amber-300/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 rounded-md">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 p-6 text-center">
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-white/60 mb-1">{stat.label}</div>
              <div className="text-xs text-green-400 font-semibold">{stat.change}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Sweet Features
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience the sweet taste of liquidity with our innovative features designed to make everyone a winner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group h-full p-8">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Sweet & Simple Process
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Three simple steps to unlock liquidity from your NFTs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="group">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br text-white shadow-lg group-hover:shadow-2xl transition-all duration-300",
                    step.color
                  )}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Protocol Deep Dive */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              The Chocolate Factory Protocol
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Like Willy Wonka's magical factory, MeltyFi transforms your NFTs into golden tickets of opportunity.
              Here's how our sweet protocol works its magic on Sui blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Instant NFT Liquidity</h3>
                  <p className="text-white/80 leading-relaxed">
                    Transform your illiquid NFTs into immediate cash flow. Create a lottery with your valuable NFT as the prize,
                    and receive 95% of the funding instantly when WonkaBars are purchased.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">WonkaBar Magic</h3>
                  <p className="text-white/80 leading-relaxed">
                    Lenders buy WonkaBars (lottery tickets) to participate. Each WonkaBar represents both a funding contribution
                    and a chance to win the NFT prize, creating excitement around lending.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">ChocoChip Rewards</h3>
                  <p className="text-white/80 leading-relaxed">
                    Win or lose, everyone gets rewarded! All participants receive ChocoChips, our protocol token that represents
                    your contribution to the ecosystem and provides additional utility.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Two Sweet Scenarios</h3>

              <div className="space-y-6">
                <div className="bg-green-500/20 rounded-lg p-6 border border-green-500/30">
                  <h4 className="font-semibold text-green-300 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Successful Repayment
                  </h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• Borrower repays loan before expiration</li>
                    <li>• Borrower gets NFT back + ChocoChips</li>
                    <li>• Lenders get full refund + ChocoChips</li>
                    <li>• Everyone wins! 🎉</li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 rounded-lg p-6 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Lottery Conclusion
                  </h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• Lottery expires, random winner selected</li>
                    <li>• Lucky winner gets the NFT + ChocoChips</li>
                    <li>• Other participants get ChocoChips</li>
                    <li>• Borrower keeps the borrowed funds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Ready to Enter the Factory?
        </h2>
        <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
          Join thousands of users who've discovered the magic of liquid NFTs on Sui blockchain.
          Your golden ticket to DeFi innovation awaits!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/lotteries">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg rounded-md shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group flex items-center">
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Launch App
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <a
            href="https://docs.meltyfi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 rounded-md inline-block"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  )
}