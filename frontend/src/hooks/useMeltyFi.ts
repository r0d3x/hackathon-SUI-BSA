// src/hooks/useMeltyFi.ts
'use client';

import { MELTYFI_PACKAGE_ID, PROTOCOL_OBJECT_ID } from '@/constants/contracts';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface CreateLotteryParams {
    nftId: string;
    expirationDate: number;
    wonkabarPrice: number;
    maxSupply: number;
}

interface BuyWonkaBarsParams {
    lotteryId: string;
    quantity: number;
    totalCost: number;
}

interface LotteryData {
    id: string;
    lottery_id: number;
    owner: string;
    state: number;
    expirationDate: number;
    wonkabarPrice: number;
    maxSupply: number;
    soldCount: number;
    winner?: string; // Optional property
}

interface WonkaBarsData {
    id: string;
    lottery_id: number;
    quantity: number;
    owner: string;
}

export function useMeltyFi() {
    const client = useSuiClient();
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    // Create lottery mutation
    const createLotteryMutation = useMutation({
        mutationFn: async (params: CreateLotteryParams): Promise<any> => {
            if (!currentAccount) throw new Error('No wallet connected');

            return new Promise((resolve, reject) => {
                setIsLoading(true);

                try {
                    const tx = new Transaction();

                    tx.moveCall({
                        target: `${MELTYFI_PACKAGE_ID}::meltyfi_core::create_lottery`,
                        arguments: [
                            tx.object(PROTOCOL_OBJECT_ID),
                            tx.object(params.nftId),
                            tx.pure.u64(params.expirationDate),
                            tx.pure.u64(params.wonkabarPrice),
                            tx.pure.u64(params.maxSupply),
                            tx.object('0x6'), // Clock
                        ],
                        typeArguments: ['0x2::coin::Coin<0x2::sui::SUI>'], // Generic NFT type
                    });

                    signAndExecuteTransaction(
                        {
                            transaction: tx,
                        },
                        {
                            onSuccess: (result) => {
                                setIsLoading(false);
                                resolve(result);
                            },
                            onError: (error) => {
                                setIsLoading(false);
                                reject(error);
                            }
                        }
                    );
                } catch (error) {
                    setIsLoading(false);
                    reject(error);
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lotteries'] });
            queryClient.invalidateQueries({ queryKey: ['user-lotteries'] });
        },
    });

    // Buy WonkaBars mutation
    const buyWonkaBarsMutation = useMutation({
        mutationFn: async (params: BuyWonkaBarsParams): Promise<any> => {
            if (!currentAccount) throw new Error('No wallet connected');

            return new Promise((resolve, reject) => {
                setIsLoading(true);

                try {
                    const tx = new Transaction();

                    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(params.totalCost)]);

                    tx.moveCall({
                        target: `${MELTYFI_PACKAGE_ID}::meltyfi_core::buy_wonkabars`,
                        arguments: [
                            tx.object(PROTOCOL_OBJECT_ID),
                            tx.object(params.lotteryId),
                            coin,
                            tx.pure.u64(params.quantity),
                            tx.object('0x6'), // Clock
                        ],
                    });

                    signAndExecuteTransaction(
                        {
                            transaction: tx,
                        },
                        {
                            onSuccess: (result) => {
                                setIsLoading(false);
                                resolve(result);
                            },
                            onError: (error) => {
                                setIsLoading(false);
                                reject(error);
                            }
                        }
                    );
                } catch (error) {
                    setIsLoading(false);
                    reject(error);
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lotteries'] });
            queryClient.invalidateQueries({ queryKey: ['user-wonkabars'] });
        },
    });

    // Redeem WonkaBars mutation
    const redeemWonkaBarsMutation = useMutation({
        mutationFn: async (wonkaBarsId: string): Promise<any> => {
            if (!currentAccount) throw new Error('No wallet connected');

            return new Promise((resolve, reject) => {
                setIsLoading(true);

                try {
                    const tx = new Transaction();

                    tx.moveCall({
                        target: `${MELTYFI_PACKAGE_ID}::meltyfi_core::redeem_wonkabars`,
                        arguments: [
                            tx.object(PROTOCOL_OBJECT_ID),
                            tx.object(wonkaBarsId),
                        ],
                        typeArguments: ['0x2::coin::Coin<0x2::sui::SUI>'], // Generic NFT type
                    });

                    signAndExecuteTransaction(
                        {
                            transaction: tx,
                        },
                        {
                            onSuccess: (result) => {
                                setIsLoading(false);
                                resolve(result);
                            },
                            onError: (error) => {
                                setIsLoading(false);
                                reject(error);
                            }
                        }
                    );
                } catch (error) {
                    setIsLoading(false);
                    reject(error);
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-wonkabars'] });
            queryClient.invalidateQueries({ queryKey: ['user-balance'] });
        },
    });

    // Get all lotteries - using a more robust approach
    const getLotteriesQuery = useQuery({
        queryKey: ['lotteries'],
        queryFn: async (): Promise<LotteryData[]> => {
            try {
                // Since lotteries are shared objects, we need to query them differently
                // This is a simplified approach - in production, you'd want to track lottery IDs
                const response = await client.multiGetObjects({
                    ids: [], // You'd need to maintain a list of lottery IDs
                    options: {
                        showContent: true,
                        showType: true,
                    },
                });

                return response
                    .map((item) => {
                        if (item.data?.content && 'fields' in item.data.content) {
                            const fields = item.data.content.fields as any;
                            return {
                                id: item.data.objectId,
                                lottery_id: parseInt(fields.lottery_id || '0'),
                                owner: fields.owner || '',
                                state: parseInt(fields.state || '0'),
                                expirationDate: parseInt(fields.expiration_date || '0'),
                                wonkabarPrice: parseInt(fields.wonkabar_price || '0'),
                                maxSupply: parseInt(fields.max_supply || '0'),
                                soldCount: parseInt(fields.sold_count || '0'),
                                winner: fields.winner,
                            } as LotteryData;
                        }
                        return null;
                    })
                    .filter((lottery): lottery is LotteryData => lottery !== null);
            } catch (error) {
                console.error('Error fetching lotteries:', error);
                return [];
            }
        },
        refetchInterval: 10000,
    });

    // Get user's WonkaBars
    const getUserWonkaBarsQuery = useQuery({
        queryKey: ['user-wonkabars', currentAccount?.address],
        queryFn: async (): Promise<WonkaBarsData[]> => {
            if (!currentAccount) return [];

            try {
                const response = await client.getOwnedObjects({
                    owner: currentAccount.address,
                    filter: {
                        StructType: `${MELTYFI_PACKAGE_ID}::wonka_bars::WonkaBars`
                    },
                    options: {
                        showContent: true,
                        showType: true,
                    }
                });

                return response.data
                    .map(item => {
                        if (item.data?.content && 'fields' in item.data.content) {
                            const fields = item.data.content.fields as any;
                            return {
                                id: item.data.objectId,
                                lottery_id: parseInt(fields.lottery_id || '0'),
                                quantity: parseInt(fields.quantity || '0'),
                                owner: fields.owner || '',
                            } as WonkaBarsData;
                        }
                        return null;
                    })
                    .filter((wonkaBars): wonkaBars is WonkaBarsData => wonkaBars !== null);
            } catch (error) {
                console.error('Error fetching user WonkaBars:', error);
                return [];
            }
        },
        enabled: !!currentAccount,
        refetchInterval: 10000,
    });

    // Get user's balance
    const getUserBalanceQuery = useQuery({
        queryKey: ['user-balance', currentAccount?.address],
        queryFn: async (): Promise<string> => {
            if (!currentAccount) return '0';

            try {
                const balance = await client.getBalance({
                    owner: currentAccount.address,
                    coinType: '0x2::sui::SUI'
                });

                return balance.totalBalance;
            } catch (error) {
                console.error('Error fetching balance:', error);
                return '0';
            }
        },
        enabled: !!currentAccount,
        refetchInterval: 30000,
    });

    // Get user's NFTs for creating lotteries
    const getUserNFTsQuery = useQuery({
        queryKey: ['user-nfts', currentAccount?.address],
        queryFn: async () => {
            if (!currentAccount) return [];

            try {
                const response = await client.getOwnedObjects({
                    owner: currentAccount.address,
                    options: {
                        showContent: true,
                        showType: true,
                        showDisplay: true,
                    },
                    filter: {
                        MatchNone: [
                            { StructType: `${MELTYFI_PACKAGE_ID}::wonka_bars::WonkaBars` },
                            { StructType: '0x2::coin::Coin' },
                        ]
                    }
                });

                return response.data.map(item => {
                    if (item.data) {
                        return {
                            id: item.data.objectId,
                            type: item.data.type || '',
                            display: item.data.display?.data || {},
                        };
                    }
                    return null;
                }).filter(Boolean);
            } catch (error) {
                console.error('Error fetching user NFTs:', error);
                return [];
            }
        },
        enabled: !!currentAccount,
    });

    return {
        // Mutations
        createLottery: createLotteryMutation.mutate,
        buyWonkaBars: buyWonkaBarsMutation.mutate,
        redeemWonkaBars: redeemWonkaBarsMutation.mutate,

        // Queries
        lotteries: getLotteriesQuery.data || [],
        userWonkaBars: getUserWonkaBarsQuery.data || [],
        userBalance: getUserBalanceQuery.data || '0',
        userNFTs: getUserNFTsQuery.data || [],

        // Loading states
        isLoading: isLoading ||
            createLotteryMutation.isPending ||
            buyWonkaBarsMutation.isPending ||
            redeemWonkaBarsMutation.isPending,

        isLoadingLotteries: getLotteriesQuery.isLoading,
        isLoadingUserData: getUserWonkaBarsQuery.isLoading || getUserBalanceQuery.isLoading,
        isLoadingNFTs: getUserNFTsQuery.isLoading,

        // Error states
        createLotteryError: createLotteryMutation.error,
        buyWonkaBarsError: buyWonkaBarsMutation.error,
        redeemError: redeemWonkaBarsMutation.error,

        // Refetch functions
        refetchLotteries: getLotteriesQuery.refetch,
        refetchUserData: () => {
            getUserWonkaBarsQuery.refetch();
            getUserBalanceQuery.refetch();
        },
    };
}