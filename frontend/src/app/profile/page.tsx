'use client';

import { getExplorerUrl } from '@/constants/contracts';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { shortenAddress } from '@/lib/utils';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Coins,
    Copy,
    ExternalLink,
    Ticket,
    Trophy,
    User,
    Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function formatSuiAmount(amount: string | bigint) {
    const amountNum = typeof amount === 'string' ? BigInt(amount) : amount;
    return (Number(amountNum) / 1_000_000_000).toFixed(4);
}

function formatChocoChips(amount: string) {
    const amountNum = BigInt(amount);
    return (Number(amountNum) / 1_000_000_000).toFixed(2);
}

export default function ProfilePage() {
    const currentAccount = useCurrentAccount();
    const { data: balance } = useSuiClientQuery(
        'getBalance',
        { owner: currentAccount?.address || '' },
        { enabled: !!currentAccount?.address }
    );
    const {
        userStats,
        lotteries,
        userWonkaBars,
        isLoadingLotteries,
        isLoadingWonkaBars
    } = useMeltyFi();

    const [copiedAddress, setCopiedAddress] = useState(false);

    const copyAddress = async () => {
        if (currentAccount?.address) {
            await navigator.clipboard.writeText(currentAccount.address);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    if (!currentAccount) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center max-w-md">
                    <Wallet className="w-16 h-16 text-white/40 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-white/60 mb-8">
                        Connect your Sui wallet to access your profile and manage your lotteries.
                    </p>
                    <p className="text-sm text-white/40">
                        Make sure you're on Sui Testnet and have some testnet SUI tokens.
                    </p>
                </div>
            </div>
        );
    }

    // Get user's active lotteries
    const userLotteries = lotteries.filter(lottery => lottery.owner === currentAccount.address);
    const activeLotteries = userLotteries.filter(lottery => lottery.state === 'ACTIVE');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* User Info */}
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
                                <div className="flex items-center space-x-2 text-white/60">
                                    <span className="font-mono text-sm">
                                        {shortenAddress(currentAccount.address)}
                                    </span>
                                    <button
                                        onClick={copyAddress}
                                        className="h-6 w-6 p-0 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                    >
                                        {copiedAddress ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                    <a
                                        href={getExplorerUrl('address', currentAccount.address)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-6 w-6 p-0 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-4">
                            <Link
                                href="/create"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                Create Lottery
                            </Link>
                            <Link
                                href="/lotteries"
                                className="border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                Browse Lotteries
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* SUI Balance */}
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Wallet className="w-8 h-8 text-blue-400" />
                            <span className="text-sm text-white/60">Balance</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {formatSuiAmount(balance?.totalBalance || '0')} SUI
                        </div>
                        <div className="text-sm text-white/60">
                            ≈ ${(parseFloat(formatSuiAmount(balance?.totalBalance || '0')) * 0.5).toFixed(2)} USD
                        </div>
                    </div>

                    {/* ChocoChip Balance */}
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Coins className="w-8 h-8 text-yellow-400" />
                            <span className="text-sm text-white/60">ChocoChips</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {formatChocoChips(userStats?.chocoChipBalance || '0')}
                        </div>
                        <div className="text-sm text-white/60">
                            Reward tokens earned
                        </div>
                    </div>

                    {/* Active Lotteries */}
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Trophy className="w-8 h-8 text-purple-400" />
                            <span className="text-sm text-white/60">Lotteries</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {userStats?.activeLotteries || 0}
                        </div>
                        <div className="text-sm text-white/60">
                            Active of {userStats?.totalLotteries || 0} total
                        </div>
                    </div>

                    {/* WonkaBars */}
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Ticket className="w-8 h-8 text-pink-400" />
                            <span className="text-sm text-white/60">WonkaBars</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {userStats?.totalWonkaBars || 0}
                        </div>
                        <div className="text-sm text-white/60">
                            Lottery tickets owned
                        </div>
                    </div>
                </div>

                {/* My Lotteries Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">My Lotteries</h2>
                        {userLotteries.length > 0 && (
                            <Link
                                href="/create"
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                                Create New Lottery →
                            </Link>
                        )}
                    </div>

                    {isLoadingLotteries ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            <p className="text-white/60 mt-4">Loading your lotteries...</p>
                        </div>
                    ) : userLotteries.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                            <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Lotteries Yet</h3>
                            <p className="text-white/60 mb-6">
                                Create your first lottery to start earning liquidity from your NFTs.
                            </p>
                            <Link
                                href="/create"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block"
                            >
                                Create Your First Lottery
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userLotteries.map((lottery) => (
                                <div
                                    key={lottery.id}
                                    className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${lottery.state === 'ACTIVE'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : lottery.state === 'CONCLUDED'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                            {lottery.state}
                                        </div>
                                        <span className="text-sm text-white/60">#{lottery.lotteryId}</span>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-white mb-2">{lottery.collateralNft.name}</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-white/60">Sold</span>
                                                <p className="text-white font-medium">{lottery.soldCount}/{lottery.maxSupply}</p>
                                            </div>
                                            <div>
                                                <span className="text-white/60">Price</span>
                                                <p className="text-white font-medium">{formatSuiAmount(lottery.wonkaBarPrice)} SUI</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60">
                                            {lottery.state === 'ACTIVE'
                                                ? `Expires ${new Date(lottery.expirationDate).toLocaleDateString()}`
                                                : 'Completed'
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My WonkaBars Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">My WonkaBars</h2>
                        {userWonkaBars.length > 0 && (
                            <Link
                                href="/lotteries"
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                                Buy More Tickets →
                            </Link>
                        )}
                    </div>

                    {isLoadingWonkaBars ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            <p className="text-white/60 mt-4">Loading your WonkaBars...</p>
                        </div>
                    ) : userWonkaBars.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                            <Ticket className="w-16 h-16 text-white/40 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No WonkaBars Yet</h3>
                            <p className="text-white/60 mb-6">
                                Purchase WonkaBars from active lotteries to win amazing NFTs and earn ChocoChips.
                            </p>
                            <Link
                                href="/lotteries"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block"
                            >
                                Browse Active Lotteries
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {userWonkaBars.map((wonkaBar) => {
                                const associatedLottery = lotteries.find(l => l.id === wonkaBar.lotteryId);
                                return (
                                    <div
                                        key={wonkaBar.id}
                                        className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <Ticket className="w-6 h-6 text-pink-400" />
                                            <span className="text-xs text-white/60">
                                                Qty: {wonkaBar.ticketCount}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className="font-medium text-white text-sm mb-1">
                                                {associatedLottery?.collateralNft.name || `Lottery #${wonkaBar.lotteryId.slice(-4)}`}
                                            </h4>
                                            <p className="text-xs text-white/60">
                                                Purchased {new Date(wonkaBar.purchasedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {associatedLottery && (
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${associatedLottery.state === 'ACTIVE'
                                                ? 'bg-green-500/20 text-green-400'
                                                : associatedLottery.state === 'CONCLUDED'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {associatedLottery.state}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Low Balance Warning */}
                {balance && Number(balance.totalBalance) < 100_000_000 && (
                    <div className="mt-8 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <div>
                                <h3 className="font-medium text-yellow-200">Low SUI Balance</h3>
                                <p className="text-sm text-yellow-200/70">
                                    You have a low SUI balance. Get more testnet SUI from the{' '}
                                    <a
                                        href="https://faucet.testnet.sui.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-yellow-100"
                                    >
                                        faucet
                                    </a>
                                    {' '}to continue using MeltyFi.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}