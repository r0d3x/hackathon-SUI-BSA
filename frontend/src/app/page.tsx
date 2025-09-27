'use client';

import { useMeltyFi } from '@/hooks/useMeltyFi';
import { formatSuiAmount, formatTimeLeft } from '@/lib/utils';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  ArrowRight,
  Clock,
  Coins,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

function StatsSection() {
  const { lotteries, isLoadingLotteries } = useMeltyFi();

  const activeLotteries = lotteries.filter(l => l.state === 'ACTIVE' && Date.now() < l.expirationDate);
  const totalValue = lotteries.reduce((sum, lottery) => {
    return sum + (parseInt(lottery.wonkaBarPrice) * parseInt(lottery.maxSupply));
  }, 0);

  const totalParticipants = lotteries.reduce((sum, lottery) => sum + lottery.participants, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {isLoadingLotteries ? '...' : activeLotteries.length}
        </div>
        <div className="text-white/60">Active Lotteries</div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {isLoadingLotteries ? '...' : `${formatSuiAmount(totalValue, 0)}`}
        </div>
        <div className="text-white/60">Total Value (SUI)</div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {isLoadingLotteries ? '...' : totalParticipants}
        </div>
        <div className="text-white/60">Total Participants</div>
      </div>
    </div>
  );
}

function FeaturedLotteries() {
  const { lotteries, isLoadingLotteries } = useMeltyFi();

  const featuredLotteries = lotteries
    .filter(l => l.state === 'ACTIVE' && Date.now() < l.expirationDate)
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 3);

  if (isLoadingLotteries) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-white/60 mt-4">Loading featured lotteries...</p>
      </div>
    );
  }

  if (featuredLotteries.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Active Lotteries</h3>
        <p className="text-white/60 mb-6">
          Be the first to create a lottery and unlock liquidity from your NFTs!
        </p>
        <Link
          href="/create"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Create First Lottery
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredLotteries.map((lottery) => (
        <div
          key={lottery.id}
          className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
              ACTIVE
            </div>
            <span className="text-xs text-white/60">#{lottery.lotteryId}</span>
          </div>

          <h3 className="font-semibold text-white mb-2">{lottery.collateralNft.name}</h3>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-white/60">Price</span>
              <p className="text-white font-medium">{formatSuiAmount(lottery.wonkaBarPrice)} SUI</p>
            </div>
            <div>
              <span className="text-white/60">Sold</span>
              <p className="text-white font-medium">{lottery.soldCount}/{lottery.maxSupply}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-white/60">
              <Clock className="w-3 h-3" />
              <span>{formatTimeLeft(lottery.expirationDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Users className="w-3 h-3" />
              <span>{lottery.participants}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { userStats } = useMeltyFi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Making the Illiquid Liquid</span>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Turn Your NFTs Into
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Instant Liquidity
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create lotteries with your NFTs, get instant liquidity, and let others win amazing prizes
              while earning ChocoChips. The sweetest DeFi protocol on Sui blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={currentAccount ? "/create" : "/lotteries"}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {currentAccount ? "Create Lottery" : "Explore Lotteries"}
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/lotteries"
                className="border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Browse Lotteries
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>

            {/* Testnet Banner */}
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-200 text-sm font-medium">
                Now live on Sui Testnet - Free to try!
              </span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-16">
          <StatsSection />
        </section>

        {/* Featured Lotteries */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Lotteries
            </h2>
            <p className="text-white/60 text-lg">
              Join the most popular lotteries and win amazing NFTs
            </p>
          </div>

          <FeaturedLotteries />

          <div className="text-center mt-12">
            <Link
              href="/lotteries"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              View All Lotteries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How MeltyFi Works
            </h2>
            <p className="text-white/60 text-lg">
              Simple, sweet, and secure NFT liquidity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Create Lottery</h3>
              <p className="text-white/60">
                Deposit your NFT and set lottery parameters. Get 95% of potential funds instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Buy WonkaBars</h3>
              <p className="text-white/60">
                Others purchase lottery tickets (WonkaBars) for a chance to win your NFT.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Win & Earn</h3>
              <p className="text-white/60">
                Winners get NFTs, participants earn ChocoChips, and you can repay to reclaim your NFT.
              </p>
            </div>
          </div>
        </section>

        {/* User Dashboard Preview */}
        {currentAccount && userStats && (
          <section className="container mx-auto px-6 py-16">
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Your MeltyFi Dashboard</h3>
                <Link
                  href="/profile"
                  className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2"
                >
                  View Full Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {userStats.activeLotteries}
                  </div>
                  <div className="text-white/60 text-sm">Active Lotteries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {userStats.totalWonkaBars}
                  </div>
                  <div className="text-white/60 text-sm">WonkaBars Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatSuiAmount(userStats.chocoChipBalance, 0)}
                  </div>
                  <div className="text-white/60 text-sm">ChocoChips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatSuiAmount(userStats.suiBalance, 2)}
                  </div>
                  <div className="text-white/60 text-sm">SUI Balance</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Melt Your NFTs?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join the sweetest DeFi revolution on Sui. Turn your illiquid NFTs into instant liquidity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Your First Lottery
              </Link>

              <Link
                href="/lotteries"
                className="border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                Explore Lotteries
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}