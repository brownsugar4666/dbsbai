import React, { useState, useEffect, useCallback } from 'react';
import {
    Shield, AlertTriangle, Activity, Users, Vote,
    RefreshCw, ExternalLink, TrendingUp, Cpu, Database, Lock, LogOut, Eye, EyeOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Card, CardHeader, Alert, Button, GeographicalAnomalies, Input } from '../components';
import { useElectionStore } from '../lib/store';
import { detectAnomalies, type AnomalyResult } from '../ai/anomalyDetector';
import { demoCandidates } from '../components/VoteCard';

// Admin password - in production this would be handled server-side
const ADMIN_PASSWORD = 'bharatvote2024';
const ADMIN_SESSION_KEY = 'bharatvote_admin_session';

interface VoteRecord {
    timestamp: number;
    candidateId: string;
}

interface FlaggedVote {
    voteId: string;
    reason: string;
    confidence: number;
}

// Password Login Component
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
            onLogin();
        } else {
            setError('Invalid password. Access denied.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gov-navy flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Card elevated className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gov-navy/10 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-gov-navy" />
                        </div>
                        <h1 className="text-2xl font-bold text-gov-navy">Admin Access</h1>
                        <p className="text-muted mt-2">Enter password to access the Election Monitor</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                leftIcon={<Lock className="w-4 h-4" />}
                                error={error}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-muted hover:text-gov-navy transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            leftIcon={<Lock className="w-4 h-4" />}
                        >
                            Access Dashboard
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-surface-subtle rounded-lg border border-border-light">
                        <p className="text-xs text-muted text-center">
                            <Lock className="w-3 h-3 inline mr-1" />
                            This is a restricted area. Unauthorized access is prohibited.
                        </p>
                    </div>
                </Card>

                <p className="text-center text-white/40 text-sm mt-6">
                    BharatVote Election Monitor
                </p>
            </div>
        </div>
    );
};

