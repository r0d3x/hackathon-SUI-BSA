export const MELTYFI_PACKAGE_ID = process.env.NEXT_PUBLIC_MELTYFI_PACKAGE_ID || '';
export const PROTOCOL_OBJECT_ID = process.env.NEXT_PUBLIC_PROTOCOL_OBJECT_ID || '';
export const CHOCOLATE_FACTORY_ID = process.env.NEXT_PUBLIC_CHOCOLATE_FACTORY_ID || '';
export const ADMIN_CAP_ID = process.env.NEXT_PUBLIC_ADMIN_CAP_ID || '';
export const FACTORY_ADMIN_ID = process.env.NEXT_PUBLIC_FACTORY_ADMIN_ID || '';

// Token types
export const CHOCO_CHIP_TYPE = process.env.NEXT_PUBLIC_CHOCO_CHIP_TYPE || `${MELTYFI_PACKAGE_ID}::choco_chip::CHOCO_CHIP`;
export const WONKA_BAR_TYPE = process.env.NEXT_PUBLIC_WONKA_BAR_TYPE || `${MELTYFI_PACKAGE_ID}::core::WonkaBar`;

// Network configurations
export const NETWORK_CONFIG = {
    testnet: {
        rpcUrl: 'https://fullnode.testnet.sui.io:443',
        explorer: 'https://suiexplorer.com',
        faucet: 'https://faucet.testnet.sui.io',
        name: 'Sui Testnet',
        chainId: 'sui:testnet'
    },
};

export const CURRENT_NETWORK = 'testnet';
export const CURRENT_CONFIG = NETWORK_CONFIG[CURRENT_NETWORK];

// Contract interaction constants
export const DEFAULT_GAS_BUDGET = 10_000_000; // 0.01 SUI
export const MAX_GAS_BUDGET = 1_000_000_000; // 1 SUI

// Utility functions
export const getExplorerUrl = (type: 'txblock' | 'object' | 'address', identifier: string) => {
    return `${CURRENT_CONFIG.explorer}/${type}/${identifier}?network=${CURRENT_NETWORK}`;
};

export const isContractsConfigured = () => {
    return !!(MELTYFI_PACKAGE_ID && PROTOCOL_OBJECT_ID && CHOCOLATE_FACTORY_ID);
};
