'use client';

import { shortenAddress } from '@/lib/utils';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Wallet } from 'lucide-react';

export function WalletConnection() {
    const currentAccount = useCurrentAccount();

    return (
        <div className="flex items-center gap-4">
            {currentAccount ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
                        <Wallet className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            {shortenAddress(currentAccount.address)}
                        </span>
                    </div>
                    <ConnectButton
                        connectText="Connected"
                    />
                </div>
            ) : (
                <ConnectButton
                    connectText="Connect Wallet"
                />
            )}
        </div>
    );
}