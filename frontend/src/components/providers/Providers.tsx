'use client';

import { CURRENT_NETWORK, isTestnet } from '@/constants/contracts';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Import Sui wallet adapters
import '@mysten/dapp-kit/dist/index.css';

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 3,
                retryDelay: 1000,
                staleTime: 30000, // 30 seconds
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 1,
            },
        },
    }));

    // Network configuration - UPDATED FOR TESTNET ONLY
    const networks = {
        testnet: { url: getFullnodeUrl('testnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
        // Removed devnet configuration completely
    };

    // Validate current network
    useEffect(() => {
        if (CURRENT_NETWORK !== 'testnet' && CURRENT_NETWORK !== 'mainnet') {
            console.error(`Invalid network: ${CURRENT_NETWORK}. Defaulting to testnet.`);
        }
    }, []);

    // Default to testnet instead of devnet
    const defaultNetwork = CURRENT_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork={defaultNetwork}>
                <WalletProvider autoConnect>
                    {/* Show testnet warning banner */}
                    {isTestnet() && (
                        <TestnetWarningBanner />
                    )}
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}

// Testnet warning banner component
function TestnetWarningBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium relative">
            <div className="flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>
                    You are connected to Sui Testnet. Use only testnet tokens.
                    <a
                        href="https://faucet.testnet.sui.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline ml-1 font-semibold hover:text-gray-800"
                    >
                        Get testnet SUI
                    </a>
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-800"
                    aria-label="Close banner"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}