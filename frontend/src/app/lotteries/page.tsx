'use client';

import { getExplorerUrl } from '@/constants/contracts';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
    AlertCircle,
    ExternalLink,
    Search,
    Ticket
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface LotteryCardProps {
    lottery: any;
    onBuyWonkaBars: (lotteryId: string, quantity: number, totalCost: string) => void;
    isBuying: boolean;
    isConnected: boolean;
}

function LotteryCard({ lottery, onBuyWonkaBars, isBuying, isConnected }: LotteryCardProps) {
    const [quantity, setQuantity] = useState(1);

    const wonkaBarPrice = parseInt(lottery.wonkaBarPrice);
    const totalCost = (wonkaBarPrice * quantity).toString();
    const formatSuiAmount = (amount: string | number) => (Number(amount) / 1_000_000_000).toFixed(4);

    const isExpired = Date.now() > lottery.expirationDate;
    const isSoldOut = parseInt(lottery.soldCount) >= parseInt(lottery.maxSupply);
    const canPurchase = isConnected && !isExpired && !isSoldOut && lottery.state === 'ACTIVE';

    const timeLeft = lottery.expirationDate - Date.now();
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-all duration-300">
            {/* NFT Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                {lottery.collateralNft.imageUrl !== '/placeholder-nft.svg' ? (
                    <Image
                        src={lottery.collateralNft.imageUrl}
                        alt={lottery.collateralNft.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Ticket className="w-8 h-8 text-white" />
                        </div>
                    </div>
                )}

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
                        <p className="text-sm font-medium text-white">{formatSuiAmount(wonkaBarPrice)} SUI</p>
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

                {/* Purchase Section */}
                {canPurchase ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label htmlFor={`quantity-${lottery.id}`} className="text-sm text-white/80">
                                Quantity:
                            </label>
                            <input
                                id={`quantity-${lottery.id}`}
                                type="number"
                                min="1"
                                max={parseInt(lottery.maxSupply) - parseInt(lottery.soldCount)}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                            />
                        </div>

                        <div className="text-sm text-white/60">
                            Total: {formatSuiAmount(totalCost)} SUI
                        </div>

                        <button
                            onClick={() => onBuyWonkaBars(lottery.id, quantity, totalCost)}
                            disabled={isBuying}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {isBuying ? 'Purchasing...' : `Buy ${quantity} WonkaBar${quantity > 1 ? 's' : ''}`}
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-3">
                        {!isConnected ? (
                            <p className="text-sm text-white/60">Connect wallet to participate</p>
                        ) : isExpired ? (
                            <p className="text-sm text-red-400">Lottery has expired</p>
                        ) : isSoldOut ? (
                            <p className="text-sm text-yellow-400">All WonkaBars sold</p>
                        ) : (
                            <p className="text-sm text-white/60">Lottery not active</p>
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
}

export default function LotteriesPage() {
    const currentAccount = useCurrentAccount();
    const {
        lotteries,
        buyWonkaBars,
        isBuyingWonkaBars,
        isLoadingLotteries
    } = useMeltyFi();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterState, setFilterState] = useState<'all' | 'active' | 'ending-soon'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'ending-soon' | 'price-low' | 'price-high'>('newest');

    const handleBuyWonkaBars = async (lotteryId: string, quantity: number, totalCost: string) => {
        try {
            // Convert from MIST to SUI for display
            const paymentAmountSui = (parseInt(totalCost) / 1_000_000_000).toString();
            console.log('🎫 Purchasing WonkaBars:', { lotteryId, quantity, totalCost, paymentAmountSui });
            
            await buyWonkaBars({ 
                lotteryId, 
                quantity, 
                paymentAmount: paymentAmountSui 
            });
        } catch (error) {
            console.error('Failed to buy WonkaBars:', error);
        }
    };

    // Filter and sort lotteries
    const filteredLotteries = lotteries
        .filter(lottery => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    lottery.collateralNft.name.toLowerCase().includes(query) ||
                    lottery.collateralNft.collection?.toLowerCase().includes(query) ||
                    lottery.lotteryId.includes(query)
                );
            }
            return true;
        })
        .filter(lottery => {
            // State filter
            if (filterState === 'active') {
                return lottery.state === 'ACTIVE' && Date.now() < lottery.expirationDate;
            }
            if (filterState === 'ending-soon') {
                const timeLeft = lottery.expirationDate - Date.now();
                return lottery.state === 'ACTIVE' && timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
            }
            return true;
        })
        .sort((a, b) => {
            // Sort logic
            switch (sortBy) {
                case 'newest':
                    return parseInt(b.lotteryId) - parseInt(a.lotteryId);
                case 'ending-soon':
                    return a.expirationDate - b.expirationDate;
                case 'price-low':
                    return parseInt(a.wonkaBarPrice) - parseInt(b.wonkaBarPrice);
                case 'price-high':
                    return parseInt(b.wonkaBarPrice) - parseInt(a.wonkaBarPrice);
                default:
                    return 0;
            }
        });

    const activeLotteriesCount = lotteries.filter(l => l.state === 'ACTIVE' && Date.now() < l.expirationDate).length;
    const endingSoonCount = lotteries.filter(l => {
        const timeLeft = l.expirationDate - Date.now();
        return l.state === 'ACTIVE' && timeLeft < 24 * 60 * 60 * 1000;
    }).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Active Lotteries</h1>
                    <p className="text-white/60 text-lg">
                        Discover amazing NFTs, purchase WonkaBars, and win big while earning ChocoChips!
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{lotteries.length}</div>
                        <div className="text-white/60">Total Lotteries</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{activeLotteriesCount}</div>
                        <div className="text-white/60">Active Now</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">{endingSoonCount}</div>
                        <div className="text-white/60">Ending Soon</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search lotteries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <select
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value as any)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="all">All Lotteries</option>
                            <option value="active">Active Only</option>
                            <option value="ending-soon">Ending Soon</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="ending-soon">Ending Soon</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoadingLotteries && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="text-white/60 mt-4">Loading lotteries...</p>
                    </div>
                )}

                {/* No Results */}
                {!isLoadingLotteries && filteredLotteries.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {searchQuery || filterState !== 'all' ? 'No lotteries match your criteria' : 'No lotteries available'}
                        </h3>
                        <p className="text-white/60">
                            {searchQuery || filterState !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Check back later for new lotteries, or create your own!'
                            }
                        </p>
                    </div>
                )}

                {/* Lotteries Grid */}
                {!isLoadingLotteries && filteredLotteries.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLotteries.map((lottery) => (
                            <LotteryCard
                                key={lottery.id}
                                lottery={lottery}
                                onBuyWonkaBars={handleBuyWonkaBars}
                                isBuying={isBuyingWonkaBars}
                                isConnected={!!currentAccount}
                            />
                        ))}
                    </div>
                )}

                {/* Connection Warning */}
                {!currentAccount && !isLoadingLotteries && (
                    <div className="mt-8 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <div>
                                <h3 className="font-medium text-yellow-200">Connect Your Wallet</h3>
                                <p className="text-sm text-yellow-200/70">
                                    Connect your Sui wallet to participate in lotteries and purchase WonkaBars.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
