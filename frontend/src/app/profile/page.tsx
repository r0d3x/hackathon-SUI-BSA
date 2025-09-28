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
import SafeImage from '@/components/SafeImage';

function formatSuiAmount(amount: string | bigint) {
    const amountNum = typeof amount === 'string' ? BigInt(amount) : amount;
    return (Number(amountNum) / 1_000_000_000).toFixed(4);
}

function formatChocoChips(amount: string) {
    const amountNum = BigInt(amount);
    return (Number(amountNum) / 1_000_000_000).toFixed(2);
}

interface LotteryGridProps {
    lotteries: any[];
    currentUserAddress?: string;
    isOwner?: boolean;
}

function LotteryGrid({ lotteries, currentUserAddress, isOwner }: LotteryGridProps) {
    const { cancelLottery, isCancellingLottery } = useMeltyFi();

    const handleRepayLoan = async (lotteryId: string) => {
        try {
            console.log('💰 Repaying loan for lottery:', lotteryId);
            await cancelLottery({ lotteryId });
        } catch (error) {
            console.error('Failed to repay loan:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotteries.map((lottery) => {
                const isExpired = Date.now() > lottery.expirationDate;
                const isSoldOut = parseInt(lottery.soldCount) >= parseInt(lottery.maxSupply);
                const canRepay = isOwner && lottery.state === 'ACTIVE' && parseInt(lottery.soldCount) === 0;
                
                const timeLeft = lottery.expirationDate - Date.now();
                const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                return (
                    <div
                        key={lottery.id}
                        className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-all duration-300"
                    >
                        {/* NFT Image */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <SafeImage
                                src={lottery.collateralNft.imageUrl}
                                alt={lottery.collateralNft.name}
                                fill
                                className="object-cover"
                                fallbackIcon={<Ticket className="w-8 h-8 text-white" />}
                            />

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${lottery.state === 'ACTIVE' && !isExpired && !isSoldOut
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : isExpired
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : isSoldOut
                                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                    {isExpired ? 'EXPIRED' : isSoldOut ? 'SOLD OUT' : lottery.state}
                                </div>
                            </div>

                            {/* Lottery ID */}
                            <div className="absolute top-4 right-4">
                                <div className="px-2 py-1 bg-black/50 rounded text-xs text-white/80">
                                    #{lottery.lotteryId}
                                </div>
                            </div>

                            {isOwner && (
                                <div className="absolute bottom-4 left-4">
                                    <div className="px-2 py-1 bg-purple-500/80 rounded text-xs text-white font-medium">
                                        Your NFT
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-white mb-1">{lottery.collateralNft.name}</h3>
                                {lottery.collateralNft.collection && (
                                    <p className="text-sm text-white/60">{lottery.collateralNft.collection}</p>
                                )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-xs text-white/60">Price per WonkaBar</span>
                                    <p className="text-sm font-medium text-white">{formatSuiAmount(lottery.wonkaBarPrice)} SUI</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60">Sold</span>
                                    <p className="text-sm font-medium text-white">{lottery.soldCount}/{lottery.maxSupply}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60">Participants</span>
                                    <p className="text-sm font-medium text-white">{lottery.participants}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60">Time Left</span>
                                    <p className="text-sm font-medium text-white">
                                        {isExpired ? 'Expired' : `${daysLeft}d ${hoursLeft}h`}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-white/60 mb-2">
                                    <span>Progress</span>
                                    <span>{Math.round((parseInt(lottery.soldCount) / parseInt(lottery.maxSupply)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(parseInt(lottery.soldCount) / parseInt(lottery.maxSupply)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Section */}
                            {canRepay ? (
                                <div className="space-y-3">
                                    <div className="text-center py-2">
                                        <p className="text-sm text-white/60 mb-3">No participants yet - you can cancel and get your NFT back</p>
                                        <button
                                            onClick={() => handleRepayLoan(lottery.id)}
                                            disabled={isCancellingLottery}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                        >
                                            {isCancellingLottery ? 'Cancelling...' : 'Cancel & Get NFT Back'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    {lottery.state === 'CONCLUDED' ? (
                                        <p className="text-sm text-blue-400">Lottery completed</p>
                                    ) : lottery.state === 'CANCELLED' ? (
                                        <p className="text-sm text-red-400">Lottery cancelled</p>
                                    ) : parseInt(lottery.soldCount) > 0 ? (
                                        <p className="text-sm text-yellow-400">Cannot cancel - WonkaBars already sold</p>
                                    ) : isExpired ? (
                                        <p className="text-sm text-red-400">Lottery has expired</p>
                                    ) : (
                                        <p className="text-sm text-white/60">Lottery active</p>
                                    )}
                                </div>
                            )}

                            {/* Explorer Link */}
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <a
                                    href={getExplorerUrl('object', lottery.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    View on Explorer <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface WonkaBarGridProps {
    wonkaBars: any[];
    lotteries: any[];
    currentUserAddress?: string;
}

function WonkaBarGrid({ wonkaBars, lotteries, currentUserAddress }: WonkaBarGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wonkaBars.map((wonkaBar) => {
                const associatedLottery = lotteries.find(l => l.lotteryId === wonkaBar.lotteryId);
                const isWinner = associatedLottery?.winner === currentUserAddress;
                const isExpired = associatedLottery ? Date.now() > associatedLottery.expirationDate : false;
                
                return (
                    <div
                        key={wonkaBar.id}
                        className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-all duration-300"
                    >
                        {/* NFT Image */}
                        {associatedLottery && (
                            <div className="relative h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                                <SafeImage
                                    src={associatedLottery.collateralNft.imageUrl}
                                    alt={associatedLottery.collateralNft.name}
                                    fill
                                    className="object-cover"
                                    fallbackIcon={<Ticket className="w-6 h-6 text-white" />}
                                />

                                {/* Winner Badge */}
                                {isWinner && (
                                    <div className="absolute top-2 left-2">
                                        <div className="px-2 py-1 bg-yellow-500/90 text-yellow-900 rounded text-xs font-bold">
                                            🏆 WINNER!
                                        </div>
                                    </div>
                                )}

                                {/* Ticket Count */}
                                <div className="absolute top-2 right-2">
                                    <div className="px-2 py-1 bg-black/50 rounded text-xs text-white">
                                        {wonkaBar.ticketCount} tickets
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-4">
                            {/* Header */}
                            <div className="mb-3">
                                <h4 className="font-semibold text-white text-sm mb-1">
                                    {associatedLottery?.collateralNft.name || `Lottery #${wonkaBar.lotteryId}`}
                                </h4>
                                <p className="text-xs text-white/60">
                                    Purchased {new Date(wonkaBar.purchasedAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Stats */}
                            {associatedLottery && (
                                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                    <div>
                                        <span className="text-white/60">Status</span>
                                        <p className="text-white font-medium">
                                            {isWinner ? 'Won!' : 
                                             associatedLottery.state === 'CONCLUDED' ? 'Lost' :
                                             associatedLottery.state === 'ACTIVE' ? 'Active' : 
                                             associatedLottery.state}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-white/60">Progress</span>
                                        <p className="text-white font-medium">
                                            {associatedLottery.soldCount}/{associatedLottery.maxSupply}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar */}
                            {associatedLottery && (
                                <div className="mb-3">
                                    <div className="w-full bg-white/10 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                isWinner ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                'bg-gradient-to-r from-purple-500 to-pink-500'
                                            }`}
                                            style={{ width: `${(parseInt(associatedLottery.soldCount) / parseInt(associatedLottery.maxSupply)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status and Actions */}
                            <div className="flex items-center justify-between">
                                {associatedLottery && (
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        isWinner ? 'bg-yellow-500/20 text-yellow-400' :
                                        associatedLottery.state === 'ACTIVE'
                                            ? 'bg-green-500/20 text-green-400'
                                            : associatedLottery.state === 'CONCLUDED'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {isWinner ? 'Winner' : associatedLottery.state}
                                    </div>
                                )}
                                
                                <a
                                    href={getExplorerUrl('object', wonkaBar.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-white/40 hover:text-white/60 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
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
                        <LotteryGrid 
                            lotteries={userLotteries} 
                            currentUserAddress={currentAccount?.address}
                            isOwner={true}
                        />
                    )}
                </div>

                {/* My WonkaBars Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">My WonkaBars</h2>
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
                        <WonkaBarGrid 
                            wonkaBars={userWonkaBars} 
                            lotteries={lotteries}
                            currentUserAddress={currentAccount?.address}
                        />
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