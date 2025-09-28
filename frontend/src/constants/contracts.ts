// Contract addresses and types for MeltyFi protocol
export const MELTYFI_PACKAGE_ID = '0x1a889923ceba84d9994e0211800594cff0f228e1b231ce6ec5ce2b54f26880fe';
export const PROTOCOL_OBJECT_ID = '0xce559313c3dc2c59145af9ee1285d8af58e00568f3e56d914e899db989dbc1bc';
export const CHOCOLATE_FACTORY_ID = '0xe11da602b8939f6617554f8d4503a0c8e4beb29d0963ee72f9c74c7b5b3cac69';

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
