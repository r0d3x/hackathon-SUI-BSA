import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format SUI amounts with proper decimals
 */
export function formatSui(amount: number | string, decimals: number = 9): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    const formatted = (num / Math.pow(10, decimals)).toFixed(6)
    return parseFloat(formatted).toString()
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B'
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K'
    }
    return num.toString()
}

/**
 * Format currency values
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Truncate address/hash strings (alias: shortenAddress for compatibility)
 */
export function truncateAddress(
    address: string,
    startLength: number = 6,
    endLength: number = 4
): string {
    if (address.length <= startLength + endLength) {
        return address
    }
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

// Alias for backward compatibility
export const shortenAddress = truncateAddress

/**
 * Time utilities
 */
export function timeUntilExpiration(timestamp: number): string {
    const now = Date.now()
    const diff = timestamp - now

    if (diff <= 0) {
        return 'Expired'
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
        return `${days}d ${hours}h`
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const now = Date.now()
    const diff = timestamp - now
    const diffInSeconds = Math.floor(diff / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (Math.abs(diffInDays) >= 1) {
        return rtf.format(diffInDays, 'day')
    }
    if (Math.abs(diffInHours) >= 1) {
        return rtf.format(diffInHours, 'hour')
    }
    if (Math.abs(diffInMinutes) >= 1) {
        return rtf.format(diffInMinutes, 'minute')
    }
    return rtf.format(diffInSeconds, 'second')
}

/**
 * Format date for display
 */
export function formatDate(
    timestamp: number,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
): string {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp))
}

/**
 * Validation utilities
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export function isValidSuiAddress(address: string): boolean {
    // Basic Sui address validation (0x followed by 64 hex characters)
    const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/
    return suiAddressRegex.test(address)
}

/**
 * Array utilities
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

/**
 * Object utilities
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
}

export function pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key]
        }
    })
    return result
}

/**
 * String utilities
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Number utilities
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
}

export function randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

/**
 * Async utilities
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms)
        ),
    ])
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0
    return (...args: Parameters<T>) => {
        const now = Date.now()
        if (now - lastCall >= delay) {
            lastCall = now
            func(...args)
        }
    }
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
    get<T>(key: string, defaultValue: T): T {
        try {
            if (typeof window === 'undefined') return defaultValue
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch {
            return defaultValue
        }
    },

    set<T>(key: string, value: T): void {
        try {
            if (typeof window === 'undefined') return
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.warn('Failed to save to localStorage:', error)
        }
    },

    remove(key: string): void {
        try {
            if (typeof window === 'undefined') return
            window.localStorage.removeItem(key)
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error)
        }
    },

    clear(): void {
        try {
            if (typeof window === 'undefined') return
            window.localStorage.clear()
        } catch (error) {
            console.warn('Failed to clear localStorage:', error)
        }
    }
}

/**
 * Copy to clipboard utility
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            const result = document.execCommand('copy')
            textArea.remove()
            return result
        }
    } catch {
        return false
    }
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Color utilities
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Browser detection utilities
 */
export const browser = {
    isMobile: () => {
        if (typeof window === 'undefined') return false
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    },

    isSafari: () => {
        if (typeof window === 'undefined') return false
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    },

    isIOS: () => {
        if (typeof window === 'undefined') return false
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
    }
}