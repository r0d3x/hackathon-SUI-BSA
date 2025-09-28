'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { formatSuiAmount } from '@/lib/utils';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { 
    Wallet, 
    LogOut
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function WalletConnection() {
    const currentAccount = useCurrentAccount();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { suiBalance, chocoChipBalance } = useMeltyFi();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!currentAccount) {
        return (
            <ConnectButton
                connectText={
                    <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 stroke-[1.5]" />
                        <span>Connect Wallet</span>
                    </div>
                }
                className="btn-primary px-4 py-2 text-sm font-medium"
            />
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-surface-elevated rounded-lg transition-colors text-sm font-medium text-text-primary border border-border hover:border-border-hover"
            >
                <Wallet className="w-4 h-4" />
                <span>{formatAddress(currentAccount.address)}</span>
            </button>

            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-surface-elevated rounded-lg border border-border shadow-dark-lg z-20">
                        <div className="p-3">
                            {/* Actions */}
                            <ConnectButton
                                connectText={
                                    <div className="flex items-center space-x-2">
                                        <LogOut className="w-4 h-4 stroke-[1.5]" />
                                        <span>Disconnect</span>
                                    </div>
                                }
                                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}