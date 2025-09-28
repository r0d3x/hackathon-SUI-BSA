'use client'

import { ExternalLink, Github, MessageCircle, Sparkles, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-6xl mx-auto px-8 py-16 ">
                

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