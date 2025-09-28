'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
    ArrowRight, 
    Zap, 
    Shield, 
    TrendingUp, 
    Users, 
    Sparkles,
    ChevronDown,
    Play,
    ExternalLink,
    Coins,
    Trophy,
    Clock,
    Target
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Instant NFT Liquidity",
            description: "Transform your NFTs into immediate SUI tokens through our innovative lottery system",
            color: "from-blue-400 to-blue-600"
        },
        {
            icon: Shield,
            title: "Secure & Transparent",
            description: "Built on Sui blockchain with verifiable smart contracts and provable randomness",
            color: "from-purple-400 to-purple-600"
        },
        {
            icon: TrendingUp,
            title: "Win Premium NFTs",
            description: "Purchase WonkaBars for a chance to win valuable NFTs at fraction of their value",
            color: "from-pink-400 to-pink-600"
        },
        {
            icon: Users,
            title: "Community Rewards",
            description: "Earn ChocoChip tokens as consolation prizes and participate in governance",
            color: "from-cyan-400 to-cyan-600"
        }
    ];

    const stats = [
        { label: "Total Volume", value: "2.4M SUI", icon: Coins },
        { label: "NFTs Melted", value: "1,247", icon: Trophy },
        { label: "Active Users", value: "8,932", icon: Users },
        { label: "Avg. Response", value: "< 2s", icon: Clock }
    ];

    if (!mounted) return null;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    {/* Logo Animation */}
                    <div className="mb-8 animate-slide-up">
                        <div className="relative w-24 h-24 mx-auto mb-6 animate-float">
                            <Image
                                src="/logo.png"
                                alt="MeltyFi Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Main Headline */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="gradient-text">Melt</span> Your NFTs
                            <br />
                            Into <span className="gradient-text-secondary">Liquid Gold</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            The first NFT liquidity protocol on Sui. Transform your digital assets into immediate liquidity 
                            through our innovative lottery marketplace.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <Link href="/lotteries" className="btn-primary text-lg px-8 py-4 group">
                            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                            Explore Lotteries
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/create" className="btn-outline text-lg px-8 py-4 group">
                            <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Melt Your NFT
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="card text-center group">
                                    <Icon className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            How <span className="gradient-text">MeltyFi</span> Works
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Our innovative protocol transforms illiquid NFTs into liquid assets through a fair lottery system
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="card-premium text-center group">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">1. List Your NFT</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Lock your NFT as collateral and receive 95% of the potential lottery earnings immediately as liquid SUI tokens.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="card-premium text-center group">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">2. Community Participates</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Users purchase WonkaBar lottery tickets for a chance to win your NFT at a fraction of its market value.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="card-premium text-center group">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">3. Melt & Claim Rewards</h3>
                            <p className="text-gray-300 leading-relaxed">
                                When lottery ends, all participants melt their WonkaBars: winners get the NFT + ChocoChips, others get ChocoChips as rewards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Feature List */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">
                                Why Choose <span className="gradient-text">MeltyFi</span>?
                            </h2>
                            <div className="space-y-6">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    const isActive = activeFeature === index;
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                p-6 rounded-2xl cursor-pointer transition-all duration-500
                                                ${isActive 
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-purple-500/30 scale-105' 
                                                    : 'hover:bg-white/5 border border-transparent'
                                                }
                                            `}
                                            onClick={() => setActiveFeature(index)}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`
                                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                                    ${isActive ? `bg-gradient-to-br ${feature.color}` : 'bg-gray-700'}
                                                `}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-gray-400 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Feature Visualization */}
                        <div className="relative">
                            <div className="card-premium p-8 text-center">
                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl animate-pulse-glow" />
                                    <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <Image
                                            src="/logo.png"
                                            alt="MeltyFi"
                                            width={80}
                                            height={80}
                                            className="animate-float"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 gradient-text">
                                    Built on Sui Blockchain
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    Leveraging Sui's high-performance infrastructure for lightning-fast transactions and provable randomness.
                                </p>
                                <Link 
                                    href="https://sui.io" 
                                    target="_blank"
                                    className="btn-secondary group"
                                >
                                    Learn More
                                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to <span className="gradient-text">Melt</span> Your NFTs?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who have already unlocked liquidity from their digital assets.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/create" className="btn-primary text-lg px-8 py-4 group">
                            <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                            Start Melting
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/lotteries" className="btn-outline text-lg px-8 py-4">
                            Browse Lotteries
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}