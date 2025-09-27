// src/types/lottery.ts
export interface Lottery {
    id: string
    lottery_id: number
    name: string
    description: string
    owner: string
    state: number // 0: ACTIVE, 1: CANCELLED, 2: CONCLUDED, 3: TRASHED
    expirationDate: number
    wonkabarPrice: number
    maxSupply: number
    soldCount: number
    winner?: string
    nftImage?: string
    participantCount: number
    totalValue: number
    timeRemaining: number
}

export interface WonkaBars {
    id: string
    lottery_id: number
    quantity: number
    owner: string
    name: string
    description: string
    image_url: string
}

export interface LotteryStats {
    totalLotteries: number
    activeLotteries: number
    totalVolume: number
    totalParticipants: number
}