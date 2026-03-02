import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Cpu, Eye, CheckCircle } from 'lucide-react';
import { Button, Card } from '../components';

const features = [
    {
        icon: Shield,
        title: 'Blockchain Security',
        desc: 'Immutable, tamper-proof vote recording with cryptographic verification',
    },
    {
        icon: Lock,
        title: 'Zero-Knowledge Proofs',
        desc: 'Verify eligibility without exposing personal identity',
    },
    {
        icon: Cpu,
        title: 'AI Fraud Detection',
        desc: 'Real-time anomaly monitoring using advanced algorithms',
    },
    {
        icon: Eye,
        title: 'Full Transparency',
        desc: 'Publicly verifiable results on distributed ledger',
    },
];

const steps = [
    { num: '01', title: 'Register', desc: 'Complete e-KYC identity verification' },
    { num: '02', title: 'Authenticate', desc: 'Multi-factor authentication' },
    { num: '03', title: 'Vote', desc: 'Cast your encrypted ballot' },
    { num: '04', title: 'Verify', desc: 'Confirm your vote on-chain' },
];

export const Home: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="bg-gov-navy relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div>
                            {/* Status badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white mb-6">
                                <span className="w-2 h-2 rounded-full bg-gov-saffron animate-pulse" />
                                Secure Decentralized Voting Platform
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                                The Future of
                                <br />
                                <span className="text-gov-saffron">Democratic Elections</span>
                            </h1>

                            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
                                BharatVote combines blockchain technology with AI-powered
                                fraud detection to deliver secure, transparent, and
                                verifiable digital voting for every citizen.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link to="/register">
                                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        Start Registration
                                    </Button>
                                </Link>
                                <Link to="/admin">
                                    <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-gov-navy">
                                        View Dashboard
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/60">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-gov-saffron" />
                                    End-to-end Encrypted
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-gov-saffron" />
                                    On-chain Verification
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-gov-saffron" />
                                    Open Source
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative w-80 h-80">
                                {/* Animated rings */}
                                <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
                                <div className="absolute inset-8 rounded-full border border-white/10" />
                                <div className="absolute inset-16 rounded-full border border-gov-saffron/30" />

                                {/* Center emblem */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-white">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                                            {[...Array(24)].map((_, i) => (
                                                <line
                                                    key={i}
                                                    x1="12" y1="3" x2="12" y2="5"
                                                    stroke="currentColor" strokeWidth="0.5"
                                                    transform={`rotate(${i * 15} 12 12)`}
                                                />
                                            ))}
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gov-navy">How It Works</h2>
                        <p className="mt-4 text-secondary max-w-2xl mx-auto">
                            A simple, secure process designed for every citizen
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={step.num} className="relative group">
                                <Card className="p-6 h-full text-center hover:shadow-md transition-shadow duration-300">
                                    <span className="text-5xl font-bold text-surface-subtle group-hover:text-gov-saffron/20 transition-colors">
                                        {step.num}
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold text-gov-navy">{step.title}</h3>
                                    <p className="mt-2 text-sm text-secondary">{step.desc}</p>
                                </Card>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border-light" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-surface-light">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gov-navy">Built for Trust</h2>
                        <p className="mt-4 text-secondary">Enterprise-grade security for national elections</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={feature.title} className="p-6 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-lg bg-gov-navy flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gov-navy">{feature.title}</h3>
                                    <p className="mt-2 text-sm text-secondary leading-relaxed">{feature.desc}</p>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gov-navy">Technology Stack</h2>
                    <p className="mt-4 text-secondary max-w-2xl mx-auto">
                        Our platform combines consortium blockchain, homomorphic encryption,
                        and real-time AI/ML anomaly detection.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {['Blockchain', 'ZK Proofs', 'e-KYC', 'IPFS', 'AI/ML', 'TLS 1.3', 'Smart Contracts'].map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 rounded-full bg-surface-subtle border border-border-light text-sm text-secondary hover:border-gov-navy/30 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gov-navy">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white">Ready to Vote?</h2>
                    <p className="mt-4 text-lg text-white/70">
                        Join millions of citizens embracing secure digital democracy
                    </p>
                    <div className="mt-8">
                        <Link to="/register">
                            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Register Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
