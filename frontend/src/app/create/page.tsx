'use client';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import {
    Coins,
    Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NFT {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    collection?: string;
    type: string; // This will now store the collection address
}

/**
 * Validates and normalizes image URLs for Next.js Image component
 * For NFTs, we'll be more permissive and use unoptimized loading
 */
const getSafeImageUrl = (url: string): string => {
    if (!url) return '/placeholder-nft.png';

    // If it's already a local path, return as is
    if (url.startsWith('/')) return url;

    // For external URLs, return them as-is but we'll use unoptimized loading
    return url || '/placeholder-nft.png';
};

/**
 * Generic NFT Detection Utility
 * This function attempts to find NFTs using multiple strategies without hardcoding contract addresses
 */
const detectUserNFTs = async (suiClient: any, ownerAddress: string): Promise<NFT[]> => {
    const nfts: NFT[] = [];

    try {
        // Strategy 1: Get all owned objects and filter for NFT-like objects
        const allObjects = await suiClient.getOwnedObjects({
            owner: ownerAddress,
            options: {
                showContent: true,
                showDisplay: true,
                showType: true,
            }
        });

        console.log(`Found ${allObjects.data.length} total objects for address ${ownerAddress}`);

        // Strategy 2: Filter objects that look like NFTs based on multiple criteria
        const potentialNFTs = allObjects.data.filter((obj: { data: { type: string; display: { data: any; }; content: any; }; }) => {
            if (!obj.data) return false;

            const type = obj.data.type || '';
            const display = obj.data.display?.data;
            const content = obj.data.content;

            // Check if object has NFT-like characteristics:
            const hasNFTType = type.toLowerCase().includes('nft') ||
                type.includes('::nft::') ||
                type.includes('::NFT') ||
                type.includes('::collectible::') ||
                type.includes('::token::');

            const hasDisplayData = display && (
                display.name ||
                display.image_url ||
                display.url ||
                display.description
            );

            const hasNFTFields = content?.dataType === 'moveObject' && content.fields && (
                content.fields.name ||
                content.fields.image_url ||
                content.fields.url ||
                content.fields.metadata
            );

            // Object is likely an NFT if it has any of these characteristics
            return hasNFTType || hasDisplayData || hasNFTFields;
        });

        console.log(`Filtered to ${potentialNFTs.length} potential NFTs`);

        // Strategy 3: Parse the potential NFTs into our standard format
        for (const obj of potentialNFTs) {
            try {
                const type = obj.data?.type || '';
                const display = obj.data?.display?.data || {};
                const content = obj.data?.content as any;
                const fields = content?.fields || {};

                // Extract name from various possible sources
                const name = display.name ||
                    fields.name ||
                    fields.title ||
                    display.title ||
                    `NFT ${obj.data?.objectId?.slice(-8)}` ||
                    'Unnamed NFT';

                // Extract image URL from various possible sources
                const imageUrl = display.image_url ||
                    display.url ||
                    fields.image_url ||
                    fields.url ||
                    fields.image ||
                    display.image ||
                    '/placeholder-nft.png';

                // Extract description
                const description = display.description ||
                    fields.description ||
                    display.subtitle ||
                    fields.subtitle ||
                    '';

                // Extract collection info
                const collection = display.collection_name ||
                    display.collection ||
                    fields.collection_name ||
                    fields.collection ||
                    display.project_name ||
                    fields.project_name;

                // Extract collection address from the type
                const collectionAddress = type ? type.split('::')[0] : '';

                const nft: NFT = {
                    id: obj.data?.objectId || '',
                    name: name,
                    description: description,
                    imageUrl: getSafeImageUrl(imageUrl), // Use safe URL function
                    collection: collection,
                    type: collectionAddress, // Store collection address instead of full type
                };

                // Only add if we have a valid ID and name
                if (nft.id && nft.name !== 'Unnamed NFT') {
                    nfts.push(nft);
                }
            } catch (parseError) {
                console.warn('Failed to parse potential NFT:', parseError);
            }
        }

        // Strategy 4: Try specific common NFT patterns if we found few results
        if (nfts.length < 5) {
            console.log('Found few NFTs, trying specific patterns...');

            const commonNFTPatterns = [
                '::nft::NFT',
                '::collectible::Collectible',
                '::token::Token',
                '::art::Art',
                '::gaming::Item'
            ];

            for (const pattern of commonNFTPatterns) {
                try {
                    // This is a more targeted search - will fail gracefully if pattern doesn't exist
                    const objects = await suiClient.getOwnedObjects({
                        owner: ownerAddress,
                        filter: { StructType: `*${pattern}` }, // Wildcard pattern
                        options: {
                            showContent: true,
                            showDisplay: true,
                            showType: true,
                        }
                    }).catch(() => ({ data: [] })); // Fail gracefully

                    console.log(`Pattern ${pattern} found ${objects.data.length} objects`);

                    // Process these objects the same way
                    for (const obj of objects.data) {
                        if (nfts.some(existing => existing.id === obj.data?.objectId)) {
                            continue; // Skip duplicates
                        }

                        // Parse using same logic as above
                        const type = obj.data?.type || '';
                        const display = obj.data?.display?.data || {};
                        const content = obj.data?.content as any;
                        const fields = content?.fields || {};

                        // Extract collection address from the type
                        const collectionAddress = type ? type.split('::')[0] : '';

                        const nft: NFT = {
                            id: obj.data?.objectId || '',
                            name: display.name || fields.name || `NFT ${obj.data?.objectId?.slice(-8)}`,
                            description: display.description || fields.description || '',
                            imageUrl: getSafeImageUrl(display.image_url || fields.image_url || display.url || fields.url || '/placeholder-nft.png'),
                            collection: display.collection_name || fields.collection_name || display.collection || fields.collection,
                            type: collectionAddress, // Store collection address instead of full type
                        };

                        if (nft.id && nft.name) {
                            nfts.push(nft);
                        }
                    }
                } catch (patternError) {
                    // Pattern search failed, continue to next pattern
                    console.log(`Pattern ${pattern} search failed:`, typeof patternError === 'object' && patternError !== null && 'message' in patternError ? (patternError as { message: string }).message : String(patternError));
                }
            }
        }

        console.log(`Final NFT count: ${nfts.length}`);
        return nfts;

    } catch (error) {
        console.error('Error in NFT detection:', error);
        return [];
    }
};

export default function CreateLotteryPage() {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    const { createLottery, isCreatingLottery } = useMeltyFi();

    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
    const [loadingNFTs, setLoadingNFTs] = useState(false);
    const [wonkaBarPrice, setWonkaBarPrice] = useState('0.1');
    const [maxSupply, setMaxSupply] = useState('100');
    const [duration, setDuration] = useState('7');
    const [showNFTModal, setShowNFTModal] = useState(false);

    // Function to handle collection address click
    const handleCollectionClick = (collectionAddress: string) => {
        if (collectionAddress) {
            // Open Sui Explorer in new tab
            window.open(`https://suiscan.xyz/mainnet/object/${collectionAddress}`, '_blank');
        }
    };

    // Function to truncate long addresses
    const truncateAddress = (address: string, startChars = 6, endChars = 4) => {
        if (!address) return '';
        if (address.length <= startChars + endChars) return address;
        return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    };
    useEffect(() => {
        if (!currentAccount?.address) {
            setUserNFTs([]);
            return;
        }

        const loadUserNFTs = async () => {
            setLoadingNFTs(true);
            try {
                console.log('Starting NFT detection for:', currentAccount.address);
                const detectedNFTs = await detectUserNFTs(suiClient, currentAccount.address);
                console.log('Detected NFTs:', detectedNFTs);
                setUserNFTs(detectedNFTs);
            } catch (error) {
                console.error('Error loading NFTs:', error);
                setUserNFTs([]);
            } finally {
                setLoadingNFTs(false);
            }
        };

        loadUserNFTs();
    }, [currentAccount?.address, suiClient]);

    const handleCreateLottery = async () => {
        if (!selectedNFT || !currentAccount?.address) return;

        try {
            const expirationDate = Date.now() + (parseInt(duration) * 24 * 60 * 60 * 1000);

            await createLottery({
                nftId: selectedNFT.id,
                expirationDate,
                wonkaBarPrice: (parseFloat(wonkaBarPrice) * 1000000000).toString(), // Convert to MIST
                maxSupply: maxSupply,
            });

            // Reset form
            setSelectedNFT(null);
            setWonkaBarPrice('0.1');
            setMaxSupply('100');
            setDuration('7');
            setShowNFTModal(false);
        } catch (error) {
            console.error('Error creating lottery:', error);
        }
    };

    if (!currentAccount?.address) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Coins className="w-12 h-12 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6">Connect to Create Lotteries</h2>
                    <p className="text-white/70 mb-8">Connect your wallet to start creating NFT lotteries and unlock instant liquidity</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Create NFT Lottery</h1>
                    <p className="text-xl text-white/70">Turn your NFT into instant liquidity while keeping upside potential</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* NFT Selection Panel */}
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                                <ImageIcon className="w-6 h-6 mr-3 text-purple-400" />
                                Select Your NFT
                            </h2>

                            {!selectedNFT ? (
                                <div>
                                    <button
                                        onClick={() => setShowNFTModal(true)}
                                        className="w-full h-80 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300"
                                    >
                                        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                                            <ImageIcon className="w-10 h-10 text-purple-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-white mb-2">
                                            {loadingNFTs ? 'Scanning Your Wallet...' : 'Choose NFT from Collection'}
                                        </h3>
                                        <p className="text-white/60 text-center max-w-xs">
                                            {loadingNFTs
                                                ? 'Detecting all NFTs in your wallet...'
                                                : 'Select which NFT you want to use as lottery collateral'
                                            }
                                        </p>
                                        {userNFTs.length > 0 && (
                                            <div className="mt-4 px-4 py-2 bg-purple-500/20 rounded-full">
                                                <span className="text-purple-300 text-sm font-medium">
                                                    {userNFTs.length} NFT{userNFTs.length !== 1 ? 's' : ''} detected
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="w-24 h-24 bg-black/20 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={selectedNFT.imageUrl}
                                                alt={selectedNFT.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                                unoptimized // Always use unoptimized for NFT images
                                                onError={() => {
                                                    // Update selected NFT to use placeholder
                                                    setSelectedNFT(prev => prev ? { ...prev, imageUrl: '/placeholder-nft.png' } : null);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold text-white">{selectedNFT.name}</h3>
                                            {selectedNFT.collection && (
                                                <p className="text-purple-300 mb-2">{selectedNFT.collection}</p>
                                            )}
                                            <p className="text-white/60 text-sm mb-3">{selectedNFT.description}</p>
                                            <p className="text-white/40 text-xs">Type: {selectedNFT.type}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedNFT(null)}
                                            className="text-white/60 hover:text-white/80 p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lottery Configuration Panel */}
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                                <Coins className="w-6 h-6 mr-3 text-purple-400" />
                                Lottery Configuration
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-3">Ticket Price (SUI)</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={wonkaBarPrice}
                                        onChange={(e) => setWonkaBarPrice(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors"
                                        placeholder="0.1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-3">Maximum Tickets</label>
                                    <input
                                        type="number"
                                        value={maxSupply}
                                        onChange={(e) => setMaxSupply(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:outline-none transition-colors"
                                        placeholder="100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-3">Lottery Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                                    >
                                        <option value="1">1 day</option>
                                        <option value="3">3 days</option>
                                        <option value="7">7 days</option>
                                        <option value="14">14 days</option>
                                        <option value="30">30 days</option>
                                    </select>
                                </div>

                                {/* Financial Summary */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20 p-6 mt-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">Total Potential Value:</span>
                                            <span className="text-white font-medium">{(parseFloat(wonkaBarPrice) * parseInt(maxSupply)).toFixed(3)} SUI</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">Your Instant Payout (95%):</span>
                                            <span className="text-green-400 font-semibold">
                                                {(parseFloat(wonkaBarPrice) * parseInt(maxSupply) * 0.95).toFixed(3)} SUI
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">Platform Fee (5%):</span>
                                            <span className="text-white/60">{(parseFloat(wonkaBarPrice) * parseInt(maxSupply) * 0.05).toFixed(3)} SUI</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateLottery}
                                    disabled={!selectedNFT || isCreatingLottery}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl"
                                >
                                    {isCreatingLottery ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Creating Your Lottery...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Coins className="w-5 h-5" />
                                            <span>Create Lottery & Get Instant Liquidity</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NFT Selection Modal */}
            {showNFTModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Select Your NFT</h2>
                                <p className="text-white/60 mt-1">Choose which NFT to use as lottery collateral</p>
                            </div>
                            <button
                                onClick={() => setShowNFTModal(false)}
                                className="text-white/60 hover:text-white/80 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            {loadingNFTs ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
                                    <p className="text-white/70 mt-6 text-xl">Scanning your wallet for NFTs...</p>
                                    <p className="text-white/50 text-sm mt-2">This comprehensive scan may take a moment</p>
                                </div>
                            ) : userNFTs.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <ImageIcon className="w-10 h-10 text-white/40" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-white mb-4">No NFTs Found</h3>
                                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                                        We couldn't detect any NFTs in your wallet. Make sure you have NFTs or try refreshing the page.
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Refresh & Scan Again
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6">
                                        <p className="text-white/70">
                                            Found <span className="text-purple-300 font-medium">{userNFTs.length}</span> NFT{userNFTs.length !== 1 ? 's' : ''} in your wallet
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {userNFTs.map((nft) => (
                                            <div
                                                key={nft.id}
                                                onClick={() => {
                                                    setSelectedNFT(nft);
                                                    setShowNFTModal(false);
                                                }}
                                                className="cursor-pointer group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300"
                                            >
                                                <div className="aspect-square bg-black/20 rounded-lg mb-4 overflow-hidden">
                                                    <Image
                                                        src={nft.imageUrl}
                                                        alt={nft.name}
                                                        width={200}
                                                        height={200}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        unoptimized // Always use unoptimized for NFT images
                                                        onError={() => {
                                                            // Update the NFT's imageUrl to placeholder if it fails
                                                            const updatedNFTs = userNFTs.map(n =>
                                                                n.id === nft.id
                                                                    ? { ...n, imageUrl: '/placeholder-nft.png' }
                                                                    : n
                                                            );
                                                            setUserNFTs(updatedNFTs);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-white truncate">{nft.name}</h4>
                                                    {nft.collection && (
                                                        <p className="text-sm text-purple-300 truncate">{nft.collection}</p>
                                                    )}
                                                    {nft.type && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCollectionClick(nft.type);
                                                            }}
                                                            className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center group w-full"
                                                            title={`View collection on Sui Explorer: ${nft.type}`}
                                                        >
                                                            <span className="truncate">{truncateAddress(nft.type)}</span>
                                                            <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}