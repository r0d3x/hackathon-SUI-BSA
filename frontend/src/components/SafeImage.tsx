'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Ticket } from 'lucide-react';

interface SafeImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    width?: number;
    height?: number;
    fallbackIcon?: React.ReactNode;
}

export default function SafeImage({ 
    src, 
    alt, 
    fill, 
    className, 
    width, 
    height,
    fallbackIcon 
}: SafeImageProps) {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // If image failed to load or is placeholder, show fallback
    if (imageError || src === '/placeholder-nft.svg' || !src) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 ${className || ''}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    {fallbackIcon || <Ticket className="w-8 h-8 text-white" />}
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className={`flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 ${className || ''}`}>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={width}
                height={height}
                className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onError={() => {
                    console.warn('Image failed to load:', src);
                    setImageError(true);
                    setIsLoading(false);
                }}
                onLoad={() => {
                    setIsLoading(false);
                }}
                unoptimized={src.startsWith('http') && !src.includes('localhost')} // Don't optimize external images
            />
        </>
    );
} 