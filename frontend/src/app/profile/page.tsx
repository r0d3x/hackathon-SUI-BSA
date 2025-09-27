'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import {
    CheckCircle,
    Clock,
    Coins,
    Copy,
    ExternalLink,
    Gift,
    History,
    Plus,
    RefreshCw,
    Target,
    TrendingUp,
    Trophy,
    User,
    Wallet,
    X,
    Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock user data
const mockUser = {
    address: "0x742d35cc123f2a8a9f7f3892ec42b3d4f5e6a7b8",
    suiAddress: "0x742d35cc123f2a8a9f7f3892ec42b3d4f5e6a7b8c9d0e1f2",
    chocoChipBalance: 1247.56,
    totalEarned: 89.34,
    totalBorrowed: 156.78,
    successfulRepayments: 12,
    lotteryWins: 3,
    joinedDate: "2024-01-15"
}

// Mock owned lotteries (created by user)
const mockOwnedLotteries = [
    {
        id: 1,
        title: "My Cool Ape #1234",
        collection: "Bored Ape Yacht Club",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
        tokenId: "1234",
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        wonkaBarPrice: 0.1,
        wonkaBarsSold: 67,
        wonkaBarsMaxSupply: 100,
        totalRaised: 6.7,
        amountToRepay: 7.05, // includes interest
        status: "active"
    },
    {
        id: 2,
        title: "Digital Dragon #777",
        collection: "Digital Dragons",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        tokenId: "777",
        expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // expired
        wonkaBarPrice: 0.05,
        wonkaBarsSold: 80,
        wonkaBarsMaxSupply: 80,
        totalRaised: 4.0,
        winner: "0x891a7362bc45d8f9e0a1b2c3d4e5f6g7h8i9j0k1",
        status: "concluded"
    }
]

// Mock participated lotteries (user bought WonkaBars)
const mockParticipatedLotteries = [
    {
        id: 3,
        title: "Rare CryptoPunk #5678",
        collection: "CryptoPunks",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
        tokenId: "5678",
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        wonkaBarPrice: 0.2,
        wonkaBarsSold: 45,
        wonkaBarsMaxSupply: 100,
        wonkaBarsOwned: 8,
        winProbability: 8,
        status: "active"
    },
    {
        id: 4,
        title: "Space Explorer #9999",
        collection: "Space Explorers",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
        tokenId: "9999",
        expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        wonkaBarPrice: 0.15,
        wonkaBarsSold: 60,
        wonkaBarsMaxSupply: 60,
        wonkaBarsOwned: 5,
        winner: "0x742d35cc123f2a8a9f7f3892ec42b3d4f5e6a7b8", // user won!
        status: "won"
    }
]

interface OwnedLotteryCardProps {
    lottery: typeof mockOwnedLotteries[0]
}

