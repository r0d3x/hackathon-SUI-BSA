'use client';

import { CURRENT_CONFIG, isContractsConfigured } from '@/constants/contracts';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export function ConfigValidator({ children }: { children: React.ReactNode }) {
    const isConfigured = isContractsConfigured();

    if (!isConfigured) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="max-w-md mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">Configuration Required</h2>
                        <p className="text-white/60 mb-6">
                            MeltyFi contracts need to be deployed and configured before using the application.
                        </p>

                        <div className="space-y-3 text-left mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-white/60">Deploy contracts to testnet</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-white/60">Update environment variables</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-white/60">Restart the application</span>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                            <p className="text-xs text-white/40 mb-2">Run deployment script:</p>
                            <code className="text-xs text-green-400 font-mono">
                                npm run deploy:auto
                            </code>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <a
                                href="https://sui.io/testnet-faucet"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                Get Testnet SUI
                                <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                                href="https://github.com/VincenzoImp/MeltyFi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                View Docs
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}
