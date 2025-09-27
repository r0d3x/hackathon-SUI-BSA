'use client';

import {
    ConnectButton,
    useCurrentAccount,
    useDisconnectWallet
} from '@mysten/dapp-kit';
import { LogOut, User, Wallet } from 'lucide-react';

// Wallet Connection Component
export function WalletConnection() {
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    if (currentAccount) {
        return (
            <div className="flex items-center gap-3">
                {/* User Address Display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <User className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80 font-mono">
                        {`${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`}
                    </span>
                </div>

                {/* Disconnect Button */}
                <button
                    onClick={() => disconnect()}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Disconnect Wallet"
                >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline text-sm text-red-400">Disconnect</span>
                </button>
            </div>
        );
    }

    return (
        <ConnectButton
            connectText={
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                </div>
            }
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
        />
    );
}