// Admin Dashboard Component
const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { votes } = useElectionStore();
    const [anomalyResults, setAnomalyResults] = useState<AnomalyResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [timeSeriesData, setTimeSeriesData] = useState<{ time: string; votes: number }[]>([]);

    const runAnalysis = useCallback(async () => {
        setIsAnalyzing(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        const results = detectAnomalies(votes);
        setAnomalyResults(results);

        const now = Date.now();
        const timeData = [];
        for (let i = 11; i >= 0; i--) {
            const hourAgo = now - i * 3600000;
            const votesInHour = votes.filter((v: VoteRecord) =>
                v.timestamp >= hourAgo && v.timestamp < hourAgo + 3600000
            ).length;
            timeData.push({
                time: new Date(hourAgo).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                votes: Math.max(0, votesInHour + Math.floor(Math.random() * 3)),
            });
        }
        setTimeSeriesData(timeData);
        setIsAnalyzing(false);
    }, [votes]);

    useEffect(() => {
        runAnalysis();
    }, [runAnalysis]);

    const stats = [
        { label: 'Total Votes', value: votes.length, icon: Vote },
        { label: 'Active Sessions', value: Math.max(1, Math.floor(Math.random() * 20) + 5), icon: Users },
        { label: 'Anomalies', value: anomalyResults?.flaggedVotes.length || 0, icon: AlertTriangle },
        { label: 'System Health', value: '98.5%', icon: Activity },
    ];

    const algorithmScores = anomalyResults ? [
        {
            name: 'Isolation Forest',
            score: (1 - anomalyResults.isolationForest.averageScore) * 100,
            status: anomalyResults.isolationForest.anomalyCount > 0 ? 'warning' : 'normal',
            detail: `${anomalyResults.isolationForest.anomalyCount} outliers`,
        },
        {
            name: 'LSTM Autoencoder',
            score: (1 - anomalyResults.lstmAutoencoder.reconstructionError) * 100,
            status: anomalyResults.lstmAutoencoder.spikeDetected ? 'critical' : 'normal',
            detail: anomalyResults.lstmAutoencoder.spikeDetected ? 'Spike detected' : 'Normal',
        },
        {
            name: 'KDE Analysis',
            score: anomalyResults.kde.densityScore * 100,
            status: anomalyResults.kde.unusualDistribution ? 'warning' : 'normal',
            detail: `Entropy: ${anomalyResults.kde.entropy.toFixed(2)}`,
        },
    ] : [];

    const voteDistribution = demoCandidates.map(c => ({
        name: c.name.split(' ')[0],
        votes: votes.filter((v: VoteRecord) => v.candidateId === c.id).length,
        color: c.color,
    }));

    return (
        <div className="min-h-screen bg-surface-light animate-fade-in">
            {/* Admin Header */}
            <div className="bg-gov-navy sticky top-[65px] z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-white">Election Monitor</h1>
                                <p className="text-sm text-white/60">AI Integrity Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-white/60">
                                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                                System Online
                            </div>
                            <Button
                                onClick={runAnalysis}
                                isLoading={isAnalyzing}
                                leftIcon={<RefreshCw className="w-4 h-4" />}
                                size="sm"
                            >
                                Refresh
                            </Button>
                            <Button
                                onClick={onLogout}
                                variant="secondary"
                                leftIcon={<LogOut className="w-4 h-4" />}
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted">{stat.label}</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gov-navy mt-1">{stat.value}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-surface-subtle flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-muted" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI Detection */}
                        <Card elevated padding="lg">
                            <CardHeader
                                title="Fraud Detection"
                                subtitle="Real-time AI/ML anomaly monitoring"
                                action={
                                    anomalyResults && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${anomalyResults.overallRisk === 'low' ? 'bg-green-50 text-green-700' :
                                            anomalyResults.overallRisk === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                            {anomalyResults.overallRisk.toUpperCase()} RISK
                                        </span>
                                    )
                                }
                            />

                            {isAnalyzing ? (
                                <div className="h-32 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-2 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-sm text-muted">Running analysis...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {algorithmScores.map((algo) => (
                                        <div key={algo.name} className="p-4 bg-surface-subtle rounded-lg border border-border-light">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gov-navy">{algo.name}</span>
                                                <Cpu className="w-4 h-4 text-muted" />
                                            </div>
                                            <div className="h-2 bg-border-light rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${algo.status === 'normal' ? 'bg-status-success' :
                                                        algo.status === 'warning' ? 'bg-status-warning' : 'bg-status-error'
                                                        }`}
                                                    style={{ width: `${Math.min(100, algo.score)}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted">{algo.detail}</span>
                                                <span className={`text-xs font-semibold ${algo.status === 'normal' ? 'text-status-success' :
                                                    algo.status === 'warning' ? 'text-status-warning' : 'text-status-error'
                                                    }`}>
                                                    {algo.score.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {anomalyResults && anomalyResults.overallRisk === 'low' && (
                                <Alert
                                    type="success"
                                    title="All systems normal"
                                    message="No significant anomalies detected in voting patterns."
                                    className="mt-6"
                                />
                            )}
                        </Card>

                        {/* Voting Activity */}
                        <Card elevated padding="lg">
                            <CardHeader title="Voting Activity" subtitle="Votes per hour (last 12 hours)" />
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeSeriesData}>
                                        <defs>
                                            <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0A1A2F" stopOpacity={0.15} />
                                                <stop offset="100%" stopColor="#0A1A2F" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#718096' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#718096' }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="votes" stroke="#0A1A2F" strokeWidth={2} fill="url(#colorVotes)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Vote Distribution */}
                        <Card elevated padding="lg">
                            <CardHeader title="Vote Distribution" subtitle="Votes per candidate" />
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={voteDistribution} barSize={36}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A5568' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#718096' }} />
                                        <Tooltip />
                                        <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                                            {voteDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Flagged Votes */}
                        <Card elevated padding="lg">
                            <CardHeader title="Flagged Votes" subtitle="Requires review" />
                            {anomalyResults && anomalyResults.flaggedVotes.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {anomalyResults.flaggedVotes.map((flag: FlaggedVote, index: number) => (
                                        <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gov-navy truncate">#{flag.voteId.slice(0, 12)}...</p>
                                                    <p className="text-xs text-muted mt-0.5">{flag.reason}</p>
                                                </div>
                                                <span className="px-2 py-1 text-xs font-semibold rounded bg-status-error text-white">
                                                    {(flag.confidence * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Shield className="w-10 h-10 mx-auto text-muted mb-2 opacity-40" />
                                    <p className="text-sm text-muted">No flagged votes</p>
                                </div>
                            )}
                        </Card>

                        {/* System Layers */}
                        <Card padding="lg">
                            <CardHeader title="System Layers" />
                            <div className="space-y-3">
                                {[
                                    { icon: Database, label: 'Blockchain Layer', status: 'Active' },
                                    { icon: Lock, label: 'ZKP Authentication', status: 'Active' },
                                    { icon: Cpu, label: 'AI/ML Layer', status: 'Running' },
                                    { icon: Activity, label: 'Monitoring', status: 'Live' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-muted" />
                                            <span className="text-sm text-gov-navy">{item.label}</span>
                                        </div>
                                        <span className="text-xs text-status-success font-medium">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card padding="lg">
                            <CardHeader title="Quick Actions" />
                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start" size="sm">
                                    <Database className="w-4 h-4 mr-2" />
                                    Export Audit Log
                                </Button>
                                <Button variant="secondary" className="w-full justify-start" size="sm">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Blockchain Explorer
                                </Button>
                                <Button variant="secondary" className="w-full justify-start" size="sm">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Generate Report
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Geographical Anomalies Section */}
                <GeographicalAnomalies />
            </div>
        </div>
    );
};

// Main Admin Component with Auth Gate
export const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check session on mount
    useEffect(() => {
        const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (session === 'authenticated') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
