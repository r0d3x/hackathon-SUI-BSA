'use client';

import { ArrowRight, Shield, Zap, Users, Trophy, ChevronRight, TrendingUp, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center">
            {/* Title */}
            <div className="flex justify-center mb-16 fade-in">
              <div className="bg-surface-elevated border border-border px-6 py-3 rounded-full">
                <span className="text-xl font-bold text-gradient">0% Liquidation Risk</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 slide-up">
              NFT Lending
              <br />
              <span className="text-gradient">Made Simple</span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto slide-up leading-relaxed">
            MeltyFi is a protocol enabling NFT holders to lend their NFTs without liquidation risk and allowing for a faster funding of the loan.
            </p>
    



            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center slide-up">
              <Link href="/create" className="btn-primary px-10 py-5 text-lg group">
                <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Create Lottery
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/lotteries" className="btn-outline px-10 py-5 text-lg group">
                Browse Lotteries
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 border border-border rounded-xl flex items-center justify-center mx-auto mb-8 group-hover:border-border-hover transition-all">
                <Lock className="w-10 h-10 text-gradient stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create a Loan</h3>
              <p className="text-text-secondary mb-3">
                Lock your NFT as collateral and set your terms. You'll receive 95% of all ticket sales immediately.
              </p>
              <p className="text-sm text-text-muted">
                You can cancel the loan anytime before expiration by repaying the funds you've received.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 border border-border rounded-xl flex items-center justify-center mx-auto mb-8 group-hover:border-border-hover transition-all">
                <Users className="w-10 h-10 text-gradient stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Participants Buy Tickets</h3>
              <p className="text-text-secondary mb-3">
                Users purchase WonkaBar tickets for a chance to win your NFT. Each ticket increases your liquidity.
              </p>
              <p className="text-sm text-text-muted">
                All participants earn ChocoChip rewards regardless of the lottery outcome.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 border border-border rounded-xl flex items-center justify-center mx-auto mb-8 group-hover:border-border-hover transition-all">
                <Trophy className="w-10 h-10 text-gradient stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Two Possible Outcomes</h3>
              <p className="text-text-secondary mb-3">
                Either repay the loan to reclaim your NFT, or let the lottery conclude and keep the funds.
              </p>
              <p className="text-sm text-text-muted">
                If you don't repay, a winner is selected to receive your NFT plus ChocoChip rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-12">
                Why Use MeltyFi?
              </h2>

              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 border border-border rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-gradient stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">NFT-Backed Loans</h3>
                    <p className="text-text-secondary">Get immediate liquidity from your NFTs without having to sell them permanently</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 border border-border rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gradient stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Secure & Transparent</h3>
                    <p className="text-text-secondary">All operations are handled by smart contracts on the Sui blockchain with full transparency</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 border border-border rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-gradient stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Dual-Sided Benefits</h3>
                    <p className="text-text-secondary">NFT owners get liquidity, participants get chances to win NFTs and earn rewards</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-2xl p-12">
              <div className="text-center">
                <div className="w-24 h-24 border border-border rounded-2xl flex items-center justify-center mx-auto mb-10">
                  <Image
                    src="/logo.png"
                    alt="MeltyFi"
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                </div>
                <div className="text-3xl font-bold text-white mb-6">How It's Different</div>
                <div className="text-text-secondary mb-8">
                  MeltyFi combines NFT lending with lottery mechanics
                </div>
                <ul className="space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-text-secondary"><span className="font-bold text-gradient">0% liquidation risk</span> - no forced selling of your NFT</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-text-secondary">No interest rates or collateral requirements</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-text-secondary">Immediate liquidity for NFT owners</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-text-secondary">Option to repay and keep your NFT</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to unlock your NFT's value?
          </h2>
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Create your first NFT-backed loan or participate in existing lotteries to win valuable NFTs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/create" className="btn-primary px-10 py-5 text-lg group">
              <Sparkles className="mr-2 w-5 h-5 stroke-[1.5] group-hover:rotate-12 transition-transform" />
              Create a Loan
              <ArrowRight className="ml-2 w-5 h-5 stroke-[1.5] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/lotteries" className="btn-outline px-10 py-5 text-lg group">
              Browse Lotteries
              <ArrowRight className="ml-2 w-5 h-5 stroke-[1.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}