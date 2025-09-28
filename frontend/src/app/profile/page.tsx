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
    DollarSign,
    ExternalLink,
    Gift,
    Sparkles,
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
                const canRepay = isOwner && lottery.state === 'ACTIVE' && !isExpired;
                
                const timeLeft = lottery.expirationDate - Date.now();
                const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                return (
                    <div
                        key={lottery.id}
                        className="card-premium overflow-hidden group hover:glow-blue transition-all duration-300"
                    >
                        {/* NFT Image */}
                        <div className="relative h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <SafeImage
                                src={lottery.collateralNft.imageUrl}
                                alt={lottery.collateralNft.name}
                                fill
                                className="object-cover"
                                fallbackIcon={<Ticket className="w-10 h-10 text-white" />}
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-5 left-5">
                                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                    lottery.state === 'ACTIVE' && !isExpired && !isSoldOut
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
                            <div className="absolute top-5 right-5">
                                <div className="px-3 py-1.5 bg-black/50 rounded text-xs text-white/80">
                                    #{lottery.lotteryId}
                                </div>
                            </div>

                            {isOwner && (
                                <div className="absolute bottom-5 left-5">
                                    <div className="px-3 py-1.5 bg-purple-500/80 rounded text-xs text-white font-medium">
                                        Your NFT
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{lottery.collateralNft.name}</h3>
                                {lottery.collateralNft.collection && (
                                    <p className="text-sm text-white/60">{lottery.collateralNft.collection}</p>
                                )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <span className="text-xs text-white/60 block mb-1">Price per WonkaBar</span>
                                    <p className="text-base font-medium text-white">{formatSuiAmount(lottery.wonkaBarPrice)} SUI</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60 block mb-1">Sold</span>
                                    <p className="text-base font-medium text-white">{lottery.soldCount}/{lottery.maxSupply}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60 block mb-1">Participants</span>
                                    <p className="text-base font-medium text-white">{lottery.participants}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-white/60 block mb-1">Time Left</span>
                                    <p className="text-base font-medium text-white">
                                        {isExpired ? 'Expired' : `${daysLeft}d ${hoursLeft}h ${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}m`}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between text-xs text-white/60 mb-3">
                                    <span>Progress</span>
                                    <span>{Math.round((parseInt(lottery.soldCount) / parseInt(lottery.maxSupply)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-3">
                                    <div
                                        className="bg-gradient-primary h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(parseInt(lottery.soldCount) / parseInt(lottery.maxSupply)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Section */}
                            {canRepay ? (
                                <div>
                                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 stroke-[1.5]" />
                                            <span>
                                                {parseInt(lottery.soldCount) === 0 ? 
                                                    'No participants yet' : 
                                                    `Repay ${((parseInt(lottery.totalRaised) || 0) / 1_000_000_000).toFixed(4)} SUI`
                                                }
                                            </span>
                                        </div>
                                        <span>{parseInt(lottery.soldCount)} tickets sold</span>
                                    </div>
                                    <button
                                        onClick={() => handleRepayLoan(lottery.id)}
                                        disabled={isCancellingLottery}
                                        className="w-full btn-primary py-3 text-base font-medium"
                                    >
                                        {isCancellingLottery ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Cancelling...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <DollarSign className="w-4 h-4 stroke-[1.5]" />
                                                <span>Repay Loan & Get NFT Back</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-white/60">
                                        {lottery.state === 'CONCLUDED' ? 'Lottery completed' : 
                                         lottery.state === 'CANCELLED' ? 'Lottery cancelled' : 
                                         isExpired ? 'Lottery expired' : 'Lottery active'}
                                    </div>
                                    <a
                                        href={getExplorerUrl('object', lottery.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/40 hover:text-white/60 transition-colors flex items-center space-x-1"
                                    >
                                        <span>View on Explorer</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            )}


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
    meltWonkaBar: (params: { wonkaBarId: string, lotteryId: string }) => Promise<any>;
    isMeltingWonkaBar: boolean;
}

function WonkaBarGrid({ wonkaBars, lotteries, currentUserAddress, meltWonkaBar, isMeltingWonkaBar }: WonkaBarGridProps) {
    const handleMeltWonkaBar = async (wonkaBarId: string, lotteryId: string) => {
        try {
            await meltWonkaBar({ wonkaBarId, lotteryId });
        } catch (error) {
            console.error('Error melting WonkaBar:', error);
        }
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wonkaBars.map((wonkaBar) => {
                const associatedLottery = lotteries.find(l => l.lotteryId === wonkaBar.lotteryId);
                const isWinner = associatedLottery?.winner === currentUserAddress;
                const isExpired = associatedLottery ? Date.now() > associatedLottery.expirationDate : false;
                
                return (
                    <div
                        key={wonkaBar.id}
                        className="card-premium overflow-hidden group hover:glow-blue transition-all duration-300"
                    >
                        {/* NFT Image */}
                        {associatedLottery && (
                            <div className="relative h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                                <SafeImage
                                    src={associatedLottery.collateralNft.imageUrl}
                                    alt={associatedLottery.collateralNft.name}
                                    fill
                                    className="object-cover"
                                    fallbackIcon={<Ticket className="w-10 h-10 text-white" />}
                                />

                                {/* Winner Badge */}
                                {isWinner && (
                                    <div className="absolute top-5 left-5">
                                        <div className="px-3 py-1.5 bg-yellow-500/90 text-yellow-900 rounded text-xs font-bold flex items-center space-x-1">
                                            <Trophy className="w-3 h-3" />
                                            <span>WINNER!</span>
                                        </div>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-5 right-5">
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                        isWinner ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        associatedLottery?.state === 'CONCLUDED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        isExpired ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        associatedLottery?.state === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                        {isWinner ? 'WON' : 
                                         associatedLottery?.state === 'CONCLUDED' ? 'CONCLUDED' :
                                         isExpired ? 'EXPIRED' :
                                         associatedLottery?.state === 'ACTIVE' ? 'ACTIVE' : 
                                         associatedLottery?.state || 'UNKNOWN'}
                                    </div>
                                </div>

                                {/* Ticket Count */}
                                <div className="absolute bottom-5 right-5">
                                    <div className="px-3 py-1.5 bg-black/50 rounded text-xs text-white/80">
                                        {wonkaBar.ticketCount} tickets
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-text-primary text-sm truncate max-w-[70%]">
                                    {associatedLottery?.collateralNft.name || `Lottery #${wonkaBar.lotteryId}`}
                                </h4>
                                {associatedLottery && (
                                    <span className="text-xs text-text-secondary">
                                        {associatedLottery.soldCount}/{associatedLottery.maxSupply}
                                    </span>
                                )}
                            </div>

                            {/* Compact Stats */}
                            <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 stroke-[1.5]" />
                                    <span>{new Date(wonkaBar.purchasedAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                                        isWinner ? 'bg-surface-elevated text-text-primary' :
                                        associatedLottery?.state === 'CONCLUDED' ? 'bg-surface-elevated text-text-secondary' :
                                        isExpired ? 'bg-surface-elevated text-text-secondary' :
                                        'bg-surface-elevated text-text-secondary'
                                    }`}>
                                        {isWinner ? 'Won' : 
                                         associatedLottery?.state === 'CONCLUDED' ? 'Lost' :
                                         isExpired ? 'Expired' :
                                         associatedLottery?.state === 'ACTIVE' ? 'Active' : 
                                         associatedLottery?.state || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Melt Button or Status */}
                            {associatedLottery && (associatedLottery.state !== 'ACTIVE' || isExpired) ? (
                                <button
                                    onClick={() => handleMeltWonkaBar(wonkaBar.id, associatedLottery.id)}
                                    disabled={isMeltingWonkaBar}
                                    className="w-full btn-primary py-2 text-sm"
                                >
                                    {isMeltingWonkaBar ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Melting...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Gift className="w-3 h-3 stroke-[1.5]" />
                                            <span>
                                                {isWinner ? 'Claim Rewards' : 'Melt for ChocoChips'}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">
                                        {associatedLottery?.state === 'ACTIVE' && !isExpired ? 
                                            'Wait for resolution' : 'Lottery status unknown'}
                                    </span>
                                    <a
                                        href={getExplorerUrl('object', wonkaBar.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-text-muted hover:text-text-secondary transition-colors flex items-center space-x-1"
                                    >
                                        <span>View</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
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
        isLoadingWonkaBars,
        meltWonkaBar,
        isMeltingWonkaBar
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="card-premium p-12 text-center max-w-md">
                    <Wallet className="w-16 h-16 text-text-muted mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Connect Your Wallet</h2>
                    <p className="text-text-secondary mb-8">
                        Connect your Sui wallet to access your profile and manage your lotteries.
                    </p>
                    <p className="text-sm text-text-muted">
                        Make sure you're on Sui Testnet and have some testnet SUI tokens.
                    </p>
                </div>
            </div>
        );
    }

    // Get user's active lotteries
    const userLotteries = lotteries.filter(lottery => lottery.owner === currentAccount.address);
    const activeLotteries = userLotteries.filter(lottery => lottery.state === 'ACTIVE');
    
    // Check for WonkaBars that can be melted (from concluded/cancelled/expired lotteries)
    const meltableWonkaBars = userWonkaBars.filter(wonkaBar => {
        const associatedLottery = lotteries.find(l => l.lotteryId === wonkaBar.lotteryId);
        if (!associatedLottery) return false;
        
        const isExpired = Date.now() > associatedLottery.expirationDate;
        return associatedLottery.state === 'CONCLUDED' || 
               associatedLottery.state === 'CANCELLED' || 
               isExpired;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-20 right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* User Info */}
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary mb-2">Your Profile</h1>
                                <div className="flex items-center space-x-2 text-text-secondary">
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
                                className="btn-primary"
                            >
                                Create Lottery
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Professional Rewards Notification */}
                {meltableWonkaBars.length > 0 && (
                    <div className="mb-8 animate-slide-up">
                        <div className="card-premium p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                        <Gift className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">Rewards Available</h3>
                                        <p className="text-sm text-text-secondary">
                                            {meltableWonkaBars.length} WonkaBar{meltableWonkaBars.length > 1 ? 's' : ''} ready to claim
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-emerald-400">Ready to Claim</div>
                                    <div className="text-xs text-text-muted">Scroll down to claim</div>
                                </div>
                            </div>
                            <div className="bg-surface/50 rounded-lg p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                        <span className="text-text-secondary">Winners: NFT + Chips</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Gift className="w-4 h-4 text-blue-400" />
                                        <span className="text-text-secondary">All: ChocoChips</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        <span className="text-text-secondary">Cancelled: Refunds</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        <span className="text-text-secondary">Expired: Chips</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Portfolio Overview */}
                <div className="mb-12">
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-6">Portfolio Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* SUI Balance */}
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                        <Wallet className="w-4 h-4 text-black" />
                                    </div>
                                    <div className="text-sm font-medium text-text-secondary">SUI Balance</div>
                                </div>
                                <div className="text-xl font-bold text-text-primary mb-1">
                                    {formatSuiAmount(balance?.totalBalance || '0')}
                                </div>
                                <div className="text-xs text-text-muted">
                                    ≈ ${(parseFloat(formatSuiAmount(balance?.totalBalance || '0')) * 0.5).toFixed(2)} USD
                                </div>
                            </div>

                            {/* ChocoChip Balance */}
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm font-medium text-text-secondary">ChocoChips</div>
                                </div>
                                <div className="text-xl font-bold text-amber-400 mb-1">
                                    {formatChocoChips(userStats?.chocoChipBalance || '0')}
                                </div>
                                <div className="text-xs text-text-muted">
                                    Reward tokens earned
                                </div>
                            </div>

                            {/* Active Lotteries */}
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <Trophy className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm font-medium text-text-secondary">My Lotteries</div>
                                </div>
                                <div className="text-xl font-bold text-purple-400 mb-1">
                                    {userStats?.activeLotteries || 0}
                                </div>
                                <div className="text-xs text-text-muted">
                                    Active of {userStats?.totalLotteries || 0} total
                                </div>
                            </div>

                            {/* WonkaBars */}
                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Ticket className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm font-medium text-text-secondary">WonkaBars</div>
                                </div>
                                <div className="text-xl font-bold text-blue-400 mb-1">
                                    {userStats?.totalWonkaBars || 0}
                                </div>
                                <div className="text-xs text-text-muted">
                                    Lottery tickets owned
                                </div>
                            </div>
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
                            meltWonkaBar={meltWonkaBar}
                            isMeltingWonkaBar={isMeltingWonkaBar}
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