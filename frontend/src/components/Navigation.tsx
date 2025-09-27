'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnection } from './wallet/WalletConnection';

export function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/lotteries', label: 'Lotteries' },
        { href: '/create', label: 'Create' },
        { href: '/profile', label: 'Profile' },
    ];

    return (
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">MeltyFi</span>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full border border-yellow-500/30">
                            TESTNET
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                        ? 'text-white'
                                        : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <WalletConnection />
                </div>
            </div>
        </nav>
    );
}
