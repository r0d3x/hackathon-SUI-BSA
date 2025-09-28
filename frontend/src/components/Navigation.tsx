'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnection } from './wallet/WalletConnection';
import Image from 'next/image';
import { 
    Home, 
    Ticket, 
    User, 
    Plus,
    Sparkles,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: Home,
            description: 'Discover MeltyFi'
        },
        {
            href: '/lotteries',
            label: 'Lotteries',
            icon: Ticket,
            description: 'Browse NFT Lotteries'
        },
        {
            href: '/create',
            label: 'Create',
            icon: Plus,
            description: 'Melt Your NFT'
        },
        {
            href: '/profile',
            label: 'Profile',
            icon: User,
            description: 'Your Dashboard'
        }
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
                        >
                            <div className="relative w-12 h-12 animate-float">
                                <Image
                                    src="/logo.png"
                                    alt="MeltyFi"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold gradient-text">
                                    MeltyFi
                                </span>
                                <span className="text-xs text-gray-400 -mt-1">
                                    NFT Liquidity Protocol
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Items */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            group relative px-4 py-2 rounded-xl transition-all duration-300
                                            ${active 
                                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-purple-500/30' 
                                                : 'hover:bg-white/5 text-gray-300 hover:text-white'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Icon className={`w-4 h-4 transition-all duration-300 ${active ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </div>
                                        
                                        {/* Active indicator */}
                                        {active && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 animate-pulse-glow" />
                                        )}
                                        
                                        {/* Hover tooltip */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-xs text-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                            {item.description}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Wallet Connection & Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            <WalletConnection />
                            
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl glass hover:bg-white/10 transition-all duration-300"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <div className={`
                fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Mobile Menu */}
                <div className={`
                    absolute top-20 left-4 right-4 glass-strong rounded-2xl border border-white/10 p-6
                    transform transition-all duration-300 ease-out
                    ${isMobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'}
                `}>
                    <div className="space-y-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center space-x-3 p-4 rounded-xl transition-all duration-300
                                        ${active 
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-purple-500/30' 
                                            : 'hover:bg-white/5 text-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-400'}`} />
                                    <div className="flex-1">
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-gray-400">{item.description}</div>
                                    </div>
                                    {active && (
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {/* Mobile Menu Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-sm text-gray-400">Powered by</div>
                            <div className="text-lg font-bold gradient-text">Sui Blockchain</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Spacer */}
            <div className="h-20" />
        </>
    );
}
