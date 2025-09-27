'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import * as Tabs from '@radix-ui/react-tabs'
import {
    Check,
    ChevronDown,
    Clock,
    Coins,
    ExternalLink,
    Image as ImageIcon,
    Plus,
    Search,
    Sparkles,
    TrendingUp,
    Trophy,
    X,
    Zap
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

// Mock data for lotteries
const mockLotteries = [
    {
        id: 1,
        title: "Rare CryptoPunk #1234",
        collection: "CryptoPunks",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
        tokenId: "1234",
        creator: "0x742d...3892",
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        wonkaBarPrice: 0.1,
        wonkaBarsSold: 45,
        wonkaBarsMaxSupply: 100,
        totalRaised: 4.5,
        status: "active"
    },
    {
        id: 2,
        title: "Cool Ape #5678",
        collection: "Bored Ape Yacht Club",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
        tokenId: "5678",
        creator: "0x891a...7362",
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        wonkaBarPrice: 0.05,
        wonkaBarsSold: 87,
        wonkaBarsMaxSupply: 150,
        totalRaised: 4.35,
        status: "active"
    },
    {
        id: 3,
        title: "Abstract Art #999",
        collection: "Art Blocks",
        image: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400",
        tokenId: "999",
        creator: "0x234b...1098",
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        wonkaBarPrice: 0.02,
        wonkaBarsSold: 23,
        wonkaBarsMaxSupply: 80,
        totalRaised: 0.46,
        status: "active"
    }
]

// Mock data for user's NFTs
const mockUserNFTs = [
    {
        id: 1,
        title: "My Digital Dragon #777",
        collection: "Digital Dragons",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        tokenId: "777",
        contractAddress: "0x123...456"
    },
    {
        id: 2,
        title: "Space Explorer #1122",
        collection: "Space Explorers",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
        tokenId: "1122",
        contractAddress: "0x789...012"
    }
]

interface LotteryCardProps {
    lottery: typeof mockLotteries[0]
}

function LotteryCard({ lottery }: LotteryCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const progressPercentage = (lottery.wonkaBarsSold / lottery.wonkaBarsMaxSupply) * 100
    const timeLeft = lottery.expirationDate.getTime() - Date.now()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

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
                        <div className="absolute top-4 right-4">
                            <div className="bg-black/50 text-white px-2.5 py-0.5 text-xs font-semibold rounded-md flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {daysLeft}d left
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

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Progress</span>
                                <span className="text-white font-medium">
                                    {lottery.wonkaBarsSold}/{lottery.wonkaBarsMaxSupply} WonkaBars
                                </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-white/60">WonkaBar Price</p>
                                <p className="text-white font-semibold">{lottery.wonkaBarPrice} SUI</p>
                            </div>
                            <div>
                                <p className="text-white/60">Total Raised</p>
                                <p className="text-white font-semibold">{lottery.totalRaised} SUI</p>
                            </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                            >
                                <Coins className="w-4 h-4 mr-2" />
                                Buy WonkaBars
                            </button>
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
                        <BuyWonkaBarModal lottery={lottery} onClose={() => setIsDialogOpen(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

interface BuyWonkaBarModalProps {
    lottery: typeof mockLotteries[0]
    onClose: () => void
}

function BuyWonkaBarModal({ lottery, onClose }: BuyWonkaBarModalProps) {
    const [quantity, setQuantity] = useState(1)
    const maxQuantity = lottery.wonkaBarsMaxSupply - lottery.wonkaBarsSold
    const totalCost = quantity * lottery.wonkaBarPrice

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

            <Dialog.Title className="text-lg font-semibold text-white mb-2">Buy WonkaBars</Dialog.Title>
            <Dialog.Description className="text-white/60 mb-6">
                Purchase WonkaBars for {lottery.title} and join the lottery!
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

                <div className="space-y-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-white mb-1">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={maxQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <p className="text-xs text-white/60 mt-1">
                            Max available: {maxQuantity} WonkaBars
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-white/60">Price per WonkaBar</span>
                            <span className="text-white">{lottery.wonkaBarPrice} SUI</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Quantity</span>
                            <span className="text-white">{quantity}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                            <span className="text-white">Total Cost</span>
                            <span className="text-white">{totalCost.toFixed(3)} SUI</span>
                        </div>
                    </div>

                    <div className="text-sm text-white/60 space-y-1">
                        <p>• You'll have a {((quantity / lottery.wonkaBarsMaxSupply) * 100).toFixed(2)}% chance to win</p>
                        <p>• All participants receive ChocoChip rewards</p>
                        <p>• If lottery is cancelled, you get a full refund + ChocoChips</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={quantity < 1 || quantity > maxQuantity}
                >
                    <Coins className="w-4 h-4 mr-2" />
                    Buy {quantity} WonkaBar{quantity > 1 ? 's' : ''} for {totalCost.toFixed(3)} SUI
                </button>
            </div>
        </>
    )
}

interface NFTCardProps {
    nft: typeof mockUserNFTs[0]
}

function NFTCard({ nft }: NFTCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg">
                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={nft.image}
                        alt={nft.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                {nft.title}
                            </h3>
                            <p className="text-sm text-white/60">{nft.collection} #{nft.tokenId}</p>
                        </div>

                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Lottery
                        </button>
                    </div>
                </div>
            </div>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-gray-900 border border-white/10 rounded-lg p-6 w-full max-w-lg">
                        <CreateLotteryModal nft={nft} onClose={() => setIsDialogOpen(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

interface CreateLotteryModalProps {
    nft: typeof mockUserNFTs[0]
    onClose: () => void
}

function CreateLotteryModal({ nft, onClose }: CreateLotteryModalProps) {
    const [wonkaBarPrice, setWonkaBarPrice] = useState("0.1")
    const [maxSupply, setMaxSupply] = useState("100")
    const [duration, setDuration] = useState("7")

    const totalRevenue = parseFloat(wonkaBarPrice) * parseInt(maxSupply) || 0
    const userReceives = totalRevenue * 0.95 // 95% to user, 5% protocol fee

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

            <Dialog.Title className="text-lg font-semibold text-white mb-2">Create Lottery</Dialog.Title>
            <Dialog.Description className="text-white/60 mb-6">
                Create a lottery with your NFT and set the parameters.
            </Dialog.Description>

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image src={nft.image} alt={nft.title} fill className="object-cover" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">{nft.title}</h4>
                        <p className="text-sm text-white/60">{nft.collection} #{nft.tokenId}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="wonkabar-price" className="block text-sm font-medium text-white mb-1">WonkaBar Price (SUI)</label>
                        <input
                            id="wonkabar-price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={wonkaBarPrice}
                            onChange={(e) => setWonkaBarPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="max-supply" className="block text-sm font-medium text-white mb-1">Max WonkaBars</label>
                        <input
                            id="max-supply"
                            type="number"
                            min="5"
                            max="1000"
                            value={maxSupply}
                            onChange={(e) => setMaxSupply(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">Duration (days)</label>
                    <Select.Root value={duration} onValueChange={setDuration}>
                        <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500">
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDown className="h-4 w-4" />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content className="bg-gray-900 border border-white/10 rounded-md shadow-lg z-50">
                                <Select.Viewport className="p-1">
                                    <Select.Item value="1" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                        <Select.ItemText>1 day</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="3" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                        <Select.ItemText>3 days</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="7" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                        <Select.ItemText>7 days</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="14" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                        <Select.ItemText>14 days</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="30" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                        <Select.ItemText>30 days</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>

                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-white/60">Total Possible Revenue</span>
                        <span className="text-white">{totalRevenue.toFixed(3)} SUI</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/60">Protocol Fee (5%)</span>
                        <span className="text-white">{(totalRevenue * 0.05).toFixed(3)} SUI</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                        <span className="text-white">You Receive (95%)</span>
                        <span className="text-white">{userReceives.toFixed(3)} SUI</span>
                    </div>
                </div>

                <div className="text-sm text-white/60 space-y-1">
                    <p>• You'll receive funds immediately as WonkaBars are sold</p>
                    <p>• Repay before expiration to get your NFT back + ChocoChips</p>
                    <p>• If not repaid, a random WonkaBar holder wins your NFT</p>
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Lottery
                </button>
            </div>
        </>
    )
}

export default function LotteriesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("ending-soon")
    const [filterBy, setFilterBy] = useState("all")
    const [lotteries, setLotteries] = useState(mockLotteries)

    useEffect(() => {
        // Filter and sort lotteries based on user selections
        let filtered = mockLotteries.filter(lottery =>
            lottery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lottery.collection.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (filterBy !== "all") {
            filtered = filtered.filter(lottery => lottery.status === filterBy)
        }

        // Sort lotteries
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "ending-soon":
                    return a.expirationDate.getTime() - b.expirationDate.getTime()
                case "most-funded":
                    return b.totalRaised - a.totalRaised
                case "highest-prize":
                    return b.wonkaBarPrice - a.wonkaBarPrice
                default:
                    return 0
            }
        })

        setLotteries(filtered)
    }, [searchTerm, sortBy, filterBy])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        NFT Lotteries
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        Discover exciting NFT lotteries or create your own. Turn your illiquid assets into instant liquidity!
                    </p>
                </div>

                <Tabs.Root defaultValue="browse" className="space-y-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <Tabs.List className="inline-flex h-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 p-1 text-muted-foreground">
                            <Tabs.Trigger
                                value="browse"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                            >
                                <Trophy className="w-4 h-4 mr-2" />
                                Browse Lotteries
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="create"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Lottery
                            </Tabs.Trigger>
                        </Tabs.List>

                        {/* Stats */}
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-white/60">Active Lotteries:</span>
                                <span className="text-white font-semibold">47</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <span className="text-white/60">Total Volume:</span>
                                <span className="text-white font-semibold">2.4M SUI</span>
                            </div>
                        </div>
                    </div>

                    <Tabs.Content value="browse" className="space-y-6">
                        {/* Search and Filters */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                                <input
                                    placeholder="Search lotteries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/60 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <Select.Root value={sortBy} onValueChange={setSortBy}>
                                <Select.Trigger className="w-48 flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500">
                                    <Select.Value />
                                    <Select.Icon>
                                        <ChevronDown className="h-4 w-4" />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content className="bg-gray-900 border border-white/10 rounded-md shadow-lg z-50">
                                        <Select.Viewport className="p-1">
                                            <Select.Item value="ending-soon" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                                <Select.ItemText>Ending Soon</Select.ItemText>
                                                <Select.ItemIndicator className="ml-auto">
                                                    <Check className="h-4 w-4" />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                            <Select.Item value="most-funded" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                                <Select.ItemText>Most Funded</Select.ItemText>
                                                <Select.ItemIndicator className="ml-auto">
                                                    <Check className="h-4 w-4" />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                            <Select.Item value="highest-prize" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded cursor-pointer">
                                                <Select.ItemText>Highest Prize</Select.ItemText>
                                                <Select.ItemIndicator className="ml-auto">
                                                    <Check className="h-4 w-4" />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>

                        {/* Lottery Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {lotteries.map((lottery) => (
                                <LotteryCard key={lottery.id} lottery={lottery} />
                            ))}
                        </div>

                        {lotteries.length === 0 && (
                            <div className="text-center py-12">
                                <Trophy className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No lotteries found</h3>
                                <p className="text-white/60">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="create" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Create a New Lottery</h2>
                            <p className="text-white/60">
                                Select one of your NFTs below to create a lottery and unlock instant liquidity
                            </p>
                        </div>

                        {/* User's NFTs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mockUserNFTs.map((nft) => (
                                <NFTCard key={nft.id} nft={nft} />
                            ))}
                        </div>

                        {mockUserNFTs.length === 0 && (
                            <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-12 text-center">
                                <ImageIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No NFTs found</h3>
                                <p className="text-white/60 mb-6">
                                    Connect your Sui wallet to see your NFTs and create lotteries
                                </p>
                                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center mx-auto">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Connect Wallet
                                </button>
                            </div>
                        )}
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    )
}