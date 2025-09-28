'use client'

import { ExternalLink, Github, MessageCircle, Sparkles, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-6xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-gradient" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                MeltyFi
                            </span>
                        </div>
                        <p className="text-text-secondary max-w-md leading-relaxed mb-6">
                            The sweetest way to unlock liquidity from your NFTs on Sui blockchain.
                            Making the illiquid liquid, one lottery at a time.
                        </p>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="https://twitter.com/meltyfi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-border bg-surface hover:bg-surface-elevated p-3 transition-all duration-200 group"
                            >
                                <Twitter className="w-5 h-5 text-text-secondary group-hover:text-gradient" />
                            </Link>
                            <Link
                                href="https://discord.gg/meltyfi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-border bg-surface hover:bg-surface-elevated p-3 transition-all duration-200 group"
                            >
                                <MessageCircle className="w-5 h-5 text-text-secondary group-hover:text-gradient" />
                            </Link>
                            <Link
                                href="https://github.com/VincenzoImp/MeltyFi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-border bg-surface hover:bg-surface-elevated p-3 transition-all duration-200 group"
                            >
                                <Github className="w-5 h-5 text-text-secondary group-hover:text-gradient" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link
                                href="/lotteries"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Browse Lotteries
                            </Link>
                            <Link
                                href="/profile"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/create"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Create Lottery
                            </Link>
                            <Link
                                href="https://docs.meltyfi.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Documentation
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Resources & Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Resources</h3>
                        <div className="space-y-3">
                            <Link
                                href="/how-it-works"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/security"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Security
                            </Link>
                            <Link
                                href="/privacy"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="block text-text-secondary hover:text-text-primary transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
                    <div className="text-text-muted text-sm mb-4 md:mb-0">
                        &copy; 2025 MeltyFi Protocol. Making the illiquid liquid.
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                            <span className="text-text-muted">Sui Network</span>
                        </div>
                        <div className="text-text-muted">
                            Built for the Sui ecosystem
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}