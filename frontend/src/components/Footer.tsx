import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gov-navy text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-semibold text-white">BharatVote</span>
                                <p className="text-xs text-white/60">Government of India</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/60 max-w-xs leading-relaxed">
                            Secure, transparent, and verifiable
                            digital voting platform.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/register" className="text-white/60 hover:text-gov-saffron transition-colors">Register</Link></li>
                            <li><Link to="/vote" className="text-white/60 hover:text-gov-saffron transition-colors">Vote</Link></li>
                            <li><Link to="/verify" className="text-white/60 hover:text-gov-saffron transition-colors">Verify</Link></li>
                            <li><Link to="/results" className="text-white/60 hover:text-gov-saffron transition-colors">Results</Link></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Information</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-white/60 hover:text-gov-saffron transition-colors">About</a></li>
                            <li><a href="#" className="text-white/60 hover:text-gov-saffron transition-colors">Security</a></li>
                            <li><a href="#" className="text-white/60 hover:text-gov-saffron transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-white/60 hover:text-gov-saffron transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li>Toll Free: 1800-111-1950</li>
                            <li>support@bharatvote.gov.in</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        © 2024 Election Commission of India. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <a href="#" className="hover:text-gov-saffron transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gov-saffron transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gov-saffron transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gov-saffron" />
        </footer>
    );
};

export default Footer;
