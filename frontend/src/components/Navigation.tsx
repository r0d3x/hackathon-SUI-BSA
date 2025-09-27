'use client'

import { getFaucetUrl, getNetworkDisplayName, isTestnet } from "@/constants/contracts"
import { cn } from "@/lib/utils"
import {
    AlertTriangle,
    ChevronDown,
    ExternalLink,
    Github,
    Home,
    Menu,
    Sparkles,
    Trophy,
    User,
    Wallet,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    external?: boolean
}

const navigationItems: NavItem[] = [
    {
        href: "/",
        label: "Home",
        icon: <Home className="h-4 w-4" />
    },
    {
        href: "/lotteries",
        label: "Lotteries",
        icon: <Trophy className="h-4 w-4" />
    },
    {
        href: "/profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />
    }
]

const externalLinks: NavItem[] = [
    {
        href: "https://github.com/VincenzoImp/MeltyFi",
        label: "GitHub",
        icon: <Github className="h-4 w-4" />,
        external: true
    },
    {
        href: "https://docs.meltyfi.com",
        label: "Docs",
        icon: <ExternalLink className="h-4 w-4" />,
        external: true
    }
]

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [userBalance, setUserBalance] = useState("0.000")
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    // Handle mounting state to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const connectWallet = () => {
        // Mock wallet connection
        setIsConnected(true)
        setUserBalance("12.453")
    }

    const disconnectWallet = () => {
        setIsConnected(false)
        setUserBalance("0.000")
    }

    // Don't render anything until mounted to prevent hydration issues
    if (!isMounted) {
        return (
            <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-sm border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                MeltyFi
                            </span>
                        </Link>
                        <div className="w-6 h-6" /> {/* Placeholder for consistency */}
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <>
            {/* Main Navigation */}
            <nav className={cn(
                "sticky top-0 z-50 w-full transition-all duration-200",
                isScrolled
                    ? "bg-gray-900/95 backdrop-blur-lg border-b border-white/10"
                    : "bg-gray-900/80 backdrop-blur-sm border-b border-white/5"
            )}>
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                    MeltyFi
                                </span>
                                {/* Network indicator */}
                                {isTestnet() && (
                                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {getNetworkDisplayName()}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                        pathname === item.href
                                            ? "bg-purple-600/90 text-white shadow-md"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            {/* External Links Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <span>More</span>
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                    <div className="rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-lg p-2 shadow-xl">
                                        {externalLinks.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                        {/* Testnet Faucet Link */}
                                        {isTestnet() && getFaucetUrl() && (
                                            <Link
                                                href={getFaucetUrl()!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-yellow-400 hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
                                            >
                                                <Wallet className="h-4 w-4" />
                                                <span>Get Testnet SUI</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Network Badge */}
                            {isTestnet() && (
                                <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400 font-medium">
                                    Testnet
                                </div>
                            )}

                            {isConnected ? (
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2">
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-white">{userBalance} SUI</div>
                                            <div className="text-xs text-white/60">Connected</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={disconnectWallet}
                                        className="relative group border border-white/10 rounded-md px-3 py-2 text-sm hover:bg-white/10 transition-all duration-200"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-green-500 absolute -top-1 -right-1"></div>
                                        <Wallet className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={connectWallet}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                                >
                                    <Wallet className="h-4 w-4 mr-2" />
                                    Connect Wallet
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-9 h-9 p-0 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-[65px] right-6 w-80 z-50 md:hidden">
                        <div className="rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-lg p-6 shadow-xl">
                            <div className="space-y-4">
                                {/* Network Status */}
                                {isTestnet() && (
                                    <div className="pb-4 border-b border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-yellow-400 font-medium text-sm">
                                                {getNetworkDisplayName()}
                                            </span>
                                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        {getFaucetUrl() && (
                                            <Link
                                                href={getFaucetUrl()!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 text-xs text-yellow-400/70 hover:text-yellow-400 underline"
                                            >
                                                Get testnet SUI tokens
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Mobile Wallet Section */}
                                <div className="pb-4 border-b border-white/10">
                                    {isConnected ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-white">{userBalance} SUI</div>
                                                    <div className="text-sm text-white/60">Connected</div>
                                                </div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <button
                                                onClick={disconnectWallet}
                                                className="w-full border border-white/10 rounded-md px-3 py-2 text-sm hover:bg-white/10 transition-all duration-200 text-white"
                                            >
                                                Disconnect Wallet
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={connectWallet}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg"
                                        >
                                            <Wallet className="h-4 w-4 mr-2" />
                                            Connect Sui Wallet
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Navigation Links */}
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                            pathname === item.href
                                                ? "bg-purple-600/90 text-white"
                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                                {/* Mobile External Links */}
                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    {externalLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}