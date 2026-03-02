import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onEnter: () => void;
    isExiting: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, isExiting }) => {
    const [showContent, setShowContent] = useState(false);
    const [showChakra, setShowChakra] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Staggered reveal animations
        const timers = [
            setTimeout(() => setShowChakra(true), 400),
            setTimeout(() => setShowContent(true), 1200),
            setTimeout(() => setShowText(true), 2500),
            setTimeout(() => setShowButton(true), 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div
            className={`
        fixed inset-0 z-[100] overflow-hidden
        transition-all duration-1000 ease-out
        ${isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
      `}
            role="dialog"
            aria-label="Welcome to BharatVote"
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gov-navy via-gov-navy-light to-gov-navy">
                {/* Animated mesh gradient overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `
              radial-gradient(ellipse at 20% 20%, rgba(255, 153, 51, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(255, 153, 51, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)
            `,
                    }}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${8 + Math.random() * 4}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative h-full flex flex-col items-center justify-center px-6">
                {/* Animated Ashoka Chakra */}
                <div
                    className={`
            relative mb-10 transition-all duration-1000 ease-out
            ${showChakra ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
                >
                    {/* Outer glow rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border border-gov-saffron/20 animate-pulse-slow" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-gov-saffron/30"
                            style={{ animation: 'pulse 3s ease-in-out infinite 0.5s' }}
                        />
                    </div>

                    {/* Main Chakra SVG - Rotating */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 animate-spin-slow">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full"
                            aria-label="Ashoka Chakra"
                            role="img"
                        >
                            {/* Outer circle */}
                            <circle
                                cx="50" cy="50" r="46"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            {/* Inner hub */}
                            <circle cx="50" cy="50" r="12" fill="white" />

                            {/* 24 Spokes - thick and visible */}
                            {Array.from({ length: 24 }).map((_, i) => {
                                const angle = (i * 15) * (Math.PI / 180);
                                const x1 = 50 + 12 * Math.sin(angle);
                                const y1 = 50 - 12 * Math.cos(angle);
                                const x2 = 50 + 42 * Math.sin(angle);
                                const y2 = 50 - 42 * Math.cos(angle);
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Decorative dots at outer edge between spokes */}
                            {Array.from({ length: 24 }).map((_, i) => {
                                const angle = ((i * 15) + 7.5) * (Math.PI / 180);
                                const cx = 50 + 43 * Math.sin(angle);
                                const cy = 50 - 43 * Math.cos(angle);
                                return (
                                    <circle
                                        key={`dot-${i}`}
                                        cx={cx}
                                        cy={cy}
                                        r="2"
                                        fill="white"
                                        opacity="0.7"
                                    />
                                );
                            })}
                        </svg>
                    </div>

                    {/* National Motto */}
                    <p
                        className="mt-4 text-center font-semibold tracking-wider"
                        style={{
                            color: '#D4AF37',
                            textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
                        }}
                    >
                        <span className="text-lg md:text-xl">सत्यमेव जयते</span>
                        <br />
                        <span className="text-xs text-white/50 tracking-widest">SATYAMEVA JAYATE</span>
                    </p>
                </div>

                {/* Text content with staggered animation */}
                <div
                    className={`
            text-center transition-all duration-700 ease-out
            ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
                >
                    {/* Saffron accent line */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-gov-saffron" />
                        <div className="w-2 h-2 bg-gov-saffron rounded-full animate-pulse" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-gov-saffron" />
                    </div>

                    <p
                        className={`
              text-white/60 text-xs md:text-sm tracking-[0.3em] uppercase mb-4
              transition-all duration-500 delay-200
              ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
                    >
                        Election Commission of India
                    </p>

                    <h1
                        className={`
              text-4xl md:text-6xl font-bold text-white tracking-tight mb-3
              transition-all duration-500 delay-300
              ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
                        style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                    >
                        Bharat<span className="text-gov-saffron">Vote</span>
                    </h1>

                    <p
                        className={`
              text-white/50 text-sm md:text-base max-w-md mx-auto
              transition-all duration-500 delay-400
              ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
                    >
                        Secure • Transparent • Verifiable
                    </p>

                    {/* Feature tags */}
                    <div
                        className={`
              flex flex-wrap justify-center gap-3 mt-6
              transition-all duration-500 delay-500
              ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
                    >
                        {['Blockchain', 'AI Fraud Detection', 'Zero-Knowledge'].map((tag, i) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs text-white/60 border border-white/10 rounded-full backdrop-blur-sm"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Enter Button */}
                <div
                    className={`
            mt-12 transition-all duration-700 ease-out
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
                >
                    <button
                        onClick={onEnter}
                        className="
              group relative inline-flex items-center gap-3 
              px-10 py-4 rounded-full overflow-hidden
              bg-gov-saffron text-gov-navy font-semibold text-lg
              hover:shadow-[0_0_40px_rgba(255,153,51,0.4)]
              focus:outline-none focus:ring-2 focus:ring-gov-saffron focus:ring-offset-2 focus:ring-offset-gov-navy
              transition-all duration-300
              active:scale-[0.98]
            "
                        aria-label="Enter BharatVote application"
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        <span className="relative">Cast Your Vote</span>
                        <svg
                            className="relative w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>

                {/* Footer */}
                <div
                    className={`
            absolute bottom-8 left-0 right-0 text-center
            transition-all duration-500 delay-700
            ${showButton ? 'opacity-100' : 'opacity-0'}
          `}
                >
                    <p className="text-white/30 text-xs tracking-wider">
                        A Secure Digital Democracy Initiative
                    </p>
                </div>
            </div>

            {/* Noscript fallback */}
            <noscript>
                <div className="fixed inset-0 bg-gov-navy flex items-center justify-center">
                    <div className="text-center text-white">
                        <p className="text-lg">Loading...</p>
                        <p className="text-sm text-white/60 mt-2">Please enable JavaScript</p>
                    </div>
                </div>
            </noscript>
        </div>
    );
};

export default SplashScreen;