function OwnedLotteryCard({ lottery }: OwnedLotteryCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const progressPercentage = (lottery.wonkaBarsSold / lottery.wonkaBarsMaxSupply) * 100
    const timeLeft = lottery.expirationDate.getTime() - Date.now()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
    const isActive = lottery.status === "active"
    const isExpired = timeLeft < 0

    const getStatusBadge = () => {
        if (lottery.status === "active") {
            return <div className="bg-green-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">Active</div>
        } else if (lottery.status === "concluded") {
            return <div className="bg-red-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">Concluded</div>
        }
        return <div className="bg-gray-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">Unknown</div>
    }

    return (
        <>
            <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg">
                <div className="relative">
                    <div className="aspect-square relative overflow-hidden">
                        <Image
                            src={lottery.image}
                            alt={lottery.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                            {getStatusBadge()}
                        </div>
                        {isActive && (
                            <div className="absolute top-4 right-4">
                                <div className="bg-black/50 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                {lottery.title}
                            </h3>
                            <p className="text-sm text-white/60">{lottery.collection} #{lottery.tokenId}</p>
                        </div>

                        {isActive && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Progress</span>
                                    <span className="text-white font-medium">
                                        {lottery.wonkaBarsSold}/{lottery.wonkaBarsMaxSupply} sold
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-white/60">Total Raised</p>
                                <p className="text-white font-semibold">{lottery.totalRaised} SUI</p>
                            </div>
                            <div>
                                <p className="text-white/60">
                                    {isActive ? "To Repay" : lottery.status === "concluded" ? "Winner" : "Status"}
                                </p>
                                {isActive ? (
                                    <p className="text-white font-semibold">{lottery.amountToRepay} SUI</p>
                                ) : lottery.status === "concluded" ? (
                                    <p className="text-white font-semibold text-xs">
                                        {lottery.winner?.slice(0, 6)}...{lottery.winner?.slice(-4)}
                                    </p>
                                ) : (
                                    <p className="text-white font-semibold">-</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                            {isActive && !isExpired && (
                                <button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Repay Loan
                                </button>
                            )}
                            <button className="border border-white/20 text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-gray-900 border border-white/10 rounded-lg p-6 w-full max-w-lg">
                        <RepayLoanModal lottery={lottery} onClose={() => setIsDialogOpen(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

interface RepayLoanModalProps {
    lottery: typeof mockOwnedLotteries[0]
    onClose: () => void
}

function RepayLoanModal({ lottery, onClose }: RepayLoanModalProps) {
    return (
        <>
            <Dialog.Close asChild>
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                    onClick={onClose}
                >
                    <X className="h-4 w-4 text-white" />
                </button>
            </Dialog.Close>

            <Dialog.Title className="text-lg font-semibold text-white mb-2">Repay Loan</Dialog.Title>
            <Dialog.Description className="text-white/60 mb-6">
                Repay your loan to get your NFT back and earn ChocoChips!
            </Dialog.Description>

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image src={lottery.image} alt={lottery.title} fill className="object-cover" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">{lottery.title}</h4>
                        <p className="text-sm text-white/60">{lottery.collection} #{lottery.tokenId}</p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-white/60">Principal Amount</span>
                        <span className="text-white">{lottery.totalRaised} SUI</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/60">Interest & Fees</span>
                        <span className="text-white">{(lottery.amountToRepay! - lottery.totalRaised).toFixed(3)} SUI</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                        <span className="text-white">Total to Repay</span>
                        <span className="text-white">{lottery.amountToRepay} SUI</span>
                    </div>
                </div>

                <div className="text-sm text-white/60 space-y-1">
                    <p>• Your NFT will be returned immediately</p>
                    <p>• All WonkaBar holders will be refunded</p>
                    <p>• Everyone (including you) receives ChocoChip rewards</p>
                    <p>• This creates a win-win situation for all participants</p>
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Repay {lottery.amountToRepay} SUI
                </button>
            </div>
        </>
    )
}

interface ParticipatedLotteryCardProps {
    lottery: typeof mockParticipatedLotteries[0]
}

function ParticipatedLotteryCard({ lottery }: ParticipatedLotteryCardProps) {
    const timeLeft = lottery.expirationDate.getTime() - Date.now()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

    const getStatusInfo = () => {
        if (lottery.status === "active") {
            return {
                badge: <div className="bg-blue-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">Active</div>,
                timeInfo: `${daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}`,
                action: "melt-available"
            }
        } else if (lottery.status === "won") {
            return {
                badge: <div className="bg-amber-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">🏆 Won!</div>,
                timeInfo: "Concluded",
                action: "claim-prize"
            }
        } else {
            return {
                badge: <div className="bg-gray-500 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md">Concluded</div>,
                timeInfo: "Concluded",
                action: "claim-choco"
            }
        }
    }

    const statusInfo = getStatusInfo()

    return (
        <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg">
            <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={lottery.image}
                        alt={lottery.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                        {statusInfo.badge}
                    </div>
                    <div className="absolute top-4 right-4">
                        <div className="bg-black/50 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {statusInfo.timeInfo}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {lottery.title}
                        </h3>
                        <p className="text-sm text-white/60">{lottery.collection} #{lottery.tokenId}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-white/60">WonkaBars Owned</p>
                            <p className="text-white font-semibold">{lottery.wonkaBarsOwned}</p>
                        </div>
                        <div>
                            <p className="text-white/60">
                                {lottery.status === "active" ? "Win Chance" : "Result"}
                            </p>
                            {lottery.status === "active" ? (
                                <p className="text-white font-semibold">{lottery.winProbability}%</p>
                            ) : lottery.status === "won" ? (
                                <p className="text-amber-400 font-semibold">Won! 🎉</p>
                            ) : (
                                <p className="text-white/60 font-semibold">ChocoChips</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                        {statusInfo.action === "claim-prize" && (
                            <button className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center">
                                <Trophy className="w-4 h-4 mr-2" />
                                Claim Prize
                            </button>
                        )}
                        {statusInfo.action === "claim-choco" && (
                            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center">
                                <Gift className="w-4 h-4 mr-2" />
                                Claim ChocoChips
                            </button>
                        )}
                        {statusInfo.action === "melt-available" && (
                            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center">
                                <Coins className="w-4 h-4 mr-2" />
                                Melt WonkaBars
                            </button>
                        )}
                        <button className="border border-white/20 text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const [isConnected, setIsConnected] = useState(true) // Mock wallet connection
    const [copiedAddress, setCopiedAddress] = useState(false)

    const copyAddress = async () => {
        await navigator.clipboard.writeText(mockUser.suiAddress)
        setCopiedAddress(true)
        setTimeout(() => setCopiedAddress(false), 2000)
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center max-w-md">
                    <Wallet className="w-16 h-16 text-white/40 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-white/60 mb-8">
                        Connect your Sui wallet to access your profile and manage your lotteries.
                    </p>
                    <button
                        onClick={() => setIsConnected(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center mx-auto"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Connect Sui Wallet
                    </button>
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
                                        {mockUser.suiAddress.slice(0, 8)}...{mockUser.suiAddress.slice(-6)}
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
                                </div>
                                <p className="text-white/60 text-sm">
                                    Member since {new Date(mockUser.joinedDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* ChocoChip Balance */}
                        <div className="rounded-lg border border-white/10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm p-6 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Coins className="w-6 h-6 text-amber-400 mr-2" />
                                <span className="text-2xl font-bold text-white">
                                    {mockUser.chocoChipBalance.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-amber-200 font-semibold">CHOC Balance</p>
                            <p className="text-xs text-white/60 mt-1">Protocol rewards token</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {mockUser.totalEarned} SUI
                        </div>
                        <p className="text-white/60 text-sm">Total Earned</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <Coins className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {mockUser.totalBorrowed} SUI
                        </div>
                        <p className="text-white/60 text-sm">Total Borrowed</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {mockUser.successfulRepayments}
                        </div>
                        <p className="text-white/60 text-sm">Successful Repayments</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                        <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {mockUser.lotteryWins}
                        </div>
                        <p className="text-white/60 text-sm">Lottery Wins</p>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs.Root defaultValue="owned" className="space-y-8">
                    <Tabs.List className="inline-flex h-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 p-1 text-muted-foreground">
                        <Tabs.Trigger
                            value="owned"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Your Lotteries ({mockOwnedLotteries.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="participated"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <Target className="w-4 h-4 mr-2" />
                            Your WonkaBars ({mockParticipatedLotteries.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="history"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <History className="w-4 h-4 mr-2" />
                            Transaction History
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="owned" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Your Active Lotteries</h2>
                            <p className="text-white/60">
                                Manage your NFT lotteries and repay loans to get your assets back
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockOwnedLotteries.map((lottery) => (
                                <OwnedLotteryCard key={lottery.id} lottery={lottery} />
                            ))}
                        </div>

                        {mockOwnedLotteries.length === 0 && (
                            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                                <Trophy className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No lotteries yet</h3>
                                <p className="text-white/60 mb-6">
                                    Create your first lottery to unlock liquidity from your NFTs
                                </p>
                                <Link href="/lotteries">
                                    <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center mx-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Lottery
                                    </button>
                                </Link>
                            </div>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="participated" className="space-y-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Your WonkaBar Holdings</h2>
                            <p className="text-white/60">
                                Track your lottery participations and claim your rewards
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockParticipatedLotteries.map((lottery) => (
                                <ParticipatedLotteryCard key={lottery.id} lottery={lottery} />
                            ))}
                        </div>

                        {mockParticipatedLotteries.length === 0 && (
                            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                                <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No WonkaBars yet</h3>
                                <p className="text-white/60 mb-6">
                                    Start participating in lotteries to see your WonkaBars here
                                </p>
                                <Link href="/lotteries">
                                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center mx-auto">
                                        <Trophy className="w-4 h-4 mr-2" />
                                        Browse Lotteries
                                    </button>
                                </Link>
                            </div>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="history" className="space-y-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Transaction History</h2>
                            <p className="text-white/60">
                                View all your MeltyFi transactions and activities
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                            <History className="w-12 h-12 text-white/40 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Transaction history coming soon</h3>
                            <p className="text-white/60">
                                We're working on bringing you detailed transaction history and analytics
                            </p>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    )
}