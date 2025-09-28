'use client';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    Coins,
    Image as ImageIcon,
    Loader2,
    Plus,
    Sparkles,
    Zap,
    Ticket
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NFT {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    collection?: string;
    type: string;
}

const getSafeImageUrl = (url: string): string => {
    if (!url) return '/placeholder-nft.png';
    if (url.startsWith('/')) return url;
    return url || '/placeholder-nft.png';
};

const detectUserNFTs = async (suiClient: any, ownerAddress: string): Promise<NFT[]> => {
    const nfts: NFT[] = [];

    try {
        const allObjects = await suiClient.getOwnedObjects({
            owner: ownerAddress,
            options: {
                showContent: true,
                showDisplay: true,
                showType: true,
            }
        });

        console.log(`Found ${allObjects.data.length} total objects for address ${ownerAddress}`);

        const potentialNFTs = allObjects.data.filter((obj: { data: { type: string; display: { data: any; }; content: any; }; }) => {
            if (!obj.data) return false;

            const type = obj.data.type;
            if (!type) return false;

            const hasDisplay = obj.data.display?.data;
            const hasContent = obj.data.content;

            const typeIndicatesNFT = (
                type.includes('::nft::') ||
                type.includes('::NFT') ||
                type.includes('display') ||
                type.includes('Display') ||
                (hasDisplay && (hasDisplay.name || hasDisplay.description || hasDisplay.image_url))
            );

            const isNotCoin = !type.includes('::coin::Coin');
            const isNotSystemObject = !type.startsWith('0x2::');

            return typeIndicatesNFT && isNotCoin && isNotSystemObject;
        });

        console.log(`Found ${potentialNFTs.length} potential NFTs after filtering`);

        for (const obj of potentialNFTs) {
            try {
                const display = obj.data.display?.data;
                const content = obj.data.content;

                const name = display?.name || content?.name || `NFT ${obj.data.objectId?.slice(0, 8)}`;
                const description = display?.description || content?.description || 'NFT from your collection';
                const imageUrl = display?.image_url || content?.image_url || display?.url || content?.url || '';

                const collectionType = obj.data.type;
                const collection = collectionType.split('::')[0] + '::' + collectionType.split('::')[1];

                const nft: NFT = {
                    id: obj.data.objectId,
                    name: String(name),
                    description: String(description),
                    imageUrl: getSafeImageUrl(String(imageUrl)),
                    collection: collection,
                    type: obj.data.type
                };

                nfts.push(nft);
            } catch (error) {
                console.warn('Error processing NFT object:', error);
            }
        }

        return nfts;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
};

export default function CreatePage() {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    const { createLottery, isCreatingLottery } = useMeltyFi();

    const [nfts, setNfts] = useState<NFT[]>([]);
    const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
    const [showNFTGrid, setShowNFTGrid] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    
    const [wonkabarPrice, setWonkabarPrice] = useState('');
    const [maxSupply, setMaxSupply] = useState('');
    const [duration, setDuration] = useState('');

    const loadUserNFTs = async () => {
        if (!currentAccount) return;
        
        setIsLoadingNFTs(true);
        try {
            const userNFTs = await detectUserNFTs(suiClient, currentAccount.address);
            setNfts(userNFTs);
        } catch (error) {
            console.error('Failed to load NFTs:', error);
        } finally {
            setIsLoadingNFTs(false);
        }
    };

    useEffect(() => {
        if (currentAccount) {
            loadUserNFTs();
        }
    }, [currentAccount]);

    const handleCreateLottery = async () => {
        if (!selectedNFT || !wonkabarPrice || !maxSupply || !duration) {
            return;
        }

        try {
            const priceInMIST = Math.floor(parseFloat(wonkabarPrice) * 1_000_000_000);

            // FIX: Use parseFloat instead of parseInt to handle decimal days (like 0.00347222 for 5 minutes)
            const durationInMs = Math.floor(parseFloat(duration) * 24 * 60 * 60 * 1000);

            await createLottery({
                nftId: selectedNFT.id,
                wonkaBarPrice: priceInMIST.toString(),
                maxSupply: maxSupply,
                expirationDate: Date.now() + durationInMs
            });

            setSelectedNFT(null);
            setWonkabarPrice('');
            setMaxSupply('');
            setDuration('');
        } catch (error) {
            console.error('Failed to create lottery:', error);
        }
    };

    if (!currentAccount) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-4">Connect Your Wallet</h1>
                    <p className="text-text-secondary mb-8">
                        Connect your Sui wallet to start creating lotteries with your NFTs.
                    </p>
                    <div className="card-premium p-6">
                        <p className="text-text-primary text-sm">
                            Click the Connect Wallet button in the top navigation to get started.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-20 right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 py-16 px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-slide-up">
                        <div className="flex justify-center mb-8 fade-in">
                            <div className="bg-surface-elevated border border-border px-6 py-3 rounded-full">
                                <span className="text-xl font-bold text-gradient">Create Your Lottery</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 slide-up">
                            <span className="text-gradient">Loan</span> Against Your NFT
                        </h1>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                            Get immediate liquidity without selling your valuable NFTs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Configure Lottery Panel */}
                        <div className="space-y-6">
                            <div className="card-premium p-6">
                                <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                    <Coins className="w-6 h-6 text-gradient stroke-[1.5]" />
                                    Configure Lottery
                                </h2>

                                <div className="space-y-6">
                                    {/* WonkaBar Price */}
                                    <div>
                                        <label className="block text-white font-medium mb-2 flex items-center gap-2">
                                            <Coins className="w-4 h-4 stroke-[1.5]" />
                                            Price per WonkaBar (SUI)
                                        </label>
                                        <input
                                            type="number"
                                            value={wonkabarPrice}
                                            onChange={(e) => setWonkabarPrice(e.target.value)}
                                            placeholder="e.g. 0.1"
                                            min="0.000000001"
                                            step="0.01"
                                            className="input w-full"
                                        />
                                        <p className="text-white/60 text-sm mt-2">
                                            Price for each lottery ticket in SUI
                                        </p>
                                    </div>

                                    {/* Max Supply */}
                                    <div>
                                        <label className="block text-white font-medium mb-2 flex items-center gap-2">
                                            <Ticket className="w-4 h-4 stroke-[1.5]" />
                                            Maximum Tickets
                                        </label>
                                        <input
                                            type="number"
                                            value={maxSupply}
                                            onChange={(e) => setMaxSupply(e.target.value)}
                                            placeholder="e.g. 100"
                                            min="1"
                                            step="1"
                                            className="input w-full"
                                        />
                                        <p className="text-white/60 text-sm mt-2">
                                            Total number of tickets available for purchase
                                        </p>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-white font-medium mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 stroke-[1.5]" />
                                            Lottery Duration
                                        </label>
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="input w-full appearance-none cursor-pointer"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.5em 1.5em',
                                                paddingRight: '3rem'
                                            }}
                                        >
                                            <option value="" disabled className="bg-surface-elevated">Select duration</option>
                                            <option value="0.00347222" className="bg-surface-elevated">5 Minutes (Testing)</option>
                                            <option value="1" className="bg-surface-elevated">1 Day</option>
                                            <option value="7" className="bg-surface-elevated">7 Days</option>
                                            <option value="30" className="bg-surface-elevated">30 Days</option>
                                            <option value="90" className="bg-surface-elevated">90 Days</option>
                                        </select>
                                        <p className="text-white/60 text-sm mt-2">
                                            Choose how long the lottery will run
                                        </p>
                                    </div>
                                </div>

                                {/* Lottery Preview */}
                                {wonkabarPrice && maxSupply && (
                                    <div className="mt-6 p-4 rounded-lg bg-surface-elevated border border-border">
                                        <h3 className="text-white font-medium mb-3">Lottery Preview</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-text-secondary">
                                                <span>Total Potential Revenue:</span>
                                                <span className="font-medium">{(parseFloat(wonkabarPrice || '0') * parseInt(maxSupply || '0')).toFixed(2)} SUI</span>
                                            </div>
                                            <div className="flex justify-between text-text-secondary">
                                                <span>You Receive Upfront (95%):</span>
                                                <span className="font-medium text-gradient">
                                                    {(parseFloat(wonkabarPrice || '0') * parseInt(maxSupply || '0') * 0.95).toFixed(2)} SUI
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-text-muted">
                                                <span>Protocol Fee (5%):</span>
                                                <span>{(parseFloat(wonkabarPrice || '0') * parseInt(maxSupply || '0') * 0.05).toFixed(2)} SUI</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Important Notice */}
                                <div className="mt-6 p-4 rounded-lg bg-surface-elevated border border-border">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-gradient flex-shrink-0 mt-0.5 stroke-[1.5]" />
                                        <div>
                                            <h3 className="text-text-primary font-medium mb-2">Important Notice</h3>
                                            <ul className="text-text-secondary text-sm space-y-1">
                                                <li>• You receive 95% of potential funds immediately</li>
                                                <li>• Your NFT is held in escrow until lottery ends</li>
                                                <li>• You can repay to reclaim your NFT anytime</li>
                                                <li>• If not repaid, a winner gets your NFT</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NFT Selection Panel */}
                        <div className="space-y-6">
                            <div className="card-premium p-6">
                                <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                                    <ImageIcon className="w-6 h-6 text-gradient stroke-[1.5]" />
                                    Select Your NFT
                                </h2>

                                {!selectedNFT ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setShowNFTGrid(!showNFTGrid)}
                                            disabled={isLoadingNFTs}
                                            className="w-full p-4 border-2 border-dashed border-white/20 hover:border-border-hover rounded-lg transition-colors group"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                {isLoadingNFTs ? (
                                                    <Loader2 className="w-12 h-12 text-white/40 animate-spin" />
                                                ) : (
                                                    <Plus className="w-12 h-12 text-white/40 group-hover:text-gradient transition-colors stroke-[1.5]" />
                                                )}
                                                <div className="text-center">
                                                    <p className="text-white font-medium mb-1">
                                                        {isLoadingNFTs ? 'Loading your NFTs...' : 'Choose an NFT'}
                                                    </p>
                                                    <p className="text-white/60 text-sm">
                                                        {isLoadingNFTs ? 'Please wait while we scan your wallet' : `Found ${nfts.length} NFTs in your wallet`}
                                                    </p>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform stroke-[1.5] ${showNFTGrid ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        {showNFTGrid && nfts.length > 0 && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                                                {nfts.map((nft) => (
                                                    <button
                                                        key={nft.id}
                                                        onClick={() => {
                                                            setSelectedNFT(nft);
                                                            setShowNFTGrid(false);
                                                        }}
                                                        className="group p-3 rounded-lg border border-border hover:border-border-hover bg-surface hover:bg-surface-elevated transition-all"
                                                    >
                                                        <div className="aspect-square relative mb-2 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={getSafeImageUrl(nft.imageUrl)}
                                                                alt={nft.name}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform"
                                                                unoptimized
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = '/placeholder-nft.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-white text-sm font-medium truncate" title={nft.name}>
                                                                {nft.name}
                                                            </p>
                                                            {nft.collection && (
                                                                <p className="text-text-secondary text-xs truncate" title={nft.collection}>
                                                                    {nft.collection.length > 20 ? `${nft.collection.slice(0, 20)}...` : nft.collection}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {showNFTGrid && nfts.length === 0 && !isLoadingNFTs && (
                                            <div className="text-center py-8">
                                                <ImageIcon className="w-12 h-12 text-white/40 mx-auto mb-3 stroke-[1.5]" />
                                                <p className="text-white/60">No NFTs found in your wallet</p>
                                                <button
                                                    onClick={loadUserNFTs}
                                                    className="text-gradient hover:text-text-primary text-sm mt-2"
                                                >
                                                    Refresh
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg border border-border bg-surface">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={getSafeImageUrl(selectedNFT.imageUrl)}
                                                    alt={selectedNFT.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder-nft.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white">{selectedNFT.name}</h3>
                                                {selectedNFT.collection && (
                                                    <p className="text-sm text-text-secondary truncate max-w-[200px]">
                                                        {selectedNFT.collection.length > 20 ? `${selectedNFT.collection.slice(0, 20)}...` : selectedNFT.collection}
                                                    </p>
                                                )}
                                                <p className="text-xs text-text-muted mt-1 font-mono truncate max-w-[200px]">{selectedNFT.id.slice(0, 8)}...</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedNFT(null)}
                                                className="text-text-muted hover:text-text-primary transition-colors"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Create Button */}
                                <button
                                    onClick={handleCreateLottery}
                                    disabled={!selectedNFT || !wonkabarPrice || !maxSupply || !duration || isCreatingLottery}
                                    className="w-full mt-8 btn-primary py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    {isCreatingLottery ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Lottery...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 stroke-[1.5]" />
                                            Create Lottery
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}