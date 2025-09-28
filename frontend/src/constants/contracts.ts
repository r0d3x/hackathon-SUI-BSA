export const MELTYFI_PACKAGE_ID = process.env.NEXT_PUBLIC_MELTYFI_PACKAGE_ID || '0xa015bb87003d4bc71f5a0a14b38a2d65b72eaa12cbb48b7a772dc2abfc288f0d';
export const PROTOCOL_OBJECT_ID = process.env.NEXT_PUBLIC_PROTOCOL_OBJECT_ID || '0x4afa56bb19cc72b588968bd7b79accbb88e2df72c92456c0ad622598d0d55933';
export const CHOCOLATE_FACTORY_ID = process.env.NEXT_PUBLIC_CHOCOLATE_FACTORY_ID || '0xc106f26a521c59e808fbf8aa95a3203b627507e28178d3f72d27bd23576059b9';
export const ADMIN_CAP_ID = process.env.NEXT_PUBLIC_ADMIN_CAP_ID || '0x9780564db5a3da125e5dc08c25161fa624220adc36bc20d325187b58934b3e25';
export const FACTORY_ADMIN_ID = process.env.NEXT_PUBLIC_FACTORY_ADMIN_ID || '0x9a44e3d837041eaac7fa40813305b7d65227876dc4a23b65e437cf09f43df92a';

// Token types
export const CHOCO_CHIP_TYPE = process.env.NEXT_PUBLIC_CHOCO_CHIP_TYPE || `${MELTYFI_PACKAGE_ID}::choco_chip::CHOCO_CHIP`;
export const WONKA_BAR_TYPE = process.env.NEXT_PUBLIC_WONKA_BAR_TYPE || `${MELTYFI_PACKAGE_ID}::wonka_bars::WonkaBars`;

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
