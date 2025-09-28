// Contract addresses and types for MeltyFi protocol
export const MELTYFI_PACKAGE_ID = '0x058b863965f418b15866fdf26b159b483f8cee6b4046b3a6c3bd2bcdb4f5a5a6';
export const PROTOCOL_OBJECT_ID = '0x0538745d9d6a948ca4de66e85bacda39c177e44c02f3d2833b6ef5a310c60bc7';
export const CHOCOLATE_FACTORY_ID = '0xdd01b9bc0383eaed3ebffbe880ebf5f9cd9b7b3086d5a6ca36d3c361b3dccf27';

// Object types
export const LOTTERY_TYPE = `${MELTYFI_PACKAGE_ID}::meltyfi_core::Lottery`;
export const WONKA_BAR_TYPE = `${MELTYFI_PACKAGE_ID}::meltyfi_core::WonkaBar`;
export const LOTTERY_RECEIPT_TYPE = `${MELTYFI_PACKAGE_ID}::meltyfi_core::LotteryReceipt`;
export const CHOCO_CHIP_TYPE = `${MELTYFI_PACKAGE_ID}::choco_chip::CHOCO_CHIP`;

// Event types
export const LOTTERY_CREATED_EVENT = `${MELTYFI_PACKAGE_ID}::meltyfi_core::LotteryCreated`;
export const WONKA_BARS_PURCHASED_EVENT = `${MELTYFI_PACKAGE_ID}::meltyfi_core::WonkaBarsPurchased`;
export const LOTTERY_RESOLVED_EVENT = `${MELTYFI_PACKAGE_ID}::meltyfi_core::LotteryResolved`;

// Network configurations
export const CURRENT_NETWORK = 'testnet';
export const CURRENT_CONFIG = {
    rpc: 'https://fullnode.testnet.sui.io:443',
    explorer: 'https://testnet.suivision.xyz',
};

// Contract interaction constants
export const DEFAULT_GAS_BUDGET = 10_000_000; // 0.01 SUI
export const MAX_GAS_BUDGET = 1_000_000_000; // 1 SUI

// Utility functions
export function getExplorerUrl(type: 'object' | 'txn' | 'address', id: string): string {
    const baseUrl = 'https://testnet.suivision.xyz';
    switch (type) {
        case 'object':
            return `${baseUrl}/object/${id}`;
        case 'txn':
            return `${baseUrl}/txn/${id}`;
        case 'address':
            return `${baseUrl}/account/${id}`;
        default:
            return baseUrl;
    }
}

export const isContractsConfigured = () => {
    return !!(MELTYFI_PACKAGE_ID && PROTOCOL_OBJECT_ID && CHOCOLATE_FACTORY_ID);
};
