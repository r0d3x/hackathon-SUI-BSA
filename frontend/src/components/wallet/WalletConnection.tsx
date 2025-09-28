'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { formatSuiAmount } from '@/lib/utils';
import { useMeltyFi } from '@/hooks/useMeltyFi';
import { 
    Wallet, 
    LogOut, 
    Copy, 
    ExternalLink,
    Coins,
    ChevronDown,
    User,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function WalletConnection() {
    const currentAccount = useCurrentAccount();
    const { suiBalance, chocoChipBalance } = useMeltyFi();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const copyAddress = () => {
        if (currentAccount?.address) {
            navigator.clipboard.writeText(currentAccount.address);
            toast.success('Address copied to clipboard!');
        }
    };

    const openExplorer = () => {
        if (currentAccount?.address) {
            window.open(`https://suiscan.xyz/testnet/account/${currentAccount.address}`, '_blank');
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!currentAccount) {
        return (
            <div className="relative">
                <ConnectButton 
                    connectText="Connect Wallet"
                    className="btn-primary group"
                >
                    <Wallet className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Connect Wallet
                </ConnectButton>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Wallet Button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-300 group border border-white/10"
            >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-white">
                        {formatAddress(currentAccount.address)}
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatSuiAmount(suiBalance, 2)} SUI
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    {/* Dropdown Content */}
                    <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl border border-white/20 p-6 z-50 animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-white">Wallet Connected</div>
                                <div className="text-sm text-gray-400">
                                    {formatAddress(currentAccount.address)}
                                </div>
                            </div>
                        </div>

                        {/* Balances */}
                        <div className="space-y-4 mb-6">
                            {/* SUI Balance */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">SUI</div>
                                        <div className="text-xs text-gray-400">Native Token</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">
                                        {formatSuiAmount(suiBalance, 4)}
                                    </div>
                                    <div className="text-xs text-gray-400">SUI</div>
                                </div>
                            </div>

                            {/* ChocoChip Balance */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">🍫</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">ChocoChip</div>
                                        <div className="text-xs text-gray-400">Reward Token</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">
                                        {formatSuiAmount(chocoChipBalance, 2)}
                                    </div>
                                    <div className="text-xs text-gray-400">CHOC</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button
                                onClick={copyAddress}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                            >
                                <div className="flex items-center space-x-3">
                                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        Copy Address
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={openExplorer}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                            >
                                <div className="flex items-center space-x-3">
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        View on Explorer
                                    </span>
                                </div>
                            </button>

                            <div className="border-t border-white/10 my-2" />

                            <ConnectButton
                                connectText="Connect Wallet"
                                className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 group text-red-400 hover:text-red-300"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Disconnect Wallet
                            </ConnectButton>
                        </div>

                        {/* Network Info */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">Network</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-green-400 font-medium">Sui Testnet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}