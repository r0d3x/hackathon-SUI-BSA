// src/constants/contracts.ts
export const MELTYFI_PACKAGE_ID = process.env.NEXT_PUBLIC_MELTYFI_PACKAGE_ID || '0x123'
export const PROTOCOL_OBJECT_ID = process.env.NEXT_PUBLIC_PROTOCOL_OBJECT_ID || '0x456'
export const CHOCOLATE_FACTORY_ID = process.env.NEXT_PUBLIC_CHOCOLATE_FACTORY_ID || '0x789'
export const CHOCO_CHIP_TYPE = process.env.NEXT_PUBLIC_CHOCO_CHIP_TYPE || `${MELTYFI_PACKAGE_ID}::choco_chip::CHOCO_CHIP`
export const WONKA_BARS_TYPE = process.env.NEXT_PUBLIC_WONKA_BARS_TYPE || `${MELTYFI_PACKAGE_ID}::wonka_bars::WonkaBars`

// Network configurations - UPDATED FOR TESTNET
export const NETWORK_CONFIG = {
    testnet: {
        rpcUrl: 'https://fullnode.testnet.sui.io:443',
        explorer: 'https://suiexplorer.com',
        faucet: 'https://faucet.testnet.sui.io',
        name: 'Sui Testnet',
        chainId: 'sui:testnet'
    },
    mainnet: {
        rpcUrl: 'https://fullnode.mainnet.sui.io:443',
        explorer: 'https://suiexplorer.com',
        faucet: null,
        name: 'Sui Mainnet',
        chainId: 'sui:mainnet'
    },
    // Removed devnet configuration
}

export const CURRENT_NETWORK = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as keyof typeof NETWORK_CONFIG

// Validate network configuration
if (!NETWORK_CONFIG[CURRENT_NETWORK]) {
    console.error(`Invalid network configuration: ${CURRENT_NETWORK}. Supported networks: ${Object.keys(NETWORK_CONFIG).join(', ')}`)
}

// Network-specific constants
export const CURRENT_CONFIG = NETWORK_CONFIG[CURRENT_NETWORK]

// Explorer URLs
export const getExplorerUrl = (type: 'txblock' | 'object' | 'address', identifier: string) => {
    const baseUrl = CURRENT_CONFIG.explorer
    const network = CURRENT_NETWORK
    return `${baseUrl}/${type}/${identifier}?network=${network}`
}

// Faucet URL
export const getFaucetUrl = () => {
    return CURRENT_CONFIG.faucet
}

// Network display utilities
export const getNetworkDisplayName = () => {
    return CURRENT_CONFIG.name
}

export const isTestnet = () => {
    return CURRENT_NETWORK === 'testnet'
}

export const isMainnet = () => {
    return CURRENT_NETWORK === 'mainnet'
}

// Contract interaction constants
export const DEFAULT_GAS_BUDGET = 10_000_000 // 0.01 SUI
export const MAX_GAS_BUDGET = 1_000_000_000 // 1 SUI

// Transaction timeouts
export const TRANSACTION_TIMEOUT = 30_000 // 30 seconds

// Polling intervals
export const BALANCE_POLL_INTERVAL = 10_000 // 10 seconds
export const LOTTERY_POLL_INTERVAL = 5_000 // 5 seconds

// Error messages
export const ERROR_MESSAGES = {
    WALLET_NOT_CONNECTED: 'Please connect your Sui wallet',
    INSUFFICIENT_BALANCE: 'Insufficient SUI balance for this transaction',
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    CONTRACT_ERROR: 'Contract interaction failed.',
    UNKNOWN_ERROR: 'An unknown error occurred.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
    LOTTERY_CREATED: 'Lottery created successfully!',
    WONKA_BARS_PURCHASED: 'WonkaBars purchased successfully!',
    LOTTERY_REPAID: 'Loan repaid successfully!',
    REWARDS_CLAIMED: 'Rewards claimed successfully!',
} as const

// Feature flags for testnet
export const FEATURES = {
    ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG === 'true',
    ENABLE_MOCK_DATA: process.env.NODE_ENV === 'development',
    ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
    SHOW_TESTNET_WARNING: isTestnet(),
} as const