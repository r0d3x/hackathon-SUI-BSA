import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, startLength = 6, endLength = 4): string {
    if (!address) return '';
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function formatSuiAmount(amount: string | number | bigint, decimals = 4): string {
    const amountBigInt = typeof amount === 'string' ? BigInt(amount) :
        typeof amount === 'number' ? BigInt(Math.floor(amount)) : amount;
    const formatted = (Number(amountBigInt) / 1_000_000_000).toFixed(decimals);
    return formatted;
}

export function formatChocoChips(amount: string | number | bigint, decimals = 2): string {
    const amountBigInt = typeof amount === 'string' ? BigInt(amount) :
        typeof amount === 'number' ? BigInt(Math.floor(amount)) : amount;
    const formatted = (Number(amountBigInt) / 1_000_000_000).toFixed(decimals);
    return formatted;
}

export function formatTimeLeft(expirationDate: number): string {
    const timeLeft = expirationDate - Date.now();

    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function getRandomColor(): string {
    const colors = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-orange-500',
        'from-red-500 to-rose-500',
        'from-indigo-500 to-purple-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
