import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Register', href: '/register' },
    { name: 'Vote', href: '/vote' },
    { name: 'Verify', href: '/verify' },
    { name: 'Results', href: '/results' },
    { name: 'Admin', href: '/admin' },
];

export const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (href: string) => location.pathname === href;

    return (
        <header className="bg-gov-navy sticky top-0 z-50">
            {/* Top accent line */}
            <div className="h-1 bg-gov-saffron" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Wordmark */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {/* Emblem */}
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                                {[...Array(24)].map((_, i) => (
                                    <line
                                        key={i}
                                        x1="12"
                                        y1="4"
                                        x2="12"
                                        y2="6"
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        transform={`rotate(${i * 15} 12 12)`}
                                    />
                                ))}
                            </svg>
                        </div>
                        <div>
                            <span className="font-semibold text-white text-lg tracking-tight">BharatVote</span>
                            <span className="hidden sm:block text-xs text-white/60">Government of India</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-gov-saffron focus:ring-offset-2 focus:ring-offset-gov-navy
                  ${isActive(item.href)
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }
                `}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10
                       focus:outline-none focus:ring-2 focus:ring-gov-saffron"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in" role="navigation" aria-label="Mobile navigation">
                        <nav className="flex flex-col gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                    px-4 py-3 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.href)
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                    aria-current={isActive(item.href) ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
