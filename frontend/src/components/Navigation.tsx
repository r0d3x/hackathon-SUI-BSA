'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Ticket, Plus, User } from 'lucide-react';
import { WalletConnection } from './wallet/WalletConnection';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      label: 'Home', 
      icon: Home,
      
    },
    { 
      href: '/lotteries', 
      label: 'Lotteries', 
      icon: Ticket,
      
    },
    { 
      href: '/create', 
      label: 'Create', 
      icon: Plus,
      
    },
    { 
      href: '/profile', 
      label: 'Profile', 
      icon: User,
      
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto bg-surface-elevated border border-border rounded-xl shadow-dark-md">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="MeltyFi Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <span className="text-2xl font-bold text-white">MeltyFi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium transition-all duration-200
                    flex items-center space-x-2 group
                    ${isActive(item.href)
                      ? 'text-text-primary border-b-2 border-white'
                      : 'text-text-secondary hover:text-text-primary hover:border-b-2 hover:border-white/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  <span>{item.label}</span>
                  
                  {/* Tooltip */}
                  
                </Link>
              );
            })}
          </div>

          {/* Desktop Wallet Connection */}
          <div className="hidden md:block">
            <WalletConnection />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-surface-elevated border border-border rounded-xl overflow-hidden shadow-dark-md">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-3 text-sm font-medium transition-colors rounded-lg
                    ${isActive(item.href)
                      ? 'text-text-primary bg-surface border border-border'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile Wallet Connection */}
            <div className="pt-4 border-t border-border">
              <WalletConnection />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
